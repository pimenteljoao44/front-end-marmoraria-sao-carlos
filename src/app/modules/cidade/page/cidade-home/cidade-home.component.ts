import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { CidadeDataTransferService } from 'src/app/shared/services/cidade/cidade-data-transfer.service';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { CidadeFormComponent } from '../../components/cidade-form/cidade-form.component';
import { CidadeViewComponent } from '../../components/cidade-view/cidade-view.component';
import { CidadeEvent } from 'src/models/enums/cidade/CidadeEvent';

@Component({
  selector: 'app-cidade-home',
  templateUrl: './cidade-home.component.html',
  styleUrls: ['./cidade-home.component.scss']
})
export class CidadeHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public cidadeList: Array<Cidade> = [];

  private ref!: DynamicDialogRef;

  sidebarVisible = false;

  constructor(
    private cidadeService: CidadeService,
    private cidadeDtransferService: CidadeDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getServiceCiadadesDatas();
  }

  getServiceCiadadesDatas() {
    const cidadesLoaded = this.cidadeDtransferService.getCidadesDatas();
    if (cidadesLoaded.length > 0) {
      this.cidadeList = cidadesLoaded;
    } else {
      this.getAPICidadesDatas();
    }
  }

  getAPICidadesDatas() {
    this.cidadeService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.cidadeList = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar ciades',
            life: 2500,
          });
        },
      });
  }

  handleCidadeAction(event: EventAction): void {
    if (event.action === CidadeEvent.CREATE_CITY_EVENT || event.action === CidadeEvent.EDIT_CITY_EVENT) {
      this.ref = this.dialogService.open(CidadeFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          cidadeList: this.cidadeList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPICidadesDatas(),
      });
    } else {
      this.handleViewCidadeAction(event);
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleDeleteCidadeAction(event: { cid_id: number; nome: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Deseja realmente deletar a ciade ${event?.nome}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCidade(event?.cid_id),
      });
    }
  }

  handleViewCidadeAction(event: EventAction) {
    if (event) {
      this.cidadeService.findById(event?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.ref = this.dialogService.open(CidadeViewComponent, {
                header: event?.action,
                width: '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: {
                  cidade: response,
                },
              });
              this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
                next: () => this.getAPICidadesDatas(),
              });
            }
          },
          error(err) {
            console.log(err);
          },
        });
    }
  }

  deleteCidade(cid_id: number): void {
    if (cid_id) {
      this.cidadeService
        .delete(cid_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.getAPICidadesDatas();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cidade Excluida com sucesso!',
              life: 2500,
            });
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir cidade',
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
