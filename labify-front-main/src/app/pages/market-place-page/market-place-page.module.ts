import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketPlacePageRoutingModule } from './market-place-page-routing.module';
import { MarketPlacePageComponent } from './market-place-page.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MarketPlacePageComponent],
  imports: [CommonModule, MarketPlacePageRoutingModule, SharedModule],
})
export class MarketPlacePageModule {}
