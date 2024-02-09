import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient, private socketService: SocketService) {}
  getOrdersOfCompany(
    page: number,

    companyId: any,

    search?: any
  ): Observable<any> {
    const queryParams = { params: search ? { ...search, page } : { page } };
    return this.http

      .get<any>(`${this.apiUrl}/order/get/${companyId}`, queryParams)

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
    return this.http.get<any>(`${this.apiUrl}/order/get-all`, queryParams).pipe(
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
    // console.log('test' + search);

    const queryParams = { params: search ? { ...search, page } : { page } };
    return this.http.get<any>(`${this.apiUrl}/order/get-all`, queryParams).pipe(
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
      .pipe(
        map((res) => {
          this.socketService.emitEvent('orders-updated');
          return res.data;
        })
      );
  }
  updateOrder(form: any, orderId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order/update/${orderId}`, form);
  }
  createScheduleOrder(form: any, companyId: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/order/order-schedule/store/${companyId}`, form)
      .pipe(
        tap(() => {
          this.socketService.emitEvent('orders-updated');
        })
      );
  }
  assignDriver(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order/assign-driver`, form).pipe(
      tap(() => {
        this.socketService.emitEvent('drivers-updated');
      })
    );
  }

  updateStatus(order_id: any, form: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/order/update-status/${order_id}`, form)
      .pipe(
        tap(() => {
          this.socketService.emitEvent('orders-updated');
          this.socketService.emitEvent('drivers-updated');
        })
      );
  }
  updateStatusPieces(form: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/order/update-pieces`, form)
      .pipe(
        tap(() => {
          this.socketService.emitEvent('orders-updated');
          this.socketService.emitEvent('drivers-updated');
        })
      );
  }
  getOrderById(orderId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/show/${orderId}`);
  }
  // updateStatus(order_id: any, form: any): Observable<any> {
  //   return this.http.post<any>(
  //     `${this.apiUrl}/order/update-status/${order_id}`,
  //     form
  //   );
  // }
  public uploadImage(
    image: File,
    order_id: any,
    driver_id: any,
    status: any
  ): Observable<any> {
    const formData = new FormData();

    formData.append('images', image);
    formData.append('order_id', order_id);
    formData.append('driver_id', driver_id);
    formData.append('status', status);

    return this.http.post(`/order/update-status/${order_id}`, formData);
  }
  deleteImage(order_id: any, image_id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/order/delete-image?image_id=${image_id}&order_id=${order_id}`
    );
  }
  getAllAddresses(company_id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/order/get-all-address/${company_id}`
    );
  }
  getExcel(company_id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/lead-template`);
  }
  getInvoices(page: any, comanyId: any, from?: any, to?: any): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/invoice/get?user_id=${comanyId}`, {
        params: { from: from, to: to, page: page },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.meta.current_page,
              totalItems: res.meta.total,
              itemsPerPage: res.meta.per_page,
            },
            total: res.total.toFixed(2),
          };
        })
      );
  }
  getDriverInvoices(
    page: any,
    driverId: any,
    from?: any,
    to?: any
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/invoice/invoice-driver?driver_id=${driverId}`, {
        params: { from: from, to: to, page: page },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data,
            pagination: {
              currentPage: res.meta.current_page,
              totalItems: res.meta.total,
              itemsPerPage: res.meta.per_page,
            },
            total: res.total.toFixed(2),
          };
        })
      );
  }
  getCompanyInvoicesLink(comanyId: any, from?: any, to?: any) {
    return this.http.get<any>(
      `${this.apiUrl}/invoice/download_pdf?user_id=${comanyId}`,
      {
        params: { from: from, to: to },
      }
    );
  }
  getDriverInvoicesLink(driverId: any, from?: any, to?: any) {
    return this.http.get<any>(
      `${this.apiUrl}/invoice/download_pdf_driver?driver_id=${driverId}`,
      {
        params: { from: from, to: to },
      }
    );
  }
}
