import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ParcelaDTO {
  id?: number;
  numeroParcela: number;
  totalParcelas: number;
  valorParcela: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  observacoes?: string;
  contaPagarId?: number;
  contaReceberId?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
  descricaoContaPagar?: string;
  descricaoContaReceber?: string;
  nomeCliente?: string;
  nomeFornecedor?: string;
  valorTotal?: number;
  vencida?: boolean;
  paga?: boolean;
  diasAteVencimento?: number;
}

export interface InstallmentRequestDTO {
  numeroParcelas: number;
  intervaloDias: number;
  dataPrimeiroVencimento?: string;
  valorTotal: number;
  observacoes?: string;
}

export interface ResumoParcelasDTO {
  totalParcelas: number;
  parcelasVencidas: number;
  proximasVencer: number;
  parcelasPagas: number;
  parcelasPendentes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {
  private apiUrl = `${environment.baseUrl}/api/parcelas`;

  constructor(private http: HttpClient) { }

  // CRUD Operations
  listarTodas(): Observable<ParcelaDTO[]> {
    return this.http.get<ParcelaDTO[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<ParcelaDTO> {
    return this.http.get<ParcelaDTO>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, parcela: ParcelaDTO): Observable<ParcelaDTO> {
    return this.http.put<ParcelaDTO>(`${this.apiUrl}/${id}`, parcela);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Query Operations
  listarPorContaPagar(contaId: number): Observable<ParcelaDTO[]> {
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/conta-pagar/${contaId}`);
  }

  listarPorContaReceber(contaId: number): Observable<ParcelaDTO[]> {
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/conta-receber/${contaId}`);
  }

  listarPorStatus(status: string): Observable<ParcelaDTO[]> {
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  listarVencidas(): Observable<ParcelaDTO[]> {
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/vencidas`);
  }

  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<ParcelaDTO[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/periodo`, { params });
  }

  listarProximasAVencer(dias: number = 30): Observable<ParcelaDTO[]> {
    const params = new HttpParams().set('dias', dias.toString());
    return this.http.get<ParcelaDTO[]>(`${this.apiUrl}/proximas-vencer`, { params });
  }

  // Payment Operations
  marcarComoPaga(id: number, dataPagamento?: string): Observable<ParcelaDTO> {
    const params = dataPagamento ? new HttpParams().set('dataPagamento', dataPagamento) : new HttpParams();
    return this.http.put<ParcelaDTO>(`${this.apiUrl}/${id}/pagar`, {}, { params });
  }

  cancelar(id: number): Observable<ParcelaDTO> {
    return this.http.put<ParcelaDTO>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // Dashboard Operations
  obterResumo(): Observable<ResumoParcelasDTO> {
    return this.http.get<ResumoParcelasDTO>(`${this.apiUrl}/dashboard/resumo`);
  }

  // Utility Methods
  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'PENDENTE':
        return 'Pendente';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'success';
      case 'PENDENTE':
        return 'warning';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  isVencida(parcela: ParcelaDTO): boolean {
    if (parcela.status !== 'PENDENTE' || !parcela.dataVencimento) {
      return false;
    }
    const hoje = new Date();
    const vencimento = new Date(parcela.dataVencimento);
    return vencimento < hoje;
  }

  getDiasAteVencimento(parcela: ParcelaDTO): number {
    if (!parcela.dataVencimento) {
      return 0;
    }
    const hoje = new Date();
    const vencimento = new Date(parcela.dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getDescricaoParcela(parcela: ParcelaDTO): string {
    return `${parcela.numeroParcela}/${parcela.totalParcelas}`;
  }
}

