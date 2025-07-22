import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedoresDateTransferService {

  fornecedoresDataEmitter$ = new BehaviorSubject<Array<Fornecedor> | null>(null);

  fornecedoresDatas:Array<Fornecedor> = [];
  setFornecedoresDatas(fornecedores: Array<Fornecedor>): void {
    if (fornecedores) {
      this.fornecedoresDataEmitter$.next(fornecedores);
    }
  }

  getFornecedoresDataEmitter(): Observable<Array<Fornecedor> | null> {
    return this.fornecedoresDataEmitter$.asObservable();
  }

  getFornecedoresDatas() {
    this.fornecedoresDataEmitter$
    .pipe(
      take(1)
    ).subscribe({
      next:(response) => {
        if (response) {
          this.fornecedoresDatas = response;
        }
      }
    })
    return this.fornecedoresDatas;
  }
}
