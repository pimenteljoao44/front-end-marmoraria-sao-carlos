import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Components
import { CriarProjetoComponent } from "./components/criar-projeto/criar-projeto.component";
import { ProjetoBuilderComponent } from "./components/projeto-builder/projeto-builder.component";
import { ProjetoHomeComponent } from "./page/venda-home/projeto-home.component";

// Pipes
import { TruncatePipe } from "../../pipes/truncate.pipe";
import {ToolbarComponent} from "../../shared/components/toolbar/toolbar.component";
import {SideBarComponent} from "../../shared/components/side-bar/side-bar.component";
import {SharedModule} from "../../shared/shared.module";
import { RouterModule } from '@angular/router';
import { PROJETO_ROUTES } from './projeto.routing';
import {MessagesModule} from "primeng/messages";
import {CardModule} from "primeng/card";
import {InputNumberModule} from "primeng/inputnumber";
import {ProgressBarModule} from "primeng/progressbar";
import {ListaProjetosComponent} from "./components/lista-projetos/lista-projetos.component";
import {TableModule} from "primeng/table";
import {PanelModule} from "primeng/panel";
import {CalendarModule} from "primeng/calendar";
import {MultiSelectModule} from "primeng/multiselect";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";
import {BadgeModule} from "primeng/badge";
import {ProjetoService} from "../../services/projeto/projeto.service";

@NgModule({
  declarations: [
    CriarProjetoComponent,
    ProjetoBuilderComponent,
    ListaProjetosComponent,
    ProjetoHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PROJETO_ROUTES),

    // PrimeNG
    TableModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CardModule,
    PanelModule,
    InputNumberModule,
    CalendarModule,
    MultiSelectModule,
    TabViewModule,
    FieldsetModule,
    DividerModule,
    ProgressBarModule,
    ChipModule,
    BadgeModule
  ],
  providers: [
    ProjetoService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ProjetosModule { }
