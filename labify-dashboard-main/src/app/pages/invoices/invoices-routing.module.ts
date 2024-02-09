import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaceOnDemandOrderComponent } from '../place-on-demand-order/place-on-demand-order.component';
import { InvoicesComponent } from './invoices.component';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import { CompanyComponent } from './company/company.component';
import { DriverComponent } from './driver/driver.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
const routes: Routes = [
  {
    path: '',
    component: InvoicesComponent,
    children: [
      {
        path: 'company',
        component: CompanyComponent,
        data: { permission: 'Invoices' },
        canActivate: [PermissionGuard],
      },
      {
        path: 'driver',
        component: DriverComponent,
        data: { permission: 'Invoices' },
        canActivate: [PermissionGuard],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesOrderRoutingModule {}
