import { Cidade } from "../cidade/Cidade";

export interface Endereco {
  id?: any;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: Cidade;
}
