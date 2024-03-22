import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
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

  findAll(): Observable<Array<Funcionario>> {
    return this.httpClient.get<Array<Funcionario>>(
      `${this.baseUrl}/funcionarios`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/funcionarios/${id}`, this.httpOptions);
}

create(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(`${this.baseUrl}/funcionarios`, funcionario, this.httpOptions);
}

update(funcionario: Funcionario): Observable<Funcionario> {
  return this.httpClient.put<Funcionario>(
    `${this.baseUrl}/funcionarios/${funcionario?.id}`,
    funcionario,
    this.httpOptions
  );
}

  delete(id:any):Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/funcionarios/${id}`,
      this.httpOptions
    );
  }
}
