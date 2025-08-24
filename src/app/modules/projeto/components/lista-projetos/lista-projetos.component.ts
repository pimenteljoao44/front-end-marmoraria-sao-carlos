import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ProjetoService} from "../../../../services/projeto/projeto.service";
import {Projeto} from "../../../../../models/interfaces/projeto/Projeto";
import {StatusProjeto} from "../../../../../models/enums/projeto/StatusProjeto";
import {TipoProjeto} from "../../../../../models/enums/projeto/TipoProjeto";
import {forkJoin, map, of} from "rxjs";
import {ClientesService} from "../../../../services/clientes/clientes.service";
import {ProdutoService} from "../../../../services/produto/produto.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-lista-projetos',
  templateUrl: './lista-projetos.component.html',
  styleUrls: ['./lista-projetos.component.scss']
})
export class ListaProjetosComponent implements OnInit {
  projetos: Projeto[] = [];
  private projetosDetalhesCarregados = new Set<number>();
  loading = false;
  totalRecords = 0;
  rows = 10;
  first = 0;
  private produtosCache: { [id: number]: any } = {};

  filtros = {
    nome: '',
    status: null as StatusProjeto | null,
    tipoProjeto: null as TipoProjeto | null,
    clienteId: null as number | null
  };

  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Orçamento', value: StatusProjeto.ORCAMENTO },
    { label: 'Aprovado', value: StatusProjeto.APROVADO },
    { label: 'Em Produção', value: StatusProjeto.EM_PRODUCAO },
    { label: 'Pronto', value: StatusProjeto.PRONTO },
    { label: 'Entregue', value: StatusProjeto.ENTREGUE },
    { label: 'Cancelado', value: StatusProjeto.CANCELADO },
    { label: 'Vendido', value: StatusProjeto.VENDIDO }
  ];

  tipoProjetoOptions = [
    { label: 'Todos', value: null },
    { label: 'Banheiro', value: TipoProjeto.BANHEIRO },
    { label: 'Cozinha', value: TipoProjeto.COZINHA },
    { label: 'Cuba', value: TipoProjeto.CUBA },
    { label: 'Bancada', value: TipoProjeto.BANCADA },
    { label: 'Escada', value: TipoProjeto.ESCADA },
    { label: 'Lareira', value: TipoProjeto.LAREIRA },
    { label: 'Pia', value: TipoProjeto.PIA },
    { label: 'Soleira', value: TipoProjeto.SOLEIRA },
    { label: 'Outros', value: TipoProjeto.OUTROS }
  ];

  clientes: any[] = []; // Assume it's an array of {id: number, nome: string}

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clienteService: ClientesService,
    private produtoService: ProdutoService
  ) { }

  ngOnInit() {
    this.carregarProjetos();
    this.loadAllClientes();
  }

  carregarProjetos(event?: any) {
    this.loading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : this.rows;

    const filtrosToSend = {
      ...this.filtros,
      clienteId: this.filtros.clienteId ? Number(this.filtros.clienteId) : null
    };

    this.projetoService.listarProjetos(page, size, filtrosToSend).subscribe({
      next: (response) => {
        this.projetos = response.content.map((projeto: Projeto) => ({
          ...projeto,
        }));
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar projetos'
        });
        this.loading = false;
      }
    });
  }

  onRowExpand(event: any) {
    const projeto: Projeto = event.data;

    if (projeto?.id !== undefined && projeto.id !== null && !this.projetosDetalhesCarregados.has(projeto.id)) {
      console.log(`Carregando detalhes para o projeto ID: ${projeto.id}`);

      this.projetoService.buscarProjetoPorId(projeto.id).subscribe({
        next: (projetoCompleto: Projeto) => {
          console.log('Detalhes carregados:', projetoCompleto);

          const index = this.projetos.findIndex(p => p.id === projetoCompleto.id);

          if (index !== -1) {
            this.projetos[index] = { ...this.projetos[index], ...projetoCompleto };
            this.projetosDetalhesCarregados.add(projetoCompleto.id as number);


            this.carregarDetalhesDosProdutos(index);
          }
        },
        error: (err) => {
          console.error(`Erro ao carregar detalhes do projeto ID ${projeto.id}:`, err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Falha ao carregar detalhes do projeto "${projeto.nome}".`
          });
        }
      });
    }
  }

  private carregarDetalhesDosProdutos(projetoIndex: number) {
    const projeto = this.projetos[projetoIndex];
    if (!projeto.itens || projeto.itens.length === 0) {
      return;
    }

    const requests$ = projeto.itens.map((item: any) => {
      const produtoId = item.produtoId;

      if (this.produtosCache[produtoId]) {
        return of(this.produtosCache[produtoId]).pipe(
          map(produto => ({ item, produto }))
        );
      } else {
        return this.produtoService.findById(produtoId).pipe(
          map(produto => {
            this.produtosCache[produtoId] = produto;
            return { item, produto };
          }),
          catchError(error => {
            console.error(`Erro ao carregar produto ID ${produtoId}:`, error);
            return of({ item, produto: null });
          })
        );
      }
    });

    forkJoin(requests$).subscribe({
      next: (resultados) => {
        const itensAtualizados = resultados.map(res => {
          const { item, produto } = res;
          return {
            ...item,
            produto: produto,
            produtoNome: produto ? produto.nome : 'Produto não encontrado'
          };
        });

        this.projetos[projetoIndex] = {
          ...this.projetos[projetoIndex],
          itens: itensAtualizados
        };
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes dos produtos:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar detalhes de alguns produtos.'
        });
      }
    });
  }

  loadAllClientes(): Promise<void> {
    return new Promise((resolve, reject) => {
      const subscription = this.clienteService.findAll().subscribe({
        next: (response) => {
          this.clientes = response;
          subscription.unsubscribe();
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar clientes:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar clientes.',
            life: 3000,
          });
          subscription.unsubscribe();
          reject(err);
        }
      });
    });
  }

  searchClientes(event: any) {
    const query = event.query.toLowerCase();
    this.clientes = this.clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(query)
    );
  }

  aplicarFiltros() {
    this.first = 0;
    this.carregarProjetos();
  }

  limparFiltros() {
    this.filtros = {
      nome: '',
      status: null,
      tipoProjeto: null,
      clienteId: null
    };
    this.aplicarFiltros();
  }

  novoProjeto() {
    this.router.navigate(['/projetos/novo']);
  }

  editarProjeto(projeto: Projeto) {
    this.router.navigate(['/projetos/editar', projeto.id]);
  }

  visualizarProjeto(projeto: Projeto) {
    console.log('Visualizar projeto:', projeto);
  }

  excluirProjeto(projeto: Projeto) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o projeto "${projeto.nome}"?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (projeto.id !== undefined && projeto.id !== null) {
          this.projetoService.excluirProjeto(projeto.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Projeto excluído com sucesso'
              });
              this.carregarProjetos();
            },
            error: (error) => {
              console.error('Erro ao excluir projeto:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir projeto'
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'ID do projeto não encontrado'
          });
        }
      }
    });
  }

  gerarOrdemServico(projeto: Projeto) {
    if (projeto.status !== StatusProjeto.ORCAMENTO && projeto.status !== StatusProjeto.APROVADO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Projeto deve estar em status "Orçamento" ou "Aprovado" para gerar O.S.'
      });
      return;
    }
    this.confirmationService.confirm({
      message: `Deseja gerar a ordem de serviço para o projeto "${projeto.nome}"?`,
      header: 'Gerar Ordem de Serviço',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (projeto.id !== undefined && projeto.id !== null) {
          this.projetoService.gerarOrdemServico(projeto.id).subscribe({
            next: (os) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Ordem de serviço ${os.numero} gerada com sucesso`
              });
              this.carregarProjetos();
            },
            error: (error) => {
              console.error('Erro ao gerar ordem de serviço:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao gerar ordem de serviço'
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'ID do projeto não encontrado'
          });
        }
      }
    });
  }

  getStatusSeverity(status: StatusProjeto): string {
    const severities: { [key in StatusProjeto]: string } = {
      [StatusProjeto.ORCAMENTO]: 'info',
      [StatusProjeto.APROVADO]: 'success',
      [StatusProjeto.EM_PRODUCAO]: 'warning',
      [StatusProjeto.PRONTO]: 'help',
      [StatusProjeto.ENTREGUE]: 'success',
      [StatusProjeto.CANCELADO]: 'danger',
      [StatusProjeto.VENDIDO]: 'succes'
    };
    return severities[status] || 'info';
  }

  getStatusLabel(status: StatusProjeto): string {
    const labels: { [key in StatusProjeto]: string } = {
      [StatusProjeto.ORCAMENTO]: 'Orçamento',
      [StatusProjeto.APROVADO]: 'Aprovado',
      [StatusProjeto.EM_PRODUCAO]: 'Em Produção',
      [StatusProjeto.PRONTO]: 'Pronto',
      [StatusProjeto.ENTREGUE]: 'Entregue',
      [StatusProjeto.CANCELADO]: 'Cancelado',
      [StatusProjeto.VENDIDO]: 'Vendido'
    };
    return labels[status] || status;
  }

  getTipoProjetoLabel(tipo: TipoProjeto): string {
    const labels: { [key in TipoProjeto]: string } = {
      [TipoProjeto.BANHEIRO]: 'Banheiro',
      [TipoProjeto.COZINHA]: 'Cozinha',
      [TipoProjeto.CUBA]: 'Cuba',
      [TipoProjeto.BANCADA]: 'Bancada',
      [TipoProjeto.ESCADA]: 'Escada',
      [TipoProjeto.LAREIRA]: 'Lareira',
      [TipoProjeto.OUTROS]: 'Outros',
      [TipoProjeto.PIA]: 'Pia',
      [TipoProjeto.SOLEIRA]: 'Soleira'
    };
    return labels[tipo] || tipo;
  }

  getTipoProjetoIcon(tipo: TipoProjeto): string {
    const icons: { [key in TipoProjeto]: string } = {
      [TipoProjeto.BANHEIRO]: 'pi pi-home',
      [TipoProjeto.COZINHA]: 'pi pi-bookmark',
      [TipoProjeto.CUBA]: 'pi pi-circle',
      [TipoProjeto.BANCADA]: 'pi pi-minus',
      [TipoProjeto.ESCADA]: 'pi pi-angle-up',
      [TipoProjeto.LAREIRA]: 'pi pi-sun', // Or pi pi-fire
      [TipoProjeto.OUTROS]: 'pi pi-ellipsis-h',
      [TipoProjeto.PIA]: 'pi pi-sink', // Or pi pi-cube
      [TipoProjeto.SOLEIRA]: 'pi pi-th-large' // Or pi pi-window-maximize
    };
    return icons[tipo] || 'pi pi-box';
  }

  aprovarProjeto(projeto: Projeto) {
    this.confirmationService.confirm({
      message: `Deseja aprovar o projeto "${projeto.nome}"?`,
      header: 'Confirmar Aprovação',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, Aprovar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Solicitar observações opcionais
        const observacoes = prompt('Observações sobre a aprovação (opcional):');

        const requestBody = observacoes ? { observacoes } : {};

        this.projetoService.aprovarProjeto(projeto.id!, requestBody).subscribe({
          next: (projetoAtualizado) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto aprovado com sucesso!'
            });

            // Atualizar o projeto na lista
            const index = this.projetos.findIndex(p => p.id === projeto.id);
            if (index !== -1) {
              this.projetos[index] = projetoAtualizado;
            }
          },
          error: (error) => {
            console.error('Erro ao aprovar projeto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.error?.message || 'Erro ao aprovar projeto'
            });
          }
        });
      }
    });
  }

  exportarRelatorio() {
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - 1); // Último mês
    const dataFim = new Date();
    this.projetoService.gerarRelatorioProjetosPorPeriodo(dataInicio, dataFim).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-projetos-${dataInicio.toISOString().split('T')[0]}-${dataFim.toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao gerar relatório:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao gerar relatório'
        });
      }
    });
  }

  getTotalMateriais(itens: any[]): number {
    if (!itens || itens.length === 0) return 0;

    return itens.reduce((total, item) => {
      const valor = Number(item.valorTotal) || 0;
      return total + valor;
    }, 0);
  }
}
