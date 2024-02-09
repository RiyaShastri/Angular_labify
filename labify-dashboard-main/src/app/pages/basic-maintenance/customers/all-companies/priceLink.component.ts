import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-price-link',
  template: `<a [routerLink]="'/basic-maintenance/customers/price/' +type+'/'+id">price details</a>`,
})
export class PriceLinkComponent {
  @Input() rowData: any; // rowData to get the entire row data

  get id(): number {
    return this.rowData.id; // Accessing the id property from the rowData
  }
  get type(): any{
    return this.rowData.type;
  }
}
