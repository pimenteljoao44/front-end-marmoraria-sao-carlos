import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Estado } from 'src/models/interfaces/estado/Estado';

@Component({
  selector: 'app-estado-view',
  templateUrl: './estado-view.component.html',
  styleUrls: ['./estado-view.component.scss']
})
export class EstadoViewComponent implements OnInit {
  estado!: Estado;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.estado = this.config.data.estado;
  }

  close() {
    this.ref.close();
  }
}
