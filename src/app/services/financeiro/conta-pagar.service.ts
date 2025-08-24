import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContaPagar } from 'src/models/interfaces/financeiro/ContaPagar';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ContasAPagarService {
  private apiUrl = environment.baseUrl + '/api/contas-pagar';

  private JWT_TOKEN: string;

  constructor(
    private http: HttpClient,
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

  criarContaPagar(conta: ContaPagar): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(this.apiUrl, conta, this.httpOptions);
  }

  buscarContaPagarPorId(id: number): Observable<ContaPagar> {
    return this.http.get<ContaPagar>(`${this.apiUrl}/${id}`,this.httpOptions);
  }

  listarContasPagar(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(this.apiUrl,this.httpOptions);
  }

  atualizarContaPagar(id: number, conta: ContaPagar): Observable<ContaPagar> {
    return this.http.put<ContaPagar>(`${this.apiUrl}/${id}`, conta,this.httpOptions);
  }

  excluirContaPagar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,this.httpOptions);
  }

  pagarConta(id: number, formaPagamento: string): Observable<ContaPagar> {
    return this.http.patch<ContaPagar>(`${this.apiUrl}/${id}/pagar`, { formaPagamento },this.httpOptions);
  }

  buscarContasPagarPorFornecedor(fornecedorId: number): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/fornecedor/${fornecedorId}`,this.httpOptions);
  }

  buscarContasPagarVencidas(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/vencidas`,this.httpOptions);
  }

  buscarContasPagarPorStatus(status: string): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/status/${status}`,this.httpOptions);
  }
}

