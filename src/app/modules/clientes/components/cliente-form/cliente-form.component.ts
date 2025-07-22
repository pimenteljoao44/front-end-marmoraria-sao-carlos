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
import { Estado } from 'src/models/interfaces/estado/Estado';

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
  public estados: Estado[] = [];
  public estadoSelecionado: Estado | null = null;
  public cidadesFiltradas: Cidade[] = [];
  public filteredEstados: Estado[] = [];

  public addClientForm: FormGroup;
  public editClientForm: FormGroup;

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
          id: [null, Validators.required],
          nome: ['',Validators.required],
          uf: [''],
        }),
        estado: this.formBuilder.group({
          id: [null, Validators.required],
          nome: ['',Validators.required],
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
    this.updateValidators(this.addClientForm);
    this.updateValidators(this.addClientForm);
    this.clientAction = this.ref.data;
    if (
      this.clientAction?.event.action === this.editClientAction &&
      this.clientAction?.clientesList
    ) {
      const clientId = this.clientAction?.event?.id as number;
      this.getClientSelectedDatas(clientId as number);
      this.setCidadeNosFormularios(this.cidadeSelecionada);
    }
    this.getEstados();
    this.getCidades();
  }

  setCidadeNosFormularios(cidadeSelecionada: Cidade): void {
    const addEnderecoForm = this.addClientForm.get('endereco') as FormGroup;
    const editEnderecoForm = this.editClientForm.get('endereco') as FormGroup;

    const cidadeId = cidadeSelecionada.id;

    addEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    addEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);

    editEnderecoForm.get('cidade.id')?.setValue(cidadeId);
    editEnderecoForm.get('cidade.nome')?.setValue(cidadeSelecionada?.nome);

    const currentDate = this.getDate();
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
          this.cidades = response;
          if (
            this.clientAction?.event.action === this.editClientAction &&
            this.clienteSelectedDatas
          ) {
            this.filtrarCidadesPorEstado();
          }
        },
        error: (err) => {
          console.error('Erro ao carregar cidades:', err);
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

          if (this.clientAction?.event.action === this.editClientAction &&
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
          if (this.clientAction?.event.action === this.editClientAction &&
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

  private filtrarCidadesPorEstado(): void {
    if (!this.estadoSelecionado) {
      this.cidadesFiltradas = [];
      return;
    }

    this.cidadesFiltradas = this.cidades.filter(
      (cidade) => cidade.uf === this.estadoSelecionado?.sigla
    );

    // Se estiver editando e houver cidade selecionada, verifica se ela está na lista filtrada
    if (this.clientAction?.event.action === this.editClientAction && this.cidadeSelecionada) {
      const cidadeExiste = this.cidadesFiltradas.some(c => c.id === this.cidadeSelecionada.id);
      if (!cidadeExiste) {
        // Adiciona a cidade selecionada à lista se não estiver presente
        this.cidadesFiltradas.push(this.cidadeSelecionada);
      }
    }
  }

  private getFormGroupAtivo(): FormGroup {
    return this.clientAction?.event.action === this.addClientAction
      ? this.addClientForm
      : this.editClientForm;
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

      this.checkEnderecoInvalido(this.addClientForm);

      this.markFormGroupTouched(this.addClientForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }

    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    const endereco = this.addClientForm.value.endereco as Endereco;

    const requestAddClient: Cliente = {
      id: this.clientAction.event.id as number,
      nome: this.addClientForm.value.nome as string,
      telefone: this.addClientForm.value.telefone as string,
      endereco: {
        rua: this.addClientForm.value.endereco.rua as string,
        numero: this.addClientForm.value.endereco.numero as string,
        complemento: this.addClientForm.value.endereco.complemento as string,
        bairro: this.addClientForm.value.endereco.bairro as string,
        cidade: {
          id: this.addClientForm.value.endereco.cidade.id.id,
          nome: this.addClientForm.value.endereco.cidade.id.nome,
          uf: this.addClientForm.value.endereco.cidade.id.uf,
        },
        estado: {
          id: this.estadoSelecionado?.id,
          sigla: this.estadoSelecionado?.sigla as string,
          nome: this.estadoSelecionado?.nome as string,
        },
      },
      cpf: this.addClientForm.value.cpf as string,
      rg: this.addClientForm.value.rg as string,
      cnpj: this.addClientForm.value.cnpj as string,
      tipoPessoa: this.addClientForm.value.tipoPessoa as string,
      dataCriacao: this.addClientForm.value.dataCriacao as string,
      dataAtualizacao: atualizacao !== null ? atualizacao : undefined,
    };

    console.log('CLIENTE:',JSON.stringify(requestAddClient))

    this.clientService
      .create(requestAddClient)
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
          if (err.error.error === 'Cliente já cadastrado na base de dados!') {
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

    const atualizacao = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

    const requestEditClient: Cliente = {
      id: this.clientAction.event.id as number,
      nome: this.editClientForm.value.nome as string,
      telefone: this.editClientForm.value.telefone as string,
      endereco: {
        rua: this.editClientForm.value.endereco.rua as string,
        numero: this.editClientForm.value.endereco.numero as string,
        complemento: this.editClientForm.value.endereco.complemento as string,
        bairro: this.editClientForm.value.endereco.bairro as string,
        cidade: {
          id: this.editClientForm.value.endereco.cidade.id,
          nome: this.editClientForm.value.endereco.cidade.nome,
          uf: this.editClientForm.value.endereco.cidade.uf
        },
        estado: {
          id: this.editClientForm.value.endereco.estado.id.id,
          sigla: this.editClientForm.value.endereco.estado.sigla as string,
          nome: this.editClientForm.value.endereco.estado.nome as string,
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
    console.log(JSON.stringify(allClients))

    if (allClients.length > 0) {
      const clienteFiltered = allClients.find(
        (element) => element?.id === client_id
      );

      if (clienteFiltered) {
        this.clienteSelectedDatas = clienteFiltered;
        this.cidadeSelecionada = clienteFiltered.endereco.cidade;
        this.estadoSelecionado = clienteFiltered.endereco.estado;

        this.carregarCidadesPorEstado(this.estadoSelecionado.sigla);

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
              id: clienteFiltered.endereco.cidade.id,
              nome: clienteFiltered.endereco.cidade.nome,
              uf: clienteFiltered.endereco.cidade.uf
            },
            estado: {
              id: clienteFiltered.endereco.estado.id,
              nome: clienteFiltered.endereco.estado.nome,
              sigla: clienteFiltered.endereco.estado.sigla
            }
          }
        });
        this.updateValidators(this.editClientForm);

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
