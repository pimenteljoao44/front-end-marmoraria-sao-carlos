import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserEvent } from 'src/models/enums/user/UserEvent';
import { Usuario } from 'src/models/interfaces/User/Usuario';
import { DeleteUserAction } from 'src/models/interfaces/User/event/DeleteUserAction';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent {
  @Input() usuarios: Array<Usuario> = [];
  @Output() userEvent = new EventEmitter<EventAction>();
  @Output() deleteUserEvent = new EventEmitter<DeleteUserAction>();

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
}
