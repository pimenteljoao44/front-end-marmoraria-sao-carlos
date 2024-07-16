import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produto } from 'src/models/interfaces/produto/Produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
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

  findAll(): Observable<Array<Produto>> {
    return this.httpClient.get<Array<Produto>>(
      `${this.baseUrl}/produto`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Produto> {
    return this.httpClient.get<Produto>(
      `${this.baseUrl}/produto/${id}`,
      this.httpOptions
    );
  }

  create(produto: Produto): Observable<Produto> {
    return this.httpClient.post<Produto>(
      `${this.baseUrl}/produto`,
      produto,
      this.httpOptions
    );
  }

  update(produto: Produto): Observable<Produto> {
    return this.httpClient.put<Produto>(
      `${this.baseUrl}/produto/${produto?.id}`,
      produto,
      this.httpOptions
    );
  }

  delete(id: any): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/produto/${id}`,
      this.httpOptions
    );
  }
}
