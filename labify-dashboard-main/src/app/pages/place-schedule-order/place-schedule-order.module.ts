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
} from "@nebular/theme";
import {  PlaceScheduleOrderRoutingModule } from './place-schedule-order-routing.module';
import {PlaceScheduleOrderComponent } from './place-schedule-order.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PlaceScheduleOrderComponent
  ],
  imports: [
    CommonModule,
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
    PlaceScheduleOrderRoutingModule,
    SharedModule
  ]
})
export class PlaceScheduleOrderModule { }
