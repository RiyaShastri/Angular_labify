import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  USER_KEY,
} from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userPermissions!: string[];
  links: { title: string; route: string }[] = [];

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userPermissions =
      this.storageService.getLocalStorageValue(USER_KEY)?.permissions;

    for (let [route, title] of this.authService.routeTitles.entries()) {
      if (this.userPermissions.includes(title))
        this.links.push({ title, route });
    }
  }
}
