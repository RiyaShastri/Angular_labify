import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { City } from 'src/app/core/models/city.model';
import { AddressService } from 'src/app/core/services/address.service';
import { FormManage } from '../../classes/form-manage';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.scss'],
})
export class AddEditAddressComponent implements OnInit, OnDestroy {
  currentState!: 'add' | 'edit';

  subscriptions: Subscription[] = [];
  allCities: City[] = [];
  allDistricts: City[] = [];

  addressId!: number;
  postalCode!: number | null;
  address!: string | null;
  districtId!: number;
  cityId!: number;

  loading = false;
  showFormValidation = false;

  constructor(
    private addressService: AddressService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.initState();
    this.getAllCities();
  }

  initState() {
    this.currentState = this.addressService.currentState;

    if (this.currentState === 'edit') {
      this.addressId = this.addressService.editAddress.id;
      this.postalCode = this.addressService.editAddress.postal_code;
      this.address = this.addressService.editAddress.address;
    }
  }

  getAllCities() {
    this.subscriptions.push(
      this.addressService.getAllCities().subscribe({
        next: (res) => {
          this.allCities = res;
          this.cityId = this.allCities[0].id;
          if (this.currentState === 'edit')
            this.cityId = this.addressService.editAddress.district.city.id;
          this.getAllDistricts(this.cityId);
        },
      })
    );
  }

  getAllDistricts(cityId: number) {
    this.subscriptions.push(
      this.addressService.getAllDistricts(cityId).subscribe({
        next: (res) => {
          this.allDistricts = res;
          if (this.currentState === 'edit')
            this.districtId = this.addressService.editAddress.district.id;
          else this.districtId = this.allDistricts[0].id;
        },
      })
    );
  }

  onCitySelect() {
    this.subscriptions.push(
      this.addressService.getAllDistricts(this.cityId).subscribe({
        next: (res) => {
          this.allDistricts = res;
          this.districtId = this.allDistricts[0].id;
        },
      })
    );
  }

  createAddress() {
    this.loading = true;
    this.subscriptions.push(
      this.addressService
        .createAddress(this.districtId, this.address!!, this.postalCode!!)
        .subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
            this.subscriptions.push(
              this.addressService.getAllAddresses().subscribe()
            );
            this.popupService.closePopups();
          },
        })
    );
  }

  editAddress() {
    this.loading = true;
    this.subscriptions.push(
      this.addressService
        .updateAddress(
          this.addressId,
          this.districtId,
          this.address!!,
          this.postalCode!!
        )
        .subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
            this.subscriptions.push(
              this.addressService.getAllAddresses().subscribe()
            );
            this.popupService.closePopups();
          },
        })
    );
  }

  onSubmit() {
    if (this.address && this.postalCode) {
      if (this.currentState === 'add') this.createAddress();
      else this.editAddress();
    } else this.showFormValidation = true;
  }

  resetForm() {
    this.address = null;
    this.postalCode = null;
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
