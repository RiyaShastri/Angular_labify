import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompanyAddress } from '../models/company-address.model';
import { StorageService } from './storage.service';

const COMPANY_ADDRESS_SELECTED_COMPANY = 'selected-company-company-address';

@Injectable({
  providedIn: 'root',
})
export class CompanyAddressService {
  apiUrl = `${environment.apiUrl}/api/admin/company/address`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  setSelectedCompanyId(id: number) {
    this.storageService.setLocalStorageValue(COMPANY_ADDRESS_SELECTED_COMPANY, id);
  }

  getSelectedCompanyId() {
    return this.storageService.getLocalStorageValue(COMPANY_ADDRESS_SELECTED_COMPANY);
  }

  getAllCompanyAddresses(companyId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${companyId}`);
  }

  storeCompanyAddress(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, form);
  }

  updateCompanyAddress(form: any, addressId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/${addressId}`, form);
  }

  getCompanyAddressById(addressId: number): Observable<CompanyAddress> {
    return this.http
      .get<any>(`${this.apiUrl}/get-address/${addressId}`)
      .pipe(map((res) => res.data));
  }

  deleteAddress(addressId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${addressId}`);
  }
}
