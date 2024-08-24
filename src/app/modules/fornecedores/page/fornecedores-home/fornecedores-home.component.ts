import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FornecedoresDateTransferService } from 'src/app/shared/services/fornecedores/fornecedores-date-transfer.service';
import { FornecedorEvent } from 'src/models/enums/fornecedor/FornecedorEvent';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { FornecedoresFormComponent } from '../../components/fornecedores-form/fornecedores-form.component';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { FornecedoresViewComponent } from '../../components/fornecedores-view/fornecedores-view.component';

@Component({
  selector: 'app-fornecedores-home',
  templateUrl: './fornecedores-home.component.html',
  styleUrls: ['./fornecedores-home.component.scss']
})
export class FornecedoresHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public fornecedoresList: Array<Fornecedor> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private fornecedorService: FornecedorService,
    private fornecedorDtransferService: FornecedoresDateTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceFornecedoresDatas();
  }

  getServiceFornecedoresDatas() {
    const fornecedoresLoaded = this.fornecedorDtransferService.getFornecedoresDatas();
    if (fornecedoresLoaded.length > 0) {
      this.fornecedoresList = fornecedoresLoaded;
    } else {
      this.getAPIFornecedoresDatas();
    }
  }

  getAPIFornecedoresDatas() {
    this.fornecedorService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
            this.fornecedoresList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar Fornecedores',
            life: 2500,
          });
        },
      });
  }

  handleFornecedorAction(event: EventAction): void {
    if (event.action === FornecedorEvent.CREATE_FORNECEDOR_EVENT || event.action === FornecedorEvent.EDIT_FORNECEDOR_EVENT ) {
      this.ref = this.dialogService.open(FornecedoresFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          fornecedoresList: this.fornecedoresList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIFornecedoresDatas(),
      });
    } else {
      this.handleViewFornecedorAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteFornecedorAction(event: { for_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o fornecedor ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteClient(event?.for_id),
      });
    }
  }

  handleViewFornecedorAction(event: EventAction) {
    if (event) {
      this.fornecedorService.findById(event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(FornecedoresViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  fornecedor: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIFornecedoresDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteClient(for_id: number): void {
    if (for_id) {
      this.fornecedorService
        .delete(for_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIFornecedoresDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Fornecedor Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao excluir Fornecedor ${err.error.error}`,
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
