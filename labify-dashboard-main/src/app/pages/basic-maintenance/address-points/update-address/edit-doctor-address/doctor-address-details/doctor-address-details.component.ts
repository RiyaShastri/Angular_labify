import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormManage } from "../../../../../../core/classes/form-manage";
import { CompanyAddress } from "../../../../../../core/models/company-address.model";
import { CompanyAddressService } from "../../../../../../core/services/company-address.service";
import { CompanyService } from "../../../../../../core/services/company.service";
import { PostalCodeService } from "../../../../../../core/services/postalcode.service";
import { ToasterService } from "../../../../../../core/services/toaster.service";
import { DoctorAddressService } from "../../../../../../core/services/doctor-address.service";
import { DoctorAddress } from "../../../../../../core/models/doctor-address.model";
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: "ngx-doctor-address-details",
  templateUrl: "./doctor-address-details.component.html",
  styleUrls: ["./doctor-address-details.component.scss"],
})
export class DoctorAddressDetailsComponent
  extends FormManage
  implements OnInit
{
  addressDetails!: DoctorAddress;
  pinPosition = {
    lat: 37.0902,
    lng: -95.7129,
  };
  postalCode!: any;
  postalCodeAdded = false;
  showPostalcodeError = false;
  addressForm!: FormGroup;
  showPostalCodeAlert = false;
  city: any;
  state: any;
  address: any;

  constructor(
    private postalCodeService: PostalCodeService,
    private companyService: CompanyService,
    private toasterService: ToasterService,
    private doctorAddressService: DoctorAddressService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,

  ) {
    super();
  }

  ngOnInit(): void {
    this.getAddressDetails();
  }
  options = {
    types: ['address'],
    componentRestrictions: { country: 'US' } // Customize as needed

  };

  getAddressDetails() {
    this.activatedRoute.params.subscribe((params) => {
      const addressId = params["id"];
      // console.log(addressId);
      this.doctorAddressService
        .getDoctorAddressById(addressId)
        .subscribe((data) => {
          // console.log(data);
          this.addressDetails = data;
          this.postalCode=parseFloat( this.addressDetails.postal_code);
          this.city=this.addressDetails.city.city;
          this.state=this.addressDetails.state.state;
          this.address=this.addressDetails.address;
          // console.log(this.addressDetails);
          this.initAddressForm();
          this.pinPosition = {
            lat: +this.addressDetails.lat,
            lng: +this.addressDetails.long,
          };

          this.setPinPosition(this.pinPosition);
        });
    });
  }

  setPinPosition(pinPosition: any) {
    this.setContollerValue("lat", `${pinPosition.lat}`);
    this.setContollerValue("long", `${pinPosition.lng}`);
  }

  initAddressForm() {
    this.addressForm = new FormGroup({
      doctor_id: new FormControl(
        this.addressDetails.doctor.id,
        Validators.required
      ),
      address_id: new FormControl(this.addressDetails.id, Validators.required),
      postal_code: new FormControl(
        this.addressDetails.postal_code
      ),
      state_id:new FormControl(this.addressDetails.state.id),
      city_id:new FormControl(this.addressDetails.city.id),
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
    if (this.isFormValid) {
      this.setContollerValue('city', this.city);
      this.setContollerValue('state', this.state);
      this.setContollerValue('postal_code', this.postalCode);
      this.doctorAddressService
        .updateDoctorAddress(this.FormValue, this.addressDetails.id)
        .subscribe(
          (res) => {
            this.toasterService.showSuccess("Your changes saved successfully");
          },
          (err) => {
            this.toasterService.showDanger("Error while saving your changes");
          }
        );
    } else {
      this.markAllFeildsTouched();

      if (
        !this.getControllerValue("postal_code") &&
        !this.isPostalCodeNumber()
      ) {
        this.showPostalcodeError = true;
      }

      if (
        this.isFieldValid("name") &&
        this.isFieldValid("address") &&
        this.isFieldValid("room_floor") &&
        this.isFieldValid("notes")
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
        this.setContollerValue("postal_code", res.postal_code);
        this.setContollerValue("city", res.city);
        this.setContollerValue("lat", `${res.latitude}`);
        this.setContollerValue("long", `${res.longitude}`);
        this.setContollerValue("state", res.state);
        this.setContollerValue("state_code", res.state_code);
        this.pinPosition = { lat: res.latitude, lng: res.longitude };
        this.postalCodeAdded = true;
        this.showPostalCodeAlert = false;
      } else {
        this.toasterService.showDanger("Invalid postalcode try anothor one");
        this.postalCodeAdded = false;
      }

      this.postalCode = null;
    });
  }
  goBack() {
    window.history.back();
  }
}
