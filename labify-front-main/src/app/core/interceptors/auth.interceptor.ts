import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  langPrefix!: '/ar' | '';

  constructor(
    private authService: AuthService,
    private toasterService: ToasterService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authReq = this.addTokenHeader(request);

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.openAuthPopup('login');
          this.toasterService.showDanger('You are unauthorized, please login.');
        }
        return throwError(error);
      })
    );
  }

  addTokenHeader(request: HttpRequest<any>) {
    const token = this.authService.getToken();

    if (this.needsAuth(request.url) && token) {
      return request.clone({
        headers: request.headers.append('Authorization', `Bearer ${token}`),
      });
    }

    return request;
  }

  needsAuth(url: string) {
    return (
      url.includes('order') ||
      url.includes('customer') ||
      url.includes('cart') ||
      url.includes('stock')
    );
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
