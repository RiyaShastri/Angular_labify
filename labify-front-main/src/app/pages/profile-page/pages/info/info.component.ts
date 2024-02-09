import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserAuthData } from 'src/app/core/models/user-data.model';
import { User } from 'src/app/core/models/user.model';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent extends FormManage implements OnInit, OnDestroy {
  userData!: UserAuthData;
  userDataForm!: FormGroup;
  loading = false;
  updating = false;
  subscriptions: Subscription[] = [];

  constructor(
    private profileService: ProfileService,
    private toaster: ToasterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.loading = true;
    this.subscriptions.push(
      this.profileService.getUserData().subscribe({
        next: (res) => {
          this.userData = res;
          this.loading = false;
          this.initUserDataForm();
        },
      })
    );
  }

  initUserDataForm() {
    this.userDataForm = new FormGroup({
      id: new FormControl(this.userData.id),
      first_name: new FormControl(this.userData.first_name, [
        Validators.required,
      ]),
      last_name: new FormControl(this.userData.last_name, [
        Validators.required,
      ]),
      phone: new FormControl(this.userData.phone, [
        Validators.required,
        Validators.pattern(`^[0-9]{11}$`),
      ]),
      email: new FormControl(this.userData.email, [
        Validators.required,
        Validators.email,
      ]),
    });

    this.setForm(this.userDataForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.updating = true;
      this.subscriptions.push(
        this.profileService.updateUserInfo(this.FormValue).subscribe({
          next: () => {
            this.updating = false;
            this.toaster.showSuccess('Info updated successfully');
          },
          error: (err) => {
            this.updating = false;
            const errors = err.error.errors;
            for (let key in errors) this.toaster.showDanger(errors[key]);
          },
        })
      );
    } else this.markAllFeildsTouched();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
