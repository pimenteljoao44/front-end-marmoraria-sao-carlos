import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstallmentRequestDTO } from '../../../services/parcela.service';

@Component({
  selector: 'app-installment-config',
  templateUrl: './installment-config.component.html',
  styleUrls: ['./installment-config.component.scss']
})
export class InstallmentConfigComponent implements OnInit {
  @Input() valorTotal: number = 0;
  @Input() enabled: boolean = true;
  @Input() initialConfig?: InstallmentRequestDTO;
  @Output() configChange = new EventEmitter<InstallmentRequestDTO>();
  @Output() enabledChange = new EventEmitter<boolean>();


  installmentForm: FormGroup;
  isParcelado = false;
  parcelas: ParcelaPreview[] = [];
  today: Date = new Date();

  constructor(private fb: FormBuilder) {
    this.installmentForm = this.fb.group({
      numeroParcelas: [1, [Validators.required, Validators.min(1), Validators.max(24)]],
      intervaloDias: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      dataPrimeiroVencimento: [this.getDefaultFirstDueDate(), Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    if (this.initialConfig) {
      this.installmentForm.patchValue(this.initialConfig);
      this.isParcelado = this.initialConfig.numeroParcelas > 1;
    }

    // Observar mudanças no formulário
    this.installmentForm.valueChanges.subscribe(() => {
      this.calculateParcelas();
      this.emitConfig();
    });

    // Calcular parcelas iniciais
    this.calculateParcelas();
  }

  onParceladoChange(): void {
    if (!this.isParcelado) {
      this.installmentForm.patchValue({ numeroParcelas: 1 });
    } else {
      this.installmentForm.patchValue({ numeroParcelas: 2 });
    }
    this.enabledChange.emit(this.isParcelado);
  }

  private getDefaultFirstDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  calculateParcelas(): void {
    if (!this.valorTotal || this.valorTotal <= 0) {
      this.parcelas = [];
      return;
    }

    const formValue = this.installmentForm.value;
    const numeroParcelas = formValue.numeroParcelas || 1;
    const intervaloDias = formValue.intervaloDias || 30;
    const dataPrimeiroVencimento = new Date(formValue.dataPrimeiroVencimento || this.getDefaultFirstDueDate());

    this.parcelas = [];
    const valorParcela = this.valorTotal / numeroParcelas;

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(dataPrimeiroVencimento);
      dataVencimento.setDate(dataVencimento.getDate() + (i - 1) * intervaloDias);

      // Ajustar a última parcela para compensar arredondamentos
      let valor = valorParcela;
      if (i === numeroParcelas) {
        const totalParcelasAnteriores = valorParcela * (numeroParcelas - 1);
        valor = this.valorTotal - totalParcelasAnteriores;
      }

      this.parcelas.push({
        numero: i,
        total: numeroParcelas,
        valor: valor,
        dataVencimento: dataVencimento,
        descricao: `${i}/${numeroParcelas}`
      });
    }
  }

  private emitConfig(): void {
    if (this.installmentForm.valid) {
      const config: InstallmentRequestDTO = {
        ...this.installmentForm.value,
        valorTotal: this.valorTotal
      };
      this.configChange.emit(config);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  getValorTotalParcelas(): number {
    return this.parcelas.reduce((total, parcela) => total + parcela.valor, 0);
  }

  // Validadores customizados
  get numeroParcelas() { return this.installmentForm.get('numeroParcelas'); }
  get intervaloDias() { return this.installmentForm.get('intervaloDias'); }
  get dataPrimeiroVencimento() { return this.installmentForm.get('dataPrimeiroVencimento'); }
  get observacoes() { return this.installmentForm.get('observacoes'); }
}

interface ParcelaPreview {
  numero: number;
  total: number;
  valor: number;
  dataVencimento: Date;
  descricao: string;
}

