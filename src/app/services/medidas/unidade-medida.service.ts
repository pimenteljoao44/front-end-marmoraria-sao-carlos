import { Injectable } from '@angular/core';

export interface UnidadeMedida {
  valor: string;
  simbolo: string;
  descricao: string;
  fatorConversao: number;
}

@Injectable({
  providedIn: 'root'
})
export class UnidadeMedidaService {

  private unidades: UnidadeMedida[] = [
    { valor: 'METROS', simbolo: 'm', descricao: 'Metros', fatorConversao: 1.0 },
    { valor: 'CENTIMETROS', simbolo: 'cm', descricao: 'Centímetros', fatorConversao: 100.0 },
    { valor: 'POLEGADAS', simbolo: 'in', descricao: 'Polegadas', fatorConversao: 39.3701 }
  ];

  constructor() { }

  /**
   * Retorna todas as unidades de medida disponíveis
   */
  getUnidades(): UnidadeMedida[] {
    return [...this.unidades];
  }

  /**
   * Retorna a unidade padrão do sistema
   */
  getUnidadePadrao(): UnidadeMedida {
    return this.unidades[0]; // METROS
  }

  /**
   * Busca uma unidade pelo valor
   */
  getUnidadePorValor(valor: string): UnidadeMedida | undefined {
    return this.unidades.find(u => u.valor === valor);
  }

  /**
   * Busca uma unidade pelo símbolo
   */
  getUnidadePorSimbolo(simbolo: string): UnidadeMedida | undefined {
    return this.unidades.find(u => u.simbolo === simbolo);
  }

  /**
   * Converte um valor de uma unidade para outra
   */
  converter(valor: number, unidadeOrigem: UnidadeMedida, unidadeDestino: UnidadeMedida): number {
    if (!valor || !unidadeOrigem || !unidadeDestino) {
      return 0;
    }

    if (unidadeOrigem.valor === unidadeDestino.valor) {
      return valor;
    }

    // Converte primeiro para metros, depois para a unidade de destino
    const valorEmMetros = valor / unidadeOrigem.fatorConversao;
    const valorConvertido = valorEmMetros * unidadeDestino.fatorConversao;

    return Math.round(valorConvertido * 10000) / 10000; // 4 casas decimais
  }

  /**
   * Converte um valor para metros (unidade padrão)
   */
  converterParaMetros(valor: number, unidadeOrigem: UnidadeMedida): number {
    return this.converter(valor, unidadeOrigem, this.getUnidadePadrao());
  }

  /**
   * Converte um valor de metros para uma unidade específica
   */
  converterDeMetros(valorEmMetros: number, unidadeDestino: UnidadeMedida): number {
    return this.converter(valorEmMetros, this.getUnidadePadrao(), unidadeDestino);
  }

  /**
   * Formata um valor com a unidade
   */
  formatarComUnidade(valor: number, unidade: UnidadeMedida, casasDecimais: number = 2): string {
    if (!valor || !unidade) {
      return `0 ${unidade?.simbolo || 'm'}`;
    }

    const valorFormatado = valor.toFixed(casasDecimais);
    return `${valorFormatado} ${unidade.simbolo}`;
  }

  /**
   * Calcula a área em metros quadrados
   */
  calcularAreaEmMetrosQuadrados(largura: number, altura: number, unidade: UnidadeMedida): number {
    const larguraEmMetros = this.converterParaMetros(largura, unidade);
    const alturaEmMetros = this.converterParaMetros(altura, unidade);
    return larguraEmMetros * alturaEmMetros;
  }

  /**
   * Calcula o volume em metros cúbicos
   */
  calcularVolumeEmMetrosCubicos(largura: number, altura: number, profundidade: number, unidade: UnidadeMedida): number {
    const larguraEmMetros = this.converterParaMetros(largura, unidade);
    const alturaEmMetros = this.converterParaMetros(altura, unidade);
    const profundidadeEmMetros = this.converterParaMetros(profundidade, unidade);
    return larguraEmMetros * alturaEmMetros * profundidadeEmMetros;
  }

  /**
   * Valida se um valor é válido para medidas
   */
  validarValor(valor: number): boolean {
    return valor != null && valor >= 0 && !isNaN(valor) && isFinite(valor);
  }

  /**
   * Formata dimensões completas (L x A x P)
   */
  formatarDimensoes(largura?: number, altura?: number, profundidade?: number, unidade?: UnidadeMedida): string {
    if (!unidade) unidade = this.getUnidadePadrao();

    const partes: string[] = [];

    if (largura != null && largura > 0) {
      partes.push(`L: ${largura.toFixed(2)}`);
    }
    if (altura != null && altura > 0) {
      partes.push(`A: ${altura.toFixed(2)}`);
    }
    if (profundidade != null && profundidade > 0) {
      partes.push(`P: ${profundidade.toFixed(2)}`);
    }

    const dimensoes = partes.join(' × ');
    return dimensoes ? `${dimensoes} ${unidade.simbolo}` : `0 ${unidade.simbolo}`;
  }

  /**
   * Converte todas as medidas de um objeto para uma nova unidade
   */
  converterObjetoMedidas(medidas: any, unidadeOrigem: UnidadeMedida, unidadeDestino: UnidadeMedida): any {
    if (!medidas || unidadeOrigem.valor === unidadeDestino.valor) {
      return medidas;
    }

    const medidasConvertidas = { ...medidas };

    // Lista de campos que representam medidas
    const camposMedidas = ['largura', 'altura', 'profundidade', 'espessura', 'coordenadaX', 'coordenadaY'];

    camposMedidas.forEach(campo => {
      if (medidasConvertidas[campo] != null) {
        medidasConvertidas[campo] = this.converter(medidasConvertidas[campo], unidadeOrigem, unidadeDestino);
      }
    });

    medidasConvertidas.unidadeMedida = unidadeDestino.valor;

    return medidasConvertidas;
  }

  /**
   * Retorna sugestões de precisão baseadas na unidade
   */
  getPrecisaoSugerida(unidade: UnidadeMedida): number {
    switch (unidade.valor) {
      case 'METROS':
        return 3; // 3 casas decimais para metros
      case 'CENTIMETROS':
        return 1; // 1 casa decimal para centímetros
      case 'POLEGADAS':
        return 2; // 2 casas decimais para polegadas
      default:
        return 2;
    }
  }

  /**
   * Retorna o step sugerido para inputs baseado na unidade
   */
  getStepSugerido(unidade: UnidadeMedida): number {
    switch (unidade.valor) {
      case 'METROS':
        return 0.001; // 1mm de precisão
      case 'CENTIMETROS':
        return 0.1; // 1mm de precisão
      case 'POLEGADAS':
        return 0.01; // ~0.25mm de precisão
      default:
        return 0.01;
    }
  }
}
