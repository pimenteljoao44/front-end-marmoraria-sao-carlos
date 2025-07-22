import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  PaymentGatewayService, 
  PaymentMethod, 
  PaymentProvider,
  CustomerInfo,
  PaymentOptions 
} from '../../../services/payment-gateway.service';

@Component({
  selector: 'app-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrls: ['./payment-method-selector.component.scss']
})
export class PaymentMethodSelectorComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() currency: string = 'BRL';
  @Input() description: string = '';
  @Input() orderReference: string = '';
  @Input() customer: CustomerInfo | null = null;
  @Input() disabled: boolean = false;
  
  @Output() paymentMethodSelected = new EventEmitter<{
    paymentMethod: PaymentMethod;
    provider: PaymentProvider;
    options: PaymentOptions;
  }>();
  
  @Output() paymentInitiated = new EventEmitter<any>();

  paymentForm: FormGroup;
  availablePaymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  availableProviders: PaymentProvider[] = [];
  selectedProvider: PaymentProvider | null = null;
  loading: boolean = false;
  error: string | null = null;

  // Payment method configurations
  paymentMethodConfigs = {
    [PaymentMethod.PIX]: {
      icon: 'fas fa-qrcode',
      color: 'text-green-600',
      description: 'Pagamento instantâneo via PIX',
      requiresCard: false,
      supportsInstallments: false
    },
    [PaymentMethod.CREDIT_CARD]: {
      icon: 'fas fa-credit-card',
      color: 'text-blue-600',
      description: 'Cartão de crédito',
      requiresCard: true,
      supportsInstallments: true
    },
    [PaymentMethod.DEBIT_CARD]: {
      icon: 'fas fa-credit-card',
      color: 'text-purple-600',
      description: 'Cartão de débito',
      requiresCard: true,
      supportsInstallments: false
    },
    [PaymentMethod.BOLETO]: {
      icon: 'fas fa-barcode',
      color: 'text-orange-600',
      description: 'Boleto bancário',
      requiresCard: false,
      supportsInstallments: false
    },
    [PaymentMethod.DIGITAL_WALLET]: {
      icon: 'fas fa-wallet',
      color: 'text-indigo-600',
      description: 'Carteira digital',
      requiresCard: false,
      supportsInstallments: true
    }
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private paymentGatewayService: PaymentGatewayService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadAvailablePaymentMethods();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      provider: ['', Validators.required],
      installments: [1, [Validators.min(1), Validators.max(12)]],
      saveCard: [false],
      // Credit/Debit Card fields
      cardNumber: [''],
      cardHolderName: [''],
      expiryMonth: [''],
      expiryYear: [''],
      cvv: [''],
      // PIX fields
      pixKey: [''],
      // Customer fields
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.email]],
      customerDocument: [''],
      customerPhone: ['']
    });

    // Watch for payment method changes
    this.paymentForm.get('paymentMethod')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(method => {
        this.onPaymentMethodChange(method);
      });

    // Watch for provider changes
    this.paymentForm.get('provider')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(providerId => {
        this.onProviderChange(providerId);
      });
  }

  private loadAvailablePaymentMethods(): void {
    this.loading = true;
    this.error = null;

    this.paymentGatewayService.getAvailablePaymentMethods(this.amount)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (methods) => {
          this.availablePaymentMethods = methods;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar métodos de pagamento';
          this.loading = false;
          console.error('Error loading payment methods:', error);
        }
      });
  }

  private onPaymentMethodChange(method: PaymentMethod): void {
    if (!method) return;

    this.selectedPaymentMethod = method;
    this.selectedProvider = null;
    this.paymentForm.patchValue({ provider: '' });

    // Update form validators based on payment method
    this.updateFormValidators(method);

    // Load providers for this payment method
    this.loadProvidersForPaymentMethod(method);
  }

  private onProviderChange(providerId: string): void {
    if (!providerId) return;

    this.selectedProvider = this.availableProviders.find(p => p.providerId === providerId) || null;
    
    if (this.selectedProvider) {
      // Update installment options based on provider capabilities
      this.updateInstallmentOptions();
    }
  }

  private updateFormValidators(method: PaymentMethod): void {
    const config = this.paymentMethodConfigs[method];
    
    // Clear all validators first
    this.clearCardValidators();
    
    if (config?.requiresCard) {
      // Add card validators
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{13,19}$/)]);
      this.paymentForm.get('cardHolderName')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.paymentForm.get('expiryMonth')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      this.paymentForm.get('expiryYear')?.setValidators([Validators.required, Validators.min(new Date().getFullYear())]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    }

    // Update form control validity
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  private clearCardValidators(): void {
    const cardFields = ['cardNumber', 'cardHolderName', 'expiryMonth', 'expiryYear', 'cvv'];
    cardFields.forEach(field => {
      this.paymentForm.get(field)?.clearValidators();
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
  }

  private loadProvidersForPaymentMethod(method: PaymentMethod): void {
    this.loading = true;

    this.paymentGatewayService.getProvidersForPaymentMethod(method)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers) => {
          this.availableProviders = providers.filter(p => p.enabled);
          this.loading = false;

          // Auto-select first provider if only one available
          if (this.availableProviders.length === 1) {
            this.paymentForm.patchValue({ provider: this.availableProviders[0].providerId });
          }
        },
        error: (error) => {
          this.error = 'Erro ao carregar provedores de pagamento';
          this.loading = false;
          console.error('Error loading providers:', error);
        }
      });
  }

  private updateInstallmentOptions(): void {
    if (!this.selectedProvider || !this.selectedPaymentMethod) return;

    const config = this.paymentMethodConfigs[this.selectedPaymentMethod];
    const maxInstallments = config?.supportsInstallments && this.selectedProvider.supportsInstallments ? 12 : 1;

    // Update installments validator
    this.paymentForm.get('installments')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(maxInstallments)
    ]);
    this.paymentForm.get('installments')?.updateValueAndValidity();

    // Reset to 1 if current value exceeds max
    const currentInstallments = this.paymentForm.get('installments')?.value || 1;
    if (currentInstallments > maxInstallments) {
      this.paymentForm.patchValue({ installments: 1 });
    }
  }

  onSubmit(): void {
    if (this.paymentForm.invalid || !this.selectedPaymentMethod || !this.selectedProvider) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.paymentForm.value;
    
    // Prepare payment options
    const options: PaymentOptions = {
      installments: formValue.installments || 1,
      saveCard: formValue.saveCard || false,
      autoCapture: true
    };

    // Emit selection event
    this.paymentMethodSelected.emit({
      paymentMethod: this.selectedPaymentMethod,
      provider: this.selectedProvider,
      options: options
    });

    // Prepare and emit payment initiation
    this.initiatePayment(formValue, options);
  }

  private initiatePayment(formValue: any, options: PaymentOptions): void {
    const paymentData = {
      paymentMethod: this.selectedPaymentMethod,
      provider: this.selectedProvider,
      amount: this.amount,
      currency: this.currency,
      description: this.description,
      orderReference: this.orderReference,
      options: options,
      customer: {
        name: formValue.customerName,
        email: formValue.customerEmail,
        documentNumber: formValue.customerDocument,
        phone: formValue.customerPhone
      },
      paymentMethodData: this.buildPaymentMethodData(formValue)
    };

    this.paymentInitiated.emit(paymentData);
  }

  private buildPaymentMethodData(formValue: any): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    if (this.selectedPaymentMethod === PaymentMethod.CREDIT_CARD || 
        this.selectedPaymentMethod === PaymentMethod.DEBIT_CARD) {
      data.cardNumber = formValue.cardNumber;
      data.cardHolderName = formValue.cardHolderName;
      data.expiryMonth = formValue.expiryMonth;
      data.expiryYear = formValue.expiryYear;
      data.cvv = formValue.cvv;
    }

    if (this.selectedPaymentMethod === PaymentMethod.PIX && formValue.pixKey) {
      data.pixKey = formValue.pixKey;
    }

    return data;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsTouched();
    });
  }

  // Utility methods for template
  getPaymentMethodDisplayName(method: PaymentMethod): string {
    return this.paymentGatewayService.getPaymentMethodDisplayName(method);
  }

  getPaymentMethodConfig(method: PaymentMethod) {
    return this.paymentMethodConfigs[method] || {};
  }

  formatCurrency(amount: number): string {
    return this.paymentGatewayService.formatCurrency(amount, this.currency);
  }

  isFieldRequired(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field?.hasError('required') && field?.touched || false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field?.invalid && field?.touched || false;
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('email')) return 'Email inválido';
    if (field?.hasError('pattern')) return 'Formato inválido';
    if (field?.hasError('min')) return 'Valor muito baixo';
    if (field?.hasError('max')) return 'Valor muito alto';
    if (field?.hasError('minlength')) return 'Muito curto';
    return '';
  }

  canUseInstallments(): boolean {
    if (!this.selectedPaymentMethod || !this.selectedProvider) return false;
    
    const config = this.paymentMethodConfigs[this.selectedPaymentMethod];
    return config?.supportsInstallments && this.selectedProvider.supportsInstallments || false;
  }

  getMaxInstallments(): number {
    return this.canUseInstallments() ? 12 : 1;
  }

  calculateInstallmentAmount(): number {
    const installments = this.paymentForm.get('installments')?.value || 1;
    return this.amount / installments;
  }
}

