import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchComponent } from './dispatch.component';
import { TrackOrdersComponent } from './pages/track-orders-deleted/track-orders.component';
import { TrackDriversComponent } from './pages/track-drivers/track-drivers.component';
import { AssignOrdersComponent } from './pages/assign-orders/assign-orders.component';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchComponent,
    children: [
      {
        path: 'all-orders',
        component: AllOrdersComponent,
      },
      {
        path: 'track-drivers',
        component: TrackDriversComponent,
      },
      {
        path: 'assign-orders',
        component: AssignOrdersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispatchRoutingModule {}
