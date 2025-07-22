import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { OrdemDeServico } from 'src/models/interfaces/os/OrdemDeServico';

@Injectable({
  providedIn: 'root'
})
export class OsService {
  private baseUrl = `${environment.baseUrl}/os`;
  private JWT_TOKEN: string;

  constructor(
    private httpClient: HttpClient,
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

  // trazer as ordens de serviço com os nomes dos clientes e funcionarios
  findAll(): Observable<OrdemDeServico[]> {
    return this.httpClient.get<OrdemDeServico[]>(this.baseUrl, this.httpOptions).pipe(
      mergeMap(ordens => {
        // Para cada ordem de serviço, faça as requisições dos nomes do cliente e do funcionário
        const ordensComNomes$ = ordens.map(ordem => {
          const cliente$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/clientes/${ordem.cliente}`, this.httpOptions).pipe(
            map(cliente => cliente.nome)
          );
          const funcionario$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/funcionarios/${ordem.funcionario}`, this.httpOptions).pipe(
            map(funcionario => funcionario.nome)
          );

          // Combina os dados de cliente e funcionário com a OS
          return forkJoin([cliente$, funcionario$]).pipe(
            map(([clienteNome, funcionarioNome]) => ({
              ...ordem,
              clienteNome,
              funcionarioNome
            }))
          );
        });

        // Combina todas as OS com suas informações de cliente e funcionário
        return forkJoin(ordensComNomes$);
      })
    );
  }

  startOs(id: number): Observable<OrdemDeServico> {
    return this.httpClient.put<OrdemDeServico>(`${this.baseUrl}/${id}/iniciar-os`, {}, this.httpOptions);
  }

  endOs(id: number): Observable<OrdemDeServico> {
    return this.httpClient.put<OrdemDeServico>(`${this.baseUrl}/${id}/concluir-os`, {}, this.httpOptions);
  }

  findById(id: number): Observable<OrdemDeServico> {
    return this.httpClient.get<OrdemDeServico>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  create(os: OrdemDeServico): Observable<OrdemDeServico> {
    return this.httpClient.post<OrdemDeServico>(this.baseUrl, os, this.httpOptions);
  }

  update(os: OrdemDeServico): Observable<OrdemDeServico> {
    return this.httpClient.put<OrdemDeServico>(`${this.baseUrl}/${os.id}`, os, this.httpOptions);
  }
}
