import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicOrderUpdatesRoutingModule } from './basic-order-updates-routing.module';
import { BasicOrderUpdatesComponent } from './basic-order-updates.component';
import { MarkOrdersRecievedComponent } from './mark-orders-recieved/mark-orders-recieved.component';
import { ManageAppointmentsComponent } from './manage-appointments/manage-appointments.component';
import { AssignDriversComponent } from './assign-drivers/assign-drivers.component';
import { UpdateCancelOrdersComponent } from './update-cancel-orders/update-cancel-orders.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconRendererComponent } from './assign-drivers/renderComponent.component';
import { StatusComponent } from './assign-drivers/statusComponent.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { AnimateModule } from 'primeng/animate';



@NgModule({
  declarations: [
    BasicOrderUpdatesComponent,
    MarkOrdersRecievedComponent,
    ManageAppointmentsComponent,
    AssignDriversComponent,
    UpdateCancelOrdersComponent,
    IconRendererComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    BasicOrderUpdatesRoutingModule,
    SharedModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    PaginatorModule,
    AnimateModule,

  ]
})
export class BasicOrderUpdatesModule { }
