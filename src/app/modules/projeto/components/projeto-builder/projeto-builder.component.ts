import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TipoProjeto } from "../../../../../models/enums/projeto/TipoProjeto";
import { ProjetoService } from "../../../../services/projeto/projeto.service";
import {PecaProjeto, Projeto, Recorte, TipoProjetoOption} from "../../../../../models/interfaces/projeto/Projeto";
import {ProjetoItem, ProjetoItemForm} from "../../../../../models/interfaces/projeto/ProjetoItem";
import { StatusProjeto } from "../../../../../models/enums/projeto/StatusProjeto";
import {ClientesService} from "../../../../services/clientes/clientes.service";
import {ProdutoService} from "../../../../services/produto/produto.service";
import {debounceTime, distinctUntilChanged, finalize, Subject, takeUntil} from "rxjs";
import {RelatorioService} from "../../../../services/relatorio.service";

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
  styleUrls: ['./projeto-builder.component.scss', './projeto-builder-dinamico.scss']
})
export class ProjetoBuilderComponent implements OnInit, AfterViewInit {
  private readonly destroy$: Subject<void> = new Subject();
  private isInitializing = false;
  projetoForm!: FormGroup;
  isEditMode = false;
  projetoId!: number;
  loading = false;
  calculandoOrcamento = false;
  sidebarVisible = false;

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
  materiaisDisponiveis: MaterialTemplate[] = [];
  materiaisSelecionados: MaterialTemplate[] = [];
  materiaisSugeridos: any[] = [];

  pecasProjeto: PecaProjeto[] = [];
  pecaAtiva?: PecaProjeto;
  unidadePadrao: string = 'm';
  unidadesDisponiveis = [
    { label: 'Metros (m)', value: 'm' },
    { label: 'Centímetros (cm)', value: 'cm' },
    { label: 'Polegadas (in)', value: 'in' }
  ];

  tiposPeca = [
    { label: 'Peça Simples', value: 'simples' },
    { label: 'Bancada', value: 'bancada' },
    { label: 'Ilha', value: 'ilha' },
    { label: 'Soleira', value: 'soleira' },
    { label: 'Tampo', value: 'tampo' },
    { label: 'Painel', value: 'painel' }
  ];

