import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  contact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact-us/create`, data);
  }

  driver(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/drive-us/create`, data);
  }
}
