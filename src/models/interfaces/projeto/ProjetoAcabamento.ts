import {TipoAcabamento} from "../../enums/projeto/TipoAcabamento";

export interface ProjetoAcabamento {
  id: number;
  nome: string;
  descricao?: string;
  valor: number;
  tipo: TipoAcabamento;
}
