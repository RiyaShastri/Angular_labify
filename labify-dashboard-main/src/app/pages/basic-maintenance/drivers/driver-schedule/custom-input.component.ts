import { Component, Input } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'custom-input-renderer',
  template: `<input
    class="form-control"
    [(ngModel)]="cell.newValue"
    [disabled]="!cell.isEditable()"
    [type]="cell.isEditable() ? 'time' : 'text'"
    [placeholder]="cell.getTitle()"
  />`,
})
export class CustomInputComponent {
  @Input() value!: string;
  edito = new DefaultEditor();
  cell = this.edito.cell;
}
