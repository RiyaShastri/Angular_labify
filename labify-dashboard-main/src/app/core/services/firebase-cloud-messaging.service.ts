import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { getToken, onMessage } from 'firebase/messaging';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

const vapidKey =
  'BFjlCKQBbK-9o8I87CkJSctOaw6LMZ7ZuWvAPxisXsSu8pqjmVnXmmonRfQC8_3ebjYvlxKIfwry-mZPBhc1I_U';

@Injectable({
  providedIn: 'root',
})
export class FirebaseCloudMessagingService {
  private readonly _messaging = inject(Messaging);
  private notificationService = inject(NotificationService);

  requestPermissionAndGetToken(): Observable<string> {
    return new Observable((observer) => {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // console.log('Permission granted');
          let token = '';
          this.getFcmToken().subscribe((res) => {
            token = res;
            observer.next(token);
            observer.complete();
          });
        } else if (permission === 'denied') {
          observer.error('Permission denied');
        }
      });
    });
  }

  getFcmToken(): Observable<string> {
    return new Observable((observer) => {
      getToken(this._messaging, {
        vapidKey: vapidKey,
      })
        .then((currentToken) => {
          if (currentToken) {
            // console.log('fcm token:', currentToken);

            observer.next(currentToken);
            observer.complete();
          } else {
            observer.error('No registration token available.');
          }
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  listenToMessages() {
    onMessage(this._messaging, (payload) => {
      console.log('----------------- FCM Messaging ----------------');

      console.log(payload.notification);

      if (payload.notification) {
        const notification = {
          id: 1,
          message: payload.notification.body ? payload.notification.body : '',
          title: payload.notification.title ? payload.notification.title : '',
          created_at: new Date(),
        };

        if (this.notificationService.newNotification$ && payload.notification)
          this.notificationService.newNotification$.next(notification);
        else if (payload.notification)
          this.notificationService.newNotification$ = new BehaviorSubject(
            notification
          );
      }
    });
  }
}
