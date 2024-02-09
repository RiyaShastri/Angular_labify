import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousePageRoutingModule } from './warehouse-page-routing.module';
import { WarehousePageComponent } from './warehouse-page.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [WarehousePageComponent],
  imports: [CommonModule, WarehousePageRoutingModule, SwiperModule],
})
export class WarehousePageModule {}
