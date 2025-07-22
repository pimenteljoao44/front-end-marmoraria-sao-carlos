import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProdutoEvent } from 'src/models/enums/produto/ProdutoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { DeleteProductAction } from 'src/models/interfaces/produto/event/DeleteProductAction';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-produto-table',
  templateUrl: './produto-table.component.html',
  styleUrls: ['./produto-table.component.css']
})
export class ProdutoTableComponent {
  @Input() produtos:Array<Produto> = [];
  @Output() produtoEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();
  @ViewChild('usersTable') usersTable!: Table;

  public produtoSelected!:Produto;

  public createProductEvent = ProdutoEvent.CREATE_PRODUCT_EVENT;
  public editProductEvent = ProdutoEvent.EDIT_PRODUCT_EVENT;
  public viewProductEvent = ProdutoEvent.VIEW_PRODUCT_EVENT;

  public handleProductEvent(action: string, id?: number): void {
    if (action !== undefined && action !== '') {
      const productEventData = id && id !== null ? { action, id } : { action };
      this.produtoEvent.emit(productEventData);
    }
  }

  public handleDeleteProduct(product_id: number, product_name: string): void {
    if (product_id && product_id !== null) {
      const deleteProductEventData = { product_id, product_name };
      this.deleteProductEvent.emit(deleteProductEventData);
    }
  }
  exportPDF() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(autoTable => {
        const doc = new jsPDF.default('landscape');

        const head = [[
          'ID',
          'Nome',
          'Preço',
          'Ativo',
          'Estoque',
          'Grupo'
        ]];

        const exportData: Produto[] = this.usersTable.filteredValue ?? this.produtos;

        const data = exportData.map((produto: Produto) => {
          return [
            produto?.id ?? '',
            produto?.nome ?? '',
            produto?.preco != null ? `R$ ${produto.preco.toFixed(2)}` : '',
            produto?.ativo ? 'Ativo' : 'Inativo',
            produto?.estoque ?? '',
            produto?.grupo?.nome ?? ''
          ];
        });

        autoTable.default(doc, {
          head,
          body: data,
          startY: 20,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [63, 81, 181] }
        });

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      });
    });
  }

}
