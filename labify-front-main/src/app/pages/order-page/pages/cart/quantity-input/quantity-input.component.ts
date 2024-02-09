import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
})
export class QuantityInputComponent {
  @Input() currentValue = 1;
  @Input() min = 0;
  @Input() max = 100;

  @Output() quantityChange = new EventEmitter<number>();

  private emitValueSubject = new Subject<number>();

  constructor() {
    this.emitValueSubject.pipe(debounceTime(300)).subscribe(value => {
      this.quantityChange.emit(value);
    });
  }

  increment() {
    if (this.currentValue < this.max) {
      this.currentValue++;
      this.emitNewValue();
    }
  }

  decrement() {
    if (this.currentValue > this.min) {
      this.currentValue--;
      this.emitNewValue();
    }
  }

  emitNewValue() {
    this.emitValueSubject.next(this.currentValue);
  }
}
