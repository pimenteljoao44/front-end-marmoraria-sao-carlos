import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces for payment gateway operations
export interface PaymentRequest {
  requestId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  description: string;
  orderReference?: string;
  customer?: CustomerInfo;
  billingAddress?: BillingAddress;
  options?: PaymentOptions;
  callbackUrls?: CallbackUrls;
  expiresAt?: Date;
  metadata?: { [key: string]: string };
  paymentMethodData?: { [key: string]: any };
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  transactionId: string;
  providerTransactionId?: string;
  requestedAmount: number;
  processedAmount?: number;
  currency: string;
  fees?: number;
  netAmount?: number;
  processedAt?: Date;
  statusMessage?: string;
  receipt?: PaymentReceipt;
  providerResponse?: { [key: string]: any };
  errors?: PaymentError[];
  metadata?: { [key: string]: string };
  paymentLink?: string;
  qrCodeData?: string;
  expiresAt?: Date;
  nextAction?: string;
  redirectUrl?: string;
}

export interface PaymentTransaction {
  id: number;
  transactionId: string;
  providerTransactionId?: string;
  providerId: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  processedAmount?: number;
  currency: string;
  fees?: number;
  description?: string;
  orderReference?: string;
  customerInfo?: string;
  providerResponse?: string;
  errorMessage?: string;
  errorCode?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  expiresAt?: Date;
  webhookUrl?: string;
  callbackUrl?: string;
  metadata?: { [key: string]: string };
}

export interface PaymentProvider {
  id: number;
  providerId: string;
  providerName: string;
  description?: string;
  enabled: boolean;
  priority: number;
  apiUrl?: string;
  apiVersion?: string;
  environment: string;
  settings?: { [key: string]: string };
  supportedPaymentMethods: PaymentMethod[];
  maxAmount?: number;
  minAmount?: number;
  timeoutSeconds: number;
  maxRetries: number;
  supportsWebhooks: boolean;
  supportsRefunds: boolean;
  supportsInstallments: boolean;
  feePercentage?: number;
  fixedFee?: number;
  createdAt: Date;
  updatedAt: Date;
  lastTestedAt?: Date;
  healthStatus?: string;
}

export interface PaymentStatusResponse {
  transactionId: string;
  providerTransactionId?: string;
  status: PaymentStatus;
  statusMessage?: string;
  amount: number;
  processedAmount?: number;
  currency: string;
  fees?: number;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  expiresAt?: Date;
  providerData?: { [key: string]: any };
  metadata?: { [key: string]: string };
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
  refundReference?: string;
  notifyCustomer?: boolean;
}

export interface RefundResult {
  success: boolean;
  originalTransactionId: string;
  refundTransactionId?: string;
  providerRefundId?: string;
  refundedAmount?: number;
  currency?: string;
  statusMessage?: string;
  processedAt?: Date;
  expectedRefundDate?: Date;
  providerResponse?: { [key: string]: any };
  errors?: PaymentError[];
  metadata?: { [key: string]: string };
}

export interface CancelResult {
  success: boolean;
  transactionId: string;
  statusMessage?: string;
  cancelledAt?: Date;
  errors?: PaymentError[];
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone?: string;
  documentNumber?: string;
  documentType?: string;
  dateOfBirth?: string;
  customerType?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface BillingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentOptions {
  installments?: number;
  installmentInterval?: number;
  autoCapture?: boolean;
  saveCard?: boolean;
  threeDSecure?: boolean;
}

export interface CallbackUrls {
  success?: string;
  failure?: string;
  pending?: string;
  webhook?: string;
}

export interface PaymentReceipt {
  receiptId: string;
  receiptUrl?: string;
  receiptData?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  field?: string;
  type?: string;
}

export interface PaymentStatistics {
  transactionStatistics: any[];
  providerStatistics: any[];
  paymentMethodStatistics: any[];
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BOLETO = 'BOLETO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CASH = 'CASH',
  CHECK = 'CHECK',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  BNPL = 'BNPL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {
  private apiUrl = `${environment.apiUrl}/payment-gateway`;
  
