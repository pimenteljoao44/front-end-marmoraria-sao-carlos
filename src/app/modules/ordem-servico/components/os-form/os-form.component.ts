import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { OrdemServicoService, OrdemServico, StatusOrdemServico } from 'src/app/services/os/ordem-de-servico.service';

@Component({
  selector: 'app-os-form',
  templateUrl: './os-form.component.html',
  styleUrls: ['./os-form.component.scss']
})
export class OsFormComponent implements OnInit {
  osForm!: FormGroup;
  isEditMode = false;
  ordemServico?: OrdemServico;
  loading = false;

  statusOptions = [
    { label: 'Pendente', value: StatusOrdemServico.PENDENTE },
    { label: 'Aprovada', value: StatusOrdemServico.APROVADA },
    { label: 'Agendada', value: StatusOrdemServico.AGENDADA },
    { label: 'Em Andamento', value: StatusOrdemServico.EM_ANDAMENTO },
    { label: 'Pausada', value: StatusOrdemServico.PAUSADA },
    { label: 'Concluída', value: StatusOrdemServico.CONCLUIDA },
    { label: 'Cancelada', value: StatusOrdemServico.CANCELADA }
  ];

  constructor(
    private fb: FormBuilder,
    private ordemServicoService: OrdemServicoService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.config.data?.ordemServico) {
      this.isEditMode = true;
      this.ordemServico = this.config.data.ordemServico;
      this.populateForm();
    }
  }

  initForm(): void {
    this.osForm = this.fb.group({
      numero: ['', [Validators.required]],
      projetoId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      dataEmissao: [new Date(), [Validators.required]],
      dataPrevistaInicio: [''],
      dataPrevistaConclusao: [''],
      status: [StatusOrdemServico.PENDENTE, [Validators.required]],
      responsavel: [''],
      observacoes: [''],
      instrucoesTecnicas: [''],
      valorTotal: [0, [Validators.required, Validators.min(0.01)]],
      usuarioCriacao: [1] // TODO: Pegar do usuário logado
    });
  }

  populateForm(): void {
    if (this.ordemServico) {
      this.osForm.patchValue({
        numero: this.ordemServico.numero,
        projetoId: this.ordemServico.projetoId,
        clienteId: this.ordemServico.clienteId,
        dataEmissao: new Date(this.ordemServico.dataEmissao),
        dataPrevistaInicio: this.ordemServico.dataPrevistaInicio ? new Date(this.ordemServico.dataPrevistaInicio) : null,
        dataPrevistaConclusao: this.ordemServico.dataPrevistaConclusao ? new Date(this.ordemServico.dataPrevistaConclusao) : null,
        status: this.ordemServico.status,
        responsavel: this.ordemServico.responsavel,
        observacoes: this.ordemServico.observacoes,
        instrucoesTecnicas: this.ordemServico.instrucoesTecnicas,
        valorTotal: this.ordemServico.valorTotal,
        usuarioCriacao: this.ordemServico.usuarioCriacao
      });
    }
  }

  onSubmit(): void {
    if (this.osForm.valid) {
      this.loading = true;
      const formData = this.osForm.value;

      // Converter datas para string ISO
      if (formData.dataEmissao) {
        formData.dataEmissao = formData.dataEmissao.toISOString().split('T')[0];
      }
      if (formData.dataPrevistaInicio) {
        formData.dataPrevistaInicio = formData.dataPrevistaInicio.toISOString().split('T')[0];
      }
      if (formData.dataPrevistaConclusao) {
        formData.dataPrevistaConclusao = formData.dataPrevistaConclusao.toISOString().split('T')[0];
      }

      if (this.isEditMode && this.ordemServico?.id) {
        this.ordemServicoService.atualizar(this.ordemServico.id, formData).subscribe({
          next: (response) => {
            this.loading = false;
            this.ref.close(response);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao atualizar ordem de serviço:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar ordem de serviço'
            });
          }
        });
      } else {
        // Para criação, seria necessário implementar o método no service
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Funcionalidade de criação ainda não implementada'
        });
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.ref.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.osForm.controls).forEach(key => {
      const control = this.osForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.osForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.osForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['min']) {
        return 'Valor deve ser maior que zero';
      }
    }
    return '';
  }
}

