import {Component, TemplateRef} from '@angular/core';
import { NotificationService } from '../common/notification.service';

@Component({
  selector: 'app-toasts',
  template: './toast.component.html',
})
export class ToastComponent {
  constructor(public toastService: NotificationService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}