import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  NbActionsModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbPopoverModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTimepickerModule,
  NbWindowModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PinAddressMapComponent } from './components/pin-address-map/pin-address-map.component';
import { TwoPinAddressMapComponent } from './components/two-pin-address-map/two-pin-address-map.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutocompleteComponent } from './components/google-places.component';

@NgModule({
  declarations: [
    PinAddressMapComponent,
    TwoPinAddressMapComponent,
    ImageSliderComponent,
    AutocompleteComponent,
  ],
  imports: [
    CommonModule,
    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbActionsModule,
    NbSelectModule,
    NbContextMenuModule,
    NbCardModule,
    NbListModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbFormFieldModule,
    NbSpinnerModule,
    NbCheckboxModule,
    Ng2SmartTableModule,
    NbRadioModule,
    NbTabsetModule,
    SwiperModule,
    RouterModule,
    NbWindowModule,
    NbAutocompleteModule,
    NbTimepickerModule,
    NgxPaginationModule,
    NbPopoverModule,
  ],
  exports: [
    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbActionsModule,
    NbSelectModule,
    NbContextMenuModule,
    NbCardModule,
    NbListModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbFormFieldModule,
    NbSpinnerModule,
    NbCheckboxModule,
    Ng2SmartTableModule,
    NbRadioModule,
    NbTabsetModule,
    PinAddressMapComponent,
    TwoPinAddressMapComponent,
    ImageSliderComponent,
    SwiperModule,
    RouterModule,
    NbWindowModule,
    NbAutocompleteModule,
    NbTimepickerModule,
    NgxPaginationModule,
    AutocompleteComponent,
    NbPopoverModule,
  ],
})
export class SharedModule {}
