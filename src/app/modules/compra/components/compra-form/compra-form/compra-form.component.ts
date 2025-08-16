import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil, forkJoin, map } from 'rxjs';

// --- IMPORTS DOS SEUS SERVIÇOS E INTERFACES ---
import { CompraService } from 'src/app/services/compra/compra.service';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { InstallmentRequestDTO } from 'src/app/services/parcela.service';
import { CompraEvent } from 'src/models/enums/compra/CompraEvent';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

interface ItemCompra {
  produto: Produto;
  quantidade: number;
  precoCusto: number;
}

@Component({
  selector: 'app-compra-form',
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.scss'],
})
export class CompraFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public form!: FormGroup;
  public isEditMode = false;
  private compraId?: number;

  // Listas de dados
  public fornecedores: Fornecedor[] = [];
  public funcionarios: Funcionario[] = [];
  public allProdutos: Produto[] = [];
  public produtoSuggestions: Produto[] = [];
  public items: ItemCompra[] = [];

  public formasPagamento = [
    { label: 'Dinheiro', value: 0 },
    { label: 'Pix', value: 1 },
    { label: 'Cartão de Crédito', value: 2 },
    { label: 'Cartão de Débito', value: 3 },
    { label: 'Boleto Bancário', value: 4 },
    { label: 'Transferência Bancária', value: 5 },
    { label: 'Cheque', value: 6 },
  ];

  // Parcelamento
  public installmentConfig: InstallmentRequestDTO | null = null;
  public installmentEnabled = false;
  public valorTotalCompra = 0;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private compraService: CompraService,
    private fornecedorService: FornecedorService,
    private funcionarioService: FuncionarioService,
    private produtoService: ProdutoService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    const action = this.dialogConfig.data?.event?.action;
    this.isEditMode = action === CompraEvent.EDIT_COMPRA_EVENT;
    this.compraId = this.dialogConfig.data?.event?.id;

    this.initForm();
    this.loadInitialData();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fornecedorId: [null, Validators.required],
      funcionarioId: [null, Validators.required],
      dataCompra: [new Date(), Validators.required],
      formaPagamento: [null, Validators.required],
      observacoes: [''],
      produto: [null],
      quantidade: [1, [Validators.min(1)]],
      precoCusto: [0, [Validators.min(0)]],
    });
  }

  private loadInitialData(): void {
    const loadFornecedores = this.fornecedorService.findAll();
    const loadFuncionarios = this.funcionarioService.findAll();
    const loadProdutos = this.produtoService.findAll();

    forkJoin([loadFornecedores, loadFuncionarios, loadProdutos])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fornecedores, funcionarios, produtos]) => {
        this.fornecedores = fornecedores;
        this.funcionarios = funcionarios;
        this.allProdutos = produtos;

        if (this.isEditMode && this.compraId) {
          this.loadCompraData(this.compraId);
        }
      });
  }

  private loadCompraData(id: number): void {
    const compra = this.dialogConfig.data.comprasList.find(
      (c: Compra) => c.comprId === id
    );

    if (compra) {
      this.form.patchValue({
        fornecedorId: compra.fornecedor,
        funcionarioId: compra.funcionario,
        dataCompra: new Date(compra.dataCompra),
        formaPagamento: compra.formaPagamento,
        observacoes: compra.observacoes,
      });

      this.items = compra.itensCompra.map((item: any) => ({
        produto: this.allProdutos.find(p => p.id === item.produto) as Produto,
        quantidade: item.quantidade,
        precoCusto: item.valor,
      }));
      this.calculateTotalValue();
    }
  }

  public searchProdutos(event: any): void {
    const query = event.query.toLowerCase();
    this.produtoSuggestions = this.allProdutos.filter((p) =>
      p.nome.toLowerCase().includes(query)
    );
  }

  public onProdutoSelect(event: any): void {
    const produto = event as Produto;
    this.form.get('precoCusto')?.setValue(produto.preco);
  }

  public addItem(): void {
    const formValues = this.form.value;
    const produto = formValues.produto as Produto;

    if (!produto || !formValues.quantidade || formValues.quantidade <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um produto e informe a quantidade.'});
      return;
    }

    if (this.items.some(item => item.produto.id === produto.id)) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Este produto já foi adicionado.'});
      return;
    }

    this.items.push({
      produto: produto,
      quantidade: formValues.quantidade,
      precoCusto: formValues.precoCusto,
    });

    this.form.patchValue({ produto: null, quantidade: 1, precoCusto: 0 });
    this.calculateTotalValue();
  }

  public editItem(item: ItemCompra, index: number): void {
    this.form.patchValue({
      produto: item.produto,
      quantidade: item.quantidade,
      precoCusto: item.precoCusto
    });
    this.removeItem(index, false);
  }

  public removeItem(index: number, recalculate = true): void {
    this.items.splice(index, 1);
    if (recalculate) {
      this.calculateTotalValue();
    }
  }

  private calculateTotalValue(): void {
    this.valorTotalCompra = this.items.reduce((total, item) => {
      return total + (item.precoCusto * item.quantidade);
    }, 0);
  }

  public onSubmit(): void {
    if (this.form.invalid || this.items.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos e adicione ao menos um item.' });
      return;
    }

    const formValues = this.form.value;

    // --- CORREÇÃO APLICADA AQUI ---
    // O tipo 'any' é usado para permitir a adição dinâmica das propriedades de parcelamento.
    const compraData: any = {
      observacoes: formValues.observacoes,
      valorTotal: this.valorTotalCompra,
      quantidadeTotal: this.items.reduce((acc, item) => acc + item.quantidade, 0),
      dataCompra: formValues.dataCompra,
      fornecedor: formValues.fornecedorId,
      funcionario: formValues.funcionarioId,
      formaPagamento: formValues.formaPagamento,
      installmentRequest: this.installmentEnabled ? this.installmentConfig : null,
      itensCompra: this.items.map((item) => ({
        quantidade: item.quantidade,
        valor: item.precoCusto,
        produto: item.produto.id,
      })),
    };

    // Adiciona os campos de parcelamento diretamente no objeto principal
    // para garantir que o backend os receba corretamente.
    if (this.installmentEnabled && this.installmentConfig) {
      compraData.numeroParcelas = this.installmentConfig.numeroParcelas;
      compraData.intervaloParcelas = this.installmentConfig.intervaloDias;
    }

    const request$ = this.isEditMode
      ? this.compraService.update({ ...compraData, comprId: this.compraId })
      : this.compraService.create(compraData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const detail = `Compra ${this.isEditMode ? 'atualizada' : 'registrada'} com sucesso!`;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Ocorreu um erro: ${err.message}` });
      },
    });
  }

  public onInstallmentConfigChange(config: InstallmentRequestDTO): void {
    this.installmentConfig = config;
  }

  public onInstallmentEnabledChange(enabled: boolean): void {
    this.installmentEnabled = enabled;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
