import {Funcionario} from "../funcionario/Funcionario";

export interface OrdemDeServico {
  id?: number;
  numero: string;
  projetoId: number;
  projeto?: any;
  clienteId: number;
  funcionario: Funcionario;
  cliente?: any;
  dataEmissao: Date;
  dataPrevistaInicio?: Date;
  dataPrevistaConclusao?: Date;
  dataInicio?: Date;
  dataConclusao?: Date;
  status: StatusOrdemServico;
  responsavel?: string;
  observacoes?: string;
  instrucoesTecnicas?: string;
  valorTotal: number;
  itens: ItemOrdemServico[];
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

export enum StatusOrdemServico {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  APROVADA = 'APROVADA',
  AGENDADA = 'AGENDADA'
}
