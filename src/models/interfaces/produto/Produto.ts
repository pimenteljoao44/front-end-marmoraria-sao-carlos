import { Fornecedor } from "../fornecedor/Fornecedor"
import { Grupo } from "../grupo/Grupo"

export interface Produto {
  id?:any,
  nome:string,
  preco:number,
  ativo?:boolean,
  estoque:number,
  quantidade:number,
  grupo:Grupo,
  fornecedor?:Fornecedor
}
