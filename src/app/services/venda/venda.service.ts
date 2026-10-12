import {Injectable} from '@angular/core';
// HttpHeaders é necessário para criar os cabeçalhos de autenticação
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin, map, mergeMap, Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Venda} from "../../../models/interfaces/venda/Venda";
import {CookieService} from "ngx-cookie-service";

// Interfaces (sem alteração)
export interface ParcelaDTO {
  numero: number;
  valor: number;
  dataVencimento: Date;
}

export interface ProcessamentoResponse {
  success: boolean;
  venda?: Venda;
  processamento?: {
    success: boolean;
    sucessos: string[];
    erros: string[];
    message: string;
  };
  message: string;
}

export interface ValidacaoResponse {
  valido: boolean;
  avisos: string[];
  erros: string[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = `${environment.baseUrl}/venda`;
  // <-- ADICIONADO: Variável para armazenar o token JWT
  private JWT_TOKEN: string;

  // O construtor já estava correto, injetando HttpClient e CookieService
  constructor(private http: HttpClient, private cookieService: CookieService) {
    // <-- ADICIONADO: Lógica para obter o token ao iniciar o serviço
    this.JWT_TOKEN = this.cookieService.get('USER_INFO');
  }

  // <-- ADICIONADO: Getter para as opções HTTP, seguindo o padrão do seu projeto
  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`
      })
    };
  }

  // MÉTODOS PRINCIPAIS (agora com autenticação)

  findAll(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl, this.httpOptions);
  }

  findById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      mergeMap(venda => {
        if (venda.vendaTipo === 0 && venda.itensVenda && venda.itensVenda.length > 0) {
          const produtos$ = venda.itensVenda.map(item =>
            this.http.get<{ nome: string }>(`${environment.baseUrl}/produto/${item.produto}`, this.httpOptions).pipe(
              map(produto => ({...item, produtoNome: produto.nome}))
            )
          );

          return forkJoin(produtos$).pipe(
            map(itensComNome => {
              return { ...venda, itensVenda: itensComNome };
            })
          );
        }

        return of(venda);
      })
    );
  }

  criarVenda(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda, this.httpOptions);
  }

  criarEProcessarVenda(venda: Venda): Observable<ProcessamentoResponse> {
    return this.http.post<ProcessamentoResponse>(`${this.apiUrl}/criar-e-processar`, venda, this.httpOptions);
  }

  processarVendaCompleta(vendaId: number): Observable<ProcessamentoResponse> {
    return this.http.post<ProcessamentoResponse>(`${this.apiUrl}/${vendaId}/processar-completa`, {}, this.httpOptions);
  }

  validarDadosVenda(venda: Venda): Observable<ValidacaoResponse> {
    return this.http.post<ValidacaoResponse>(`${this.apiUrl}/validar`, venda, this.httpOptions);
  }

  // MÉTODOS ESPECÍFICOS (agora com autenticação)

  efetivarVenda(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/efetivar`, {}, this.httpOptions);
  }

  efetivarVendaProjeto(vendaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${vendaId}/efetivar-projeto`, {},this.httpOptions);
  }

  gerarContaReceber(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/gerar-conta-receber`, {}, this.httpOptions);
  }

  gerarOrdemServico(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/gerar-ordem-servico`, {}, this.httpOptions);
  }

  update(id: number, venda: Venda): Observable<Venda> {
    return this.http.put<Venda>(`${this.apiUrl}/${id}`, venda, this.httpOptions);
  }

  // MÉTODOS DE CONSULTA (agora com autenticação)

  buscarPorCliente(clienteId: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/cliente/${clienteId}`, this.httpOptions);
  }

  buscarVendasPendentes(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/pendentes`, this.httpOptions);
  }

  verificarVendaParaProjeto(projetoId: number): Observable<{existe: boolean, message: string}> {
    return this.http.get<{existe: boolean, message: string}>(`${this.apiUrl}/projeto/${projetoId}/existe`, this.httpOptions);
  }

  buscarComFiltros(filtros: any): Observable<Venda[]> {
    let params = new HttpParams();

    if (filtros.clienteId) {
      params = params.set('clienteId', filtros.clienteId.toString());
    }
    if (filtros.tipo) {
      params = params.set('tipo', filtros.tipo);
    }
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }
    if (filtros.dataInicio) {
      params = params.set('dataInicio', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params = params.set('dataFim', filtros.dataFim);
    }

    // Combina os parâmetros de filtro com os cabeçalhos de autenticação
    return this.http.get<Venda[]>(this.apiUrl, { params: params, headers: this.httpOptions.headers });
  }

  // MÉTODOS LOCAIS (sem alteração)

  calcularParcelas(valorTotal: number, numeroParcelas: number, dataVencimento: Date): ParcelaDTO[] {
    if (numeroParcelas <= 1) {
      return [];
    }

    const parcelas: ParcelaDTO[] = [];
    const valorParcela = Math.round((valorTotal / numeroParcelas) * 100) / 100;
    let somaParcelasAnteriores = 0;

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVenc = new Date(dataVencimento);
      dataVenc.setMonth(dataVenc.getMonth() + (i - 1));

      let valorDaParcela: number;
      if (i === numeroParcelas) {
        valorDaParcela = valorTotal - somaParcelasAnteriores;
      } else {
        valorDaParcela = valorParcela;
        somaParcelasAnteriores += valorParcela;
      }

      parcelas.push({
        numero: i,
        valor: valorDaParcela,
        dataVencimento: dataVenc
      });
    }

    return parcelas;
  }

  formatarFormaPagamento(formaPagamento: string): string {
    const formas: {[key: string]: string} = {
      'AVISTA': 'À Vista',
      'PARCELADO': 'Parcelado',
      'CARTAO_CREDITO': 'Cartão de Crédito',
      'CARTAO_DEBITO': 'Cartão de Débito',
      'TRANSFERENCIA': 'Transferência'
    };
    return formas[formaPagamento] || formaPagamento;
  }

  formatarStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDENTE': 'Pendente',
      'EFETIVADA': 'Efetivada',
      'CANCELADA': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): string {
    const severityMap: {[key: string]: string} = {
      'PENDENTE': 'warning',
      'EFETIVADA': 'success',
      'CANCELADA': 'danger'
    };
    return severityMap[status] || 'info';
  }

  podeEditar(venda: Venda): boolean {
    return venda.status !== 'EFETIVADA' && venda.dataFechamento == null;
  }

  podeEfetivar(venda: Venda): boolean {
    return venda.status === 'PENDENTE' && venda.dataFechamento == null;
  }

  podeGerarContaReceber(venda: Venda): boolean {
    return venda.status === 'EFETIVADA' && !venda.contaReceberGerada;
  }

  podeGerarOrdemServico(venda: Venda): boolean {
    return venda.status === 'EFETIVADA' && !venda.ordemServicoGerada;
  }
}
