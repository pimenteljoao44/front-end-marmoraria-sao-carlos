import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { ItemCompra } from 'src/models/interfaces/compra/ItemCompra';


@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private baseUrl = `${environment.baseUrl}/compra`;
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

  findAll(): Observable<Compra[]> {
    return this.httpClient.get<Compra[]>(this.baseUrl, this.httpOptions).pipe(
      mergeMap(compras =>
        forkJoin(
          compras.map(compra => {
            const fornecedor$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/fornecedores/${compra.fornecedor}`, this.httpOptions).pipe(
              map(fornecedor => fornecedor.nome)
            );
            const funcionario$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/funcionarios/${compra.funcionario}`, this.httpOptions).pipe(
              map(funcionario => funcionario.nome)
            );

            return forkJoin([fornecedor$, funcionario$]).pipe(
              map(([fornecedorNome, funcionarioNome]) => ({
                ...compra,
                fornecedorNome,
                funcionarioNome
              }))
            );
          })
        )
      )
    );
  }

  findById(id: number): Observable<Compra> {
    return this.httpClient.get<Compra>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(
      mergeMap(compra => {
        const fornecedor$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/fornecedores/${compra.fornecedor}`, this.httpOptions).pipe(
          map(fornecedor => fornecedor.nome)
        );
        const funcionario$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/funcionarios/${compra.funcionario}`, this.httpOptions).pipe(
          map(funcionario => funcionario.nome)
        );

        const produtos$ = (compra.itensCompra || []).map(item =>
          this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/produto/${item.produto}`, this.httpOptions).pipe(
            map(produto => ({ ...item, produtoNome: produto.nome }))
          )
        );

        return forkJoin({
          fornecedorNome: fornecedor$,
          funcionarioNome: funcionario$,
          itensCompra: forkJoin(produtos$)
        }).pipe(
          map(({ fornecedorNome, funcionarioNome, itensCompra }) => ({
            ...compra,
            fornecedorNome,
            funcionarioNome,
            itensCompra: itensCompra.map(item => ({
              ...item,
              produtoNome: item.produtoNome
            }))
          }))
        );
      })
    );
  }

  create(compra: Compra): Observable<Compra> {
    return this.httpClient.post<Compra>(this.baseUrl, compra, this.httpOptions);
  }

  update(compra: Compra): Observable<Compra> {
    return this.httpClient.put<Compra>(`${this.baseUrl}/${compra.comprId}`, compra, this.httpOptions);
  }

  addItem(compraId: number, item: ItemCompra): Observable<Compra> {
    return this.httpClient.post<Compra>(`${this.baseUrl}/${compraId}/addItem`, item, this.httpOptions);
  }

  removeItem(compraId: number, itemId: number): Observable<Compra> {
    return this.httpClient.delete<Compra>(`${this.baseUrl}/${compraId}/removeItem/${itemId}`, this.httpOptions);
  }
}
