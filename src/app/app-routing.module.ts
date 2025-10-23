import { GruposModule } from './modules/grupos/grupos.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/page/home/home.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'home',
    loadChildren:() => import('./modules/home/home.module').then((m)=>m.HomeModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'usuarios',
    loadChildren:() => import('./modules/users/users.module').then((m)=>m.UsersModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'clientes',
    loadChildren:() => import ('./modules/clientes/clientes.module').then((m)=> m.ClientesModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'fornecedores',
    loadChildren: () => import ('./modules/fornecedores/fornecedores.module').then((m) => m.FornecedoresModule),
    canActivate: [AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'funcionarios',
    loadChildren:() => import ('./modules/funcionarios/funcionarios.module').then((m) => m.FuncionariosModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'cidade',
    loadChildren:() => import ('./modules/cidade/cidade.module').then((m) => m.CidadeModule),
    canActivate: [AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'estado',
    loadChildren:() => import ('./modules/estado/estado.module').then((m) => m.EstadoModule),
    canActivate: [AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'produtos',
    loadChildren:() => import ('./modules/produto/produto.module').then((m) => m.ProdutoModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'grupos',
    loadChildren:() => import ('./modules/grupos/grupos.module').then((m)=> m.GruposModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path:'dashboard',
    loadChildren: () => import ('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'compra',
    loadChildren:() => import ('./modules/compra/compra.module').then((m) => m.CompraModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'venda',
    loadChildren:() => import ('./modules/venda/venda.module').then((m) => m.VendaModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./modules/relatorios/relatorios.module').then((m) => m.RelatoriosModule),
    canActivate: [AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'relatorio-venda',
    loadChildren:() => import ('./modules/relatorioVenda/relatorio-venda.module').then((m) => m.RelatorioModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path:'relatorio-compra',
    loadChildren:() => import ('./modules/relatorio-compra/relatorio-compra.module').then((m) => m.RelatorioCompraModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE'] }
  },
  {
    path: 'projetos',
    loadChildren: () => import('./modules/projeto/projeto.module').then((m) => m.ProjetosModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path: 'financeiro',
    loadChildren: () => import('./modules/financeiro/financeiro.module').then((m) => m.FinanceiroModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path: 'ordem-servico',
    loadChildren: () => import('./modules/ordem-servico/ordem-servico.module').then((m) => m.OrdemServicoModule),
    canActivate:[AuthGuardService],
    data: { expectedRoles: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] }
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
