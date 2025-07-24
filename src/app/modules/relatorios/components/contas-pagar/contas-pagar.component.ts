import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contas-pagar',
  templateUrl: './contas-pagar.component.html',
  styleUrls: ['./contas-pagar.component.scss']
})
export class ContasPagarComponent implements OnInit {

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
      dataVencimentoInicio: [null],
      dataVencimentoFim: [null],
      apenasVencidas: [false],
      apenasQuitadas: [false]
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
    this.loading = true;
    const filtros = this.form.value;

    this.relatorioService.gerarRelatorioContasPagar(filtros).subscribe({
      next: (blob) => {
        const fileName = `relatorio-contas-pagar-${new Date().getTime()}.pdf`;
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
      apenasQuitadas: false
    });
  }
}

