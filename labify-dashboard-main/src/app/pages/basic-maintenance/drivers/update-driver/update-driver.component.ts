import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FormManage } from "src/app/core/classes/form-manage";
import { DriversService } from "src/app/core/services/drivers.service";
import { ToasterService } from "src/app/core/services/toaster.service";
import { Driver } from "src/app/core/models/driver.model";
import { City } from "src/app/core/models/city.model";

@Component({
  selector: 'app-update-driver',
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.scss'],
})
export class UpdateDriverComponent extends FormManage implements OnInit {
  driverId!: number;
  driverForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  dirverCities!: City[];
  allCities!: City[];
  type_payment_list = ['daily', 'hourly', 'per_mile'];
  selected_payment: any = '';
  constructor(
    private router: Router,
    private driversService: DriversService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDriverData();
    this.getAllCities();
  }

  getDriverData() {
    this.activatedRoute.params.subscribe((params) => {
      this.driverId = params['driverId'];
      if (this.driverId)
        this.driversService.getDriverById(this.driverId).subscribe((res) => {
          this.initDriverForm(res);
          this.dirverCities = res.cities;
        });
    });
  }

  getAllCities() {
    this.driversService.getAllCities().subscribe((res) => {
      this.allCities = res;
    });
  }

  initDriverForm(driver: Driver) {
    this.driverForm = new FormGroup(
      {
        name: new FormControl(driver.name, Validators.required),
        phone: new FormControl(driver.phone, [Validators.required]),
        email: new FormControl(driver.email, [
          Validators.required,
          Validators.email,
        ]),
        type_payment: new FormControl(driver.type_payment, [
          Validators.required,
        ]),
        price: new FormControl(driver.price, [Validators.required]),
        password: new FormControl(driver.password_value, Validators.required),
        password_confirmation: new FormControl(
          driver.password_value,
          Validators.required
        ),
      },
      [this.matchFields('password', 'password_confirmation')]
    );

    this.setForm(this.driverForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      let cities: number[] = [];
      for (let city of this.dirverCities) cities.push(city.id);

      this.driversService
        .updateDriver(this.driverId, { ...this.FormValue, cities })
        .subscribe(
          (res) => {
            this.toasterService.showSuccess('Updated successfully');
            this.goBack();
          },
          (err) => {
            this.loading = false;
            let errors = err.error.errors;
            for (let error in errors) {
              this.toasterService.showDanger(errors[error]);
            }
          }
        );
    } else this.markAllFeildsTouched();
  }

  onCitySelect(city: City) {
    if (this.isChecked(city)) {
      this.dirverCities = this.dirverCities.filter((c) => c.id != city.id);
    } else {
      this.dirverCities.push(city);
    }
  }
  onDriverSelectionChange($event: any) {
    this.selected_payment = $event;
    this.setContollerValue('type_payment', $event);
  }
  isChecked(city: City): boolean {
    for (let c of this.dirverCities) {
      if (city.id == c.id) return true;
    }
    return false;
  }

  goBack() {
    return this.router.navigate(['/basic-maintenance/drivers']);
  }
}
