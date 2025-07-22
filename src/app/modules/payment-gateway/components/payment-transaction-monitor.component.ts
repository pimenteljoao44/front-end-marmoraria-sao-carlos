import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { 
  PaymentGatewayService, 
  PaymentTransaction, 
  PaymentStatus, 
  PaymentStatusResponse,
  RefundRequest,
  RefundResult,
  CancelResult
} from '../../../services/payment-gateway.service';

@Component({
  selector: 'app-payment-transaction-monitor',
  templateUrl: './payment-transaction-monitor.component.html',
  styleUrls: ['./payment-transaction-monitor.component.scss']
})
export class PaymentTransactionMonitorComponent implements OnInit, OnDestroy {
  @Input() transactionId: string = '';
  @Input() autoRefresh: boolean = true;
  @Input() refreshInterval: number = 5000; // 5 seconds
  @Input() showActions: boolean = true;
  
  @Output() statusChanged = new EventEmitter<PaymentStatusResponse>();
  @Output() transactionCompleted = new EventEmitter<PaymentTransaction>();
  @Output() transactionFailed = new EventEmitter<PaymentTransaction>();

  transaction: PaymentTransaction | null = null;
  statusResponse: PaymentStatusResponse | null = null;
  loading: boolean = false;
  error: string | null = null;
  
  // Action states
  refunding: boolean = false;
  cancelling: boolean = false;
  
  // Refund form
  showRefundForm: boolean = false;
  refundAmount: number | null = null;
  refundReason: string = '';

  private destroy$ = new Subject<void>();
  private refreshSubscription$ = new Subject<void>();

  // Status icons and colors
  statusConfig = {
    [PaymentStatus.PENDING]: { icon: 'fas fa-clock', color: 'text-warning', bgColor: 'bg-warning' },
    [PaymentStatus.PROCESSING]: { icon: 'fas fa-spinner fa-spin', color: 'text-info', bgColor: 'bg-info' },
    [PaymentStatus.COMPLETED]: { icon: 'fas fa-check-circle', color: 'text-success', bgColor: 'bg-success' },
    [PaymentStatus.FAILED]: { icon: 'fas fa-times-circle', color: 'text-danger', bgColor: 'bg-danger' },
    [PaymentStatus.CANCELLED]: { icon: 'fas fa-ban', color: 'text-secondary', bgColor: 'bg-secondary' },
    [PaymentStatus.REFUNDED]: { icon: 'fas fa-undo', color: 'text-purple', bgColor: 'bg-purple' },
    [PaymentStatus.EXPIRED]: { icon: 'fas fa-hourglass-end', color: 'text-muted', bgColor: 'bg-muted' },
    [PaymentStatus.REQUIRES_ACTION]: { icon: 'fas fa-exclamation-triangle', color: 'text-warning', bgColor: 'bg-warning' },
    [PaymentStatus.UNDER_REVIEW]: { icon: 'fas fa-search', color: 'text-info', bgColor: 'bg-info' }
  };

  constructor(private paymentGatewayService: PaymentGatewayService) {}

  ngOnInit(): void {
    if (this.transactionId) {
      this.loadTransaction();
      this.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshSubscription$.next();
    this.refreshSubscription$.complete();
  }

  private loadTransaction(): void {
    this.loading = true;
    this.error = null;

    this.paymentGatewayService.getTransaction(this.transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          this.loading = false;
          this.checkTransactionStatus();
        },
        error: (error) => {
          this.error = 'Erro ao carregar transação';
          this.loading = false;
          console.error('Error loading transaction:', error);
        }
      });
  }

  private checkTransactionStatus(): void {
    if (!this.transactionId) return;

    this.paymentGatewayService.queryPaymentStatus(this.transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (statusResponse) => {
          const previousStatus = this.statusResponse?.status;
          this.statusResponse = statusResponse;
          
          // Emit status change event
          this.statusChanged.emit(statusResponse);
          
          // Check for status changes
          if (previousStatus && previousStatus !== statusResponse.status) {
            this.handleStatusChange(previousStatus, statusResponse.status);
          }
          
          // Stop auto-refresh if transaction is in final state
          if (this.paymentGatewayService.isPaymentStatusFinal(statusResponse.status)) {
            this.stopAutoRefresh();
            
            if (this.paymentGatewayService.isPaymentSuccessful(statusResponse.status)) {
              this.transactionCompleted.emit(this.transaction!);
            } else if (statusResponse.status === PaymentStatus.FAILED) {
              this.transactionFailed.emit(this.transaction!);
            }
          }
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
        }
      });
  }

  private handleStatusChange(previousStatus: PaymentStatus, newStatus: PaymentStatus): void {
    // Update transaction object if available
    if (this.transaction) {
      this.transaction.status = newStatus;
      this.transaction.updatedAt = new Date();
    }

    // Show notifications or perform actions based on status change
    console.log(`Payment status changed from ${previousStatus} to ${newStatus}`);
  }

  private startAutoRefresh(): void {
    if (!this.autoRefresh) return;

    interval(this.refreshInterval)
      .pipe(
        takeUntil(this.refreshSubscription$),
        takeUntil(this.destroy$),
        switchMap(() => this.paymentGatewayService.queryPaymentStatus(this.transactionId)),
        catchError(error => {
          console.error('Auto-refresh error:', error);
          return [];
        })
      )
      .subscribe(statusResponse => {
        if (statusResponse) {
          const previousStatus = this.statusResponse?.status;
          this.statusResponse = statusResponse;
          
          this.statusChanged.emit(statusResponse);
          
          if (previousStatus && previousStatus !== statusResponse.status) {
            this.handleStatusChange(previousStatus, statusResponse.status);
          }
          
          // Stop auto-refresh if transaction is in final state
          if (this.paymentGatewayService.isPaymentStatusFinal(statusResponse.status)) {
            this.stopAutoRefresh();
          }
        }
      });
  }

  private stopAutoRefresh(): void {
    this.refreshSubscription$.next();
  }

  // Action methods
  refreshStatus(): void {
    this.checkTransactionStatus();
  }

  toggleRefundForm(): void {
    this.showRefundForm = !this.showRefundForm;
    if (this.showRefundForm) {
      this.refundAmount = this.statusResponse?.processedAmount || null;
      this.refundReason = '';
    }
  }

  processRefund(): void {
    if (!this.transactionId || this.refunding) return;

    const refundRequest: RefundRequest = {
      transactionId: this.transactionId,
      amount: this.refundAmount || undefined,
      reason: this.refundReason || 'Reembolso solicitado pelo usuário',
      notifyCustomer: true
    };

    this.refunding = true;
    this.error = null;

    this.paymentGatewayService.processRefund(this.transactionId, refundRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: RefundResult) => {
          this.refunding = false;
          this.showRefundForm = false;
          
          if (result.success) {
            // Refresh transaction status
            this.checkTransactionStatus();
          } else {
            this.error = result.statusMessage || 'Erro ao processar reembolso';
          }
        },
        error: (error) => {
          this.refunding = false;
          this.error = 'Erro ao processar reembolso';
          console.error('Refund error:', error);
        }
      });
  }

  cancelPayment(): void {
    if (!this.transactionId || this.cancelling) return;

    this.cancelling = true;
    this.error = null;

    this.paymentGatewayService.cancelPayment(this.transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: CancelResult) => {
          this.cancelling = false;
          
          if (result.success) {
            // Refresh transaction status
            this.checkTransactionStatus();
          } else {
            this.error = result.statusMessage || 'Erro ao cancelar pagamento';
          }
        },
        error: (error) => {
          this.cancelling = false;
          this.error = 'Erro ao cancelar pagamento';
          console.error('Cancel error:', error);
        }
      });
  }

  // Utility methods
  getStatusConfig(status: PaymentStatus) {
    return this.statusConfig[status] || { icon: 'fas fa-question', color: 'text-muted', bgColor: 'bg-muted' };
  }

  getStatusDisplayName(status: PaymentStatus): string {
    return this.paymentGatewayService.getPaymentStatusDisplayName(status);
  }

  getPaymentMethodDisplayName(method: string): string {
    return this.paymentGatewayService.getPaymentMethodDisplayName(method as any);
  }

  formatCurrency(amount: number, currency: string = 'BRL'): string {
    return this.paymentGatewayService.formatCurrency(amount, currency);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  canRefund(): boolean {
    return this.statusResponse?.status === PaymentStatus.COMPLETED && this.showActions;
  }

  canCancel(): boolean {
    return (this.statusResponse?.status === PaymentStatus.PENDING || 
            this.statusResponse?.status === PaymentStatus.PROCESSING ||
            this.statusResponse?.status === PaymentStatus.REQUIRES_ACTION) && this.showActions;
  }

  isTransactionFinal(): boolean {
    return this.statusResponse ? this.paymentGatewayService.isPaymentStatusFinal(this.statusResponse.status) : false;
  }

  isTransactionSuccessful(): boolean {
    return this.statusResponse ? this.paymentGatewayService.isPaymentSuccessful(this.statusResponse.status) : false;
  }

  getProgressPercentage(): number {
    if (!this.statusResponse) return 0;
    
    const statusOrder = [
      PaymentStatus.PENDING,
      PaymentStatus.PROCESSING,
      PaymentStatus.COMPLETED
    ];
    
    const currentIndex = statusOrder.indexOf(this.statusResponse.status);
    if (currentIndex === -1) return 100; // For final states not in the normal flow
    
    return ((currentIndex + 1) / statusOrder.length) * 100;
  }

  getTimeSinceCreation(): string {
    if (!this.statusResponse?.createdAt) return '';
    
    const now = new Date();
    const created = new Date(this.statusResponse.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} dia(s) atrás`;
    if (diffHours > 0) return `${diffHours} hora(s) atrás`;
    if (diffMins > 0) return `${diffMins} minuto(s) atrás`;
    return 'Agora mesmo';
  }

  copyTransactionId(): void {
    if (this.transactionId) {
      navigator.clipboard.writeText(this.transactionId).then(() => {
        // Could show a toast notification here
        console.log('Transaction ID copied to clipboard');
      });
    }
  }
}

