import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';

@Injectable({
  providedIn: 'root',
})
export class CidadeDataTransferService {
  cidadesDataEmitter$ = new BehaviorSubject<Array<Cidade> | null>(null);

  cidadesDatas: Array<Cidade> = [];
  setCidadesDatas(cidades: Array<Cidade>): void {
    if (cidades) {
      this.cidadesDataEmitter$.next(cidades);
    }
  }

  getCidadesDataEmitter(): Observable<Array<Cidade> | null> {
    return this.cidadesDataEmitter$.asObservable();
  }

  getCidadesDatas() {
    this.cidadesDataEmitter$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.cidadesDatas = response;
        }
      },
    });
    return this.cidadesDatas;
  }
}
