import { ItemVenda } from "./ItemVenda";

export interface Venda {
  id?: number;
  dataAbertura?: Date;
  dataFechamento?: Date;
  desconto?: number;
  total?: number;
  vendaTipo?: number;
  formaPagamento?: number;
  itensVenda?: Array<ItemVenda>;
  cliente: number;
  clienteNome: string;

}
