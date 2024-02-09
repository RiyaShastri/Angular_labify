import { NgModule } from '@angular/core';

import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbButtonModule,
  NbTabsetModule,
  NbSpinnerModule,
  NbFormFieldModule,
  NbSelectModule,
  NbRadioModule,
  NbAutocompleteModule,

  NbCheckboxModule,
} from "@nebular/theme";
import { Ng2SmartTableModule } from 'ng2-smart-table';

// import { ThemeModule } from '../../@theme/theme.module';
import { AddressPointsRoutingModule } from './address-points-routing.module';
// import { FsIconComponent } from './tree-grid/tree-grid.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { AddressPointsComponent } from './address-points.component';
import { CreateAddressComponent } from './create-address/create-address.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { AllAddressComponent } from './all-address/all-address.component';
import { AddressDetailsComponent } from './address-details/address-details.component';

import { StoreDoctorAddressComponent } from './update-address/store-doctor-address/store-doctor-address.component';
import { EditDoctorAddressComponent } from './update-address/edit-doctor-address/edit-doctor-address.component';
import { DoctorAddressDetailsComponent } from './update-address/edit-doctor-address/doctor-address-details/doctor-address-details.component';
import { DoctorAddressScheduleComponent } from './update-address/edit-doctor-address/doctor-address-schedule/doctor-address-schedule.component';
import { DoctorInfoComponent } from './update-address/doctor-info/doctor-info.component';
import { DoctorAddressComponent } from './update-address/doctor-address/doctor-address.component';


@NgModule({
  imports: [
    CommonModule,
    AddressPointsRoutingModule,
    SharedModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule,
    NbTabsetModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbSelectModule,
    NbRadioModule,
    NbCheckboxModule,
    Ng2SmartTableModule,
    NbAutocompleteModule

  ],
  declarations: [
    AddressPointsComponent,
    CreateAddressComponent,
    UpdateAddressComponent,
    AllAddressComponent,
    AddressDetailsComponent,
    DoctorAddressDetailsComponent,
    DoctorAddressScheduleComponent,
    StoreDoctorAddressComponent,
    EditDoctorAddressComponent,
    DoctorInfoComponent,
    DoctorAddressComponent,
  ],
  exports: [
    AddressPointsComponent,
    CreateAddressComponent,
    UpdateAddressComponent,
    AllAddressComponent,
    AddressDetailsComponent,
    DoctorAddressDetailsComponent,
    DoctorAddressScheduleComponent,
    StoreDoctorAddressComponent,
    EditDoctorAddressComponent,
    DoctorInfoComponent,
    DoctorAddressComponent,
  ]

})
export class AddressPointsModule { }
