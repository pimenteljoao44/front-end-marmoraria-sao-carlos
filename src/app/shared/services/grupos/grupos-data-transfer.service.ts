import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';

@Injectable({
  providedIn: 'root',
})
export class GruposDataTransferService {
  gruposDataEmitter$ = new BehaviorSubject<Array<Grupo> | null>(null);

  gruposDatas: Array<Grupo> = [];
  constructor() {}

  setGruposDatas(grupos: Array<Grupo>): void {
    if (grupos) {
      this.gruposDataEmitter$.next(grupos);
    }
  }

  getGruposDataEmitter(): Observable<Array<Grupo> | null> {
    return this.gruposDataEmitter$.asObservable();
  }

  getGruposDatas() {
    this.gruposDataEmitter$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.gruposDatas = response;
        }
      },
    });
    return this.gruposDatas;
  }
}
