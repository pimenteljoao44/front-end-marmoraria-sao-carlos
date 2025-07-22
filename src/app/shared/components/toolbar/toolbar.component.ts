import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(private cookie:CookieService,private router:Router){}

  @Output() openSidebarEvent = new EventEmitter<void>();

  openSidebar(): void {
    this.openSidebarEvent.emit();
  }

  handleLogout():void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['']);
  }
}
