import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Order } from 'src/app/core/models/order.model';
import { CompanyService } from 'src/app/core/services/company.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { IconRendererComponent } from './renderComponent.component';
import { PaginatePipeArgs } from 'ngx-pagination';
import { Driver } from 'src/app/core/models/driver.model';
import { Observable, map, of } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';
import { Location } from '@angular/common';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsersService } from 'src/app/core/services/users.service';
import { AssignDriversService } from 'src/app/core/services/assign-drivers.service';

@Component({
  selector: 'app-assign-drivers',
  templateUrl: './assign-drivers.component.html',
  styleUrls: ['./assign-drivers.component.scss'],
})
export class AssignDriversComponent {
  loading = false;
  companyId!: number;
  paginationArgs!: PaginatePipeArgs;
  first = 0;
  totalRecords: any;
  allOrder!: any;

  rows = 15;
  // cols : any[]=[
  //   { field: 'order_code', header: 'Order code' },
  //   { field: 'order_date', header: 'Order Date' },
  //   { field: 'status_type', header: 'status' },
  //   { field: 'pickup_address', header: 'Pickup' },
  //   { field: 'delivery_address', header: 'Delivery' },
  //   { field: 'service', header: 'Service Type' },
  //   { field: 'order_type', header: 'Specimen Type' },
  //   { field: 'pieces', header: 'Pieces' },
  //   { field: 'pickup_time', header: 'Pickup Time' },
  //   { field: 'delivery_time', header: 'Delivery Time' },
  //   { field: 'pickup_date', header: 'Pickup Date' },
  //   { field: 'driver_name', header: 'Driver' },
  //   { field: 'pickup_actual_date', header: 'Pickup actual Date' },
  //   { field: 'deilvery_actual_date', header: 'Delivery actual Date' },
  //   { field: 'customer', header: 'name' },

