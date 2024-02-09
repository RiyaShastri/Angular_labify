import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartProduct } from 'src/app/core/models/cart-product.model';
import { GrandTotal } from 'src/app/core/models/grand-total.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  subscriptions: Subscription[] = [];
  products!: CartProduct[];
  removingId!: number;
  removing = false;
  loading = false;
  coupon: string | undefined = undefined;
  grandTotal!: GrandTotal;
  applyingCoupon = false;

  constructor(
    private cartService: CartService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.cartService.cartProducts?.length) {
      this.products = this.cartService.cartProducts;
      this.getGrandTotal();
    } else {
      this.getCartProducts();
    }
  }

  getCartProducts() {
    this.subscriptions.push(
      this.cartService.getCartProducts().subscribe({
        next: (res) => {
          this.products = res;
          this.removing = false;
          if (this.products && this.products.length) this.getGrandTotal();
          else this.loading = false;
        },
      })
    );
  }

  quantityChange(quantity: number, product: CartProduct) {
    this.subscriptions.push(
      this.cartService
        .updateProductQuantity(product.id, product.variant.id, quantity)
        .subscribe({
          next: () => {
            this.getGrandTotal();
          },
        })
    );
  }

  removeFromCart() {
    this.removing = true;
    this.subscriptions.push(
      this.cartService.deleteFromCart(this.removingId).subscribe({
        next: () => {
          this.getCartProducts();
        },
      })
    );
  }

  getGrandTotal() {
    this.subscriptions.push(
      this.cartService.getGrandTotal(this.coupon).subscribe({
        next: (res) => {
          this.grandTotal = res;
          this.loading = false;
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

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
