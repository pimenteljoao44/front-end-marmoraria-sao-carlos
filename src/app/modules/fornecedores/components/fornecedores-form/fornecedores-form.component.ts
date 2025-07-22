import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { EstadoService } from 'src/app/services/estado/estado.service';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { FornecedoresDateTransferService } from 'src/app/shared/services/fornecedores/fornecedores-date-transfer.service';
import { FornecedorEvent } from 'src/models/enums/fornecedor/FornecedorEvent';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { Endereco } from 'src/models/interfaces/endereco/Endereco';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-fornecedores-form',
  templateUrl: './fornecedores-form.component.html',
  styleUrls: ['./fornecedores-form.component.scss']
})
export class FornecedoresFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public fornecedorAction!: {
    event: EventAction;
    fornecedoresList: Array<Fornecedor>;
  };

  tipoPessoa = [
    { label: 'Pessoa Física', value: 'PESSOA_FISICA' },
    { label: 'Pessoa Jurídica', value: 'PESSOA_JURIDICA' },
  ];

  public TipoPessoaSelected: Array<{ label: string; value: string }> = [];
  public fornecedorSelectedDatas!: Fornecedor;
  public fornecedorDatas: Array<Fornecedor> = [];
  public cidades: Array<Cidade> = [];
  public estados: Array<Estado> = [];
  public filteredEstados: Estado[] = [];
  public cidadeSelecionada!: Cidade;
  public estadoSelecionado: Estado | null = null;
  public cidadesFiltradas: Cidade[] = [];
  public addFornecedorForm: FormGroup;
  public editFornecedorForm: FormGroup;

  updateValidators(form: FormGroup): void {
    const tipoPessoaValue = form.get('tipoPessoa')?.value;

    const cpfControl = form.get('cpf');
    const cnpjControl = form.get('cnpj');
    const rgControl = form.get('rg');

    // Salva os valores atuais antes de limpar os validadores
    const currentCpf = cpfControl?.value;
    const currentCnpj = cnpjControl?.value;
    const currentRg = rgControl?.value;

    cpfControl?.clearValidators();
    cnpjControl?.clearValidators();
    rgControl?.clearValidators();

    if (tipoPessoaValue === 'PESSOA_FISICA') {
      cpfControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ]);
      rgControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}$/),
      ]);

      // Só limpa o CNPJ se não estiver vazio
      if (currentCnpj) {
        cnpjControl?.setValue('');
      }

      // Mantém os valores de CPF e RG se já existirem
      if (!currentCpf) {
        cpfControl?.setValue('');
      }
      if (!currentRg) {
        rgControl?.setValue('');
      }
    } else if (tipoPessoaValue === 'PESSOA_JURIDICA') {
      cnpjControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
      ]);

      // Só limpa CPF e RG se não estiverem vazios
      if (currentCpf) {
        cpfControl?.setValue('');
      }
      if (currentRg) {
        rgControl?.setValue('');
      }

      // Mantém o valor do CNPJ se já existir
      if (!currentCnpj) {
        cnpjControl?.setValue('');
      }
    }

    cpfControl?.updateValueAndValidity();
    cnpjControl?.updateValueAndValidity();
    rgControl?.updateValueAndValidity();
  }

  formatarRG(event: any, form: FormGroup): void {
    const rg = event.target.value.replace(/\D/g, '');
    let formattedRG = '';

    if (rg.length <= 9) {
      formattedRG = rg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else {
      formattedRG = rg.substring(0, 9);
      formattedRG = formattedRG.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    }

    form.get('rg')?.setValue(formattedRG);
  }

  formatarCPF(event: any, form: FormGroup): void {
    const cpf = event.target.value.replace(/\D/g, '');
    let formattedCPF = '';

    if (cpf.length <= 11) {
      formattedCPF = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      formattedCPF = cpf.substring(0, 11);
      formattedCPF = formattedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    form.get('cpf')?.setValue(formattedCPF);
  }

  formatarCNPJ(event: any, form: FormGroup): void {
    const cnpj = event.target.value.replace(/\D/g, '');
    let formattedCNPJ = '';

    if (cnpj.length <= 14) {
      formattedCNPJ = cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    } else {
      formattedCNPJ = cnpj.substring(0, 14);
      formattedCNPJ = formattedCNPJ.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }

    form.get('cnpj')?.setValue(formattedCNPJ);
  }

  onTipoPessoaChange(form: FormGroup): void {
    this.updateValidators(form);
  }

  onCidadeChange(cidade: Cidade): void {
    this.cidadeSelecionada = cidade;
    console.log(this.cidadeSelecionada);
  }

  public addFornecedorAction = FornecedorEvent.CREATE_FORNECEDOR_EVENT;
  public editFornecedorAction = FornecedorEvent.EDIT_FORNECEDOR_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private estadoService: EstadoService,
    private cidadeService: CidadeService,
    private fornecedorService: FornecedorService,
    private ref: DynamicDialogConfig,
    private datePipe: DatePipe,
    private fornecedorDTO: FornecedoresDateTransferService
  ) {
    this.addFornecedorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: this.formBuilder.group({
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          uf: [''],
        }),
        estado: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          sigla: [''],
        }),
      }),
      cpf: [''],
      rg: [''],
      cnpj: [''],
      tipoPessoa: ['PESSOA_FISICA', Validators.required],
      dataCriacao: [this.getDate(), Validators.required],
      dataAtualizacao: [''],
    });

    this.editFornecedorForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: this.formBuilder.group({
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          uf: [''],
        }),
        estado: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          sigla: [''],
        }),
      }),
      cpf: [''],
      rg: [''],
      cnpj: [''],
      tipoPessoa: ['PESSOA_FISICA', Validators.required],
      dataCriacao: [this.getDate()],
      dataAtualizacao: [''],
    });
  }

  ngOnInit(): void {
    this.updateValidators(this.addFornecedorForm);
    this.updateValidators(this.editFornecedorForm);

    this.fornecedorAction = this.ref.data;
    if (
      this.fornecedorAction?.event.action === this.editFornecedorAction &&
      this.fornecedorAction?.fornecedoresList
    ) {
      const fornecedorId = this.fornecedorAction?.event?.id as number;
      this.getFornecedorSelectedDatas(fornecedorId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
    }
    this.getEstados();
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addFornecedorForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editFornecedorForm.get('endereco') as FormGroup;

    const cidadeId = cidadeSelecionada.id;

    addEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    addEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);

    editEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    editEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);

    const currentDate = this.getDate();
    addEnderecoForm.get('cidade.estado.dataCriacao')?.setValue(currentDate);
    editEnderecoForm.get('cidade.estado.dataCriacao')?.setValue(currentDate);
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
  }

  getCidades(): void {
    this.cidadeService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.cidades = response;
            if (this.cidades.length > 0) {
              this.cidadeSelecionada = this.cidades[0];
              this.setCidadeNosFormularios(this.cidadeSelecionada);
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getEstados() {
    return this.estadoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.estados = response;
        },
        error: (err) => {
          console.error('Erro ao carregar estados:', err);
        },
      });
  }

  onEstadoChange(event: any, form: FormGroup): void {
    const estado = event.value ? event.value : event;
    this.estadoSelecionado = estado;
    const enderecoForm = form.get('endereco') as FormGroup;
    const estadoForm = enderecoForm.get('estado') as FormGroup;
    estadoForm.patchValue({
      id: estado.id,
      nome: estado.nome,
      sigla: estado.sigla
    });

    const cidadeForm = enderecoForm.get('cidade') as FormGroup;
    cidadeForm.patchValue({
      id: null,
      nome: '',
      uf: ''
    });

    this.carregarCidadesPorEstado(estado.sigla);

    console.log(this.estadoSelecionado);
  }

  private carregarCidadesPorEstado(siglaEstado: string): void {
    this.cidadeService
      .findByEstadoSigla(siglaEstado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cidades) => {
          this.cidadesFiltradas = cidades;

          // Se estiver editando e a cidade atual pertence ao estado, mantém na lista
          if (this.fornecedorAction?.event.action === this.editFornecedorAction &&
            this.cidadeSelecionada &&
            this.cidadeSelecionada.uf === siglaEstado) {
            const cidadeExiste = this.cidadesFiltradas.some(c => c.id === this.cidadeSelecionada.id);
            if (!cidadeExiste) {
              this.cidadesFiltradas.push(this.cidadeSelecionada);
            }
          }
        },
        error: (err) => {
          console.error('Erro ao buscar cidades por UF:', err);
          this.cidadesFiltradas = [];
        },
      });
  }

  onCidadeSelect(event: any, form: FormGroup): void {
    const cidade = event.value ? event.value : event;
    if (cidade) {
      const enderecoForm = form.get('endereco') as FormGroup;
      const cidadeForm = enderecoForm.get('cidade') as FormGroup;
      cidadeForm.patchValue({
        id: cidade.id,
        nome: cidade.nome,
        uf: cidade.uf
      });

      this.cidadeSelecionada = cidade;
    }
  }

  searchCidades(event: any): void {
    const query = event.query?.toLowerCase() || '';

    // Se não há estado selecionado, não filtra nada
    if (!this.estadoSelecionado) {
      this.cidadesFiltradas = [];
      return;
    }

    // Se não há query, mostra todas as cidades do estado
    if (!query) {
      this.carregarCidadesPorEstado(this.estadoSelecionado.sigla);
      return;
    }

    // Filtra as cidades do estado atual baseado na query
    this.cidadeService
      .findByEstadoSigla(this.estadoSelecionado.sigla)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cidades) => {
          this.cidadesFiltradas = cidades.filter(c =>
            c.nome && c.nome.toLowerCase().includes(query)
          );

          if (this.fornecedorAction?.event.action === this.editFornecedorAction &&
            this.cidadeSelecionada &&
            this.cidadeSelecionada.uf === this.estadoSelecionado?.sigla &&
            this.cidadeSelecionada.nome?.toLowerCase().includes(query)) {
            const cidadeExiste = this.cidadesFiltradas.some(c => c.id === this.cidadeSelecionada.id);
            if (!cidadeExiste) {
              this.cidadesFiltradas.push(this.cidadeSelecionada);
            }
          }
        },
        error: (err) => {
          console.error('Erro ao buscar cidades:', err);
          this.cidadesFiltradas = [];
        }
      });
  }

  filterEstados(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredEstados = this.estados.filter(e => e.nome.toLowerCase().includes(query));
  }

  private getFormGroupAtivo(): FormGroup {
    return this.fornecedorAction?.event.action === this.addFornecedorAction
      ? this.addFornecedorForm
      : this.editFornecedorForm;
  }

  checkEnderecoInvalido(form: FormGroup): void {
    const enderecoGroup = form.get('endereco') as FormGroup;

    Object.keys(enderecoGroup.controls).forEach((controlName) => {
      const control = enderecoGroup.get(controlName);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subControlName) => {
          const subControl = control.get(subControlName);
          if (subControl && subControl.invalid) {
            console.log(
              `Campo inválido: endereco.${controlName}.${subControlName}`
            );
          }
        });
      } else if (control && control.invalid) {
        console.log(`Campo inválido: endereco.${controlName}`);
      }
    });
  }

  handleSubmitAddFornecedor(): void {
    const invalidControls: string[] = [];
    console.log(JSON.stringify(this.addFornecedorForm.value as FormGroup))
    Object.keys(this.addFornecedorForm.controls).forEach((controlName) => {
      const control = this.addFornecedorForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addFornecedorForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const endereco = this.addFornecedorForm.value.endereco as Endereco;
    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const requestAddFornecedor: Fornecedor = {
      id: this.fornecedorAction.event.id as number,
      nome: this.addFornecedorForm.value.nome as string,
      telefone: this.addFornecedorForm.value.telefone as string,
      endereco: {
        rua: endereco.rua as string,
        numero: endereco.numero as string,
        complemento: endereco.complemento as string,
        bairro: endereco.bairro as string,
        cidade: {
          id: this.addFornecedorForm.value.endereco.cidade.id.id,
          nome: this.addFornecedorForm.value.endereco.cidade.id.nome,
          uf: this.addFornecedorForm.value.endereco.cidade.id.uf,
        },
        estado: {
          id: this.estadoSelecionado?.id,
          sigla: this.estadoSelecionado?.sigla as string,
          nome: this.estadoSelecionado?.nome as string,
        },
      },
      cpf: this.addFornecedorForm.value.cpf as string,
      rg: this.addFornecedorForm.value.rg as string,
      cnpj: this.addFornecedorForm.value.cnpj as string,
      tipoPessoa: this.addFornecedorForm.value.tipoPessoa as string,
      dataCriacao: this.addFornecedorForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };
    this.checkEnderecoInvalido(this.addFornecedorForm)
    this.fornecedorService
      .create(requestAddFornecedor as Fornecedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addFornecedorForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O fornecedor ${response.nome} foi criado com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.error('Erro durante a solicitação:', err);
          if (err.error.error === 'Fornecedor já cadastrado na base de dados!') {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error.error,
              life: 2000,
            });
            return;
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar Fornecedor.`,
            life: 2000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditFornecedor(): void {
    const invalidControls: string[] = [];
    Object.keys(this.editFornecedorForm.controls).forEach((controlName) => {
      const control = this.editFornecedorForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editFornecedorForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }

    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const endereco = this.editFornecedorForm.value.endereco as Endereco;

    const requestEditFornecedor: Fornecedor = {
      id: this.fornecedorAction.event.id as number,
      nome: this.editFornecedorForm.value.nome as string,
      telefone: this.editFornecedorForm.value.telefone as string,
      endereco: {
        rua: endereco.rua as string,
        numero: endereco.numero as string,
        complemento: endereco.complemento as string,
        bairro: endereco.bairro as string,
        cidade: {
          id: this.editFornecedorForm.value.endereco.cidade.id,
          nome: this.editFornecedorForm.value.endereco.cidade.nome,
          uf: this.editFornecedorForm.value.endereco.cidade.uf
        },
        estado: {
          id: this.estadoSelecionado?.id,
          sigla: this.estadoSelecionado?.sigla as string,
          nome: this.estadoSelecionado?.nome as string,
        },
      },
      cpf: this.editFornecedorForm.value.cpf as string,
      rg: this.editFornecedorForm.value.rg as string,
      cnpj: this.editFornecedorForm.value.cnpj as string,
      tipoPessoa: this.editFornecedorForm.value.tipoPessoa as string,
      dataCriacao: this.editFornecedorForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };

    console.log(JSON.stringify(requestEditFornecedor))

    this.fornecedorService
      .update(requestEditFornecedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O fornecedor foi editado com sucesso!`,
              life: 2000,
            });
            this.editFornecedorForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar fornecedor, ${err.error.error}`,
            life: 2000,
          });
        },
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

  getFornecedorSelectedDatas(fornecedor_id: number): void {
    const allFornecedores = this.fornecedorAction.fornecedoresList;

    if (allFornecedores.length > 0) {
      const fornecedorFiltered = allFornecedores.find(
        (element) => element?.id === fornecedor_id
      );

      if (fornecedorFiltered) {
        this.fornecedorSelectedDatas = fornecedorFiltered;
        this.cidadeSelecionada = fornecedorFiltered.endereco.cidade;

        this.estadoSelecionado = fornecedorFiltered.endereco.estado;

        this.carregarCidadesPorEstado(this.estadoSelecionado.sigla);

        this.editFornecedorForm.patchValue({
          id: fornecedorFiltered.id,
          nome: fornecedorFiltered.nome,
          telefone: fornecedorFiltered.telefone,
          endereco: {
            rua: fornecedorFiltered.endereco.rua,
            numero: fornecedorFiltered.endereco.numero,
            complemento: fornecedorFiltered.endereco.complemento,
            bairro: fornecedorFiltered.endereco.bairro,
            estado: {
              id: fornecedorFiltered.endereco.estado.id,
              nome: fornecedorFiltered.endereco.estado.nome,
              sigla: fornecedorFiltered.endereco.estado.sigla
            },
            cidade: {
              id: fornecedorFiltered.endereco.cidade.id,
              nome: fornecedorFiltered.endereco.cidade.nome,
              uf: fornecedorFiltered.endereco.cidade.uf
            }
          },
          cpf: fornecedorFiltered.tipoPessoa === 'PESSOA_FISICA' ? fornecedorFiltered.cpf : '',
          rg: fornecedorFiltered.tipoPessoa === 'PESSOA_FISICA' ? fornecedorFiltered.rg : '',
          cnpj: fornecedorFiltered.tipoPessoa === 'PESSOA_JURIDICA' ? fornecedorFiltered.cnpj : '',
          tipoPessoa: fornecedorFiltered.tipoPessoa,
          dataCriacao: fornecedorFiltered.dataCriacao,
          dataAtualizacao: fornecedorFiltered.dataAtualizacao,
        });

        this.updateValidators(this.editFornecedorForm);

        console.log(JSON.stringify(this.editFornecedorForm.value))
      }
    }
  }

  setUserDatas(): void {
    this.fornecedorService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.fornecedorDatas = response;
            this.fornecedorDatas &&
            this.fornecedorDTO.setFornecedoresDatas(this.fornecedorDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