  // ];
  cols: any[] = [
    { field: 'order_code', header: 'Order code' },
    { field: 'order_date', header: 'Order Date' },
    { field: 'status_type', header: 'status' },
    { field: 'pickup_address_name', header: 'Pickup Name' },
    { field: 'pickup_address', header: 'Pickup Address' },
    { field: 'delivery_address_name', header: 'delivery Name' },
    { field: 'delivery_address', header: 'Delivery Address' },
    { field: 'service', header: 'Service Type' },
    { field: 'order_type', header: 'Specimen Type' },
    { field: 'pieces', header: 'Pieces' },
    { field: 'pickup_actual_pieces', header: 'Pickup Actual Pieces' },
    { field: 'delivery_actual_pieces', header: 'Delivery Actual Pieces' },
    { field: 'pickup_time', header: 'Pickup Time' },
    { field: 'pickup_actual_time', header: 'Pickup actual Time' },
    { field: 'delivery_time', header: 'Delivery Time' },
    { field: 'deilvery_actual_time', header: 'Delivery actual Time' },
    { field: 'pickup_date', header: 'Pickup Date' },
    { field: 'driver_name', header: 'Driver' },
    { field: 'pickup_actual_date', header: 'Pickup actual Date' },
    { field: 'deilvery_actual_date', header: 'Delivery actual Date' },
    { field: 'customer', header: 'Created By' },
    { field: 'name', header: 'Comapny Name' },
  ];
  savedColumns: any;
  filteredCustomColumns = {};
  _selectedColumns!: any[];
  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    pager: {
      display: false,
    },
    columns: {
      status_type: {
        title: 'status',
        type: 'string',
      },
      pickup_address: {
        title: 'Pickup',
        type: 'string',
        addable: false,
        width: '20%',
      },
      delivery_address: {
        title: 'Delivery',
        type: 'string',
        width: '20%',
      },
      service: {
        title: 'Service Type',
        type: 'custom',
        renderComponent: IconRendererComponent,
        width: '12%',
      },
      order_date: {
        title: 'Order Date',
        type: 'string',
        width: '15%',
      },
      pickup_time: {
        title: 'Pickup Time',
        type: 'string',
      },
      delivery_time: {
        title: 'Delivery Time',
        type: 'string',
      },

      pickup_date: {
        title: 'Pickup Date',
        type: 'string',
        width: '12%',
      },
      order_code: {
        title: 'Order code',
        type: 'string',
      },
      pieces: {
        title: 'Pieces',
        type: 'string',
      },
      // driver_name: {
      //   title: 'Driver',
      //   type: 'string',
      // },
      order_type: {
        title: 'ٍSpecimen Type',
        type: 'string',
      },
    },
  };
  @ViewChild('autoInput') driver_input: any;
  @ViewChild('dt2') table: Table;
  source: LocalDataSource = new LocalDataSource();
  data!: any;
  doctorId!: number;
  drivers: any;
  selectedDriver!: Driver;
  options!: Driver[];
  filteredDrivers$!: Observable<Driver[]>;
  orderId: any;


  constructor(
    private assignDriversService: AssignDriversService,
    private dialogService: NbDialogService,
    private router: Router,
    private toaster: ToasterService,
    private companyService: CompanyService,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private userServices: UsersService,

    public location: Location
  ) {
    const savedColumnsOrder = localStorage.getItem('colsAssignOrders');
    if (savedColumnsOrder) {
      this.selectedColumns = savedColumnsOrder
        ? JSON.parse(savedColumnsOrder)
        : this.cols;
    }

    if (!this.selectedColumns || this.selectedColumns.length === 0) {
      // Handle the condition where there's no saved order
      this.selectedColumns = this.cols; // Use the default column order
    }
  }

  ngOnInit(): void {
    const savedColumns = localStorage.getItem('colsAssignOrders');
    if (savedColumns) {
      this._selectedColumns = JSON.parse(savedColumns);
    } else {
      this._selectedColumns = this.cols;
    }
    this.getOrders(1);
    this.getAllDriveres();
  }
  onColumnReorder(event: any) {
    // Save the new column order to local storage
    localStorage.setItem('colsAssignOrders', JSON.stringify(event.columns));
    this.saveTable();
  }
  saveTable() {
    const payload = {
      // id: 1,
      colsAssignOrders: this._selectedColumns,
    };
    this.userServices.setTabelsSetting(payload).subscribe({
      next: (res) => {
        // this.toasterService.showSuccess('Table Settings Saved')
      },
      error: (err) => {
        // this.toasterService.showDanger(err)
      },
    });
  }
  resetColumnOrder() {
    localStorage.removeItem('colsAssignOrders'); // Remove saved order
    this.selectedColumns = this.cols; // Reset to default order
    //  update the table's columns
    this.table.reset();
  }
  getOrders(page: number, $event?: LazyLoadEvent) {
    this.loading = true;
    // this.assignDriversService
    //   .getAllOrdersWithoutDrivers(page)
    //   .subscribe({
    //     next: (res) => {
    //       this.data = res.data;
    //       this.loading = false;
    //       this.source.load(this.data);
    //       this.paginationArgs = { id: 'pagination', ...res.pagination };
    //       // console.log(this.paginationArgs);
    //     },
    //     error: (error) => {
    //       this.loading = false;
    //       // console.log(error);
    //     },
    //   });
    const pPage = $event?.first || 0;

    this.assignDriversService
      .getAllOrdersWithoutDrivers(pPage / 15 + 1)
      .subscribe({
        next: (res) => {
          this.data = res.data;
          this.loading = false;
          this.source.load(this.data);
          this.totalRecords = res.pagination.totalItems;

          this.paginationArgs = { id: 'pagination', ...res.pagination };
          // console.log(this.paginationArgs);
        },
        error: (error) => {
          this.loading = false;
          // console.log(error);
        },
      });
  }
  getOrderStatusClass(orderStatus: string): string {
    switch (orderStatus) {
      case 'pickedup':
        return 'status-pickedup';
      case 'cancelled':
        return 'status-cancelled';
      case 'delivered':
        return 'status-deliveried';
      default:
        return ''; // No special class for other statuses
    }
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.allOrder
      ? this.first === this.allOrder.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.allOrder ? this.first === 0 : true;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = val;
    localStorage.setItem(
      'colsAssignOrders',
      JSON.stringify(this._selectedColumns)
    );
    if (JSON.stringify(val) !== JSON.stringify(this._selectedColumns)) {
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
    }
  }
  onEditeConfirm(event: any, dialog: TemplateRef<any>): void {
    // console.log(event.data);
    this.orderId = event.order_id;
    this.dialogService.open(dialog);
    // this.router.navigate(['track-orders/update-order', event.data.order_id]);
  }
  getAllDriveres() {
    this.assignDriversService.getAllDrivers().subscribe((res) => {
      this.drivers = res;
      this.options = this.drivers;
      this.filteredDrivers$ = of(this.options);
    });
  }
  private filterDrivers(value: String): Driver[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((optionValue) =>
      optionValue.name.toLowerCase().includes(filterValue)
    );
  }

  getFilteredDrivers(value: String): Observable<Driver[]> {
    return of(value).pipe(
      map((filterString) => this.filterDrivers(filterString))
    );
  }
  onDriverChange() {
    this.filteredDrivers$ = this.getFilteredDrivers(
      this.driver_input.nativeElement.value
    );
  }
  onDriverSelected() {
    const payload = {
      order_id: this.orderId,
      driver_id: this.selectedDriver.id,
    };
    this.orderService.assignDriver(payload).subscribe({
      next: (res) => {
        this.toasterService.showSuccess('Driver assigned');
        this.getOrders(0);
        // window.history.back();
      },
      error: (err) => {
        this.toasterService.showDanger("Driver Didn't assigned");
      },
    });
  }
  onDriverSelectionChange($event: Driver) {
    this.filteredDrivers$ = this.getFilteredDrivers($event.name);
    this.selectedDriver = $event;
    // this.setContollerValue('driver_id', this.selectedDriver?.id);
    this.driver_input.nativeElement.value = this.selectedDriver.name;
  }
  goBack() {
    window.history.back();
  }
}
