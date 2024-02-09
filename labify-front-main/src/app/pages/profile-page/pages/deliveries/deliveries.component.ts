//  This component is currently not involved in the application, but it might be in the future.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/core/models/order.model';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
})
export class DeliveriesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  orders!: any;
  loading = false;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.loading = true;
    this.ordersService.getAllDeliveries().subscribe({
      next: (res) => {
        this.orders = res.data.data;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
