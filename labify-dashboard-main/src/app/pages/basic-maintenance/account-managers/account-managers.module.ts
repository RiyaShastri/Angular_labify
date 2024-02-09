import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountManagersRoutingModule } from './account-managers-routing.module';
import { AccountManagersComponent } from './account-managers.component';
import { AllAccountManagersComponent } from './all-account-managers/all-account-managers.component';
import { AccountManagerDetailsComponent } from './account-manager-details/account-manager-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateAccountManagerComponent } from './create-account-manager/create-account-manager.component';

@NgModule({
  declarations: [
    AccountManagersComponent,
    AllAccountManagersComponent,
    AccountManagerDetailsComponent,
    CreateAccountManagerComponent,
  ],
  imports: [CommonModule, AccountManagersRoutingModule, SharedModule],
})
export class AccountManagersModule {}
