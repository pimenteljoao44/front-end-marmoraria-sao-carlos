import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { Produto } from 'src/models/interfaces/produto/Produto';

@Component({
  selector: 'app-produto-view',
  templateUrl: './produto-view.component.html',
})
export class ProdutoViewComponent implements OnInit {
  public produto!: Produto;
  public fornecedor!: Fornecedor;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.produto = this.config.data?.produto;
  }

  getfornecedor(): void {}

  close() {
    this.ref.close();
  }
}
