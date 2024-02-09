import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanySetupComponent } from './company-setup.component';
import { NotePadCodesComponent } from './orders/note-pad-codes/note-pad-codes.component';

const routes: Routes = [
  {
    path: '',
    component: CompanySetupComponent,
    children: [
      {
        path: 'note-pad-codes',
        component: NotePadCodesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanySetupRoutingModule {}
