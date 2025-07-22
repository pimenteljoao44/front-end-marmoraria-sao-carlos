import { Cliente } from './../../../../../models/interfaces/cliente/Cliente';
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { VendaService } from 'src/app/services/venda/venda.service';
import { FormaPagamento } from 'src/models/enums/formaPagamento/FormaPagamento';
import { VendaEvent } from 'src/models/enums/venda/VendaEvent';
import { getDescricaoVendaTipo, VendaTipo } from 'src/models/enums/vendaTipo/VendaTipo';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Venda } from 'src/models/interfaces/venda/Venda';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.scss'],
})
export class VendaFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public vendaAction!: {
    event: EventAction;
    vendasList: Array<Venda>;
  };
  public addVendaForm: FormGroup;
  public editVendaForm: FormGroup;
  public clientes: Cliente[] = [];
  public produtos: Produto[] = [];
  public items: any[] = [];
  public allProdutos: Produto[] = [];
  public allClientes: Cliente[] = [];
  public formasPagamento: any[] = [];
  public allFormasPagamento: any[] = [];
  public formaPagamentoSelected: Array<{value: number; label: string }> = [];
  public vendaTipoSelected: Array<{value: number; label: string }> = [];
  public vendaTipos: any[] = [];
  public produtoSelectedDatas!: Produto;
  public clienteSelectedDatas!: Cliente;
  public formaPagamentoSelectedDatas!: any;

  public addVendaAction = VendaEvent.CREATE_VENDA_EVENT;
  public editVendaAction = VendaEvent.EDIT_VENDA_EVENT;

  constructor(
    private messageService: MessageService,
    private datePipe: DatePipe,
    private vendaService: VendaService,
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private produtoService: ProdutoService,
    private ref: DynamicDialogConfig
  ) {
    this.addVendaForm = this.formBuilder.group({
      cliente: [0, Validators.required],
      dataAbertura: [this.getDate(), Validators.required],
      dataFechamento: [this.getDate(), Validators.required],
      desconto: [0, Validators.min(0)],
      formaPagamento: [null, Validators.required],
      total: [0, Validators.min(0)],
      vendaTipo: [null, Validators.required],
      produto: [0],
      quantidade: [0],
      precoUnitario: [0, Validators.min(0)],
    });

    this.editVendaForm = this.formBuilder.group({
      id: [0, Validators.min(1)],
      cliente: [0, Validators.required],
      dataAbertura: [this.getDate(), Validators.required],
      dataFechamento: [this.getDate(), Validators.required],
      desconto: [0, Validators.min(0)],
      formaPagamento: [null, Validators.required],
      total: [0, Validators.min(0)],
      vendaTipo: [null, Validators.required],
      produto: [0],
      quantidade: [0],
      precoUnitario: [0, Validators.min(0)],
    });
  }

  ngOnInit(): void {
    this.vendaAction = this.ref.data;
    this.loadInitialData()
      .then(() => {
        if (
          this.vendaAction.event.action === this.editVendaAction &&
          this.vendaAction?.vendasList.length > 0
        ) {
          const allVendas = this.vendaAction.vendasList;
          const vendaId = this.vendaAction?.event?.id as number;
          const vendaFiltered = allVendas.find(
            (element) => element?.id === vendaId
          );
          const firstItem = vendaFiltered?.itensVenda?.[0] ?? {};

          this.clienteSelectedDatas = this.allClientes.find(
            (f) => f.id === vendaFiltered?.cliente
          ) as Cliente;
          this.produtoSelectedDatas = this.allProdutos.find(
            (p) => p.id === firstItem.produto?.id
          ) as Produto;
          this.formaPagamentoSelectedDatas = this.allFormasPagamento.find(
            (f) => f.cod === vendaFiltered?.formaPagamento
          ) as FormaPagamento;
          this.getVendaSelectedDatas(vendaId);
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

  loadTiposVenda(): void {
    this.vendaTipos = [
      { value: 0, label: 'Venda' },
      { value: 1, label: 'Orçamento' },
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

  loadAllClientes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clienteService
        .findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.allClientes = response;
            resolve();
          },
          error: (err) => {
            console.error('Erro ao carregar clientes:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar clientes.',
              life: 3000,
            });
            reject(err);
          },
        });
    });
  }

  searchClientes(event: any) {
    const query = event.query.toLowerCase();
    this.clientes = this.allClientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(query)
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

  searchVendaTipos(event: any) {
    const query = event.query.toLowerCase();
    this.vendaTipos = this.vendaTipos.filter((vendaTipo) =>
      vendaTipo.nome.toLowerCase().includes(query)
    );
  }

  onProdutoSelect(event: any): void {
    const selectedProduto = event?.value;
    if (selectedProduto) {
      if (this.vendaAction.event.action === 'Fazer uma venda') {
        this.addVendaForm.patchValue({
          produto: selectedProduto,
          precoUnitario: selectedProduto.preco,
        });
      } else if (this.vendaAction.event.action === 'Editar a venda') {
        this.editVendaForm.patchValue({
          produto: selectedProduto,
          precoUnitario: selectedProduto.preco,
        });
      }
    }
  }

  onFormaPagamentoSelect(event: any): void {
    const selectedFormaPagamento = event?.value;
    if (selectedFormaPagamento) {
      this.addVendaForm.patchValue({
        formaPagamento: selectedFormaPagamento.cod,
      });
    }
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  loadInitialData(): Promise<void> {
    return Promise.all([
      this.loadAllClientes(),
      this.loadAllProdutos(),
      this.loadTiposVenda(),
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

  getVendaSelectedDatas(venda_id: number): void {
    const allVendas = this.vendaAction.vendasList;

    const vendaFiltered = allVendas.find((element) => element?.id === venda_id);

    if (vendaFiltered) {
      const dataAberturaFormatada = new Date(vendaFiltered.dataAbertura as Date)
        .toISOString()
        .split('T')[0];

      const dataFechamentoFormatada = new Date(
        vendaFiltered.dataFechamento as Date
      )
        .toISOString()
        .split('T')[0];

      this.editVendaForm.patchValue({
        id: vendaFiltered.id,
        cliente: this.clienteSelectedDatas,
        dataAbertura: dataAberturaFormatada,
        dataFechamento: dataFechamentoFormatada,
        desconto: vendaFiltered.desconto,
        total: vendaFiltered.total,
        vendaTipo: vendaFiltered.vendaTipo,
        formaPagamento: vendaFiltered.formaPagamento,
      });

      // Mapeia os itens da venda para adicionar nomes dos produtos
      const produtos$ = vendaFiltered.itensVenda?.map((item) =>
        this.produtoService.findById(item.produto).pipe(
          map((produto) => ({
            produto: produto.id,
            quantidade: item.quantidade,
            precoUnitario: item.preco,
          }))
        )
      );

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
        detail: 'Venda não encontrada.',
        life: 3000,
      });
    }
  }

  handleSubmitUpdateVenda(): void {
    if (this.editVendaForm.invalid) {
      this.markFormGroupTouched(this.editVendaForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    const valorTotal = this.items.reduce(
      (acc, item) => acc + item.valor * item.quantidade,
      0
    );
    const quantidadeTotal = this.items.reduce(
      (acc, item) => acc + item.quantidade,
      0
    );
    const vendaData = {
      id: this.editVendaForm.value.id,
      cliente: this.editVendaForm.value.cliente.id,
      clienteNome: this.clienteSelectedDatas.nome,
      valorTotal: valorTotal,
      quantidadeTotal: quantidadeTotal,
      dataAbertura: this.editVendaForm.value.dataAbertura,
      formaPagamento: this.editVendaForm.value.formaPagamento,
      vendaTipo: this.editVendaForm.value.vendaTipo,
      itensVenda: this.items.map((item) => ({
        quantidade: item.quantidade,
        precoUnitario: item.preco,
        produto: item.produto,
      })),
    };

    console.log('Dados da venda: ', JSON.stringify(vendaData));

    this.vendaService
      .update(vendaData as Venda)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Venda atualizada com sucesso!',
            life: 2000,
          });
          this.resetForms();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao atualizar venda: ${err.message}`,
            life: 2000,
          });
        },
      });
  }

  handleAddItem(): void {
    const form =
      this.vendaAction.event.action === 'Fazer uma venda'
        ? this.addVendaForm
        : this.editVendaForm;

    if (!form) {
      console.error('Ação desconhecida ou formulário não encontrado.');
      return;
    }
    const produtoId = form.value.produto.id;

    const produto = this.allProdutos.find((p) => p.id === produtoId);

    if (produto) {
      if (this.items.some((item) => item.produto.id === produtoId)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: `O produto ${produto.nome} já está adicionado na lista.`,
        });
        return;
      }
      const item = {
        produto: produto,
        quantidade: form.value.quantidade,
        precoUnitario: form.value.precoUnitario,
      };

      if (produto.estoque < form.value.quantidade) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: `O estoque do produto ${produto.nome} é insuficiente para adicionar ${form.value.quantidade} unidades.`,
        });
        return;
      }

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

      this.items.push(item);
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
      this.vendaAction.event.action === 'Fazer uma venda'
        ? this.addVendaForm
        : this.editVendaForm;

    if (!form) {
      console.error('Ação desconhecida ou formulário não encontrado.');
      return;
    }
    // volta os dados do item que está na lista para o formulario
    form.patchValue({
      produto: item.produto,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
    });
    // remove o item que foi para o formulario da lista de itens
    this.items = this.items.filter((i) => i !== item);
  }

  handleSubmit(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addVendaForm.controls).forEach((controlName) => {
      const control = this.addVendaForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addVendaForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const valorTotal = this.items.reduce(
      (acc, item) => acc + item.valor * item.quantidade,
      0
    );
    const quantidadeTotal = this.items.reduce(
      (acc, item) => acc + item.quantidade,
      0
    );
    this.clienteSelectedDatas = this.allClientes.find(
      (clente) => clente.id === this.addVendaForm.value.cliente.id
    ) as Cliente;

    const vendaData = {
      cliente: this.addVendaForm.value.cliente.id,
      clienteNome: this.clienteSelectedDatas.nome,
      observacoes: this.addVendaForm.value.observacoes,
      valorTotal: valorTotal,
      desconto: this.addVendaForm.value.desconto,
      quantidadeTotal: quantidadeTotal,
      dataAbertura: this.addVendaForm.value.dataAbertura,
      dataFechamento: this.addVendaForm.value.dataFechamento,
      formaPagamento: this.addVendaForm.value.formaPagamento,
      vendaTipo: this.addVendaForm.value.vendaTipo,
      itensVenda: this.items.map((item) => ({
        quantidade: item.quantidade,
        preco: item.precoUnitario,
        produto: item.produto.id,
      })),
    } as Venda;
    console.log('Dados da venda: ', JSON.stringify(vendaData));
    this.vendaService
      .create(vendaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Venda realizada com sucesso!',
            life: 2000,
          });
          this.resetForms();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar venda: ${err.message}`,
            life: 2000,
          });
        },
      });
  }

  resetForms(): void {
    this.addVendaForm.reset();
    this.addVendaForm.patchValue({
      dataAbertura: this.getDate(),
    });
    this.items = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
