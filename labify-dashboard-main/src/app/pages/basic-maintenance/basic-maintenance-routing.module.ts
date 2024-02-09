import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicMaintenanceComponent } from './basic-maintenance.component';
import { ServiceLevelsComponent } from './service-levels/service-levels.component';
import { VehicleTypesComponent } from './vehicle-types/vehicle-types.component';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { AddressesComponent } from './addresses/addresses.component';

const routes: Routes = [
  {
    path: '',
    component: BasicMaintenanceComponent,
    children: [
      {
        path: 'customers',
        canActivate: [PermissionGuard],
        data: { permission: 'Customers' },
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'address-points',
        canActivate: [PermissionGuard],
        data: { permission: 'Address Points' },
        loadChildren: () =>
          import('./address-points/address-points.module').then(
            (m) => m.AddressPointsModule
          ),
      },
      {
        path: 'account-managers',
        canActivate: [PermissionGuard],
        data: { permission: 'Account Managers' },
        loadChildren: () =>
          import('./account-managers/account-managers.module').then(
            (m) => m.AccountManagersModule
          ),
      },
      {
        path: 'drivers',
        canActivate: [PermissionGuard],
        data: { permission: 'Drivers' },
        loadChildren: () =>
          import('./drivers/drivers.module').then((m) => m.DriversModule),
      },
      {
        path: 'company-address',
        loadChildren: () =>
          import('./company-address/company-address.module').then(
            (m) => m.CompanyAddressModule
          ),
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
      {
        path: 'service-levels',
        component: ServiceLevelsComponent,
      },
      {
        path: 'vehicle-types',
        component: VehicleTypesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicMaintenanceRoutingModule {}
