import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDetails } from 'src/app/core/models/order-details.model';
import { OrdersService } from 'src/app/core/services/orders.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent {
  subscriptions: Subscription[] = [];
  order!: OrderDetails;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['orderId']) {
        this.getOrderDetails(params['orderId']);
      }
    });
  }

  getOrderDetails(orderId: number) {
    this.loading = true;
    this.subscriptions.push(
      this.ordersService.getOrderDetails(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
