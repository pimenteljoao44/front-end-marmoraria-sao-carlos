import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EstadoService } from 'src/app/services/estado/estado.service';
import { EstadoDataTransferService } from 'src/app/shared/services/estado/estado-data-transfer.service';
import { EstadoEvent } from 'src/models/enums/estado/EstadoEvent';
import { Estado } from 'src/models/interfaces/estado/Estado';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-estado-form',
  templateUrl: './estado-form.component.html',
  styleUrls: ['./estado-form.component.scss'],
})
export class EstadoFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public estadoAction!: {
    event: EventAction;
    estadoList: Array<Estado>;
  };

  public estadoSelectedDatas!: Estado;
  public estadoDatas: Array<Estado> = [];
  public estados: Array<Estado> = [];
  public estadoSelecionado!: Estado;

  public addEstadoForm = this.formBuilder.group({
    nome: ['', Validators.required],
    sigla: ['', Validators.required],
    dataCriacao: [this.getDate()],
    dataAtualizacao: [''],
  });

  public editEstadoForm = this.formBuilder.group({
    nome: ['', Validators.required],
    sigla: ['', Validators.required],
    dataCriacao: [this.getDate()],
    dataAtualizacao: [''],
  });

  public addEstadoAction = EstadoEvent.CREATE_ESTADO_EVENT;
  public editEstadoAction = EstadoEvent.EDIT_ESTADO_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private estadoService: EstadoService,
    private ref: DynamicDialogConfig,
    private estadoDTO: EstadoDataTransferService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.estadoAction = this.ref.data;
    if (
      this.estadoAction?.event.action === this.editEstadoAction &&
      this.estadoAction?.estadoList
    ) {
      const estId = this.estadoAction.event.id as number;
      this.getEstadoSelectedDatas(estId as number);
    }
  }

  getDate(): string {
    return this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
  }

  handleSubmitAddEstado(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addEstadoForm.controls).forEach((controlName) => {
      const control = this.addEstadoForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addEstadoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    this.estadoService
      .create(this.addEstadoForm.value as Estado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O estado ${response.nome} foi criado com sucesso!`,
              life: 2000,
            });
            this.addEstadoForm.reset();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar estado.`,
            life: 2000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditEstado() {
    const invalidControls: string[] = [];
    Object.keys(this.editEstadoForm.controls).forEach((controlName) => {
      const control = this.editEstadoForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editEstadoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    const requestEditEstado: Estado = {
      id: this.estadoAction.event.id as number,
      nome: this.editEstadoForm.value.nome as string,
      sigla: this.editEstadoForm.value.sigla as string,
    };

    this.estadoService
      .update(requestEditEstado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.editEstadoForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `O estado foi editado com sucesso!`,
              life: 2000,
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.editEstadoForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar estado`,
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

  getEstadoSelectedDatas(est_id: number): void {
    if (this.estadoAction && this.estadoAction.estadoList) {
      const allEstados = this.estadoAction.estadoList;
      if (allEstados.length > 0) {
        const estFiltered = allEstados.find(
          (element) => element?.id === est_id
        );
        if (estFiltered) {
          this.estadoSelectedDatas = estFiltered;

          this.editEstadoForm.patchValue({
            nome: estFiltered.nome,
            sigla: estFiltered.sigla,
          });
        }
      }
    }
  }

  getEstadoDatas(): void {
    this.estadoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.estadoDatas = response;
            this.estadoDatas &&
              this.estadoDTO.setEstadosDatas(this.estadoDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
