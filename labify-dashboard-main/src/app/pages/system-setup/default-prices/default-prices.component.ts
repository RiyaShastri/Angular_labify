import { Component } from '@angular/core';

@Component({
  selector: 'app-default-prices',
  templateUrl: './default-prices.component.html',
  styleUrls: ['./default-prices.component.scss'],
})
export class DefaultPricesComponent {
  currentTab: 'City' | 'Mile' | 'Surcharge' | 'default-city-price' = 'City';
  onTabChange(event: any) {
    this.currentTab = event.tabTitle;
  }
}
