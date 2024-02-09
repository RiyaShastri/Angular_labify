import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthData } from 'src/app/core/models/user-data.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { FormManage } from 'src/app/shared/classes/form-manage';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  changingImage = false;
  userData!: UserAuthData;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.subscribeUserData();
  }

  getUserData() {
    this.loading = true;

    this.subscriptions.push(
      this.profileService.getUserData().subscribe({
        next: (userData) => {
          this.userData = userData;
          this.loading = false;
        },
      })
    );
  }

  subscribeUserData() {
    this.subscriptions.push(
      this.profileService.userData$.subscribe((userData) => {
        if (userData) this.userData = userData;
      })
    );
  }

  onPictureUpload(event: any) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('id', `${this.userData.id}`);

      this.changingImage = true;
      this.subscriptions.push(
        this.profileService.updateUserInfo(formData).subscribe({
          next: () => {
            this.changingImage = false;
          },
        })
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
