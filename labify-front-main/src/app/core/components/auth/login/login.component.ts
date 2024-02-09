import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends FormManage implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  rememberMe!: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private toaster: ToasterService,
    private popupService: PopupService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.setForm(this.loginForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;

      this.subscriptions.push(
        this.authService.login(this.FormValue, this.rememberMe).subscribe({
          next: (res) => {
            this.loading = false;
            this.toaster.showSuccess('Logged in successfully');
            this.popupService.closePopups();
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.loading = false;
            const errors = err.error.errors;
            this.toaster.showDanger(errors);
            // for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    } else this.markAllFeildsTouched();
  }

  signUp() {
    this.authService.currentComponent$.next('register');
  }

  forgetPassword() {
    this.authService.currentComponent$.next('forget-password');
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
