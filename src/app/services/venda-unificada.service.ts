import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VendaUnificada {
  id?: number;
  dataAbertura?: Date;
  dataFechamento?: Date;
  total?: number;
  desconto?: number;
  vendaTipo?: 'VENDA' | 'ORCAMENTO' ;
  formaPagamento?: string;
  numeroParcelas?: number;
  observacoes?: string;

  // Dados do cliente
  clienteId?: number;
  nomeCliente?: string;
  emailCliente?: string;
  telefoneCliente?: string;

  // Dados do projeto
  projetoId?: number;
  nomeProjeto?: string;
  tipoProjeto?: string;
  statusProjeto?: string;

  // Itens da venda
  itens?: ItemVenda[];

  // Flags de controle
  isVendaProjeto?: boolean;
  isVendaProduto?: boolean;
  isEfetivada?: boolean;
  contaReceberGerada?: boolean;
  ordemServicoGerada?: boolean;

  // Valores calculados
  valorParcela?: number;
  valorFinal?: number;
}

export interface VendaUnificadaCreate {
  clienteId: number;
  vendaTipo: 'VENDA' | 'ORCAMENTO';
  formaPagamento: string;
  projetoId?: number;
  itens?: ItemVendaCreate[];
  desconto?: number;
  numeroParcelas?: number;
  observacoes?: string;
}

export interface VendaUnificadaUpdate {
  formaPagamento?: string;
  desconto?: number;
  numeroParcelas?: number;
  observacoes?: string;
}

export interface ItemVenda {
  id?: number;
  produtoId?: number;
  nomeProduto?: string;
  quantidade?: number;
  preco?: number;
  subtotal?: number;
  observacoes?: string;
}

export interface ItemVendaCreate {
  produtoId: number;
  quantidade: number;
  preco?: number;
  observacoes?: string;
}

export interface ItemVendaUpdate {
  quantidade?: number;
  preco?: number;
  observacoes?: string;
}

export interface VendaEstatisticas {
  totalVendas?: number;
  vendasEfetivadas?: number;
  orcamentosPendentes?: number;
  valorTotalVendas?: number;
  valorOrcamentos?: number;
  vendasProduto?: number;
  vendasProjeto?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendaUnificadaService {
  private apiUrl = `${environment.baseUrl}/api/venda-unificada`;

  constructor(private http: HttpClient) { }

  // ========== OPERAÇÕES CRUD ==========

  criarVenda(venda: VendaUnificadaCreate): Observable<VendaUnificada> {
    return this.http.post<VendaUnificada>(this.apiUrl, venda);
  }

  buscarPorId(id: number): Observable<VendaUnificada> {
    return this.http.get<VendaUnificada>(`${this.apiUrl}/${id}`);
  }

  listarTodas(filtros?: {
    tipo?: string;
    clienteId?: number;
    status?: string;
  }): Observable<VendaUnificada[]> {
    let params = new HttpParams();

    if (filtros?.tipo) {
      params = params.set('tipo', filtros.tipo);
    }
    if (filtros?.clienteId) {
      params = params.set('clienteId', filtros.clienteId.toString());
    }
    if (filtros?.status) {
      params = params.set('status', filtros.status);
    }

    return this.http.get<VendaUnificada[]>(this.apiUrl, { params });
  }

  atualizar(id: number, venda: VendaUnificadaUpdate): Observable<VendaUnificada> {
    return this.http.put<VendaUnificada>(`${this.apiUrl}/${id}`, venda);
  }

  // ========== OPERAÇÕES ESPECÍFICAS ==========

  efetivar(id: number): Observable<VendaUnificada> {
    return this.http.patch<VendaUnificada>(`${this.apiUrl}/${id}/efetivar`, {});
  }

  gerarContaReceber(id: number): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${id}/gerar-conta-receber`, {});
  }

  gerarOrdemServico(id: number): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/${id}/gerar-ordem-servico`, {});
  }

  // ========== OPERAÇÕES DE ITENS ==========

  adicionarItem(vendaId: number, item: ItemVendaCreate): Observable<VendaUnificada> {
    return this.http.post<VendaUnificada>(`${this.apiUrl}/${vendaId}/adicionar-item`, item);
  }

  removerItem(vendaId: number, itemId: number): Observable<VendaUnificada> {
    return this.http.delete<VendaUnificada>(`${this.apiUrl}/${vendaId}/remover-item/${itemId}`);
  }

  atualizarItem(vendaId: number, itemId: number, item: ItemVendaUpdate): Observable<VendaUnificada> {
    return this.http.put<VendaUnificada>(`${this.apiUrl}/${vendaId}/atualizar-item/${itemId}`, item);
  }

  // ========== CONSULTAS ESPECÍFICAS ==========

  buscarPorCliente(clienteId: number): Observable<VendaUnificada[]> {
    return this.http.get<VendaUnificada[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  listarVendasProdutos(): Observable<VendaUnificada[]> {
    return this.http.get<VendaUnificada[]>(`${this.apiUrl}/produtos`);
  }

  listarVendasProjetos(): Observable<VendaUnificada[]> {
    return this.http.get<VendaUnificada[]>(`${this.apiUrl}/projetos`);
  }

  listarOrcamentos(): Observable<VendaUnificada[]> {
    return this.http.get<VendaUnificada[]>(`${this.apiUrl}/orcamentos`);
  }

  // ========== DASHBOARD E ESTATÍSTICAS ==========

  obterEstatisticas(): Observable<VendaEstatisticas> {
    return this.http.get<VendaEstatisticas>(`${this.apiUrl}/dashboard/estatisticas`);
  }

  // ========== MÉTODOS AUXILIARES ==========

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return '';
    }

    return d.toLocaleDateString('pt-BR');
  }

  getTipoVendaLabel(tipo: string): string {
    switch (tipo) {
      case 'VENDA': return 'Produto';
      case 'ORCAMENTO': return 'Projeto';
      default: return tipo;
    }
  }

  getStatusLabel(venda: VendaUnificada): string {
    if (venda.isEfetivada) {
      return 'Efetivada';
    } else if (venda.vendaTipo === 'ORCAMENTO') {
      return 'Orçamento';
    }
    return 'Pendente';
  }

  getStatusClass(venda: VendaUnificada): string {
    if (venda.isEfetivada) {
      return 'success';
    } else if (venda.vendaTipo === 'ORCAMENTO') {
      return 'warning';
    }
    return 'info';
  }

  podeEfetivar(venda: VendaUnificada) {
    return !venda.isEfetivada && (venda.isVendaProjeto || venda.isVendaProduto);
  }

  podeGerarContaReceber(venda: VendaUnificada) {
    return venda.isEfetivada && !venda.contaReceberGerada;
  }

  podeGerarOrdemServico(venda: VendaUnificada) {
    return venda.isEfetivada && venda.isVendaProjeto && !venda.ordemServicoGerada;
  }

  podeEditar(venda: VendaUnificada): boolean {
    return !venda.isEfetivada;
  }

  calcularSubtotal(item: ItemVenda): number {
    return (item.quantidade || 0) * (item.preco || 0);
  }

  calcularTotalItens(itens: ItemVenda[]): number {
    return itens.reduce((total, item) => total + this.calcularSubtotal(item), 0);
  }
}

