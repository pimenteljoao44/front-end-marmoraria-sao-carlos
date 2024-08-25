import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';

@Component({
  selector: 'app-fornecedores-view',
  templateUrl: './fornecedores-view.component.html',
  styleUrls: ['./fornecedores-view.component.scss']
})
export class FornecedoresViewComponent {
  fornecedor!: Fornecedor;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.fornecedor = this.config.data.fornecedor;
  }

  close() {
    this.ref.close();
  }
}
