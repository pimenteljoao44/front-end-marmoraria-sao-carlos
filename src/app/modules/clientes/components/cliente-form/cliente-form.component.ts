import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ClientesDataTransferService } from 'src/app/shared/services/clientes/clientes-data-transfer.service';
import { ClienteEvent } from 'src/models/enums/cliente/ClienteEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { Endereco } from 'src/models/interfaces/endereco/Endereco';
import { DatePipe, JsonPipe } from '@angular/common';
import { EstadoService } from 'src/app/services/estado/estado.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public clientAction!: {
    event: EventAction;
    clientesList: Array<Cliente>;
  };

  tipoPessoa = [
    { label: 'Pessoa Física', value: 'PESSOA_FISICA' },
    { label: 'Pessoa Jurídica', value: 'PESSOA_JURIDICA' },
  ];

  public TipoPessoaSelected: Array<{ label: string; value: string }> = [];
  public clienteSelectedDatas!: Cliente;
  public clienteDatas: Array<Cliente> = [];
  public cidades: Array<Cidade> = [];
  public cidadeSelecionada!: Cidade;

  public addClientForm: FormGroup;
  public editClientForm: FormGroup;

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

  public addClientAction = ClienteEvent.CREATE_CLIENT_EVENT;
  public editClientAction = ClienteEvent.EDIT_CLIENT_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private estadoService: EstadoService,
    private cidadeService: CidadeService,
    private clientService: ClientesService,
    private ref: DynamicDialogConfig,
    private datePipe: DatePipe,
    private clienteDTO: ClientesDataTransferService
  ) {
    this.addClientForm = this.formBuilder.group({
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

    this.editClientForm = this.formBuilder.group({
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
    this.onTipoPessoaChange(this.addClientForm);
    this.onTipoPessoaChange(this.editClientForm);
    this.clientAction = this.ref.data;
    if (
      this.clientAction?.event.action === this.editClientAction &&
      this.clientAction?.clientesList
    ) {
      const clientId = this.clientAction?.event?.id as number;
      this.getClientSelectedDatas(clientId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
      this.updateValidators(this.editClientForm);
    }
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addClientForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editClientForm.get('endereco') as FormGroup;

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
    Object.keys(this.addClientForm.controls).forEach((controlName) => {
      const control = this.addClientForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addClientForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    this.clientService
      .create(this.addClientForm.value as Cliente)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.addClientForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O cliente ${response.nome} foi criado com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.error('Erro durante a solicitação:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar Cliente.`,
            life: 2000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditClient(): void {
    const invalidControls: string[] = [];
    Object.keys(this.editClientForm.controls).forEach((controlName) => {
      const control = this.editClientForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editClientForm);
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
    const endereco = this.editClientForm.value.endereco as Endereco;

    const requestEditClient: Cliente = {
      id: this.clientAction.event.id as number,
      nome: this.editClientForm.value.nome as string,
      telefone: this.editClientForm.value.telefone as string,
      endereco: {
        rua: endereco.rua as string,
        numero: endereco.numero as string,
        complemento: endereco.complemento as string,
        bairro: endereco.bairro as string,
        cidade: {
          cidId: this.cidadeSelecionada.cidId as number,
        },
      },
      cpf: this.editClientForm.value.cpf as string,
      rg: this.editClientForm.value.rg as string,
      cnpj: this.editClientForm.value.cnpj as string,
      tipoPessoa: this.editClientForm.value.tipoPessoa as string,
      dataCriacao: this.editClientForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };

    this.clientService
      .update(requestEditClient)
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
            this.editClientForm.reset();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar cliente, ${err.error.error}`,
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

  getClientSelectedDatas(client_id: number): void {
    const allClients = this.clientAction.clientesList;

    if (allClients.length > 0) {
      const clienteFiltered = allClients.find(
        (element) => element?.id === client_id
      );

      if (clienteFiltered) {
        this.clienteSelectedDatas = clienteFiltered;

        this.cidadeSelecionada = clienteFiltered.endereco.cidade;

        this.editClientForm.patchValue({
          id: clienteFiltered.id,
          nome: clienteFiltered.nome,
          telefone: clienteFiltered.telefone,
          cpf: clienteFiltered.cpf,
          rg: clienteFiltered.rg,
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
        this.editClientForm.updateValueAndValidity();
      }
    }
  }

  setUserDatas(): void {
    this.clientService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.clienteDatas = response;
            this.clienteDatas &&
              this.clienteDTO.setClientesDatas(this.clienteDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
