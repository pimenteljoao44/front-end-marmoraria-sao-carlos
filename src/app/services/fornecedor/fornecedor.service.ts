import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
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

  findAll(): Observable<Array<Fornecedor>> {
    return this.httpClient.get<Array<Fornecedor>>(
      `${this.baseUrl}/fornecedores`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/fornecedores/${id}`, this.httpOptions);
}

create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(`${this.baseUrl}/fornecedores`, fornecedor, this.httpOptions);
}

update(fornecedor: Fornecedor): Observable<Fornecedor> {
  return this.httpClient.put<Fornecedor>(
    `${this.baseUrl}/fornecedores/${fornecedor?.id}`,
    fornecedor,
    this.httpOptions
  );
}

  delete(id:any):Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/fornecedores/${id}`,
      this.httpOptions
    );
  }
}
