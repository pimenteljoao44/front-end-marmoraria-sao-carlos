export interface VendaProjeto {
  id?: number;
  clienteId: number;
  cliente?: any;
  projetoId: number;
  projeto?: any;
  dataVenda: Date;
  dataEfetivacao?: Date;
  valorTotal: number;
  desconto?: number;
  valorFinal?: number;
  formaPagamento: string; // DINHEIRO, CARTAO_CREDITO, CARTAO_DEBITO, PIX, BOLETO
  status: string; // ORCAMENTO, VENDIDO, CANCELADO
  observacoes?: string;
  dataPrevistaConclusao?: Date;

  // Campos informativos
  nomeCliente?: string;
  documentoCliente?: string;
  nomeProjeto?: string;
  tipoProjeto?: string;
  descricaoProjeto?: string;

  // Flags de controle
  ordemServicoGerada?: boolean;
  contaReceberGerada?: boolean;
  podeGerarOS?: boolean;
  podeGerarContaReceber?: boolean;

  // Informações adicionais
  numeroOrdemServico?: number;
  statusOrdemServico?: string;
  valorPendente?: number;
  valorRecebido?: number;
}

