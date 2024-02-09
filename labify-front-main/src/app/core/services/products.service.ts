import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ProductDetails } from '../models/product-details.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(page: number): Observable<{
    data: Product[];
    pagination: { current_page: number; per_page: number; total: number };
  }> {
    return this.http
      .get<any>(`${this.apiUrl}/product/all`, { params: { page } })
      .pipe(
        map((res) => {
          return {
            data: res.data.data,
            pagination: {
              current_page: res.data.meta.current_page,
              per_page: res.data.meta.per_page,
              total: res.data.meta.total,
            },
          };
        })
      );
  }

  getSimilarProducts(categoryId: number): Observable<Product[]> {
    return this.http
      .get<any>(`${this.apiUrl}/product/all`, {
        params: { category: categoryId },
      })
      .pipe(map((res) => res.data.data));
  }

  getProductById(productId: number): Observable<ProductDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/product/get`, {
        params: { id: productId },
      })
      .pipe(
        map((res) => {
          let product: ProductDetails = { ...res.data };
          return product;
        })
      );
  }

  getEmployees(): Observable<any[]> {
    return of();
  }
}
