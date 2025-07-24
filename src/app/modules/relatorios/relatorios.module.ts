import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

// Components
import { VendasClientePeriodoComponent } from './components/vendas-cliente-periodo/vendas-cliente-periodo.component';
import { ContasPagarComponent } from './components/contas-pagar/contas-pagar.component';
import { ContasReceberComponent } from './components/contas-receber/contas-receber.component';
import { ComprasFornecedorPeriodoComponent } from './components/compras-fornecedor-periodo/compras-fornecedor-periodo.component';

// Routing
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    VendasClientePeriodoComponent,
    ContasPagarComponent,
    ContasReceberComponent,
    ComprasFornecedorPeriodoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RelatoriosRoutingModule,
    SharedModule,

    // PrimeNG
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    SharedModule
  ]
})
export class RelatoriosModule { }

