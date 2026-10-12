import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-installment-config',
  templateUrl: './installment-config.component.html',
  styleUrls: ['./installment-config.component.scss']
})
export class InstallmentConfigComponent implements OnInit, OnChanges {

  @Input() valorTotal: number = 0;
  @Input() enabled: boolean = false;
  @Output() configChange = new EventEmitter<any>();
  @Output() enabledChange = new EventEmitter<boolean>();

  installmentEnabled: boolean = false;
  numeroParcelas: number = 1;
  dataVencimento: Date = new Date();
  minDate: Date = new Date();
  parcelas: any[] = [];

  ngOnInit(): void {
    this.installmentEnabled = this.enabled;
    this.minDate = new Date();
    this.dataVencimento = new Date();
    this.dataVencimento.setMonth(this.dataVencimento.getMonth() + 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valorTotal'] && this.installmentEnabled) {
      this.calcularParcelas();
    }
    if (changes['enabled']) {
      this.installmentEnabled = this.enabled;
    }
  }

  onEnabledChange(): void {
    this.enabledChange.emit(this.installmentEnabled);
    if (this.installmentEnabled) {
      this.calcularParcelas();
    } else {
      this.parcelas = [];
      this.emitConfig();
    }
  }

  onParcelasChange(): void {
    if (this.numeroParcelas < 1) {
      this.numeroParcelas = 1;
    }
    if (this.numeroParcelas > 12) {
      this.numeroParcelas = 12;
    }
    this.calcularParcelas();
  }

  onDataVencimentoChange(): void {
    this.calcularParcelas();
  }

  calcularParcelas(): void {
    if (!this.installmentEnabled || !this.valorTotal || this.numeroParcelas < 1) {
      this.parcelas = [];
      this.emitConfig();
      return;
    }

    this.parcelas = [];
    const valorParcela = this.valorTotal / this.numeroParcelas;

    for (let i = 0; i < this.numeroParcelas; i++) {
      const dataVencimentoParcela = new Date(this.dataVencimento);
      dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + i);

      // Ajustar valor da última parcela para compensar arredondamentos
      const valor = i === this.numeroParcelas - 1
        ? this.valorTotal - (valorParcela * (this.numeroParcelas - 1))
        : valorParcela;

      this.parcelas.push({
        numero: i + 1,
        valor: Number(valor.toFixed(2)),
        dataVencimento: dataVencimentoParcela
      });
    }

    this.emitConfig();
  }

  private emitConfig(): void {
    const config = this.installmentEnabled ? {
      numeroParcelas: this.numeroParcelas,
      dataVencimento: this.dataVencimento,
      parcelas: this.parcelas
    } : null;

    this.configChange.emit(config);
  }
}
