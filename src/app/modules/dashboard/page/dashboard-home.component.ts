import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ProdutoDataTransferService } from 'src/app/shared/services/produto/produto-data-transfer.service';
import { OrdemServicoService } from 'src/app/services/os/ordem-de-servico.service';
import { VendaService } from 'src/app/services/venda/venda.service';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  isLoading: boolean = false;
  sidebarVisible = false;

  public produtosList: Array<Produto> = [];
  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  public kpis = {
    totalClientes: 0,
    totalVendas: 0,
    totalFuncionarios: 1,
    faturamentoMensal: 0,
    ticketMedio: 0,
    tempoMedioOS: 0,
    satisfacaoCliente: 0,
    giroEstoque: 0,
    valorTotalEstoque: 0,
    ordensServico: {
      total: 0,
      pendentes: 0,
      emAndamento: 0,
      concluidas: 0,
      atrasadas: 0
    },
    produtos: {
      total: 0,
      estoqueMinimo: 0,
      semEstoque: 0
    }
  };

  public osStatusChartData!: ChartData;
  public osStatusChartOptions!: ChartOptions;
  public vendasMensaisChartData!: ChartData;
  public vendasMensaisChartOptions!: ChartOptions;
  public produtosMaisVendidosChartData!: ChartData;
  public produtosMaisVendidosChartOptions!: ChartOptions;

  constructor(
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private produtoDTO: ProdutoDataTransferService,
    private ordemServicoService: OrdemServicoService,
    private vendaService: VendaService,
    private clientesService: ClientesService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  carregarDadosDashboard(): void {
    this.isLoading = true;

    forkJoin({
      produtos: this.produtoService.findAll(),
      ordensServico: this.ordemServicoService.listarTodas(),
      vendas: this.vendaService.findAll(),
      clientes: this.clientesService.findAll(),
      estatisticasOS: this.ordemServicoService.obterEstatisticas()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (dados) => {
        this.processarDados(dados);
        this.configurarGraficos();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados do dashboard',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  private processarDados(dados: any): void {
    this.produtosList = dados.produtos || [];
    this.kpis.produtos.total = this.produtosList.length;
    this.kpis.produtos.estoqueMinimo = this.produtosList.filter(p => p.estoque <= 5).length;
    this.kpis.produtos.semEstoque = this.produtosList.filter(p => p.estoque === 0).length;
    this.kpis.valorTotalEstoque = this.produtosList.reduce((total, p) => total + (p.preco * p.estoque), 0);

    this.kpis.totalClientes = dados.clientes?.length || 0;

    const vendas = dados.vendas || [];
    this.kpis.totalVendas = vendas.length;
    this.kpis.faturamentoMensal = this.calcularFaturamentoMensal(vendas);
    this.kpis.ticketMedio = vendas.length > 0 ? this.kpis.faturamentoMensal / vendas.length : 0;

    const ordensServico = dados.ordensServico || [];
    this.kpis.ordensServico.total = ordensServico.length;
    this.kpis.ordensServico.pendentes = ordensServico.filter((os: any) => os.status === 'PENDENTE').length;
    this.kpis.ordensServico.emAndamento = ordensServico.filter((os: any) => os.status === 'EM_ANDAMENTO').length;
    this.kpis.ordensServico.concluidas = ordensServico.filter((os: any) => os.status === 'CONCLUIDA').length;
    this.kpis.ordensServico.atrasadas = this.calcularOSAtrasadas(ordensServico);

    this.kpis.tempoMedioOS = this.calcularTempoMedioOS(ordensServico);
    this.kpis.giroEstoque = this.calcularGiroEstoque(vendas);

    // Disparar notificações dinâmicas
    this.verificarAlertas();
  }

  private calcularTempoMedioOS(ordensServico: any[]): number {
    const osConcluidas = ordensServico.filter(os => os.status === 'CONCLUIDA' && os.dataInicio && os.dataConclusao);
    if (osConcluidas.length === 0) return 0;

    const totalDias = osConcluidas.reduce((total, os) => {
      const inicio = new Date(os.dataInicio);
      const fim = new Date(os.dataConclusao);
      const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      return total + dias;
    }, 0);

    return Math.round(totalDias / osConcluidas.length);
  }

  private calcularGiroEstoque(vendas: any[]): number {
    if (this.kpis.valorTotalEstoque === 0) return 0;
    const custoVendas = vendas.reduce((total, venda) => total + (venda.valorTotal || 0), 0);
    return Number((custoVendas / this.kpis.valorTotalEstoque).toFixed(2));
  }

  private verificarAlertas(): void {
    // Usar o novo serviço de notificações
    this.notificationService.showStockAlert(
      this.kpis.produtos.semEstoque,
      this.kpis.produtos.estoqueMinimo
    );

    this.notificationService.showOrderServiceAlert(this.kpis.ordensServico.atrasadas);

    const osAtivas = this.kpis.ordensServico.pendentes + this.kpis.ordensServico.emAndamento;
    this.notificationService.showProductivityAlert(osAtivas);
  }

  private calcularFaturamentoMensal(vendas: any[]): number {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    return vendas
      .filter(venda => {
        const dataVenda = new Date(venda.dataVenda);
        return dataVenda.getMonth() === mesAtual && dataVenda.getFullYear() === anoAtual;
      })
      .reduce((total, venda) => total + (venda.valorTotal || 0), 0);
  }

  private calcularOSAtrasadas(ordensServico: any[]): number {
    const hoje = new Date();
    return ordensServico.filter(os => {
      if (!os.dataPrevistaConclusao || os.status === 'CONCLUIDA') return false;
      const dataPrevista = new Date(os.dataPrevistaConclusao);
      return dataPrevista < hoje;
    }).length;
  }

  private configurarGraficos(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#666';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#ddd';

    this.configurarGraficoEstoque(documentStyle, textColor, textColorSecondary, surfaceBorder);
    this.configurarGraficoStatusOS(documentStyle, textColor);
    this.configurarGraficoVendasMensais(documentStyle, textColor, textColorSecondary, surfaceBorder);
    this.configurarGraficoProdutosMaisVendidos(documentStyle, textColor, textColorSecondary, surfaceBorder);
  }

  private configurarGraficoEstoque(documentStyle: CSSStyleDeclaration, textColor: string, textColorSecondary: string, surfaceBorder: string): void {
    if (this.produtosList.length > 0) {
      // Mostrar apenas os 10 produtos com menor estoque
      const produtosOrdenados = [...this.produtosList]
        .sort((a, b) => a.estoque - b.estoque)
        .slice(0, 10);

      this.productsChartDatas = {
        labels: produtosOrdenados.map(p => p.nome),
        datasets: [{
          label: 'Estoque Atual',
          backgroundColor: produtosOrdenados.map(p =>
            p.estoque === 0 ? '#dc3545' :
              p.estoque <= 5 ? '#ffc107' : '#28a745'
          ),
          borderColor: '#fff',
          borderWidth: 2,
          data: produtosOrdenados.map(p => p.estoque)
        }]
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const produto = produtosOrdenados[context.dataIndex];
                return `${produto.nome}: ${produto.estoque} unidades`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              maxRotation: 45
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      };
    }
  }

  private configurarGraficoStatusOS(documentStyle: CSSStyleDeclaration, textColor: string): void {
    this.osStatusChartData = {
      labels: ['Pendentes', 'Em Andamento', 'Concluídas', 'Atrasadas'],
      datasets: [{
        data: [
          this.kpis.ordensServico.pendentes,
          this.kpis.ordensServico.emAndamento,
          this.kpis.ordensServico.concluidas,
          this.kpis.ordensServico.atrasadas
        ],
        backgroundColor: ['#ffc107', '#17a2b8', '#28a745', '#dc3545'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };

    this.osStatusChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20
          }
        }
      }
    };
  }

  private configurarGraficoVendasMensais(documentStyle: CSSStyleDeclaration, textColor: string, textColorSecondary: string, surfaceBorder: string): void {
    // Simular dados dos últimos 6 meses (em um cenário real, viria da API)
    const meses = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const vendas = [45000, 52000, 48000, 61000, 55000, this.kpis.faturamentoMensal];

    this.vendasMensaisChartData = {
      labels: meses,
      datasets: [{
        label: 'Faturamento (R$)',
        data: vendas,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36a2eb',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    };

    this.vendasMensaisChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: function(value: any) {
              return 'R$ ' + value.toLocaleString('pt-BR');
            }
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  private configurarGraficoProdutosMaisVendidos(documentStyle: CSSStyleDeclaration, textColor: string, textColorSecondary: string, surfaceBorder: string): void {
    // Simular dados dos produtos mais vendidos (em um cenário real, viria da API)
    const produtosMaisVendidos = this.produtosList.slice(0, 5);
    const vendas = [25, 18, 15, 12, 8]; // Simular vendas

    this.produtosMaisVendidosChartData = {
      labels: produtosMaisVendidos.map(p => p.nome),
      datasets: [{
        label: 'Vendas',
        data: vendas,
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };

    this.produtosMaisVendidosChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            usePointStyle: true
          }
        }
      }
    };
  }

  // Métodos utilitários
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getPercentualConclusaoOS(): number {
    if (this.kpis.ordensServico.total === 0) return 0;
    return Math.round((this.kpis.ordensServico.concluidas / this.kpis.ordensServico.total) * 100);
  }

  getPercentualProdutosSemEstoque(): number {
    if (this.kpis.produtos.total === 0) return 0;
    return Math.round((this.kpis.produtos.semEstoque / this.kpis.produtos.total) * 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly Math = Math;
}
