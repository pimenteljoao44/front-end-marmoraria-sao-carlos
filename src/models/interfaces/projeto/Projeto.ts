import {TipoProjeto} from "../../enums/projeto/TipoProjeto";
import {StatusProjeto} from "../../enums/projeto/StatusProjeto";
import {ProjetoItem} from "./ProjetoItem";

// Adicionado Recorte e PecaProjeto
export interface Recorte {
  tipo: string;
  largura: number;
  altura: number;
  // Propriedades de posição do recorte dentro da peça
  posicaoX?: number;
  posicaoY?: number;
}

export interface PecaProjeto {
  id?: number;
  nome: string;
  tipo: string;
  largura: number;
  altura: number;
  espessura?: number;
  unidade: string;
  recortes?: Recorte[];
  observacoes?: string;
  x?: number;
  y?: number;
}

export interface Projeto {
  id?: number;
  nome: string;
  descricao?: string;
  clienteId: number;
  clienteNome?: string;
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
  medidas?: MedidasProjeto;
  pecas?: PecaProjeto[]; // Adicionado campo para as peças
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
