import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../core/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { PermissionGuard } from '../core/guards/permission.guard';
import { InvoicesModule } from './invoices/invoices.module';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'place-on-demand-order',
        canActivate: [PermissionGuard],
        data: { permission: 'Place On-Demand Order' },
        loadChildren: () =>
          import('./place-on-demand-order/place-on-demand-order.module').then(
            (m) => m.PlaceOnDemandOrderModule
          ),
      },
      // {
      //   path: 'place-schedule-order',
      //   canActivate: [PermissionGuard],
      //   data: { permission: 'Place Schedule Order' },
      //   loadChildren: () =>
      //     import('./place-schedule-order/place-schedule-order.module').then(
      //       (m) => m.PlaceScheduleOrderModule
      //     ),
      // },
      {
        path: 'track-orders',
        canActivate: [PermissionGuard],
        data: { permission: 'Track Orders' },
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'schedule-orders',
        canActivate: [PermissionGuard],
        data: { permission: 'Track Schedule Orders' },
        loadChildren: () =>
          import('./schedule-orders/schedule-orders.module').then(
            (m) => m.ScheduleOrdersModule
          ),
      },
      {
        path: 'basic-order-updates',
        loadChildren: () =>
          import('./basic-order-updates/basic-order-updates.module').then(
            (m) => m.BasicOrderUpdatesModule
          ),
      },
      {
        path: 'basic-maintenance',
        loadChildren: () =>
          import('./basic-maintenance/basic-maintenance.module').then(
            (m) => m.BasicMaintenanceModule
          ),
      },
      {
        path: 'system-setup',
        loadChildren: () =>
          import('./system-setup/system-setup.module').then(
            (m) => m.SystemSetupModule
          ),
      },
      {
        path: 'company-setup',
        loadChildren: () =>
          import('./company-setup/company-setup.module').then(
            (m) => m.CompanySetupModule
          ),
      },
      {
        path: 'invoices',
        // canActivate: [PermissionGuard],
        loadChildren: () =>
          import('./invoices/invoices.module').then((m) => m.InvoicesModule),
      },
      {
        path: 'home',
        data: { permission: 'Home' },
        canActivate: [PermissionGuard],
        component: HomeComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      // {
      //   path: '**',
      //   component: NotFoundComponent,
      // },
    ],
  },
  {
    path: 'dispatch',
    canActivate: [PermissionGuard],
    data: { permission: 'Dispatch' },
    loadChildren: () =>
      import('./dispatch/dispatch.module').then((m) => m.DispatchModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
