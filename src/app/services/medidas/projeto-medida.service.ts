import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

export interface ProjetoMedida {
  id?: number;
  projetoId: number;
  nome: string;
  largura?: number;
  altura?: number;
  profundidade?: number;
  espessura?: number;
  unidadeMedida: string;
  areaCalculada?: number;
  volumeCalculado?: number;
  observacoes?: string;
  coordenadaX?: number;
  coordenadaY?: number;
  rotacao?: number;
}

export interface EstatisticasProjeto {
  totalMedidas: number;
  areaTotal: number;
  volumeTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoMedidaService {

  private apiUrl = `${environment.baseUrl}/projeto-medidas`;
  private JWT_TOKEN: string;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.JWT_TOKEN = this.cookieService.get('USER_INFO');
  }

  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`
      })
    };
  }

  /**
   * Busca uma medida por ID
   */
  findById(id: number): Observable<ProjetoMedida> {
    return this.http.get<ProjetoMedida>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  /**
   * Busca todas as medidas de um projeto
   */
  findByProjetoId(projetoId: number): Observable<ProjetoMedida[]> {
    return this.http.get<ProjetoMedida[]>(`${this.apiUrl}/projeto/${projetoId}`, this.httpOptions);
  }

  /**
   * Busca medidas que possuem coordenadas (para visualização)
   */
  findMedidasComCoordenadas(projetoId: number): Observable<ProjetoMedida[]> {
    return this.http.get<ProjetoMedida[]>(`${this.apiUrl}/projeto/${projetoId}/coordenadas`, this.httpOptions);
  }

  /**
   * Busca medidas por nome
   */
  buscarPorNome(projetoId: number, nome: string): Observable<ProjetoMedida[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<ProjetoMedida[]>(`${this.apiUrl}/projeto/${projetoId}/buscar`, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Cria uma nova medida
   */
  create(medida: ProjetoMedida): Observable<ProjetoMedida> {
    return this.http.post<ProjetoMedida>(this.apiUrl, medida, this.httpOptions);
  }

  /**
   * Atualiza uma medida existente
   */
  update(id: number, medida: ProjetoMedida): Observable<ProjetoMedida> {
    return this.http.put<ProjetoMedida>(`${this.apiUrl}/${id}`, medida, this.httpOptions);
  }

  /**
   * Remove uma medida
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  /**
   * Remove todas as medidas de um projeto
   */
  deleteByProjetoId(projetoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projeto/${projetoId}`, this.httpOptions);
  }

  /**
   * Converte a unidade de uma medida específica
   */
  converterUnidade(id: number, unidade: string): Observable<ProjetoMedida> {
    const params = new HttpParams().set('unidade', unidade);
    return this.http.put<ProjetoMedida>(`${this.apiUrl}/${id}/converter-unidade`, {}, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Converte a unidade de todas as medidas de um projeto
   */
  converterTodasUnidades(projetoId: number, unidade: string): Observable<ProjetoMedida[]> {
    const params = new HttpParams().set('unidade', unidade);
    return this.http.put<ProjetoMedida[]>(`${this.apiUrl}/projeto/${projetoId}/converter-todas-unidades`, {}, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Atualiza as coordenadas de uma medida
   */
  atualizarCoordenadas(id: number, x: number, y: number, rotacao?: number): Observable<ProjetoMedida> {
    let params = new HttpParams()
      .set('x', x.toString())
      .set('y', y.toString());

    if (rotacao != null) {
      params = params.set('rotacao', rotacao.toString());
    }

    return this.http.put<ProjetoMedida>(`${this.apiUrl}/${id}/coordenadas`, {}, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Duplica uma medida
   */
  duplicarMedida(id: number, novoNome: string): Observable<ProjetoMedida> {
    const params = new HttpParams().set('novoNome', novoNome);
    return this.http.post<ProjetoMedida>(`${this.apiUrl}/${id}/duplicar`, {}, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Obtém estatísticas do projeto
   */
  obterEstatisticasProjeto(projetoId: number): Observable<EstatisticasProjeto> {
    return this.http.get<EstatisticasProjeto>(`${this.apiUrl}/projeto/${projetoId}/estatisticas`, this.httpOptions);
  }

  /**
   * Lista todas as unidades de medida disponíveis
   */
  listarUnidadesMedida(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unidades-medida`, this.httpOptions);
  }

  /**
   * Valida os dados de uma medida antes de salvar
   */
  validarMedida(medida: ProjetoMedida): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!medida.nome || medida.nome.trim().length === 0) {
      erros.push('Nome da medida é obrigatório');
    }

    if (!medida.projetoId) {
      erros.push('Projeto é obrigatório');
    }

    if (!medida.unidadeMedida) {
      erros.push('Unidade de medida é obrigatória');
    }

    // Pelo menos uma dimensão deve ser informada
    const temDimensao = (medida.largura && medida.largura > 0) ||
      (medida.altura && medida.altura > 0) ||
      (medida.profundidade && medida.profundidade > 0);

    if (!temDimensao) {
      erros.push('Pelo menos uma dimensão (largura, altura ou profundidade) deve ser informada');
    }

    // Validar valores negativos
    if (medida.largura != null && medida.largura < 0) {
      erros.push('Largura não pode ser negativa');
    }
    if (medida.altura != null && medida.altura < 0) {
      erros.push('Altura não pode ser negativa');
    }
    if (medida.profundidade != null && medida.profundidade < 0) {
      erros.push('Profundidade não pode ser negativa');
    }
    if (medida.espessura != null && medida.espessura < 0) {
      erros.push('Espessura não pode ser negativa');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }

  /**
   * Calcula a área de uma medida
   */
  calcularArea(medida: ProjetoMedida): number {
    if (!medida.largura || !medida.altura) {
      return 0;
    }
    return medida.largura * medida.altura;
  }

  /**
   * Calcula o volume de uma medida
   */
  calcularVolume(medida: ProjetoMedida): number {
    if (!medida.largura || !medida.altura || !medida.profundidade) {
      return 0;
    }
    return medida.largura * medida.altura * medida.profundidade;
  }

  /**
   * Formata as dimensões de uma medida
   */
  formatarDimensoes(medida: ProjetoMedida): string {
    const partes: string[] = [];

    if (medida.largura != null && medida.largura > 0) {
      partes.push(`L: ${medida.largura.toFixed(2)}`);
    }
    if (medida.altura != null && medida.altura > 0) {
      partes.push(`A: ${medida.altura.toFixed(2)}`);
    }
    if (medida.profundidade != null && medida.profundidade > 0) {
      partes.push(`P: ${medida.profundidade.toFixed(2)}`);
    }

    const dimensoes = partes.join(' × ');
    const unidade = this.getSimboloUnidade(medida.unidadeMedida);

    return dimensoes ? `${dimensoes} ${unidade}` : `0 ${unidade}`;
  }

  /**
   * Retorna o símbolo da unidade de medida
   */
  private getSimboloUnidade(unidade: string): string {
    switch (unidade) {
      case 'METROS': return 'm';
      case 'CENTIMETROS': return 'cm';
      case 'POLEGADAS': return 'in';
      default: return 'm';
    }
  }
}
