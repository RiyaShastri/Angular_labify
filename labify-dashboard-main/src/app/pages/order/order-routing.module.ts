import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { PlaceOnDemandOrderComponent } from '../place-on-demand-order/place-on-demand-order.component';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { ViewOrderComponent } from './view-order/view-order.component';
const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      { path: '', component: AllOrdersComponent },
      {
        path: 'update-order/:id',
        data: { permission: 'Assign Drivers' },
        canActivate: [PermissionGuard],
        component: UpdateOrderComponent,
      },
      {
        path: 'view-order/:id',
        component: ViewOrderComponent,
      },
      { path: 'order-status/:id', component: OrderStatusComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
