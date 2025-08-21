import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { FormaPagamento, getDescricaoFormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

import {Venda} from "../../../../../models/interfaces/venda/Venda";
import {VendaEvent} from "../../../../../models/enums/venda/VendaEvent";

@Component({
  selector: 'app-venda-table',
  templateUrl: './venda-table.component.html',
  styleUrls: ['./nda-table.component.scss']
})
export class VendaTableComponent {
  @Input() vendas: Array<Compra> = [];
  @Output() vendaEvent = new EventEmitter<EventAction>();
  public vendaSelected!: Venda;

  constructor(
    private fornecedorService: FornecedorService,
    private funcionarioService: FuncionarioService
  ) {}

  public createVendaEvent = VendaEvent.CREATE_VENDA_EVENT;
  public editVendaEvent = VendaEvent.EDIT_VENDA_EVENT;
  public viewVendaEvent = VendaEvent.VIEW_VENDA_EVENT;

  public handleCompraEvent(action: string, id?: number): void {
    if (action) {
      const vendaEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.vendaEvent.emit(vendaEventData);
    }
  }

  public getDescricaoFormaPagamento(cod: FormaPagamento): string {
    return getDescricaoFormaPagamento(cod);
  }
}
