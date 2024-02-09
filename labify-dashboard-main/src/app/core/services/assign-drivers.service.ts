import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class AssignDriversService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAllOrdersWithoutDrivers(
    page = 1,
    pagination = 1
  ): Observable<{ data: Order[]; pagination: PaginatePipeArgs }> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/order/order-without-driver`, {
        params: { page, pagination },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.current_page,
              totalItems: res.total,
              itemsPerPage: res.per_page,
            },
          };
        })
      );
  }

  getAllDrivers(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/driver/get-all`)
      .pipe(map((res) => res.data));
  }
}
