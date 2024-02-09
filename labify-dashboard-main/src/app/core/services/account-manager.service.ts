import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountManager } from '../models/account-manager.model';

@Injectable({
  providedIn: 'root',
})
export class AccountManagerService {
  apiUrl = `${environment.apiUrl}/api/admin/account-managers`;

  constructor(private http: HttpClient) {}

  getAllAccountManagers(page: number): Observable<{
    pagination: PaginatePipeArgs;
    data: AccountManager[];
  }> {
    return this.http
      .get<any>(this.apiUrl, {
        params: { page },
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

  getAccountManagerById(accountManagerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${accountManagerId}`);
  }

  updateAssignedCompanies(
    accountManagerId: number,
    companies: number[]
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${accountManagerId}/companies`, {
      companies,
    });
  }
}
