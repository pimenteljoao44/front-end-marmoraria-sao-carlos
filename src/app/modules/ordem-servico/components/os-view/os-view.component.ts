import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdemServico, StatusOrdemServico, OrdemServicoService } from 'src/app/services/os/ordem-de-servico.service';

@Component({
  selector: 'app-os-view',
  templateUrl: './os-view.component.html',
  styleUrls: ['./os-view.component.scss']
})
export class OsViewComponent implements OnInit {
  ordemServico!: OrdemServico;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ordemServicoService: OrdemServicoService
  ) { }

  ngOnInit(): void {
    if (this.config.data?.ordemServico) {
      this.ordemServico = this.config.data.ordemServico;
    }
  }

  onClose(): void {
    this.ref.close();
  }

  getStatusLabel(status: StatusOrdemServico): string {
    return this.ordemServicoService.getStatusLabel(status);
  }

  getStatusColor(status: StatusOrdemServico): string {
    return this.ordemServicoService.getStatusColor(status);
  }

  formatarData(data: string | undefined): string {
    if (!data) return 'Não definida';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarDataHora(data: string | undefined): string {
    if (!data) return 'Não definida';
    return new Date(data).toLocaleString('pt-BR');
  }
}

