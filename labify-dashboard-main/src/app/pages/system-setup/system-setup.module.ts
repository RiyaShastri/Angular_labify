import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemSetupRoutingModule } from './system-setup-routing.module';
import { SystemSetupComponent } from './system-setup.component';
import { SitesComponent } from './web/sites/sites.component';
import { RolesComponent } from './web/roles/roles.component';
import { UsersComponent } from './web/users/users.component';
import { DefaultPricesComponent } from './default-prices/default-prices.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CityComponent } from './default-prices/city/city.component';
import { MileComponent } from './default-prices/mile/mile.component';
import { SurchargeComponent } from './default-prices/surcharge/surcharge.component';
import { DefaultCityComponent } from './default-prices/default-city/default-city.component';
import { AllRolesComponent } from './web/roles/all-roles/all-roles.component';
import { UpdateRoleComponent } from './web/roles/update-role/update-role.component';
import { CreateRoleComponent } from './web/roles/create-role/create-role.component';
import { AllUsersComponent } from './web/users/all-users/all-users.component';
import { CreateUserComponent } from './web/users/create-user/create-user.component';
import { UpdateUserComponent } from './web/users/update-user/update-user.component';


@NgModule({
  declarations: [
    SystemSetupComponent,
    SitesComponent,
    RolesComponent,
    UsersComponent,
    DefaultPricesComponent,
    CityComponent,
    MileComponent,
    SurchargeComponent,
    DefaultCityComponent,
    AllRolesComponent,
    UpdateRoleComponent,
    CreateRoleComponent,
    AllUsersComponent,
    CreateUserComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    SystemSetupRoutingModule,
    SharedModule
  ]
})
export class SystemSetupModule { }
