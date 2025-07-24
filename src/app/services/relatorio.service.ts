import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
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

  gerarRelatorioDeVendasResumido(filters: any): Observable<Blob> {
    const options = {
      headers: this.httpOptions.headers,
      responseType: 'blob' as 'json', // Define o tipo de resposta como blob
    };

    return this.httpClient.post(
      `${this.baseUrl}/relatorios/gerar/relatorioDeVendasResumido`,
      filters,  // Envia os filtros como body da requisição
      {
        headers: options.headers,
        responseType: 'blob', // Define o tipo de resposta
      }
    );
  }

  gerarRelatorioDeComprasResumido(filters: any): Observable<Blob> {
    const options = {
      headers: this.httpOptions.headers,
      responseType: 'blob' as 'json', // Define o tipo de resposta como blob
    };

    return this.httpClient.post(
      `${this.baseUrl}/relatorios/gerar/relatorioDeComprasResumido`,
      filters,  // Envia os filtros como body da requisição
      {
        headers: options.headers,
        responseType: 'blob', // Define o tipo de resposta
      }
    );
  }

  gerarRelatorioVendasPorClientePeriodo(filters: any): Observable<Blob> {
    return this.httpClient.post(
      `${this.baseUrl}/relatorios/vendas-por-cliente-periodo`,
      filters,
      {
        headers: this.httpOptions.headers,
        responseType: 'blob',
      }
    );
  }

  gerarRelatorioContasPagar(filters: any): Observable<Blob> {
    return this.httpClient.post(
      `${this.baseUrl}/relatorios/contas-pagar`,
      filters,
      {
        headers: this.httpOptions.headers,
        responseType: 'blob',
      }
    );
  }

  gerarRelatorioContasReceber(filters: any): Observable<Blob> {
    return this.httpClient.post(
      `${this.baseUrl}/relatorios/contas-receber`,
      filters,
      {
        headers: this.httpOptions.headers,
        responseType: 'blob',
      }
    );
  }

  gerarRelatorioComprasPorFornecedorPeriodo(filters: any): Observable<Blob> {
    return this.httpClient.post(
      `${this.baseUrl}/relatorios/compras-por-fornecedor-periodo`,
      filters,
      {
        headers: this.httpOptions.headers,
        responseType: 'blob',
      }
    );
  }

}
