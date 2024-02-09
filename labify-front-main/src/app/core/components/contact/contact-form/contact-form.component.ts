import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { FormManage } from 'src/app/shared/classes/form-manage';
import { ContactService } from '../contact.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { AddressService } from 'src/app/core/services/address.service';
import { City } from 'src/app/core/models/city.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent extends FormManage {
  contactForm!: FormGroup;
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
    this.initContactForm();
    this.getAllCities();
  }

  initContactForm() {
    this.contactForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
      ]),
      company_name: new FormControl('', [Validators.required]),
      city_id: new FormControl('', [Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      type_bussiness: new FormControl('', [Validators.required]),
      courier: new FormControl('In House', [Validators.required]),
      intersted_in: new FormControl('', [Validators.required]),
    });

    this.setForm(this.contactForm);
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
      this.contactService.contact(this.FormValue).subscribe({
        next: () => {
          this.toasterService.showSuccess(
            'Your data has been saved successfully'
          );
          this.initContactForm();
          this.sending = false;
        },
      });
    } else this.markAllFeildsTouched();
  }
}
