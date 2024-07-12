import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';

@Component({
  selector: 'app-grupo-view',
  templateUrl: './grupo-view.component.html'
})
export class GrupoViewComponent implements OnInit{
  grupo!: Grupo;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.grupo = this.config.data.grupo;
  }

  close() {
    this.ref.close();
  }
}
