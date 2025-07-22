import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import {TipoProjeto} from "../../../../../models/enums/projeto/TipoProjeto";
import {ProjetoService} from "../../../../services/projeto/projeto.service";
import {Projeto, TipoProjetoOption} from "../../../../../models/interfaces/projeto/Projeto";
import {ProjetoItem, ProjetoItemForm} from "../../../../../models/interfaces/projeto/ProjetoItem";
import {StatusProjeto} from "../../../../../models/enums/projeto/StatusProjeto";
import {ClientesService} from "../../../../services/clientes/clientes.service";
import {ProdutoService} from "../../../../services/produto/produto.service";

@Component({
  selector: 'app-criar-projeto',
  templateUrl: './criar-projeto.component.html',
  styleUrls: ['./criar-projeto.component.scss']
})
export class CriarProjetoComponent implements OnInit {
  projetoForm: FormGroup;
  isEditMode = false;
  projetoId!: number;
  loading = false;
  calculandoOrcamento = false;

  // Options
  tiposProjetoOptions: TipoProjetoOption[] = [
    {
      label: 'Banheiro',
      value: TipoProjeto.BANHEIRO,
      icon: 'pi pi-home',
      description: 'Projetos para banheiros completos',
      materiaisComuns: [1, 2, 3] // IDs exemplo - usar IDs reais dos produtos
    },
    {
      label: 'Cozinha',
      value: TipoProjeto.COZINHA,
      icon: 'pi pi-bookmark',
      description: 'Bancadas e projetos para cozinha',
      materiaisComuns: [4, 5, 6]
    },
    {
      label: 'Cuba',
      value: TipoProjeto.CUBA,
      icon: 'pi pi-circle',
      description: 'Cubas e pias personalizadas',
      materiaisComuns: [7, 8, 9]
    },
    {
      label: 'Bancada',
      value: TipoProjeto.BANCADA,
      icon: 'pi pi-minus',
      description: 'Bancadas diversas',
      materiaisComuns: [10, 11, 12]
    }
  ];

  clientes: any[] = [];
  produtos: any[] = [];
  materiaisSugeridos: any[] = [];

  // Cálculos
  valorMateriais = 0;
  valorMaoObra = 0;
  valorTotal = 0;
  margemLucro = 20; // 20% padrão

