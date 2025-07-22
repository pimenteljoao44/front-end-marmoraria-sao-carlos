import {ContasAPagarComponent} from "./contas-a-pagar/contas-a-pagar.component";
import {ContasAReceberComponent} from "./contas-a-receber/contas-a-receber.component";
import {Routes} from "@angular/router";


export const FINANCEIRO_ROUTES: Routes = [
  {
    path: 'contas-a-pagar',
    component: ContasAPagarComponent
  },
  {
    path: 'contas-a-receber',
    component: ContasAReceberComponent
  }
];


