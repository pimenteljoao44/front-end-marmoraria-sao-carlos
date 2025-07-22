import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OsService } from 'src/app/services/os/ordem-de-servico.service';
import { OsEvent } from 'src/models/enums/os/OsEvent';
import { Status } from 'src/models/enums/os/Status';
import {OrdemDeServico, StatusOrdemServico} from 'src/models/interfaces/os/OrdemDeServico';
import { EventAction } from 'src/models/interfaces/User/event/EventAction';

@Component({
  selector: 'app-os-table',
  templateUrl: './os-table.component.html',
  styleUrls: ['./os-table.component.scss']
})
export class OsTableComponent implements OnInit {
  @Input() osAbertas: Array<OrdemDeServico> = [];
  @Output() osEvent = new EventEmitter<EventAction>();

  public osEmAndamento: any[] = [];
  public osConcluidas: any[] = [];
  public osSelected: any[] = [];

  public createOsEvent = OsEvent.CREATE_OS_EVENT;
  public editOsEvent = OsEvent.EDIT_OS_EVENT;
  public viewOsEvent = OsEvent.VIEW_OS_EVENT;

  constructor(
    private osService: OsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrdemServicos();
  }

  loadOrdemServicos(): void {
    this.osService.findAll().subscribe((ordens) => {
      this.osAbertas = ordens.filter((os) => os.status === StatusOrdemServico.PENDENTE);
      this.osEmAndamento = ordens.filter((os) => os.status === StatusOrdemServico.EM_ANDAMENTO);
      this.osConcluidas = ordens.filter((os) => os.status === StatusOrdemServico.CONCLUIDA);
    });
  }

  handleOsEvent(action: string, id?: number): void {
    if (action) {
      const osEventData = id !== undefined && id !== null ? { action, id } : { action };
      this.osEvent.emit(osEventData);
    }
  }

  // manda a o.s selecionada para a lista de o.s em andamento
  handleInitOs(os: OrdemDeServico): void {
    if (os.id != null) {
      this.osService.startOs(os.id).subscribe((os) => {
        // adiciona a o.s selecionada para a lista de o.s em andamento
        this.osEmAndamento.push(os);
        // remove a o.s selecionada da lista de o.s abertas
        this.osAbertas = this.osAbertas.filter((o) => o.id !== os.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso.',
          detail: 'O.S iniciada com sucesso',
          life: 2500,
        });
      });
    }
  }
}
