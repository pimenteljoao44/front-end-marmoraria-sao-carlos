import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GrupoEvent } from 'src/models/enums/grupo/GrupoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';
import { DeleteGrupoAction } from 'src/models/interfaces/grupo/event/DeleteGrupoAction';

@Component({
  selector: 'app-grupo-table',
  templateUrl: './grupo-table.component.html'
})
export class GrupoTableComponent {
  @Input() grupos: Array<Grupo> = [];
  @Output() grupoEvent = new EventEmitter<EventAction>();
  @Output() deleteGrupoEvent = new EventEmitter<DeleteGrupoAction>();

  public grupoSelected!: Grupo;

  public createGrupoEvent = GrupoEvent.CREATE_GRUPO_EVENT;
  public editGrupoEvent = GrupoEvent.EDIT_GRUPO_EVENT;
  public viewGruponarioEvent = GrupoEvent.VIEW_GRUPO_EVENT;

  public handleGrupoEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const grupoEventData = id && id !== null ? { action, id } : { action };
      this.grupoEvent.emit(grupoEventData);
    }
  }

  public handleDeleteGrupo(grupo_id: number, nome: string): void {
    if (grupo_id && grupo_id !== null) {
      const deleteGrupoEventData = { grupo_id, nome };
      this.deleteGrupoEvent.emit(deleteGrupoEventData);
    }
  }
}
