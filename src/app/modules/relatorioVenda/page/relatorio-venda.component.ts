import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { VendaService } from 'src/app/services/venda/venda.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio-venda.component.html',
  styleUrls: ['./relatorio-venda.component.scss'],
})
export class RelatorioVendaComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  sidebarVisible = false;

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
