import { Component, OnInit } from '@angular/core';
import { ParcelaService, ParcelaDTO, ResumoParcelasDTO } from '../../../services/parcela.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-parcelas-dashboard',
  templateUrl: './parcelas-dashboard.component.html',
  styleUrls: ['./parcelas-dashboard.component.scss']
})
export class ParcelasDashboardComponent implements OnInit {
  resumo: ResumoParcelasDTO = {
    totalParcelas: 0,
    parcelasVencidas: 0,
    proximasVencer: 0,
    parcelasPagas: 0,
    parcelasPendentes: 0
  };
  
  parcelasVencidas: ParcelaDTO[] = [];
  proximasVencer: ParcelaDTO[] = [];
  loading = false;
  
  // Dados para gráficos
  statusChartData: any;
  statusChartOptions: any;
  
  vencimentoChartData: any;
  vencimentoChartOptions: any;

  constructor(
    private parcelaService: ParcelaService,
    private messageService: MessageService
  ) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    
    // Carregar resumo
    this.parcelaService.obterResumo().subscribe({
      next: (resumo) => {
        this.resumo = resumo;
        this.updateStatusChart();
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar resumo das parcelas'
        });
      }
    });
    
    // Carregar parcelas vencidas
    this.parcelaService.listarVencidas().subscribe({
      next: (parcelas) => {
        this.parcelasVencidas = parcelas.slice(0, 5); // Mostrar apenas as 5 primeiras
      },
      error: (error) => {
        console.error('Erro ao carregar parcelas vencidas:', error);
      }
    });
    
    // Carregar próximas a vencer (próximos 7 dias)
    this.parcelaService.listarProximasAVencer(7).subscribe({
      next: (parcelas) => {
        this.proximasVencer = parcelas.slice(0, 5); // Mostrar apenas as 5 primeiras
        this.updateVencimentoChart();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar próximas a vencer:', error);
        this.loading = false;
      }
    });
  }

  private initChartOptions(): void {
    this.statusChartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
    
    this.vencimentoChartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private updateStatusChart(): void {
    this.statusChartData = {
      labels: ['Pagas', 'Pendentes', 'Vencidas'],
      datasets: [{
        data: [
          this.resumo.parcelasPagas,
          this.resumo.parcelasPendentes - this.resumo.parcelasVencidas,
          this.resumo.parcelasVencidas
        ],
        backgroundColor: [
          '#28a745',
          '#ffc107',
          '#dc3545'
        ],
        borderColor: [
          '#1e7e34',
          '#e0a800',
          '#c82333'
        ],
        borderWidth: 2
      }]
    };
  }

  private updateVencimentoChart(): void {
    const hoje = new Date();
    const proximosDias = Array.from({ length: 7 }, (_, i) => {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      return data;
    });
    
    const labels = proximosDias.map(data => 
      data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    );
    
    const dados = proximosDias.map(data => {
      const dataStr = data.toISOString().split('T')[0];
      return this.proximasVencer.filter(parcela => 
        parcela.dataVencimento === dataStr
      ).length;
    });
    
    this.vencimentoChartData = {
      labels: labels,
      datasets: [{
        label: 'Parcelas a Vencer',
        data: dados,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true
      }]
    };
  }

  marcarComoPaga(parcela: ParcelaDTO): void {
    this.parcelaService.marcarComoPaga(parcela.id!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Parcela marcada como paga'
        });
        this.carregarDados(); // Recarregar dados
      },
      error: (error) => {
        console.error('Erro ao marcar parcela como paga:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao marcar parcela como paga'
        });
      }
    });
  }

  // Métodos de utilidade
  formatCurrency(value: number): string {
    return this.parcelaService.formatCurrency(value);
  }

  formatDate(date: string): string {
    return this.parcelaService.formatDate(date);
  }

  getDescricaoParcela(parcela: ParcelaDTO): string {
    return this.parcelaService.getDescricaoParcela(parcela);
  }

  getStatusSeverity(status: string): string {
    return this.parcelaService.getStatusSeverity(status);
  }

  getPercentualPagas(): number {
    if (this.resumo.totalParcelas === 0) return 0;
    return Math.round((this.resumo.parcelasPagas / this.resumo.totalParcelas) * 100);
  }

  getPercentualVencidas(): number {
    if (this.resumo.totalParcelas === 0) return 0;
    return Math.round((this.resumo.parcelasVencidas / this.resumo.totalParcelas) * 100);
  }

  getTotalValorVencidas(): number {
    return this.parcelasVencidas.reduce((total, parcela) => total + parcela.valorParcela, 0);
  }

  getTotalValorProximasVencer(): number {
    return this.proximasVencer.reduce((total, parcela) => total + parcela.valorParcela, 0);
  }
}

