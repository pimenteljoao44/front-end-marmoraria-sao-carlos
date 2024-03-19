import { ClientesDataTransferService } from './../../../../shared/services/clientes/clientes-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';

@Component({
  selector: 'app-clientes-home',
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss']
})
export class ClientesHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public clientesList: Array<Cliente> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private clienteService: ClientesService,
    private clientDtransferService: ClientesDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceClientesDatas();
  }

  getServiceClientesDatas() {
    const usersLoaded = this.clientDtransferService.getClientesDatas();
    if (usersLoaded.length > 0) {
      this.clientesList = usersLoaded;
    } else {
      this.getAPIClientesDatas();
    }
  }

  getAPIClientesDatas() {
    this.clienteService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
            this.clientesList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar clientes',
            life: 2500,
          });
        },
      });
  }

  handleClientAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ClienteFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          clientesList: this.clientesList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIClientesDatas(),
      });
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteClientAction(event: { cli_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o usuário ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteClient(event?.cli_id),
      });
    }
  }

  deleteClient(cli_id: number): void {
    if (cli_id) {
      this.clienteService
        .delete(cli_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIClientesDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir cliente',
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
