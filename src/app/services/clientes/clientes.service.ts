import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  baseUrl = environment.baseUrl;
  private JWT_TOKEN: string;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
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

  findAll(): Observable<Array<Cliente>> {
    return this.httpClient.get<Array<Cliente>>(
      `${this.baseUrl}/clientes`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/clientes/${id}`, this.httpOptions);
}

create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(`${this.baseUrl}/clientes`, cliente, this.httpOptions);
}

update(cliente: Cliente): Observable<Cliente> {
  return this.httpClient.put<Cliente>(
    `${this.baseUrl}/clientes/${cliente?.id}`,
    cliente,
    this.httpOptions
  );
}

  delete(id:any):Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/clientes/${id}`,
      this.httpOptions
    );
  }
}
