import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';

@Component({
  selector: 'app-funcionarios-view',
  templateUrl: './funcionarios-view.component.html',
  styleUrls: ['./funcionarios-view.component.scss']
})
export class FuncionariosViewComponent implements OnInit {
  funcionario!: Funcionario;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.funcionario = this.config.data.funcionario;
  }

  close() {
    this.ref.close();
  }
}
