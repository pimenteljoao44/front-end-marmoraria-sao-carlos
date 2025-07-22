import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MessageService } from 'primeng/api';
import { Fornecedor } from 'src/models/interfaces/fornecedor/Fornecedor'; // Ajuste conforme o caminho correto
import { FornecedorService } from 'src/app/services/fornecedor/fornecedor.service';

@Component({
  selector: 'app-tela-relatorio-compra',
  templateUrl: './tela-relatorio-compra.component.html',
  styleUrls: ['./tela-relatorio-compra.component.scss']
})
export class TelaRelatorioCompraComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public relatorioCompraForm: FormGroup;
  public allFornecedores: Fornecedor[] = [];
  public fornecedores: Fornecedor[] = [];
  public allFormasPagamento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private messageService: MessageService,
    private fornecedoresService: FornecedorService
  ) {
    // Inicializa o FormGroup com os controles necessários
    this.relatorioCompraForm = this.fb.group({
      fornecedor: [null], // ID do fornecedor
      fornecedorNome: [null], // Nome do fornecedor
      dataInicial: [null],
      dataFinal: [null],
      formaPagamento: [null],
      formaPagamentoNome: [null]
    });
  }

  ngOnInit(): void {
    this.loadAllFornecedores();
    this.loadAllFormasPagamento();
  }

  gerarRelatorioDeCompras(): void {
    const filters = this.relatorioCompraForm.value;

    // Remove campos com valor null
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null)
    );

    this.relatorioService.gerarRelatorioDeComprasResumido(cleanedFilters).subscribe(
      (response) => {
        this.downloadPdf(response);
      },
      (error) => {
        console.error('Erro ao gerar o relatório:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao gerar relatório',
          detail: error.error?.message || 'Erro desconhecido',
          life: 3000,
          closable: true,
        });
      }
    );
  }

  private downloadPdf(response: Blob): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Relatorio de Compras.pdf';
    link.click();

    const newTab = window.open();
    if (newTab) {
      newTab.location.href = url;
      newTab.document.title = 'Relatório de Compras';
      newTab.focus();
    } else {
      console.warn('A aba não pôde ser aberta. Verifique se o bloqueador de pop-ups está ativo.');
    }

    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  toggleField(field: string): void {
    const fieldElement = document.getElementById(field);
    if (fieldElement) {
      const isVisible = fieldElement.style.display === 'none';
      fieldElement.style.display = isVisible ? 'block' : 'none';

      if (!isVisible) {
        this.relatorioCompraForm.patchValue({ [field]: null });
      }
    }
  }



  loadAllFornecedores(): void {
    this.fornecedoresService.findAll().pipe(takeUntil(this.destroy$)).subscribe(
      (response) => this.allFornecedores = response,
      (error) => console.error('Erro ao carregar fornecedores:', error)
    );
  }

  searchFornecedores(event: any): void {
    const query = event.query.toLowerCase();
    this.fornecedores = this.allFornecedores.filter((fornecedor) => fornecedor.nome.toLowerCase().includes(query));
  }

  onFornecedorSelect(event: any): void {
    const fornecedor = event.value;
    if (fornecedor) {
      this.relatorioCompraForm.patchValue({
        fornecedor: fornecedor.id,
        fornecedorNome: fornecedor.nome
      });
    }
  }

  onFormaPagamentoChange(event: any): void {
    const selectedForma = this.allFormasPagamento.find(fp => fp.cod === event);
    if (selectedForma) {
      this.relatorioCompraForm.patchValue({
        formaPagamento: selectedForma.cod,
        formaPagamentoNome: selectedForma.nome
      });
    }
  }

  loadAllFormasPagamento(): void {
    this.allFormasPagamento = [
      { cod: 0, label: 'DINHEIRO', nome: 'Dinheiro' },
      { cod: 1, label: 'PIX', nome: 'Pix' },
      { cod: 2, label: 'CARTAO_DE_CREDITO', nome: 'Cartão de Crédito' },
      { cod: 3, label: 'CARTAO_DE_DEBITO', nome: 'Cartão de Débito' },
      { cod: 4, label: 'BOLETO_BANCARIO', nome: 'Boleto Bancário' },
      { cod: 5, label: 'TRANSFERENCIA_BANCARIA', nome: 'Transferência Bancária' },
      { cod: 6, label: 'CHEQUE', nome: 'Cheque' }
    ];
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
