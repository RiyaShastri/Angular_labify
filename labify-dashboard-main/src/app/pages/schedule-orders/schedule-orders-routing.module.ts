import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleOrdersComponent } from './schedule-orders.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleOrdersComponent,
    children: [
      { path: '', component: AllOrdersComponent },
      { path: 'update-order/:id', component: UpdateOrderComponent },
      { path: 'order-status/:id', component: OrderStatusComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleOrdersRoutingModule {}
