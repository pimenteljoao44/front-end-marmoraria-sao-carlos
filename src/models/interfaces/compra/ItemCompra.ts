import { Compra } from '../compra/Compra';
import { Produto } from '../produto/Produto';


export interface ItemCompra {
  id?: number;
  quantidade?: number;
  valor?: number;
  compra?: Compra;
  produto?: Produto;
  promdunoNome?: string;
}
