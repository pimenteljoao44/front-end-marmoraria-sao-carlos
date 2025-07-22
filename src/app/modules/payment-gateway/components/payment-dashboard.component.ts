import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  PaymentGatewayService, 
  PaymentTransaction, 
  PaymentStatus, 
  PaymentMethod,
  PaymentStatistics
} from '../../../services/payment-gateway.service';

interface DashboardStats {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  successfulAmount: number;
  failedTransactions: number;
  pendingTransactions: number;
  refundedAmount: number;
  averageTransactionValue: number;
  successRate: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-payment-dashboard',
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.scss']
})
export class PaymentDashboardComponent implements OnInit, OnDestroy {
  
  // Dashboard data
  stats: DashboardStats = {
    totalTransactions: 0,
    totalAmount: 0,
    successfulTransactions: 0,
    successfulAmount: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
    refundedAmount: 0,
    averageTransactionValue: 0,
    successRate: 0
  };

  recentTransactions: PaymentTransaction[] = [];
  paymentStatistics: PaymentStatistics | null = null;
  
  // Chart data
  statusChartData: ChartData = { labels: [], datasets: [] };
  methodChartData: ChartData = { labels: [], datasets: [] };
  timelineChartData: ChartData = { labels: [], datasets: [] };
  
  // Loading states
  loading: boolean = false;
  error: string | null = null;
  
