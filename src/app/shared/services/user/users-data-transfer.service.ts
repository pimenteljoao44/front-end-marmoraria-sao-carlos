import { Usuario } from 'src/models/interfaces/User/Usuario';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersDataTransferService {

  public usersDataEmitter$ = new BehaviorSubject<Array<Usuario> | null>(null);
  public usersDatas: Array<Usuario> = [];

  setUsersDatas(users:Array<Usuario>):void {
    if (users) {
      this.usersDataEmitter$.next(users);
      this.getUsersDatas();
    }
  }

  getUsersDatas(){
   this.usersDataEmitter$
   .pipe(
    take(1)
   ).subscribe({
    next:(response) => {
      if (response) {
        this.usersDatas = response
      }
    }
   });
   return this.usersDatas;
  }
}
