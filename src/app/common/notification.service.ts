import { Injectable, TemplateRef } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  toasts: any[] = [];

  showSuccess(message: string, title: string) {
    this.messageService.add({ severity: 'success',detail: message });
  }

  showError(message: string, title: string) {
    this.messageService.add({ severity: 'error', detail: message });
  }

  showInfo(message: string, title: string) {
    this.messageService.add({ severity: 'info', detail: message });
  }

  showWarning(message: string, title:string) {
    this.messageService.add({ severity: 'warn', detail: message });
  }
  showStickyError(message: string, title=null) {
    this.messageService.add({ severity: 'warn', detail: message, sticky: false });
  }
  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  addMultiple() {
    this.messageService.addAll([{ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' },
    { severity: 'info', summary: 'Info Message', detail: 'Via MessageService' }]);
  }

  clear() {
    this.messageService.clear();
  }

  
}
