import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './dispatch.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackOrdersComponent } from './pages/track-orders-deleted/track-orders.component';
import { TrackDriversComponent } from './pages/track-drivers/track-drivers.component';
import { NbAccordionModule, NbLayoutModule } from '@nebular/theme';
import { TrackDriversMapComponent } from './pages/track-drivers/track-drivers-map/track-drivers-map.component';
import { TrackDriversDetailsComponent } from './pages/track-drivers/track-drivers-details/track-drivers-details.component';
import { AssignOrdersComponent } from './pages/assign-orders/assign-orders.component';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';

@NgModule({
  declarations: [
    DispatchComponent,
    TrackOrdersComponent,
    TrackDriversComponent,
    TrackDriversMapComponent,
    TrackDriversDetailsComponent,
    AssignOrdersComponent,
    AllOrdersComponent,
  ],
  imports: [CommonModule, DispatchRoutingModule, SharedModule, NbLayoutModule, NbAccordionModule],
})
export class DispatchModule {}
