import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home.component';
import { RouterModule } from '@angular/router';
import { DASBOARD_ROUTES } from './dashboard.routing';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from 'src/app/shared/shared.module';
import {ParcelasDashboardComponent} from "./page/parcelas-dashboard.component";
import {FinanceiroModule} from "../financeiro/financeiro.module";



@NgModule({
  declarations: [
    DashboardHomeComponent,
    ParcelasDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASBOARD_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule,
    SharedModule,
    FinanceiroModule
  ]
})
export class DashboardModule { }
