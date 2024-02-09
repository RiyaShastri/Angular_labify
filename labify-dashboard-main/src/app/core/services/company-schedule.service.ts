import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyName } from '../models/company-names.model';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CompanyScheduleService {
  constructor(private http: HttpClient) {}
  getCompanyAllSchedule(addressId: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/company/schedule/get/${addressId}`
    );
  }
  deleteSchedule(addressId: any): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/admin/company/schedule/delete/${addressId}`
    );
  }
  updateSchedule(scheduleId: any, form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/schedule/update/${scheduleId}`,
      form
    );
  }
  createSchedule(form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/schedule/store`,
      form
    );
  }
}
