import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-relatorio-compra',
  templateUrl: './relatorio-compra.component.html',
  styleUrls: ['./relatorio-compra.component.scss']
})
export class RelatorioCompraComponent implements OnInit, OnDestroy {
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
