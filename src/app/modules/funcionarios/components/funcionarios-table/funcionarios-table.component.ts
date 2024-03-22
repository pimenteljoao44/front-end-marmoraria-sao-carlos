import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuncionarioEvent } from 'src/models/enums/funcionario/FuncionarioEvent';
import { DeleteFuncionarioAction } from 'src/models/interfaces/funcionario/event/DeleteFuncionarioAction';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-funcionarios-table',
  templateUrl: './funcionarios-table.component.html',
  styleUrls: ['./funcionarios-table.component.scss']
})
export class FuncionariosTableComponent {
  @Input() funcionarios: Array<Funcionario> = [];
  @Output() clienteEvent = new EventEmitter<EventAction>();
  @Output() deleteClientEvent = new EventEmitter<DeleteFuncionarioAction>();

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
}
