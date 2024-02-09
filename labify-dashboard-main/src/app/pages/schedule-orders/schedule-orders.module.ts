import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleOrdersRoutingModule } from './schedule-orders-routing.module';
import { ScheduleOrdersComponent } from './schedule-orders.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { IconRendererComponent } from './all-orders/renderComponent.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { AnimateModule } from 'primeng/animate';
import { TableModule } from 'primeng/table';
import { NbTimepickerModule } from '@nebular/theme';


@NgModule({
  declarations: [
    ScheduleOrdersComponent,
    AllOrdersComponent,
    OrderStatusComponent,
    UpdateOrderComponent,
    IconRendererComponent,
  ],
  imports: [
    CommonModule,
    ScheduleOrdersRoutingModule,
    SharedModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    PaginatorModule,
    NbTimepickerModule.forRoot({
      localization: {
        hoursText: 'Hr',
        minutesText: 'Min',
        secondsText: 'Sec',
        ampmText: 'Am/Pm',
      },
    }),
    
    AnimateModule,
  ],
})
export class ScheduleOrdersModule {}
