import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './page/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home.routing';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {DashboardModule} from "../dashboard/dashboard.module";
import { WelcomeComponent } from './page/welcome/welcome.component'; // Importar WelcomeComponent

@NgModule({
  declarations: [HomeComponent, WelcomeComponent], // Adicionar WelcomeComponent aqui
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(HOME_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    SidebarModule,
    DashboardModule,
    //shared
    SharedModule
  ],
  providers:[
    CookieService,
    MessageService
  ]
})
export class HomeModule {}
