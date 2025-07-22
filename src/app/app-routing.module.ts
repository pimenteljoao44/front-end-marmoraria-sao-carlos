import { GruposModule } from './modules/grupos/grupos.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/page/home/home.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'home',
    loadChildren:() => import('./modules/home/home.module').then((m)=>m.HomeModule),
    canActivate:[AuthGuardService]
  },
  {
    path:'usuarios',
    loadChildren:() => import('./modules/users/users.module').then((m)=>m.UsersModule),
    canActivate:[AuthGuardService]
  },
  {
    path:'clientes',
    loadChildren:() => import ('./modules/clientes/clientes.module').then((m)=> m.ClientesModule),
    canActivate:[AuthGuardService]
  },
  {
    path:'fornecedores',
    loadChildren: () => import ('./modules/fornecedores/fornecedores.module').then((m) => m.FornecedoresModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'funcionarios',
    loadChildren:() => import ('./modules/funcionarios/funcionarios.module').then((m) => m.FuncionariosModule),
    canActivate:[AuthGuardService]
  },
  {
    path:'cidade',
    loadChildren:() => import ('./modules/cidade/cidade.module').then((m) => m.CidadeModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'estado',
    loadChildren:() => import ('./modules/estado/estado.module').then((m) => m.EstadoModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'produtos',
    loadChildren:() => import ('./modules/produto/produto.module').then((m) => m.ProdutoModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'grupos',
    loadChildren:() => import ('./modules/grupos/grupos.module').then((m)=> m.GruposModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'dashboard',
    loadChildren: () => import ('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'compra',
    loadChildren:() => import ('./modules/compra/compra.module').then((m) => m.CompraModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'venda',
    loadChildren:() => import ('./modules/venda/venda.module').then((m) => m.VendaModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'relatorio',
    loadChildren:() => import ('./modules/relatorioVenda/relatorio-venda.module').then((m) => m.RelatorioModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'relatorio-compra',
    loadChildren:() => import ('./modules/relatorio-compra/relatorio-compra.module').then((m) => m.RelatorioCompraModule),
    canActivate: [AuthGuardService]
  },
  {
    path:'ordem-de-servico',
    loadChildren:() => import ('./modules/odem-de-servico/odem-de-servico.module').then((m) => m.OdemDeServicoModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'projetos',
    loadChildren: () => import('./modules/projeto/projeto.module').then((m) => m.ProjetosModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'financeiro',
    loadChildren: () => import('./modules/financeiro/financeiro.module').then((m) => m.FinanceiroModule),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
