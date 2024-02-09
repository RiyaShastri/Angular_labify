import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { City } from '../models/city.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Driver } from '../models/driver.model';
import { DriverDetails, DriverOrder } from '../models/driver-details.model';
import { DriverName } from '../models/driver-name.model';
import { DriverLocation } from '../models/driver-location.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getAllCities(): Observable<City[]> {
    return this.http
      .get<any>(`${this.apiUrl}/company/price/get-cities`)
      .pipe(map((res) => res.data));
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.http
      .get<any>(`${this.apiUrl}/driver/get`)
      .pipe(map((res) => res.data));
  }

  getDriverById(driverId: number): Observable<Driver> {
    return this.http
      .get<any>(`${this.apiUrl}/driver/get-driver/${driverId}`)
      .pipe(map((res) => res.data));
  }

  createDriver(form: any): Observable<Driver> {
    return this.http
      .post<any>(`${this.apiUrl}/driver/store`, form)
      .pipe(map((res) => res.data));
  }

  updateDriver(driverId: number, form: any): Observable<Driver> {
    return this.http
      .post<any>(`${this.apiUrl}/driver/update/${driverId}`, form)
      .pipe(map((res) => res.data));
  }

  deleteDriver(driverId: number): Observable<string> {
    return this.http
      .delete<any>(`${this.apiUrl}/driver/delete/${driverId}`)
      .pipe(map((res) => res.message));
  }

  getDriverDetails(driverId: number): Observable<DriverDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/driver/${driverId}/current-details`)
      .pipe(map((res) => res.data));
  }

  getDriversByStatus(status: 'active' | 'idle' | 'assigned'): Observable<{
    data: DriverName[];
    active_count: number;
    idle_count: number;
    assigned_count: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/driver/${status}`);
  }

  getActiveDriverLocations(driverId: number): Observable<DriverLocation> {
    return this.http.get<any>(`${this.apiUrl}/driver/${driverId}/locations`);
  }

  unassignDriver(orderId: number) {
    return this.http
      .post(`${this.apiUrl}/order/unassign-driver/${orderId}`, {})
      .pipe(
        tap(() => {
          this.socketService.emitEvent('orders-updated');
          this.socketService.emitEvent('drivers-updated');
        })
      );
  }

  getDriverOrdersByDate(
    driverId: number,
    date: Date
  ): Observable<DriverDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/driver/${driverId}/orders`, {
        params: {
          date: this.getFormattedDate(date),
        },
      })
      .pipe(map((res) => res.data));
  }

  private getFormattedDate(date: Date) {
    const formattedDate = date.toISOString().slice(0, 10);
    console.log(formattedDate);
    return formattedDate;
  }
}
