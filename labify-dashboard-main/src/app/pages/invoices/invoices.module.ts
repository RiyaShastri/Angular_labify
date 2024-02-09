import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import { InvoicesComponent } from './invoices.component';
import { CompanyComponent } from './company/company.component';
import { DriverComponent } from './driver/driver.component';
import { InvoicesOrderRoutingModule } from './invoices-routing.module';
import { SharedModule } from '../../shared/shared.module';
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
  NbTimepickerModule,
} from '@nebular/theme';import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
@NgModule({
  declarations: [
    AllInvoicesComponent,
    InvoicesComponent,
    CompanyComponent,
    DriverComponent,
  ],
  imports: [
    CommonModule,
    InvoicesOrderRoutingModule,
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
    NbDatepickerModule,
    NbTimepickerModule,
    TableModule,
    PaginatorModule,
    AnimateModule,
    ButtonModule,
  ],
})
export class InvoicesModule {}
