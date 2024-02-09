import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormManage } from '../../core/classes/form-manage';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Router } from '@angular/router';
import { FirebaseCloudMessagingService } from 'src/app/core/services/firebase-cloud-messaging.service';
import { StorageService } from 'src/app/core/services/storage.service';

export const fcmTokenKey = 'fcm_token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends FormManage implements OnInit {
  showPassword = false;
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private toaster: ToasterService,
    private router: Router,
    private fcmService: FirebaseCloudMessagingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      fcm_token: new FormControl(''),
    });

    this.setForm(this.loginForm);
  }

  login() {
    if (this.isFormValid) {
      this.loading = true;
      this.authService.login(this.FormValue).subscribe(
        (userData) => {
          this.loading = false;

          if (userData.permissions.includes('Home')) {
            this.router.navigate(['/home']);
          } else {
            for (let [route, title] of this.authService.routeTitles.entries()) {
              if (userData.permissions.includes(title)) {
                console.log(route, title);
                this.router.navigate([route]);
              }
            }
          }
          this.fcmService.requestPermissionAndGetToken().subscribe(
            (token) => {
              this.authService.addFcmToken(token).subscribe();
              console.log(token);
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          this.loading = false;
          this.toaster.showDanger('Invalid login data');
        }
      );
    } else this.markAllFeildsTouched();
  }
}
