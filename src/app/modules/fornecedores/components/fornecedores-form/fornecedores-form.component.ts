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
  public cidadeSelecionada!: Cidade;

  public addFornecedorForm: FormGroup;
  public editFornecedorForm: FormGroup;

  updateValidators(form: FormGroup): void {
    const tipoPessoaValue = form.get('tipoPessoa')?.value;

    const cpfControl = form.get('cpf');
    const cnpjControl = form.get('cnpj');
    const rgControl = form.get('rg');

    cpfControl?.clearValidators();
    cnpjControl?.clearValidators();
    rgControl?.clearValidators();

    if (tipoPessoaValue === 'PESSOA_FISICA') {
      cpfControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ]);
      cnpjControl?.setValue('');
      rgControl?.setValue('');
    } else if (tipoPessoaValue === 'PESSOA_JURIDICA') {
      cnpjControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
      ]);
      cpfControl?.setValue('');
      rgControl?.setValue('');
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
      cpf: [''],
      rg: [''],
      cnpj: [''],
      tipoPessoa: ['PESSOA_FISICA', Validators.required],
      dataCriacao: [this.getDate()],
      dataAtualizacao: [''],
    });
  }

  ngOnInit(): void {
    this.onTipoPessoaChange(this.addFornecedorForm);
    this.onTipoPessoaChange(this.editFornecedorForm);
    this.fornecedorAction = this.ref.data;
    if (
      this.fornecedorAction?.event.action === this.editFornecedorAction &&
      this.fornecedorAction?.fornecedoresList
    ) {
      const fornecedorId = this.fornecedorAction?.event?.id as number;
      this.getFornecedorSelectedDatas(fornecedorId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
      this.updateValidators(this.editFornecedorForm);
    }
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addFornecedorForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editFornecedorForm.get('endereco') as FormGroup;

    const cidadeId = cidadeSelecionada.cidId;

    addEnderecoForm.get('cidade.cidId')?.setValue(cidadeId);
    addEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
    addEnderecoForm
      .get('cidade.estado.id')
      ?.setValue(cidadeSelecionada?.estado?.id);

    editEnderecoForm.get('cidade.cidId')?.setValue(cidadeId);
    editEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);
    editEnderecoForm
      .get('cidade.estado.id')
      ?.setValue(cidadeSelecionada?.estado?.id);

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
  handleSubmitAddFornecedor(): void {
    const invalidControls: string[] = [];
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
    this.fornecedorService
      .create(this.addFornecedorForm.value as Fornecedor)
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

    this.setCidadeNosFormularios(this.cidadeSelecionada);

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
          cidId: this.cidadeSelecionada.cidId as number,
        },
      },
      cpf: this.editFornecedorForm.value.cpf as string,
      rg: this.editFornecedorForm.value.rg as string,
      cnpj: this.editFornecedorForm.value.cnpj as string,
      tipoPessoa: this.editFornecedorForm.value.tipoPessoa as string,
      dataCriacao: this.editFornecedorForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };

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

        this.editFornecedorForm.patchValue({
          id: fornecedorFiltered.id,
          nome: fornecedorFiltered.nome,
          telefone: fornecedorFiltered.telefone,
          cpf: fornecedorFiltered.cpf,
          rg: fornecedorFiltered.rg,
          cnpj: fornecedorFiltered.cnpj,
          tipoPessoa: fornecedorFiltered.tipoPessoa,
          dataCriacao: fornecedorFiltered.dataCriacao,
          dataAtualizacao: fornecedorFiltered.dataAtualizacao,
          endereco: {
            rua: fornecedorFiltered.endereco.rua,
            numero: fornecedorFiltered.endereco.numero,
            complemento: fornecedorFiltered.endereco.complemento,
            bairro: fornecedorFiltered.endereco.bairro,
            cidade: {
              cidId: fornecedorFiltered.endereco.cidade.cidId,
            },
          },
        });
        this.editFornecedorForm.updateValueAndValidity();
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
