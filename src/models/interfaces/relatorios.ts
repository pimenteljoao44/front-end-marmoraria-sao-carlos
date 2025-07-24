export interface RelatorioVendasClientePeriodoFilter {
  clienteId?: number;
  dataInicio: string;
  dataFim: string;
}

export interface RelatorioContasPagarFilter {
  fornecedorId?: number;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  apenasVencidas?: boolean;
  apenasQuitadas?: boolean;
}

export interface RelatorioContasReceberFilter {
  clienteId?: number;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  apenasVencidas?: boolean;
  apenasRecebidas?: boolean;
}

export interface RelatorioComprasFornecedorPeriodoFilter {
  fornecedorId?: number;
  dataInicio: string;
  dataFim: string;
}

