import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DriversComponent } from "./drivers.component";
import { AllDriversComponent } from "./all-drivers/all-drivers.component";
import { StoreNewDriverComponent } from "./store-new-driver/store-new-driver.component";
import { UpdateDriverComponent } from "./update-driver/update-driver.component";
import { DriverScheduleComponent } from "./driver-schedule/driver-schedule.component";

const routes: Routes = [
  {
    path: "",
    component: DriversComponent,
    children: [
      { path: "", component: AllDriversComponent },
      { path: "store-driver", component: StoreNewDriverComponent },
      { path: "update-driver/:driverId", component: UpdateDriverComponent },
      { path: "driver-schedule/:driverId", component: DriverScheduleComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
