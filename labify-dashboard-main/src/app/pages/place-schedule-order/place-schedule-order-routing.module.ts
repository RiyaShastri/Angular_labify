import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceScheduleOrderComponent } from './place-schedule-order.component';

const routes: Routes = [{ path: '', component: PlaceScheduleOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceScheduleOrderRoutingModule { }
