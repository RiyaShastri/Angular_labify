import { ChangeDetectorRef, ViewChild, Component, OnInit, Optional, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from '../../../../../core/classes/form-manage';
import { DoctorAddressService } from '../../../../../core/services/doctor-address.service';
import { DoctorService } from '../../../../../core/services/doctor.service';
import { PostalCodeService } from '../../../../../core/services/postalcode.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { CompanyService } from '../../../../../core/services/company.service';
import { NbWindowRef } from '@nebular/theme';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { } from '@angular/google-maps';

@Component({
  selector: 'ngx-store-doctor-address',
  templateUrl: './store-doctor-address.component.html',
  styleUrls: ['./store-doctor-address.component.scss'],
})
export class StoreDoctorAddressComponent extends FormManage implements OnInit {
  pinPosition = {
    lat: 37.0902,
    lng: -95.7129,
  };
  @Input() openedByOverlay: boolean = false;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  postalCode!: any;
  postalCodeAdded = false;
  showPostalcodeError = false;
  addressForm!: FormGroup;
  companyId!: number;
  showPostalCodeAlert = false;
  doctorId!: any;
  state: any;
  city: any;
  doctorName!: string;
  stateCode: any;
  latitude: any;
  longitude: any;
  @Input() adressType!: string;
  @Input() address!: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  @ViewChild('postalCodeInput') postalCodeInput !: any;
  @ViewChild('stateInput') stateInput !: any;
  @ViewChild('cityInput') cityInput !: any;
  @Output() dialogOpened: EventEmitter<void> = new EventEmitter<void>();
  isWindow: boolean = false;
  autocompleteInput!: string;
  queryWait!: boolean;
  constructor(
    private postalCodeService: PostalCodeService,
    private toasterService: ToasterService,
    private doctorAddressService: DoctorAddressService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    @Optional() public windowRef?: NbWindowRef
  ) {
    super();
  }
  options = {
    types: ['address'],
    componentRestrictions: { country: 'US' } // Customize as needed

  };

  ngOnInit(): void {
    this.companyId = this.doctorAddressService.getSelectedCompanyId();
    this.initAddressForm();
    this.isWindow = false;
    // console.log(this.companyId);
    // this.getPlaceAutocomplete();
    if (this.windowRef) {
      // The component was opened from a window
      // console.log('Component opened in a window');
      this.isWindow = true;
    } else {
      // The component was not opened from a window
      // console.log('Component not opened in a window');
    }
    // if(this.windowRef?.config){
    //       this.isWindow=true;

    // }else{
    //       this.isWindow=false;

    // }
    // if (this.windowRef) {
    //   this.isWindow=true;
    //   this.doctorService.getAllDoctors(this.companyId).subscribe({
    //     next: (res) => {
    //       // console.log(res);
    //       this.doctorId=res.data[0];
    //       this.setContollerValue('doctor_id', this.doctorId);
    //       // console.log('id:' + this.doctorId);
    //     },
    //     error: (error) => {// console.log(error);}
    //   });
    // }
  }
  ngAfterViewInit() {
    // console.log("From gPlaces");
      this.getPlaceAutocomplete();

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






  handleAddressChange(address: any) {
    // Do some stuff
    // console.log("Auto Select");
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.pinPosition = { lat: this.latitude, lng: this.longitude };
    this.postalCodeAdded = true;
    this.setPinPosition(this.pinPosition);
    // this.map.nativeElement.value=true;
    // Extract state, city, state code, and postal code from address components
    this.setContollerValue('address', address.formatted_address)
    address.address_components.forEach((component: any) => {
      if (component.types.includes('administrative_area_level_1')) {
        this.state = component.long_name;
        this.stateCode = component.short_name;
        // this.stateInput.nativeElement.value = component.long_name;
        this.setContollerValue('state', this.state);
        this.setContollerValue('state_code', this.stateCode);
      }
      if (component.types.includes('locality')) {
        this.city = component.long_name;
        // this.cityInput.nativeElement.value = component.long_name;
        this.setContollerValue('city', this.city);

      }
      if (component.types.includes('postal_code')) {
        this.postalCode = component.long_name;
        // this.postalCodeInput.nativeElement.value =component.long_name;
        this.setContollerValue('postal_code', this.postalCode);

      }
    });
    this.cdr.detectChanges();

    // console.log(this.latitude, this.longitude, this.postalCode, this.state, this.city, address.formatted_address);
    // this.placesRef.options;
  }

  initAddressForm() {
    this.addressForm = new FormGroup({
      doctor_id: new FormControl(this.doctorId),
      user_id: new FormControl(this.companyId, Validators.required),
      postal_code: new FormControl(null),
      city: new FormControl(null),
      lat: new FormControl(null),
      long: new FormControl(null),
      state: new FormControl(null),
      phone: new FormControl(null),
      ext: new FormControl(null),
      state_code: new FormControl(null),

      name: new FormControl(null),
      address: new FormControl(null),
      address_2: new FormControl(null),
      room_floor: new FormControl(null),
      suit: new FormControl(null),
      notes: new FormControl(null),
    });

    this.setForm(this.addressForm);
  }

  setPinPosition(pinPosition: any) {
    this.setContollerValue('lat', `${pinPosition.lat}`);
    this.setContollerValue('long', `${pinPosition.lng}`);
  }

  onDoctorNameChange(e: any) {
    this.doctorName = e.target.value;
    // console.log(this.doctorName);
  }

  onSubmit() {
    if (!this.isFieldValid('doctor_id'))
      this.doctorService
        .createDoctor({ name: this.FormValue.name, user_id: this.companyId })
        .subscribe((res) => {
          this.setContollerValue('doctor_id', res.data.id);
          this.submitForm();
        });
    else this.submitForm();
  }

  submitForm() {

    if (this.isFormValid) {
      this.setContollerValue('city', this.city);
      this.setContollerValue('state', this.state);
      this.setContollerValue('postal_code', this.postalCode);
      this.doctorAddressService.storeDoctorAddress(this.FormValue).subscribe(
        (res) => {
          this.toasterService.showSuccess('Doctor address saved successfully');
          // this.router.navigate([
          //   `pages/doctors/doctor-details/${this.doctorId}/addresses`,
          // ]);
          if (this.openedByOverlay) {
            // location.reload();

            this.close();
          } else {
            this.goBack();
          }
        },
        (err) => {
          this.toasterService.showDanger(err.error.message);
        }
      );
    } else {
      this.markAllFeildsTouched();

      if (
        !this.getControllerValue('postal_code') &&
        !this.isPostalCodeNumber()
      ) {
        this.showPostalcodeError = true;
      }

      if (
        this.isFieldValid('name') &&
        this.isFieldValid('address') &&
        this.isFieldValid('room_floor') &&
        this.isFieldValid('notes')
      ) {
        this.showPostalCodeAlert = true;
      }
    }
  }

  onPostalcodeChange() {
    this.showPostalcodeError = !this.isPostalCodeNumber();
  }

  isPostalCodeNumber() {
    let isNumber =
      !isNaN(parseFloat(`${this.postalCode}`)) && !isNaN(this.postalCode - 0);

    return isNumber;
  }

  getAddressData() {
    this.postalCodeService.getAddressData(this.postalCode).subscribe((res) => {
      if (res) {
        this.setContollerValue('postal_code', res.postal_code);
        this.setContollerValue('city', res.city);
        this.setContollerValue('lat', `${res.latitude}`);
        this.setContollerValue('long', `${res.longitude}`);
        this.setContollerValue('state', res.state);
        this.setContollerValue('state_code', res.state_code);
        this.pinPosition = { lat: res.latitude, lng: res.longitude };
        this.postalCodeAdded = true;
        this.showPostalCodeAlert = false;
        this.city = res.city;
        this.state = res.state;
      } else {
        this.toasterService.showDanger('Invalid postalcode try anothor one');
        this.setContollerValue('postal_code', null);
        this.setContollerValue('city', null);
        this.setContollerValue('lat', null);
        this.setContollerValue('long', null);
        this.setContollerValue('state', null);
        this.setContollerValue('state_code', null);
        this.postalCodeAdded = false;
      }

      this.postalCode = null;
    });
  }

  // goBack() {
  //   this.router.navigate(["/pages/doctors/doctors-table"]);
  // }
  goBack() {

    if (this.openedByOverlay) {
      this.close();
    } else {
      window.history.back();
    }
  }
  close() {
    this.isOpenChange.emit(!this.openedByOverlay);
  }
}
