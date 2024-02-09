import { ChangeDetectorRef, Component, OnInit, Optional, ViewChild } from '@angular/core';
import { PostalCodeService } from 'src/app/core/services/postalcode.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormManage } from 'src/app/core/classes/form-manage';
import { CompanyService } from 'src/app/core/services/company.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { Router } from '@angular/router';
//@ts-ignore
import { NbWindowService, NbWindowRef } from '@nebular/theme';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ActiveMapService } from '../../../../core/services/active-map.service';
import { AutocompleteComponent } from '../../../../shared/components/google-places.component';
@Component({
  selector: 'ngx-store-company-address',
  templateUrl: './store-company-address.component.html',
  styleUrls: ['./store-company-address.component.scss'],
})
export class StoreCompanyAddressComponent extends FormManage implements OnInit {
  pinPosition = {
    lat: 37.0902,
    lng: -95.7129,
  };
  postalCode!: number | null;
  postalCodeAdded = false;
  showPostalcodeError = false;
  addressForm!: FormGroup;
  companyId!: number;
  showPostalCodeAlert = false;
  city!: any;
  state!: any;
  companyName: any;
  latitude: any;
  longitude: any;
  stateCode: any;
  // placesRef:any;
  constructor(
    private postalCodeService: PostalCodeService,
    private companyService: CompanyService,
    private toasterService: ToasterService,
    private companyAddressService: CompanyAddressService,
    private windowService: NbWindowService,
    private activeMapService: ActiveMapService,
    private cdr: ChangeDetectorRef,
    @Optional() public windowRef?: NbWindowRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initAddressForm();
  }
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  @ViewChild('postalCodeInput') postalCodeInput !: any;
  @ViewChild('stateInput') stateInput !: any;
  @ViewChild('cityInput') cityInput !: any;
  @ViewChild('map') map !: any;

  options = {
    types: ['address'],
    componentRestrictions: { country: 'US' } // Customize as needed
  };
  openMap(){
    this.postalCodeAdded = true;
  }
  handleAddressChange(address: any) {
    // Do some stuff
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.pinPosition = { lat:this.latitude, lng: this.longitude };
    this.openMap();
    this.setPinPosition(this.pinPosition);
    // this.map.nativeElement.value=true;
    // Extract state, city, state code, and postal code from address components
    this.setContollerValue('address',address.formatted_address)
    address.address_components.forEach((component: any) => {
      if (component.types.includes('administrative_area_level_1')) {
        this.state = component.long_name;
        this.stateCode = component.short_name;
        this.stateInput.nativeElement.value = component.long_name;
        this.setContollerValue('state', this.state);
        this.setContollerValue('state_code', this.stateCode);
      }
      if (component.types.includes('locality')) {
        this.city = component.long_name;
        this.cityInput.nativeElement.value = component.long_name;
        this.setContollerValue('city', this.city);

      }
      if (component.types.includes('postal_code')) {
        this.postalCode = component.long_name;
        this.postalCodeInput.nativeElement.value =component.long_name;
        this.setContollerValue('postal_code', this.postalCode);

      }
    });
    this.cdr.detectChanges();

    // console.log(this.latitude,this.longitude,this.postalCode,this.state,this.city,address.formatted_address);
    // this.placesRef.options;
  }
  initAddressForm() {
    this.addressForm = new FormGroup({
      user_id: new FormControl(
        this.companyAddressService.getSelectedCompanyId(),
        Validators.required
      ),
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
  onAddressSearch(e: any) {
    // console.log(e.target.value);
    this.activeMapService.googleMapsAutoFill(e.target.value).subscribe((res: any) => {
      // console.log(res);
    })
  }
  setPinPosition(pinPosition: any) {
    this.setContollerValue('lat', `${pinPosition.lat}`);
    this.setContollerValue('long', `${pinPosition.lng}`);
  }

  onSubmit() {

    if (this.isFormValid) {
      this.setContollerValue('city', this.city);
      this.setContollerValue('state', this.state);
      this.setContollerValue('postal_code', this.postalCode);
      this.companyAddressService.storeCompanyAddress(this.FormValue).subscribe(
        (res) => {
          this.toasterService.showSuccess('Company address saved successfully');
          if (this.windowRef) {
            location.reload();
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
    if (this.postalCode) {
      let isNumber =
        !isNaN(parseFloat(`${this.postalCode}`)) && !isNaN(this.postalCode - 0);

      return isNumber;
    }
    return false;
  }

  // listenToCompanyChanges() {
  //   this.companyService.getSelectedCompany().subscribe((companyId) => {
  //     if (this.companyId != companyId) this.goBack();
  //
  //   });

  // }

  getAddressData() {
    if (this.postalCode)
      this.postalCodeService
        .getAddressData(this.postalCode)
        .subscribe((res) => {
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
            this.toasterService.showDanger(
              'Invalid postalcode try anothor one'
            );
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

  goBack() {
    if (this.windowRef) {
      this.close();
    } else {
      window.history.back();
    }
  }
  close() {
    this.windowRef?.close();
  }
}
