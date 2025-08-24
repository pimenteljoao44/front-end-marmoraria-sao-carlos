import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FornecedorService} from 'src/app/services/fornecedor/fornecedor.service';
import {FuncionarioService} from 'src/app/services/funcionario/funcionario.service';
import {FormaPagamento, getDescricaoFormaPagamento} from 'src/models/enums/formaPagamento/FormaPagamento';
import {EventAction} from 'src/models/interfaces/User/event/EventAction';

import {Venda} from "../../../../../models/interfaces/venda/Venda";
import {VendaEvent} from "../../../../../models/enums/venda/VendaEvent";
import {VendaTipo} from "../../../../../models/enums/vendaTipo/VendaTipo";

@Component({
  selector: 'app-venda-table',
  templateUrl: './venda-table.component.html',
  styleUrls: ['./venda-table.component.scss']
})
export class VendaTableComponent {
  @Input() vendas: Array<Venda> = [];
  @Output() vendaEvent = new EventEmitter<EventAction>();
  public vendaSelected!: Venda;

  constructor(
    private fornecedorService: FornecedorService,
    private funcionarioService: FuncionarioService
  ) {}

  public createVendaEvent = VendaEvent.CREATE_VENDA_EVENT;
  public editVendaEvent = VendaEvent.EDIT_VENDA_EVENT;
  public viewVendaEvent = VendaEvent.VIEW_VENDA_EVENT;
  public efetivateVendaEvent = VendaEvent.EFETIVATE_VENDA_EVENT;
  public gerarContaReceberEvent = VendaEvent.GERAR_CONTA_RECEBER_EVENT;
  public gerarOrdemServicoEvent = VendaEvent.GERAR_ORDEM_SERVICO_EVENT;

  public handleVendaEvent(action: string, id?: number): void {
    if (action) {
      const vendaEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.vendaEvent.emit(vendaEventData);
    }
  }

  public getTipoVendaLabel(tipo: number): string {
    switch (tipo) {
      case 0:
        return 'Produto';
      case 1:
        return 'Projeto';
      default:
        return 'N/A';
    }
  }

  public getStatusLabel(venda: Venda): string {
    switch (venda.status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return 'N/A';
    }
  }

  public getStatusClass(venda: Venda): string {
    switch (venda.status) {
      case 'PENDENTE':
        return 'warning';
      case 'CONFIRMADA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      default:
        return 'info';
    }
  }

  public podeEditar(venda: Venda): boolean {
    return venda.status === 'PENDENTE';
  }

  public podeEfetivar(venda: Venda): boolean {
    return venda.status === 'PENDENTE';
  }

  public podeGerarContaReceber(venda: Venda): boolean {
    return venda.status === 'CONFIRMADA' && !venda.contaReceberGerada;
  }

  public podeGerarOrdemServico(venda: Venda): boolean {
    return venda.status === 'CONFIRMADA' && venda.vendaTipo === VendaTipo.ORCAMENTO && !venda.ordemServicoGerada;
  }

  public getDescricaoFormaPagamento(cod: FormaPagamento): string {
    return getDescricaoFormaPagamento(cod);
  }
}
