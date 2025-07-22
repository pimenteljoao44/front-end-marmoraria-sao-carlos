export enum VendaTipo {
  ORCAMENTO = 1,
  VENDA = 0
}

export const VendaTipoDescricoes: { [key in VendaTipo]: string } = {
  [VendaTipo.ORCAMENTO]: 'Orçamento',
  [VendaTipo.VENDA]: 'Venda'
};

export function getDescricaoVendaTipo(cod: VendaTipo): string {
  return VendaTipoDescricoes[cod];
}
