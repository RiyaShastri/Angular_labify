import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddButtonComponent } from 'ng2-smart-table/lib/components/thead/cells/add-button.component';
import { AllAddressComponent } from './all-address/all-address.component';
import { CreateAddressComponent } from './create-address/create-address.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { AddressPointsComponent } from './address-points.component';
import { DoctorInfoComponent } from './update-address/doctor-info/doctor-info.component';
import { DoctorAddressComponent } from './update-address/doctor-address/doctor-address.component';
import { StoreDoctorAddressComponent } from './update-address/store-doctor-address/store-doctor-address.component';
import { EditDoctorAddressComponent } from './update-address/edit-doctor-address/edit-doctor-address.component';

const routes: Routes = [{

    path: '',
    component: UpdateAddressComponent,
    children: [
      {
        path: "addresses",
        component: DoctorAddressComponent,
      },
      {
        path: "address-details/:addressId",
        component: DoctorInfoComponent,
      },

      {
        path: "store-address",
        component: StoreDoctorAddressComponent,
      },
      {
        path: "edit-address/:id",
        component: EditDoctorAddressComponent,

      },
      {
        path:"test-create",
        component: CreateAddressComponent,
      }
    ],

  // path: '',
  // component: AddressPointsComponent,
  // children: [
  //   // {
  //   //   path: '',
  //   //   redirectTo:'address-details/1'
  //   // },
  //   // {
  //   //   path: 'create-address',
  //   //   component:  CreateAddressComponent,
  //   // },
  //   // {
  //   //   path: 'update-address/:id',
  //   //   component:  UpdateAddressComponent,
  //   // },
  //   {
  //     path: '',
  //     component: UpdateAddressComponent,
  //     children: [
  //       {
  //         path: "address-details/1",
  //         component: DoctorInfoComponent,
  //       },
  //       {
  //         path: "addresses",
  //         component: DoctorAddressComponent,
  //       },
  //       {
  //         path: "store-address",
  //         component: StoreDoctorAddressComponent,
  //       },
  //       {
  //         path: "edit-address/1",
  //         component: EditDoctorAddressComponent,
  //       },
  //     ],
  //   },
  //   // {
  //   //   path: 'surcharge/:id',
  //   //   component: SurchargeComponent,
  //   // }
  // ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class AddressPointsRoutingModule { }

