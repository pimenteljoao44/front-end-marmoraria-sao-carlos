import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { VendaService } from 'src/app/services/venda/venda.service';
import { VendaEvent } from 'src/models/enums/venda/VendaEvent';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';
import { Venda } from 'src/models/interfaces/venda/Venda';

@Component({
  selector: 'app-venda-home',
  templateUrl: './projeto-home.component.html',
  styleUrls: ['./projeto-home.component.scss']
})
export class ProjetoHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public vendasList: Array<Venda> = [];

  private ref!: DynamicDialogRef;

  clienteSelecionadoId: number | null = null;

  onOrcamentoSelecionado(event: any): void {
    console.log('Orçamento selecionado:', event);
    // lógica adicional aqui...
  }


  sidebarVisible = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
  }




  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
