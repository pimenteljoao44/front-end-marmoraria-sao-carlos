import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ParcelaService, ParcelaDTO } from '../../../services/parcela.service';

@Component({
  selector: 'app-parcelas-list',
  templateUrl: './parcelas-list.component.html',
  styleUrls: ['./parcelas-list.component.scss']
})
export class ParcelasListComponent implements OnInit {
  parcelas: ParcelaDTO[] = [];
  parcelasFiltradas: ParcelaDTO[] = [];
  loading = false;
  
  // Filtros
  filtroStatus = '';
  filtroTipo = '';
  filtroDataInicio = '';
  filtroDataFim = '';
  filtroVencidas = false;
  
  // Opções para dropdowns
  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Pago', value: 'PAGO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];
  
  tipoOptions = [
    { label: 'Todos', value: '' },
    { label: 'Contas a Pagar', value: 'PAGAR' },
    { label: 'Contas a Receber', value: 'RECEBER' }
  ];
  
  // Colunas da tabela
  cols = [
    { field: 'descricaoParcela', header: 'Parcela' },
    { field: 'valorParcela', header: 'Valor' },
    { field: 'dataVencimento', header: 'Vencimento' },
    { field: 'status', header: 'Status' },
    { field: 'nomeCliente', header: 'Cliente' },
    { field: 'nomeFornecedor', header: 'Fornecedor' },
    { field: 'dataPagamento', header: 'Pagamento' }
  ];

  constructor(
    private parcelaService: ParcelaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.carregarParcelas();
  }

  carregarParcelas(): void {
    this.loading = true;
    this.parcelaService.listarTodas().subscribe({
      next: (parcelas) => {
        this.parcelas = parcelas;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar parcelas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar parcelas'
        });
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.parcelasFiltradas = this.parcelas.filter(parcela => {
      // Filtro por status
      if (this.filtroStatus && parcela.status !== this.filtroStatus) {
        return false;
      }
      
      // Filtro por tipo (pagar/receber)
      if (this.filtroTipo) {
        if (this.filtroTipo === 'PAGAR' && !parcela.contaPagarId) {
          return false;
        }
        if (this.filtroTipo === 'RECEBER' && !parcela.contaReceberId) {
          return false;
        }
      }
      
      // Filtro por data de vencimento
      if (this.filtroDataInicio) {
        const dataInicio = new Date(this.filtroDataInicio);
        const dataVencimento = new Date(parcela.dataVencimento);
        if (dataVencimento < dataInicio) {
          return false;
        }
      }
      
      if (this.filtroDataFim) {
        const dataFim = new Date(this.filtroDataFim);
        const dataVencimento = new Date(parcela.dataVencimento);
        if (dataVencimento > dataFim) {
          return false;
        }
      }
      
      // Filtro por vencidas
      if (this.filtroVencidas && !this.parcelaService.isVencida(parcela)) {
        return false;
      }
      
      return true;
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  limparFiltros(): void {
    this.filtroStatus = '';
    this.filtroTipo = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.filtroVencidas = false;
    this.aplicarFiltros();
  }

  marcarComoPaga(parcela: ParcelaDTO): void {
    if (parcela.status === 'PAGO') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Parcela já está paga'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Confirma o pagamento da parcela ${this.parcelaService.getDescricaoParcela(parcela)}?`,
      header: 'Confirmar Pagamento',
      icon: 'pi pi-check-circle',
      accept: () => {
        this.parcelaService.marcarComoPaga(parcela.id!).subscribe({
          next: (parcelaAtualizada) => {
            const index = this.parcelas.findIndex(p => p.id === parcela.id);
            if (index !== -1) {
              this.parcelas[index] = parcelaAtualizada;
              this.aplicarFiltros();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Parcela marcada como paga'
            });
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
    });
  }

  cancelarParcela(parcela: ParcelaDTO): void {
    if (parcela.status === 'PAGO') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Não é possível cancelar uma parcela já paga'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Confirma o cancelamento da parcela ${this.parcelaService.getDescricaoParcela(parcela)}?`,
      header: 'Confirmar Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.parcelaService.cancelar(parcela.id!).subscribe({
          next: (parcelaAtualizada) => {
            const index = this.parcelas.findIndex(p => p.id === parcela.id);
            if (index !== -1) {
              this.parcelas[index] = parcelaAtualizada;
              this.aplicarFiltros();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Parcela cancelada'
            });
          },
          error: (error) => {
            console.error('Erro ao cancelar parcela:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao cancelar parcela'
            });
          }
        });
      }
    });
  }

  // Métodos de utilidade para o template
  getStatusSeverity(status: string): string {
    return this.parcelaService.getStatusSeverity(status);
  }

  getStatusLabel(status: string): string {
    return this.parcelaService.getStatusLabel(status);
  }

  formatCurrency(value: number): string {
    return this.parcelaService.formatCurrency(value);
  }

  formatDate(date: string): string {
    return this.parcelaService.formatDate(date);
  }

  getDescricaoParcela(parcela: ParcelaDTO): string {
    return this.parcelaService.getDescricaoParcela(parcela);
  }

  isVencida(parcela: ParcelaDTO): boolean {
    return this.parcelaService.isVencida(parcela);
  }

  getTipoConta(parcela: ParcelaDTO): string {
    if (parcela.contaPagarId) {
      return 'Conta a Pagar';
    } else if (parcela.contaReceberId) {
      return 'Conta a Receber';
    }
    return 'N/A';
  }

  getNomeRelacionado(parcela: ParcelaDTO): string {
    return parcela.nomeCliente || parcela.nomeFornecedor || 'N/A';
  }
}

