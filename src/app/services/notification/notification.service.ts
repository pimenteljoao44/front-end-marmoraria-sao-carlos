import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

export interface NotificationAlert {
  id: string;
  type: 'error' | 'warn' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private alertsSubject = new BehaviorSubject<NotificationAlert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  constructor(private messageService: MessageService) {}

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  addAlert(alert: Omit<NotificationAlert, 'id' | 'timestamp' | 'read'>): void {
    const newAlert: NotificationAlert = {
      ...alert,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([newAlert, ...currentAlerts]);

    // Também mostrar como toast
    this.messageService.add({
      severity: alert.type === 'error' ? 'error' :
        alert.type === 'warn' ? 'warn' :
          alert.type === 'success' ? 'success' : 'info',
      summary: alert.title,
      detail: alert.message,
      life: this.getLifeTime(alert.type)
    });
  }

  private getLifeTime(type: string): number {
    switch (type) {
      case 'error': return 8000;
      case 'warn': return 6000;
      case 'success': return 4000;
      default: return 5000;
    }
  }

  markAsRead(alertId: string): void {
    const currentAlerts = this.alertsSubject.value;
    const updatedAlerts = currentAlerts.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    this.alertsSubject.next(updatedAlerts);
  }

  markAllAsRead(): void {
    const currentAlerts = this.alertsSubject.value;
    const updatedAlerts = currentAlerts.map(alert => ({ ...alert, read: true }));
    this.alertsSubject.next(updatedAlerts);
  }

  removeAlert(alertId: string): void {
    const currentAlerts = this.alertsSubject.value;
    const filteredAlerts = currentAlerts.filter(alert => alert.id !== alertId);
    this.alertsSubject.next(filteredAlerts);
  }

  clearAllAlerts(): void {
    this.alertsSubject.next([]);
  }

  getUnreadCount(): number {
    return this.alertsSubject.value.filter(alert => !alert.read).length;
  }

  // Métodos de conveniência para diferentes tipos de alerta
  showError(title: string, message: string, action?: { label: string; callback: () => void }): void {
    this.addAlert({ type: 'error', title, message, action });
  }

  showWarning(title: string, message: string, action?: { label: string; callback: () => void }): void {
    this.addAlert({ type: 'warn', title, message, action });
  }

  showInfo(title: string, message: string, action?: { label: string; callback: () => void }): void {
    this.addAlert({ type: 'info', title, message, action });
  }

  showSuccess(title: string, message: string, action?: { label: string; callback: () => void }): void {
    this.addAlert({ type: 'success', title, message, action });
  }

  // Alertas específicos do sistema
  showStockAlert(produtosSemEstoque: number, produtosEstoqueBaixo: number): void {
    if (produtosSemEstoque > 0) {
      this.showError(
        'Estoque Crítico',
        `${produtosSemEstoque} produto(s) sem estoque`,
        {
          label: 'Gerenciar Estoque',
          callback: () => {
            // Navegar para gestão de estoque
            console.log('Navegando para gestão de estoque');
          }
        }
      );
    }

    if (produtosEstoqueBaixo > 0) {
      this.showWarning(
        'Estoque Baixo',
        `${produtosEstoqueBaixo} produto(s) com estoque baixo`,
        {
          label: 'Ver Produtos',
          callback: () => {
            // Navegar para lista de produtos
            console.log('Navegando para lista de produtos');
          }
        }
      );
    }
  }

  showOrderServiceAlert(osAtrasadas: number): void {
    if (osAtrasadas > 0) {
      this.showError(
        'OS Atrasadas',
        `${osAtrasadas} ordem(ns) de serviço em atraso`,
        {
          label: 'Ver OS',
          callback: () => {
            // Navegar para ordens de serviço
            console.log('Navegando para ordens de serviço');
          }
        }
      );
    }
  }

  showProductivityAlert(osAtivas: number): void {
    if (osAtivas > 20) {
      this.showInfo(
        'Alta Demanda',
        `${osAtivas} ordens de serviço ativas. Considere otimizar recursos.`,
        {
          label: 'Ver Dashboard',
          callback: () => {
            // Ação para otimização
            console.log('Analisando produtividade');
          }
        }
      );
    }
  }
}
