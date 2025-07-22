import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContaReceber } from 'src/models/interfaces/financeiro/ContaReceber';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import {ContasAReceberService} from "../../../../services/financeiro/conta-receber.service";

@Component({
  selector: 'app-conta-receber-form',
  templateUrl: './conta-receber-form.component.html',
  styleUrls: ['./conta-receber-form.component.scss']
})
export class ContaReceberFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public contaReceberForm!: FormGroup;
  public contaReceberAction!: { event: any };
  public contasReceberList: Array<ContaReceber> = [];
  public clientes: Array<Cliente> = [];
  public isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private contasAReceberService: ContasAReceberService,
    private clientesService: ClientesService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.contaReceberAction = this.config.data;
    this.contasReceberList = this.config.data.contasReceberList;
    this.isEditMode = this.contaReceberAction.event.action === 'EDIT_CONTA_RECEBER_EVENT';

    this.buildForm();
    this.loadClientes();

    if (this.isEditMode) {
      this.loadContaReceber();
    }
  }

  buildForm(): void {
    this.contaReceberForm = this.formBuilder.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', [Validators.required]],
      clienteId: [null, [Validators.required]],
      observacoes: [''],
      status: ['PENDENTE']
    });
  }

  loadClientes(): void {
    this.clientesService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Cliente[]) => {
          this.clientes = response;
        },
        error: (err: any) => {
          console.error("Erro ao carregar clientes:", err);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao carregar clientes",
            life: 2500
          });
        }
      });
  }

  loadContaReceber(): void {
    const contaId = this.contaReceberAction.event.id;
    this.contasAReceberService.buscarContaReceberPorId(contaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contaReceberForm.patchValue({
            descricao: response.observacoes,
            valor: response.valor,
            dataVencimento: new Date(response.dataVencimento),
            clienteId: response.cliente?.id,
            observacoes: response.observacoes,
            status: response.status
          });
        },
        error: (err) => {
          console.error('Erro ao carregar conta a receber:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar conta a receber',
            life: 2500
          });
        }
      });
  }

  onSubmit(): void {
    if (this.contaReceberForm.valid) {
      const formData = this.contaReceberForm.value;

      // Formatar data para string no formato ISO
      if (formData.dataVencimento instanceof Date) {
        formData.dataVencimento = formData.dataVencimento.toISOString().split('T')[0];
      }

      const contaReceber: ContaReceber = {
        ...formData
      };

      if (this.isEditMode) {
        this.updateContaReceber(contaReceber);
      } else {
        this.createContaReceber(contaReceber);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createContaReceber(conta: ContaReceber): void {
    this.contasAReceberService.criarContaReceber(conta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta a receber criada com sucesso!',
            life: 2500
          });
          this.ref.close();
        },
        error: (err) => {
          console.error('Erro ao criar conta a receber:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar conta a receber',
            life: 2500
          });
        }
      });
  }

  updateContaReceber(conta: ContaReceber): void {
    const contaId = this.contaReceberAction.event.id;
    this.contasAReceberService.atualizarContaReceber(contaId, conta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta a receber atualizada com sucesso!',
            life: 2500
          });
          this.ref.close();
        },
        error: (err) => {
          console.error('Erro ao atualizar conta a receber:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar conta a receber',
            life: 2500
          });
        }
      });
  }

  markFormGroupTouched(): void {
    Object.keys(this.contaReceberForm.controls).forEach(key => {
      this.contaReceberForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contaReceberForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contaReceberForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['minlength']) return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${fieldName} deve ser maior que ${field.errors['min'].min}`;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

