import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TipoProjeto } from "../../../../../models/enums/projeto/TipoProjeto";
import { ProjetoService } from "../../../../services/projeto/projeto.service";
import { Projeto, TipoProjetoOption } from "../../../../../models/interfaces/projeto/Projeto";
import {ProjetoItem, ProjetoItemForm} from "../../../../../models/interfaces/projeto/ProjetoItem";
import { StatusProjeto } from "../../../../../models/enums/projeto/StatusProjeto";
import {ClientesService} from "../../../../services/clientes/clientes.service";
import {ProdutoService} from "../../../../services/produto/produto.service";
import {debounceTime, distinctUntilChanged, finalize, Subject, takeUntil} from "rxjs";

interface ProjetoStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

interface MaterialTemplate {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  unidade: string;
  imagem?: string;
  descricao: string;
  popular: boolean;
}

@Component({
  selector: 'app-projeto-builder',
  templateUrl: './projeto-builder.component.html',
  styleUrls: ['./projeto-builder.component.scss']
})
export class ProjetoBuilderComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject();
  projetoForm!: FormGroup;
  isEditMode = false;
  projetoId!: number;
  loading = false;
  calculandoOrcamento = false;

  // Wizard Steps
  currentStep = 0;
  steps: ProjetoStep[] = [
    {
      id: 'tipo',
      title: 'Tipo de Projeto',
      description: 'Selecione o tipo de projeto que deseja criar',
      icon: 'pi pi-th-large',
      completed: false,
      active: true
    },
    {
      id: 'cliente',
      title: 'Cliente',
      description: 'Selecione o cliente para este projeto',
      icon: 'pi pi-user',
      completed: false,
      active: false
    },
    {
      id: 'medidas',
      title: 'Medidas',
      description: 'Defina as dimensões do projeto',
      icon: 'pi pi-ruler',
      completed: false,
      active: false
    },
    {
      id: 'materiais',
      title: 'Materiais',
      description: 'Selecione os materiais necessários',
      icon: 'pi pi-box',
      completed: false,
      active: false
    },
    {
      id: 'orcamento',
      title: 'Orçamento',
      description: 'Revise e finalize o orçamento',
      icon: 'pi pi-calculator',
      completed: false,
      active: false
    }
  ];

  // Project Type Options with enhanced UI
  tiposProjetoOptions: TipoProjetoOption[] = [
    {
      label: 'Banheiro',
      value: TipoProjeto.BANHEIRO,
      icon: 'pi pi-home',
      description: 'Projetos completos para banheiros, incluindo bancadas, cubas e revestimentos',
      materiaisComuns: [1, 2, 3]
    },
    {
      label: 'Cozinha',
      value: TipoProjeto.COZINHA,
      icon: 'pi pi-bookmark',
      description: 'Bancadas, ilhas e projetos personalizados para cozinha',
      materiaisComuns: [4, 5, 6]
    },
    {
      label: 'Cuba',
      value: TipoProjeto.CUBA,
      icon: 'pi pi-circle',
      description: 'Cubas esculpidas e pias personalizadas em mármore e granito',
      materiaisComuns: [7, 8, 9]
    },
    {
      label: 'Bancada',
      value: TipoProjeto.BANCADA,
      icon: 'pi pi-minus',
      description: 'Bancadas para diversos ambientes e aplicações',
      materiaisComuns: [10, 11, 12]
    },
    {
      label: 'Escada',
      value: TipoProjeto.ESCADA,
      icon: 'pi pi-angle-up',
      description: 'Degraus e revestimentos para escadas em pedra natural',
      materiaisComuns: [13, 14, 15]
    },
    {
      label: 'Lareira',
      value: TipoProjeto.LAREIRA,
      icon: 'pi pi-sun',
      description: 'Revestimentos e acabamentos para lareiras',
      materiaisComuns: [16, 17, 18]
    },
    {
      label: 'Soleira',
      value: TipoProjeto.SOLEIRA,
      icon: 'pi pi-window-minimize',
      description: 'Soleiras para portas e janelas',
      materiaisComuns: [19, 20, 21]
    },
    {
      label: 'Pia',
      value: TipoProjeto.PIA,
      icon: 'pi pi-circle-fill',
      description: 'Pias esculpidas e personalizadas',
      materiaisComuns: [22, 23, 24]
    },
    {
      label: 'Outros',
      value: TipoProjeto.OUTROS,
      icon: 'pi pi-ellipsis-h',
      description: 'Projetos especiais e personalizados',
      materiaisComuns: []
    }
  ];

  // Data
  clientes: any[] = [];
  materiaisDisponiveis: { id: any; nome: string; categoria: string; preco: number; unidade: string; popular: boolean }[] = [];
  materiaisSelecionados: MaterialTemplate[] = [];
  materiaisSugeridos: any[] = [];

  // Calculations
  valorMateriais = 0;
  valorMaoObra = 0;
  valorTotal = 0;
  margemLucro = 20;

  // UI State
  showMaterialSearch = false;
  materialSearchTerm = '';
  selectedMaterialCategory = '';
  materialCategories = ['Todos', 'Mármore', 'Granito', 'Quartzo', 'Acessórios'];
  private lastRequestTime: number = 0;

  constructor(
    private fb: FormBuilder,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clienteService: ClientesService,
    private produtoService: ProdutoService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.projetoId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.projetoId;

    this.carregarDados();

    if (this.isEditMode) {
      this.carregarProjeto();
    }

    // Watch for form changes
    this.setupFormWatchers();
  }

  initializeForm() {
    this.projetoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', Validators.maxLength(500)],
      clienteId: [null, Validators.required],
      tipoProjeto: [null, Validators.required],
      status: [StatusProjeto.ORCAMENTO],
      dataPrevista: [null],
      observacoes: [''],
      margemLucro: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
      medidas: this.fb.group({
        profundidade: [null, [Validators.required, Validators.min(0.1)]],
        largura: [null, [Validators.required, Validators.min(0.1)]],
        altura: [null, [Validators.required, Validators.min(0.1)]],
        observacoes: ['']
      }),
      itens: this.fb.array([]),
      usuarioCriacao: [1, Validators.required] // Adicionado campo obrigatório
    });
  }

  private setupFormWatchers(): void {
    let isUpdating = false;

    this.projetoForm.get('tipoProjeto')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300) // Debounce para evitar múltiplas chamadas rápidas
    ).subscribe((tipo) => {
      if (tipo && !isUpdating) {
        isUpdating = true;
        this.carregarMateriaisSugeridos();
        this.updateStepCompletion('tipo', true);

        setTimeout(() => {
          this.autoAdvanceStep();
          isUpdating = false;
        }, 50);
      }
    });

    this.projetoForm.get('clienteId')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    ).subscribe((clienteId) => {
      if (clienteId && !isUpdating) {
        isUpdating = true;
        this.updateStepCompletion('cliente', true);

        setTimeout(() => {
          this.autoAdvanceStep();
          isUpdating = false;
        }, 50);
      }
    });

    this.projetoForm.get('medidas')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500), // Debounce maior para cálculos mais pesados
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) === JSON.stringify(curr);
      })
    ).subscribe(() => {
      if (isUpdating) return;

      isUpdating = true;

      try {
        this.calcularArea();

        setTimeout(() => {
          if (!isUpdating) return;
          this.calcularOrcamentoAutomatico();
          isUpdating = false;
        }, 100);
      } catch (error) {
        console.error('Erro no watcher de medidas:', error);
        isUpdating = false;
      }
    });

    this.projetoForm.get('margemLucro')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    ).subscribe(() => {
      if (!isUpdating) {
        isUpdating = true;
        setTimeout(() => {
          this.calcularTotais();
          isUpdating = false;
        }, 50);
      }
    });

    this.itensFormArray.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    ).subscribe(() => {
      if (!isUpdating) {
        isUpdating = true;
        setTimeout(() => {
          this.calcularTotais();
          this.updateStepCompletion('materiais', this.itensFormArray.length > 0);
          isUpdating = false;
        }, 50);
      }
    });
  }

  // Step Navigation
  goToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[this.currentStep].active = false;
      this.currentStep = stepIndex;
      this.steps[this.currentStep].active = true;
    }
  }

  nextStep() {
    if (this.canAdvanceStep()) {
      this.goToStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  canAdvanceStep(): boolean {
    const currentStepId = this.steps[this.currentStep].id;

    switch (currentStepId) {
      case 'tipo':
        return !!this.projetoForm.get('tipoProjeto')?.value;
      case 'cliente':
        return !!this.projetoForm.get('clienteId')?.value;
      case 'medidas':
        const medidas = this.projetoForm.get('medidas')?.value;
        return medidas.profundidade && medidas.largura && medidas.altura;
      case 'materiais':
        return this.itensFormArray.length > 0;
      default:
        return true;
    }
  }

  autoAdvanceStep() {
    setTimeout(() => {
      if (this.canAdvanceStep() && this.currentStep < this.steps.length - 1) {
        this.nextStep();
      }
    }, 500);
  }

  updateStepCompletion(stepId: string, completed: boolean) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = completed;
    }
  }

  // Material Selection
  get filteredMateriais() {
    let filtered = this.materiaisDisponiveis;

    if (this.materialSearchTerm) {
      filtered = filtered.filter(m =>
        m.nome.toLowerCase().includes(this.materialSearchTerm.toLowerCase()) ||
        m.categoria.toLowerCase().includes(this.materialSearchTerm.toLowerCase())
      );
    }

    if (this.selectedMaterialCategory && this.selectedMaterialCategory !== 'Todos') {
      filtered = filtered.filter(m => m.categoria === this.selectedMaterialCategory);
    }

    return filtered;
  }

  adicionarMaterial(material: {
    id: any;
    nome: string;
    categoria: string;
    preco: number;
    unidade: string;
    popular: boolean
  }) {
    const itemExistente = this.itensFormArray.controls.find(
      control => control.get('produtoId')?.value === material.id
    );

    if (itemExistente) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Material já adicionado ao projeto'
      });
      return;
    }

    this.adicionarItem({
      produtoId: material.id,
      quantidade: 1,
      valorUnitario: material.preco,
      valorTotal: material.preco
    });

    this.materiaisSelecionados.push(<MaterialTemplate>material);
    this.updateStepCompletion('materiais', true);
  }

  removerMaterial(materialId: number) {
    const index = this.itensFormArray.controls.findIndex(
      control => control.get('produtoId')?.value === materialId
    );

    if (index >= 0) {
      this.itensFormArray.removeAt(index);
      this.materiaisSelecionados = this.materiaisSelecionados.filter(m => m.id !== materialId);
      this.calcularTotais();

      if (this.itensFormArray.length === 0) {
        this.updateStepCompletion('materiais', false);
      }
    }
  }

  // Form Array Management
  get itensFormArray(): FormArray {
    return this.projetoForm.get('itens') as FormArray;
  }

  adicionarItem(item?: Partial<ProjetoItemForm>) {
    const itemForm = this.fb.group({
      produtoId: [item?.produtoId || null, Validators.required],
      quantidade: [item?.quantidade || 1, [Validators.required, Validators.min(0.01)]],
      valorUnitario: [item?.valorUnitario || 0, [Validators.required, Validators.min(0)]],
      valorTotal: [{ value: item?.valorTotal || 0, disabled: true }],
      observacoes: [item?.observacoes || '']
    });

    // Watch for changes to recalculate
    itemForm.get('quantidade')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));
    itemForm.get('valorUnitario')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));

    this.itensFormArray.push(itemForm);
    this.calcularItemTotal(itemForm);
  }

  calcularItemTotal(itemForm: FormGroup) {
    const quantidade = itemForm.get('quantidade')?.value || 0;
    const valorUnitario = itemForm.get('valorUnitario')?.value || 0;
    const valorTotal = quantidade * valorUnitario;

    itemForm.get('valorTotal')?.setValue(valorTotal);
    this.calcularTotais();
  }

  // Data Loading
  carregarDados() {
    // Mock data - replace with actual service calls
    this.clienteService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clientes = response;
        },
        error: (err) => {
          console.error('Erro ao carregar clientes:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar clientes.',
            life: 3000,
          });
        },
      });

    // Carregar produtos/materiais do backend
    this.produtoService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (produtos) => {
          this.materiaisDisponiveis = produtos.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            categoria: produto.grupo?.nome || 'Outros',
            preco: produto.preco || 0,
            unidade: 'm²',
            popular: false
          }));
        },
        error: (err) => {
          console.error('Erro ao carregar produtos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar produtos.',
            life: 3000,
          });
        },
      });
  }

  carregarProjeto() {
    this.loading = true;
    this.projetoService.buscarProjetoPorId(this.projetoId).subscribe({
      next: (projeto) => {
        this.preencherForm(projeto);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar projeto'
        });
        this.loading = false;
      }
    });
  }

  preencherForm(projeto: Projeto) {
    this.projetoForm.patchValue({
      nome: projeto.nome,
      descricao: projeto.descricao,
      clienteId: projeto.clienteId,
      tipoProjeto: projeto.tipoProjeto,
      status: projeto.status,
      dataPrevista: projeto.dataPrevista ? new Date(projeto.dataPrevista) : null,
      observacoes: projeto.observacoes,
      margemLucro: projeto.margemLucro,
      medidas: projeto.medidas
    });

    // Clear and add items
    while (this.itensFormArray.length !== 0) {
      this.itensFormArray.removeAt(0);
    }

    projeto.itens.forEach(item => {
      this.adicionarItem(item);
    });

    this.calcularTotais();
    this.updateAllStepsCompletion();
  }

  updateAllStepsCompletion() {
    this.updateStepCompletion('tipo', !!this.projetoForm.get('tipoProjeto')?.value);
    this.updateStepCompletion('cliente', !!this.projetoForm.get('clienteId')?.value);

    const medidas = this.projetoForm.get('medidas')?.value;
    this.updateStepCompletion('medidas', medidas.profundidade && medidas.largura && medidas.altura);

    this.updateStepCompletion('materiais', this.itensFormArray.length > 0);
    this.updateStepCompletion('orcamento', this.valorTotal > 0);
  }

  carregarMateriaisSugeridos() {
    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    const medidas = this.projetoForm.get('medidas')?.value;

    if (tipoProjeto) {
      // Mock suggested materials based on project type
      const tipoOption = this.tiposProjetoOptions.find(t => t.value === tipoProjeto);
      if (tipoOption) {
        this.materiaisSugeridos = this.materiaisDisponiveis
          .filter(m => tipoOption.materiaisComuns.includes(m.id))
          .map(m => ({
            ...m,
            quantidadeRecomendada: this.calcularQuantidadeRecomendada(m, medidas),
            aplicacao: this.getAplicacaoMaterial(m, tipoProjeto)
          }));
      }
    }
  }

  calcularQuantidadeRecomendada(material: {
    id: any;
    nome: string;
    categoria: string;
    preco: number;
    unidade: string;
    popular: boolean
  }, medidas: any): number {
    if (!medidas.profundidade || !medidas.largura) return 1;

    const area = medidas.profundidade * medidas.largura;

    // Different calculation based on material category
    switch (material.categoria) {
      case 'Mármore':
      case 'Granito':
      case 'Quartzo':
        return Math.ceil(area * 1.1); // 10% waste factor
      default:
        return 1;
    }
  }

  getAplicacaoMaterial(material: {
    id: any;
    nome: string;
    categoria: string;
    preco: number;
    unidade: string;
    popular: boolean
  }, tipoProjeto: TipoProjeto): string {
    const aplicacoes: { [key: string]: { [key in TipoProjeto]?: string } } = {
      'Mármore': {
        [TipoProjeto.BANHEIRO]: 'Bancada e revestimento',
        [TipoProjeto.COZINHA]: 'Bancada principal',
        [TipoProjeto.CUBA]: 'Base da cuba'
      },
      'Granito': {
        [TipoProjeto.COZINHA]: 'Bancada de trabalho',
        [TipoProjeto.BANHEIRO]: 'Bancada resistente'
      },
      'Quartzo': {
        [TipoProjeto.COZINHA]: 'Bancada premium',
        [TipoProjeto.BANHEIRO]: 'Bancada de luxo'
      }
    };

    return aplicacoes[material.categoria]?.[tipoProjeto] || 'Aplicação geral';
  }

  // Calculations
  calcularArea(): void {
    const medidas = this.projetoForm.get('medidas')?.value;
    if (!medidas) return;

    const profundidade = medidas.profundidade || 0;
    const largura = medidas.largura || 0;

    // Evita atualização desnecessária
    if (profundidade <= 0 || largura <= 0) {
      return;
    }

    const area = profundidade * largura;
    const perimetro = 2 * (profundidade + largura);

    // Atualiza sem disparar valueChanges novamente
    this.projetoForm.get('medidas')?.patchValue({
      area,
      perimetro
    }, { emitEvent: false }); // Importante: emitEvent: false
  }

  calcularTotais() {
    // Garante valores mínimos
    this.valorMateriais = Math.max(0, this.itensFormArray.controls.reduce((total, control) => {
      return total + (control.get('valorTotal')?.value || 0);
    }, 0));

    const medidas = this.projetoForm.get('medidas')?.value;
    const area = (medidas?.profundidade * medidas?.largura) || 0;

    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    const laborRate = this.getLaborRate(tipoProjeto);
    this.valorMaoObra = area * laborRate;

    const margemLucro = this.projetoForm.get('margemLucro')?.value || 0;
    const subtotal = this.valorMateriais + this.valorMaoObra;
    this.valorTotal = Math.max(0.01, subtotal * (1 + margemLucro / 100));
  }
  getLaborRate(tipoProjeto: TipoProjeto): number {
    const rates: { [key in TipoProjeto]: number } = {
      [TipoProjeto.BANHEIRO]: 80,
      [TipoProjeto.COZINHA]: 70,
      [TipoProjeto.CUBA]: 120,
      [TipoProjeto.BANCADA]: 60,
      [TipoProjeto.ESCADA]: 100,
      [TipoProjeto.LAREIRA]: 90,
      [TipoProjeto.SOLEIRA]: 40,
      [TipoProjeto.PIA]: 110,
      [TipoProjeto.OUTROS]: 50
    };

    return rates[tipoProjeto] || 50;
  }
  public solicitarCalculoOrcamento(): void {
    if (this.projetoForm.valid) {
      this.calcularOrcamentoAutomatico();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário incompleto',
        detail: 'Preencha todos os campos obrigatórios antes de calcular'
      });
    }
  }

  private calcularOrcamentoAutomatico(): void {
    if (this.calculandoOrcamento) return;

    const now = Date.now();
    if (now - this.lastRequestTime < 2000) return;

    if (!this.validarFormularioParaCalculo()) {
      return;
    }

    this.calculandoOrcamento = true;
    this.lastRequestTime = now;

    // Usa setTimeout para evitar call stack overflow
    setTimeout(() => {
      const payload = this.prepararPayloadCalculo();

      this.projetoService.calcularOrcamento(payload).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (resultado) => this.atualizarValoresCalculados(resultado),
        error: (error) => this.tratarErroCalculo(error),
        complete: () => this.calculandoOrcamento = false
      });
    }, 0);
  }

  private validarFormularioParaCalculo(): boolean {
    if (!this.projetoForm.valid) {
      this.showToast('warn', 'Formulário incompleto', 'Preencha todos os campos obrigatórios');
      return false;
    }

    const medidas = this.projetoForm.get('medidas')?.value;
    if (!medidas.profundidade || !medidas.largura) {
      this.showToast('warn', 'Medidas inválidas', 'Informe profundidade e largura');
      return false;
    }

    if (this.itensFormArray.length === 0) {
      this.showToast('warn', 'Materiais necessários', 'Adicione pelo menos um material');
      return false;
    }

    return true;
  }

  private prepararPayloadCalculo(): any {
    const formValue = this.projetoForm.getRawValue();
    return {
      nome: formValue.nome,
      clienteId: formValue.clienteId,
      tipoProjeto: formValue.tipoProjeto,
      medidas: {
        profundidade: formValue.medidas.profundidade,
        largura: formValue.medidas.largura,
        altura: formValue.medidas.altura
      },
      itens: this.itensFormArray.value.map((item: ProjetoItem) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario
      })),
      margemLucro: formValue.margemLucro,
      usuarioCriacao: formValue.usuarioCriacao
    };
  }

  private atualizarValoresCalculados(resultado: any): void {
    this.valorMateriais = resultado.valorMateriais || 0;
    this.valorMaoObra = resultado.valorMaoObra || 0;
    this.valorTotal = resultado.valorTotal || 0;
  }

  private tratarErroCalculo(error: any): void {
    this.calcularTotais(); // Fallback para cálculo local

    let errorMessage = 'Erro ao calcular orçamento';
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors) {
        errorMessage = error.error.errors.map((e: any) => e.message).join(', ');
      }
    }

    this.showToast('error', 'Erro no cálculo', errorMessage);
    console.error('Erro detalhado:', error);
  }

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.clear();
    this.messageService.add({ severity, summary, detail, life: 5000 });
  }

  salvar(): void {
    this.calcularTotais();

    if (!this.projetoForm.valid || this.valorTotal <= 0) {
      this.showToast('error', 'Dados inválidos', 'Verifique os campos obrigatórios e valores calculados');
      return;
    }

    this.loading = true;

    const projetoData: Projeto = {
      ...this.projetoForm.getRawValue(),
      itens: this.itensFormArray.value,
      valorTotal: this.valorTotal,
      valorMaoObra: this.valorMaoObra,
      dataCriacao: this.isEditMode ? undefined : new Date(),
      dataAtualizacao: new Date()
    };

    console.log('Dados enviados para API:', projetoData); // DEBUG

    const request = this.isEditMode
      ? this.projetoService.atualizarProjeto(this.projetoId, projetoData)
      : this.projetoService.criarProjeto(projetoData);

    request.pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response); // DEBUG
        this.showToast('success', 'Sucesso', `Projeto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`);
        this.router.navigate(['/projetos']);
      },
      error: (error) => {
        console.error('Erro completo:', error); // DEBUG
        const errorMsg = error.error?.message ||
          error.error?.error ||
          `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} projeto`;
        this.showToast('error', 'Erro', errorMsg);
      }
    });
  }
  cancelar() {
    this.router.navigate(['/projetos']);
  }

  // Utility methods
  getMaterialById(id: number): {
    id: any;
    nome: string;
    categoria: string;
    preco: number;
    unidade: string;
    popular: boolean
  } | undefined {
    return this.materiaisDisponiveis.find(m => m.id === id);
  }

  getClienteNome(clienteId: number): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  }

  getTipoProjetoOption(tipo: TipoProjeto): TipoProjetoOption | undefined {
    return this.tiposProjetoOptions.find(t => t.value === tipo);
  }

  // Additional methods for the component
  adicionarNovoCliente() {
    // Navigate to client creation or open modal
    this.messageService.add({
      severity: 'info',
      summary: 'Funcionalidade',
      detail: 'Redirecionando para cadastro de cliente...'
    });
    this.router.navigate(['/clientes']);
  }

  gerarPDF() {
    this.messageService.add({
      severity: 'info',
      summary: 'PDF',
      detail: 'Gerando PDF do orçamento...'
    });
    // Implement PDF generation logic
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

