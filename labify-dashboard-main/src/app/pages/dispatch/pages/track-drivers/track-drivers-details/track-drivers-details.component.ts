import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable, of, map } from 'rxjs';
import {
  DriverDetails,
  DriverOrder,
} from 'src/app/core/models/driver-details.model';
import { Driver } from 'src/app/core/models/driver.model';
import { DriversService } from 'src/app/core/services/drivers.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { OrderService } from 'src/app/core/services/order.service';
import { StorageService } from 'src/app/core/services/storage.service';
import {
  USER_ROLE,
  USER_KEY,
  COMPANY_ID,
} from 'src/app/core/services/auth.service';
import { Order } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-track-drivers-details',
  templateUrl: './track-drivers-details.component.html',
  styleUrls: ['./track-drivers-details.component.scss'],
})
export class TrackDriversDetailsComponent {
  @Input() driverData!: DriverDetails;
  @Output() driverDataChange = new EventEmitter(false);

  @ViewChild('autoInput') driver_input: any;

  unassigningOrderId: number | null = null;
  loading = false;
  yesterdayOrders!: DriverOrder[];

  allDrivers!: Driver[];
  filteredDrivers$!: Observable<Driver[]>;
  selectedDriver!: Driver;
  assignDriverLoading = false;
  orderToAssign!: number;
  dialogRef!: NbDialogRef<TemplateRef<any>>;
  loggedAsCompany = false;
  ordersClosedToday!: DriverOrder[];
  ordersOpenedToday!: DriverOrder[];

  constructor(
    private driversService: DriversService,
    private toaster: ToasterService,
    private dialogService: NbDialogService,
    private orderService: OrderService,
    private storageService: StorageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['driverData']) {
      this.getYesterdayOrders();
      this.filterTodaysOrders();
    }
  }

  ngOnInit(): void {
    if (
      this.storageService.getLocalStorageValue(USER_ROLE) === 'company' ||
      this.storageService.getLocalStorageValue(COMPANY_ID) !== null
    ) {
      this.loggedAsCompany = true;
    }
    this.getAllDriveres();
    this.getYesterdayOrders();
  }

  showOrder(orderUserId: number) {
    let role = this.storageService.getLocalStorageValue(USER_ROLE);
    let userId = this.storageService.getLocalStorageValue(USER_KEY).id;

    if (role !== 'company' || (role === 'company' && userId === orderUserId))
      return true;

    return false;
  }

  unassignDriver(orderId: number) {
    this.unassigningOrderId = orderId;
    this.driversService.unassignDriver(orderId).subscribe(
      (res) => {
        this.unassigningOrderId = null;
        this.driverDataChange.emit(true);
      },
      () => {
        this.unassigningOrderId = null;
        this.toaster.showDanger("Error: can't unassign this order");
      }
    );
  }

  openAssignDriverDialog(dialog: TemplateRef<any>, orderId: number) {
    this.dialogRef = this.dialogService.open(dialog);
    this.orderToAssign = orderId;
  }

  getAllDriveres() {
    this.driversService.getAllDrivers().subscribe((res) => {
      this.allDrivers = res;
      this.filteredDrivers$ = of(this.allDrivers);
    });
  }

  onDriverChange() {
    this.filteredDrivers$ = this.getFilteredDrivers(
      this.driver_input.nativeElement.value
    );
  }

  onDriverSelectionChange($event: Driver) {
    this.filteredDrivers$ = this.getFilteredDrivers($event.name);
    this.selectedDriver = $event;
    // this.setContollerValue('driver_id', this.selectedDriver?.id);
    this.driver_input.nativeElement.value = this.selectedDriver.name;
  }

  getFilteredDrivers(value: String): Observable<Driver[]> {
    return of(value).pipe(
      map((filterString) => this.filterDrivers(filterString))
    );
  }

  private filterDrivers(value: String): Driver[] {
    const filterValue = value.toLowerCase();
    return this.allDrivers.filter((optionValue) =>
      optionValue.name.toLowerCase().includes(filterValue)
    );
  }

  onDriverSelected() {
    this.assignDriverLoading = true;

    const payload = {
      order_id: this.orderToAssign,
      driver_id: this.selectedDriver.id,
    };
    this.orderService.assignDriver(payload).subscribe({
      next: (res) => {
        this.toaster.showSuccess('Driver assigned');
        this.assignDriverLoading = false;
        this.driverDataChange.emit(true);
        this.dialogRef.close();
      },
      error: (err) => {
        this.toaster.showDanger("Driver Didn't assigned");
        this.assignDriverLoading = false;
      },
    });
  }

  filterTodaysOrders() {
    this.ordersClosedToday = [];
    this.ordersOpenedToday = [];

    for (let order of this.driverData.orders) {
      if (order.delivery.status === 'delivered')
        this.ordersClosedToday.push(order);
      else this.ordersOpenedToday.push(order);
    }
  }

  getYesterdayOrders() {
    this.loading = true;
    this.driversService
      .getDriverOrdersByDate(this.driverData.id, this.getYesterdayDate())
      .subscribe((res) => {
        console.log(res);
        this.loading = false;
        this.yesterdayOrders = res.orders;
      });
  }

  getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
}
