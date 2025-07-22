import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UsersDataTransferService } from 'src/app/shared/services/user/users-data-transfer.service';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users-home',
  templateUrl: './users-home.component.html',
  styleUrls: ['./users-home.component.scss'],
})
export class UsersHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public userList: Array<Usuario> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private usersService: UserService,
    private usersDtransferService: UsersDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceUsersDatas();
  }

  getServiceUsersDatas() {
    const usersLoaded = this.usersDtransferService.getUsersDatas();
    if (usersLoaded.length > 0) {
      this.userList = usersLoaded;
    } else {
      this.getAPIUsersDatas();
    }
  }

  getAPIUsersDatas() {
    this.usersService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.userList = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar usuarios',
            life: 2500,
          });
        },
      });
  }

  handleUserAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(UserFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          userList: this.userList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIUsersDatas(),
      });
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteUserAction(event: { user_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o usuário ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteUser(event?.user_id),
      });
    }
  }

  deleteUser(user_id: number): void {
    if (user_id) {
      this.usersService
        .delete(user_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuario Excluido com sucesso!',
              life: 2500,
            });
            this.getAPIUsersDatas();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao excluir funcionario ${err.error.error}`,
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
