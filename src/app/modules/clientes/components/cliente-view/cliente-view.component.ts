import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.scss']
})
export class ClienteViewComponent implements OnInit {
  cliente!: Cliente;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.cliente = this.config.data.cliente;
  }

  close() {
    this.ref.close();
  }
}
