import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceOnDemandOrderComponent } from './place-on-demand-order.component';

const routes: Routes = [{ path: '', component: PlaceOnDemandOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceOnDemandOrderRoutingModule { }
