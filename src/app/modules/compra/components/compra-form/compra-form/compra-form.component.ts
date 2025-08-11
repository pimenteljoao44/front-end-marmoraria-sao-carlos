import { FuncionariosViewComponent } from './../../../../funcionarios/components/funcionarios-view/funcionarios-view.component';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { CompraService } from 'src/app/services/compra/compra.service';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { InstallmentRequestDTO } from 'src/app/services/parcela.service';
import { CompraEvent } from 'src/models/enums/compra/CompraEvent';
import { FormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-compra-form',
  templateUrl: './compra-form.component.html',
  styleUrls: ['./compra-form.component.scss'],
})
export class CompraFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public compraAction!: {
    event: EventAction;
    comprasList: Array<Compra>;
  };

  public addCompraForm: FormGroup;
  public editCompraForm: FormGroup;
  public fornecedores: Fornecedor[] = [];
  public funcionarios: Funcionario[] = [];
  public produtos: Produto[] = [];
  public items: any[] = [];
  public allProdutos: Produto[] = [];
  public allFornecedores: Fornecedor[] = [];
  public formasPagamento: any[] = [];
  public allFormasPagamento: any[] = [];
  public formaPagamentoSelected!: {value: number; label: string };
  public allFuncionarios: Funcionario[] = [];
  public produtoSelectedDatas!: Produto;
  public fornecedorSelectedDatas!: Fornecedor;
  public funcionarioSelectedDatas!: Funcionario;
  public formaPagamentoSelectedDatas!: any;

  public addCompraAction = CompraEvent.CREATE_COMPRA_EVENT;
  public editCompraAction = CompraEvent.EDIT_COMPRA_EVENT;

  // Propriedades para parcelamento
  public installmentConfig: InstallmentRequestDTO | null = null;
  public installmentEnabled = false;
  public valorTotalCompra = 0;

  constructor(
    private messageService: MessageService,
    private datePipe: DatePipe,
    private compraService: CompraService,
    private formBuilder: FormBuilder,
    private funcionarioService: FuncionarioService,
    private fornecedoresService: FornecedorService,
    private produtoService: ProdutoService,
    private ref: DynamicDialogConfig
  ) {
    this.addCompraForm = this.formBuilder.group({
      fornecedor: [0, Validators.min(1)],
      funcionario: [0, Validators.min(1)],
      produto: [0],
      quantidade: [0],
      precoUnitario: [0],
      dataCompra: [this.getDate(), Validators.required],
      formaPagamento: [null, Validators.required],
      observacoes: [''],
      numeroParcelas: [1],
      intervaloParcelas: [30],
    });

    this.editCompraForm = this.formBuilder.group({
      id: [0],
      fornecedor: [0, Validators.min(1)],
      funcionario: [0, Validators.min(1)],
      produto: [0],
      quantidade: [0],
      precoUnitario: [0],
      dataCompra: [this.getDate(), Validators.required],
      formaPagamento: [null, Validators.required],
      observacoes: [''],
      numeroParcelas: [1],
      intervaloParcelas: [30],
    });
  }

  ngOnInit(): void {
    this.compraAction = this.ref.data;
    this.loadInitialData()
      .then(() => {
        if (
          this.compraAction.event.action === this.editCompraAction &&
          this.compraAction?.comprasList.length > 0
        ) {
          const allCompras = this.compraAction.comprasList;
          const compraId = this.compraAction?.event?.id as number;
          const compraFiltered = allCompras.find(
            (element) => element?.comprId === compraId
          );
          const firstItem = compraFiltered?.itensCompra?.[0] ?? {};

          this.fornecedorSelectedDatas = this.allFornecedores.find(
            (f) => f.id === compraFiltered?.fornecedor
          ) as Fornecedor;
          this.funcionarioSelectedDatas = this.allFuncionarios.find(
            (f) => f.id === compraFiltered?.funcionario
          ) as Funcionario;
          this.produtoSelectedDatas = this.allProdutos.find(
            (p) => p.id === firstItem.produto?.id
          ) as Produto;
          this.formaPagamentoSelectedDatas = this.allFormasPagamento.find(
            (f) => f.cod === compraFiltered?.formaPagamento
          ) as FormaPagamento;
          this.getCompraSelectedDatas(compraId);
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar dados iniciais:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados iniciais.',
          life: 3000,
        });
      });
  }

  loadAllFormasPagamento(): void {
    this.allFormasPagamento = [
      { value: 0, label: 'Dinheiro' },
      { value: 1, label: 'Pix' },
      { value: 2, label: 'Cartão de Crédito' },
      { value: 3, label: 'Cartão de Débito' },
      { value: 4, label: 'Boleto Bancário' },
      { value: 5, label: 'Transferência Bancária' },
      { value: 6, label: 'Cheque' },
    ];
  }

  loadAllProdutos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.produtoService
        .findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allProdutos = response;
            resolve();
          },
          error: (err) => {
            console.error('Erro ao carregar produtos:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar produtos.',
              life: 3000,
            });
            reject(err);
          },
        });
    });
  }

  loadAllFornecedores(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fornecedoresService
        .findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allFornecedores = response;
            resolve();
          },
          error: (err) => {
            console.error('Erro ao carregar fornecedores:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar fornecedores.',
              life: 3000,
            });
            reject(err);
          },
        });
    });
  }

  loadAllFuncionarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.funcionarioService
        .findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allFuncionarios = response;
            resolve();
          },
          error: (err) => {
            console.error('Erro ao carregar funcionários:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar funcionários.',
              life: 3000,
            });
            reject(err);
          },
        });
    });
  }

  searchFornecedores(event: any) {
    const query = event.query.toLowerCase();
    this.fornecedores = this.allFornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(query)
    );
  }

  searchFuncionarios(event: any) {
    const query = event.query.toLowerCase();
    this.funcionarios = this.allFuncionarios.filter((funcionario) =>
      funcionario.nome.toLowerCase().includes(query)
    );
  }

  searchProdutos(event: any) {
    const query = event.query.toLowerCase();
    this.produtos = this.allProdutos.filter((produto) =>
      produto.nome.toLowerCase().includes(query)
    );
  }

  searchFormasPagamento(event: any) {
    const query = event.query.toLowerCase();
    this.formasPagamento = this.allFormasPagamento.filter((formaPagamento) =>
      formaPagamento.nome.toLowerCase().includes(query)
    );
  }

  onProdutoSelect(event: any): void {
    const selectedProduto = event?.value;
    if (selectedProduto) {
      if (this.compraAction.event.action === 'Fazer uma compra') {
        this.addCompraForm.patchValue({
          produto: selectedProduto,
          precoUnitario: selectedProduto.preco,
        });
      } else if (this.compraAction.event.action === 'Editar a compra') {
        this.editCompraForm.patchValue({
          produto: selectedProduto,
          precoUnitario: selectedProduto.preco,
        });
      }
    }
  }

  onFormaPagamentoSelect(event: any): void {
    const selectedFormaPagamento = event?.value;
    if (selectedFormaPagamento) {
      this.addCompraForm.patchValue({
        formaPagamento: selectedFormaPagamento.cod,
      });
    }
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  loadInitialData(): Promise<void> {
    return Promise.all([
      this.loadAllFornecedores(),
      this.loadAllFuncionarios(),
      this.loadAllProdutos(),
    ]).then(() => {
      this.loadAllFormasPagamento(); // Isso pode ser carregado paralelamente ou após as chamadas principais
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getCompraSelectedDatas(compra_id: number): void {
    const allCompras = this.compraAction.comprasList;

    const compraFiltered = allCompras.find(
      (element) => element?.comprId === compra_id
    );

    if (compraFiltered) {
      const dataCompraFormatada = new Date(compraFiltered.dataCompra as Date)
        .toISOString()
        .split('T')[0];

      // Atualiza os campos principais do formulário
      this.editCompraForm.patchValue({
        id: compraFiltered.comprId,
        fornecedor: this.fornecedorSelectedDatas,
        funcionario: this.funcionarioSelectedDatas,
        produto: this.produtoSelectedDatas,
        quantidade: 0,
        precoUnitario: 0,
        dataCompra: dataCompraFormatada,
        formaPagamento: this.formaPagamentoSelectedDatas,
        observacoes: compraFiltered.observacoes ?? '',
      });

      // Mapeia os itens da compra para adicionar nomes dos produtos
      const produtos$ = compraFiltered.itensCompra?.map((item) =>
        this.produtoService.findById(item.produto).pipe(
          map((produto) => ({
            produto,
            quantidade: item.quantidade,
            valor: item.valor,
            produtoNome: produto.nome, // Inclui o nome do produto
          }))
        )
      );

      // Executa todas as requisições para obter os produtos
      if (produtos$) {
        forkJoin(produtos$).subscribe({
          next: (itemsWithNames) => {
            this.items = itemsWithNames;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao buscar os nomes dos produtos.',
              life: 3000,
            });
            console.error(err);
          },
        });
      } else {
        this.items = [];
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Compra não encontrada.',
        life: 3000,
      });
    }
  }

  handleSubmitUpdateCompra(): void {
    if (this.editCompraForm.invalid) {
      this.markFormGroupTouched(this.editCompraForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    const valorTotal = this.items
      .reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    const quantidadeTotal = this.items
      .reduce((acc, item) => acc + item.quantidade, 0);

    const compraData = {
      comprId: this.editCompraForm.value.id,
      observacoes: this.editCompraForm.value.observacoes,
      valorTotal: valorTotal,
      quantidadeTotal: quantidadeTotal,
      dataCompra: this.editCompraForm.value.dataCompra,
      fornecedor: this.editCompraForm.value.fornecedor.id,
      funcionario: this.editCompraForm.value.funcionario.id,
      formaPagamento: this.editCompraForm.value.formaPagamento,
      itensCompra: this.items.map((item) => ({
        quantidade: item.quantidade.toString(),
        valor: item.valor,
        produto: item.produto.id,
      })),
    };

    this.compraService
      .update(compraData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Compra atualizada com sucesso!',
            life: 2000,
          });
          this.resetForms();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao atualizar compra: ${err.message}`,
            life: 2000,
          });
        },
      });
  }

  handleAddItem(): void {
    // Determina qual formulário usar com base na ação
    const form =
      this.compraAction.event.action === 'Fazer uma compra'
        ? this.addCompraForm
        : this.editCompraForm;

    if (!form) {
      console.error('Ação desconhecida ou formulário não encontrado.');
      return;
    }

    const produtoId = form.value.produto.id;

    // Encontra o produto na lista de todos os produtos
    const produto = this.allProdutos.find((p) => p.id === produtoId);

    // Verifica se o produto existe
    if (produto) {
      // Verifica se o produto já está na lista de itens
      if (this.items.some((item) => item.produto.id === produtoId)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: `O produto ${produto.nome} já está adicionado na lista.`,
        });
        return;
      }

      // Cria o novo item a ser adicionado
      const item = {
        produto: produto,
        quantidade: form.value.quantidade,
        valor: form.value.precoUnitario,
      };

      if (
        form.value.quantidade !== null &&
        form.value.quantidade !== undefined &&
        form.value.quantidade < 0
      ) {
        this.markFormGroupTouched(form);
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'A quantidade deve ser maior do que zero',
          life: 3000,
        });
        return;
      }

      // Adiciona o item à lista de itens
      this.items.push(item);

      // Limpa os campos do formulário
      form.patchValue({
        produto: null,
        quantidade: 0,
        precoUnitario: 0,
      });
    } else {
      console.error('Produto não encontrado.');
    }
  }

  removeItem(item: any): void {
    this.items = this.items.filter((i) => i !== item);
  }

  editItem(item: any): void {
    const form =
      this.compraAction.event.action === 'Fazer uma compra'
        ? this.addCompraForm
        : this.editCompraForm;

    if (!form) {
      console.error('Ação desconhecida ou formulário não encontrado.');
      return;
    }
    // volta os dados do item que está na lista para o formulario
    form.patchValue({
      produto: item.produto,
      quantidade: item.quantidade,
      precoUnitario: item.valor
    })
    // remove o item que foi para o formulario da lista de itens
    this.items = this.items.filter((i) => i !== item);

  }

  handleSubmit(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addCompraForm.controls).forEach((controlName) => {
      const control = this.addCompraForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addCompraForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const valorTotal = this.items
      .reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    const quantidadeTotal = this.items
      .reduce((acc, item) => acc + item.quantidade, 0);

    const compraData = {
      observacoes: this.addCompraForm.value.observacoes,
      valorTotal: valorTotal,
      quantidadeTotal: quantidadeTotal,
      dataCompra: this.addCompraForm.value.dataCompra,
      fornecedor: this.addCompraForm.value.fornecedor.id,
      funcionario: this.addCompraForm.value.funcionario.id,
      formaPagamento: this.addCompraForm.value.formaPagamento,
      numeroParcelas: this.addCompraForm.value.numeroParcelas || 1,
      intervaloParcelas: this.addCompraForm.value.intervaloParcelas || 30,
      installmentRequest: this.installmentEnabled ? this.installmentConfig : null,
      itensCompra: this.items.map((item) => ({
        quantidade: item.quantidade.toString(),
        valor: item.valor,
        produto: item.produto.id,
      })),
    };

    this.compraService
      .create(compraData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Compra realizada com sucesso!',
            life: 2000,
          });
          this.resetForms();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar compra: ${err.message}`,
            life: 2000,
          });
        },
      });
  }

  resetForms(): void {
    this.addCompraForm.reset();
    this.addCompraForm.patchValue({
      dataCompra: this.getDate(),
    });
    this.items = [];
    this.installmentConfig = null;
    this.installmentEnabled = false;
    this.valorTotalCompra = 0;
  }

  // Métodos para parcelamento
  onInstallmentConfigChange(config: InstallmentRequestDTO): void {
    this.installmentConfig = config;
    if (config) {
      this.addCompraForm.patchValue({
        numeroParcelas: config.numeroParcelas,
        intervaloParcelas: config.intervaloDias
      });
      this.editCompraForm.patchValue({
        numeroParcelas: config.numeroParcelas,
        intervaloParcelas: config.intervaloDias
      });
    }
  }

  onInstallmentEnabledChange(enabled: boolean): void {
    this.installmentEnabled = enabled;
    if (!enabled) {
      this.installmentConfig = null;
      this.addCompraForm.patchValue({
        numeroParcelas: 1,
        intervaloParcelas: 30
      });
      this.editCompraForm.patchValue({
        numeroParcelas: 1,
        intervaloParcelas: 30
      });
    }
  }

  calculateTotalValue(): void {
    this.valorTotalCompra = this.items.reduce((total, item) => {
      return total + (item.valor * item.quantidade);
    }, 0);
  }

  addItem(): void {
    const produto = this.addCompraForm.value.produto;
    const quantidade = this.addCompraForm.value.quantidade;
    const precoUnitario = this.addCompraForm.value.precoUnitario;

    if (produto && quantidade > 0 && precoUnitario > 0) {
      const existingItemIndex = this.items.findIndex(
        (item) => item.produto.id === produto.id
      );

      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantidade += quantidade;
        this.items[existingItemIndex].valor = precoUnitario;
      } else {
        this.items.push({
          produto: produto,
          quantidade: quantidade,
          valor: precoUnitario,
        });
      }

      this.addCompraForm.patchValue({
        produto: null,
        quantidade: 0,
        precoUnitario: 0,
      });

      this.calculateTotalValue();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
