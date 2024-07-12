import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GrupoHomeComponent } from './page/grupo-home/grupo-home.component';
import { GrupoTableComponent } from './components/grupo-table/grupo-table.component';
import { GrupoViewComponent } from './components/grupo-view/grupo-view.component';
import { GrupoFormComponent } from './components/grupo-form/grupo-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GRUPO_ROUTES } from './grupo.routing';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [
    GrupoHomeComponent,
    GrupoFormComponent,
    GrupoTableComponent,
    GrupoViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(GRUPO_ROUTES),
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
    CheckboxModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers: [DialogService, ConfirmationService, DatePipe],
})
export class GruposModule { }
