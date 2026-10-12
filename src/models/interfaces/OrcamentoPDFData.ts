export interface OrcamentoPDFData {
  /**
   * ID do projeto.
   * @TJS-type integer
   * @minimum 1
   */
  projetoId: number | null;

  /**
   * Nome do cliente.
   * @maxLength 255
   */
  clienteNome: string | null;

  /**
   * Email do cliente.
   * @format email
   * @maxLength 255
   */
  clienteEmail: string | null;

  /**
   * Telefone do cliente.
   * @maxLength 20
   */
  clienteTelefone: string | null;

  /**
   * Endereço completo do cliente.
   * @maxLength 500
   */
  clienteEndereco: string | null;

  /**
   * Nome do projeto.
   * @maxLength 100
   */
  projetoNome: string | null;

  /**
   * Descrição do projeto.
   * @maxLength 500
   */
  projetoDescricao: string | null;

  /**
   * Data de emissão do orçamento.
   * @format date
   */
  dataOrcamento: string | null; // LocalDate no backend, string no frontend (formato YYYY-MM-DD)

  /**
   * Data de validade do orçamento.
   * @format date
   */
  dataValidade: string | null; // LocalDate no backend, string no frontend (formato YYYY-MM-DD)

  /**
   * Largura do projeto (em metros).
   * @minimum 0
   * @exclusiveMinimum false
   */
  largura: number | null;

  /**
   * Comprimento do projeto (em metros).
   * @minimum 0
   * @exclusiveMinimum false
   */
  comprimento: number | null;

  /**
   * Área calculada do projeto (em m²).
   * @minimum 0
   * @exclusiveMinimum false
   */
  area: number | null;

  /**
   * Espessura do material (em metros ou centímetros, conforme unidade adotada).
   * @minimum 0
   * @exclusiveMinimum false
   */
  espessura: number | null;

  /**
   * Valor total dos materiais.
   * @minimum 0
   * @exclusiveMinimum false
   */
  valorMateriais: number | null;

  /**
   * Valor da mão de obra.
   * @minimum 0
   * @exclusiveMinimum false
   */
  valorMaoObra: number | null;

  /**
   * Percentual de margem de lucro.
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum false
   * @exclusiveMaximum false
   */
  margemLucro: number | null;

  /**
   * Valor total do orçamento.
   * @minimum 0
   * @exclusiveMinimum false
   */
  valorTotal: number | null;

  /**
   * Observações gerais do orçamento.
   * @maxLength 1000
   */
  observacoes: string | null;

  /**
   * Lista de itens do orçamento.
   */
  itens: ItemOrcamentoPDFDTO[];
}

/**
 * Interface que representa um item do orçamento para PDF.
 * Equivalente ao ItemOrcamentoPDFDTO do backend.
 */
export interface ItemOrcamentoPDFDTO {
  /**
   * Nome do produto/material/serviço.
   * @maxLength 100
   */
  nome: string | null;

  /**
   * Descrição detalhada do item.
   * @maxLength 500
   */
  descricao: string | null;

  /**
   * Quantidade do item.
   * @minimum 0
   * @exclusiveMinimum false
   */
  quantidade: number | null;

  /**
   * Unidade de medida (ex: m², m, peça, etc.).
   * @maxLength 20
   */
  unidade: string | null;

  /**
   * Valor unitário do item.
   * @minimum 0
   * @exclusiveMinimum false
   */
  valorUnitario: number | null;

  /**
   * Valor total do item (quantidade * valor unitário).
   * @minimum 0
   * @exclusiveMinimum false
   */
  valorTotal: number | null;
}
