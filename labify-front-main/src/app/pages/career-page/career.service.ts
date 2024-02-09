import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  apiUrl = `${environment.apiUrl}/career/create`;

  constructor(private http: HttpClient) {}

  sendData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
