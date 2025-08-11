import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Venda} from "../../../models/interfaces/venda/Venda";
import {VendaTipo} from "../../../models/enums/vendaTipo/VendaTipo";


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
  private apiUrl = `${environment.baseUrl}/api/venda-unificada`;

  constructor(private http: HttpClient) { }

  // MÉTODOS PRINCIPAIS

  /**
   * Buscar todas as vendas
   */
  findAll(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  /**
   * Buscar venda por ID
   */
  findById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  /**
   * Criar nova venda (método básico)
   */
  criarVenda(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda);
  }

  /**
   * Criar e processar venda em uma única operação
   * Este é o método principal para a tela de vendas unificada
   */
  criarEProcessarVenda(venda: Venda): Observable<ProcessamentoResponse> {
    return this.http.post<ProcessamentoResponse>(`${this.apiUrl}/criar-e-processar`, venda);
  }

  /**
   * Processar venda completa (efetivar + gerar contas + gerar OS)
   */
  processarVendaCompleta(vendaId: number): Observable<ProcessamentoResponse> {
    return this.http.post<ProcessamentoResponse>(`${this.apiUrl}/${vendaId}/processar-completa`, {});
  }

  /**
   * Validar dados da venda antes de criar
   */
  validarDadosVenda(venda: Venda): Observable<ValidacaoResponse> {
    return this.http.post<ValidacaoResponse>(`${this.apiUrl}/validar`, venda);
  }

  // MÉTODOS ESPECÍFICOS

  /**
   * Efetivar venda
   */
  efetivarVenda(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/efetivar`, {});
  }

  /**
   * Gerar contas a receber
   */
  gerarContaReceber(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/gerar-conta-receber`, {});
  }

  /**
   * Gerar ordem de serviço
   */
  gerarOrdemServico(vendaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${vendaId}/gerar-ordem-servico`, {});
  }

  /**
   * Atualizar venda
   */
  update(id: number, venda: Venda): Observable<Venda> {
    return this.http.put<Venda>(`${this.apiUrl}/${id}`, venda);
  }

  // MÉTODOS DE CONSULTA

  /**
   * Buscar vendas por cliente
   */
  buscarPorCliente(clienteId: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  /**
   * Buscar vendas pendentes
   */
  buscarVendasPendentes(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/pendentes`);
  }

  /**
   * Verificar se existe venda para um projeto
   */
  verificarVendaParaProjeto(projetoId: number): Observable<{existe: boolean, message: string}> {
    return this.http.get<{existe: boolean, message: string}>(`${this.apiUrl}/projeto/${projetoId}/existe`);
  }

  /**
   * Buscar vendas com filtros
   */
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

    return this.http.get<Venda[]>(this.apiUrl, { params });
  }



  /**
   * Calcular parcelas
   */
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
        // Última parcela ajusta a diferença de arredondamento
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

  /**
   * Formatar forma de pagamento para exibição
   */
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

  /**
   * Formatar status para exibição
   */
  formatarStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDENTE': 'Pendente',
      'EFETIVADA': 'Efetivada',
      'CANCELADA': 'Cancelada'
    };

    return statusMap[status] || status;
  }

  /**
   * Obter severidade do status para PrimeNG
   */
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
