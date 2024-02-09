import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyAddressComponent } from './company-address.component';
import { StoreCompanyAddressComponent } from './store-company-address/store-company-address.component';
import { EditCompanyAddressComponent } from './edit-company-address/edit-company-address.component';
import { AllCompanyAddressesComponent } from './all-company-addresses/all-company-addresses.component';
import { CompanyAddressDetailsComponent } from './edit-company-address/company-address-details/company-address-details.component';
import { CompanyAddressScheduleComponent } from './edit-company-address/company-address-schedule/company-address-schedule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyAddressRoutingModule } from './company-address-routing.module';
import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbActionsModule,
  NbIconModule,
  NbTabsetModule,
  NbWindowService,
  NbWindowModule,
  NbWindowRef,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbCheckboxModule,
} from "@nebular/theme";
import { AddressesComponent } from '../addresses/addresses.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';
import { AutocompleteComponent } from '../../../shared/components/google-places.component';
@NgModule({
  declarations: [
    CompanyAddressComponent,
    StoreCompanyAddressComponent,
    EditCompanyAddressComponent,
    AllCompanyAddressesComponent,
    CompanyAddressDetailsComponent,
    CompanyAddressScheduleComponent,
  ],
  imports: [CommonModule,
    SharedModule,
    CompanyAddressRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbActionsModule,
    NbIconModule,
    NbTabsetModule,
    NbWindowModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbCheckboxModule,],
  exports: [
    CompanyAddressComponent,
    StoreCompanyAddressComponent,
    EditCompanyAddressComponent,
    AllCompanyAddressesComponent,
    CompanyAddressDetailsComponent,
    CompanyAddressScheduleComponent,
  ],
  // GooglePlaceModule

})
export class CompanyAddressModule { }
