import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root',
})
export class ScheduleOrderService {
  apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getOrdersOfCompany(page: any, companyId: any, search?: any): Observable<any> {
    const queryParams = { params: search ? { ...search, page } : { page } };
    return this.http
      .get<any>(
        `${this.apiUrl}/order/order-schedule/get/${companyId}`,
        queryParams
      )
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

  getAllOrders(page: any, search?: any): Observable<any> {
    const queryParams = { params: search ? { ...search, page } : { page } };
    return this.http
      .get<any>(`${this.apiUrl}/order/order-schedule/get-all`, queryParams)
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
  getAllNewOrders(page: any, search?: any): Observable<any> {
    const queryParams = { params: search ? { ...search, page } : { page } };
    return this.http
      .get<any>(`${this.apiUrl}/order/order-schedule/get-all`, queryParams)
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
  createOrder(form: any, companyId: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/order/store/${companyId}`, form)
      .pipe(map((res) => res.data));
  }

  createScheduleOrder(form: any, companyId: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/order/schedule/store/${companyId}`,
      form
    );
  }

  assignDriver(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order/assign-driver`, form).pipe(
      tap(() => {
        this.socketService.emitEvent('drivers-updated');
      })
    );
  }

  getOrderById(orderId: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/order/order-schedule/show/${orderId}`
    );
  }

  updateStatus(order_id: any, form: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/order/update-status/${order_id}`,
      form
    );
  }

  updateOrder(form: any, orderId: number) {
    return this.http.post<any>(
      `${this.apiUrl}/order/order-schedule/update/${orderId}`,
      form
    );
  }
  deleteOrder(orderId:any){
    return this.http.delete<any>(`${this.apiUrl}/order/order-schedule/destroy/${orderId}`);
  }
  getAllAddresses(company_id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/order/get-all-address/${company_id}`
    );
  }

  getExcel(company_id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/lead-template`);
  }
}