  // Subjects for real-time updates
  private transactionUpdatesSubject = new BehaviorSubject<PaymentTransaction | null>(null);
  public transactionUpdates$ = this.transactionUpdatesSubject.asObservable();
  
  private paymentStatusSubject = new BehaviorSubject<PaymentStatusResponse | null>(null);
  public paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Process a payment
   */
  processPayment(request: PaymentRequest): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(`${this.apiUrl}/payments`, request)
      .pipe(
        map(result => {
          // Convert date strings to Date objects
          if (result.processedAt) result.processedAt = new Date(result.processedAt);
          if (result.expiresAt) result.expiresAt = new Date(result.expiresAt);
          return result;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Process an installment payment
   */
  processInstallmentPayment(parcelaId: number): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(`${this.apiUrl}/payments/installments/${parcelaId}`, {})
      .pipe(
        map(result => {
          if (result.processedAt) result.processedAt = new Date(result.processedAt);
          if (result.expiresAt) result.expiresAt = new Date(result.expiresAt);
          return result;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Query payment status
   */
  queryPaymentStatus(transactionId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.apiUrl}/payments/${transactionId}/status`)
      .pipe(
        map(response => {
          // Convert date strings to Date objects
          response.createdAt = new Date(response.createdAt);
          response.updatedAt = new Date(response.updatedAt);
          if (response.processedAt) response.processedAt = new Date(response.processedAt);
          if (response.expiresAt) response.expiresAt = new Date(response.expiresAt);
          
          // Update subject for real-time updates
          this.paymentStatusSubject.next(response);
          
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Process a refund
   */
  processRefund(transactionId: string, refundRequest: RefundRequest): Observable<RefundResult> {
    return this.http.post<RefundResult>(`${this.apiUrl}/payments/${transactionId}/refund`, refundRequest)
      .pipe(
        map(result => {
          if (result.processedAt) result.processedAt = new Date(result.processedAt);
          if (result.expectedRefundDate) result.expectedRefundDate = new Date(result.expectedRefundDate);
          return result;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Cancel a payment
   */
  cancelPayment(transactionId: string): Observable<CancelResult> {
    return this.http.post<CancelResult>(`${this.apiUrl}/payments/${transactionId}/cancel`, {})
      .pipe(
        map(result => {
          if (result.cancelledAt) result.cancelledAt = new Date(result.cancelledAt);
          return result;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get available payment methods for an amount
   */
  getAvailablePaymentMethods(amount?: number): Observable<PaymentMethod[]> {
    let params = new HttpParams();
    if (amount !== undefined) {
      params = params.set('amount', amount.toString());
    }
    
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payment-methods`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get payment providers for a payment method
   */
  getProvidersForPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentProvider[]> {
    const params = new HttpParams().set('paymentMethod', paymentMethod);
    
    return this.http.get<PaymentProvider[]>(`${this.apiUrl}/providers`, { params })
      .pipe(
        map(providers => providers.map(provider => {
          provider.createdAt = new Date(provider.createdAt);
          provider.updatedAt = new Date(provider.updatedAt);
          if (provider.lastTestedAt) provider.lastTestedAt = new Date(provider.lastTestedAt);
          return provider;
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Get payment transaction by ID
   */
  getTransaction(transactionId: string): Observable<PaymentTransaction> {
    return this.http.get<PaymentTransaction>(`${this.apiUrl}/transactions/${transactionId}`)
      .pipe(
        map(transaction => {
          transaction.createdAt = new Date(transaction.createdAt);
          transaction.updatedAt = new Date(transaction.updatedAt);
          if (transaction.processedAt) transaction.processedAt = new Date(transaction.processedAt);
          if (transaction.expiresAt) transaction.expiresAt = new Date(transaction.expiresAt);
          
          // Update subject for real-time updates
          this.transactionUpdatesSubject.next(transaction);
          
          return transaction;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get payment transactions with pagination and filtering
   */
  getTransactions(page: number = 0, size: number = 20, filters?: {
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    providerId?: string;
  }): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.paymentMethod) params = params.set('paymentMethod', filters.paymentMethod);
      if (filters.providerId) params = params.set('providerId', filters.providerId);
    }
    
    return this.http.get<any>(`${this.apiUrl}/transactions`, { params })
      .pipe(
        map(response => {
          // Convert date strings to Date objects for each transaction
          response.content = response.content.map((transaction: PaymentTransaction) => {
            transaction.createdAt = new Date(transaction.createdAt);
            transaction.updatedAt = new Date(transaction.updatedAt);
            if (transaction.processedAt) transaction.processedAt = new Date(transaction.processedAt);
            if (transaction.expiresAt) transaction.expiresAt = new Date(transaction.expiresAt);
            return transaction;
          });
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get payment statistics
   */
  getPaymentStatistics(startDate?: Date, endDate?: Date): Observable<PaymentStatistics> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    
    return this.http.get<PaymentStatistics>(`${this.apiUrl}/statistics`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get health status
   */
  getHealthStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Utility methods
   */

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplayName(method: PaymentMethod): string {
    const displayNames: { [key in PaymentMethod]: string } = {
      [PaymentMethod.PIX]: 'PIX',
      [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
      [PaymentMethod.BOLETO]: 'Boleto Bancário',
      [PaymentMethod.BANK_TRANSFER]: 'Transferência Bancária',
      [PaymentMethod.DIGITAL_WALLET]: 'Carteira Digital',
      [PaymentMethod.CASH]: 'Dinheiro',
      [PaymentMethod.CHECK]: 'Cheque',
      [PaymentMethod.CRYPTOCURRENCY]: 'Criptomoeda',
      [PaymentMethod.BNPL]: 'Compre Agora Pague Depois'
    };
    return displayNames[method] || method;
  }

  /**
   * Get payment status display name
   */
  getPaymentStatusDisplayName(status: PaymentStatus): string {
    const displayNames: { [key in PaymentStatus]: string } = {
      [PaymentStatus.PENDING]: 'Pendente',
      [PaymentStatus.PROCESSING]: 'Processando',
      [PaymentStatus.COMPLETED]: 'Concluído',
      [PaymentStatus.FAILED]: 'Falhou',
      [PaymentStatus.CANCELLED]: 'Cancelado',
      [PaymentStatus.REFUNDED]: 'Reembolsado',
      [PaymentStatus.EXPIRED]: 'Expirado',
      [PaymentStatus.REQUIRES_ACTION]: 'Requer Ação',
      [PaymentStatus.UNDER_REVIEW]: 'Em Análise'
    };
    return displayNames[status] || status;
  }

  /**
   * Get payment status color class
   */
  getPaymentStatusColorClass(status: PaymentStatus): string {
    const colorClasses: { [key in PaymentStatus]: string } = {
      [PaymentStatus.PENDING]: 'text-yellow-600',
      [PaymentStatus.PROCESSING]: 'text-blue-600',
      [PaymentStatus.COMPLETED]: 'text-green-600',
      [PaymentStatus.FAILED]: 'text-red-600',
      [PaymentStatus.CANCELLED]: 'text-gray-600',
      [PaymentStatus.REFUNDED]: 'text-purple-600',
      [PaymentStatus.EXPIRED]: 'text-red-400',
      [PaymentStatus.REQUIRES_ACTION]: 'text-orange-600',
      [PaymentStatus.UNDER_REVIEW]: 'text-indigo-600'
    };
    return colorClasses[status] || 'text-gray-600';
  }

  /**
   * Check if payment status is final
   */
  isPaymentStatusFinal(status: PaymentStatus): boolean {
    return [
      PaymentStatus.COMPLETED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELLED,
      PaymentStatus.REFUNDED,
      PaymentStatus.EXPIRED
    ].includes(status);
  }

  /**
   * Check if payment is successful
   */
  isPaymentSuccessful(status: PaymentStatus): boolean {
    return status === PaymentStatus.COMPLETED;
  }

  /**
   * Generate unique request ID
   */
  generateRequestId(): string {
    return 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Error handling
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Payment Gateway Service Error:', error);
    throw error;
  };
}

