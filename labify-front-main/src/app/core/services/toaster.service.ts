import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasts: any[] = [];

  private show(text: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ text, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  showSuccess(text: string) {
    this.show(text, {
      classname:
        'bg-success-subtle rounded-0 border-0 text-success fw-semibold',
      delay: 3000,
    });
  }

  showDanger(text: string) {
    this.show(text, {
      classname: 'bg-danger-subtle rounded-0 border-0 text-danger fw-semibold',
      delay: 3000,
    });
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
