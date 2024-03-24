import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Cidade } from 'src/models/interfaces/cidade/Cidade';

@Component({
  selector: 'app-cidade-view',
  templateUrl: './cidade-view.component.html',
  styleUrls: ['./cidade-view.component.scss']
})
export class CidadeViewComponent implements OnInit {
  cidade!: Cidade;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.cidade = this.config.data.cidade;
  }

  close() {
    this.ref.close();
  }
}
