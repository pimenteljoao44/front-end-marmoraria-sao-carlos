import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

export interface OrdemServico {
  id?: number;
  numero?: string;
  projetoId: number;
  projeto?: any;
  clienteId: number;
  cliente?: any;
  dataEmissao: string;
  dataPrevistaInicio?: string;
  dataPrevistaConclusao?: string;
  dataInicio?: string;
  dataConclusao?: string;
  status: StatusOrdemServico;
  responsavel?: string;
  observacoes?: string;
  instrucoesTecnicas?: string;
  valorTotal: number;
  itens?: ItemOrdemServico[];
  dataCriacao?: string;
  dataAtualizacao?: string;
  usuarioCriacao: number;
}

export interface ItemOrdemServico {
  id?: number;
  ordemServicoId?: number;
  produtoId: number;
  produto?: any;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

export interface AgendamentoDTO {
  dataPrevistaInicio: string;
  dataPrevistaConclusao?: string;
  responsavel?: string;
  observacoes?: string;
}

export enum StatusOrdemServico {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export interface EstatisticasOS {
  pendentesAprovacao: number;
  aprovadasSemAgendamento: number;
  agendadasHoje: number;
  emAndamento: number;
  pausadas: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdemServicoService {
  private apiUrl = `${environment.baseUrl}/api/os`;

  constructor(private http: HttpClient) { }

  // CRUD Operations
  listarTodas(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }

  buscarPorNumero(numero: string): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/numero/${numero}`);
  }

  gerarPorProjeto(projetoId: number): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(`${this.apiUrl}/gerar-por-projeto/${projetoId}`, {});
  }

  atualizar(id: number, ordemServico: OrdemServico): Observable<OrdemServico> {
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, ordemServico);
  }

  // Operações de Aprovação e Agendamento
  aprovar(id: number, observacoes?: string): Observable<OrdemServico> {
    const body = observacoes ? { observacoes } : {};
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/aprovar`, body);
  }

  agendar(id: number, agendamento: AgendamentoDTO): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/agendar`, agendamento);
  }

  aprovarEAgendar(id: number, agendamento: AgendamentoDTO): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/aprovar-e-agendar`, agendamento);
  }

  // Operações de Controle de Execução
  iniciar(id: number): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/iniciar-os`, {});
  }

  pausar(id: number): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/pausar`, {});
  }

  retomar(id: number): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/retornar`, {});
  }

  concluir(id: number): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/concluir-os`, {});
  }

  cancelar(id: number): Observable<OrdemServico> {
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // Consultas Específicas
  buscarPorStatus(status: StatusOrdemServico): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/status/${status}`);
  }

  buscarPorCliente(clienteId: number): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  buscarPorPeriodo(dataInicio: string, dataFim: string): Observable<OrdemServico[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/periodo`, { params });
  }

  buscarPendentesAprovacao(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/pendentes-aprovacao`);
  }

  buscarAprovadasSemAgendamento(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/aprovadas-sem-agendamento`);
  }

  buscarAgendadasHoje(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/agendadas-hoje`);
  }

  obterEstatisticas(): Observable<EstatisticasOS> {
    return this.http.get<EstatisticasOS>(`${this.apiUrl}/dashboard/estatisticas`);
  }

  // Métodos auxiliares
  getStatusLabel(status: StatusOrdemServico): string {
    const labels = {
      [StatusOrdemServico.PENDENTE]: 'Pendente',
      [StatusOrdemServico.APROVADA]: 'Aprovada',
      [StatusOrdemServico.AGENDADA]: 'Agendada',
      [StatusOrdemServico.EM_ANDAMENTO]: 'Em Andamento',
      [StatusOrdemServico.PAUSADA]: 'Pausada',
      [StatusOrdemServico.CONCLUIDA]: 'Concluída',
      [StatusOrdemServico.CANCELADA]: 'Cancelada'
    };
    return labels[status] || status;
  }

  getStatusColor(status: StatusOrdemServico): string {
    const colors = {
      [StatusOrdemServico.PENDENTE]: 'warning',
      [StatusOrdemServico.APROVADA]: 'info',
      [StatusOrdemServico.AGENDADA]: 'primary',
      [StatusOrdemServico.EM_ANDAMENTO]: 'success',
      [StatusOrdemServico.PAUSADA]: 'secondary',
      [StatusOrdemServico.CONCLUIDA]: 'success',
      [StatusOrdemServico.CANCELADA]: 'danger'
    };
    return colors[status] || 'secondary';
  }

  podeAprovar(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.PENDENTE;
  }

  podeAgendar(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.APROVADA || os.status === StatusOrdemServico.PENDENTE;
  }

  podeIniciar(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.AGENDADA || os.status === StatusOrdemServico.APROVADA;
  }

  podePausar(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.EM_ANDAMENTO;
  }

  podeRetomar(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.PAUSADA;
  }

  podeConcluir(os: OrdemServico): boolean {
    return os.status === StatusOrdemServico.EM_ANDAMENTO || os.status === StatusOrdemServico.PAUSADA;
  }

  podeCancelar(os: OrdemServico): boolean {
    return os.status !== StatusOrdemServico.CONCLUIDA;
  }
}

