import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { AllDriversComponent } from './all-drivers/all-drivers.component';
import { StoreNewDriverComponent } from './store-new-driver/store-new-driver.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DriverScheduleComponent } from './driver-schedule/driver-schedule.component';
import { CustomInputComponent } from './driver-schedule/custom-input.component';
import { CustomSelectComponent } from './driver-schedule/custom-select.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { AnimateModule } from 'primeng/animate';





@NgModule({
  declarations: [
    DriversComponent,
    AllDriversComponent,
    StoreNewDriverComponent,
    UpdateDriverComponent,
    DriverScheduleComponent,
    CustomInputComponent,
    CustomSelectComponent,

  ],
  imports: [CommonModule, DriversRoutingModule, SharedModule,TableModule,MultiSelectModule,
    ButtonModule,PaginatorModule,AnimateModule,],
})
export class DriversModule {}
