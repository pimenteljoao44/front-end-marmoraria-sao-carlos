import {Projeto} from "./Projeto";
import {ProjetoMaterial} from "./ProjetoMaterial";
import {ProjetoAcabamento} from "./ProjetoAcabamento";
export interface ProjetoDisplay extends Projeto {
  dataPrevisaoEntregaFormatada?: string;
  valorTotalFormatado?: string;
  materiais?: ProjetoMaterial[]; // Especifique o tipo correto
  acabamentos?: ProjetoAcabamento[]; // Especifique o tipo correto
}
