import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, AbstractControl} from '@angular/forms';
import { VendaUnificadaService } from '../../../../services/venda-unificada.service';

@Component({
  selector: 'app-venda-itens',
  templateUrl: './venda-itens.component.html',
  styleUrls: ['./venda-itens.component.scss']
})
export class VendaItensComponent implements OnInit {
  @Input() itensFormArray!: FormArray;
  @Input() produtos: any[] = [];
  @Output() itemAdicionado = new EventEmitter<void>();
  @Output() itemRemovido = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    private vendaService: VendaUnificadaService
  ) {}

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  ngOnInit(): void {}

  onProdutoChange(itemFormGroup: FormGroup, produtoId: number) {
    const produto = this.produtos.find(p => p.id === produtoId);
    if (produto) {
      itemFormGroup.get('preco')!.setValue(produto.precoVenda);
      itemFormGroup.get('quantidade')!.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(produto.quantidade)
      ]);
      itemFormGroup.get('quantidade')!.updateValueAndValidity();
    }
  }

  adicionarItem() {
    const itemForm = this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(0.01)]],
      preco: [0, [Validators.required, Validators.min(0)]],
      observacoes: [null]
    });

    this.itensFormArray.push(itemForm);
    this.itemAdicionado.emit();
  }

  removerItem(index: number) {
    this.itensFormArray.removeAt(index);
    this.itemRemovido.emit(index);
  }

  calcularSubtotal(item: any): number {
    return (item.quantidade || 0) * (item.preco || 0);
  }

  formatCurrency = this.vendaService.formatCurrency.bind(this.vendaService);
}

