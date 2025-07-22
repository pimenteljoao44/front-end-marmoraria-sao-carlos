import { Endereco } from "../endereco/Endereco";
import { Usuario } from "../User/Usuario";

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
  usuario?: Usuario;
}
