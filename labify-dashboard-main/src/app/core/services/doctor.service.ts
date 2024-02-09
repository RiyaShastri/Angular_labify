import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient) {}
  getAllDoctors(companyId: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/doctor/get/${companyId}`
    );
  }
  createDoctor(form: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/admin/doctor/store`, form);
  }
  deleteDoctor(id: any): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/admin/doctor/delete/${id}`
    );
  }
  editeDoctor(id: any, form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/doctor/update/${id}`,
      form
    );
  }
  getDoctorById(id: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/doctor/get-doctor/${id}`
    );
  }
}
