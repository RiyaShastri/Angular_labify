import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderPageComponent } from './order-page.component';
import { CartComponent } from './pages/cart/cart.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';

const routes: Routes = [
  {
    path: '',
    component: OrderPageComponent,
    children: [
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'shipping',
        component: ShippingComponent,
      },
      {
        path: 'stock/shipping',
        component: ShippingComponent,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'stock/payment',
        component: PaymentComponent,
      },
      {
        path: 'order-success/:orderId',
        component: OrderSuccessComponent,
      },
      {
        path: ':orderId',
        component: OrderDetailsComponent,
      },
      {
        path: '',
        redirectTo: 'cart',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPageRoutingModule {}
