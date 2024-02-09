import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DoctorAddress } from '../models/doctor-address.model';
import { StorageService } from './storage.service';

const DOCTOR_ADDRESS_SELECTED_COMPANY = 'selected-company-doctor-address';

@Injectable({
  providedIn: 'root',
})
export class DoctorAddressService {
  apiUrl = `${environment.apiUrl}/api/admin/doctor/address`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  setSelectedCompanyId(id: number) {
    this.storageService.setLocalStorageValue(
      DOCTOR_ADDRESS_SELECTED_COMPANY,
      id
    );
  }

  getSelectedCompanyId() {
    return this.storageService.getLocalStorageValue(
      DOCTOR_ADDRESS_SELECTED_COMPANY
    );
  }

  getAllDoctorAddresses(doctorId: any): Observable<DoctorAddress[]> {
    return this.http
      .get<any>(`${this.apiUrl}/get/1`)
      .pipe(map((res) => res.data));
  }
  getAllAddressesByCompanyId(
    companyId: any,
    page: number,
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/get-address-by-company/${companyId}`, {
        params: { page },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.meta.current_page,
              totalItems: res.meta.total,
              itemsPerPage: res.meta.per_page,
            },
          };
        })
      );
  }
  getAllAddressesByCompanyIdCustom(
    companyId: any,
    page: number,
    paginate: number = 0
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/get-address-by-company/${companyId}`, {
        params: { page, paginate },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
           
          };
        })
      );
  }
  storeDoctorAddress(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, form);
  }

  updateDoctorAddress(form: any, addressId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/${addressId}`, form);
  }

  getDoctorAddressById(addressId: number): Observable<DoctorAddress> {
    return this.http
      .get<any>(`${this.apiUrl}/get-address/${addressId}`)
      .pipe(map((res) => res.data));
  }

  deleteAddress(addressId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${addressId}`);
  }
}
