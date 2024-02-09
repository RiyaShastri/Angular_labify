import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';
import { InfoComponent } from './pages/info/info.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    InfoComponent,
    OrdersComponent,
    AddressesComponent,
    DeliveriesComponent,
  ],
  imports: [CommonModule, ProfilePageRoutingModule, SharedModule],
})
export class ProfilePageModule {}
