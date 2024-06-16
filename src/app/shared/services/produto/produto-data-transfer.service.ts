import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Produto } from 'src/models/interfaces/produto/Produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoDataTransferService {
  produtoDataEmitter$ = new BehaviorSubject<Array<Produto> | null>(null);

  produtosDatas:Array<Produto> = [];

  setProdutosDatas(produtos: Array<Produto>): void {
    if (produtos) {
      this.produtoDataEmitter$.next(produtos);
    }
  }

  getProdutosDataEmitter(): Observable<Array<Produto> | null> {
    return this.produtoDataEmitter$.asObservable();
  }

  getProdutosDatas() {
    this.produtoDataEmitter$
    .pipe(
      take(1)
    ).subscribe({
      next:(response) => {
        if (response) {
          this.produtosDatas = response;
        }
      }
    })
    return this.produtosDatas;
  }
}
