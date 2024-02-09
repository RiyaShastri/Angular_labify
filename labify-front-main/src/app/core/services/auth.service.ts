import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthComponent } from '../components/auth/auth.component';
import { PopupService } from './popup.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { StorageService } from './storage.service';
import { UserAuthData } from '../models/user-data.model';

export const USER_STORAGE_KEY = 'ud';
const FORGET_PASSWORD_EMAIL_KEY = 'fpek';

export type AuthPage =
  | 'login'
  | 'register'
  | 'forget-password'
  | 'check-code'
  | 'reset-password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
  currentComponent$ = new BehaviorSubject<AuthPage>('login');
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.getToken() ? true : false
  );

  constructor(
    private popupService: PopupService,
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  openAuthPopup(page?: AuthPage): void {
    if (page) this.currentComponent$.next(page);
    this.popupService.openPopup(AuthComponent, {
      centered: true,
      size: 'xl',
    });
  }

  register(form: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/register`, form).pipe(
      tap((res: any) => {
        this.storageService.setSessionStorageValue(USER_STORAGE_KEY, res.data);
        this.isLoggedIn$.next(true);
      })
    );
  }

  login(form: any, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/login`, form).pipe(
      tap((res: any) => {
        if (rememberMe)
          this.storageService.setLocalStorageValue(USER_STORAGE_KEY, res.data);
        else
          this.storageService.setSessionStorageValue(
            USER_STORAGE_KEY,
            res.data
          );
        this.isLoggedIn$.next(true);
      })
    );
  }

  forgetPassword(email: string) {
    return this.http
      .post(`${this.apiUrl}/customer/forget-password`, { email })
      .pipe(
        tap((res: any) => {
          this.storageService.setSessionStorageValue(
            FORGET_PASSWORD_EMAIL_KEY,
            email
          );
        })
      );
  }

  checkResetCode(code: string) {
    return this.http.post(`${this.apiUrl}/customer/check-code`, {
      code,
      email: this.storageService.getSessionStorageValue(
        FORGET_PASSWORD_EMAIL_KEY
      ),
    });
  }

  resetPassword(password: string, password_confirmation: string) {
    return this.http.post(`${this.apiUrl}/customer/reset-password`, {
      password,
      password_confirmation,
      email: this.storageService.getSessionStorageValue(
        FORGET_PASSWORD_EMAIL_KEY
      ),
    });
  }

  logout() {
    this.storageService.clearLocalStorage();
    this.storageService.clearSessionStorage();
    this.isLoggedIn$.next(false);
  }

  getToken(): string | null {
    const user = this.getUserFromStorage();
    return user && user.token ? user.token : null;
  }

  getUserFromStorage(): UserAuthData | undefined {
    let user!: UserAuthData;
    user = this.storageService.getLocalStorageValue(USER_STORAGE_KEY);
    if (!user)
      user = this.storageService.getSessionStorageValue(USER_STORAGE_KEY);
    return user;
  }
}
