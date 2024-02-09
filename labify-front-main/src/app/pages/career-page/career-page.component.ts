import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { City } from 'src/app/core/models/city.model';
import { AddressService } from 'src/app/core/services/address.service';
import { FormManage } from 'src/app/shared/classes/form-manage';
import { CareerService } from './career.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-career-page',
  templateUrl: './career-page.component.html',
  styleUrls: ['./career-page.component.scss'],
})
export class CareerPageComponent extends FormManage {
  cities!: City[];
  districts!: City[];
  careerForm!: FormGroup;
  sending = false;

  constructor(
    private addressService: AddressService,
    private careerService: CareerService,
    private toaster: ToasterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initCareerForm();
    this.getCities();
  }

  initCareerForm(): void {
    this.careerForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
      ]),
      street: new FormControl('', Validators.required),
      intersted_in: new FormControl(
        'Business Development',
        Validators.required
      ),
      postal_code: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      city_id: new FormControl('', Validators.required),
      state_id: new FormControl('', Validators.required),
    });

    this.setForm(this.careerForm);
  }

  getCities() {
    this.addressService.getAllCities().subscribe((res) => {
      this.cities = res;
      this.setContollerValue('city_id', this.cities[0].id);
      this.getDistricts(this.cities[0].id);
    });
  }

  getDistricts(cityId: number) {
    this.addressService.getAllDistricts(cityId).subscribe((res) => {
      this.districts = res;
      this.setContollerValue('state_id', this.districts[0].id);
    });
  }

  onSubmit() {
    if (this.isFormValid) {
      this.sending = true;
      console.log(this.FormValue);
      this.careerService.sendData(this.FormValue).subscribe({
        next: () => {
          this.sending = false;
          this.toaster.showSuccess('Your data has been sent');
          this.initCareerForm();
        },
        error: (err) => {
          this.sending = false;
          this.toaster.showDanger(err);
        },
      });
    } else this.markAllFeildsTouched();
  }
}
