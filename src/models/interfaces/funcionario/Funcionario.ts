import { Endereco } from "../endereco/Endereco";

export interface Funcionario {
  id?: any;
  nome: string;
  telefone: string;
  endereco: Endereco;
  cargo:string;
  salario:number;
  cpf?: string;
  rg: string;
  cnpj?: string;
  tipoPessoa: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}
