import { FormaPagamento } from "src/models/enums/formaPagamento/FormaPagamento";
import { Fornecedor } from "../fornecedor/Fornecedor";
import { Funcionario } from "../funcionario/Funcionario";
import { ItemCompra } from "./ItemCompra";


export interface Compra {
  comprId?: number;
  observacoes?: string;
  valorTotal?: number;
  quantidadeTotal?: number;
  dataCompra?: Date;
  fornecedor?: number;
  fornecedorNome?: string;
  funcionario?: number;
  funcionarioNome?: string;
  formaPagamento?: number;
  itensCompra?: ItemCompra[];
}
