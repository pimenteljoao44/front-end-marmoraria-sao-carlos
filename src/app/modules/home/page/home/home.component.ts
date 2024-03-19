import { Component, OnInit } from '@angular/core';
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
  private userList: Array<Usuario> = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private usersDtransfer: UsersDataTransferService
  ) {}

  ngOnInit(): void {
    this.getUsersDatas();
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

  handleOpenSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
