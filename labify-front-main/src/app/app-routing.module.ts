import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/components/not-found-page/not-found-page.component';
import { CareerPageComponent } from './pages/career-page/career-page.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'market-place',
    loadChildren: () =>
      import('./pages/market-place-page/market-place-page.module').then(
        (m) => m.MarketPlacePageModule
      ),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./pages/services-page/services-page.module').then(
        (m) => m.ServicesPageModule
      ),
  },
  {
    path: 'product/:productId',
    loadChildren: () =>
      import('./pages/product-page/product-page.module').then(
        (m) => m.ProductPageModule
      ),
  },
  {
    path: 'warehouse',
    loadChildren: () =>
      import('./pages/warehouse-page/warehouse-page.module').then(
        (m) => m.WarehousePageModule
      ),
  },
  {
    path: 'order',
    loadChildren: () =>
      import('./pages/order-page/order-page.module').then(
        (m) => m.OrderPageModule
      ),
  },
  {
    path: 'career',
    component: CareerPageComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyComponent,
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile-page/profile-page.module').then(
        (m) => m.ProfilePageModule
      ),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
