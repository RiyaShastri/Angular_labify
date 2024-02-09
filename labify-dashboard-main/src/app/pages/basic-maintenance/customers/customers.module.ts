import { NgModule } from '@angular/core';
import {
  NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbButtonModule,
  NbSpinnerModule,
  NbFormFieldModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

// import { ThemeModule } from '../../@theme/theme.module';
import { CustomersRoutingModule } from './customers-routing.module';
// import { FsIconComponent } from './tree-grid/tree-grid.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { PriceComponent } from './price/price.component';
import { SurchargeComponent } from './surcharge/surcharge.component';
import { PriceLinkComponent } from './all-companies//priceLink.component';
import { CustomersComponent } from './customers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { CityComponent } from './price/city/city.component';
import { MileComponent } from './price/mile/mile.component';
import { CompanyAddressModule } from '../company-address/company-address.module';
import { AddressPointsModule } from '../address-points/address-points.module';


@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    SharedModule,
    NbIconModule,
    CompanyAddressModule,
    AddressPointsModule,
  ],
  declarations: [
    CustomersComponent,
    CreateCompanyComponent,
    UpdateCompanyComponent,
    PriceComponent,
    SurchargeComponent,
    PriceLinkComponent,
    AllCompaniesComponent,
    CityComponent,
    MileComponent,

  ],

})
export class CustomersModule { }
