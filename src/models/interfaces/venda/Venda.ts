import { ItemVenda } from "./ItemVenda";
import {VendaTipo} from "../../enums/vendaTipo/VendaTipo";

export interface Venda {
  id?: number;
  vendaId?: number;
  dataAbertura?: Date;
  dataVenda?: Date;
  dataFechamento?: Date;
  desconto?: number;
  total?: number;
  valorTotal?: number;
  vendaTipo?: VendaTipo;
  formaPagamento?: number;
  itensVenda?: Array<ItemVenda>;
  cliente: number;
  clienteNome?: string;
  funcionario?: number;
  funcionarioNome?: string;
  observacoes?: string;
  efetivada?: boolean;
  contaReceberGerada?: boolean;
  ordemServicoGerada?: boolean;
  status?: string;
}
