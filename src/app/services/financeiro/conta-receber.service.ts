import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContaReceber } from 'src/models/interfaces/financeiro/ContaReceber';

@Injectable({
  providedIn: 'root'
})
export class ContasAReceberService {
  private apiUrl = environment.baseUrl + '/api/contas-receber';

  constructor(private http: HttpClient) { }

  criarContaReceber(conta: ContaReceber): Observable<ContaReceber> {
    return this.http.post<ContaReceber>(this.apiUrl, conta);
  }

  buscarContaReceberPorId(id: number): Observable<ContaReceber> {
    return this.http.get<ContaReceber>(`${this.apiUrl}/${id}`);
  }

  listarContasReceber(): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(this.apiUrl);
  }

  atualizarContaReceber(id: number, conta: ContaReceber): Observable<ContaReceber> {
    return this.http.put<ContaReceber>(`${this.apiUrl}/${id}`, conta);
  }

  excluirContaReceber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  receberConta(id: number, formaPagamento: string): Observable<ContaReceber> {
    return this.http.patch<ContaReceber>(`${this.apiUrl}/${id}/receber`, { formaPagamento });
  }

  buscarContasReceberPorCliente(clienteId: number): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  buscarContasReceberVencidas(): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/vencidas`);
  }

  buscarContasReceberPorStatus(status: string): Observable<ContaReceber[]> {
    return this.http.get<ContaReceber[]>(`${this.apiUrl}/status/${status}`);
  }
}

