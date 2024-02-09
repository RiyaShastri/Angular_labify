import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProductDetails } from '../models/product-details.model';
import { CartProduct } from '../models/cart-product.model';
import { GrandTotal } from '../models/grand-total.model';
import { CheckoutPayload } from '../models/chekout-payload.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiUrl = environment.apiUrl;
  cartLength$ = new BehaviorSubject(0);
  cartProducts!: CartProduct[] | undefined;
  subscriptions: Subscription[] = [];
  code: string | undefined = undefined;

  constructor(private http: HttpClient, private authService: AuthService) {
    if (authService.isLoggedIn$.value)
      this.subscriptions.push(this.getCartProducts().subscribe());
  }

  getCartProducts(): Observable<CartProduct[]> {
    return this.http.get<any>(`${this.apiUrl}/cart/all`).pipe(
      map((res) => {
        this.cartLength$.next(res.data.length);
        this.cartProducts = res.data;
        return res.data;
      })
    );
  }

  addToCart(variantId: number) {
    return this.http
      .post(`${this.apiUrl}/cart/add-to-cart`, {
        variantId,
        qty: 1,
      })
      .pipe(
        tap(() => {
          this.subscriptions.push(this.getCartProducts().subscribe());
        })
      );
  }

  updateProductQuantity(cart_id: number, variant_id: number, quantity: number) {
    return this.http.post(`${this.apiUrl}/cart/update`, {
      cart_id,
      variant_id,
      quantity,
    });
  }

  deleteFromCart(cartId: number) {
    return this.http.post(`${this.apiUrl}/cart/delete`, { id: cartId });
  }

  getGrandTotal(code?: string): Observable<GrandTotal> {
    let params: any = {};

    if (code) params = { code };
    else if (this.code) params = { code: this.code };

    return this.http
      .get<any>(`${this.apiUrl}/order/grand-total`, { params })
      .pipe(
        map((res) => {
          if (params.code) this.code = params.code;
          return res.data;
        })
      );
  }

  checkout(payload: any): Observable<number> {
    if (this.code) payload = { ...payload, code: this.code };
    return this.http
      .post<any>(`${this.apiUrl}/order/checkout`, payload)
      .pipe(map((res) => res.data.id));
  }
  checkoutStock(payload: any): Observable<any> {
    if (this.code) payload = { ...payload, code: this.code };
    return this.http
      .post<any>(`${this.apiUrl}/stock/store-deliveries`, payload)
      .pipe(map((res) => res.data.id));
  }
  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
