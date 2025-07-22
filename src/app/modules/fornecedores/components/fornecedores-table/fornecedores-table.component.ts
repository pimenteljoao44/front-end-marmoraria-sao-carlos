import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FornecedorEvent } from 'src/models/enums/fornecedor/FornecedorEvent';
import { DeleteFornecedorAction } from 'src/models/interfaces/fornecedor/event/DeleteFornecedorAction';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import {Table} from "primeng/table";

@Component({
  selector: 'app-fornecedores-table',
  templateUrl: './fornecedores-table.component.html',
  styleUrls: ['./fornecedores-table.component.scss']
})
export class FornecedoresTableComponent {
  @Input() fornecedores: Array<Fornecedor> = [];
  @Output() fornecedorEvent = new EventEmitter<EventAction>();
  @Output() deleteFornecedorEvent = new EventEmitter<DeleteFornecedorAction>();
  @ViewChild('usersTable') usersTable!: Table;
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

  exportPDF() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(autoTable => {
        const doc = new jsPDF.default('landscape');

        const head = [[
          'ID',
          'Nome',
          'Telefone',
          'Endereço',
          'RG',
          'CPF/CNPJ',
          'Complemento',
          'Cidade'
        ]];

        const exportData: Fornecedor[] = this.usersTable.filteredValue ?? this.fornecedores;

        const data = exportData.map((fornecedor: Fornecedor) => {
          const endereco = fornecedor?.endereco;
          const enderecoFormatado = endereco
            ? [endereco.rua, endereco.numero, endereco.complemento, endereco.bairro]
              .filter(x => x != null && x !== '')
              .join(' ')
            : '';

          return [
            fornecedor?.id ?? '',
            fornecedor?.nome ?? '',
            fornecedor?.telefone ?? '',
            enderecoFormatado,
            fornecedor?.rg ?? '',
            fornecedor?.cpf ?? '',
            endereco?.complemento ?? '',
            endereco?.cidade?.nome ?? ''
          ];
        });

        autoTable.default(doc, {
          head,
          body: data,
          startY: 20,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [63, 81, 181] }
        });

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      });
    });
  }
}
