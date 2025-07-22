import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VendaHomeComponent } from './page/venda-home/venda-home.component';
import { VendaFormComponent } from './components/venda-form/venda-form.component';
import { VendaTableComponent } from './components/venda-table/venda-table.component';
import { VendaViewComponent } from './components/venda-view/venda-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VENDA_ROUTES } from './venda.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
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
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    VendaHomeComponent,
    VendaFormComponent,
    VendaTableComponent,
    VendaViewComponent
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
    AutoCompleteModule
  ],
  providers: [DialogService, ConfirmationService, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VendaModule { }
