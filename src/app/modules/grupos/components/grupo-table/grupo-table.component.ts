import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GrupoEvent } from 'src/models/enums/grupo/GrupoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';
import { DeleteGrupoAction } from 'src/models/interfaces/grupo/event/DeleteGrupoAction';
import { Table } from 'primeng/table';
import {Produto} from "../../../../../models/interfaces/produto/Produto";
@Component({
  selector: 'app-grupo-table',
  templateUrl: './grupo-table.component.html'
})
export class GrupoTableComponent {
  @Input() grupos: Array<Grupo> = [];
  @Output() grupoEvent = new EventEmitter<EventAction>();
  @Output() deleteGrupoEvent = new EventEmitter<DeleteGrupoAction>();
  @ViewChild('usersTable') usersTable!: Table;
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

  exportPDF() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(autoTable => {
        const doc = new jsPDF.default('landscape');

        const head = [[
          'ID',
          'Nome',
          'Ativo',
          'Grupo Pai'
        ]];

        const exportData: Grupo[] = this.usersTable.filteredValue ?? this.grupos;

        const data = exportData.map((grupo: Grupo) => {
          return [
            grupo?.id ?? '',
            grupo?.nome ?? '',
            grupo?.ativo ? 'Ativo' : 'Inativo',
            grupo.grupoPaiNome ?? ''
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
