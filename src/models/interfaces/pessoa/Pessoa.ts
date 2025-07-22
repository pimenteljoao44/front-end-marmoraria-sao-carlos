import { Endereco } from "../endereco/Endereco"

export interface Pessoa {
  id?:any,
  nome:string,
  endereco:Endereco,
  telefone:any
}
