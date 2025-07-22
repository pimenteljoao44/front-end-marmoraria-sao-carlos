import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ClienteEvent } from 'src/models/enums/cliente/ClienteEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { DeleteClienteAction } from 'src/models/interfaces/cliente/event/DeleteClienteAction';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-clientes-table',
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.scss']
})
export class ClientesTableComponent {
  @Input() clientes: Array<Cliente> = [];
  @Output() clienteEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteClienteAction>();

  @ViewChild('usersTable') usersTable!: Table;

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

  exportPDF() {
    const doc = new jsPDF();

    const head = [['ID', 'Nome', 'Telefone', 'Rua', 'RG', 'CPF', 'Complemento', 'Cidade']];

    // Aqui você pode pegar a lista filtrada pelo p-table
    const exportData: Cliente[] = this.usersTable.filteredValue ?? this.clientes;

    const data = exportData.map((cliente: Cliente) => [
      cliente?.id ?? '',
      cliente?.nome ?? '',
      cliente?.telefone ?? '',
      cliente?.endereco ? `${cliente.endereco.rua} ${cliente.endereco.numero} ${cliente.endereco.complemento ?? ''} ${cliente.endereco.bairro ?? ''}` : '',
      cliente?.rg ?? '',
      cliente?.cpf ?? '',
      cliente?.endereco?.complemento ?? '',
      cliente?.endereco?.cidade?.nome ?? ''
    ]);

    autoTable(doc, {
      head: head,
      body: data,
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }
}
