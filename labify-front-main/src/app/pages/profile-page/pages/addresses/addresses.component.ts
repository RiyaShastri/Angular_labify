import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/core/models/address.model';
import { AddressService } from 'src/app/core/services/address.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { AddEditAddressComponent } from 'src/app/shared/components/add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnDestroy, OnInit {
  subscriptions: Subscription[] = [];
  addresses!: Address[] | undefined;
  deleteId!: number;

  constructor(
    private popupService: PopupService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.getInitialAddresses();
  }

  getInitialAddresses() {
    this.subscriptions.push(
      this.addressService.getAllAddresses().subscribe({
        next: (res) => {
          this.addresses = res;
          this.subscribeToAddressesChanges();
        },
      })
    );
  }

  subscribeToAddressesChanges() {
    this.subscriptions.push(
      this.addressService.allAddresses$.subscribe((res) => {
        this.addresses = res;
        console.log(res);
      })
    );
  }

  deleteAddress() {
    this.subscriptions.push(
      this.addressService.deleteAddress(this.deleteId).subscribe({
        next: () => {
          this.subscriptions.push(
            this.addressService.getAllAddresses().subscribe()
          );
        },
      })
    );
  }

  openAddEditAddress(state: 'add' | 'edit', editAddress?: Address) {
    this.addressService.currentState = state;
    if (editAddress) this.addressService.editAddress = editAddress;

    this.popupService.openPopup(AddEditAddressComponent, {
      centered: true,
      size: 'md',
    });
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