  @ViewChild('canvasDesenho', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;
  private escala: number = 50; // pixels por metro

  private pecaSelecionada?: PecaProjeto & { index: number };
  private arrastando = false;
  private redimensionando = false;
  private pontoInicialMouse = { x: 0, y: 0 };
  private posicaoInicialPeca = { x: 0, y: 0 };
  private dimensaoInicialPeca = { largura: 0, altura: 0 };

  valorMateriais = 0;
  valorMaoObra = 0;
  valorTotal = 0;
  margemLucro = 20;

  showMaterialSearch = false;
  gerandoPDF = false;
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
    private produtoService: ProdutoService,
    private relatorioService: RelatorioService
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
      usuarioCriacao: [1, Validators.required]
    });
  }

  private validarFormularioParaCalculoBasico(): boolean {
    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    const clienteId = this.projetoForm.get('clienteId')?.value;
    const medidas = this.projetoForm.get('medidas')?.value;

    return tipoProjeto != null &&
      clienteId != null &&
      medidas?.profundidade > 0 &&
      medidas?.largura > 0 &&
      this.itensFormArray.length > 0;
  }

  private prepararDadosParaPDF(): any {
    const formValue = this.projetoForm.value;
    const cliente = this.clientes.find(c => c.id === formValue.clienteId);
    const medidas = formValue.medidas;

    const itens = this.itensFormArray.controls.map(control => {
      const itemValue = control.getRawValue();
      const material = this.getMaterialById(itemValue.produtoId);

      return {
        nome: material?.nome || 'Material não encontrado',
        descricao: material?.categoria || '',
        quantidade: Number(itemValue.quantidade) || 0,
        unidade: material?.unidade || '',
        valorUnitario: Number(itemValue.valorUnitario) || 0,
        valorTotal: Number(itemValue.valorTotal) || 0
      };
    });

    let clienteEndereco = '';
    if (cliente?.endereco) {
      if (typeof cliente.endereco === 'string') {
        clienteEndereco = cliente.endereco;
      } else {
        const endereco = cliente.endereco;
        const partes = [];
        if (endereco.rua) partes.push(endereco.rua);
        if (endereco.numero) partes.push(`nº ${endereco.numero}`);
        if (endereco.complemento) partes.push(endereco.complemento);
        if (endereco.bairro) partes.push(endereco.bairro);
        if (endereco.cidade?.nome) partes.push(endereco.cidade.nome);
        if (endereco.estado?.sigla) partes.push(endereco.estado.sigla);
        clienteEndereco = partes.join(', ');
      }
    }

    return {
      projetoId: this.projetoId || null,
      clienteNome: cliente?.nome || '',
      clienteEmail: cliente?.email || '',
      clienteTelefone: cliente?.telefone || '',
      clienteEndereco: clienteEndereco,
      projetoNome: formValue.nome || '',
      projetoDescricao: formValue.descricao || '',
      dataOrcamento: new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      largura: Number(medidas.largura) || 0,
      comprimento: Number(medidas.profundidade) || 0,
      area: Number(medidas.largura * medidas.profundidade) || 0,
      espessura: Number(medidas.altura) || 0,
      valorMateriais: Number(this.valorMateriais) || 0,
      valorMaoObra: Number(this.valorMaoObra) || 0,
      margemLucro: Number(formValue.margemLucro) || 0,
      valorTotal: Number(this.valorTotal) || 0,
      observacoes: formValue.observacoes || '',
      itens: itens
    };
  }

  gerarPDF(): void {
    if (!this.validarFormularioParaCalculoBasico()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios antes de gerar o PDF.',
        life: 5000
      });
      return;
    }

    this.gerandoPDF = true;
    const dadosPDF = this.prepararDadosParaPDF();

    this.relatorioService.gerarPDF(dadosPDF)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.gerandoPDF = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          const nomeArquivo = `Orcamento_${dadosPDF.projetoNome?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
          this.relatorioService.downloadPDF(blob, nomeArquivo);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'PDF do orçamento gerado com sucesso!', life: 3000 });
        },
        error: (error) => {
          console.error('Erro ao gerar PDF:', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao gerar o PDF do orçamento. Tente novamente.', life: 5000 });
        }
      });
  }

  visualizarPDF(): void {
    if (!this.validarFormularioParaCalculoBasico()) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios antes de visualizar o PDF.', life: 5000 });
      return;
    }

    this.gerandoPDF = true;
    const dadosPDF = this.prepararDadosParaPDF();

    this.relatorioService.gerarPDF(dadosPDF)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.gerandoPDF = false)
      )
      .subscribe({
        next: (blob: Blob) => {
          this.relatorioService.viewPDF(blob);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'PDF aberto em nova aba!', life: 3000 });
        },
        error: (error) => {
          console.error('Erro ao visualizar PDF:', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao visualizar o PDF do orçamento. Tente novamente.', life: 5000 });
        }
      });
  }

  private setupFormWatchers(): void {
    this.projetoForm.get('tipoProjeto')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((tipo) => {
      if (this.isInitializing) return;
      this.carregarMateriaisSugeridos();
      this.updateStepCompletion('tipo', true);
      if (this.validarFormularioParaCalculoBasico()) this.calcularOrcamentoAutomatico();
      this.autoAdvanceStep();
    });

    this.projetoForm.get('clienteId')?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe((clienteId) => {
      if (this.isInitializing) return;
      if (clienteId) {
        this.updateStepCompletion('cliente', true);
        this.autoAdvanceStep();
      }
    });

    this.projetoForm.get('medidas')?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged((p, c) => JSON.stringify(p) === JSON.stringify(c))).subscribe(() => {
      if (this.isInitializing) return;
      this.calcularArea();
      if (this.validarFormularioParaCalculoBasico()) this.calcularOrcamentoAutomatico();
    });

    this.projetoForm.get('margemLucro')?.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      if (this.isInitializing) return;
      if (this.validarFormularioParaCalculoBasico()) this.calcularOrcamentoAutomatico();
    });

    this.itensFormArray.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      if (this.isInitializing) return;
      this.valorMateriais = Math.max(0, this.itensFormArray.controls.reduce((total, control) => total + (control.get('valorTotal')?.value || 0), 0));
      if (this.validarFormularioParaCalculoBasico()) this.calcularOrcamentoAutomatico();
      this.updateStepCompletion('materiais', this.itensFormArray.length > 0);
    });
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      this.updateStepsState();
      if (this.currentStep === 2) setTimeout(() => this.aguardarCanvas(), 100);
    }
  }

  updateStepsState(): void {
    this.steps.forEach((step, index) => step.active = index === this.currentStep);
  }

  nextStep(): void {
    if (this.canAdvanceStep()) {
      this.currentStep++;
      this.updateAllStepsCompletion();
      if (this.currentStep === 2) setTimeout(() => this.aguardarCanvas(), 100);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) this.goToStep(this.currentStep - 1);
  }

  canAdvanceStep(): boolean {
    const currentStepId = this.steps[this.currentStep].id;
    switch (currentStepId) {
      case 'tipo': return !!this.projetoForm.get('tipoProjeto')?.value;
      case 'cliente': return !!this.projetoForm.get('clienteId')?.value;
      case 'medidas': return this.pecasProjeto.length > 0;
      case 'materiais': return this.itensFormArray.length > 0;
      default: return true;
    }
  }

  autoAdvanceStep() {
    setTimeout(() => {
      if (this.canAdvanceStep() && this.currentStep < this.steps.length - 1) this.nextStep();
    }, 500);
  }

  updateStepCompletion(stepId: string, completed: boolean) {
    const step = this.steps.find(s => s.id === stepId);
    if (step) step.completed = completed;
  }

  get filteredMateriais() {
    let filtered = this.materiaisDisponiveis;
    if (this.materialSearchTerm) {
      const term = this.materialSearchTerm.toLowerCase();
      filtered = filtered.filter(m => m.nome.toLowerCase().includes(term) || m.categoria.toLowerCase().includes(term));
    }
    if (this.selectedMaterialCategory && this.selectedMaterialCategory !== 'Todos') {
      filtered = filtered.filter(m => m.categoria === this.selectedMaterialCategory);
    }
    return filtered;
  }

  adicionarMaterial(material: MaterialTemplate) {
    if (this.itensFormArray.controls.some(c => c.get('produtoId')?.value === material.id)) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Material já adicionado ao projeto' });
      return;
    }

    let quantidadeInicial = 1;
    if (material.unidade === 'm²') {
      const areaTotal = parseFloat(this.calcularAreaTotalProjeto());
      quantidadeInicial = areaTotal > 0 ? Math.ceil(areaTotal * 1.1) : 1; // 10% de perda
    }

    this.adicionarItem({ produtoId: material.id, quantidade: quantidadeInicial, valorUnitario: material.preco });
    this.materiaisSelecionados.push(material);
    this.updateStepCompletion('materiais', true);
  }

  removerMaterial(materialId: number) {
    const index = this.itensFormArray.controls.findIndex(c => c.get('produtoId')?.value === materialId);
    if (index >= 0) {
      this.itensFormArray.removeAt(index);
      this.materiaisSelecionados = this.materiaisSelecionados.filter(m => m.id !== materialId);
      this.calcularTotais();
      if (this.itensFormArray.length === 0) this.updateStepCompletion('materiais', false);
    }
  }

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

    itemForm.get('quantidade')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));
    itemForm.get('valorUnitario')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));

    this.itensFormArray.push(itemForm);
    this.calcularItemTotal(itemForm);
  }

  calcularItemTotal(itemForm: FormGroup) {
    const quantidade = itemForm.get('quantidade')?.value || 0;
    const valorUnitario = itemForm.get('valorUnitario')?.value || 0;
    itemForm.get('valorTotal')?.setValue(quantidade * valorUnitario);
    this.calcularTotais();
  }

  carregarDados() {
    this.clienteService.findAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => this.clientes = response,
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro desconhecido', life: 3000 });
      }
    });

    this.produtoService.findAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (produtos) => {
        this.materiaisDisponiveis = produtos.map(produto => ({
          id: produto.id,
          nome: produto.nome,
          categoria: produto.grupo?.nome || 'Outros',
          preco: produto.preco || 0,
          unidade: this.getSimboloUnidade(produto.unidadeDeMedida),
          popular: false,
          descricao: '' // Adicionar descrição se disponível
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message || 'Erro desconhecido', life: 3000 });
      }
    });
  }

  carregarProjeto() {
    this.isInitializing = true;
    this.loading = true;
    this.projetoService.buscarProjetoPorId(this.projetoId).subscribe({
      next: (projeto) => {
        this.preencherForm(projeto);
        this.loading = false;
        this.isInitializing = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro desconhecido' });
        this.isInitializing = false;
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

    if (projeto.pecas && Array.isArray(projeto.pecas)) {
      this.pecasProjeto = [...projeto.pecas];
    }

    this.itensFormArray.clear();
    projeto.itens.forEach(item => this.adicionarItem(item));

    this.calcularTotais();
    this.updateAllStepsCompletion();

    if (this.currentStep === 2) setTimeout(() => this.aguardarCanvas(), 100);
  }

  updateAllStepsCompletion() {
    this.updateStepCompletion('tipo', !!this.projetoForm.get('tipoProjeto')?.value);
    this.updateStepCompletion('cliente', !!this.projetoForm.get('clienteId')?.value);
    this.updateStepCompletion('medidas', this.pecasProjeto.length > 0);
    this.updateStepCompletion('materiais', this.itensFormArray.length > 0);
    this.updateStepCompletion('orcamento', this.valorTotal > 0);
  }

  carregarMateriaisSugeridos() {
    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    if (tipoProjeto) {
      const tipoOption = this.tiposProjetoOptions.find(t => t.value === tipoProjeto);
      if (tipoOption) {
        this.materiaisSugeridos = this.materiaisDisponiveis
          .filter(m => tipoOption.materiaisComuns.includes(m.id))
          .map(m => ({
            ...m,
            quantidadeRecomendada: this.calcularQuantidadeRecomendada(m),
            aplicacao: this.getAplicacaoMaterial(m, tipoProjeto)
          }));
      }
    }
  }

  calcularQuantidadeRecomendada(material: MaterialTemplate): number {
    if (material.unidade === 'm²') {
      const area = parseFloat(this.calcularAreaTotalProjeto());
      return area > 0 ? Math.ceil(area * 1.1) : 1;
    }
    return 1;
  }

  getAplicacaoMaterial(material: MaterialTemplate, tipoProjeto: TipoProjeto): string {
    const aplicacoes: { [key: string]: { [key in TipoProjeto]?: string } } = {
      'Mármore': { [TipoProjeto.BANHEIRO]: 'Bancada e revestimento', [TipoProjeto.COZINHA]: 'Bancada principal', [TipoProjeto.CUBA]: 'Base da cuba' },
      'Granito': { [TipoProjeto.COZINHA]: 'Bancada de trabalho', [TipoProjeto.BANHEIRO]: 'Bancada resistente' },
      'Quartzo': { [TipoProjeto.COZINHA]: 'Bancada premium', [TipoProjeto.BANHEIRO]: 'Bancada de luxo' }
    };
    return aplicacoes[material.categoria]?.[tipoProjeto] || 'Aplicação geral';
  }

  calcularArea(): void {
    const medidas = this.projetoForm.get('medidas')?.value;
    if (!medidas || medidas.profundidade <= 0 || medidas.largura <= 0) return;
    const area = medidas.profundidade * medidas.largura;
    const perimetro = 2 * (medidas.profundidade + medidas.largura);
    this.projetoForm.get('medidas')?.patchValue({ area, perimetro }, { emitEvent: false });
  }

  calcularTotais() {
    this.valorMateriais = Math.max(0, this.itensFormArray.controls.reduce((total, control) => total + (control.get('valorTotal')?.value || 0), 0));
    const areaTotal = this.pecasProjeto.reduce((total, peca) => total + parseFloat(this.calcularAreaPeca(peca)), 0);
    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    const laborRate = this.getLaborRate(tipoProjeto);
    this.valorMaoObra = areaTotal * laborRate;
    const margemLucro = this.projetoForm.get('margemLucro')?.value || 0;
    const subtotal = this.valorMateriais + this.valorMaoObra;
    this.valorTotal = Math.max(0.01, subtotal * (1 + margemLucro / 100));
  }

  getLaborRate(tipoProjeto: TipoProjeto): number {
    const rates: { [key in TipoProjeto]: number } = {
      [TipoProjeto.BANHEIRO]: 80, [TipoProjeto.COZINHA]: 70, [TipoProjeto.CUBA]: 120,
      [TipoProjeto.BANCADA]: 60, [TipoProjeto.ESCADA]: 100, [TipoProjeto.LAREIRA]: 90,
      [TipoProjeto.SOLEIRA]: 40, [TipoProjeto.PIA]: 110, [TipoProjeto.OUTROS]: 50
    };
    return rates[tipoProjeto] || 50;
  }

  solicitarCalculoOrcamento(): void {
    if (this.projetoForm.valid) this.calcularOrcamentoAutomatico();
    else this.messageService.add({ severity: 'warn', summary: 'Formulário incompleto', detail: 'Preencha todos os campos obrigatórios antes de calcular' });
  }

  private calcularOrcamentoAutomatico(): void {
    if (this.calculandoOrcamento || Date.now() - this.lastRequestTime < 2000 || !this.validarFormularioParaCalculo()) return;

    this.calculandoOrcamento = true;
    this.lastRequestTime = Date.now();

    setTimeout(() => {
      const payload = this.prepararPayloadCalculo();
      this.projetoService.calcularOrcamento(payload).pipe(takeUntil(this.destroy$)).subscribe({
        next: (r) => this.atualizarValoresCalculados(r),
        error: (e) => this.tratarErroCalculo(e),
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
      medidas: { profundidade: formValue.medidas.profundidade, largura: formValue.medidas.largura, altura: formValue.medidas.altura },
      itens: this.itensFormArray.value.map((item: ProjetoItem) => ({ produtoId: item.produtoId, quantidade: item.quantidade, valorUnitario: item.valorUnitario })),
      margemLucro: formValue.margemLucro,
      usuarioCriacao: formValue.usuarioCriacao
    };
  }

  private atualizarValoresCalculados(resultado: any): void {
    this.valorMateriais = resultado.valorMateriais || 0;
    this.valorMaoObra = resultado.valorMaoObra || 0;
    this.valorTotal = resultado.valorTotal || 0;
    if (resultado.margemLucro !== undefined) {
      this.margemLucro = resultado.margemLucro;
      this.projetoForm.get('margemLucro')?.setValue(this.margemLucro, { emitEvent: false });
    }
    this.updateStepCompletion('orcamento', this.valorTotal > 0);
  }

  private tratarErroCalculo(error: any): void {
    console.warn('Erro ao calcular orçamento via backend:', error);
    this.valorMateriais = 0;
    this.valorMaoObra = 0;
    this.valorTotal = 0;
    this.updateStepCompletion('orcamento', false);
    let msg = 'Erro ao calcular orçamento.';
    if (error.error?.message) msg = error.error.message;
    else if (error.error?.errors) msg = error.error.errors.map((e: any) => e.message).join(', ');
    this.showToast('error', 'Erro no cálculo', msg);
  }

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.clear();
    this.messageService.add({ severity, summary, detail, life: 5000 });
  }

  salvar(): void {
    const areaTotal = parseFloat(this.calcularAreaTotalProjeto());
    if (areaTotal > 0) {
      const medidasControl = this.projetoForm.get('medidas');
      if (medidasControl) {
        medidasControl.patchValue({ largura: areaTotal, profundidade: 1, altura: Math.max(medidasControl.get('altura')?.value || 0, 0.1) }, { emitEvent: false });
      }
    }

    this.calcularTotais();
    if (!this.projetoForm.valid) {
      this.showToast('error', 'Dados inválidos', 'Verifique os campos obrigatórios.');
      return;
    }
    if (this.valorTotal <= 0) {
      this.showToast('error', 'Dados inválidos', 'Valor total não calculado. Verifique os dados e tente novamente.');
      return;
    }

    this.loading = true;
    const projetoData: Projeto = {
      ...this.projetoForm.getRawValue(),
      itens: this.itensFormArray.value,
      valorTotal: this.valorTotal,
      valorMaoObra: this.valorMaoObra,
      pecas: this.pecasProjeto,
      dataCriacao: this.isEditMode ? undefined : new Date(),
      dataAtualizacao: new Date()
    };

    const request = this.isEditMode ? this.projetoService.atualizarProjeto(this.projetoId, projetoData) : this.projetoService.criarProjeto(projetoData);

    request.pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.showToast('success', 'Sucesso', `Projeto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`);
        this.router.navigate(['/projetos']);
      },
      error: (error) => {
        const errorMsg = error.error?.message || error.error?.error || `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} projeto`;
        this.showToast('error', 'Erro', errorMsg);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/projetos']);
  }

  getSimboloUnidade(unidadeDeMedida?: string): string {
    if (!unidadeDeMedida) return '';
    const map: { [key: string]: string } = {
      METROS: 'm',
      CENTIMETROS: 'cm',
      POLEGADAS: 'in',
      UNIDADE: 'un',
      PECA: 'pç',
      METRO_QUADRADO: 'm²',
      LITRO: 'L',
      QUILOGRAMA: 'kg'
    };
    return map[unidadeDeMedida] || '';
  }

  getMaterialById(id: number): MaterialTemplate | undefined {
    return this.materiaisDisponiveis.find(m => m.id === id);
  }

  getClienteNome(clienteId: number): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  }

  getTipoProjetoOption(tipo: TipoProjeto): TipoProjetoOption | undefined {
    return this.tiposProjetoOptions.find(t => t.value === tipo);
  }

  adicionarNovoCliente() {
    this.messageService.add({ severity: 'info', summary: 'Funcionalidade', detail: 'Redirecionando para cadastro de cliente...' });
    this.router.navigate(['/clientes']);
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngAfterViewInit(): void {
    if (this.currentStep === 2) this.aguardarCanvas();
  }

  aguardarCanvas(): void {
    let tentativas = 0;
    const maxTentativas = 20;
    const verificarCanvas = () => {
      tentativas++;
      const canvas = this.canvasRef?.nativeElement || document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        this.inicializarCanvas(canvas);
      } else if (tentativas < maxTentativas) {
        setTimeout(verificarCanvas, 500);
      } else {
        this.criarCanvasManualmente();
      }
    };
    verificarCanvas();
  }

  inicializarCanvas(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d') || undefined;
    if (this.ctx) {
      this.desenharFundoInicial();
      this.atualizarCanvas();
    } else console.error('Não foi possível obter o contexto do canvas');
  }

  criarCanvasManualmente(): void {
    const container = document.querySelector('.canvas-container');
    if (container) {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 500;
      canvas.style.border = '1px solid #dee2e6'; canvas.style.borderRadius = '8px';
      container.innerHTML = '';
      container.appendChild(canvas);
      this.inicializarCanvas(canvas);
    } else console.error('Container do canvas não encontrado');
  }

  desenharFundoInicial(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef?.nativeElement || document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.strokeStyle = '#e9ecef';
    this.ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += 25) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, canvas.height); this.ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 25) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(canvas.width, y); this.ctx.stroke();
    }
    this.ctx.fillStyle = '#6c757d';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Desenho Técnico - Adicione peças para visualizar', canvas.width / 2, canvas.height / 2);
  }

  novaPeca(): void {
    if (this.pecaAtiva && !this.pecaAtiva.id) {
      this.confirmationService.confirm({ message: 'Há uma peça em edição. Deseja descartá-la e criar uma nova?', header: 'Confirmação', icon: 'pi pi-exclamation-triangle', accept: () => this.criarNovaPeca() });
    } else {
      this.criarNovaPeca();
    }
  }

  private criarNovaPeca(): void {
    this.pecaAtiva = { nome: `Peça ${this.pecasProjeto.length + 1}`, tipo: 'simples', largura: 2.0, altura: 0.6, espessura: 0.03, unidade: this.unidadePadrao, recortes: [], x: 50, y: 50 };
    setTimeout(() => this.atualizarCanvas(), 50);
  }

  salvarPecaAtiva(): void {
    if (!this.pecaAtiva || !this.pecaAtiva.nome || !this.pecaAtiva.largura || !this.pecaAtiva.altura) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios' });
      return;
    }
    if (this.pecaAtiva.id !== undefined) {
      this.pecasProjeto[this.pecaAtiva.id] = { ...this.pecaAtiva };
      delete this.pecaAtiva.id;
    } else {
      this.pecasProjeto.push({ ...this.pecaAtiva });
    }
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Peça salva com sucesso' });
    this.pecaAtiva = undefined;
    this.updateStepCompletion('medidas', this.pecasProjeto.length > 0);
    this.atualizarCanvas();
    this.calcularTotais();
  }

  editarPecaSalva(peca: PecaProjeto, index: number): void {
    this.pecaAtiva = { ...peca, id: index };
    this.atualizarCanvas();
  }

  removerPeca(index: number): void {
    const peca = this.pecasProjeto[index];
    this.confirmationService.confirm({ message: `Deseja realmente remover a peça \"${peca.nome}\"?`, header: 'Confirmação', icon: 'pi pi-exclamation-triangle', accept: () => {
      this.pecasProjeto.splice(index, 1);
      this.updateStepCompletion('medidas', this.pecasProjeto.length > 0);
      this.atualizarCanvas();
    }});
  }

  onTipoPecaChange(): void {
    if (this.pecaAtiva) {
      switch (this.pecaAtiva.tipo) {
        case 'bancada': this.pecaAtiva.altura = this.pecaAtiva.altura || 0.6; this.pecaAtiva.espessura = 0.03; break;
        case 'ilha': this.pecaAtiva.altura = this.pecaAtiva.altura || 1.0; this.pecaAtiva.espessura = 0.03; break;
        case 'soleira': this.pecaAtiva.altura = this.pecaAtiva.altura || 0.15; this.pecaAtiva.espessura = 0.02; break;
      }
      this.atualizarCanvas();
    }
  }

  adicionarRecorte(): void {
    if (!this.pecaAtiva) return;
    if (!this.pecaAtiva.recortes) this.pecaAtiva.recortes = [];
    this.pecaAtiva.recortes.push({ tipo: 'Furo', largura: 0.1, altura: 0.1 });
    this.atualizarCanvas();
  }

  removerRecorte(index: number): void {
    if (this.pecaAtiva?.recortes) {
      this.pecaAtiva.recortes.splice(index, 1);
      this.atualizarCanvas();
    }
  }

  atualizarCanvas(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef?.nativeElement || document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    this.desenharFundoInicial();
    this.pecasProjeto.forEach((peca) => this.desenharPecaSimples(peca, peca.x || 50, peca.y || 50, false));
    if (this.pecaAtiva?.largura && this.pecaAtiva.altura) {
      this.desenharPecaSimples(this.pecaAtiva, this.pecaAtiva.x || 300, this.pecaAtiva.y || 200, true);
    }
  }

  desenharPecaSimples(peca: PecaProjeto, x: number, y: number, ativa: boolean): void {
    if (!this.ctx || !peca.largura || !peca.altura) return;
    const larguraPx = this.converterParaPixels(peca.largura, peca.unidade);
    const alturaPx = this.converterParaPixels(peca.altura, peca.unidade);
    this.ctx.strokeStyle = ativa ? '#007bff' : '#495057';
    this.ctx.lineWidth = ativa ? 2 : 1;
    this.ctx.strokeRect(x, y, larguraPx, alturaPx);
    if (ativa) {
      this.ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';
      this.ctx.fillRect(x, y, larguraPx, alturaPx);
      this.desenharManipuladores(x, y, larguraPx, alturaPx);
    }
    this.ctx.fillStyle = '#495057';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(peca.nome || 'Peça', x, y - 5);
    this.desenharCotasSimples(x, y, larguraPx, alturaPx, peca);
  }

  desenharManipuladores(x: number, y: number, largura: number, altura: number): void {
    if (!this.ctx) return;
    const tamanho = 8;
    this.ctx.fillStyle = '#007bff';
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    const manipuladorX = x + largura - tamanho / 2;
    const manipuladorY = y + altura - tamanho / 2;
    this.ctx.fillRect(manipuladorX, manipuladorY, tamanho, tamanho);
    this.ctx.strokeRect(manipuladorX, manipuladorY, tamanho, tamanho);
  }

  desenharCotasSimples(x: number, y: number, largura: number, altura: number, peca: PecaProjeto): void {
    if (!this.ctx) return;
    this.ctx.strokeStyle = '#6c757d';
    this.ctx.lineWidth = 1;
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#6c757d';
    this.ctx.textAlign = 'center';
    const cotaY = y + altura + 15;
    this.ctx.beginPath(); this.ctx.moveTo(x, cotaY); this.ctx.lineTo(x + largura, cotaY); this.ctx.stroke();
    this.ctx.fillText(`${peca.largura}${this.getSimboloUnidadeCanvas()}`, x + largura / 2, cotaY + 12);
    const cotaX = x + largura + 15;
    this.ctx.beginPath(); this.ctx.moveTo(cotaX, y); this.ctx.lineTo(cotaX, y + altura); this.ctx.stroke();
    this.ctx.save();
    this.ctx.translate(cotaX + 12, y + altura / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(`${peca.altura}${this.getSimboloUnidadeCanvas()}`, 0, 0);
    this.ctx.restore();
  }

  converterParaPixels(valor: number, unidade: string): number {
    let valorMetros = valor;
    if (unidade === 'cm') valorMetros = valor / 100;
    else if (unidade === 'in') valorMetros = valor * 0.0254;
    return valorMetros * this.escala;
  }

  onCanvasClick(event: MouseEvent): void {}

  limparCanvas(): void {
    this.desenharFundoInicial();
  }

  exportarDesenho(): void {
    if (!this.canvasRef) return;
    const link = document.createElement('a');
    link.download = `projeto-${Date.now()}.png`;
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }

  calcularAreaPeca(peca: PecaProjeto): string {
    if (!peca.largura || !peca.altura) return '0.00';
    let larguraMetros = peca.largura;
    let alturaMetros = peca.altura;
    if (peca.unidade === 'cm') { larguraMetros /= 100; alturaMetros /= 100; }
    else if (peca.unidade === 'in') { larguraMetros *= 0.0254; alturaMetros *= 0.0254; }
    return (larguraMetros * alturaMetros).toFixed(2);
  }

  calcularAreaTotalProjeto(): string {
    return this.pecasProjeto.reduce((total, peca) => total + parseFloat(this.calcularAreaPeca(peca)), 0).toFixed(2);
  }

  onUnidadeChange(): void {
    this.pecasProjeto.forEach(peca => {
      if (peca.unidade !== this.unidadePadrao) {
        peca.largura = this.converterUnidade(peca.largura, peca.unidade, this.unidadePadrao);
        peca.altura = this.converterUnidade(peca.altura, peca.unidade, this.unidadePadrao);
        if (peca.espessura) peca.espessura = this.converterUnidade(peca.espessura, peca.unidade, this.unidadePadrao);
        peca.unidade = this.unidadePadrao;
      }
    });
    if (this.pecaAtiva && this.pecaAtiva.unidade !== this.unidadePadrao) {
      this.pecaAtiva.largura = this.converterUnidade(this.pecaAtiva.largura, this.pecaAtiva.unidade, this.unidadePadrao);
      this.pecaAtiva.altura = this.converterUnidade(this.pecaAtiva.altura, this.pecaAtiva.unidade, this.unidadePadrao);
      if (this.pecaAtiva.espessura) this.pecaAtiva.espessura = this.converterUnidade(this.pecaAtiva.espessura, this.pecaAtiva.unidade, this.unidadePadrao);
      this.pecaAtiva.unidade = this.unidadePadrao;
    }
    this.atualizarCanvas();
  }

  converterUnidade(valor: number, de: string, para: string): number {
    if (de === para) return valor;
    let valorMetros = valor;
    if (de === 'cm') valorMetros = valor / 100;
    else if (de === 'in') valorMetros = valor * 0.0254;
    if (para === 'cm') return valorMetros * 100;
    else if (para === 'in') return valorMetros / 0.0254;
    return valorMetros;
  }

  getSimboloUnidadeCanvas(): string {
    const map: { [key: string]: string } = { m: 'm', cm: 'cm', in: '"' };
    return map[this.unidadePadrao] || 'm';
  }

  onCanvasMouseDown(event: MouseEvent): void {
    if (!this.ctx) return;
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;

    for (let i = this.pecasProjeto.length - 1; i >= 0; i--) {
      const peca = this.pecasProjeto[i];
      const larguraPx = this.converterParaPixels(peca.largura, peca.unidade);
      const alturaPx = this.converterParaPixels(peca.altura, peca.unidade);
      const pecaX = peca.x || 0, pecaY = peca.y || 0;
      const margem = 10;
      if (x >= pecaX && x <= pecaX + larguraPx && y >= pecaY && y <= pecaY + alturaPx) {
        this.pecaSelecionada = { ...peca, index: i };
        this.pontoInicialMouse = { x, y };
        this.posicaoInicialPeca = { x: pecaX, y: pecaY };
        this.dimensaoInicialPeca = { largura: peca.largura, altura: peca.altura };
        const naBordaDireita = x >= pecaX + larguraPx - margem;
        const naBordaInferior = y >= pecaY + alturaPx - margem;
        this.redimensionando = naBordaDireita || naBordaInferior;
        this.arrastando = !this.redimensionando;
        break;
      }
    }
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if ((!this.arrastando && !this.redimensionando) || !this.pecaSelecionada) return;
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const deltaX = x - this.pontoInicialMouse.x, deltaY = y - this.pontoInicialMouse.y;

    if (this.arrastando) {
      this.pecasProjeto[this.pecaSelecionada.index].x = this.posicaoInicialPeca.x + deltaX;
      this.pecasProjeto[this.pecaSelecionada.index].y = this.posicaoInicialPeca.y + deltaY;
    } else if (this.redimensionando) {
      const novaLargura = Math.max(0.1, this.dimensaoInicialPeca.largura + (deltaX / this.escala));
      const novaAltura = Math.max(0.1, this.dimensaoInicialPeca.altura + (deltaY / this.escala));
      this.pecasProjeto[this.pecaSelecionada.index].largura = novaLargura;
      this.pecasProjeto[this.pecaSelecionada.index].altura = novaAltura;
      this.calcularTotais();
    }
    this.atualizarCanvas();
  }

  onCanvasMouseUp(event: MouseEvent): void {
    this.arrastando = false;
    this.redimensionando = false;
    this.pecaSelecionada = undefined;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
