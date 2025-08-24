import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormaPagamento, getDescricaoFormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { getDescricaoVendaTipo, VendaTipo } from 'src/models/enums/vendaTipo/VendaTipo';
import { Venda } from 'src/models/interfaces/venda/Venda';

@Component({
  selector: 'app-venda-view',
  templateUrl: './venda-view.component.html',
  styleUrls: ['./venda-view.component.scss']
})
export class VendaViewComponent implements OnInit {
  venda!: Venda;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.venda = this.config.data.venda;
    console.log(JSON.stringify(this.venda))
  }

  public getDescricaoFormaPagamento(cod?: FormaPagamento): string {
    return cod !== undefined ? getDescricaoFormaPagamento(cod) : 'Forma de pagamento não especificada';
  }

  public getDescricaoVendaTipo(cod?: VendaTipo): string {
    return cod !== undefined ? getDescricaoVendaTipo(cod) : 'Tipo de venda não especificado';
  }

  close() {
    this.ref.close();
  }
}
