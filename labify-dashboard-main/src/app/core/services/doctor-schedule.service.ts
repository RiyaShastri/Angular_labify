import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, scheduled } from "rxjs";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { DoctorSchedule } from "../models/doctor-schedule.model";

@Injectable({
  providedIn: "root",
})
export class DoctorScheduleService {
  apiUrl = `${environment.apiUrl}/api/admin/doctor/schedule`;

  constructor(private http: HttpClient) {}

  getAllDoctorSchedule(addressId: number): Observable<DoctorSchedule[]> {
    return this.http.get<any>(`${this.apiUrl}/get/1`).pipe(
      map((res) =>
        res.data.map((scheduled: any) => {
          return {
            id: 1,
            day: scheduled.day,
            from: scheduled.from,
            to: scheduled.to,
            address: scheduled.address.id,
          };
        })
      )
    );
  }

  storeDoctorSchedule(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, form);
  }

  updateDoctorSchedule(form: any, scheduleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/${scheduleId}`, form);
  }

  getDoctorScheduleById(scheduleId: number): Observable<DoctorSchedule> {
    return this.http.get<any>(`${this.apiUrl}/get-address/${scheduleId}`).pipe(
      map((res) => {
        return {
          id: res.data.id,
          day: res.data.day,
          from: res.data.from,
          to: res.data.to,
          address: res.data.address.id,
        };
      })
    );
  }

  deleteSchedule(scheduleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${scheduleId}`);
  }
}
