import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ContaReceber } from 'src/models/interfaces/financeiro/ContaReceber';
import { ContaReceberFormComponent } from '../components/conta-receber-form/conta-receber-form.component';
import {ContasAReceberService} from "../../../services/financeiro/conta-receber.service";

@Component({
  selector: 'app-contas-a-receber',
  templateUrl: './contas-a-receber.component.html',
  styleUrls: ['./contas-a-receber.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ContasAReceberComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  sidebarVisible = false;
  public contasReceber: Array<ContaReceber> = [];
  public loading: boolean = false;

  constructor(
    private contasAReceberService: ContasAReceberService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getContasReceber();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  getContasReceber(): void {
    this.loading = true;
    this.contasAReceberService.listarContasReceber()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contasReceber = response;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar contas a receber:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar contas a receber',
            life: 2500
          });
          this.loading = false;
        }
      });
  }

  openAddContaReceberDialog(): void {
    this.dialogService.open(ContaReceberFormComponent, {
      header: 'Nova Conta a Receber',
      width: '70%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        event: { action: 'CREATE_CONTA_RECEBER_EVENT' },
        contasReceberList: this.contasReceber
      }
    }).onClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getContasReceber();
    });
  }

  openEditContaReceberDialog(conta: ContaReceber): void {
    this.dialogService.open(ContaReceberFormComponent, {
      header: 'Editar Conta a Receber',
      width: '70%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        event: { action: 'EDIT_CONTA_RECEBER_EVENT', id: conta.id },
        contasReceberList: this.contasReceber
      }
    }).onClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getContasReceber();
    });
  }

  receberConta(conta: ContaReceber): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja marcar esta conta como recebida?',
      header: 'Confirmação',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.contasAReceberService.receberConta(conta.id!, 'DINHEIRO')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta marcada como recebida com sucesso!',
                life: 2500
              });
              this.getContasReceber();
            },
            error: (err) => {
              console.error('Erro ao receber conta:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao receber conta',
                life: 2500
              });
            }
          });
      }
    });
  }

  deleteConta(conta: ContaReceber): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta conta a receber?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contasAReceberService.excluirContaReceber(conta.id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber excluída com sucesso!',
                life: 2500
              });
              this.getContasReceber();
            },
            error: (err) => {
              console.error('Erro ao excluir conta:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir conta a receber',
                life: 2500
              });
            }
          });
      }
    });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'RECEBIDA':
        return 'success';
      case 'PENDENTE':
        return 'warning';
      case 'VENCIDA':
        return 'danger';
      default:
        return 'info';
    }
  }

  isVencida(dataVencimento: string): boolean {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

