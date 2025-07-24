import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendasClientePeriodoComponent } from './components/vendas-cliente-periodo/vendas-cliente-periodo.component';
import { ContasPagarComponent } from './components/contas-pagar/contas-pagar.component';
import { ContasReceberComponent } from './components/contas-receber/contas-receber.component';
import { ComprasFornecedorPeriodoComponent } from './components/compras-fornecedor-periodo/compras-fornecedor-periodo.component';

const routes: Routes = [
  {
    path: 'vendas-cliente-periodo',
    component: VendasClientePeriodoComponent
  },
  {
    path: 'contas-pagar',
    component: ContasPagarComponent
  },
  {
    path: 'contas-receber',
    component: ContasReceberComponent
  },
  {
    path: 'compras-fornecedor-periodo',
    component: ComprasFornecedorPeriodoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatoriosRoutingModule { }

