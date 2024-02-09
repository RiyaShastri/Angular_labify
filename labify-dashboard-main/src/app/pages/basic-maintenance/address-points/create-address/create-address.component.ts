import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { DoctorService } from './../../../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from '../../../../core/classes/form-manage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CompanyService } from '../../../../core/services/company.service';
import { DoctorAddressService } from 'src/app/core/services/doctor-address.service';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent extends FormManage implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private doctorAddressService: DoctorAddressService
  ) {
    super();
    // this.id = this.companyService.getSelectedCompany().value;
  }
  @Input() adressType!: string;
  @Input() address!: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  @ViewChild('postalCodeInput') postalCodeInput !: any;
  @ViewChild('stateInput') stateInput !: any;
  @ViewChild('cityInput') cityInput !: any;
  @Output() dialogOpened: EventEmitter<void> = new EventEmitter<void>();

  autocompleteInput!: string;
  queryWait!: boolean;
  id!: any;
  doctor: any = {};
  createDoctorForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  companyId!: any;

  ngOnInit(): void {
    this.companyId = this.doctorAddressService.getSelectedCompanyId();
    this.getPlaceAutocomplete();

    this.setForm(this.createDoctorForm);
  }
  ngAfterViewInit() {
    // console.log("From gPlaces");
    setTimeout(() => {
    this.getPlaceAutocomplete();
    this.dialogOpened.emit();
  }, 1000);

  }
  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.doctorService.createDoctor({ name: this.FormValue.name, user_id: this.companyId }).subscribe(
        (res) => {
          this.loading = false;
          this.resetForm();
          this.toaster.showSuccess('Doctor created successfully');
          this.router.navigate(['/basic-maintenance/', 'address-points']);
        },
        (err) => {
          this.loading = false;
          this.toaster.showDanger(err.error.message);
        }
      );
    } else {
      this.markAllFeildsTouched();
    }
  }
  cancel() {
    this.router.navigate(['/basic-maintenance/', 'address-points']);
  }


  initializeGooglePlacesAutocomplete() {
    setTimeout(() => {
      this.getPlaceAutocomplete();
      this.dialogOpened.emit();
    }, 1000);
  }
  getPlaceAutocomplete() {
    // console.log("From gPlaces func");

    const autocomplete = new google.maps.places.Autocomplete(this.addresstext?.nativeElement,
      {
        componentRestrictions: { country: 'US' },
        types: ['address']  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      const place = autocomplete?.getPlace();
      // this.updateInputFields(place);
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    // console.log("From gPlaces func33");

    this.setAddress.emit(place);
  }
  updateInputFields(place: google.maps.places.PlaceResult) {
    if (place) {
      // Update the input fields with the selected place details
      // this.postalCodeInput.nativeElement.value = this.getPostalCodeFromPlace(place);
      // this.stateInput.nativeElement.value = this.getStateFromPlace(place);
      // this.cityInput.nativeElement.value = this.getCityFromPlace(place);
      place.address_components?.forEach((component: any) => {
        if (component.types.includes('administrative_area_level_1')) {
          this.stateInput.nativeElement.value = component.long_name;
          // this.stateCode = component.short_name;
        }
        if (component.types.includes('locality')) {
          this.cityInput.nativeElement.value = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          this.postalCodeInput.nativeElement.value = component.long_name;
        }
      });
    }
  }


}
