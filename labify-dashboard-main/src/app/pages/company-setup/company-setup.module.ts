import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanySetupRoutingModule } from './company-setup-routing.module';
import { CompanySetupComponent } from './company-setup.component';
import { NotePadCodesComponent } from './orders/note-pad-codes/note-pad-codes.component';

@NgModule({
  declarations: [
    CompanySetupComponent,
    NotePadCodesComponent,
  ],
  imports: [
    CommonModule,
    CompanySetupRoutingModule
  ]
})
export class CompanySetupModule { }
