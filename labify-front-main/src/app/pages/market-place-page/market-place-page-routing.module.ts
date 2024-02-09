import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketPlacePageComponent } from './market-place-page.component';

const routes: Routes = [{ path: '', component: MarketPlacePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketPlacePageRoutingModule { }
