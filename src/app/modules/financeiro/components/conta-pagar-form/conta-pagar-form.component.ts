import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContaPagar } from 'src/models/interfaces/financeiro/ContaPagar';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor';
import {ContasAPagarService} from "../../../../services/financeiro/conta-pagar.service";

@Component({
  selector: 'app-conta-pagar-form',
  templateUrl: './conta-pagar-form.component.html',
  styleUrls: ['./conta-pagar-form.component.scss']
})
export class ContaPagarFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public contaPagarForm!: FormGroup;
  public contaPagarAction!: { event: any };
  public contasPagarList: Array<ContaPagar> = [];
  public fornecedores: Array<Fornecedor> = [];
  public isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private contasAPagarService: ContasAPagarService,
    private fornecedoresService: FornecedorService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.contaPagarAction = this.config.data;
    this.contasPagarList = this.config.data.contasPagarList;
    this.isEditMode = this.contaPagarAction.event.action === 'EDIT_CONTA_PAGAR_EVENT';

    this.buildForm();
    this.loadFornecedores();

    if (this.isEditMode) {
      this.loadContaPagar();
    }
  }

  buildForm(): void {
    this.contaPagarForm = this.formBuilder.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', [Validators.required]],
      fornecedorId: [null, [Validators.required]],
      observacoes: [''],
      status: ['PENDENTE']
    });
  }

  loadFornecedores(): void {
    this.fornecedoresService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Fornecedor[]) => {
          this.fornecedores = response;
        },
        error: (err: any) => {
          console.error("Erro ao carregar fornecedores:", err);
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: "Erro ao carregar fornecedores",
            life: 2500
          });
        }
      });
  }

  loadContaPagar(): void {
    const contaId = this.contaPagarAction.event.id;
    this.contasAPagarService.buscarContaPagarPorId(contaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contaPagarForm.patchValue({
            descricao: response.observacoes,
            valor: response.valor,
            dataVencimento: new Date(response.dataVencimento),
            fornecedorId: response.fornecedor?.id,
            observacoes: response.observacoes,
            status: response.status
          });
        },
        error: (err) => {
          console.error('Erro ao carregar conta a pagar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar conta a pagar',
            life: 2500
          });
        }
      });
  }

  onSubmit(): void {
    if (this.contaPagarForm.valid) {
      const formData = this.contaPagarForm.value;

      // Formatar data para string no formato ISO
      if (formData.dataVencimento instanceof Date) {
        formData.dataVencimento = formData.dataVencimento.toISOString().split('T')[0];
      }

      const contaPagar: ContaPagar = {
        ...formData
      };

      if (this.isEditMode) {
        this.updateContaPagar(contaPagar);
      } else {
        this.createContaPagar(contaPagar);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createContaPagar(conta: ContaPagar): void {
    this.contasAPagarService.criarContaPagar(conta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta a pagar criada com sucesso!',
            life: 2500
          });
          this.ref.close();
        },
        error: (err) => {
          console.error('Erro ao criar conta a pagar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar conta a pagar',
            life: 2500
          });
        }
      });
  }

  updateContaPagar(conta: ContaPagar): void {
    const contaId = this.contaPagarAction.event.id;
    this.contasAPagarService.atualizarContaPagar(contaId, conta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Conta a pagar atualizada com sucesso!',
            life: 2500
          });
          this.ref.close();
        },
        error: (err) => {
          console.error('Erro ao atualizar conta a pagar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar conta a pagar',
            life: 2500
          });
        }
      });
  }

  markFormGroupTouched(): void {
    Object.keys(this.contaPagarForm.controls).forEach(key => {
      this.contaPagarForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contaPagarForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contaPagarForm.get(fieldName);
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

