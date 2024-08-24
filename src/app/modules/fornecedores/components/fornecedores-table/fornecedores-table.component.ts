import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FornecedorEvent } from 'src/models/enums/fornecedor/FornecedorEvent';
import { DeleteFornecedorAction } from 'src/models/interfaces/fornecedor/event/DeleteFornecedorAction';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-fornecedores-table',
  templateUrl: './fornecedores-table.component.html',
  styleUrls: ['./fornecedores-table.component.scss']
})
export class FornecedoresTableComponent {
  @Input() fornecedores: Array<Fornecedor> = [];
  @Output() fornecedorEvent = new EventEmitter<EventAction>();
  @Output() deleteFornecedorEvent = new EventEmitter<DeleteFornecedorAction>();

  public fornecedorSelected!: Fornecedor;

  public createFornecedorEvent = FornecedorEvent.CREATE_FORNECEDOR_EVENT;
  public editFornecedorEvent = FornecedorEvent.EDIT_FORNECEDOR_EVENT;
  public viewFornecedorvent = FornecedorEvent.VIEW_FORNECEDOR_EVENT;

  public handleFornecedorvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const fornecedorEventData = id && id !== null ? { action, id } : { action };
      this.fornecedorEvent.emit(fornecedorEventData);
    }
  }

  public handleDeleteFornecedor(for_id: number, nome: string): void {
    if (for_id && for_id !== null) {
      const deleteFornecedorEventData = { for_id, nome };
      this.deleteFornecedorEvent.emit(deleteFornecedorEventData);
    }
  }
}
