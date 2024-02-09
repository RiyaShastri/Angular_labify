//
//  This component is currently not involved in the application, but it might be in the future.
// 
import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
})
export class StockPageComponent implements OnInit {
  rows = [];
  selected = [];
  stockList!: Stock[];
  closeResult = '';
  selectedItems: any[] = [];
  selectedItemQuantities: number[] = [];
  min = 0;
  currentValue = 1;
  constructor(
    private stockService: StockService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.getStock();
  }
  open(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  onSelect(item: any) {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      // If the item is not in the array, add it
      this.selectedItems.push(item);
      this.selectedItemQuantities.push(1);
    } else {
      // If the item is already in the array, remove it
      this.selectedItems.splice(index, 1);
      this.selectedItemQuantities.splice(index, 1);
    }
    console.log(this.selectedItems);
  }

  onActivate(event: any) {
    console.log('Activate Event', event);
  }
  getStock() {
    this.stockService.getAllStock().subscribe({
      next: (res) => {
        this.stockList = res.data;
        console.log(this.stockList);
      },
      error: (err) => console.log(err),
    });
  }
  incrementQuantity(index: number) {
    if (
      this.selectedItemQuantities[index] < this.selectedItems[index].quantity
    ) {
      this.selectedItemQuantities[index]++;
    }
  }

  decrementQuantity(index: number) {
    if (this.selectedItemQuantities[index] > 1) {
      this.selectedItemQuantities[index]--;
    }
  }

  updateQuantity(item: any, value: number) {
    // Find the index of the item
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItemQuantities[index] = value;
      console.log(this.selectedItemQuantities);
    }
  }
  sendStocks() {
    const itemsToSend = {
      items: this.selectedItems.map((item, index) => ({
        item: item,
        quantity: this.selectedItemQuantities[index] || 1, // Default to 1 if not specified
      })),
    };
    localStorage.setItem('itemsToSend', JSON.stringify(itemsToSend));
    this.router.navigate(['/order', 'stock', 'shipping']);
    this.selectedItems = [];
    this.selectedItemQuantities = [];
    console.log(itemsToSend);
  }
}
