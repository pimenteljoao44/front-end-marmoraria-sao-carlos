import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {DialogService} from 'primeng/dynamicdialog';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SidebarModule } from 'primeng/sidebar';



@NgModule({
  declarations: [
    ToolbarComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToolbarModule,
    CardModule,
    ButtonModule,
    SidebarModule
  ],
  exports:[ToolbarComponent,SideBarComponent],
  providers:[DialogService,CurrencyPipe]
})
export class SharedModule { }
