import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { GruposDataTransferService } from 'src/app/shared/services/grupos/grupos-data-transfer.service';
import { GrupoEvent } from 'src/models/enums/grupo/GrupoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';

@Component({
  selector: 'app-grupo-form',
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.scss']
})
export class GrupoFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public grupoAction!: {
    event: EventAction;
    gruposList: Array<Grupo>;
  };

  public gruposSelectedDatas!: Grupo;
  public gruposDatas: Array<Grupo> = [];
  public grupos: Array<Grupo> = [];
  public ativo: boolean = true;

  public editGrupoAction = GrupoEvent.EDIT_GRUPO_EVENT;
  public addGrupoAction = GrupoEvent.CREATE_GRUPO_EVENT;

  public addGrupoform = this.formBuilder.group({
    nome: ['', Validators.required],
    grupoPaiId: [0, Validators.required],
    ativo: [this.ativo,Validators.required],
  });

  public editGrupoForm = this.formBuilder.group({
    nome: ['', Validators.required],
    grupoPaiId: [0, Validators.required],
    ativo: [this.ativo],
  });

  constructor(
    private ref: DynamicDialogConfig,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private grupoService: GruposService,
    private grupoDTO: GruposDataTransferService
  ) {}

  ngOnInit(): void {
    this.grupoAction = this.ref.data;
    this.grupos = this.grupoAction.gruposList;
    if (this.grupoAction?.event.action === this.editGrupoAction && this.grupoAction?.gruposList) {

      const grupoId = this.grupoAction?.event?.id as number;
      this.getGrupoSelectedDatas(grupoId);
      this.setGrupoPaiNosFormularios(this.gruposSelectedDatas.grupoPaiId);
    }
  }


  onGrupoChange(grupoId: number): void {
    this.grupoService.findById(grupoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.gruposSelectedDatas = response;
            this.setGrupoPaiNosFormularios(this.gruposSelectedDatas.id)
          }
        },
        error(err) {
          console.log(err);
        },
      });
  }

  setGrupoPaiNosFormularios(gruPai: number) {
    this.addGrupoform.get('grupoPaiId')?.setValue(gruPai);
    this.editGrupoForm.get('grupoPaiId')?.setValue(gruPai);
  }

  handleSubmitAddGrupo(): void {
    const invalidControls: string[] = [];
    Object.keys(this.addGrupoform.controls).forEach((controlName) => {
      const control = this.addGrupoform.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.addGrupoform);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }
    this.grupoService.create(this.addGrupoform.value as Grupo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Grupo ${response.nome} foi criado com sucesso!`,
              life: 3000,
            });
            this.addGrupoform.reset();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar Grupo',
            life: 3000,
          });
          console.log(err);
        },
      });
  }

  handleSubmitEditGrupo() {
    const invalidControls: string[] = [];
    Object.keys(this.editGrupoForm.controls).forEach((controlName) => {
      const control = this.editGrupoForm.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });

    if (invalidControls.length > 0) {
      const invalidFieldsMessage = `Os campos ${invalidControls.join(
        ', '
      )} estão inválidos.`;

      this.markFormGroupTouched(this.editGrupoForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: invalidFieldsMessage,
        life: 3000,
      });
      return;
    }

    const requestEditGrupo: Grupo = {
      id: this.grupoAction.event.id as number,
      nome: this.editGrupoForm.value.nome as string,
      ativo: this.editGrupoForm.value.ativo as boolean,
      grupoPaiId: this.editGrupoForm.value.grupoPaiId ?? 0,
    };

    this.grupoService.update(requestEditGrupo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.editGrupoForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Grupo foi editado com sucesso!`,
              life: 3000,
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.editGrupoForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao editar Grupo: ${err.error.error}`,
            life: 3000,
          });
        },
      });
  }

  getGrupoSelectedDatas(grupo_id: number): void {
    const allGroups = this.grupoAction.gruposList;
    if (allGroups.length > 0) {
      const grupoFiltered = allGroups.find((element) => element?.id === grupo_id);

      if(grupoFiltered) {
        this.gruposSelectedDatas = grupoFiltered;

        this.editGrupoForm.patchValue({
          nome: grupoFiltered.nome,
          grupoPaiId: grupoFiltered.grupoPaiId,
          ativo: grupoFiltered.ativo,
        });

      }
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
