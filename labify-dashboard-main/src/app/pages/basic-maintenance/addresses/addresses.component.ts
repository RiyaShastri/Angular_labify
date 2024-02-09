import { Component } from '@angular/core';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent {
  currentTab: 'Clints-Addresses' | 'Addresses Points'  = 'Clints-Addresses';
  onTabChange(event: any) {
    this.currentTab = event.tabTitle;
  }
}
