import { Component, Input, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Input() sidebarVisible: boolean = false;
  favoritesOpen: boolean = false;
  reportsOpen:boolean = false;
  cadatrosOpen:boolean = false;
  expedientOpen:boolean = false;

  toggleCadastros():void {
    this.cadatrosOpen =!this.cadatrosOpen;
  }

  toggleExpedient():void {
    this.expedientOpen = !this.expedientOpen;
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
