import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EstadoService } from 'src/app/services/estado/estado.service';
import { EstadoDataTransferService } from 'src/app/shared/services/estado/estado-data-transfer.service';
import { EstadoEvent } from 'src/models/enums/estado/EstadoEvent';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { EstadoFormComponent } from '../../components/estado-form/estado-form.component';
import { EstadoViewComponent } from '../../components/estado-view/estado-view.component';

@Component({
  selector: 'app-estado-home',
  templateUrl: './estado-home.component.html',
  styleUrls: ['./estado-home.component.scss']
})
export class EstadoHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public estadoList: Array<Estado> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private estadoService: EstadoService,
    private estadoDtransferService: EstadoDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceEstadosDatas();
  }

  getServiceEstadosDatas() {
    const estadosLoaded = this.estadoDtransferService.getEstadosDatas();
    if (estadosLoaded.length > 0) {
      this.estadoList = estadosLoaded;
    } else {
      this.getAPIEstadosDatas();
    }
  }

  getAPIEstadosDatas() {
    this.estadoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.estadoList = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar estados',
            life: 2500,
          });
        },
      });
  }

  handleEstadoAction(event: EventAction): void {
    if (event.action === EstadoEvent.CREATE_ESTADO_EVENT || event.action === EstadoEvent.EDIT_ESTADO_EVENT) {
      this.ref = this.dialogService.open(EstadoFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          estadoList: this.estadoList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIEstadosDatas(),
      });
    } else {
      this.handleViewEstadoAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteEstadoAction(event: { est_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o estado ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteEstado(event?.est_id),
      });
    }
  }

  handleViewEstadoAction(event: EventAction) {
    if (event) {
      this.estadoService.findById(event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(EstadoViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  estado: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIEstadosDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteEstado(est_id: number): void {
    if (est_id) {
      this.estadoService
        .delete(est_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIEstadosDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Estado Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir estado',
              life: 2500,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
