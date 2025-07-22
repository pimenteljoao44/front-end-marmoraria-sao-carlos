export enum FormaPagamento {
  DINHEIRO = 0,
  PIX = 1,
  CARTAO_DE_CREDITO = 2,
  CARTAO_DE_DEBITO = 3,
  BOLETO_BANCARIO = 4,
  TRANSFERENCIA_BANCARIA = 5,
  CHEQUE = 6
}

export const FormaPagamentoDescricoes: { [key in FormaPagamento]: string } = {
  [FormaPagamento.DINHEIRO]: 'Dinheiro',
  [FormaPagamento.PIX]: 'Pix',
  [FormaPagamento.CARTAO_DE_CREDITO]: 'Cartão de Crédito',
  [FormaPagamento.CARTAO_DE_DEBITO]: 'Cartão de Débito',
  [FormaPagamento.BOLETO_BANCARIO]: 'Boleto Bancário',
  [FormaPagamento.TRANSFERENCIA_BANCARIA]: 'Transferência Bancária',
  [FormaPagamento.CHEQUE]: 'Cheque'
};

export function getDescricaoFormaPagamento(cod: FormaPagamento): string {
  return FormaPagamentoDescricoes[cod];
}
