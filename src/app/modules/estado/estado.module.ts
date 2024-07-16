import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EstadoHomeComponent } from './page/estado-home/estado-home.component';
import { EstadoFormComponent } from './components/estado-form/estado-form.component';
import { EstadoTableComponent } from './components/estado-table/estado-table.component';
import { EstadoViewComponent } from './components/estado-view/estado-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { ConfirmationService } from 'primeng/api';
import { ESTADO_ROUTES } from './estado.routing';



@NgModule({
  declarations: [
    EstadoHomeComponent,
    EstadoFormComponent,
    EstadoTableComponent,
    EstadoViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ESTADO_ROUTES),
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
export class EstadoModule { }
