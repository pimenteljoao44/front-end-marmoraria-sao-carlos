import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequest } from 'src/models/interfaces/User/AuthRequest';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { jwtDecode } from 'jwt-decode';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.baseUrl;
  private JWT_TOKEN: string;

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private router:Router) {
    this.JWT_TOKEN = this.cookieService.get('USER_INFO');
  }

  private get httpOptions() {
    // Sempre usar o token atual do cookie
    const currentToken = this.cookieService.get('USER_INFO');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      }),
    };
  }

  findAll(): Observable<Array<Usuario>> {
    console.trace('UserService.findAll() called!'); // Adicionado console.trace
    return this.httpClient.get<Array<Usuario>>(
      `${this.baseUrl}/usuarios`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Usuario> {
    return this.httpClient.get<Usuario>(
      `${this.baseUrl}/usuarios/${id}`,
      this.httpOptions
    );
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(
      `${this.baseUrl}/usuarios`,
      usuario,
      this.httpOptions
    );
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(
      `${this.baseUrl}/usuarios/${usuario?.id}`,
      usuario,
      this.httpOptions
    );
  }

  delete(id: any): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/usuarios/${id}`,
      this.httpOptions
    );
  }

  isLogedIn(): boolean {
    const currentToken = this.cookieService.get('USER_INFO');
    this.JWT_TOKEN = currentToken;
    return currentToken ? true : false;
  }

  authUser(requstDatas: AuthRequest): Observable<Usuario> {
    return this.httpClient.post<Usuario>(
      `${this.baseUrl}/auth/login`,
      requstDatas
    );
  }

  passwordRecover(email: string): Observable<void> {
    return this.httpClient.post<void> (
      `${this.baseUrl}/auth/recovery`,
      { email}
    );
  }

  updatePassword(id: number, newPassword: string): Observable<void> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/usuarios/${id}/update-password`,
      newPassword,
      this.httpOptions
    );
  }

  // Novo método para obter o nível de acesso do token JWT
  getNivelAcesso(): string | null {
    const token = this.cookieService.get('USER_INFO');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.nivelAcesso || null;
      } catch (Error) {
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    const nivel = this.getNivelAcesso();
    return nivel === 'ADMIN' || nivel === 'GERENTE';
  }

  isUser(): boolean {
    return this.getNivelAcesso() === 'FUNCIONARIO';
  }

  logout(): void {
    this.httpClient.post(`${this.baseUrl}/auth/logout`, {}, this.httpOptions).subscribe({
      next: () => {
       // console.log('Logout bem-sucedido no servidor.');
      },
      error: (err) => {
       // console.error('Erro ao fazer logout no servidor, mas limpando o estado local:', err);
      },
      complete: () => {
        this.cookieService.delete('USER_INFO', '/'); // O '/' garante que o cookie seja deletado do path raiz
        this.router.navigate(['']);
      }
    });
  }
}

