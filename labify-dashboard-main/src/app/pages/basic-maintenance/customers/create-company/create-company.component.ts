import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { DoctorService } from '../../../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from '../../../../core/classes/form-manage';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CompanyService } from '../../../../core/services/company.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ActiveMapService } from '../../../../core/services/active-map.service';
import { AutocompleteComponent } from '../../../../shared/components/google-places.component';
import { NbWindowService } from '@nebular/theme';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss'],
})
export class CreateCompanyComponent extends FormManage implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private windowService: NbWindowService,
    private activeMapService: ActiveMapService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.createCompanyForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        role: new FormControl('company'),
        email_order: new FormControl(this.order_toggel),
        email_pickup: new FormControl(this.pickup_toggel),
        email_delivery: new FormControl(this.delivery_toggel),
        notification_order: new FormControl(this.order_notification),
        notification_pickup: new FormControl(this.pickup_notification),
        notification_delivery: new FormControl(this.delivery_notification),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        data: new FormArray([], Validators.required),
      },
      [this.matchFields('password', 'password_confirmation')]
    );
    this.addDataGroup();
    this.setForm(this.createCompanyForm);
  }
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
  order_toggel: boolean = false;
  pickup_toggel: boolean = false;
  delivery_toggel: boolean = false;
  order_notification: boolean = false;
  pickup_notification: boolean = false;
  delivery_notification: boolean = false;
  id: any;
  company: any = {};
  createCompanyForm!: FormGroup;
  loading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  dataFormArray!: FormArray;
  selectedEmail: number[] = [];

  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  @ViewChild('postalCodeInput') postalCodeInput!: any;
  @ViewChild('stateInput') stateInput!: any;
  @ViewChild('cityInput') cityInput!: any;
  @ViewChild('map') map!: any;
  formData = {
    name: '',
    email: '',
    type: '',
    role: 'company',
    password: '',
    password_confirmation: '',
    data: [
      {
        postal_code: '',
        city: '',
        lat: '',
        long: '',
        state: '',
        phone: '',
        ext: '',
        state_code: '',
        name: '',
        address: '',
        address_2: '',
        room_floor: '',
        suit: '',
        notes: '',
        // Define other fields for the first data group here
      },
    ],
  };

  ngOnInit(): void {}
  @ViewChild('myForm') myForm!: ElementRef;

  ngAfterViewInit() {
    // Add a keyup event listener to the form element
    this.myForm.nativeElement.addEventListener(
      'keyup',
      (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default "Enter" key behavior (form submission)
        }
      }
    );
  }
  toggleEmail(email: any, checked: boolean) {
    console.log(email);
    if (email === 'email_order') {
      this.order_toggel = checked;
      // console.log(this.order_toggel);
      // console.log(this.FormValue);
    } else if (email === 'email_pickup') {
      this.pickup_toggel = checked;
      // console.log(this.FormValue);
    } else {
      this.delivery_toggel = checked;
      // console.log(this.FormValue);
    }
  }
  toggleNotification(notification: any, checked: boolean) {
    // console.log(notification);
    if (notification === 'email_order') {
      this.order_toggel = checked;
      // console.log(this.order_toggel);
      // console.log(this.FormValue);
    } else if (notification === 'email_pickup') {
      this.pickup_toggel = checked;
      // console.log(this.FormValue);
    } else {
      this.delivery_toggel = checked;
      // console.log(this.FormValue);
    }
  }
  createDataGroup() {
    return new FormGroup({
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
  }
  get addresses() {
    return this.createCompanyForm.get('data') as FormArray;
  }
  addDataGroup() {
    // this.dataFormArray = this.createCompanyForm.get('data') as FormArray;
    // this.dataFormArray.push(this.createDataGroup());
    const address = new FormGroup({
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
    this.addresses.push(address);
  }
  deleteAddress(addressIndex: number) {
    this.addresses.removeAt(addressIndex);
  }
  isFormGroup(control: any): control is FormGroup {
    return control instanceof FormGroup;
  }

  openMap() {
    this.postalCodeAdded = true;
  }
  handleAddressChange(address: any, i: any) {
    // Do some stuff
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.pinPosition = { lat: this.latitude, lng: this.longitude };
    this.openMap();
    this.setPinPosition(this.pinPosition);
    // this.map.nativeElement.value=true;
    // Extract state, city, state code, and postal code from address components
    const dataFormArray = this.createCompanyForm.get('data') as FormArray;
    const dataGroupAtIndex = dataFormArray.at(i) as FormGroup;
    // this.setContollerValue('address', address.formatted_address);
    dataGroupAtIndex.get('address')?.setValue(address.formatted_address);
    dataGroupAtIndex.get('lat')?.setValue(address.geometry.location.lat());
    dataGroupAtIndex.get('long')?.setValue(address.geometry.location.lng());

    address.address_components.forEach((component: any) => {
      if (component.types.includes('administrative_area_level_1')) {
        this.state = component.long_name;
        this.stateCode = component.short_name;
        this.stateInput.nativeElement.value = component.long_name;
        this.setContollerValue('state', this.state);
        this.setContollerValue('state_code', this.stateCode);
        dataGroupAtIndex.get('state')?.setValue(this.state);
        dataGroupAtIndex.get('state_code')?.setValue(this.stateCode);
      }
      if (component.types.includes('locality')) {
        this.city = component.long_name;
        this.cityInput.nativeElement.value = component.long_name;
        this.setContollerValue('city', this.city);
        dataGroupAtIndex.get('city')?.setValue(this.city);
      }
      if (component.types.includes('postal_code')) {
        this.postalCode = component.long_name;
        this.postalCodeInput.nativeElement.value = component.long_name;
        this.setContollerValue('postal_code', this.postalCode);
        dataGroupAtIndex.get('postal_code')?.setValue(this.postalCode);
      }
    });
    this.cdr.detectChanges();
    // console.log(this.latitude, this.longitude, this.postalCode, this.state, this.city, address.formatted_address);
    // this.placesRef.options;
  }
  options = {
    types: ['address'],
    componentRestrictions: { country: 'US' }, // Customize as needed
  };

  onAddressSearch(e: any) {
    // console.log(e.target.value);
    this.activeMapService
      .googleMapsAutoFill(e.target.value)
      .subscribe((res: any) => {
        // console.log(res);
      });
  }
  setPinPosition(pinPosition: any) {
    this.setContollerValue('lat', `${pinPosition.lat}`);
    this.setContollerValue('long', `${pinPosition.lng}`);
  }
  onSubmit() {
    this.setContollerValue('data.city', this.city);
    this.setContollerValue('state', this.state);
    this.setContollerValue('postal_code', this.postalCode);
    this.setContollerValue('state_code', this.stateCode);
    console.log(this.FormValue);

    // console.log(this.createCompanyForm.value);
    if (this.isFormValid) {
      this.loading = true;
      this.companyService.createCompany(this.FormValue).subscribe(
        (res) => {
          this.loading = false;
          this.resetForm();
          this.toaster.showSuccess('Company Created successfully');
          this.router.navigate(['/basic-maintenance', 'customers']);
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
  goBack() {
    window.history.back();
  }
  cancel() {
    this.router.navigate(['/basic-maintenance', 'customers']);
  }
  onEnter(event: KeyboardEvent) {
    // Prevent the default "Enter" key behavior (form submission)
    event.preventDefault();
  }
}
