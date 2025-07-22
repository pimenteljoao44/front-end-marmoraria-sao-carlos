import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { 
  PaymentGatewayService, 
  PaymentMethod, 
  PaymentStatus, 
  PaymentRequest, 
  PaymentResult,
  PaymentTransaction,
  PaymentProvider,
  RefundRequest,
  RefundResult
} from './payment-gateway.service';
import { environment } from '../../environments/environment';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/payment-gateway`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentGatewayService]
    });
    service = TestBed.inject(PaymentGatewayService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('processPayment', () => {
    it('should process payment successfully', () => {
      const paymentRequest: PaymentRequest = {
        requestId: 'REQ_123',
        amount: 100.00,
        currency: 'BRL',
        paymentMethod: PaymentMethod.PIX,
        description: 'Test payment',
        customer: {
          name: 'Test Customer',
          email: 'test@example.com'
        }
      };

      const expectedResult: PaymentResult = {
        success: true,
        status: PaymentStatus.COMPLETED,
        transactionId: 'TXN_123',
        requestedAmount: 100.00,
        processedAmount: 100.00,
        currency: 'BRL',
        processedAt: new Date(),
        statusMessage: 'Payment completed successfully'
      };

      service.processPayment(paymentRequest).subscribe(result => {
        expect(result).toEqual(expectedResult);
        expect(result.processedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/payments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(paymentRequest);
      req.flush(expectedResult);
    });

    it('should handle payment processing error', () => {
      const paymentRequest: PaymentRequest = {
        requestId: 'REQ_123',
        amount: 100.00,
        currency: 'BRL',
        paymentMethod: PaymentMethod.PIX,
        description: 'Test payment'
      };

      service.processPayment(paymentRequest).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/payments`);
      req.flush({ message: 'Payment failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('processInstallmentPayment', () => {
    it('should process installment payment', () => {
      const parcelaId = 123;
      const expectedResult: PaymentResult = {
        success: true,
        status: PaymentStatus.COMPLETED,
        transactionId: 'TXN_INSTALLMENT_123',
        requestedAmount: 250.00,
        processedAmount: 250.00,
        currency: 'BRL'
      };

      service.processInstallmentPayment(parcelaId).subscribe(result => {
        expect(result).toEqual(expectedResult);
      });

      const req = httpMock.expectOne(`${apiUrl}/payments/installments/${parcelaId}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });

  describe('queryPaymentStatus', () => {
    it('should query payment status', () => {
      const transactionId = 'TXN_123';
      const expectedResponse = {
        transactionId: transactionId,
        status: PaymentStatus.COMPLETED,
        amount: 100.00,
        currency: 'BRL',
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T10:05:00Z',
        processedAt: '2023-01-01T10:05:00Z'
      };

      service.queryPaymentStatus(transactionId).subscribe(response => {
        expect(response.transactionId).toBe(transactionId);
        expect(response.status).toBe(PaymentStatus.COMPLETED);
        expect(response.createdAt).toBeInstanceOf(Date);
        expect(response.updatedAt).toBeInstanceOf(Date);
        expect(response.processedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/payments/${transactionId}/status`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
    });
  });

  describe('processRefund', () => {
    it('should process refund successfully', () => {
      const transactionId = 'TXN_123';
      const refundRequest: RefundRequest = {
        transactionId: transactionId,
        amount: 50.00,
        reason: 'Customer request'
      };

      const expectedResult: RefundResult = {
        success: true,
        originalTransactionId: transactionId,
        refundTransactionId: 'REFUND_123',
        refundedAmount: 50.00,
        currency: 'BRL',
        processedAt: new Date()
      };

      service.processRefund(transactionId, refundRequest).subscribe(result => {
        expect(result).toEqual(expectedResult);
        expect(result.processedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/payments/${transactionId}/refund`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(refundRequest);
      req.flush(expectedResult);
    });
  });

  describe('cancelPayment', () => {
    it('should cancel payment successfully', () => {
      const transactionId = 'TXN_123';
      const expectedResult = {
        success: true,
        transactionId: transactionId,
        statusMessage: 'Payment cancelled successfully',
        cancelledAt: new Date().toISOString()
      };

      service.cancelPayment(transactionId).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.transactionId).toBe(transactionId);
        expect(result.cancelledAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/payments/${transactionId}/cancel`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });

  describe('getAvailablePaymentMethods', () => {
    it('should get available payment methods', () => {
      const amount = 100.00;
      const expectedMethods = [PaymentMethod.PIX, PaymentMethod.CREDIT_CARD, PaymentMethod.BOLETO];

      service.getAvailablePaymentMethods(amount).subscribe(methods => {
        expect(methods).toEqual(expectedMethods);
      });

      const req = httpMock.expectOne(`${apiUrl}/payment-methods?amount=${amount}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedMethods);
    });

    it('should get available payment methods without amount', () => {
      const expectedMethods = [PaymentMethod.PIX, PaymentMethod.CREDIT_CARD];

      service.getAvailablePaymentMethods().subscribe(methods => {
        expect(methods).toEqual(expectedMethods);
      });

      const req = httpMock.expectOne(`${apiUrl}/payment-methods`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedMethods);
    });
  });

  describe('getProvidersForPaymentMethod', () => {
    it('should get providers for payment method', () => {
      const paymentMethod = PaymentMethod.PIX;
      const expectedProviders: PaymentProvider[] = [{
        id: 1,
        providerId: 'pix-provider',
        providerName: 'PIX Provider',
        enabled: true,
        priority: 1,
        supportedPaymentMethods: [PaymentMethod.PIX],
        timeoutSeconds: 30,
        maxRetries: 3,
        supportsWebhooks: true,
        supportsRefunds: true,
        supportsInstallments: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        environment: 'production'
      }];

      service.getProvidersForPaymentMethod(paymentMethod).subscribe(providers => {
        expect(providers).toEqual(expectedProviders);
        expect(providers[0].createdAt).toBeInstanceOf(Date);
        expect(providers[0].updatedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/providers?paymentMethod=${paymentMethod}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProviders);
    });
  });

  describe('getTransaction', () => {
    it('should get transaction by ID', () => {
      const transactionId = 'TXN_123';
      const expectedTransaction: PaymentTransaction = {
        id: 1,
        transactionId: transactionId,
        providerId: 'test-provider',
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.COMPLETED,
        amount: 100.00,
        currency: 'BRL',
        description: 'Test transaction',
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        processedAt: new Date()
      };

      service.getTransaction(transactionId).subscribe(transaction => {
        expect(transaction).toEqual(expectedTransaction);
        expect(transaction.createdAt).toBeInstanceOf(Date);
        expect(transaction.updatedAt).toBeInstanceOf(Date);
        expect(transaction.processedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/transactions/${transactionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedTransaction);
    });
  });

  describe('getTransactions', () => {
    it('should get transactions with pagination', () => {
      const page = 0;
      const size = 10;
      const expectedResponse = {
        content: [
          {
            id: 1,
            transactionId: 'TXN_123',
            status: PaymentStatus.COMPLETED,
            amount: 100.00,
            createdAt: '2023-01-01T10:00:00Z',
            updatedAt: '2023-01-01T10:05:00Z'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      service.getTransactions(page, size).subscribe(response => {
        expect(response.content.length).toBe(1);
        expect(response.content[0].createdAt).toBeInstanceOf(Date);
        expect(response.content[0].updatedAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/transactions?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
    });

    it('should get transactions with filters', () => {
      const filters = {
        status: PaymentStatus.COMPLETED,
        paymentMethod: PaymentMethod.PIX,
        providerId: 'test-provider'
      };

      service.getTransactions(0, 10, filters).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(
        `${apiUrl}/transactions?page=0&size=10&status=${filters.status}&paymentMethod=${filters.paymentMethod}&providerId=${filters.providerId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush({ content: [], totalElements: 0 });
    });
  });

  describe('getPaymentStatistics', () => {
    it('should get payment statistics', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const expectedStats = {
        transactionStatistics: [],
        providerStatistics: [],
        paymentMethodStatistics: []
      };

      service.getPaymentStatistics(startDate, endDate).subscribe(stats => {
        expect(stats).toEqual(expectedStats);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/statistics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(expectedStats);
    });
  });

  describe('getHealthStatus', () => {
    it('should get health status', () => {
      const expectedHealth = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        providers: []
      };

      service.getHealthStatus().subscribe(health => {
        expect(health).toEqual(expectedHealth);
      });

      const req = httpMock.expectOne(`${apiUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedHealth);
    });
  });

  describe('utility methods', () => {
    it('should get payment method display name', () => {
      expect(service.getPaymentMethodDisplayName(PaymentMethod.PIX)).toBe('PIX');
      expect(service.getPaymentMethodDisplayName(PaymentMethod.CREDIT_CARD)).toBe('Cartão de Crédito');
      expect(service.getPaymentMethodDisplayName(PaymentMethod.BOLETO)).toBe('Boleto Bancário');
    });

    it('should get payment status display name', () => {
      expect(service.getPaymentStatusDisplayName(PaymentStatus.PENDING)).toBe('Pendente');
      expect(service.getPaymentStatusDisplayName(PaymentStatus.COMPLETED)).toBe('Concluído');
      expect(service.getPaymentStatusDisplayName(PaymentStatus.FAILED)).toBe('Falhou');
    });

    it('should get payment status color class', () => {
      expect(service.getPaymentStatusColorClass(PaymentStatus.PENDING)).toBe('text-yellow-600');
      expect(service.getPaymentStatusColorClass(PaymentStatus.COMPLETED)).toBe('text-green-600');
      expect(service.getPaymentStatusColorClass(PaymentStatus.FAILED)).toBe('text-red-600');
    });

    it('should check if payment status is final', () => {
      expect(service.isPaymentStatusFinal(PaymentStatus.COMPLETED)).toBe(true);
      expect(service.isPaymentStatusFinal(PaymentStatus.FAILED)).toBe(true);
      expect(service.isPaymentStatusFinal(PaymentStatus.CANCELLED)).toBe(true);
      expect(service.isPaymentStatusFinal(PaymentStatus.PENDING)).toBe(false);
      expect(service.isPaymentStatusFinal(PaymentStatus.PROCESSING)).toBe(false);
    });

    it('should check if payment is successful', () => {
      expect(service.isPaymentSuccessful(PaymentStatus.COMPLETED)).toBe(true);
      expect(service.isPaymentSuccessful(PaymentStatus.FAILED)).toBe(false);
      expect(service.isPaymentSuccessful(PaymentStatus.PENDING)).toBe(false);
    });

    it('should generate unique request ID', () => {
      const requestId1 = service.generateRequestId();
      const requestId2 = service.generateRequestId();
      
      expect(requestId1).toMatch(/^REQ_\d+_[a-z0-9]{8}$/);
      expect(requestId2).toMatch(/^REQ_\d+_[a-z0-9]{8}$/);
      expect(requestId1).not.toBe(requestId2);
    });

    it('should format currency', () => {
      expect(service.formatCurrency(100.50)).toBe('R$ 100,50');
      expect(service.formatCurrency(1000.00)).toBe('R$ 1.000,00');
      expect(service.formatCurrency(100.50, 'USD')).toBe('US$ 100,50');
    });
  });

  describe('observables', () => {
    it('should emit transaction updates', () => {
      const mockTransaction: PaymentTransaction = {
        id: 1,
        transactionId: 'TXN_123',
        providerId: 'test-provider',
        paymentMethod: PaymentMethod.PIX,
        status: PaymentStatus.COMPLETED,
        amount: 100.00,
        currency: 'BRL',
        description: 'Test transaction',
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let receivedTransaction: PaymentTransaction | null = null;
      service.transactionUpdates$.subscribe(transaction => {
        receivedTransaction = transaction;
      });

      service.getTransaction('TXN_123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/transactions/TXN_123`);
      req.flush(mockTransaction);

      expect(receivedTransaction).toEqual(mockTransaction);
    });

    it('should emit payment status updates', () => {
      const mockStatus = {
        transactionId: 'TXN_123',
        status: PaymentStatus.COMPLETED,
        amount: 100.00,
        currency: 'BRL',
        createdAt: '2023-01-01T10:00:00Z',
        updatedAt: '2023-01-01T10:05:00Z'
      };

      let receivedStatus: any = null;
      service.paymentStatus$.subscribe(status => {
        receivedStatus = status;
      });

      service.queryPaymentStatus('TXN_123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/payments/TXN_123/status`);
      req.flush(mockStatus);

      expect(receivedStatus?.transactionId).toBe('TXN_123');
      expect(receivedStatus?.status).toBe(PaymentStatus.COMPLETED);
    });
  });
});

