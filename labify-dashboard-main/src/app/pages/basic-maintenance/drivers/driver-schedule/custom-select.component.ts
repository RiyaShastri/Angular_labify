import { Component, Input } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'custom-input-renderer',
  template: `<input
      *ngIf="!cell.isEditable()"
      class="form-control"
      [(ngModel)]="cell.newValue"
      [disabled]="true"
      [type]="'text'"
      [placeholder]="cell.getTitle()"
    />

    <nb-select
      placeholder="Day"
      [(ngModel)]="cell.newValue"
      *ngIf="cell.isEditable()"
    >
      <nb-option value="Monday">Monday</nb-option>
      <nb-option value="Tuesday">Tuesday</nb-option>
      <nb-option value="Wednesday">Wednesday</nb-option>
      <nb-option value="Thursday">Thursday</nb-option>
      <nb-option value="Friday">Friday</nb-option>
      <nb-option value="Saturday">Saturday</nb-option>
      <nb-option value="Sunday">Sunday</nb-option>
    </nb-select> `,
})
export class CustomSelectComponent {
  editor = new DefaultEditor();
  cell = this.editor.cell;
}
