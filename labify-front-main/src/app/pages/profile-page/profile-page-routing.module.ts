import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page.component';
import { InfoComponent } from './pages/info/info.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePageComponent,
    children: [
      {
        path: '',
        component: InfoComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
      // {
      //   path: 'deliveries',
      //   component: DeliveriesComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
