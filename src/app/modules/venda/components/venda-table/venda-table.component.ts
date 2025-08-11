import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { VendaService } from 'src/app/services/venda/venda.service';
import { VendaEvent } from 'src/models/enums/venda/VendaEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Venda } from 'src/models/interfaces/venda/Venda';
import { VendaFormComponent } from '../../components/venda-form/venda-form.component';
import { VendaViewComponent } from '../../components/venda-view/venda-view.component';

@Component({
  selector: 'app-venda-home',
  templateUrl: './venda-home.component.html',
  styleUrls: ['./venda-home.component.scss']
})
export class VendaHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public vendasList: Array<Venda> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private vendaService: VendaService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAPIVendasDatas();
  }

  getAPIVendasDatas() {
    this.vendaService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vendasList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar Vendas',
            life: 2500,
          });
        },
      });
  }

  handleVendaAction(event: EventAction): void {
    if (event.action === VendaEvent.CREATE_VENDA_EVENT || event.action === VendaEvent.EDIT_VENDA_EVENT) {
      this.ref = this.dialogService.open(VendaFormComponent, {
        header: event?.action,
        width: '70%',
        height: '100vh',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          vendasList: this.vendasList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIVendasDatas(),
      });
    } else if (event.action === VendaEvent.EFETIVATE_VENDA_EVENT) {
      this.handleEfetivarVenda(event);
    } else if (event.action === VendaEvent.GERAR_CONTA_RECEBER_EVENT) {
      this.handleGerarContaReceber(event);
    } else if (event.action === VendaEvent.GERAR_ORDEM_SERVICO_EVENT) {
      this.handleGerarOrdemServico(event);
    } else {
      this.handleViewVendaAction(event);
    }
  }

  handleEfetivarVenda(event: EventAction) {
    this.confirmationService.confirm({
      message: 'Deseja realmente efetivar esta venda? Esta ação não pode ser desfeita.',
      header: 'Confirmar Efetivação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vendaService.efetivarVenda(event.id as number)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Venda efetivada com sucesso',
                life: 2500,
              });
              this.getAPIVendasDatas();
            },
            error: (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao efetivar venda',
                life: 2500,
              });
            },
          });
      }
    });
  }

  handleGerarContaReceber(event: EventAction) {
    this.confirmationService.confirm({
      message: 'Deseja gerar a conta a receber para esta venda?',
      header: 'Confirmar Geração',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.vendaService.gerarContaReceber(event.id as number)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Conta a receber gerada com sucesso',
                life: 2500,
              });
              this.getAPIVendasDatas();
            },
            error: (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao gerar conta a receber',
                life: 2500,
              });
            },
          });
      }
    });
  }

  handleGerarOrdemServico(event: EventAction) {
    this.confirmationService.confirm({
      message: 'Deseja gerar a ordem de serviço para esta venda?',
      header: 'Confirmar Geração',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.vendaService.gerarOrdemServico(event.id as number)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ordem de serviço gerada com sucesso',
                life: 2500,
              });
              this.getAPIVendasDatas();
            },
            error: (err) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao gerar ordem de serviço',
                life: 2500,
              });
            },
          });
      }
    });
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleViewVendaAction(event: EventAction) {
    if (event) {
      this.vendaService.findById(event?.id as number)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(VendaViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  venda: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIVendasDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
