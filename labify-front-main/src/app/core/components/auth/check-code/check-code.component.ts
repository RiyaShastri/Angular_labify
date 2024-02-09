import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-check-code',
  templateUrl: './check-code.component.html',
  styleUrls: ['./check-code.component.scss'],
})
export class CheckCodeComponent extends FormManage {
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
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(`^[0-9]{5}$`),
      ]),
    });

    this.setForm(this.forgetPasswordForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;

      this.subscriptions.push(
        this.authService.checkResetCode(this.FormValue.code).subscribe({
          next: (res) => {
            this.loading = false;
            this.authService.currentComponent$.next('reset-password');
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

  forgetPassword() {
    this.authService.currentComponent$.next('forget-password');
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
