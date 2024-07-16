import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoEvent } from 'src/models/enums/estado/EstadoEvent';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { DeleteEstadoAction } from 'src/models/interfaces/estado/event/DeleteEstadoAction';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-estado-table',
  templateUrl: './estado-table.component.html',
  styleUrls: ['./estado-table.component.scss']
})
export class EstadoTableComponent {
  @Input() estados: Array<Estado> = [];
  @Output() estadoEvent = new EventEmitter<EventAction>();
  @Output() deleteEstadoEvent = new EventEmitter<DeleteEstadoAction>();

  public estadoSelected!: Estado;

  public createEstadoEvent = EstadoEvent.CREATE_ESTADO_EVENT;
  public editEstadoEvent = EstadoEvent.EDIT_ESTADO_EVENT;
  public viewEstadoEvent = EstadoEvent.VIEW_ESTADO_EVENT;

  public handleEstadoEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const estadoEventData = id && id !== null ? { action, id } : { action };
      this.estadoEvent.emit(estadoEventData);
    }
  }

  handleDeleteEstado(est_id:number,nome:string):void{
    if (est_id && est_id !== null) {
     this.deleteEstadoEvent.emit({est_id,nome})
    }
  }
}
