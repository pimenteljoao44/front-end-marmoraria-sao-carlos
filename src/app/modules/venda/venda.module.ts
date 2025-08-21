import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';

import { VendaHomeComponent } from './page/venda-home/venda-home.component';
import { VendaFormComponent } from './components/venda-form/venda-form.component';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';

import {VendaTableComponent} from "./components/venda-table/venda-table.component";
import {VendaViewComponent} from "./components/venda-view/venda-view.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {VENDA_ROUTES} from "./venda.routing";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {ConfirmationService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {ProgressBarModule} from "primeng/progressbar";
import {VendaItensComponent} from "./components/venda-itens/venda-itens.component";
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    VendaHomeComponent,
    VendaFormComponent,
    VendaViewComponent,
    VendaItensComponent,
    VendaTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(VENDA_ROUTES),
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
    ProgressSpinnerModule,
    ToastModule,
    ProgressBarModule,
  ],
  providers: [DialogService, ConfirmationService, DatePipe,CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' } ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendaModule { }
