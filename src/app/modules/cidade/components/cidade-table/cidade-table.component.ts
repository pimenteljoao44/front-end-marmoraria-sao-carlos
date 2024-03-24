import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CidadeEvent } from 'src/models/enums/cidade/CidadeEvent';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { DeleteCidadeAction } from 'src/models/interfaces/cidade/event/DeleteCidadeAction';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-cidade-table',
  templateUrl: './cidade-table.component.html',
  styleUrls: ['./cidade-table.component.scss']
})
export class CidadeTableComponent {
  @Input() cidades: Array<Cidade> = [];
  @Output() cidadeEvent = new EventEmitter<EventAction>();
  @Output() deleteCidadeEvent = new EventEmitter<DeleteCidadeAction>();

  public citySelected!: Cidade;

  public createCidadeEvent = CidadeEvent.CREATE_CITY_EVENT;
  public editCidadeEvent = CidadeEvent.EDIT_CITY_EVENT;
  public viewCidadeEvent = CidadeEvent.VIEW_CITY_EVENT;

  public handleCidadeEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const cityEventData = id && id !== null ? { action, id } : { action };
      this.cidadeEvent.emit(cityEventData);
    }
  }

  handleDeleteCidade(cid_id:number,nome:string):void{
    console.log('Chamou')
    if (cid_id && cid_id !== null) {
     this.deleteCidadeEvent.emit({cid_id,nome})
    }
  }
}
