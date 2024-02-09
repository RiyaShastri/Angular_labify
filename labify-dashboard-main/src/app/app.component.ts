import { Component } from '@angular/core';
import { FirebaseCloudMessagingService } from './core/services/firebase-cloud-messaging.service';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';
import { fcmTokenKey } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  constructor(
    private notificationsService: FirebaseCloudMessagingService,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    console.log('saba70' , navigator);
  }

  ngOnInit() {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' })
        .then((notificationPerm) => {
          notificationPerm.onchange = () => {
            if (notificationPerm.state === 'granted') {
              this.notificationsService.getFcmToken().subscribe((token) => {
                this.authService.addFcmToken(token).subscribe((res) => {
                  this.storageService.setLocalStorageValue(fcmTokenKey, res.data.fcm_token)
                });
              });
            }
          };
        });
    }
  }
}
