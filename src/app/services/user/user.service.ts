import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequest } from 'src/models/interfaces/User/AuthRequest';
import { Usuario } from 'src/models/interfaces/User/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.baseUrl;
  private JWT_TOKEN: string;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
    this.JWT_TOKEN = this.cookieService.get('USER_INFO');
  }

  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`,
      }),
    };
  }

  findAll(): Observable<Array<Usuario>> {
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
    return this.JWT_TOKEN ? true : false;
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
}
