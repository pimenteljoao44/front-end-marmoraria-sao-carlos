import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdemServicoService } from 'src/app/services/os/ordem-de-servico.service';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import {OsFormComponent} from "../components/os-form/os-form.component";
import {OsViewComponent} from "../components/os-view/os-view.component";


@Component({
  selector: 'app-os-home',
  templateUrl: './os-home.component.html',
  styleUrls: ['./os-home.component.scss']
})
export class OsHomeComponent implements OnInit {
  public sidebarVisible = false;
  public ossList: Array<any> = [];
  private ref!: DynamicDialogRef;

  constructor(
    private ordemServicoService: OrdemServicoService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.carregarOrdensServico();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }

  public handleOpenSidebar(): void {
    this.sidebarVisible = true;
  }

  public handleOSAction(event: EventAction): void {
    if (event) {
      switch (event.action) {
        case 'Nova Ordem de Serviço':
          this.novaOrdemServico();
          break;
        case 'Editar ordem de serviço':
          this.editarOrdemServico(event.id);
          break;
        case 'Visualizar ordem de serviço':
          this.visualizarOrdemServico(event.id);
          break;
        case 'Iniciar execução':
          this.iniciarOrdemServico(event.id);
          break;
        case 'Concluir ordem de serviço':
          this.concluirOrdemServico(event.id);
          break;
        default:
          break;
      }
    }
  }

  private carregarOrdensServico(): void {
    this.ordemServicoService.listarTodas().subscribe({
      next: (response) => {
        this.ossList = response;
      },
      error: (error) => {
        console.error('Erro ao carregar ordens de serviço:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar ordens de serviço'
        });
      }
    });
  }

  private novaOrdemServico(): void {
    this.ref = this.dialogService.open(OsFormComponent, {
      header: 'Nova Ordem de Serviço',
      width: '90%',
      height: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((ordemServico: any) => {
      if (ordemServico) {
        this.carregarOrdensServico();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ordem de serviço criada com sucesso!'
        });
      }
    });
  }

  private editarOrdemServico(id: number | undefined): void {
    if (id === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'ID da ordem de serviço não informado'
      });
      return;
    }

    this.ordemServicoService.buscarPorId(id).subscribe({
      next: (ordemServico) => {
        this.ref = this.dialogService.open(OsFormComponent, {
          header: `Editar Ordem de Serviço - ${ordemServico.numero}`,
          width: '90%',
          height: '90%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data: { ordemServico }
        });

        this.ref.onClose.subscribe((ordemServicoAtualizada: any) => {
          if (ordemServicoAtualizada) {
            this.carregarOrdensServico();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ordem de serviço atualizada com sucesso!'
            });
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar ordem de serviço:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar ordem de serviço'
        });
      }
    });
  }

  private visualizarOrdemServico(id: number | undefined): void {
    if (id === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'ID da ordem de serviço não informado'
      });
      return;
    }

    this.ordemServicoService.buscarPorId(id).subscribe({
      next: (ordemServico) => {
        this.ref = this.dialogService.open(OsViewComponent, {
          header: `Ordem de Serviço - ${ordemServico.numero}`,
          width: '90%',
          height: '90%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data: { ordemServico }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar ordem de serviço:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar ordem de serviço'
        });
      }
    });
  }

  private iniciarOrdemServico(id: number | undefined): void {
    if (id === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'ID da ordem de serviço não informado'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Deseja iniciar a execução desta ordem de serviço?',
      header: 'Confirmar Início',
      icon: 'pi pi-play-circle',
      acceptLabel: 'Sim, Iniciar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ordemServicoService.iniciar(id).subscribe({
          next: () => {
            this.carregarOrdensServico();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ordem de serviço iniciada com sucesso!'
            });
          },
          error: (error) => {
            console.error('Erro ao iniciar ordem de serviço:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao iniciar ordem de serviço'
            });
          }
        });
      }
    });
  }


  private concluirOrdemServico(id: number | undefined): void {
    if (id === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'ID da ordem de serviço não informado'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Deseja concluir esta ordem de serviço?',
      header: 'Confirmar Conclusão',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, Concluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.ordemServicoService.concluir(id).subscribe({
          next: () => {
            this.carregarOrdensServico();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ordem de serviço concluída com sucesso!'
            });
          },
          error: (error) => {
            console.error('Erro ao concluir ordem de serviço:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao concluir ordem de serviço'
            });
          }
        });
      }
    });
  }
}

