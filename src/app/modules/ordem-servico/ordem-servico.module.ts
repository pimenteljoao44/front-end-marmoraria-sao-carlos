import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService } from 'primeng/api';

// Components
import { OsListComponent } from './components/os-list/os-list.component';
import { OsFormComponent } from './components/os-form/os-form.component';
import { OsViewComponent } from './components/os-view/os-view.component';

// Routing
import { ORDEM_SERVICO_ROUTES } from './ordem-servico.routing';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';
import {OsHomeComponent} from "./page/os-home.component";

@NgModule({
  declarations: [
    OsHomeComponent,
    OsListComponent,
    OsFormComponent,
    OsViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ORDEM_SERVICO_ROUTES),
    SharedModule,
    HttpClientModule,

    // PrimeNG
    TableModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    TooltipModule,
    TagModule,
    ProgressBarModule,
    AutoCompleteModule
  ],
  providers: [
    DialogService,
    ConfirmationService,
    DatePipe
  ]
})
export class OrdemServicoModule { }

