import {Cliente} from "../cliente/Cliente";

export interface ContaReceber {
  id?: number;
  vendaId?: number;
  venda?: any;
  projetoId?: number;
  projeto?: any;
  cliente?: Cliente;
  valor: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  status: string; // PENDENTE, RECEBIDO, VENCIDO, CANCELADO
  observacoes?: string;
  numeroDocumento?: string;
  formaPagamento?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  usuarioCriacao?: string;
  diasVencimento?: number;
  vencida?: boolean;
  valorRecebido?: number;
  valorPendente?: number;
  nomeCliente?: string;
  documentoCliente?: string;
}

