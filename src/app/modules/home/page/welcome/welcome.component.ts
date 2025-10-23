import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  sidebarVisible = false;
  constructor() { }

  ngOnInit(): void {
  }
  handleOpenSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
