// "This component contains stock logic. Currently, it is not in use, but we might consider using it in the future.

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/core/models/address.model';
import { CartProduct } from 'src/app/core/models/cart-product.model';
import { CheckoutPayload } from 'src/app/core/models/chekout-payload.model';
import { GrandTotal } from 'src/app/core/models/grand-total.model';
import { AddressService } from 'src/app/core/services/address.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { AddEditAddressComponent } from 'src/app/shared/components/add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  subscriptions: Subscription[] = [];
  loading = false;
  products!: CartProduct[];
  grandTotal!: GrandTotal;
  coupon: string | undefined = undefined;
  applyingCoupon = false;
  isStock = false;
  paymentMethod: number = 3;
  cardNumber!: number;
  cvc!: number;
  expirationMonth!: number;
  expirationYear!: number;
  stockProducts!: any;

  showValidationErrors = true;
  checkoutClicked = false;
  placingOrder = false;

  constructor(
    private cartService: CartService,
    private toaster: ToasterService,
    private router: Router
  ) {
    if (this.router.url === '/order/stock/payment') {
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
  }

  onPaymentSelect() {
    this.showValidationErrors = this.paymentMethod === 3;
  }

  getCartProducts() {
    this.subscriptions.push(
      this.cartService.getCartProducts().subscribe({
        next: (res) => {
          this.products = res;
          this.loading = false;
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
  getGrandTotal() {
    this.subscriptions.push(
      this.cartService.getGrandTotal(this.coupon).subscribe({
        next: (res) => {
          this.grandTotal = res;
        },
        error: (err) => {
          const errors = err.error.errors;
          for (let key in errors) this.toaster.showDanger(errors[key]);
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
            for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    }
  }

  checkout() {
    this.checkoutClicked = true;
    if (this.isCheckoutValid()) {
      let payload: CheckoutPayload =
        this.paymentMethod === 1
          ? { payment_type_id: this.paymentMethod }
          : {
              payment_type_id: this.paymentMethod,
              card_no: this.cardNumber,
              cvc: `${this.cvc}`,
              exp_month: this.expirationMonth,
              exp_year: this.expirationYear,
            };

      this.placingOrder = true;
      this.subscriptions.push(
        this.cartService.checkout(payload).subscribe({
          next: (orederId) => {
            this.placingOrder = false;
            this.router.navigate(['/order/order-success', orederId]);
            console.log(orederId);
            this.cartService.cartProducts = undefined;
            this.cartService.cartLength$.next(0);
            this.cartService.code = undefined;
          },
          error: (err) => {
            this.placingOrder = false;
            const errors = err.error.errors;
            if (typeof errors == 'string') this.toaster.showDanger(errors);
            else for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    }
  }
  stockCheckOut() {
    this.checkoutClicked = true;
    if (this.isCheckoutValid()) {
      let payload: CheckoutPayload =
        this.paymentMethod === 1
          ? { payment_type_id: this.paymentMethod }
          : {
              payment_type_id: this.paymentMethod,
              card_no: this.cardNumber,
              cvc: `${this.cvc}`,
              exp_month: this.expirationMonth,
              exp_year: this.expirationYear,
            };

      this.placingOrder = true;
      this.subscriptions.push(
        this.cartService.checkout(payload).subscribe({
          next: (orederId) => {
            this.placingOrder = false;
            this.router.navigate(['/profile/deliveries']);
            console.log(orederId);
            this.cartService.cartProducts = undefined;
            this.cartService.cartLength$.next(0);
            this.cartService.code = undefined;
          },
          error: (err) => {
            this.placingOrder = false;
            const errors = err.error.errors;
            if (typeof errors == 'string') this.toaster.showDanger(errors);
            else for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    }
  }
  isCheckoutValid() {
    return (
      this.paymentMethod === 1 ||
      (this.paymentMethod === 3 &&
        this.cardNumber &&
        this.cvc &&
        this.expirationYear &&
        this.expirationMonth)
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
