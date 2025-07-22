import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { EstadoService } from 'src/app/services/estado/estado.service';
import { CidadeDataTransferService } from 'src/app/shared/services/cidade/cidade-data-transfer.service';
import { CidadeEvent } from 'src/models/enums/cidade/CidadeEvent';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-cidade-form',
  templateUrl: './cidade-form.component.html',
  styleUrls: ['./cidade-form.component.scss'],
})
export class CidadeFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public cidadeAction!: {
    event: EventAction;
    cidadeList: Array<Cidade>;
  };

  public cidadesSelectedDatas!: Cidade;
  public cidadeDatas: Array<Cidade> = [];
  public estados: Array<Estado> = [];
  public estadoSelecionado!: Estado;

  public addCidadeForm = this.formBuilder.group({
    nome: ['', Validators.required],
    estado: this.formBuilder.group({
      id: [null, Validators.required],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cidades: [[]],
      dataCriacao: [this.getDate()],
      dataAtualizacao: [''],
    }),
    dataCriacao: [this.getDate()],
    dataAtualizacao: [''],
  });

  public editCidadeForm = this.formBuilder.group({
    nome: ['', Validators.required],
    estado: this.formBuilder.group({
      id: [null, Validators.required],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      cidades: [[]],
      dataCriacao: [this.getDate()],
      dataAtualizacao: [''],
    }),
    dataCriacao: [this.getDate()],
    dataAtualizacao: [''],
  });

  public addCidadeAction = CidadeEvent.CREATE_CITY_EVENT;
  public editCidadeAction = CidadeEvent.EDIT_CITY_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    private ref: DynamicDialogConfig,
    private cidadeDTO: CidadeDataTransferService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.cidadeAction = this.ref.data;
    if (
      this.cidadeAction?.event.action === this.editCidadeAction &&
      this.cidadeAction?.cidadeList
    ) {
      const cityId = this.cidadeAction.event.id as number;
      this.getCidadeSelectedDatas(cityId as number);
      this.setEstadoNosFormularios(this.estadoSelecionado);
    }
    this, this.getEstados();
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
  }
  setEstadoNosFormularios(estado: Estado) {
    const editForm = this.editCidadeForm;
    const addForm = this.addCidadeForm;

    editForm.get('estado.id')?.setValue(estado?.id);
    editForm.get('estado.nome')?.setValue(estado?.nome)
    editForm.get('estado.sigla')?.setValue(estado?.sigla)
    addForm.get('estado.id')?.setValue(estado?.id);
    addForm.get('estado.nome')?.setValue(estado?.nome)
    addForm.get('estado.sigla')?.setValue(estado?.sigla)
  }

  getEstados(): void {
    this.estadoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.estados = response;
            if (this.estados.length > 0) {
              this.estadoSelecionado = this.estados[0];
              this.setEstadoNosFormularios(this.estadoSelecionado);
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onEstadoChange(estado: Estado): void {
    this.estadoService
      .findById(estado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.estadoSelecionado = response;
          }
        },
        error(err) {
          console.log(err);
        },
      });
  }

  handleSubmitAddCidade(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addCidadeForm.controls).forEach((controlName) => {
      const control = this.addCidadeForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addCidadeForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    this.cidadeService
      .create(this.addCidadeForm.value as Cidade)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `A cidade ${response.nome} foi criada com sucesso!`,
              life: 2000,
            });
            this.addCidadeForm.reset();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar Conta.`,
            life: 2000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditCidade() {
    const invalidControls: string[] = [];
    Object.keys(this.editCidadeForm.controls).forEach((controlName) => {
      const control = this.editCidadeForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editCidadeForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const requestEditCidade: Cidade = {
      id: this.cidadeAction.event.id as number,
      nome: this.editCidadeForm.value.nome as string
    };

    this.cidadeService
      .update(requestEditCidade)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.editCidadeForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `A cidade foi editada com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.editCidadeForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar cidade`,
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

  getCidadeSelectedDatas(cid_id: number): void {
    if (this.cidadeAction && this.cidadeAction.cidadeList) {
      const allCitys = this.cidadeAction.cidadeList;
      if (allCitys.length > 0) {
        const cityFiltered = allCitys.find(
          (element) => element?.id === cid_id
        );
      }
    }
  }

  getUserDatas(): void {
    this.cidadeService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.cidadeDatas = response;
            this.cidadeDatas &&
              this.cidadeDTO.setCidadesDatas(this.cidadeDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
