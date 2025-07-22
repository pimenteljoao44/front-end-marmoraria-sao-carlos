import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClientesHomeComponent } from './page/clientes-home/clientes-home.component';
import { ClientesTableComponent } from './components/clientes-table/clientes-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService} from 'primeng/api';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CLIENTES_ROUTES } from './clientes.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ClienteViewComponent } from './components/cliente-view/cliente-view.component';
import {AutoCompleteModule} from "primeng/autocomplete";



@NgModule({
  declarations: [
    ClientesHomeComponent,
    ClienteFormComponent,
    ClientesTableComponent,
    ClienteViewComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(CLIENTES_ROUTES),
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
export class ClientesModule { }
