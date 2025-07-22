import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ContaPagar } from 'src/models/interfaces/financeiro/ContaPagar';
import { ContaPagarFormComponent } from '../components/conta-pagar-form/conta-pagar-form.component';
import {ContasAPagarService} from "../../../services/financeiro/conta-pagar.service";

@Component({
  selector: 'app-contas-a-pagar',
  templateUrl: './contas-a-pagar.component.html',
  styleUrls: ['./contas-a-pagar.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ContasAPagarComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public contasPagar: Array<ContaPagar> = [];
  public loading: boolean = false;
  sidebarVisible = false;
  constructor(
    private contasAPagarService: ContasAPagarService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getContasPagar();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  getContasPagar(): void {
    this.loading = true;
    this.contasAPagarService.listarContasPagar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contasPagar = response;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar contas a pagar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar contas a pagar',
            life: 2500
          });
          this.loading = false;
        }
      });
  }

  openAddContaPagarDialog(): void {
    this.dialogService.open(ContaPagarFormComponent, {
      header: 'Nova Conta a Pagar',
      width: '70%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        event: { action: 'CREATE_CONTA_PAGAR_EVENT' },
        contasPagarList: this.contasPagar
      }
    }).onClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getContasPagar();
    });
  }

  openEditContaPagarDialog(conta: ContaPagar): void {
    this.dialogService.open(ContaPagarFormComponent, {
      header: 'Editar Conta a Pagar',
      width: '70%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        event: { action: 'EDIT_CONTA_PAGAR_EVENT', id: conta.id },
        contasPagarList: this.contasPagar
      }
    }).onClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getContasPagar();
    });
  }

  pagarConta(conta: ContaPagar): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja marcar esta conta como paga?',
      header: 'Confirmação',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.contasAPagarService.pagarConta(conta.id!, 'DINHEIRO')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta marcada como paga com sucesso!',
                life: 2500
              });
              this.getContasPagar();
            },
            error: (err) => {
              console.error('Erro ao pagar conta:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao pagar conta',
                life: 2500
              });
            }
          });
      }
    });
  }

  deleteConta(conta: ContaPagar): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta conta a pagar?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contasAPagarService.excluirContaPagar(conta.id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a pagar excluída com sucesso!',
                life: 2500
              });
              this.getContasPagar();
            },
            error: (err) => {
              console.error('Erro ao excluir conta:', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir conta a pagar',
                life: 2500
              });
            }
          });
      }
    });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'PAGA':
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

