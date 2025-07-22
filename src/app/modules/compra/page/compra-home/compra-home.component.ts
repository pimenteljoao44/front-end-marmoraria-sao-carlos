import { CompraFormComponent } from './../../components/compra-form/compra-form/compra-form.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CompraService } from 'src/app/services/compra/compra.service';
import { CompraEvent } from 'src/models/enums/compra/CompraEvent';
import { Compra } from 'src/models/interfaces/compra/Compra';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { CompraViewComponent } from '../../components/compra-view/compra-view/compra-view.component';

@Component({
  selector: 'app-compra-home',
  templateUrl: './compra-home.component.html',
  styleUrls: ['./compra-home.component.scss']
})
export class CompraHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public comprasList: Array<Compra> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private compraService: CompraService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAPIComprasDatas();
  }

  getAPIComprasDatas() {
    this.compraService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.comprasList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar Compras',
            life: 2500,
          });
        },
      });
  }

  handleCompraAction(event: EventAction): void {
    if (event.action === CompraEvent.CREATE_COMPRA_EVENT || event.action === CompraEvent.EDIT_COMPRA_EVENT) {
      this.ref = this.dialogService.open(CompraFormComponent, {
        header: event?.action,
        width: '70%',
        height: '100vh', // Ajuste conforme necessário
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          comprasList: this.comprasList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIComprasDatas(),
      });
    } else {
      this.handleViewCompraAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleViewCompraAction(event: EventAction) {
    if (event) {
      this.compraService.findById(event?.id as number)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(CompraViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  compra: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIComprasDatas(),
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
