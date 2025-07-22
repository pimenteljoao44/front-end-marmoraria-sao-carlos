import { Endereco } from "../endereco/Endereco";

export interface Fornecedor{
  id?:any,
  nome:string,
  telefone: string;
  endereco: Endereco;
  cpf?: string;
  rg: string;
  cnpj?: string;
  tipoPessoa: string;
  produtos?:Array<number>;
  dataCriacao?: string;
  dataAtualizacao?: string;
}
