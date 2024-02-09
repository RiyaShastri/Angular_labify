import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { BasicMaintenanceRoutingModule } from './basic-maintenance-routing.module';
import { BasicMaintenanceComponent } from './basic-maintenance.component';
import { ServiceLevelsComponent } from './service-levels/service-levels.component';
import { VehicleTypesComponent } from './vehicle-types/vehicle-types.component';
import { AddressesComponent } from './addresses/addresses.component';
import { CompanyAddressModule } from './company-address/company-address.module';
import { AddressPointsModule } from './address-points/address-points.module';
import { AutocompleteComponent } from '../../shared/components/google-places.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BasicMaintenanceComponent,
    ServiceLevelsComponent,
    VehicleTypesComponent,
    AddressesComponent,
  ],
  imports: [CommonModule,
    BasicMaintenanceRoutingModule,
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
    NbCheckboxModule,
    CompanyAddressModule,
    AddressPointsModule,
    FormsModule
  ],
  exports: []
})
export class BasicMaintenanceModule { }