  constructor(
    private fb: FormBuilder,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clientesService: ClientesService,
    private produtoService: ProdutoService
  ) {
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
      itens: this.fb.array([])
    });
  }

  ngOnInit() {
    this.projetoId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.projetoId;

    this.carregarDados();

    if (this.isEditMode) {
      this.carregarProjeto();
    }

    // Watch for changes in tipo projeto to suggest materials
    this.projetoForm.get('tipoProjeto')?.valueChanges.subscribe(tipo => {
      if (tipo) {
        this.carregarMateriaisSugeridos();
      }
    });

    // Watch for changes in medidas to recalculate
    this.projetoForm.get('medidas')?.valueChanges.subscribe(() => {
      this.calcularArea();
      this.calcularOrcamentoAutomatico();
    });
  }


  get itensFormArray(): FormArray {
    return this.projetoForm.get('itens') as FormArray;
  }

  carregarDados() {
    this.clientesService.findAll().subscribe(clientes => this.clientes = clientes);
    this.produtoService.findAll().subscribe(produtos => this.produtos = produtos);
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

    // Limpar array de itens
    while (this.itensFormArray.length !== 0) {
      this.itensFormArray.removeAt(0);
    }

    // Adicionar itens do projeto
    projeto.itens.forEach(item => {
      this.adicionarItem(item);
    });

    this.calcularTotais();
  }

  carregarMateriaisSugeridos() {
    const tipoProjeto = this.projetoForm.get('tipoProjeto')?.value;
    const medidas = this.projetoForm.get('medidas')?.value;

    if (tipoProjeto && medidas.profundidade && medidas.largura && medidas.altura) {
      this.projetoService.obterMateriaisSugeridos(tipoProjeto, medidas).subscribe({
        next: (materiais) => {
          this.materiaisSugeridos = materiais;
        },
        error: (error) => {
          console.error('Erro ao carregar materiais sugeridos:', error);
        }
      });
    }
  }

  adicionarMaterialSugerido(material: any) {
    const itemExistente = this.itensFormArray.controls.find(
      control => control.get('produtoId')?.value === material.produtoId
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
      produtoId: material.produtoId,
      produto: material.produto,
      quantidade: material.quantidadeRecomendada,
      valorUnitario: material.produto.preco,
      valorTotal: material.quantidadeRecomendada * material.produto.preco
    });
  }

  adicionarItem(item?: Partial<ProjetoItemForm>) {
    const itemForm = this.fb.group({
      produtoId: [item?.produtoId || null, Validators.required], // Removido .item
      quantidade: [item?.quantidade || 1, [Validators.required, Validators.min(0.01)]],
      valorUnitario: [item?.valorUnitario || 0, [Validators.required, Validators.min(0)]],
      valorTotal: [{ value: item?.valorTotal || 0, disabled: true }],
      observacoes: [item?.observacoes || '']
    });

    // Watch for changes to recalculate
    itemForm.get('quantidade')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));
    itemForm.get('valorUnitario')?.valueChanges.subscribe(() => this.calcularItemTotal(itemForm));
    itemForm.get('produtoId')?.valueChanges.subscribe((produtoId) => {
      if (produtoId) {
        const produto = this.produtos.find(p => p.id === produtoId);
        if (produto) {
          itemForm.patchValue({ valorUnitario: produto.preco });
        }
      }
    });

    this.itensFormArray.push(itemForm);
    this.calcularItemTotal(itemForm);
  }

  removerItem(index: number) {
    this.confirmationService.confirm({
      message: 'Deseja realmente remover este item?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itensFormArray.removeAt(index);
        this.calcularTotais();
      }
    });
  }

  calcularItemTotal(itemForm: FormGroup) {
    const quantidade = itemForm.get('quantidade')?.value || 0;
    const valorUnitario = itemForm.get('valorUnitario')?.value || 0;
    const valorTotal = quantidade * valorUnitario;

    itemForm.get('valorTotal')?.setValue(valorTotal);
    this.calcularTotais();
  }

  calcularArea() {
    const medidas = this.projetoForm.get('medidas')?.value;
    if (medidas.profundidade && medidas.largura) {
      const area = medidas.profundidade * medidas.largura;
      const perimetro = 2 * (medidas.profundidade + medidas.largura);

      this.projetoForm.get('medidas')?.patchValue({
        area: area,
        perimetro: perimetro
      });
    }
  }

  calcularTotais() {
    this.valorMateriais = this.itensFormArray.controls.reduce((total, control) => {
      return total + (control.get('valorTotal')?.value || 0);
    }, 0);

    const medidas = this.projetoForm.get('medidas')?.value;
    const area = medidas.profundidade * medidas.largura || 0;

    // Cálculo da mão de obra baseado na área (R$ 50 por m²)
    this.valorMaoObra = area * 50;

    const margemLucro = this.projetoForm.get('margemLucro')?.value || 0;
    const subtotal = this.valorMateriais + this.valorMaoObra;
    this.valorTotal = subtotal * (1 + margemLucro / 100);
  }

  calcularOrcamentoAutomatico() {
    if (!this.projetoForm.valid) return;

    this.calculandoOrcamento = true;

    const projetoData = {
      ...this.projetoForm.value,
      itens: this.itensFormArray.value
    };

    this.projetoService.calcularOrcamento(projetoData).subscribe({
      next: (resultado) => {
        this.valorMateriais = resultado.valorMateriais;
        this.valorMaoObra = resultado.valorMaoObra;
        this.valorTotal = resultado.valorTotal;
        this.calculandoOrcamento = false;
      },
      error: (error) => {
        console.error('Erro ao calcular orçamento:', error);
        this.calcularTotais(); // Fallback para cálculo local
        this.calculandoOrcamento = false;
      }
    });
  }

  salvar() {
    if (!this.projetoForm.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    this.loading = true;

    const projetoData: Projeto = {
      ...this.projetoForm.value,
      itens: this.itensFormArray.value,
      valorTotal: this.valorTotal,
      valorMaoObra: this.valorMaoObra,
      dataCriacao: this.isEditMode ? undefined : new Date(),
      dataAtualizacao: new Date(),
      usuarioCriacao: 1 // Obter do serviço de autenticação
    };

    const request = this.isEditMode
      ? this.projetoService.atualizarProjeto(this.projetoId, projetoData)
      : this.projetoService.criarProjeto(projetoData);

    request.subscribe({
      next: (projeto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Projeto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`
        });
        this.router.navigate(['/projetos']);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} projeto`
        });
        this.loading = false;
      }
    });
  }

  gerarOrdemServico() {
    if (!this.projetoId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Salve o projeto antes de gerar a ordem de serviço'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Deseja gerar a ordem de serviço para este projeto?',
      header: 'Confirmação',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.projetoService.gerarOrdemServico(this.projetoId).subscribe({
          next: (os) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Ordem de serviço ${os.numero} gerada com sucesso`
            });
            // Atualizar status do projeto
            this.projetoService.atualizarStatus(this.projetoId, StatusProjeto.APROVADO).subscribe();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao gerar ordem de serviço'
            });
          }
        });
      }
    });
  }

  cancelar() {
    this.router.navigate(['/projetos']);
  }

  getProdutoNome(produtoId: number): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  }
}
