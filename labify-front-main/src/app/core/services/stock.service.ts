import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { UserAuthData } from '../models/user-data.model';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllStock(): Observable<{
    data: Stock[];
    pagination: { current_page: number; per_page: number; total: number };
  }> {
    return this.http.get<any>(`${this.apiUrl}/stock/stocks`).pipe(
      map((res) => {
        return {
          data: res.data.data,
          pagination: {
            current_page: res.data.current_page,
            per_page: res.data.per_page,
            total: res.data.total,
          },
        };
      })
    );
  }

  updateUserInfo(form: any) {
    return this.http.post(`${this.apiUrl}/stock/update`, form).pipe();
  }
}
