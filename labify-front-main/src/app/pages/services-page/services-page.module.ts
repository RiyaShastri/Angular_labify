import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesPageRoutingModule } from './services-page-routing.module';
import { ServicesPageComponent } from './services-page.component';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ServicesPageComponent],
  imports: [
    CommonModule,
    ServicesPageRoutingModule,
    SwiperModule,
    SharedModule,
  ],
})
export class ServicesPageModule {}
