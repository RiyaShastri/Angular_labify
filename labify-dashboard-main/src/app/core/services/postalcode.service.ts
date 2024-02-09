import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddressData } from "../models/address-data.model";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostalCodeService {
  constructor(private http: HttpClient) {}

  getAddressData(postal_code: number): Observable<AddressData | null> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/code`, {
        params: {
          postal_code,
        },
      })
      .pipe(
        map((res) => {
          if (res.results.length === 0) return null;

          let data: any = res.results[postal_code][0];
          return {
            country_code: data.country_code,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            postal_code: data.postal_code,
            state: data.state,
            state_code: data.state_code,
          };
        })
      );
  }
}
