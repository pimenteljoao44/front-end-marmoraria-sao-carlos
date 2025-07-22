import { Routes } from "@angular/router";
import {ProjetoHomeComponent} from "./page/venda-home/projeto-home.component";
import {ProjetoBuilderComponent} from "./components/projeto-builder/projeto-builder.component";

export const PROJETO_ROUTES:Routes = [
  {
    path:'',
    component: ProjetoHomeComponent
  },
  {
    path: 'novo',
    component: ProjetoBuilderComponent
  },
  {
    path: 'editar/:id',
    component: ProjetoBuilderComponent
  }
]
