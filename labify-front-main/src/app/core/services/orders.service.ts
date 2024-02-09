import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../models/order.model';
import { OrderDetails } from '../models/order-details.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.apiUrl}/order/get-orders`).pipe(
      map((res) => {
        let orders = res.data;
        orders = orders.map((order: any) => {
          return {
            id: order.id,
            code: order.code,
            grand_total: order.grand_total,
            payment_type: order.payment_type,
            order_status: order.order_status,
            items: order.items.length,
          };
        });
        return orders;
      })
    );
  }
  getAllDeliveries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock/stocks`)

  }

  getOrderDetails(orderId: number): Observable<OrderDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/order/order-details`, {
        params: { order_id: orderId },
      })
      .pipe(map((res) => res.data));
  }
}
