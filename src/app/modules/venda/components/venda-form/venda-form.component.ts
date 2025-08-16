import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {ParcelaDTO, VendaService} from "../../../../services/venda/venda.service";
import {Produto} from "../../../../../models/interfaces/produto/Produto";
import {Projeto} from "../../../../../models/interfaces/projeto/Projeto";
import {Cliente} from "../../../../../models/interfaces/cliente/Cliente";
import {ItemVenda} from "../../../../../models/interfaces/venda/ItemVenda";
import {ProdutoService} from "../../../../services/produto/produto.service";
import {ProjetoService} from "../../../../services/projeto/projeto.service";
import {ClientesService} from "../../../../services/clientes/clientes.service";
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.scss']
})
export class VendaFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  tipoVendaAtual: string = 'PRODUTO';
  permiteParcelamento: boolean = false;

  tiposVenda = [
    { label: 'Venda de Produto', value: 'PRODUTO' },
    { label: 'Venda de Projeto', value: 'PROJETO' }
  ];

  formasPagamento = [
    { label: 'Dinheiro', value: 0, permiteParcelamento: false },
    { label: 'Pix', value: 1, permiteParcelamento: false },
    { label: 'Cartão de Crédito', value: 2, permiteParcelamento: true },
    { label: 'Cartão de Débito', value: 3, permiteParcelamento: false },
    { label: 'Boleto Bancário', value: 4, permiteParcelamento: true },
    { label: 'Transferência Bancária', value: 5, permiteParcelamento: false },
    { label: 'Cheque', value: 6, permiteParcelamento: true }
  ];

  produtos: Produto[] = [];
  projetos: Projeto[] = [];
  projetosAprovados: Projeto[] = [];
  clientes: Cliente[] = [];
  items: ItemVenda[] = [];
  parcelas: ParcelaDTO[] = [];

  // Variáveis de cache para totais
  subtotalValue: number = 0;
  totalValue: number = 0;

  // Flag para controle de recursão
  private calcularParcelasDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private vendaService: VendaService,
    private produtoService: ProdutoService,
    private projetoService: ProjetoService,
    private clienteService: ClientesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.form = this.createForm();
    this.setupFormListeners();
  }

  private loadInitialData(): void {
    this.loading = true;

    Promise.all([
      this.produtoService.findAll().toPromise(),
      this.clienteService.findAll().toPromise(),
      this.projetoService.listarProjetos(0, 100, {}).toPromise()
    ]).then(([produtos, clientes, projetosResponse]) => {
      this.produtos = produtos || [];
      this.clientes = clientes || [];
      this.projetos = projetosResponse?.content || [];
    }).catch(error => {
      this.showError('Erro ao carregar dados iniciais', error);
    }).finally(() => {
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  createForm(): FormGroup {
    const formaInicial = 0;
    const formaPagamento = this.formasPagamento.find(fp => fp.value === formaInicial);
    this.permiteParcelamento = !!formaPagamento?.permiteParcelamento;

    return this.fb.group({
      tipo: ['PRODUTO', Validators.required],
      clienteId: ['', Validators.required],
      produtoId: [''],
      projetoId: [''],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      precoUnitario: [0, [Validators.required, Validators.min(0)]],
      desconto: [0, [Validators.min(0)]],
      formaPagamento: [formaInicial, Validators.required],
      numeroParcelas: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      dataVencimento: [this.getDefaultVencimento()],
      observacoes: ['']
    });
  }

  setupFormListeners(): void {
    // Debounce para evitar múltiplas execuções
    this.form.get('tipo')?.valueChanges.pipe(debounceTime(300)).subscribe(tipo => {
      this.tipoVendaAtual = tipo;
      this.onTipoVendaChange(tipo);
    });

    this.form.get('clienteId')?.valueChanges.pipe(debounceTime(300)).subscribe(clienteId => {
      this.onClienteChange(clienteId);
    });

    this.form.get('formaPagamento')?.valueChanges.pipe(debounceTime(300)).subscribe(forma => {
      this.onFormaPagamentoChange(forma);
    });

    this.form.get('numeroParcelas')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.onParcelasChange();
    });

    this.form.get('desconto')?.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.updateTotais();
    });
  }

  onTipoVendaChange(tipo: string): void {
    const produtoIdControl = this.form.get('produtoId');
    const projetoIdControl = this.form.get('projetoId');
    const quantidadeControl = this.form.get('quantidade');
    const precoUnitarioControl = this.form.get('precoUnitario');

    if (tipo === 'PRODUTO') {
      projetoIdControl?.reset();
      projetoIdControl?.clearValidators();
      produtoIdControl?.setValidators(Validators.required);
      quantidadeControl?.setValidators([Validators.required, Validators.min(1)]);
      precoUnitarioControl?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      produtoIdControl?.reset();
      produtoIdControl?.clearValidators();
      quantidadeControl?.clearValidators();
      precoUnitarioControl?.clearValidators();
      projetoIdControl?.setValidators(Validators.required);
    }

    // Atualiza apenas controles afetados
    produtoIdControl?.updateValueAndValidity();
    projetoIdControl?.updateValueAndValidity();
    quantidadeControl?.updateValueAndValidity();
    precoUnitarioControl?.updateValueAndValidity();

    // Limpa dados e atualiza totais
    this.items = [];
    this.parcelas = [];
    this.updateTotais();
  }

  onClienteChange(clienteId: number): void {
    if (clienteId) {
      this.loadProjetosAprovadosPorCliente(clienteId);
    } else {
      this.projetosAprovados = [];
    }

    this.form.get('projetoId')?.reset();
    this.parcelas = [];
    this.updateTotais();
  }

  loadProjetosAprovadosPorCliente(clienteId: number): void {
    this.loading = true;
    this.projetoService.listarProjetos(0, 100, {
      clienteId: clienteId,
      status: 'APROVADO'
    }).subscribe({
      next: (response: any) => {
        this.projetosAprovados = response.content || [];
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.showError('Erro ao carregar projetos aprovados', err);
        this.projetosAprovados = [];
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  onFormaPagamentoChange(forma: number): void {
    const parcelasControl = this.form.get('numeroParcelas');
    const dataVencimentoControl = this.form.get('dataVencimento');

    const formaPagamento = this.formasPagamento.find(fp => fp.value === forma);
    const podeParcelar = formaPagamento?.permiteParcelamento || false;
    this.permiteParcelamento = podeParcelar;

    if (podeParcelar) {
      parcelasControl?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      dataVencimentoControl?.setValidators(Validators.required);
      if (!dataVencimentoControl?.value) {
        dataVencimentoControl?.setValue(this.getDefaultVencimento());
      }
    } else {
      parcelasControl?.setValue(1);
      parcelasControl?.setValidators([Validators.required, Validators.min(1), Validators.max(1)]);
      dataVencimentoControl?.clearValidators();
      this.parcelas = [];
    }

    parcelasControl?.updateValueAndValidity();
    dataVencimentoControl?.updateValueAndValidity();
    this.updateParcelas();
  }

  onParcelasChange(): void {
    this.updateParcelas();
  }

  updateParcelas(): void {
    if (this.calcularParcelasDisabled) return;
    this.calcularParcelas();
  }

  searchProdutos(event: any): void {
    const query = event.query;
    this.produtoService.findAll().subscribe({
      next: (produtos: Produto[]) => {
        this.produtos = produtos.filter(p =>
          p.nome.toLowerCase().includes(query.toLowerCase())
        );
      },
      error: (err) => this.showError('Erro ao buscar produtos', err)
    });
  }

  searchProjetos(event: any): void {
    const query = event.query;
    const clienteId = this.form.get('clienteId')?.value;

    if (!clienteId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um cliente primeiro'
      });
      this.projetos = [];
      return;
    }

    this.loading = true;
    this.projetoService.listarProjetos(0, 10, {
      nome: query,
      clienteId: clienteId,
      status: 'APROVADO'
    }).subscribe({
      next: (response: any) => {
        this.projetos = response.content || [];
        this.loading = false;
      },
      error: (err) => {
        this.showError('Erro ao buscar projetos', err);
        this.projetos = [];
        this.loading = false;
      }
    });
  }

// Em venda-form.component.ts

  addItem(): void {
    const produtoFormValue = this.form.get('produtoId')?.value;
    const quantidade = this.form.get('quantidade')?.value;
    const precoUnitario = this.form.get('precoUnitario')?.value;

    const produtoId = produtoFormValue?.id || produtoFormValue;

    if (!produtoId || !quantidade || !precoUnitario || quantidade <= 0 || precoUnitario <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios com valores válidos'
      });
      return;
    }

    const produto = this.produtos.find(p => p.id === (produtoId.id || produtoId));
    if (!produto) {
      console.error('Produto não encontrado para o ID:', produtoId);
      return;
    }

    const newItem: ItemVenda = {
      id: produto.id,
      quantidade: quantidade,
      preco: precoUnitario,
      subTotal: quantidade * precoUnitario,
      produto: produto,
      promdutoNome: produto.nome
    };

    this.items = [...this.items, newItem];

    // Limpa campos
    this.form.get('produtoId')?.setValue(null);
    this.form.get('quantidade')?.setValue(1);
    this.form.get('precoUnitario')?.setValue(0);

    if (this.items.length > 0) {
      const produtoIdControl = this.form.get('produtoId');
      produtoIdControl?.clearValidators();
      produtoIdControl?.updateValueAndValidity(); // Notifica o Angular da mudança
    }

    this.changeDetectorRef.detectChanges();
    this.updateTotais();
  }

  removeItem(index: number): void {
    this.items = this.items.filter((_, i) => i !== index);

    // ⭐ NOVO: Restaura a validação se a lista de itens ficar vazia
    if (this.items.length === 0 && this.tipoVendaAtual === 'PRODUTO') {
      const produtoIdControl = this.form.get('produtoId');
      produtoIdControl?.setValidators(Validators.required);
      produtoIdControl?.updateValueAndValidity(); // Notifica o Angular
    }

    this.changeDetectorRef.detectChanges();
    this.updateTotais();
  }

  calcularParcelas(): void {
    if (this.calcularParcelasDisabled) return;
    this.calcularParcelasDisabled = true;

    const formaPagamento = this.form.get('formaPagamento')?.value;
    const formaPagamentoObj = this.formasPagamento.find(fp => fp.value === formaPagamento);
    const permiteParcelamento = formaPagamentoObj?.permiteParcelamento || false;

    const numeroParcelas = this.form.get('numeroParcelas')?.value;
    const dataVencimento = this.form.get('dataVencimento')?.value;

    if (!permiteParcelamento || !numeroParcelas || numeroParcelas < 1 || !dataVencimento) {
      this.parcelas = [];
      this.calcularParcelasDisabled = false;
      return;
    }

    const valorTotal = this.totalValue;
    if (valorTotal <= 0) {
      this.parcelas = [];
      this.calcularParcelasDisabled = false;
      return;
    }

    if (numeroParcelas === 1) {
      this.parcelas = [{
        numero: 1,
        valor: valorTotal,
        dataVencimento: new Date(dataVencimento)
      }];
    } else {
      this.parcelas = this.gerarParcelas(valorTotal, numeroParcelas, new Date(dataVencimento));
    }

    this.calcularParcelasDisabled = false;
  }

  private gerarParcelas(valorTotal: number, numeroParcelas: number, dataVencimento: Date): ParcelaDTO[] {
    const parcelas: ParcelaDTO[] = [];
    const valorParcela = valorTotal / numeroParcelas;
    let valorRestante = valorTotal;

    // Calcula o valor base
    const valorBase = Math.floor(valorParcela * 100) / 100;

    for (let i = 0; i < numeroParcelas; i++) {
      const data = new Date(dataVencimento);
      data.setMonth(data.getMonth() + i);

      if (i === numeroParcelas - 1) {
        parcelas.push({
          numero: i + 1,
          valor: valorRestante,
          dataVencimento: data
        });
      } else {
        parcelas.push({
          numero: i + 1,
          valor: valorBase,
          dataVencimento: data
        });
        valorRestante -= valorBase;
      }
    }

    return parcelas;
  }

  getDefaultVencimento(): Date {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today;
  }

  updateTotais(): void {
    // Calcula subtotal
    if (this.tipoVendaAtual === 'PRODUTO') {
      this.subtotalValue = this.items.reduce((sum, item) => sum + (item.subTotal ?? 0), 0);
    } else if (this.tipoVendaAtual === 'PROJETO') {
      const projetoId = this.form.get('projetoId')?.value;
      if (projetoId) {
        const projeto = this.projetosAprovados.find(p => p.id === projetoId);
        this.subtotalValue = projeto?.valorTotal ?? 0;
      } else {
        this.subtotalValue = 0;
      }
    } else {
      this.subtotalValue = 0;
    }

    // Calcula total
    const desconto = this.form.value.desconto || 0;
    this.totalValue = Math.max(0, this.subtotalValue - desconto);

    // Atualiza parcelas
    this.calcularParcelas();
  }

  // Getters otimizados
  get subtotal(): number {
    return this.subtotalValue;
  }

  get total(): number {
    return this.totalValue;
  }

  onSubmit(): void {
    this.markAllAsTouched();

    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Inválido',
        detail: 'Por favor, preencha todos os campos obrigatórios.'
      });
      return;
    }

    if (this.tipoVendaAtual === 'PRODUTO' && this.items.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Venda Incompleta',
        detail: 'Adicione pelo menos um item para registrar uma Venda de Produto.'
      });
      return;
    }

    this.submitting = true;
    const formValue = this.form.value;

    const vendaData: any = {
      tipo: formValue.tipo,
      clienteId: formValue.clienteId,
      desconto: formValue.desconto,
      formaPagamento: formValue.formaPagamento,
      numeroParcelas: formValue.numeroParcelas || 1,
      observacoes: formValue.observacoes,
      itensVenda: []
    };

    if (formValue.tipo === 'PRODUTO') {
      vendaData.itensVenda = this.items.map(item => ({
        produto: item.produto?.id,
        quantidade: item.quantidade,
        preco: item.preco
      }));
    } else {
      vendaData.projetoId = formValue.projetoId;
    }

    // Etapa 1: Criar a venda
    this.vendaService.criarVenda(vendaData).subscribe({
      next: (vendaCriada) => {
        // NÃO exiba a mensagem aqui. Apenas chame o próximo passo.
        console.log('Venda criada com ID:', vendaCriada.id);

        // Etapa 2: Processar a venda recém-criada
        this.vendaService.processarVendaCompleta(vendaCriada.id as number).subscribe({
          next: (response) => {
            // Exiba a ÚNICA mensagem de sucesso aqui, no final de todo o processo.
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: response.message || 'Venda registrada e processada com sucesso!'
              });
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Aviso no Processamento',
                detail: response.message || 'A venda foi criada, mas houve um aviso no processamento.'
              });
            }
            this.resetForm();
            this.submitting = false;
          },
          error: (err) => {
            this.showError('Erro no processamento automático da venda', err);
            this.submitting = false;
          }
        });
      },
      error: (err) => {
        this.showError('Erro ao criar a venda', err);
        this.submitting = false;
      }
    });
  }

  private processarVendaCompleta(vendaId: number): void {
    this.vendaService.processarVendaCompleta(vendaId).subscribe({
      next: (resultado) => {
        if (resultado.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Processamento Completo',
            detail: 'Venda processada com geração automática de contas a receber e ordem de serviço!'
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Processamento Parcial',
            detail: resultado.message || 'Venda criada, mas houve problemas no processamento automático'
          });
        }
        this.resetForm();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Processamento Parcial',
          detail: 'Venda criada, mas houve erro no processamento automático'
        });
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    const formaInicial = 0;
    const formaPagamento = this.formasPagamento.find(fp => fp.value === formaInicial);
    this.permiteParcelamento = !!formaPagamento?.permiteParcelamento;
    this.tipoVendaAtual = 'PRODUTO';

    this.form.reset({
      tipo: 'PRODUTO',
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      formaPagamento: formaInicial,
      numeroParcelas: 1,
      dataVencimento: this.getDefaultVencimento()
    });

    this.items = [];
    this.parcelas = [];
    this.projetosAprovados = [];
    this.subtotalValue = 0;
    this.totalValue = 0;
    this.submitting = false;
  }

  markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showError(summary: string, error: any): void {
    console.error(error);
    this.messageService.add({
      severity: 'error',
      summary,
      detail: error.error?.message || error.message || 'Erro desconhecido'
    });
  }

  // TrackBy para otimização de renderização
  trackByItem(index: number, item: ItemVenda): number {
    return item.id || index;
  }
}
