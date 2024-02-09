import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { UserAuthData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService implements OnDestroy {
  apiUrl = `${environment.apiUrl}/customer`;
  userData$ = new BehaviorSubject(this.authService.getUserFromStorage());
  subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserData(): Observable<UserAuthData> {
    return this.http.get<any>(`${this.apiUrl}/get`).pipe(
      map((res) => {
        this.userData$.next(res.data);
        return res.data;
      })
    );
  }

  updateUserInfo(form: any) {
    return this.http.post(`${this.apiUrl}/update`, form).pipe(
      tap(() => {
        this.subscriptions.push(this.getUserData().subscribe());
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
