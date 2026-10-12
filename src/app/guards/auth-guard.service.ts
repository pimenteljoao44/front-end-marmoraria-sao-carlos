import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

      if (!this.userService.isLogedIn()) {
        this.router.navigate(['']);
        return false;
      }

      const expectedRoles = route.data['expectedRoles'] as Array<string>;
      const userRole = this.userService.getNivelAcesso();


      // Se não houver roles esperados, qualquer usuário logado pode acessar
      if (!expectedRoles || expectedRoles.length === 0) {
        return true;
      }

      // Verifica se o papel do usuário está entre os papéis esperados
      if (userRole && expectedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }
}
