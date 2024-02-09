import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { TreeGridComponent } from './tree-grid/tree-grid.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { PriceComponent } from './price/price.component';
import { SurchargeComponent } from './surcharge/surcharge.component';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { CustomersComponent } from './customers.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [{
  path: '',
  component: CustomersComponent,
  children: [
    {
      path: '',
      component: AllCompaniesComponent,
    },
    {
      path: 'create-company',
      component:  CreateCompanyComponent,
    },
    {
      path: 'update-company/:id',
      component:  UpdateCompanyComponent,
    },
    {
      path: 'price/:type/:id',
      component: PriceComponent,
    },
    {
      path: 'surcharge/:id',
      component: SurchargeComponent,
    }
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class CustomersRoutingModule { }

