import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { OsService } from 'src/app/services/os/ordem-de-servico.service';
import { OsEvent } from 'src/models/enums/os/OsEvent';
import {OrdemDeServico, StatusOrdemServico} from 'src/models/interfaces/os/OrdemDeServico';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { OsFormComponent } from '../components/os-form/os-form.component';
import { OsViewComponent } from '../components/os-view/os-view.component';
import { Status } from 'src/models/enums/os/Status';

@Component({
  selector: 'app-os-home-component',
  templateUrl: './os-home-component.component.html',
  styleUrls: ['./os-home-component.component.scss'],
})
export class OsHomeComponentComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public osList: Array<OrdemDeServico> = [];
  public osEmAndamento: Array<OrdemDeServico> = [];
  public osConcluidas: Array<OrdemDeServico> = [];
  sidebarVisible = false;

  private ref!: DynamicDialogRef;

  constructor(
    private osService: OsService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.getAPIOsDatas(), 0);
  }


  getAPIOsDatas() {
    this.osService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.osList = response;
          this.osEmAndamento = this.osList.filter(os => os.status === StatusOrdemServico.EM_ANDAMENTO);
          this.osConcluidas = this.osList.filter(os => os.status === StatusOrdemServico.CONCLUIDA);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar Ordens de Serviço',
            life: 2500,
          });
        },
      });
  }

  handleOsAction(event: EventAction): void {
    if (
      event.action === OsEvent.CREATE_OS_EVENT ||
      event.action === OsEvent.EDIT_OS_EVENT
    ) {
      this.ref = this.dialogService.open(OsFormComponent, {
        header: event?.action,
        width: '70%',
        height: '100vh',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          osList: this.osList,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAPIOsDatas(),
      });
    } else {
      this.handleViewOsAction(event);
    }
  }

  handleViewOsAction(event: EventAction) {
    if (event) {
      this.osService.findById(event?.id as number)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.ref = this.dialogService.open(OsViewComponent, {
              header: event?.action,
              width: '70%',
              contentStyle: { overflow: 'auto' },
              baseZIndex: 10000,
              maximizable: true,
              data: {
                os: response,
              },
            });
            this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
              next: () => this.getAPIOsDatas(),
            });
          }
        })
    }
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
