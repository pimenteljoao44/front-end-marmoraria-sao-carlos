import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { EstadoService } from 'src/app/services/estado/estado.service';
import { FuncionarioService } from 'src/app/services/funcionario/funcionario.service';
import { FuncionariosDataTransferService } from 'src/app/shared/services/funcionarios/funcionarios-data-transfer.service';
import { FuncionarioEvent } from 'src/models/enums/funcionario/FuncionarioEvent';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { Endereco } from 'src/models/interfaces/endereco/Endereco';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { Funcionario } from 'src/models/interfaces/funcionario/Funcionario';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-funcionarios-form',
  templateUrl: './funcionarios-form.component.html',
  styleUrls: ['./funcionarios-form.component.scss']
})
export class FuncionariosFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public funcionarioAction!: {
    event: EventAction;
    funcionariosList: Array<Funcionario>;
  };

  tipoPessoa = [
    { label: 'Pessoa Física', value: 'PESSOA_FISICA' },
    { label: 'Pessoa Jurídica', value: 'PESSOA_JURIDICA' },
  ];

  public TipoPessoaSelected: Array<{ label: string; value: string }> = [];
  public funcionarioSelectedDatas!: Funcionario;
  public funcionarioDatas: Array<Funcionario> = [];
  public cidades: Array<Cidade> = [];
  public cidadeSelecionada!: Cidade;
  public estados: Estado[] = [];
  public estadoSelecionado: Estado | null = null;
  public cidadesFiltradas: Cidade[] = [];
  public filteredEstados: Estado[] = [];
  public addFuncionarioForm: FormGroup;
  public editFuncionarioForm: FormGroup;

  updateValidators(form: FormGroup): void {
    const tipoPessoaValue = form.get('tipoPessoa')?.value;

    const cpfControl = form.get('cpf');
    const cnpjControl = form.get('cnpj');
    const rgControl = form.get('rg');

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

  formatarRG(event: any,form: FormGroup): void {
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

  public addFuncionarioAction = FuncionarioEvent.CREATE_FUNCIONARIO_EVENT;
  public editFuncionarioAtion = FuncionarioEvent.EDIT_FUNCIONARIO_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private estadoService: EstadoService,
    private cidadeService: CidadeService,
    private funcionarioService: FuncionarioService,
    private ref: DynamicDialogConfig,
    private datePipe: DatePipe,
    private funcionarioDTO: FuncionariosDataTransferService
  ) {
    this.addFuncionarioForm = this.formBuilder.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: this.formBuilder.group({
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: this.formBuilder.group({
          id: [null, Validators.required],
          nome: ['',Validators.required],
          uf: ['',Validators.required],
        }),
        estado: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          sigla: [''],
        }),
      }),
      cargo:['',Validators.required],
      salario:['',Validators.required],
      cpf: [''],
      rg: [''],
      cnpj: [''],
      tipoPessoa: ['PESSOA_FISICA', Validators.required],
      dataCriacao: [this.getDate(), Validators.required],
      dataAtualizacao: [''],
    });

    this.editFuncionarioForm = this.formBuilder.group({
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
          nome: ['',Validators.required],
          uf: [''],
        }),
        estado: this.formBuilder.group({
          id: [null, Validators.required],
          nome: [''],
          sigla: [''],
        }),
      }),
      cargo:['',Validators.required],
      salario:['',Validators.required],
      cpf: [''],
      rg: [''],
      cnpj: [''],
      tipoPessoa: ['PESSOA_FISICA', Validators.required],
      dataCriacao: [this.getDate()],
      dataAtualizacao: [''],
    });
  }

  ngOnInit(): void {
    this.updateValidators(this.addFuncionarioForm);
    this.updateValidators(this.addFuncionarioForm);
    this.funcionarioAction = this.ref.data;
    if (
      this.funcionarioAction?.event.action === this.editFuncionarioAtion &&
      this.funcionarioAction?.funcionariosList
    ) {
      const funcId = this.funcionarioAction?.event?.id as number;
      this.getFuncionarioSelectedDatas(funcId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
    }
    this.getEstados();
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addFuncionarioForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editFuncionarioForm.get('endereco') as FormGroup;

    const cidadeId = cidadeSelecionada.id;

    addEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    addEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
    editEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    editEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
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

  searchCidades(event: any): void {
    const query = event.query?.toLowerCase() || '';

    // Se não há estado selecionado, não filtra nada
    if (!this.estadoSelecionado) {
      this.cidadesFiltradas = [];
      return;
    }

    if (!query) {
      this.carregarCidadesPorEstado(this.estadoSelecionado.sigla);
      return;
    }

    this.cidadeService
      .findByEstadoSigla(this.estadoSelecionado.sigla)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cidades) => {
          this.cidadesFiltradas = cidades.filter(c =>
            c.nome && c.nome.toLowerCase().includes(query)
          );

          if (this.funcionarioAction?.event.action === this.editFuncionarioAtion &&
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

  filterEstados(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredEstados = this.estados.filter(e => e.nome.toLowerCase().includes(query));
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
          if (this.funcionarioAction?.event.action === this.editFuncionarioAtion &&
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

  private filtrarCidadesPorEstado(): void {
    if (!this.estadoSelecionado) {
      this.cidadesFiltradas = [];
      return;
    }

    this.cidadesFiltradas = this.cidades.filter(
      (cidade) => cidade.uf === this.estadoSelecionado?.sigla
    );

    // Se estiver editando e houver cidade selecionada, verifica se ela está na lista filtrada
    if (this.funcionarioAction?.event.action === this.editFuncionarioAtion && this.cidadeSelecionada) {
      const cidadeExiste = this.cidadesFiltradas.some(c => c.id === this.cidadeSelecionada.id);
      if (!cidadeExiste) {
        // Adiciona a cidade selecionada à lista se não estiver presente
        this.cidadesFiltradas.push(this.cidadeSelecionada);
      }
    }
  }

  // Método auxiliar para obter o formulário ativo (add/edit)
  private getFormGroupAtivo(): FormGroup {
    return this.funcionarioAction?.event.action === this.addFuncionarioAction
      ? this.addFuncionarioForm
      : this.editFuncionarioForm;
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

  handleSubmitAddClient(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addFuncionarioForm.controls).forEach((controlName) => {
      const control = this.addFuncionarioForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.checkEnderecoInvalido(this.addFuncionarioForm)

      this.markFormGroupTouched(this.addFuncionarioForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const requestAddFuncionario: Funcionario = {
      id: this.funcionarioAction.event.id as number,
      nome: this.addFuncionarioForm.value.nome as string,
      telefone: this.addFuncionarioForm.value.telefone as string,
      endereco: {
        rua: this.addFuncionarioForm.value.endereco.rua as string,
        numero: this.addFuncionarioForm.value.endereco.numero as string,
        complemento: this.addFuncionarioForm.value.endereco.complemento as string,
        bairro: this.addFuncionarioForm.value.endereco.bairro as string,
        cidade: {
          id: this.addFuncionarioForm.value.endereco.cidade.id,
          nome: this.addFuncionarioForm.value.endereco.cidade.nome,
          uf: this.addFuncionarioForm.value.endereco.cidade.uf
        },
        estado: {
          id: this.estadoSelecionado?.id,
          sigla: this.estadoSelecionado?.sigla as string,
          nome: this.estadoSelecionado?.nome as string,
        },
      },
      cargo: this.addFuncionarioForm.value.cargo,
      salario: this.addFuncionarioForm.value.salario,
      cpf: this.addFuncionarioForm.value.cpf as string,
      rg: this.addFuncionarioForm.value.rg as string,
      cnpj: this.addFuncionarioForm.value.cnpj as string,
      tipoPessoa: this.addFuncionarioForm.value.tipoPessoa as string,
      dataCriacao: this.addFuncionarioForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };
    console.log(JSON.stringify(requestAddFuncionario))
    this.funcionarioService
      .create(requestAddFuncionario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addFuncionarioForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O funcionario ${response.nome} foi criado com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.error('Erro durante a solicitação:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar funcionario ${err.error.error}.`,
            life: 4000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditClient(): void {
    const invalidControls: string[] = [];
    Object.keys(this.editFuncionarioForm.controls).forEach((controlName) => {
      const control = this.editFuncionarioForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editFuncionarioForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }

    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const endereco = this.editFuncionarioForm.value.endereco as Endereco;

    const requestEditFuncionario: Funcionario = {
      id: this.funcionarioAction.event.id as number,
      nome: this.editFuncionarioForm.value.nome as string,
      telefone: this.editFuncionarioForm.value.telefone as string,
      endereco: {
        rua: this.editFuncionarioForm.value.endereco.rua as string,
        numero: this.editFuncionarioForm.value.endereco.numero as string,
        complemento: this.editFuncionarioForm.value.endereco.complemento as string,
        bairro: this.editFuncionarioForm.value.endereco.bairro as string,
        cidade: {
          id: this.editFuncionarioForm.value.endereco.cidade.id,
          nome: this.editFuncionarioForm.value.endereco.cidade.nome,
          uf: this.editFuncionarioForm.value.endereco.cidade.uf
        },
        estado: {
          id: this.estadoSelecionado?.id,
          sigla: this.estadoSelecionado?.sigla as string,
          nome: this.estadoSelecionado?.nome as string,
        },
      },
      cargo: this.editFuncionarioForm.value.cargo,
      salario: this.editFuncionarioForm.value.salario,
      cpf: this.editFuncionarioForm.value.cpf as string,
      rg: this.editFuncionarioForm.value.rg as string,
      cnpj: this.editFuncionarioForm.value.cnpj as string,
      tipoPessoa: this.editFuncionarioForm.value.tipoPessoa as string,
      dataCriacao: this.editFuncionarioForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };

    this.funcionarioService
      .update(requestEditFuncionario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O cliente foi editado com sucesso!`,
              life: 2000,
            });
            this.editFuncionarioForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar funcionario, ${err.error.error}`,
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

  getFuncionarioSelectedDatas(func_id: number): void {
    const allEmployes = this.funcionarioAction.funcionariosList;

    if (allEmployes.length > 0) {
      const funcionarioFiltered = allEmployes.find(
        (element) => element?.id === func_id
      );

      if (funcionarioFiltered) {
        this.funcionarioSelectedDatas = funcionarioFiltered;
        this.cidadeSelecionada = funcionarioFiltered.endereco.cidade;
        this.estadoSelecionado = funcionarioFiltered.endereco.estado;

        if (this.estadoSelecionado) {
          this.filtrarCidadesPorEstado();
        }

        if (funcionarioFiltered) {
          this.funcionarioSelectedDatas = funcionarioFiltered;

          this.cidadeSelecionada = funcionarioFiltered.endereco.cidade;

          this.estadoSelecionado = funcionarioFiltered.endereco.estado;

          this.carregarCidadesPorEstado(this.estadoSelecionado.sigla);

          this.editFuncionarioForm.patchValue({
            id: funcionarioFiltered.id,
            nome: funcionarioFiltered.nome,
            telefone: funcionarioFiltered.telefone,
            cpf: funcionarioFiltered.cpf,
            rg: funcionarioFiltered.rg,
            cargo: funcionarioFiltered.cargo,
            salario: funcionarioFiltered.salario,
            cnpj: funcionarioFiltered.cnpj,
            tipoPessoa: funcionarioFiltered.tipoPessoa,
            dataCriacao: funcionarioFiltered.dataCriacao,
            dataAtualizacao: funcionarioFiltered.dataAtualizacao,
            endereco: {
              rua: funcionarioFiltered.endereco.rua,
              numero: funcionarioFiltered.endereco.numero,
              complemento: funcionarioFiltered.endereco.complemento,
              bairro: funcionarioFiltered.endereco.bairro,
              cidade: {
                id: funcionarioFiltered.endereco.cidade.id,
                nome: funcionarioFiltered.endereco.cidade.nome,
                uf: funcionarioFiltered.endereco.cidade.uf
              },
              estado: {
                id: funcionarioFiltered.endereco.estado.id,
                nome: funcionarioFiltered.endereco.estado.nome,
                sigla: funcionarioFiltered.endereco.estado.sigla
              }
            },
          });

          this.updateValidators(this.editFuncionarioForm);
        }
      }
    }
  }

  setUserDatas(): void {
    this.funcionarioService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.funcionarioDatas = response;
            this.funcionarioDatas &&
              this.funcionarioDTO.setFuncionariosDatas(this.funcionarioDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
