import { isDataSource } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DriverDetails } from 'src/app/core/models/driver-details.model';
import { DriverName } from 'src/app/core/models/driver-name.model';
import { COMPANY_ID, USER_ROLE } from 'src/app/core/services/auth.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-track-drivers',
  templateUrl: './track-drivers.component.html',
  styleUrls: ['./track-drivers.component.scss'],
})
export class TrackDriversComponent {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  selectedDriver!: DriverName;
  selectedDriverData!: DriverDetails;
  idleLoading = false;
  activeLoading = false;
  assignedLoading = false;
  showMap = true;
  driverLoading = false;
  idleDrivers!: DriverName[];
  activeDrivers!: DriverName[];
  assignedDrivers!: DriverName[];
  idleCount = 0;
  activeCount = 0;
  assignedCount = 0;
  selectedDriverIsActive = true;
  loggedAsCompany = false;

  constructor(
    private driversService: DriversService,
    private socketService: SocketService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (
      this.storageService.getLocalStorageValue(USER_ROLE) === 'company' ||
      this.storageService.getLocalStorageValue(COMPANY_ID) !== null
    ) {
      this.loggedAsCompany = true;
    }
    this.listenToDriversChanges();
  }

  onSelectDriver(driver: DriverName, isActiveDriver: boolean) {
    this.selectedDriver = driver;
    this.getDriverById(this.selectedDriver.id, isActiveDriver);
  }

  getActiveDrivers() {
    // console.log('active');

    if (!this.activeDrivers) {
      this.activeLoading = true;
      this.driversService.getDriversByStatus('active').subscribe((res) => {
        this.activeDrivers = res.data;
        this.activeLoading = false;
        if (this.activeDrivers.length && !this.selectedDriver)
          this.onSelectDriver(this.activeDrivers[0], true);
        this.activeCount = res.active_count;
        this.idleCount = res.idle_count;
        this.assignedCount = res.assigned_count;
      });
    }
  }

  getIdleDrivers() {
    // console.log('idle');

    if (!this.idleDrivers) {
      this.idleLoading = true;
      this.driversService.getDriversByStatus('idle').subscribe((res) => {
        this.idleDrivers = res.data;
        this.idleLoading = false;
        if (this.idleDrivers.length && !this.selectedDriver)
          this.onSelectDriver(this.idleDrivers[0], false);
        this.activeCount = res.active_count;
        this.idleCount = res.idle_count;
        this.assignedCount = res.assigned_count;
      });
    }
  }

  getAssignedDrivers() {
    // console.log('assigned');

    if (!this.assignedDrivers) {
      this.assignedLoading = true;
      this.driversService.getDriversByStatus('assigned').subscribe((res) => {
        this.assignedDrivers = res.data;
        this.assignedLoading = false;
        if (this.assignedDrivers.length && !this.selectedDriver)
          this.onSelectDriver(this.assignedDrivers[0], false);
        this.activeCount = res.active_count;
        this.idleCount = res.idle_count;
        this.assignedCount = res.assigned_count;
      });
    }
  }

  getDriverById(driverId: number, isActiveDriver = true) {
    this.driverLoading = true;
    this.driversService.getDriverDetails(driverId).subscribe((res) => {
      this.selectedDriverData = res;
      this.driverLoading = false;
      this.selectedDriverIsActive = isActiveDriver;
    });
  }

  listenToDriversChanges() {
    this.socketService.listenToEvent('drivers-updated').subscribe((res) => {
      // this.socketService.listenToEvent('drivers-updated-new').subscribe((res) => {
      this.activeDrivers = res.active_data;
      this.assignedDrivers = res.assigned_data;
      this.idleDrivers = res.idle_data;

      this.activeCount = res.active_count;
      this.assignedCount = res.assigned_count;
      this.idleCount = res.idle_count;

      if (this.activeDrivers.length && !this.selectedDriver)
        this.onSelectDriver(this.activeDrivers[0], false);
      else if (this.assignedDrivers.length && !this.selectedDriver)
        this.onSelectDriver(this.assignedDrivers[0], false);
      else if (this.idleDrivers.length && !this.selectedDriver)
        this.onSelectDriver(this.idleDrivers[0], false);
    });
  }

  accordionChanged(event: any) {
    if (event === 'active: false') this.getActiveDrivers();
    else if (event === 'idle: false') this.getIdleDrivers();
    else if (event === 'assigned: false') this.getAssignedDrivers();
  }
}
