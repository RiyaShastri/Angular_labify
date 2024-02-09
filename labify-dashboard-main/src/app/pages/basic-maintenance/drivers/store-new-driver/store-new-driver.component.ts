import { Component, OnInit } from "@angular/core";
import { FormManage } from "src/app/core/classes/form-manage";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DriversService } from "src/app/core/services/drivers.service";
import { ToasterService } from "src/app/core/services/toaster.service";

@Component({
  selector: 'app-store-new-driver',
  templateUrl: './store-new-driver.component.html',
  styleUrls: ['./store-new-driver.component.scss'],
})
export class StoreNewDriverComponent extends FormManage implements OnInit {
  driverForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  type_payment = ['daily', 'hourly', 'per_mile'];
  selected_payment: any='';
  constructor(
    private router: Router,
    private driversService: DriversService,
    private toasterService: ToasterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initDriverForm();
  }

  initDriverForm() {
    this.driverForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        password_confirmation: new FormControl('', Validators.required),
        type_payment: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
      },
      [this.matchFields('password', 'password_confirmation')]
    );

    this.setForm(this.driverForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.driversService.createDriver(this.FormValue).subscribe(
        (res) => {
          this.toasterService.showSuccess('Driver created successfully');
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
  onDriverSelectionChange($event: any) {
    this.selected_payment = $event;
    this.setContollerValue('type_payment', $event);
  }
  goBack() {
    return this.router.navigate(['/basic-maintenance/drivers']);
  }
}
