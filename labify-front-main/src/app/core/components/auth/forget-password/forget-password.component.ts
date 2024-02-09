import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent extends FormManage {
  forgetPasswordForm!: FormGroup;
  loading = false;
  rememberMe!: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private toaster: ToasterService,
    private popupService: PopupService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForgetPasswordForm();
  }

  initForgetPasswordForm() {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.setForm(this.forgetPasswordForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;

      this.subscriptions.push(
        this.authService.forgetPassword(this.FormValue.email).subscribe({
          next: (res) => {
            this.loading = false;
            this.authService.currentComponent$.next('check-code');
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
