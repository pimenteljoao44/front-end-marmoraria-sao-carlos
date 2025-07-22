import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FuncionariosHomeComponent } from './page/funcionarios-home/funcionarios-home.component';
import { FuncionariosFormComponent } from './components/funcionarios-form/funcionarios-form.component';
import { FuncionariosTableComponent } from './components/funcionarios-table/funcionarios-table.component';
import { FuncionariosViewComponent } from './components/funcionarios-view/funcionarios-view.component';
import { ConfirmationService} from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { FUNCIONARIOS_ROUTES } from './funcionarios.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import {AutoCompleteModule} from "primeng/autocomplete";



@NgModule({
  declarations: [
    FuncionariosHomeComponent,
    FuncionariosFormComponent,
    FuncionariosTableComponent,
    FuncionariosViewComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(FUNCIONARIOS_ROUTES),
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
  providers: [DialogService,ConfirmationService,DatePipe]
})
export class FuncionariosModule { }
