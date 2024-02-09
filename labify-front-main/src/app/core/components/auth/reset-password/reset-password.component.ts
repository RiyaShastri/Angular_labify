import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent extends FormManage {
  resetPasswordForm!: FormGroup;
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private toaster: ToasterService,
    private popupService: PopupService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initResetPasswordForm();
  }

  initResetPasswordForm() {
    this.resetPasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      [this.matchFields('password', 'password_confirmation')]
    );

    this.setForm(this.resetPasswordForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;

      this.subscriptions.push(
        this.authService
          .resetPassword(
            this.FormValue.password,
            this.FormValue.password_confirmation
          )
          .subscribe({
            next: (res) => {
              this.loading = false;
              this.toaster.showSuccess('Your password reset successfully');
              this.login();
            },
            error: (err) => {
              this.loading = false;
              const errors = err.error.errors;
              for (let key in errors) this.toaster.showDanger(errors[key]);
            },
          })
      );
    } else this.markAllFeildsTouched();
  }

  login() {
    this.authService.currentComponent$.next('login');
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
