import { Endereco } from "../endereco/Endereco";

export interface Cliente {
  id?: any;
  nome: string;
  telefone: string;
  endereco: Endereco;
  cpf?: string;
  rg: string;
  cnpj?: string;
  tipoPessoa: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}
