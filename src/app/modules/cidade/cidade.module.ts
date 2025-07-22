import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CidadeHomeComponent } from './page/cidade-home/cidade-home.component';
import { CidadeFormComponent } from './components/cidade-form/cidade-form.component';
import { CidadeTableComponent } from './components/cidade-table/cidade-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CIDADES_ROUTES } from './cidades.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
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
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CidadeViewComponent } from './components/cidade-view/cidade-view.component';



@NgModule({
  declarations: [
    CidadeHomeComponent,
    CidadeFormComponent,
    CidadeTableComponent,
    CidadeViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CIDADES_ROUTES),
    SharedModule,
    HttpClientModule,
    CardModule,
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
    TooltipModule
  ],
  providers:[DialogService,ConfirmationService,DatePipe]
})
export class CidadeModule { }
