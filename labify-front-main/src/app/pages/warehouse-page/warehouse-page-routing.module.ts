import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousePageComponent } from './warehouse-page.component';

const routes: Routes = [{ path: '', component: WarehousePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousePageRoutingModule { }
