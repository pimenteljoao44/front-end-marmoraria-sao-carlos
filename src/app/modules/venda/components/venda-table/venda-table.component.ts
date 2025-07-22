import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { FormaPagamento, getDescricaoFormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { VendaEvent } from 'src/models/enums/venda/VendaEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Venda } from 'src/models/interfaces/venda/Venda';
import { VendaTipo, getDescricaoVendaTipo } from 'src/models/enums/vendaTipo/VendaTipo';

@Component({
  selector: 'app-venda-table',
  templateUrl: './venda-table.component.html',
  styleUrls: ['./venda-table.component.scss']
})
export class VendaTableComponent {
  @Input() vendas: Array<Venda> = [];
  @Output() vendaEvent = new EventEmitter<EventAction>();
  public vendaSelected!: Venda;

  constructor(
    private clienteService: ClientesService
  ) {}

  public createVendaEvent = VendaEvent.CREATE_VENDA_EVENT;
  public editVendaEvent = VendaEvent.EDIT_VENDA_EVENT;
  public viewVendaEvent = VendaEvent.VIEW_VENDA_EVENT;

  public handleVendaEvent(action: string, id?: number): void {
    if (action) {
      const vendaEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.vendaEvent.emit(vendaEventData);
    }
  }

  public getDescricaoFormaPagamento(cod: FormaPagamento): string {
    return getDescricaoFormaPagamento(cod);
  }

  public getDescricaoVendaTipo(cod: VendaTipo): string {
    return getDescricaoVendaTipo(cod);
  }
}
