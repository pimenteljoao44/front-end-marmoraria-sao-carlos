import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';
import { UsersDataTransferService } from 'src/app/shared/services/user/users-data-transfer.service';
import { Usuario } from 'src/models/interfaces/User/Usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sidebarVisible = false;
  showSwitchPasswordModal: boolean = false;
  private userList: Array<Usuario> = [];

  updatePasswordForm: FormGroup = new FormGroup({
    newPassword: new FormControl('',[Validators.required,]),
    confirmNewPassword: new FormControl('',[Validators.required])
  })

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private usersDtransfer: UsersDataTransferService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getUsersDatas();
    if (this.cookieService.check('PASSWORD_RECOVERED')) {
      this.showSwitchPasswordModal = true;
      this.cookieService.delete('PASSWORD_RECOVERED');
    }
  }

  getUsersDatas(): void {
    this.userService.findAll().subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.userList = response;
          this.usersDtransfer.setUsersDatas(this.userList);
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'Error',
          summary: 'Erro.',
          detail: 'Erro ao buscar produtos',
          life: 2500,
        });
      },
    });
  }

  onSubmitUpdatePasswordForm(): void {
    if (this.updatePasswordForm.valid && this.updatePasswordForm.value) {
      const newPassword = this.updatePasswordForm.value.newPassword;
      if (newPassword !== this.updatePasswordForm.value.confirmNewPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem',
          life: 2500,
        });
        return;
      }
      const userId = this.userList[0].id;
      this.userService.updatePassword(userId, newPassword).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Senha alterada com sucesso',
            life: 2500,
          });
          this.showSwitchPasswordModal = false;
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao alterar senha',
            life: 2500,
          });
        },
      });
    }
  }


  handleOpenSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
