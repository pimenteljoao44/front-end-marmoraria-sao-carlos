import { CompraTableComponent } from './components/compra-table/compra-table/compra-table.component';
import { CompraViewComponent } from './components/compra-view/compra-view/compra-view.component';
import { CompraFormComponent } from './components/compra-form/compra-form/compra-form.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CompraHomeComponent } from './page/compra-home/compra-home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';

import { PanelModule } from 'primeng/panel';
import { COMPRA_ROUTES } from './compra.routing';
import {InstallmentConfigComponent} from "../financeiro/parcelas/installment-config.component";
import {CalendarModule} from "primeng/calendar";
import {CheckboxModule} from "primeng/checkbox";

@NgModule({
    declarations: [
        CompraHomeComponent,
        CompraFormComponent,
        CompraViewComponent,
        CompraTableComponent,
        InstallmentConfigComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(COMPRA_ROUTES),
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
    CalendarModule,
    CheckboxModule
  ],
  providers: [DialogService, ConfirmationService, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompraModule { }
