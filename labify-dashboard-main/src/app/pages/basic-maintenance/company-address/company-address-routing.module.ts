import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyAddressComponent } from './company-address.component';
import { StoreCompanyAddressComponent } from './store-company-address/store-company-address.component';
import { EditCompanyAddressComponent } from './edit-company-address/edit-company-address.component';
import { AllCompanyAddressesComponent } from './all-company-addresses/all-company-addresses.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyAddressComponent,
    children: [
      {
        path: '',
        component: AllCompanyAddressesComponent,
      },
      {
        path: 'store-company-address',
        component: StoreCompanyAddressComponent,
      },
      {
        path: 'edit-company-address/:addressId',
        component: EditCompanyAddressComponent,
      },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyAddressRoutingModule {}
