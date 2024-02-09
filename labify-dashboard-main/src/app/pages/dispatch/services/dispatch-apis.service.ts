import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, expand, map, of, takeWhile } from 'rxjs';
import { Order } from '../../../core/models/order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { pagination as Pagination } from '../../../core/models/pagination.model';
import { PaginatePipeArgs } from 'ngx-pagination';
import { OldMapOrder } from '../../../core/models/map-order.model';
import {
  DispatchDriverDetails,
  DispatchOrder,
} from '../models/dispatch-order.model';
import { COMPANY_ID, USER_KEY } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DipatchAllOrder } from '../models/dispatch-all-orders.model';

@Injectable({
  providedIn: 'root',
})
export class DispatchAPIsService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

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

  getDispatchOrders(): Observable<DispatchOrder[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/order/order-without-driver`, {
        params: { pagination: false },
      })
      .pipe(
        map((res) => {
          return res.data.map((order: any) => {
            return {
              order_id: order.order_id,
              pickup_address: order.pickup_address,
              delivery_address: order.delivery_address,
              order_code: order.order_code,
              service: order.service,
              pickup_address_name: order.pickup_address_name,
              delivery_address_name: order.delivery_address_name,
              pickup: {
                lat: order.pickup.lat,
                lng: order.pickup.long,
              },
              delivery: {
                lat: order.delivery.lat,
                lng: order.delivery.long,
              },
              color: '#000',
            };
          });
        })
      );
  }

  getDispatchDriverDetails(
    driverId: number
  ): Observable<DispatchDriverDetails> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/driver/${driverId}/current-details`)
      .pipe(
        map((res) => {
          // console.log('Driver details: ', res.data);

          let driverDetails: DispatchDriverDetails = {
            id: res.data.id,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.phone,
            orders: res.data.orders.map((order: any) => {
              let dispatchOrder: DispatchOrder = {
                order_id: order.id,
                delivery_address: order.delivery.address,
                delivery_address_name: order.delivery.address,
                pickup_address: order.pickup.address,
                pickup_address_name: order.pickup.address,
                order_code: order.order_code,
                delivery: {
                  lat: +order.delivery.lat,
                  lng: +order.delivery.ong,
                  status: order.delivery.status,
                },
                pickup: {
                  lat: +order.pickup.lat,
                  lng: +order.pickup.ong,
                  status: order.pickup.status,
                },

                color: '#000',
              };
              return dispatchOrder;
            }),
          };

          return driverDetails;
        })
      );
  }

  getOrdersForPage(): Observable<DipatchAllOrder[]> {
    const queryParams = {
      params: {
        date_from: this.getToDaysDate(),
        date_to: this.getToDaysDate(),
      },
    };

    let companyId = this.storageService.getLocalStorageValue(COMPANY_ID);

    if (companyId)
      return this.http.get<any>(
        `${this.apiUrl}/admin/order/get-orders/${companyId}`,
        queryParams
      );
    // .pipe(
    //   map((response) => {
    //     return { orders: response.data, lastPage: response.last_page };
    //   })
    // );
    else
      return this.http.get<any>(
        `${this.apiUrl}/admin/order/get-orders-all`,
        queryParams
      );
    // .pipe(
    //   map((response) => {
    //     return { orders: response.data, lastPage: response.last_page };
    //   })
    // );
  }

  getToDaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month because it's zero-based
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  getAllDrivers(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/driver/get-all`)
      .pipe(map((res) => res.data));
  }
}
