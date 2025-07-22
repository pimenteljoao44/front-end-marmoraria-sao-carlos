import {TipoProjeto} from "../../enums/projeto/TipoProjeto";
import {StatusProjeto} from "../../enums/projeto/StatusProjeto";
import {ProjetoItem} from "./ProjetoItem";
export interface Projeto {
  id?: number;
  nome: string;
  descricao?: string;
  clienteId: number;
  cliente?: any; // Reusing existing Cliente entity
  tipoProjeto: TipoProjeto;
  status: StatusProjeto;
  dataInicio?: Date;
  dataPrevista?: Date;
  dataFinalizacao?: Date;
  valorTotal: number;
  valorMaoObra: number;
  margemLucro: number;
  observacoes?: string;
  itens: ProjetoItem[];
  medidas: MedidasProjeto;
  ordemServico?: any; // Reference to OrdemServico
  dataCriacao: Date;
  dataAtualizacao: Date;
  usuarioCriacao: number;
}

export interface MedidasProjeto {
  profundidade: number;
  largura: number;
  altura: number;
  area?: number;
  perimetro?: number;
  observacoes?: string;
}

export interface TipoProjetoOption {
  label: string;
  value: TipoProjeto;
  icon: string;
  description: string;
  materiaisComuns: number[]; // IDs dos produtos comumente usados
}
