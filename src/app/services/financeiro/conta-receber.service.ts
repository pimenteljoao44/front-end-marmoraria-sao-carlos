import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContaReceber } from 'src/models/interfaces/financeiro/ContaReceber';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ContasAReceberService {
  private apiUrl = environment.baseUrl + '/api/contas-receber';

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

  criarContaReceber(conta: ContaReceber): Observable<ContaReceber> {
    return this.http.post<ContaReceber>(this.apiUrl, conta,this.httpOptions);
  }

  buscarContaReceberPorId(id: number): Observable<ContaReceber> {
    return this.http.get<ContaReceber>(`${this.apiUrl}/${id}`,this.httpOptions);
  }

  listarContasReceber(): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(this.apiUrl,this.httpOptions);
  }

  atualizarContaReceber(id: number, conta: ContaReceber): Observable<ContaReceber> {
    return this.http.put<ContaReceber>(`${this.apiUrl}/${id}`, conta,this.httpOptions);
  }

  excluirContaReceber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,this.httpOptions);
  }

  receberConta(id: number, formaPagamento: string): Observable<ContaReceber> {
    return this.http.patch<ContaReceber>(`${this.apiUrl}/${id}/receber`, { formaPagamento },this.httpOptions);
  }

  buscarContasReceberPorCliente(clienteId: number): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/cliente/${clienteId}`,this.httpOptions);
  }

  buscarContasReceberVencidas(): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/vencidas`,this.httpOptions);
  }

  buscarContasReceberPorStatus(status: string): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/status/${status}`,this.httpOptions);
  }
}

