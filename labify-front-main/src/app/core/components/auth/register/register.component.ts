import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends FormManage implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  loading = false;
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
    this.initRegiterForm();
  }

  initRegiterForm() {
    this.registerForm = new FormGroup(
      {
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern(`^[0-9]{11}$`),
        ]),
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

    this.setForm(this.registerForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;

      this.subscriptions.push(
        this.authService.register(this.FormValue).subscribe({
          next: (res) => {
            this.loading = false;
            this.toaster.showSuccess('Account created successfully');
            this.popupService.closePopups();
            this.router.navigate(['/profile']);
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
