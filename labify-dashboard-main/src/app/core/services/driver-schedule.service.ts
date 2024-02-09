import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DriverSchedule } from '../models/driver-schedule.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverScheduleService {
  apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  createSchedule(driver_id: number, schedule: DriverSchedule[]) {
    return this.http.post(`${this.apiUrl}/admin/driver/schedule/add-schedule`, {
      ...schedule,
      driver_id,
    });
  }

  updateSchedule(driver_id: number, data: any[]) {
    return this.http.post(
      `${this.apiUrl}/admin/driver/schedule/update-schedule`,
      {
        data,
        driver_id,
      }
    );
  }

  deleteSchedule(driverId: number) {
    return this.http.delete(
      `${this.apiUrl}/admin/driver/schedule/delete-schedule/${driverId}`
    );
  }

  getAllSchedules(driverId: number): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.apiUrl}/admin/driver/schedule/all-schedules/${driverId}`
      )
      .pipe(
        map((res) =>
          res.data.map((schedule: any) => {
            return {
              to: schedule.to,
              from: schedule.from,
              day: schedule.day,
              id: schedule.id,
            };
          })
        )
      );
  }
}
