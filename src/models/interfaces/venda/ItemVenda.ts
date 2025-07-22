import { Produto } from "../produto/Produto";
import { Venda } from "./Venda";

export interface ItemVenda {
  id?: number;
  quantidade?: number;
  preco?: number;
  subTotal?: number;
  produto?: Produto;
  promdutoNome?: string;
  venda?: Venda
}
