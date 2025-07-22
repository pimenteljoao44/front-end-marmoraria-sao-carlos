import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Estado } from 'src/models/interfaces/estado/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoDataTransferService {
  estadoDataEmitter$ = new BehaviorSubject<Array<Estado> | null>(null);

  estadosDatas: Array<Estado> = [];
  setEstadosDatas(estados: Array<Estado>): void {
    if (estados) {
      this.estadoDataEmitter$.next(estados);
    }
  }

  getEstadoDataEmitter(): Observable<Array<Estado> | null> {
    return this.estadoDataEmitter$.asObservable();
  }

  getEstadosDatas() {
    this.estadoDataEmitter$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.estadosDatas = response;
        }
      },
    });
    return this.estadosDatas;
  }
}
