export interface AgendamentoDTO {
  dataPrevistaInicio: Date | string;
  dataPrevistaConclusao?: Date | string | null;
  responsavel?: string | null;
  observacoes?: string | null;
}
