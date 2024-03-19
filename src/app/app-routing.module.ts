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
    path:'login',
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
