import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-os-list',
  templateUrl: './os-list.component.html',
  styleUrls: ['./os-list.component.scss']
})
export class OsListComponent {
  @Input() ordensServico: Array<any> = [];
  @Output() osEvent = new EventEmitter<EventAction>();
  public osSelected!: any;

  public createOSEvent = 'Nova Ordem de Serviço';
  public editOSEvent = 'Editar ordem de serviço';
  public viewOSEvent = 'Visualizar ordem de serviço';
  public startOSEvent = 'Iniciar execução';
  public completeOSEvent = 'Concluir ordem de serviço';

  public handleOSEvent(action: string, id?: number): void {
    if (action) {
      const osEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.osEvent.emit(osEventData);
    }
  }

  public getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'APROVADA':
        return 'Aprovada';
      case 'AGENDADA':
        return 'Agendada';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'PAUSADA':
        return 'Pausada';
      case 'CONCLUIDA':
        return 'Concluída';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return 'N/A';
    }
  }

  public getStatusSeverity(status: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'warning';
      case 'APROVADA':
        return 'info';
      case 'AGENDADA':
        return 'primary';
      case 'EM_ANDAMENTO':
        return 'success';
      case 'PAUSADA':
        return 'warning';
      case 'CONCLUIDA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      default:
        return 'info';
    }
  }

  public podeEditar(os: any): boolean {
    return os?.status === 'PENDENTE' || os?.status === 'APROVADA' || os?.status === 'AGENDADA';
  }

  public podeIniciar(os: any): boolean {
    return os?.status === 'AGENDADA' || os?.status === 'APROVADA' || os?.status === 'PAUSADA';
  }

  public podeConcluir(os: any): boolean {
    return os?.status === 'EM_ANDAMENTO';
  }
}

