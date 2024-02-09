import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagersComponent } from './account-managers.component';
import { AllAccountManagersComponent } from './all-account-managers/all-account-managers.component';
import { AccountManagerDetailsComponent } from './account-manager-details/account-manager-details.component';
import { CreateAccountManagerComponent } from './create-account-manager/create-account-manager.component';

const routes: Routes = [
  {
    path: '',
    component: AccountManagersComponent,
    children: [
      {
        path: '',
        component: AllAccountManagersComponent,
      },
      {
        path: 'account-manager-details/:accountManagerId',
        component: AccountManagerDetailsComponent,
      },
      {
        path: 'store-account-manager',
        component: CreateAccountManagerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountManagersRoutingModule {}
