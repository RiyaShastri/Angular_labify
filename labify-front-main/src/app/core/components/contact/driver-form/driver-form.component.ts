import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { City } from 'src/app/core/models/city.model';
import { AddressService } from 'src/app/core/services/address.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
})
export class DriverFormComponent extends FormManage {
  driverForm!: FormGroup;
  cities!: City[];
  districts!: City[];
  sending = false;

  constructor(
    private contactService: ContactService,
    private toasterService: ToasterService,
    private addressService: AddressService
  ) {
    super();
  }

  ngOnInit() {
    this.initDriverForm();
    this.getAllCities();
  }

  initDriverForm() {
    this.driverForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
      ]),
      company_name: new FormControl(''),
      address_1: new FormControl('', [Validators.required]),
      address_2: new FormControl(''),
      postal_code: new FormControl('', [Validators.required]),
      city_id: new FormControl('', [Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      vehicle_make: new FormControl('', [Validators.required]),
      vehicle_model: new FormControl('', [Validators.required]),
      vehicle_year: new FormControl('', [Validators.required]),
      weekdays_weekends: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
    });

    this.setForm(this.driverForm);
  }

  getAllCities(): void {
    this.addressService.getAllCities().subscribe((res) => {
      this.cities = res;
      this.getAllDistricts(this.cities[0].id);
    });
  }

  onCityChange(cityId: number) {
    this.setContollerValue('state_id', null);
    this.districts = [];
    this.getAllDistricts(cityId);
  }

  getAllDistricts(cityId: number): void {
    this.addressService
      .getAllDistricts(cityId)
      .subscribe((res) => (this.districts = res));
  }

  onSubmit() {
    if (this.isFormValid) {
      this.sending = true;
      this.contactService.driver(this.FormValue).subscribe({
        next: () => {
          this.toasterService.showSuccess(
            'Your data has been saved successfully'
          );
          this.initDriverForm();
          this.sending = false;
        },
      });
    } else this.markAllFeildsTouched();
  }
}