  // Date filters
  dateRange: { start: Date; end: Date } = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  };

  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  doughnutOptions = {
    ...this.chartOptions,
    cutout: '60%'
  };

  private destroy$ = new Subject<void>();

  constructor(private paymentGatewayService: PaymentGatewayService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      transactions: this.paymentGatewayService.getTransactions(0, 100),
      statistics: this.paymentGatewayService.getPaymentStatistics(this.dateRange.start, this.dateRange.end),
      healthStatus: this.paymentGatewayService.getHealthStatus()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.processTransactionData(data.transactions.content || []);
        this.paymentStatistics = data.statistics;
        this.processStatistics(data.statistics);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar dados do dashboard';
        this.loading = false;
        console.error('Dashboard loading error:', error);
      }
    });
  }

  private processTransactionData(transactions: PaymentTransaction[]): void {
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= this.dateRange.start && transactionDate <= this.dateRange.end;
    });

    // Calculate basic stats
    this.stats.totalTransactions = filteredTransactions.length;
    this.stats.totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    this.stats.successfulTransactions = filteredTransactions.filter(t => t.status === PaymentStatus.COMPLETED).length;
    this.stats.successfulAmount = filteredTransactions
      .filter(t => t.status === PaymentStatus.COMPLETED)
      .reduce((sum, t) => sum + (t.processedAmount || t.amount), 0);
    
    this.stats.failedTransactions = filteredTransactions.filter(t => t.status === PaymentStatus.FAILED).length;
    this.stats.pendingTransactions = filteredTransactions.filter(t => 
      t.status === PaymentStatus.PENDING || t.status === PaymentStatus.PROCESSING
    ).length;
    
    this.stats.refundedAmount = filteredTransactions
      .filter(t => t.status === PaymentStatus.REFUNDED)
      .reduce((sum, t) => sum + (t.processedAmount || t.amount), 0);
    
    this.stats.averageTransactionValue = this.stats.totalTransactions > 0 
      ? this.stats.totalAmount / this.stats.totalTransactions 
      : 0;
    
    this.stats.successRate = this.stats.totalTransactions > 0 
      ? (this.stats.successfulTransactions / this.stats.totalTransactions) * 100 
      : 0;

    // Get recent transactions (last 10)
    this.recentTransactions = filteredTransactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Prepare chart data
    this.prepareChartData(filteredTransactions);
  }

  private processStatistics(statistics: PaymentStatistics): void {
    // Process additional statistics from the backend
    if (statistics.transactionStatistics) {
      // Additional processing can be done here
    }
  }

  private prepareChartData(transactions: PaymentTransaction[]): void {
    // Status distribution chart
    const statusCounts = this.groupBy(transactions, 'status');
    this.statusChartData = {
      labels: Object.keys(statusCounts).map(status => this.getStatusDisplayName(status as PaymentStatus)),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          '#28a745', // COMPLETED - green
          '#ffc107', // PENDING - yellow
          '#17a2b8', // PROCESSING - blue
          '#dc3545', // FAILED - red
          '#6c757d', // CANCELLED - gray
          '#6f42c1', // REFUNDED - purple
          '#fd7e14', // EXPIRED - orange
          '#e83e8c', // REQUIRES_ACTION - pink
          '#20c997'  // UNDER_REVIEW - teal
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };

    // Payment method distribution chart
    const methodCounts = this.groupBy(transactions, 'paymentMethod');
    this.methodChartData = {
      labels: Object.keys(methodCounts).map(method => this.getMethodDisplayName(method as PaymentMethod)),
      datasets: [{
        data: Object.values(methodCounts),
        backgroundColor: [
          '#007bff', // PIX - blue
          '#28a745', // CREDIT_CARD - green
          '#17a2b8', // DEBIT_CARD - cyan
          '#ffc107', // BOLETO - yellow
          '#6f42c1', // BANK_TRANSFER - purple
          '#e83e8c', // DIGITAL_WALLET - pink
          '#fd7e14', // CASH - orange
          '#20c997', // CHECK - teal
          '#6c757d'  // Others - gray
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };

    // Timeline chart (transactions per day)
    this.prepareTimelineChart(transactions);
  }

  private prepareTimelineChart(transactions: PaymentTransaction[]): void {
    const dailyData = new Map<string, { successful: number; failed: number; total: number }>();
    
    // Initialize with zeros for the date range
    const currentDate = new Date(this.dateRange.start);
    while (currentDate <= this.dateRange.end) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyData.set(dateKey, { successful: 0, failed: 0, total: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count transactions per day
    transactions.forEach(transaction => {
      const dateKey = new Date(transaction.createdAt).toISOString().split('T')[0];
      const dayData = dailyData.get(dateKey) || { successful: 0, failed: 0, total: 0 };
      
      dayData.total++;
      if (transaction.status === PaymentStatus.COMPLETED) {
        dayData.successful++;
      } else if (transaction.status === PaymentStatus.FAILED) {
        dayData.failed++;
      }
      
      dailyData.set(dateKey, dayData);
    });

    const sortedDates = Array.from(dailyData.keys()).sort();
    
    this.timelineChartData = {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString('pt-BR')),
      datasets: [
        {
          label: 'Transações Bem-sucedidas',
          data: sortedDates.map(date => dailyData.get(date)?.successful || 0),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Transações Falhadas',
          data: sortedDates.map(date => dailyData.get(date)?.failed || 0),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Total de Transações',
          data: sortedDates.map(date => dailyData.get(date)?.total || 0),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: false,
          tension: 0.4
        }
      ]
    };
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const group = item[key] || 'Unknown';
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  // Date range methods
  setDateRange(days: number): void {
    this.dateRange.end = new Date();
    this.dateRange.start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    this.loadDashboardData();
  }

  onDateRangeChange(): void {
    this.loadDashboardData();
  }

  // Utility methods
  getStatusDisplayName(status: PaymentStatus): string {
    return this.paymentGatewayService.getPaymentStatusDisplayName(status);
  }

  getMethodDisplayName(method: PaymentMethod): string {
    return this.paymentGatewayService.getPaymentMethodDisplayName(method);
  }

  getStatusColorClass(status: PaymentStatus): string {
    return this.paymentGatewayService.getPaymentStatusColorClass(status);
  }

  formatCurrency(amount: number): string {
    return this.paymentGatewayService.formatCurrency(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Export methods
  exportData(): void {
    // Implementation for exporting dashboard data
    const data = {
      stats: this.stats,
      dateRange: this.dateRange,
      recentTransactions: this.recentTransactions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Refresh methods
  refreshData(): void {
    this.loadDashboardData();
  }

  // Navigation methods
  viewAllTransactions(): void {
    // Navigate to transactions list
    console.log('Navigate to transactions list');
  }

  viewTransaction(transactionId: string): void {
    // Navigate to transaction details
    console.log('Navigate to transaction:', transactionId);
  }

  // Status badge methods
  getStatusBadgeClass(status: PaymentStatus): string {
    const baseClass = 'badge badge-';
    switch (status) {
      case PaymentStatus.COMPLETED: return baseClass + 'success';
      case PaymentStatus.PENDING: return baseClass + 'warning';
      case PaymentStatus.PROCESSING: return baseClass + 'info';
      case PaymentStatus.FAILED: return baseClass + 'danger';
      case PaymentStatus.CANCELLED: return baseClass + 'secondary';
      case PaymentStatus.REFUNDED: return baseClass + 'purple';
      case PaymentStatus.EXPIRED: return baseClass + 'dark';
      case PaymentStatus.REQUIRES_ACTION: return baseClass + 'warning';
      case PaymentStatus.UNDER_REVIEW: return baseClass + 'info';
      default: return baseClass + 'secondary';
    }
  }

  // Health status methods
  getHealthStatusClass(): string {
    // This would be based on the health status from the API
    return 'text-success'; // Assuming healthy for now
  }

  getHealthStatusText(): string {
    return 'Sistema Operacional';
  }
}

