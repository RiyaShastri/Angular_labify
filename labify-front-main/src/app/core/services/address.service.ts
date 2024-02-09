import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { City } from '../models/city.model';
import { Address } from '../models/address.model';
import { AddressParams } from '../models/address-params.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  apiUrl = environment.apiUrl;
  currentState: 'add' | 'edit' = 'add';
  editAddress!: Address;

  allAddresses$!: BehaviorSubject<Address[]>;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCities(): Observable<City[]> {
    return this.http
      .get<any>(`${this.apiUrl}/city/all`)
      .pipe(map((res) => res.data.data));
  }

  getAllDistricts(cityId: number): Observable<City[]> {
    return this.http
      .get<any>(`${this.apiUrl}/district/all`, { params: { city_id: cityId } })
      .pipe(map((res) => res.data.data));
  }

  getAllAddresses(): Observable<Address[]> {
    return this.http.get<any>(`${this.apiUrl}/customer/get`).pipe(
      map((res) => {
        if (this.allAddresses$) this.allAddresses$.next(res.data.addresses);
        else this.allAddresses$ = new BehaviorSubject(res.data.addresses);
        return res.data.addresses;
      })
    );
  }

  createAddress(
    district_id: number,
    address: string,
    postal_code: number,
  ) {
    let addresses: AddressParams[] = [];
    for (let address of this.allAddresses$.value) {
      addresses.push({
        address: address.address,
        address_id: address.id,
        district_id: address.district.id,
        postal_code: address.postal_code
      });
    }

    return this.http.post(`${this.apiUrl}/customer/update`, {
      id: this.authService.getUserFromStorage()?.id,
      postal_code,
      addresses: [...addresses, { district_id, address ,postal_code}],
    });
  }

  updateAddress(
    address_id: number,
    district_id: number,
    address: string,
    postal_code: number,
  ) {
    let addresses: AddressParams[] = [];
    for (let adrs of this.allAddresses$.value) {
      if (adrs.id !== address_id)
        addresses.push({
          address: adrs.address,
          address_id: adrs.id,
          district_id: adrs.district.id,
          postal_code:adrs.postal_code
        });
      else
        addresses.push({
          address_id,
          district_id,
          address,
          postal_code,
        });
    }

    return this.http.post(`${this.apiUrl}/customer/update`, {
      id: this.authService.getUserFromStorage()?.id,
      postal_code,
      addresses,
    });
  }

  deleteAddress(addressId: number) {
    let addresses: AddressParams[] = [];
    for (let adrs of this.allAddresses$.value) {
      if (adrs.id !== addressId)
        addresses.push({
          address: adrs.address,
          address_id: adrs.id,
          district_id: adrs.district.id,
          postal_code:adrs.postal_code
        });
    }

    return this.http.post(`${this.apiUrl}/customer/update`, {
      id: this.authService.getUserFromStorage()?.id,
      addresses,
    });
  }
}
