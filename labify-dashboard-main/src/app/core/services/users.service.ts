import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { PaginatePipeArgs } from 'ngx-pagination';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(
    page: number
  ): Observable<{ data: User[]; pagination: PaginatePipeArgs }> {
    return this.http
      .get<any>(`${this.apiUrl}`, {
        params: {
          page,
        },
      })
      .pipe(
        map((res) => {
          return {
            data: res.data.data,
            pagination: {
              currentPage: res.data.current_page,
              totalItems: res.data.total,
              itemsPerPage: res.data.per_page,
            },
          };
        })
      );
  }

  createUser(form: any): Observable<any> {
    return this.http.post(this.apiUrl, form);
  }

  getUserById(userId: number): Observable<User> {
    return this.http
      .get<any>(`${this.apiUrl}/${userId}`)
      .pipe(map((res) => res.data));
  }

  updateUser(userId: number, form: any) {
    return this.http.put(`${this.apiUrl}/${userId}`, form);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  getTabelsSetting(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/api/admin/order-sort/get`);
  }
  setTabelsSetting(form:any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/api/admin/order-sort/store`,form);
  }
}
