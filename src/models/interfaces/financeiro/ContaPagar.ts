import {Fornecedor} from "../fornecedor/Fornecedor";

export interface ContaPagar {
  id?: number;
  compraId: number;
  compra?: any;
  fornecedor?: Fornecedor;
  valor: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  status: string; // PENDENTE, PAGO, VENCIDO, CANCELADO
  observacoes?: string;
  numeroDocumento?: string;
  formaPagamento?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  usuarioCriacao?: string;
  diasVencimento?: number;
  vencida?: boolean;
  valorPago?: number;
  valorPendente?: number;
}

