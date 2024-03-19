import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesDataTransferService {

  clientesDataEmitter$ = new BehaviorSubject<Array<Cliente> | null>(null);

  clientesDatas:Array<Cliente> = [];
  setClientesDatas(clientes: Array<Cliente>): void {
    if (clientes) {
      this.clientesDataEmitter$.next(clientes);
    }
  }

  getClientesDataEmitter(): Observable<Array<Cliente> | null> {
    return this.clientesDataEmitter$.asObservable();
  }

  getClientesDatas() {
    this.clientesDataEmitter$
    .pipe(
      take(1)
    ).subscribe({
      next:(response) => {
        if (response) {
          this.clientesDatas = response;
        }
      }
    })
    return this.clientesDatas;
  }
}
