import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { NotificationData } from '../models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { USER_KEY } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiUrl = `${environment.apiUrl}/api/admin/get-notification/`;
  newNotification$: BehaviorSubject<NotificationData> = new BehaviorSubject({
    id: 0,
    message: '',
    title: '',
    created_at: new Date(),
  });

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.apiUrl += this.storageService.getLocalStorageValue(USER_KEY)?.id;
  }

  getAllNotifications(page: number): Observable<NotificationData[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res.data));
  }
}
