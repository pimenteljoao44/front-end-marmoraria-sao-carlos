import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClienteEvent } from 'src/models/enums/cliente/ClienteEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { DeleteClienteAction } from 'src/models/interfaces/cliente/event/DeleteClienteAction';

@Component({
  selector: 'app-clientes-table',
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.scss']
})
export class ClientesTableComponent {
  @Input() clientes: Array<Cliente> = [];
  @Output() clienteEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteClienteAction>();

  public clienteSelected!: Cliente;

  public createClienteEvent = ClienteEvent.CREATE_CLIENT_EVENT;
  public editClienteEvent = ClienteEvent.EDIT_CLIENT_EVENT;
  public viewClientEvent = ClienteEvent.VIEW_CLIENT_EVENT;

  public handleClientEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const clientEventData = id && id !== null ? { action, id } : { action };
      this.clienteEvent.emit(clientEventData);
    }
  }

  public handleDeleteClient(cli_id: number, nome: string): void {
    if (cli_id && cli_id !== null) {
      const deleteClientEventData = { cli_id, nome };
      this.deleteClientEvent.emit(deleteClientEventData);
    }
  }
}
