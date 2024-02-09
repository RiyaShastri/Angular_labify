import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
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
  NbWindowRef,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { SharedModule } from '../../shared/shared.module';
import { TwoPinAddressMapComponent } from '../../shared/components/two-pin-address-map/two-pin-address-map.component';
import { IconRendererComponent } from './all-orders/renderComponent.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { SwiperModule } from 'swiper/angular'; // Import SwiperModule from 'swiper/angular'
import { StatusComponent } from './all-orders/statusComponent.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { AnimateModule } from 'primeng/animate';
import { ViewOrderComponent } from './view-order/view-order.component';


@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
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
    TableModule,
    MultiSelectModule,
    ButtonModule,
    PaginatorModule,
    AnimateModule,
  ],
  declarations: [
    AllOrdersComponent,
    OrderComponent,
    UpdateOrderComponent,
    IconRendererComponent,
    OrderStatusComponent,
    StatusComponent,
    ViewOrderComponent
  ],
})
export class OrderModule { }
