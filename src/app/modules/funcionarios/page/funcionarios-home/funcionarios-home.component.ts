import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { FuncionariosDataTransferService } from 'src/app/shared/services/funcionarios/funcionarios-data-transfer.service';
import { FuncionarioEvent } from 'src/models/enums/funcionario/FuncionarioEvent';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { FuncionariosFormComponent } from '../../components/funcionarios-form/funcionarios-form.component';
import { FuncionariosViewComponent } from '../../components/funcionarios-view/funcionarios-view.component';

@Component({
  selector: 'app-funcionarios-home',
  templateUrl: './funcionarios-home.component.html',
  styleUrls: ['./funcionarios-home.component.scss']
})
export class FuncionariosHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public funcionariosList: Array<Funcionario> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private funcionarioService:FuncionarioService,
    private funcionarioDtransferService:FuncionariosDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}


  ngOnInit(): void {
    this.getServiceFuncionariosDatas();
  }

  getServiceFuncionariosDatas() {
    const funcionariosLoaded = this.funcionarioDtransferService.getFuncionariosDatas();
    if (funcionariosLoaded.length > 0) {
      this.funcionariosList = funcionariosLoaded;
    } else {
      this.getAPIfuncionariosDatas();
    }
  }

  getAPIfuncionariosDatas() {
    this.funcionarioService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
            this.funcionariosList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar funcionarios',
            life: 2500,
          });
        },
      });
  }

  handleFuncionariotAction(event: EventAction): void {
    if (event.action === FuncionarioEvent.CREATE_FUNCIONARIO_EVENT || event.action === FuncionarioEvent.EDIT_FUNCIONARIO_EVENT ) {
      this.ref = this.dialogService.open(FuncionariosFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          funcionariosList: this.funcionariosList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIfuncionariosDatas(),
      });
    } else {
      this.handleViewFuncionarioAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteFuncionarioAction(event: { func_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o funcionario ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteFuncionario(event?.func_id),
      });
    }
  }

  handleViewFuncionarioAction(event: EventAction) {
    if (event) {
      this.funcionarioService.findById(event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(FuncionariosViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  funcionario: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIfuncionariosDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteFuncionario(func_id: number): void {
    if (func_id) {
      this.funcionarioService
        .delete(func_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIfuncionariosDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Funcionario Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao excluir funcionario ${err.error.error}`,
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
