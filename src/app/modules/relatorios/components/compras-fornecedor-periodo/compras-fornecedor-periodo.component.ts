import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-compras-fornecedor-periodo',
  templateUrl: './compras-fornecedor-periodo.component.html',
  styleUrls: ['./compras-fornecedor-periodo.component.scss']
})
export class ComprasFornecedorPeriodoComponent implements OnInit {

  form: FormGroup;
  fornecedores: any[] = [];
  loading = false;
  sidebarVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private fornecedorService: FornecedorService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      fornecedorId: [null],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  handleOpenSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  carregarFornecedores(): void {
    this.fornecedorService.findAll().subscribe({
      next: (fornecedores) => {
        this.fornecedores = fornecedores.map(fornecedor => ({
          label: fornecedor.nome,
          value: fornecedor.id
        }));
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar fornecedores'
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

    this.relatorioService.gerarRelatorioComprasPorFornecedorPeriodo(filtros).subscribe({
      next: (blob) => {
        const fileName = `relatorio-compras-fornecedor-periodo-${new Date().getTime()}.pdf`;
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

