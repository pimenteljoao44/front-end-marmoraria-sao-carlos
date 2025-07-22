import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { ProdutoDataTransferService } from 'src/app/shared/services/produto/produto-data-transfer.service';
import { ProdutoEvent } from 'src/models/enums/produto/ProdutoEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Produto } from 'src/models/interfaces/produto/Produto';
import { ProdutoFormComponent } from '../../components/produto-form/produto-form.component';
import { ProdutoViewComponent } from '../../components/produto-view/produto-view.component';

@Component({
  selector: 'app-produto-home',
  templateUrl: './produto-home.component.html',
})
export class ProdutoHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  sidebarVisible = false;
  public produtoList:Array<Produto> = [];
  private ref!: DynamicDialogRef;

  constructor(
    private produtoService:ProdutoService,
    private produtoDtTransferService:ProdutoDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getServiceProdutosDatas();
  }

  getServiceProdutosDatas() {
    const productsLoaded = this.produtoDtTransferService.getProdutosDatas();
    if (productsLoaded.length > 0) {
      this.produtoList = productsLoaded;
    } else {
      this.getAPIProdutosDatas();
    }
  }

  getAPIProdutosDatas() {
    this.produtoService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
            this.produtoList = response;
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if (event.action === ProdutoEvent.CREATE_PRODUCT_EVENT || event.action === ProdutoEvent.EDIT_PRODUCT_EVENT ) {
      this.ref = this.dialogService.open(ProdutoFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          produtoList:this.produtoList
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIProdutosDatas(),
      });
    } else {
      this.handleViewProductAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteProductAction(event: { product_id: number; product_name: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar o produto ${event?.product_name}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      });
    }
  }

  handleViewProductAction(event: EventAction) {
    if (event) {
      this.produtoService.findById(event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(ProdutoViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  produto: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPIProdutosDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteProduct(prod_id: number): void {
    if (prod_id) {
      this.produtoService
        .delete(prod_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPIProdutosDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto Excluido com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao excluir produto ${err.error.error}`,
              life: 2500,
            });
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
