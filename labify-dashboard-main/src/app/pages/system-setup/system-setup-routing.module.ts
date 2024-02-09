import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSetupComponent } from './system-setup.component';
import { DefaultPricesComponent } from './default-prices/default-prices.component';
import { RolesComponent } from './web/roles/roles.component';
import { UsersComponent } from './web/users/users.component';
import { AllRolesComponent } from './web/roles/all-roles/all-roles.component';
import { UpdateRoleComponent } from './web/roles/update-role/update-role.component';
import { CreateRoleComponent } from './web/roles/create-role/create-role.component';
import { AllUsersComponent } from './web/users/all-users/all-users.component';
import { UpdateUserComponent } from './web/users/update-user/update-user.component';
import { CreateUserComponent } from './web/users/create-user/create-user.component';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: SystemSetupComponent,
    children: [
      {
        path: 'default-prices',
        canActivate: [PermissionGuard],
        data: { permission: 'Default Prices' },
        component: DefaultPricesComponent,
      },
      {
        path: 'roles',
        canActivate: [PermissionGuard],
        data: { permission: 'Roles' },
        component: RolesComponent,
        children: [
          {
            path: '',
            component: AllRolesComponent,
          },
          {
            path: 'update-role/:roleId',
            component: UpdateRoleComponent,
          },
          {
            path: 'create-role',
            component: CreateRoleComponent,
          },
        ],
      },
      {
        path: 'users',
        canActivate: [PermissionGuard],
        data: { permission: 'Users' },
        component: UsersComponent,
        children: [
          {
            path: '',
            component: AllUsersComponent,
          },
          {
            path: 'update-user/:userId',
            component: UpdateUserComponent,
          },
          {
            path: 'create-user',
            component: CreateUserComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemSetupRoutingModule {}
