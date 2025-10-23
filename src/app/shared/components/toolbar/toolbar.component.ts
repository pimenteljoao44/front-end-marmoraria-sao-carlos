import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {PrimeNGConfig} from "primeng/api";
import {UserService} from "../../../services/user/user.service";


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(private cookie:CookieService,private router:Router,private userService:UserService, private primeNgConfig: PrimeNGConfig){}

  @Output() openSidebarEvent = new EventEmitter<void>();

  openSidebar(): void {
    this.openSidebarEvent.emit();
  }

  handleLogout():void {
    this.userService.logout()
  }
}
