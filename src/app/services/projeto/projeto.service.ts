import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Venda } from 'src/models/interfaces/venda/Venda';
import {StatusProjeto} from "../../../models/enums/projeto/StatusProjeto";
import {TipoProjeto} from "../../../models/enums/projeto/TipoProjeto";
import {Projeto} from "../../../models/interfaces/projeto/Projeto";
import {Orcamento} from "../../../models/interfaces/projeto/Orcamento";
import {OrdemDeServico} from "../../../models/interfaces/os/OrdemDeServico";

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  baseUrl = environment.baseUrl + '/projetos-personalizados';
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

  listarProjetos(page: number = 0, size: number = 10, filtros?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros) {
      if (filtros.nome) params = params.set('nome', filtros.nome);
      if (filtros.status) params = params.set('status', filtros.status);
      if (filtros.tipoProjeto) params = params.set('tipoProjeto', filtros.tipoProjeto);
      if (filtros.clienteId) params = params.set('clienteId', filtros.clienteId.toString());
    }

    return this.httpClient.get<any>(`${this.baseUrl}`, { ...this.httpOptions, params });
  }

  buscarProjetoPorId(id: number): Observable<Projeto> {
    return this.httpClient.get<Projeto>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  criarProjeto(projeto: Projeto): Observable<Projeto> {
    return this.httpClient.post<Projeto>(`${this.baseUrl}`, projeto, this.httpOptions);
  }

  atualizarProjeto(id: number, projeto: Projeto): Observable<Projeto> {
    return this.httpClient.put<Projeto>(`${this.baseUrl}/${id}`, projeto, this.httpOptions);
  }

  excluirProjeto(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // Cálculo de Orçamento
  calcularOrcamento(projeto: Partial<Projeto>): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/calcular-orcamento`, projeto, this.httpOptions);
  }

  // Materiais Sugeridos
  obterMateriaisSugeridos(tipoProjeto: TipoProjeto, medidas: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/materiais-sugeridos`, {
      tipoProjeto,
      medidas
    }, this.httpOptions);
  }

  // Status do Projeto
  atualizarStatus(id: number, status: StatusProjeto): Observable<Projeto> {
    return this.httpClient.patch<Projeto>(`${this.baseUrl}/${id}/status`, { status }, this.httpOptions);
  }

  aprovarProjeto(id: number, requestBody?: { observacoes?: string }): Observable<Projeto> {
    return this.httpClient.patch<Projeto>(`${this.baseUrl}/${id}/aprovar`, requestBody || {}, this.httpOptions);
  }

  // Ordem de Serviço Operations
  gerarOrdemServico(projetoId: number): Observable<OrdemDeServico> {
    return this.httpClient.post<OrdemDeServico>(`${environment.baseUrl}/os/gerar-por-projeto/${projetoId}`, {}, this.httpOptions);
  }

  listarOrdensServico(): Observable<OrdemDeServico[]> {
    return this.httpClient.get<OrdemDeServico[]>(`${environment.baseUrl}/os`, this.httpOptions);
  }

  buscarOrdemServicoPorId(id: number): Observable<OrdemDeServico> {
    return this.httpClient.get<OrdemDeServico>(`${environment.baseUrl}/os/${id}`, this.httpOptions);
  }

  atualizarOrdemServico(id: number, ordemServico: OrdemDeServico): Observable<OrdemDeServico> {
    return this.httpClient.put<OrdemDeServico>(`${environment.baseUrl}/os/${id}`, ordemServico, this.httpOptions);
  }

  // Relatórios
  gerarRelatorioProjetosPorPeriodo(dataInicio: Date, dataFim: Date): Observable<Blob> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString().split('T')[0])
      .set('dataFim', dataFim.toISOString().split('T')[0]);

    return this.httpClient.get(`${this.baseUrl}/relatorio/periodo`, {
      ...this.httpOptions,
      params,
      responseType: 'blob'
    });
  }
  listarProjetosAprovadosPorCliente(clienteId: number): Observable<Projeto[]> {
    console.log('ProjetoService: Buscando projetos aprovados para cliente', clienteId);

    return this.httpClient.get<Projeto[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }

}
