import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosDataTransferService {
  funcionariosDataEmitter$ = new BehaviorSubject<Array<Funcionario> | null>(null);

  funcionariosDatas:Array<Funcionario> = [];

  setFuncionariosDatas(funcionarios: Array<Funcionario>): void {
    if (funcionarios) {
      this.funcionariosDataEmitter$.next(funcionarios);
    }
  }

  getFuncionariosDataEmitter(): Observable<Array<Funcionario> | null> {
    return this.funcionariosDataEmitter$.asObservable();
  }

  getFuncionariosDatas() {
    this.funcionariosDataEmitter$
    .pipe(
      take(1)
    ).subscribe({
      next:(response) => {
        if (response) {
          this.funcionariosDatas = response;
        }
      }
    })
    return this.funcionariosDatas;
  }
}
