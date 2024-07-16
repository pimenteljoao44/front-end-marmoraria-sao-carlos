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

  public addFuncionarioForm: FormGroup;
  public editFuncionarioForm: FormGroup;

  updateValidators(form: FormGroup): void {
    const tipoPessoaValue = form.get('tipoPessoa')?.value;

    const cpfControl = form.get('cpf');
    const cnpjControl = form.get('cnpj');
    cpfControl?.clearValidators();
    cnpjControl?.clearValidators();

    if (tipoPessoaValue === 'PESSOA_FISICA') {
      cpfControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ]);
      cnpjControl?.setValue('');
    } else if (tipoPessoaValue === 'PESSOA_JURIDICA') {
      cnpjControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
      ]);
      cpfControl?.setValue('');
    }

    cpfControl?.updateValueAndValidity();
    cnpjControl?.updateValueAndValidity();
  }

  formatarRG(event: any,form: FormGroup): void {
    const rg = event.target.value.replace(/\D/g, '');
    let formattedRG = '';

    if (rg.length <= 9) {
      formattedRG = rg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else {
      formattedRG = rg.substring(0, 9);
    }

    form.get('rg')?.setValue(formattedRG);
  }

  formatarCPF(event: any, form: FormGroup): void {
    const cpf = event.target.value.replace(/\D/g, '');
    let formattedCPF = '';

    if (cpf.length <= 11) {
      formattedCPF = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      formattedCPF = cpf.substring(0, 14);
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
      formattedCNPJ = cnpj.substring(0, 18);
    }

    form.get('cnpj')?.setValue(formattedCNPJ);
  }

  onTipoPessoaChange(form: FormGroup): void {
    this.updateValidators(form);
  }

  onCidadeChange(cidade: Cidade): void {
    this.cidadeService
      .findById(cidade)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.cidadeSelecionada = response;
          }
        },
        error(err) {
          console.log(err);
        },
      });

    this.estadoService.findById(this.cidadeSelecionada?.estado?.id).subscribe({
      next: (estado) => {
        this.cidadeSelecionada.estado = estado;
      },
      error: (err) => {
        console.error('Erro ao buscar o estado associado:', err);
      },
    });
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
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: this.formBuilder.group({
          cidId: [null, Validators.required],
          nome: ['', Validators.required],
          estado: this.formBuilder.group({
            id: [null],
            nome: [''],
            sigla: [''],
            cidades: [[]],
            dataCriacao: [this.getDate()],
            dataAtualizacao: [''],
          }),
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
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: this.formBuilder.group({
          cidId: [null, Validators.required],
          nome: ['', Validators.required],
          estado: this.formBuilder.group({
            id: [null],
            nome: [''],
            sigla: [''],
            cidades: [[]],
            dataCriacao: [this.getDate()],
            dataAtualizacao: [''],
          }),
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
    this.onTipoPessoaChange(this.addFuncionarioForm);
    this.onTipoPessoaChange(this.editFuncionarioForm);
    this.funcionarioAction = this.ref.data;
    if (
      this.funcionarioAction?.event.action === this.editFuncionarioAtion &&
      this.funcionarioAction?.funcionariosList
    ) {
      const funcId = this.funcionarioAction?.event?.id as number;
      this.getFuncionarioSelectedDatas(funcId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
      this.updateValidators(this.editFuncionarioForm);
    }
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addFuncionarioForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editFuncionarioForm.get('endereco') as FormGroup;

    const cidadeId = cidadeSelecionada.cidId;

    addEnderecoForm.get('cidade.cidId')?.setValue(cidadeId);
    addEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
    addEnderecoForm.get('cidade.estado.id')?.setValue(cidadeSelecionada?.estado?.id);

    editEnderecoForm.get('cidade.cidId')?.setValue(cidadeId);
    editEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
    editEnderecoForm.get('cidade.estado.id')?.setValue(cidadeSelecionada?.estado?.id);

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

      this.markFormGroupTouched(this.addFuncionarioForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    this.funcionarioService
      .create(this.addFuncionarioForm.value as Funcionario)
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

    this.setCidadeNosFormularios(this.cidadeSelecionada);

    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const endereco = this.editFuncionarioForm.value.endereco as Endereco;

    const requestEditFuncionario: Funcionario = {
      id: this.funcionarioAction.event.id as number,
      nome: this.editFuncionarioForm.value.nome as string,
      telefone: this.editFuncionarioForm.value.telefone as string,
      endereco: {
        rua: endereco.rua as string,
        numero: endereco.numero as string,
        complemento: endereco.complemento as string,
        bairro: endereco.bairro as string,
        cidade: {
          cidId: this.cidadeSelecionada.cidId as number,
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
      const clienteFiltered = allEmployes.find(
        (element) => element?.id === func_id
      );

      if (clienteFiltered) {
        this.funcionarioSelectedDatas = clienteFiltered;

        this.cidadeSelecionada = clienteFiltered.endereco.cidade;

        this.editFuncionarioForm.patchValue({
          id: clienteFiltered.id,
          nome: clienteFiltered.nome,
          telefone: clienteFiltered.telefone,
          cpf: clienteFiltered.cpf,
          rg: clienteFiltered.rg,
          cargo: clienteFiltered.cargo,
          salario: clienteFiltered.salario,
          cnpj: clienteFiltered.cnpj,
          tipoPessoa: clienteFiltered.tipoPessoa,
          dataCriacao: clienteFiltered.dataCriacao,
          dataAtualizacao: clienteFiltered.dataAtualizacao,
          endereco: {
            rua: clienteFiltered.endereco.rua,
            numero: clienteFiltered.endereco.numero,
            complemento: clienteFiltered.endereco.complemento,
            bairro: clienteFiltered.endereco.bairro,
            cidade: {
              cidId: clienteFiltered.endereco.cidade.cidId,
            },
          },
        });
        this.editFuncionarioForm.updateValueAndValidity();
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
