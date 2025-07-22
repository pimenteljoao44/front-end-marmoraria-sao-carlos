import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {FINANCEIRO_ROUTES} from './financeiro-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {VENDA_ROUTES} from "../venda/venda.routing";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {CardModule} from "primeng/card";
import {RadioButtonModule} from "primeng/radiobutton";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DialogService, DynamicDialogModule} from "primeng/dynamicdialog";
import {DropdownModule} from "primeng/dropdown";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TooltipModule} from "primeng/tooltip";
import {PanelModule} from "primeng/panel";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ConfirmationService} from "primeng/api";
import {ContasAPagarComponent} from "./contas-a-pagar/contas-a-pagar.component";
import {ContasAReceberComponent} from "./contas-a-receber/contas-a-receber.component";
import {ContaPagarFormComponent} from "./components/conta-pagar-form/conta-pagar-form.component";
import {ContaReceberFormComponent} from "./components/conta-receber-form/conta-receber-form.component";
import {TagModule} from "primeng/tag";
import {ParcelasDashboardComponent} from "../dashboard/page/parcelas-dashboard.component";
import {ChartModule} from "primeng/chart";


@NgModule({
  declarations: [
      ContasAPagarComponent,
      ContasAReceberComponent,
      ContaPagarFormComponent,
      ContaReceberFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(FINANCEIRO_ROUTES),
    SharedModule,
    HttpClientModule,
    CardModule,
    RadioButtonModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,
    PanelModule,
    AutoCompleteModule,
    TagModule,
    ChartModule
  ],
  providers: [DialogService, ConfirmationService, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FinanceiroModule { }
