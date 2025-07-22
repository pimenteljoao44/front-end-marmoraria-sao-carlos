import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContaPagar } from 'src/models/interfaces/financeiro/ContaPagar';

@Injectable({
  providedIn: 'root'
})
export class ContasAPagarService {
  private apiUrl = environment.baseUrl + '/api/contas-pagar';

  constructor(private http: HttpClient) { }

  criarContaPagar(conta: ContaPagar): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(this.apiUrl, conta);
  }

  buscarContaPagarPorId(id: number): Observable<ContaPagar> {
    return this.http.get<ContaPagar>(`${this.apiUrl}/${id}`);
  }

  listarContasPagar(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(this.apiUrl);
  }

  atualizarContaPagar(id: number, conta: ContaPagar): Observable<ContaPagar> {
    return this.http.put<ContaPagar>(`${this.apiUrl}/${id}`, conta);
  }

  excluirContaPagar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  pagarConta(id: number, formaPagamento: string): Observable<ContaPagar> {
    return this.http.patch<ContaPagar>(`${this.apiUrl}/${id}/pagar`, { formaPagamento });
  }

  buscarContasPagarPorFornecedor(fornecedorId: number): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/fornecedor/${fornecedorId}`);
  }

  buscarContasPagarVencidas(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/vencidas`);
  }

  buscarContasPagarPorStatus(status: string): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(`${this.apiUrl}/status/${status}`);
  }
}

