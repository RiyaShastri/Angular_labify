import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginatePipeArgs } from 'ngx-pagination';

@Injectable({
  providedIn: 'root',
})
export class DefaultPricesService {
  private apiUrl = `${environment.apiUrl}/api/admin/setting`;

  constructor(private http: HttpClient) {}

  createPrice(data: any) {
    return this.http.post(`${this.apiUrl}/store`, data);
  }
  createMilePrice(data: any) {
    return this.http.post(`${this.apiUrl}/store-mile`,data);
  }
  createDefault(data: any) {
    return this.http.post(`${this.apiUrl}/defualt-new-city-price`,data);
  }
  createSurcharge(data: any[]) {
    return this.http.post(`${this.apiUrl}/surcharge/store`, {
      data,
    });
  }

  getAllPrices(
    page: number,
    type: 'city' | 'mile'
  ): Observable<{ data: any[]; pagination: PaginatePipeArgs }> {
    return this.http
      .get<any>(`${this.apiUrl}/get-all`, {
        params: { type, page },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.current_page,
              totalItems: res.total,
              itemsPerPage: res.per_page,
            },
          };
        })
      );
  }
  getDefaultCityPrice(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/get-defualt-new-city-price`);
  }
  getAllSurcharge(page: number) {
    return this.http
      .get<any>(`${this.apiUrl}/surcharge/get-all`, {
        params: { page },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.current_page,
              totalItems: res.total,
              itemsPerPage: res.per_page,
            },
          };
        })
      );
  }

  getCurrentSurcharge() {
    return this.http.get<any>(
      `${this.apiUrl}/surcharge/get-surchage-value`
    );
  }
  storeCity(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-new-city`, form);
  }
}
