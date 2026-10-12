import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { OrdemServicoService } from 'src/app/services/os/ordem-de-servico.service';

@Component({
  selector: 'app-agendamento-modal',
  templateUrl: './agendamento-modal.component.html',
  styleUrls: ['./agendamento-modal.component.scss']
})
export class AgendamentoModalComponent implements OnInit {
  agendamentoForm!: FormGroup;
  ordemServico: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private ordemServicoService: OrdemServicoService
  ) {
    this.ordemServico = this.config.data?.ordemServico;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);

    this.agendamentoForm = this.fb.group({
      dataPrevistaInicio: [hoje, Validators.required],
      dataPrevistaConclusao: [proximaSemana],
      responsavel: [''],
      observacoes: ['']
    });
  }

  onSubmit(): void {
    if (this.agendamentoForm.valid) {
      this.loading = true;

      const formValue = this.agendamentoForm.value;
      const agendamento = {
        dataPrevistaInicio: this.formatDate(formValue.dataPrevistaInicio),
        dataPrevistaConclusao: formValue.dataPrevistaConclusao ? this.formatDate(formValue.dataPrevistaConclusao) : undefined,
        responsavel: formValue.responsavel || undefined,
        observacoes: formValue.observacoes || undefined
      };

      this.ordemServicoService.agendar(this.ordemServico.id, agendamento).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ordem de serviço agendada com sucesso!'
          });
          this.ref.close(response);
        },
        error: (error) => {
          console.error('Erro ao agendar ordem de serviço:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.error?.message || error.message || 'Erro ao agendar ordem de serviço'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.ref.close();
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  private markFormGroupTouched(): void {
    Object.keys(this.agendamentoForm.controls).forEach(key => {
      const control = this.agendamentoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.agendamentoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.agendamentoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
    }
    return '';
  }
}
