export enum Status {
  ABERTO = 0,
  ANDAMENTO = 1,
  ENCERRADO = 2
}

export const StatusDescricoes: { [key in Status]: string } = {
  [Status.ABERTO]: 'Aberta',
  [Status.ANDAMENTO]: 'Em andamento',
  [Status.ENCERRADO]: 'Concluida'
};

export function getDescricaoStatusOs(cod: Status): string {
  return StatusDescricoes[cod];
}
