import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormaPagamento, getDescricaoFormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { Compra } from 'src/models/interfaces/compra/Compra';

@Component({
  selector: 'app-compra-view',
  templateUrl: './compra-view.component.html',
  styleUrls: ['./compra-view.component.scss']
})
export class CompraViewComponent implements OnInit {
  compra!: Compra;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.compra = this.config.data.compra;
  }

  public getDescricaoFormaPagamento(cod?: FormaPagamento): string {
    return cod !== undefined ? getDescricaoFormaPagamento(cod) : 'Forma de pagamento não especificada';
  }

  close() {
    this.ref.close();
  }
}
