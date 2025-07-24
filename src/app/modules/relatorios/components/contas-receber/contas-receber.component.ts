import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import {ClientesService} from "../../../../services/clientes/clientes.service";

@Component({
  selector: 'app-contas-receber',
  templateUrl: './contas-receber.component.html',
  styleUrls: ['./contas-receber.component.scss']
})
export class ContasReceberComponent implements OnInit {

  form: FormGroup;
  clientes: any[] = [];
  loading = false;
  sidebarVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private clienteService: ClientesService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      clienteId: [null],
      dataVencimentoInicio: [null],
      dataVencimentoFim: [null],
      apenasVencidas: [false],
      apenasRecebidas: [false]
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  carregarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.clientes = clientes.map(cliente => ({
          label: cliente.nome,
          value: cliente.id
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar clientes'
        });
      }
    });
  }

  gerarRelatorio(): void {
    this.loading = true;
    const filtros = this.form.value;

    this.relatorioService.gerarRelatorioContasReceber(filtros).subscribe({
      next: (blob) => {
        const fileName = `relatorio-contas-receber-${new Date().getTime()}.pdf`;
        saveAs(blob, fileName);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Relatório gerado com sucesso'
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao gerar relatório'
        });
        this.loading = false;
      }
    });
  }

  limparFiltros(): void {
    this.form.reset();
    this.form.patchValue({
      apenasVencidas: false,
      apenasRecebidas: false
    });
  }
}

