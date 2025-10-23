import { Routes } from "@angular/router";
import { HomeComponent } from "./page/home/home.component";
import { WelcomeComponent } from "./page/welcome/welcome.component"; // Importar WelcomeComponent

export const HOME_ROUTES:Routes = [
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'welcome',
    component:WelcomeComponent
  }
]
