import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicOrderUpdatesComponent } from './basic-order-updates.component';
import { AssignDriversComponent } from './assign-drivers/assign-drivers.component';
import { ManageAppointmentsComponent } from './manage-appointments/manage-appointments.component';
import { MarkOrdersRecievedComponent } from './mark-orders-recieved/mark-orders-recieved.component';
import { UpdateCancelOrdersComponent } from './update-cancel-orders/update-cancel-orders.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: BasicOrderUpdatesComponent,
    // redirectTo: "assign-drivers",
    children: [
      {
        path: 'assign-drivers',
        data: { permission: 'Assign Drivers' },
        canActivate: [PermissionGuard],
        component: AssignDriversComponent,
      },
      {
        path: 'manage-appointments',
        component: ManageAppointmentsComponent,
      },
      {
        path: 'mark-orders-recieved',
        component: MarkOrdersRecievedComponent,
      },
      {
        path: 'update-cancel-orders',
        component: UpdateCancelOrdersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicOrderUpdatesRoutingModule {}
