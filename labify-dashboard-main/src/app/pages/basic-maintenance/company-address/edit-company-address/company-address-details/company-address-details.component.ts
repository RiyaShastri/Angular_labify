import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from 'src/app/core/classes/form-manage';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { PostalCodeService } from 'src/app/core/services/postalcode.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CompanyAddress } from 'src/app/core/models/company-address.model';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: 'ngx-company-address-details',
  templateUrl: './company-address-details.component.html',
  styleUrls: ['./company-address-details.component.scss'],
})
export class CompanyAddressDetailsComponent
  extends FormManage
  implements OnInit {
  addressDetails!: CompanyAddress;
  pinPosition = {
    lat: 37.0902,
    lng: -95.7129,
  };
  postalCode!: string | null;
  postalCodeAdded = false;
  showPostalcodeError = false;
  addressForm!: FormGroup;
  showPostalCodeAlert = false;
  latitude: any;
  longitude: any;
  state: any;
  stateCode: any;
  city: any;
  address!: string;

  constructor(
    private postalCodeService: PostalCodeService,
    private companyService: CompanyService,
    private toasterService: ToasterService,
    private companyAddressService: CompanyAddressService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAddressDetails();

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
  handleAddressChange(address: any) {
    // Do some stuff
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.pinPosition = { lat: this.latitude, lng: this.longitude };
    // this.openMap();
    this.setPinPosition(this.pinPosition);
    // this.map.nativeElement.value=true;
    // Extract state, city, state code, and postal code from address components
    this.setContollerValue('address', address.formatted_address)
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
        this.postalCodeInput.nativeElement.value = component.long_name;
        this.setContollerValue('postal_code', this.postalCode);

      }
    });
    this.cdr.detectChanges();

    // console.log(this.latitude, this.longitude, this.postalCode, this.state, this.city, address.formatted_address);
    // this.placesRef.options;
  }
  getAddressDetails() {
    this.activatedRoute.params.subscribe((params) => {
      const addressId = params['addressId'];
      this.companyAddressService
        .getCompanyAddressById(addressId)
        .subscribe((data) => {
          // console.log(data);
          this.addressDetails = data;
          this.postalCode= this.addressDetails.postal_code;
          this.city=this.addressDetails.city.city;
          this.state=this.addressDetails.state.state;
          this.address=this.addressDetails.address;
          this.initAddressForm();
          this.pinPosition = {
            lat: +this.addressDetails.lat,
            lng: +this.addressDetails.long,
          };
          this.cdr.detectChanges();

          this.setPinPosition(this.pinPosition);
        });
    });
  }

  setPinPosition(pinPosition: any) {
    this.setContollerValue('lat', `${pinPosition.lat}`);
    this.setContollerValue('long', `${pinPosition.lng}`);
  }

  initAddressForm() {
    this.addressForm = new FormGroup({
      user_id: new FormControl(
        this.addressDetails.user_id,
        Validators.required
      ),
      address_id: new FormControl(this.addressDetails.id, Validators.required),
      state_id:new FormControl(this.addressDetails.state.id),
      city_id:new FormControl(this.addressDetails.city.id),
      postal_code: new FormControl(
        this.addressDetails.postal_code
      ),
      city: new FormControl(this.addressDetails.city.city, Validators.required),
      lat: new FormControl(this.addressDetails.lat, Validators.required),
      long: new FormControl(this.addressDetails.long),
      state: new FormControl(
        this.addressDetails.state.state
      ),
      phone: new FormControl(this.addressDetails.phone),
      ext: new FormControl(this.addressDetails.ext),

      state_code: new FormControl(
        this.addressDetails.state.state_code,
        Validators.required
      ),

      name: new FormControl(this.addressDetails.name, Validators.required),
      address: new FormControl(
        this.addressDetails.address,
        Validators.required
      ),
      address_2: new FormControl(
        this.addressDetails.address_2),
      room_floor: new FormControl(
        this.addressDetails.room_floor),
      suit: new FormControl(
          this.addressDetails.suit),
      notes: new FormControl(this.addressDetails.notes),
    });

    this.setForm(this.addressForm);
  }

  onSubmit() {
    // console.log("test");
      this.setContollerValue('city', this.city);
      this.setContollerValue('state', this.state);
      this.setContollerValue('postal_code', this.postalCode);
      this.companyAddressService
        .updateCompanyAddress(this.FormValue, this.addressDetails.id)
        .subscribe(
          (res) => {
            this.toasterService.showSuccess('Your changes saved successfully');
            this.goBack()
            this.router.navigate([
              'basic-maintenance/company-address',
              this.addressDetails.company.id,
            ]);
          },
          (err) => {
            this.toasterService.showDanger(err.error.message);
          }
        );

  }

  // onPostalcodeChange() {
  //   this.showPostalcodeError = !this.isPostalCodeNumber();
  // }

  // isPostalCodeNumber() {
  //   if (this.postalCode) {
  //     let isNumber =

  //     return isNumber;
  //   }
  //   return false;
  // }

  // getAddressData() {
  //   if (this.postalCode)
  //     this.postalCodeService
  //       .getAddressData(this.postalCode)
  //       .subscribe((res) => {
  //         if (res) {
  //           this.setContollerValue('postal_code', res.postal_code);
  //           this.setContollerValue('city', res.city);
  //           this.setContollerValue('lat', `${res.latitude}`);
  //           this.setContollerValue('long', `${res.longitude}`);
  //           this.setContollerValue('state', res.state);
  //           this.setContollerValue('state_code', res.state_code);
  //           this.pinPosition = { lat: res.latitude, lng: res.longitude };
  //           this.postalCodeAdded = true;
  //           this.showPostalCodeAlert = false;
  //         } else {
  //           this.toasterService.showDanger(
  //             'Invalid postalcode try anothor one'
  //           );
  //           this.postalCodeAdded = false;
  //         }

  //         this.postalCode = null;
  //       });
  // }
  goBack() {
    window.history.back();
  }
}
