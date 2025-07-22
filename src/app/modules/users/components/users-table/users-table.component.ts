import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { UserEvent } from 'src/models/enums/user/UserEvent';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { DeleteUserAction } from 'src/models/interfaces/User/event/DeleteUserAction';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import {Table} from "primeng/table";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent {
  @Input() usuarios: Array<Usuario> = [];
  @Output() userEvent = new EventEmitter<EventAction>();
  @Output() deleteUserEvent = new EventEmitter<DeleteUserAction>();
  @ViewChild('usersTable') usersTable!: Table;
  public userSelected!: Usuario;

  public createUserEvent = UserEvent.CREATE_USER_EVENT;
  public editUserEvent = UserEvent.EDIT_USER_EVENT;

  public handleUserEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const userEventData = id && id !== null ? { action, id } : { action };
      this.userEvent.emit(userEventData);
    }
  }

  handleDeleteUser(user_id:number,nome:string):void{
    if (user_id && user_id !== null) {
     this.deleteUserEvent.emit({user_id,nome})
    }
  }


  exportPDF() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(autoTable => {
        const doc = new jsPDF.default();

        const head = [['ID', 'Nome', 'Login', 'Email', 'Nivel de Acesso']];
        const exportData = this.usersTable.filteredValue ?? this.usuarios;

        const data = exportData.map((user: Usuario) => [
          user?.id ?? '',
          user?.nome ?? '',
          user?.login ?? '',
          user?.email ?? '',
          user?.nivelAcesso ?? ''
        ]);

        autoTable.default(doc, {
          head: head,
          body: data
        });

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      });
    });
  }
}
