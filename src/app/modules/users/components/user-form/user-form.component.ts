import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { UsersDataTransferService } from 'src/app/shared/services/user/users-data-transfer.service';
import { UserEvent } from 'src/models/enums/user/UserEvent';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public userAction!:{
    event:EventAction,
    userList:Array<Usuario>
  };

  niveisAcesso = [
    { label: 'Gerente', value: 0 },
    { label: 'Funcionário', value: 1 },
  ];

 public nivelSelected:Array<{label:string,value:number}> = [];
 public usersSelectedDatas!:Usuario;
 public userDatas:Array<Usuario> = [];

  public addUserForm = this.formBuilder.group({
    nome:['',Validators.required],
    login:['',Validators.required],
    senha:['',Validators.required],
    email: ['',Validators.required],
    nivelAcesso:[null,Validators.required]
  });

  public editUserForm = this.formBuilder.group({
    nome:['',Validators.required],
    login:['',Validators.required],
    senha:['',Validators.required],
    email:['',Validators.required],
    nivelAcesso:[null,Validators.required]
  });

  public addUserAction = UserEvent.CREATE_USER_EVENT;
  public editUserAction = UserEvent.EDIT_USER_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private userService:UserService,
    private ref:DynamicDialogConfig,
    private userDTO:UsersDataTransferService
  ) {}

  ngOnInit(): void {
    this.userAction = this.ref.data;
    if (this.userAction?.event.action === this.editUserAction &&this.userAction?.userList){
      this.getUserSelectedDatas(this.userAction?.event?.id as number)
    }
  }

  handleSubmitAddUser():void {
   if (this.addUserForm.value && this.addUserForm.valid){
    this.userService
    .create(this.addUserForm.value as Usuario)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response) {
          this.addUserForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `O usuário ${response.nome} foi criado com sucesso!`,
            life: 2000,
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao criar Conta.`,
          life: 2000,
        });
        console.log(err);
      },
    });
   }
  }

  handleSubmitEditUser() {
    if(this.editUserForm?.value && this.editUserForm?.valid && this.userAction.event.id) {
      const requestEditProduct:Usuario = {
        id: this.userAction?.event?.id as number,
        nome: this.editUserForm?.value?.nome as string,
        login: this.editUserForm?.value?.login as string,
        senha: this.editUserForm?.value?.senha as string,
        email: this.editUserForm?.value?.email as string,
        nivelAcesso: this.editUserForm?.value.nivelAcesso,
        token:''
      };
        this.userService.update(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(response) => {
            if (response) {
              this.editUserForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `O usuário editado com sucesso!`,
                life: 2000,
              });
            }
          },error:(err) => {
            console.log(err)
            this.addUserForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao editar usuario`,
              life: 2000,
            });
          }
        })
    }
  }

  getUserSelectedDatas(user_id:number):void {
    const allUsers = this.userAction.userList;
    if (allUsers.length > 0) {
      const userFiltered = allUsers.filter((element) => element?.id === user_id);
      if (userFiltered) {
         this.usersSelectedDatas = userFiltered[0];
         this.editUserForm.setValue({
          nome: this.usersSelectedDatas?.nome,
          login: this.usersSelectedDatas?.login,
          senha: '',
          email: this.usersSelectedDatas?.email,
          nivelAcesso: this.usersSelectedDatas?.nivelAcesso
         })
      }
    }
  }

getUserDatas():void {
  this.userService.findAll()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next:(response) =>{
      if (response.length >0) {
       this.userDatas = response;
       this.userDatas && this.userDTO.setUsersDatas(this.userDatas);
      }
    }
  })
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
