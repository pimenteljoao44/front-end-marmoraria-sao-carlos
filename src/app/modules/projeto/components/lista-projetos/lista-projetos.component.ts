import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import {ProjetoService} from "../../../../services/projeto/projeto.service";
import {Projeto} from "../../../../../models/interfaces/projeto/Projeto";
import {StatusProjeto} from "../../../../../models/enums/projeto/StatusProjeto";
import {TipoProjeto} from "../../../../../models/enums/projeto/TipoProjeto";

@Component({
  selector: 'app-lista-projetos',
  templateUrl: './lista-projetos.component.html',
  styleUrls: ['./lista-projetos.component.scss']
})
export class ListaProjetosComponent implements OnInit {
  projetos: Projeto[] = [];
  loading = false;

  // Pagination
  totalRecords = 0;
  rows = 10;
  first = 0;

  // Filtros
  filtros = {
    nome: '',
    status: null,
    tipoProjeto: null,
    clienteId: null
  };

  // Options
  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Orçamento', value: StatusProjeto.ORCAMENTO },
    { label: 'Aprovado', value: StatusProjeto.APROVADO },
    { label: 'Em Produção', value: StatusProjeto.EM_PRODUCAO },
    { label: 'Pronto', value: StatusProjeto.PRONTO },
    { label: 'Entregue', value: StatusProjeto.ENTREGUE },
    { label: 'Cancelado', value: StatusProjeto.CANCELADO }
  ];

  tipoProjetoOptions = [
    { label: 'Todos', value: null },
    { label: 'Banheiro', value: TipoProjeto.BANHEIRO },
    { label: 'Cozinha', value: TipoProjeto.COZINHA },
    { label: 'Cuba', value: TipoProjeto.CUBA },
    { label: 'Bancada', value: TipoProjeto.BANCADA },
    { label: 'Outros', value: TipoProjeto.OUTROS }
  ];

  clientes: any[] = [];

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.carregarProjetos();
    this.carregarClientes();
  }

  carregarProjetos(event?: any) {
    this.loading = true;

    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : this.rows;

    this.projetoService.listarProjetos(page, size, this.filtros).subscribe({
      next: (response) => {
        this.projetos = response.content;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar projetos'
        });
        this.loading = false;
      }
    });
  }

  carregarClientes() {
    // Assumindo que existe um ClienteService já implementado
    // this.clienteService.listarTodos().subscribe(clientes => {
    //   this.clientes = [{ label: 'Todos', value: null }, ...clientes.map(c => ({ label: c.nome, value: c.id }))];
    // });

    // Mock data para demonstração
    this.clientes = [
      { label: 'Todos', value: null },
      { label: 'Cliente Exemplo 1', value: 1 },
      { label: 'Cliente Exemplo 2', value: 2 }
    ];
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
    // Implementar modal de visualização ou navegar para página de detalhes
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
        this.projetoService.excluirProjeto(projeto.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto excluído com sucesso'
            });
            this.carregarProjetos();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir projeto'
            });
          }
        });
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
        this.projetoService.gerarOrdemServico(projeto.id!).subscribe({
          next: (os) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Ordem de serviço ${os.numero} gerada com sucesso`
            });
            this.carregarProjetos(); // Recarregar para atualizar status
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao gerar ordem de serviço'
            });
          }
        });
      }
    });
  }

  atualizarStatus(projeto: Projeto, novoStatus: StatusProjeto) {
    this.projetoService.atualizarStatus(projeto.id!, novoStatus).subscribe({
      next: (projetoAtualizado) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status atualizado com sucesso'
        });
        this.carregarProjetos();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar status'
        });
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
      [StatusProjeto.CANCELADO]: 'danger'
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
      [StatusProjeto.CANCELADO]: 'Cancelado'
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
      [TipoProjeto.LAREIRA]: 'pi pi-sun',
      [TipoProjeto.OUTROS]: 'pi pi-ellipsis-h',
      [TipoProjeto.PIA]: 'pi pi-chair',
      [TipoProjeto.SOLEIRA]: 'pi pi-sun'
    };
    return icons[tipo] || 'pi pi-box';
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
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao gerar relatório'
        });
      }
    });
  }
}
