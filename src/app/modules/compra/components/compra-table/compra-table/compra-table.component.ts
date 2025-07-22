import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { CompraEvent } from 'src/models/enums/compra/CompraEvent';
import { FormaPagamento, getDescricaoFormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { forkJoin, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-compra-table',
  templateUrl: './compra-table.component.html',
  styleUrls: ['./compra-table.component.scss']
})
export class CompraTableComponent {
  @Input() compras: Array<Compra> = [];
  @Output() compraEvent = new EventEmitter<EventAction>();
  public compraSelected!: Compra;

  constructor(
    private fornecedorService: FornecedorService,
    private funcionarioService: FuncionarioService
  ) {}

  public createCompraEvent = CompraEvent.CREATE_COMPRA_EVENT;
  public editCompraEvent = CompraEvent.EDIT_COMPRA_EVENT;
  public viewCompraEvent = CompraEvent.VIEW_COMPRA_EVENT;

  public handleCompraEvent(action: string, id?: number): void {
    if (action) {
      const compraEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.compraEvent.emit(compraEventData);
    }
  }

  public getDescricaoFormaPagamento(cod: FormaPagamento): string {
    return getDescricaoFormaPagamento(cod);
  }
}
