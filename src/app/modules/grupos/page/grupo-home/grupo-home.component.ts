import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { GruposDataTransferService } from 'src/app/shared/services/grupos/grupos-data-transfer.service';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';
import { GrupoFormComponent } from '../../components/grupo-form/grupo-form.component';
import { GrupoViewComponent } from '../../components/grupo-view/grupo-view.component';
import { GrupoEvent } from 'src/models/enums/grupo/GrupoEvent';

@Component({
  selector: 'app-grupo-home',
  templateUrl: './grupo-home.component.html'
})
export class GrupoHomeComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public gruposList: Array<Grupo> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private grupoService:GruposService,
    private grupoDtransferService:GruposDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}


  ngOnInit(): void {
    this.getServiceGruposDatas();
  }

  getServiceGruposDatas() {
    const gruposLoaded = this.grupoDtransferService.getGruposDatas();
    if (gruposLoaded.length > 0) {
      this.gruposList = gruposLoaded;
    } else {
      this.getAPIgruposDatas();
    }
  }

  getAPIgruposDatas() {
    this.grupoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
            this.gruposList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar grupos',
            life: 2500,
          });
        },
      });
  }

  handleGrupotAction(event: EventAction): void {
    if (event.action === GrupoEvent.CREATE_GRUPO_EVENT|| event.action === GrupoEvent.EDIT_GRUPO_EVENT ) {
      this.ref = this.dialogService.open(GrupoFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          gruposList: this.gruposList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIgruposDatas(),
      });
    } else {
      this.handleViewGrupoAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteGrupoAction(event: { grupo_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o grupo ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteGrupo(event?.grupo_id),
      });
    }
  }

  handleViewGrupoAction(event: EventAction) {
    if (event) {
      this.grupoService.findById(event?.id as number)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(GrupoViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  grupo: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIgruposDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteGrupo(grupo_id: number): void {
    if (grupo_id) {
      this.grupoService
        .delete(grupo_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIgruposDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Grupo Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao excluir Grupo ${err.error.error}`,
              life: 3500,
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
