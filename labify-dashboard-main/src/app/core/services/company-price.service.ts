import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CompanyPriceService {
  constructor(private http: HttpClient) {}
  getCompanyPrices(companyId: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/company/price/get-price/${companyId}`
    );
  }
  updateMilePrice(form: any ,companyId: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/price/store-price-mile`,
      form
    );
  }
  updatePrice(form: any ,companyId: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/price/update/${companyId}`,
      form
    );
  }
  getCitiesList(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/company/price/get-cities`
    );
  }
  getAllSurcharge(companyId: any): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/api/admin/company/surcharge/get/${companyId}`
      )
      .pipe(
        map((res) =>
          res.data.map((surcharge: any) => {
            return {
              surcharge_id: surcharge.surcharge_id,
              min: surcharge.min,
              max: surcharge.max,
              percentage: surcharge.percentage,
            };
          })
        )
      );
  }
  createSurcharge(form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/surcharge/store`,
      form
    );
  }
  updateSurcharge(form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/surcharge/update`,
      form
    );
  }
  deleteSurcharge(surchargeId: any): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/admin/company/surcharge/delete/${surchargeId}`
    );
  }
}
