import { Cidade } from "../cidade/Cidade";
import { Estado } from "../estado/Estado";

export interface Endereco {
  id?: any;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: Cidade;
  estado: Estado;
}
