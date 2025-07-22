import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';

@Injectable({
  providedIn: 'root',
})
export class CidadeService {
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

  findAll(): Observable<Array<Cidade>> {
    return this.httpClient.get<Array<Cidade>>(
      `${this.baseUrl}/localidades/cidades`,
      this.httpOptions
    );
  }

  findByEstadoSigla(uf: string) {
    return this.httpClient.get<Cidade[]>(`${this.baseUrl}/localidades/cidades/${uf}`);
  }

  findById(id: any): Observable<Cidade> {
    return this.httpClient.get<Cidade>(
      `${this.baseUrl}/api/cidade/${id}`,
      this.httpOptions
    );
  }

  create(cidade: Cidade): Observable<Cidade> {
    return this.httpClient.post<Cidade>(
      `${this.baseUrl}/api/cidade`,
      cidade,
      this.httpOptions
    );
  }

  update(cidade: Cidade): Observable<Cidade> {
    return this.httpClient.put<Cidade>(
      `${this.baseUrl}/api/cidade/${cidade?.id}`,
      cidade,
      this.httpOptions
    );
  }

  delete(id: any): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/api/cidade/${id}`,
      this.httpOptions
    );
  }
}
