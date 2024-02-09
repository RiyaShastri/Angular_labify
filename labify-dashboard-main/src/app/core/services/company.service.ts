import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyName } from '../models/company-names.model';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  // private selectedCompany = new BehaviorSubject(
  //   this.getSelectedCompanyFromStorage()
  // );

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // getSelectedCompany(): BehaviorSubject<any> {
  //   return this.selectedCompany;
  // }

  // setSelectedCompany(companyId: number) {
  //   this.selectedCompany.next(companyId);
  //   this.storageService.setLocalStorageValue('selected_company_id', companyId);
  // }

  private getSelectedCompanyFromStorage(): number | null {
    let company = this.storageService.getLocalStorageValue(
      'selected_company_id'
    );
    return company ? company : null;
  }

  getAllCompanyNames(): Observable<CompanyName[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/admin/company/get`)
      .pipe(
        map((res) => {
          return res.data.map((company: any) => {
            return {
              name: company.name,
              id: company.id,
            };
          });
        })
      );
  }

  getData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/admin/company/get`);
  }

  createCompany(form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/store`,
      form
    );
  }

  deleteCompany(id: any): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/admin/company/delete/${id}`
    );
  }

  editeCompany(id: any, form: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/update/${id}`,
      form
    );
  }

  editeCompanyPass(form: any, companyId: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/admin/company/change_password/${companyId}`,
      form
    );
  }

  getCompanyById(id: any): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/admin/company/get-company/${id}`
    );
  }
}
