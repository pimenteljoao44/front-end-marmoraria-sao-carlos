import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Input() sidebarVisible: boolean = false;
  favoritesOpen: boolean = false;
  reportsOpen:boolean = false;
  cadatrosOpen:boolean = false;
  expedientOpen:boolean = false;
  financeiroOpen:boolean = false;
  isGerente:boolean = false;

  constructor(private userService:UserService) {}

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      const loggedInUser = users[0];
      if (loggedInUser && loggedInUser.nivelAcesso === 'GERENTE') {
        this.isGerente = true;
      }
    });
  }

  toggleCadastros():void {
    this.cadatrosOpen =!this.cadatrosOpen;
  }

  toggleExpedient():void {
    this.expedientOpen = !this.expedientOpen;
  }

  toggleFinanceiro():void {
    this.financeiroOpen = !this.financeiroOpen;
  }

  toggleFavorites(): void {
      this.favoritesOpen = !this.favoritesOpen;
  }

  toggleReports(): void {
      this.reportsOpen = !this.reportsOpen;
  }
  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }
}
