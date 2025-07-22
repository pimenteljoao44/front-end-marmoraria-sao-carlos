import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Venda } from 'src/models/interfaces/venda/Venda';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  baseUrl = environment.baseUrl;
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

  findAll(): Observable<Venda[]> {
    return this.httpClient.get<Venda[]>(this.baseUrl + '/venda', this.httpOptions).pipe(
      mergeMap(vendas =>
        forkJoin(
          vendas.map(venda => {
            const cliente$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/clientes/${venda.cliente}`, this.httpOptions).pipe(
              map(fornecedor => fornecedor.nome)
            );
            const produtos$ = (venda.itensVenda || []).map(item =>
              this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/produto/${item.produto}`, this.httpOptions).pipe(
                map(produto => ({ ...item, produtoNome: produto.nome }))
              )
            );

            return forkJoin([cliente$, ...produtos$]).pipe(
              map(([clienteNome, ...itensVenda]) => ({
                ...venda,
                clienteNome,
                itensVenda: itensVenda.map(item => ({
                  ...item,
                  produtoNome: item.produtoNome
                }))
              }))
            );
          })
        )
      )
    );
  }


  findById(id: number): Observable<Venda> {
    return this.httpClient.get<Venda>(`${this.baseUrl}/venda/${id}`, this.httpOptions).pipe(
      mergeMap(venda => {
        const cliente$ = this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/clientes/${venda.cliente}`, this.httpOptions).pipe(
          map(cliente => cliente.nome)
        );
        const produtos$ = (venda.itensVenda || []).map(item =>
          this.httpClient.get<{ nome: string }>(`${environment.baseUrl}/produto/${item.produto}`, this.httpOptions).pipe(
            map(produto => ({ ...item, produtoNome: produto.nome }))
          )
        );

        return forkJoin({
          clienteNome: cliente$,
          itensVenda: forkJoin(produtos$)
        }).pipe(
          map(({ clienteNome, itensVenda }) => ({
            ...venda,
            clienteNome,
            itensVenda: itensVenda.map(item => ({
              ...item,
              produtoNome: item.produtoNome
            }))
          }))
        );
      })
    )
  }

  create(venda: Venda): Observable<Venda> {
    return this.httpClient.post<Venda>(`${this.baseUrl}/venda`, venda, this.httpOptions);
  }

  update(venda: Venda): Observable<Venda> {
    return this.httpClient.put<Venda>(
      `${this.baseUrl}/venda/${venda?.id}`,
      venda,
      this.httpOptions
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/venda/${id}`,
      this.httpOptions
    );
  }

  addItem(vendaId: number, item: any): Observable<Venda> {
    return this.httpClient.post<Venda>(`${this.baseUrl}/venda/${vendaId}/addItem`, item, this.httpOptions);
  }

  removeItem(vendaId: number, itemId: number): Observable<Venda> {
    return this.httpClient.delete<Venda>(`${this.baseUrl}/venda/${vendaId}/removeItem/${itemId}`, this.httpOptions);
  }
}
