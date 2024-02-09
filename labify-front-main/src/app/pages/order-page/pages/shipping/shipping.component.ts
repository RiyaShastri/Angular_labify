
// "This component contains stock logic. Currently, it is not in use, but we might consider using it in the future.

import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/core/models/address.model';
import { CartProduct } from 'src/app/core/models/cart-product.model';
import { GrandTotal } from 'src/app/core/models/grand-total.model';
import { AddressService } from 'src/app/core/services/address.service';
import { CartService } from 'src/app/core/services/cart.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { AddEditAddressComponent } from 'src/app/shared/components/add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent {
  subscriptions: Subscription[] = [];
  addresses!: Address[] | undefined;
  deleteId!: number;

  products!: CartProduct[];
  stockProducts!: any;
  loading = false;
  removing = false;

  coupon: string | undefined = undefined;
  grandTotal!: GrandTotal;
  applyingCoupon = false;
  isStock = false;
  selectedAddress!: Address;

  constructor(
    private popupService: PopupService,
    private addressService: AddressService,
    private cartService: CartService,
    private toaster: ToasterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.router.url === '/order/stock/shipping') {
      console.log(this.router.url);
      this.isStock = true;
      this.getStockItems();
    }
  }

  ngOnInit(): void {
    if (this.cartService.cartProducts)
      this.products = this.cartService.cartProducts;
    else {
      this.loading = true;
      this.getCartProducts();
    }

    this.getGrandTotal();
    this.getInitialAddresses();
  }

  getCartProducts() {
    this.subscriptions.push(
      this.cartService.getCartProducts().subscribe({
        next: (res) => {
          this.products = res;
          this.loading = false;
          this.removing = false;
        },
      })
    );
  }
  getStockItems() {
    const items = localStorage.getItem('itemsToSend');
    if (items) {
      this.stockProducts = JSON.parse(items).items;
      console.log(this.stockProducts);
    }
  }
  getInitialAddresses() {
    this.subscriptions.push(
      this.addressService.getAllAddresses().subscribe({
        next: (res) => {
          this.addresses = res;
          this.selectedAddress = this.addresses[0];
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

  getGrandTotal() {
    this.subscriptions.push(
      this.cartService.getGrandTotal(this.coupon).subscribe({
        next: (res) => {
          this.grandTotal = res;
        },
        error: (err) => {
          const errors = err.error.errors;
          if (typeof errors == 'string') this.toaster.showDanger(errors);
          else for (let key in errors) this.toaster.showDanger(errors[key]);
        },
      })
    );
  }

  applyCoupon() {
    if (this.coupon) {
      this.applyingCoupon = true;
      this.subscriptions.push(
        this.cartService.getGrandTotal(this.coupon).subscribe({
          next: (res) => {
            this.applyingCoupon = false;
            this.grandTotal = res;
            this.coupon = undefined;
          },
          error: (err) => {
            this.applyingCoupon = false;
            const errors = err.error.errors;
            if (typeof errors == 'string') this.toaster.showDanger(errors);
            else for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
