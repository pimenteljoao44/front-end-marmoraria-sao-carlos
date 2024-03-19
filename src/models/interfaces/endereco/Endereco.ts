import { Cidade } from "../cidade/Cidade";

export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: Cidade;
}
