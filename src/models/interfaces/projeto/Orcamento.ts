import {ItemOrcamento} from "./ItemOrcamento";

export interface Orcamento {
  projetoId: number;
  nomeCliente: string;
  nomeProjeto: string;
  tipoProjeto: string;
  area?: number;
  materiais: ItemOrcamento[];
  acabamentos: ItemOrcamento[];
  valorMateriais: number;
  valorMaoObra: number;
  valorAcabamentos: number;
  subtotal: number;
  margemLucro: number;
  valorTotal: number;
  dataOrcamento: Date;
  validadeOrcamento: Date;
}
