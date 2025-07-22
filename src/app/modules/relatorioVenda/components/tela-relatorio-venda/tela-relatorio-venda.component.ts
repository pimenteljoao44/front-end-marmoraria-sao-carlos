import { FormaPagamento } from './../../../../../models/enums/formaPagamento/FormaPagamento';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { Cliente } from 'src/models/interfaces/cliente/Cliente';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tela-relatorio-venda',
  templateUrl: './tela-relatorio-venda.component.html',
  styleUrls: ['./tela-relatorio-venda.component.scss']
})
export class TelaRelatorioVendaComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public relatorioForm: FormGroup;
  public allClientes: Cliente[] = [];
  public clientes: Cliente[] = [];
  public formaPagamento!: FormaPagamento;
  public allFormasPagamento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private clienteService: ClientesService,
    private messageService: MessageService
  ) {
    // Initialize FormGroup with controls
    this.relatorioForm = this.fb.group({
      cliente: [null], // ID do cliente
      clienteNome: [null], // Nome do cliente
      dataInicial: [null],
      dataFinal: [null],
      formaPagamento: [null],
      formaPagamentoNome: [null]
    });

  }

  ngOnInit(): void {
    this.loadAllClientes();
    this.loadAllFormasPagamento();
  }

  gerarRelatorioDeVendasResumido() {
    const filters = this.relatorioForm.value;

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null)
    );

    this.relatorioService.gerarRelatorioDeVendasResumido(cleanedFilters).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Relatorio de Vendas.pdf';
        link.click();

        const newTab = window.open();
        if (newTab) {
          newTab.location.href = url;
          newTab.document.title = 'Relatorio de Vendas';
          newTab.focus();
        } else {
          console.warn('A aba não pôde ser aberta. Verifique se o bloqueador de pop-ups está ativo.');
        }

        setTimeout(() => URL.revokeObjectURL(url), 100);
      },
      (error) => {
        console.error('Erro ao gerar o relatório:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao gerar relatório',
          detail: error.error.error,
          life: 3000,
          closable: true,
        });
      }
    );
  }



  toggleField(field: string): void {
    const fieldElement = document.getElementById(`field${this.capitalizeFirstLetter(field)}`);
    if (fieldElement) {
      const isVisible = fieldElement.style.display === 'none';

      fieldElement.style.display = isVisible ? 'block' : 'none';

      if (!isVisible) {
        this.relatorioForm.patchValue({
          [field]: null
        });
      }
    }
  }


  loadAllClientes(): void {
    this.clienteService.findAll().pipe(takeUntil(this.destroy$)).subscribe(
      (response) => this.allClientes = response,
      (error) => console.error('Erro ao carregar clientes:', error)
    );
  }

  searchClientes(event: any): void {
    const query = event.query.toLowerCase();
    this.clientes = this.allClientes.filter((cliente) => cliente.nome.toLowerCase().includes(query));
  }

  onClienteSelect(event: any): void {
    const cliente = event.value;
    if (cliente) {
      this.relatorioForm.patchValue({
        cliente: cliente.id,
        clienteNome: cliente.nome
      });
    }
  }

  onFormaPagamentoChange(event: any): void {
    const selectedForma = this.allFormasPagamento.find(fp => fp.cod === event);
    if (selectedForma) {
      this.relatorioForm.patchValue({
        formaPagamento: selectedForma.cod,
        formaPagamentoNome: selectedForma.nome
      });
    }
  }


  loadAllFormasPagamento(): void {
    this.allFormasPagamento = [
      { cod: 0,label:'DINHEIRO', nome: 'Dinheiro' },
      { cod: 1,label:'PIX', nome: 'Pix' },
      { cod: 2,label:'CARTAO_DE_CREDITO',nome: 'Cartão de Crédito' },
      { cod: 3, label:'CARTAO_DE_DEBITO', nome: 'Cartão de Débito' },
      { cod: 4, label:'BOLETO_BANCARIO',nome: 'Boleto Bancário' },
      { cod: 5, label: 'TRANSFERENCIA_BANCARIA', nome: 'Transferência Bancária' },
      { cod: 6, label: 'CHEQUE', nome: 'Cheque' }
    ];
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
