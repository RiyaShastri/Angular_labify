import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { COMPANY_ID, USER_ROLE } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent {
  selectedRoute!: string;
  loggedAsCompany = false;

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    if (
      this.storageService.getLocalStorageValue(USER_ROLE) === 'company' ||
      this.storageService.getLocalStorageValue(COMPANY_ID) !== null
    ) {
      this.loggedAsCompany = true;
    }
    this.selectedRoute = this.router.url;
  }

  onSelectChange(event: any) {
    this.selectedRoute = event;
    this.router.navigate([this.selectedRoute]);
  }
}
