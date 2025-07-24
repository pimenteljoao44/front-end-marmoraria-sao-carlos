import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import {ClientesService} from "../../../../services/clientes/clientes.service";

@Component({
  selector: 'app-vendas-cliente-periodo',
  templateUrl: './vendas-cliente-periodo.component.html',
  styleUrls: ['./vendas-cliente-periodo.component.scss']
})
export class VendasClientePeriodoComponent implements OnInit {

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
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required]
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
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios'
      });
      return;
    }

    this.loading = true;
    const filtros = this.form.value;

    this.relatorioService.gerarRelatorioVendasPorClientePeriodo(filtros).subscribe({
      next: (blob) => {
        const fileName = `relatorio-vendas-cliente-periodo-${new Date().getTime()}.pdf`;
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
  }
}

