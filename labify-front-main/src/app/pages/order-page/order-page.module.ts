import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderPageRoutingModule } from './order-page-routing.module';
import { OrderPageComponent } from './order-page.component';
import { CartComponent } from './pages/cart/cart.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { QuantityInputComponent } from './pages/cart/quantity-input/quantity-input.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    OrderPageComponent,
    CartComponent,
    ShippingComponent,
    PaymentComponent,
    OrderDetailsComponent,
    OrderSuccessComponent,
    QuantityInputComponent,
  ],
  imports: [CommonModule, OrderPageRoutingModule, SharedModule],
})
export class OrderPageModule {}
