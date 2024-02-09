import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OldMapOrder } from '../models/map-order.model';

@Injectable({
  providedIn: 'root',
})
export class ActiveMapService {
  apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAllOrders(companyId: number, date?: string): Observable<OldMapOrder[]> {
    let options = {};
    if (date) options = { params: { date } };
    return this.http.get<any>(
      `${this.apiUrl}/admin/map/get/${companyId}`,
      options
    );
  }
  googleMapsAutoFill(term:string): Observable<any[]> {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${term}&types=geocode&key=AIzaSyBvBFvz1U4Kl2RRGJq-AI0k53FY4bmXCOU`)
  }
}
