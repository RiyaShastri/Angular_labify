import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/core/models/order.model';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  orders!: Order[];
  loading = false;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.loading = true;
    this.subscriptions.push(
      this.ordersService.getAllOrders().subscribe({
        next: (res) => {
          this.orders = res;
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
