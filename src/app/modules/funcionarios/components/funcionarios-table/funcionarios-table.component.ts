import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FuncionarioEvent } from 'src/models/enums/funcionario/FuncionarioEvent';
import { DeleteFuncionarioAction } from 'src/models/interfaces/funcionario/event/DeleteFuncionarioAction';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-funcionarios-table',
  templateUrl: './funcionarios-table.component.html',
  styleUrls: ['./funcionarios-table.component.scss']
})
export class FuncionariosTableComponent {
  @Input() funcionarios: Array<Funcionario> = [];
  @Output() clienteEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteFuncionarioAction>();
  @ViewChild('usersTable') usersTable!: Table;
  public funcionarioSelected!: Funcionario;

  public createFuncionarioEvent = FuncionarioEvent.CREATE_FUNCIONARIO_EVENT;
  public editFuncionarioEvent = FuncionarioEvent.EDIT_FUNCIONARIO_EVENT;
  public viewFuncionarioEvent = FuncionarioEvent.VIEW_FUNCIONARIO_EVENT;

  public handleFuncionarioEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const funcionarioEventData = id && id !== null ? { action, id } : { action };
      this.clienteEvent.emit(funcionarioEventData);
    }
  }

  public handleDeleteFuncionario(func_id: number, nome: string): void {
    if (func_id && func_id !== null) {
      const deleteClientEventData = { func_id, nome };
      this.deleteClientEvent.emit(deleteClientEventData);
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
          'CPF',
          'Complemento',
          'Cidade'
        ]];

        const exportData: Funcionario[] = this.usersTable.filteredValue ?? this.funcionarios;

        const data = exportData.map((funcionario: Funcionario) => {
          const endereco = funcionario?.endereco;
          const enderecoFormatado = endereco
            ? [endereco.rua, endereco.numero, endereco.complemento, endereco.bairro]
              .filter(x => x != null && x !== '')
              .join(' ')
            : '';

          return [
            funcionario?.id ?? '',
            funcionario?.nome ?? '',
            funcionario?.telefone ?? '',
            enderecoFormatado,
            funcionario?.rg ?? '',
            funcionario?.cpf ?? '',
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
