import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FornecedoresHomeComponent } from './page/fornecedores-home/fornecedores-home.component';
import { FornecedoresFormComponent } from './components/fornecedores-form/fornecedores-form.component';
import { FornecedoresTableComponent } from './components/fornecedores-table/fornecedores-table.component';
import { FornecedoresViewComponent } from './components/fornecedores-view/fornecedores-view.component';
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
import { ConfirmationService } from 'primeng/api';
import { FORNECEDORES_ROUTES } from './fornecedores.routing';
import {AutoCompleteModule} from "primeng/autocomplete";



@NgModule({
  declarations: [
    FornecedoresHomeComponent,
    FornecedoresFormComponent,
    FornecedoresTableComponent,
    FornecedoresViewComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(FORNECEDORES_ROUTES),
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
        AutoCompleteModule
    ],
  providers:[DialogService,ConfirmationService,DatePipe]
})
export class FornecedoresModule { }
