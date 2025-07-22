export interface ProjetoItemForm {
  produtoId: number;
  produto?: any;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacoes?: string;
}

export interface MaterialSugerido {
  produtoId: number;
  produto: any;
  quantidadeRecomendada: number;
  aplicacao: string;
}

export interface ProjetoItem {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
}
