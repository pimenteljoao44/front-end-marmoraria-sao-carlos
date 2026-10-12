import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { UserService } from 'src/app/services/user/user.service';
import { UsersDataTransferService } from 'src/app/shared/services/user/users-data-transfer.service';
import { UserEvent } from 'src/models/enums/user/UserEvent';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public userAction!: {
    event: EventAction;
    userList: Array<Usuario>;
  };

  niveisAcesso = [
    { label: 'Gerente', value: 0 },
    { label: 'Funcionário', value: 1 },
  ];

  public userForm!: FormGroup;
  public usersSelectedDatas!: Usuario;
  public funcionarios: Array<Funcionario> = [];
  public allFuncionarios: Funcionario[] = [];

  public addUserAction = UserEvent.CREATE_USER_EVENT;
  public editUserAction = UserEvent.EDIT_USER_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private ref: DynamicDialogConfig,
    private userDTO: UsersDataTransferService,
    private funcionarioService: FuncionarioService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userAction = this.ref.data;
    this.userForm = this.createForm();
    await this.loadAllFuncionarios();

    if (this.isEditAction()) {
      this.setupEditForm();
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      login: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      nivelAcesso: [null as number | null, Validators.required],
      funcionario: [null as Funcionario | null, Validators.required],
    });
  }

  private setupEditForm(): void {
    // Senha não é obrigatória na edição
    this.userForm.get('senha')?.clearValidators();
    this.userForm.get('senha')?.updateValueAndValidity();
    this.getUserSelectedDatas(this.userAction?.event?.id as number);
  }

  private isEditAction(): boolean {
    return this.userAction?.event?.action === this.editUserAction && !!this.userAction?.userList;
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  handleSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllAsTouched(this.userForm);
      this.showValidationWarning();
      return;
    }

    if (this.isEditAction()) {
      this.handleSubmitEditUser();
    } else {
      this.handleSubmitAddUser();
    }
  }

  private handleSubmitAddUser(): void {
    this.userService
      .create(this.userForm.value as Usuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.userForm.reset();
            this.showSuccessMessage(`O usuário ${response.nome} foi criado com sucesso!`);
          }
        },
        error: (err) => this.showErrorMessage('Erro ao criar usuário.', err),
      });
  }

  private handleSubmitEditUser(): void {
    if (!this.userAction.event.id) return;

    const formValue = this.userForm.value;
    const requestEditUser: Partial<Usuario> = {
      id: this.userAction.event.id,
      nome: formValue.nome as string,
      login: formValue.login as string,
      email: formValue.email as string,
      nivelAcesso: formValue.nivelAcesso as any,
      funcionario: formValue.funcionario as any,
    };

    if (formValue.senha) {
      requestEditUser.senha = formValue.senha as string;
    }

    this.userService
      .update(requestEditUser as Usuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.userForm.reset();
          this.showSuccessMessage('Usuário editado com sucesso!');
        },
        error: (err) => this.showErrorMessage('Erro ao editar usuário.', err),
      });
  }

  getUserSelectedDatas(user_id: number): void {
    const allUsers = this.userAction.userList;
    if (allUsers.length > 0) {
      const userFiltered = allUsers.find((element) => element?.id === user_id);

      if (userFiltered) {
        this.usersSelectedDatas = userFiltered;

        const selectedFuncionario = this.allFuncionarios.find(
          (f) => f.id === this.usersSelectedDatas.funcionario?.id
        );

        this.userForm.patchValue({
          nome: this.usersSelectedDatas.nome,
          login: this.usersSelectedDatas.login,
          senha: '',
          email: this.usersSelectedDatas.email,
          nivelAcesso: this.usersSelectedDatas.nivelAcesso,
          funcionario: selectedFuncionario || null,
        });
      }
    }
  }

  loadAllFuncionarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.funcionarioService
        .findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allFuncionarios = response;
            resolve();
          },
          error: (err) => {
            console.error('Erro ao carregar funcionários:', err);
            this.showErrorMessage('Não foi possível carregar a lista de funcionários.', err);
            reject(err);
          },
        });
    });
  }

  searchFuncionarios(event: any): void {
    const query = event.query.toLowerCase();
    this.funcionarios = this.allFuncionarios.filter((funcionario) =>
      funcionario.nome.toLowerCase().includes(query)
    );
  }

  private showValidationWarning(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Por favor, preencha todos os campos obrigatórios corretamente.',
      life: 3000,
    });
  }

  private showSuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: detail,
      life: 2000,
    });
  }

  private showErrorMessage(summary: string, err: any): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: err.error?.message || 'Ocorreu um erro inesperado.',
      life: 2000,
    });
    console.error(err);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
