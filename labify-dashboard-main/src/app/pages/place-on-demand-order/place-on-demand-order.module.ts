import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbWindowModule,
  NbDatepickerModule,
  NbTimepickerModule
} from "@nebular/theme";
import { PlaceOnDemandOrderRoutingModule } from './place-on-demand-order-routing.module';
import { PlaceOnDemandOrderComponent } from './place-on-demand-order.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { StoreDoctorAddressComponent } from '../basic-maintenance/address-points/update-address/store-doctor-address/store-doctor-address.component';
import { AddressPointsModule } from '../basic-maintenance/address-points/address-points.module';


@NgModule({
  declarations: [
    PlaceOnDemandOrderComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    NbCardModule,
    NbIconModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbFormFieldModule,
    NbButtonModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbSelectModule,
    NbRadioModule,
    NbWindowModule,
    NbAutocompleteModule,
    PlaceOnDemandOrderRoutingModule,
    NbDatepickerModule,
    NbTimepickerModule,
    DynamicDialogModule,
    AddressPointsModule
  ]
})
export class PlaceOnDemandOrderModule { }
