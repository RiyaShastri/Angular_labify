import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { LoginUser } from '../models/login-user.model';
import { fcmTokenKey } from 'src/app/auth/login/login.component';
import { NbMenuItem } from '@nebular/theme';
import { ADMIN_PAGES } from '../components/sidenav-menu/sidenav-menu.component';

export const TOKEN_KEY = 'auth_app_token';
export const USER_KEY = 'user_data';
export const USER_ROLE = 'user_role';
export const USER_TYPE = 'user_type';
export const COMPANY_ID = 'company_id';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  routeTitles: Map<string, string> = new Map();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.initHashTableOfRoutesAndTitles();
    // console.log(this.routeTitles);
  }

  login(form: any): Observable<LoginUser> {
    return this.http
      .post<any>(`${environment.apiUrl}/api/auth/login`, form)
      .pipe(
        map((res) => {
          let user: LoginUser = {
            name: res.data.name,
            username: res.data.username,
            email: res.data.email,
            phone: res.data.phone,
            image: res.data.image,
            role: res.data.role,
            id: res.data.id,
            permissions: res.data.permissions.map((permission: any) => {
              return permission.name;
            }),
            tableSetting: res.data.setting,
          };
          let token = { value: res.data.token };
          let user_role = res.data.role;
          this.storageService.setLocalStorageValue(
            COMPANY_ID,
            res.data.company_id
              ? res.data.company_id
              : res.data.role === 'company'
              ? res.data.id
              : null
          );

          this.storageService.setLocalStorageValue(USER_ROLE, user_role);
          this.storageService.setLocalStorageValue(USER_TYPE, res.data.user_type);
          this.storageService.setLocalStorageValue(USER_KEY, user);
          this.storageService.setLocalStorageValue(TOKEN_KEY, token);
          this.storageService.setLocalStorageValue(
            'colsOrders',
            user.tableSetting.colsOrders?.colsOrders || ''
          );
          this.storageService.setLocalStorageValue(
            'colsAssignOrders',
            user.tableSetting.colsAssignOrders?.colsAssignOrders || ''
          );
          this.storageService.setLocalStorageValue(
            'colsScheduleOrders',
            user.tableSetting.colsScheduleOrders?.colsScheduleOrders || ''
          );
          // console.log(res);
          return user;
        })
      );
  }

  getToken() {
    let token = this.storageService.getLocalStorageValue(TOKEN_KEY);
    return token ? token.value : null;
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/logout`, {
      fcm_token: this.storageService.getLocalStorageValue(fcmTokenKey),
    });
  }

  addFcmToken(token: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/api/auth/add-fcm-token`, {
        fcm_token: token,
        user_id: this.storageService.getLocalStorageValue(USER_KEY).id,
      })
      .pipe(
        tap(() => {
          this.storageService.setLocalStorageValue(fcmTokenKey, token);
        })
      );
  }

  private initHashTableOfRoutesAndTitles() {
    const traverse = (pages: NbMenuItem[]) => {
      for (const page of pages) {
        if (page.link) {
          this.routeTitles.set(page.link, page.title);
        } else if (page.url) {
          this.routeTitles.set(page.url, page.title);
        } else if (page.children) {
          traverse(page.children);
        }
      }
    };

    traverse(ADMIN_PAGES);
  }
}
