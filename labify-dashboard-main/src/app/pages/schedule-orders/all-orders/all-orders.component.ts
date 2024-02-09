import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { CompanyService } from 'src/app/core/services/company.service';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { DoctorAddressService } from 'src/app/core/services/doctor-address.service';
import { IconRendererComponent } from './renderComponent.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster.service';
import { ScheduleOrderService } from 'src/app/core/services/schedule-order.service';
import { PaginatePipeArgs } from 'ngx-pagination';
import { StorageService } from 'src/app/core/services/storage.service';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsersService } from 'src/app/core/services/users.service';
@Component({
  selector: 'ngx-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: any;
  allSchedsuleOrder!: any;
  selectedCompanyId!: any;
  pickup_address!: any;
  delivery_address!: any;
  fileUrl: any;
  first = 0;
  @ViewChild('dt2') table: Table;
  rows = 15;
  cols: any[] = [
    { field: 'customer', header: 'Created By' },
    { field: 'name', header: 'Comapny Name' },
    { field: 'pickup_address', header: 'Pickup' },
    { field: 'delivery_address', header: 'Delivery' },
    { field: 'service', header: 'Service Type' },
    { field: 'order_type', header: 'Specimen Type' },
    { field: 'pieces', header: 'Pieces' },
  ];
  savedColumns: any;
  filteredCustomColumns = {};
  _selectedColumns!: any[];
  search_term: any = '';
  currentDate: Date = new Date();

  settings = {
    mode: 'external',
    actions: {
      delete: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
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
      pickup_address: {
        title: 'Pickup',
        type: 'string',
        addable: false,
      },
      delivery_address: {
        title: 'Delivery',
        type: 'string',
      },
      service: {
        title: 'Service Type',
        type: 'custom',
        renderComponent: IconRendererComponent,
        width: '12%',
      },
      pieces: {
        title: 'Pieces',
        type: 'string',
      },
      order_type: {
        title: 'ٍSpecimen Type',
        type: 'string',
      },
      days: {
        title: 'Days',
        type: 'string',
      },
    },
  };
  payload: { search: any; date_from: any; date_to: any };
  OrderId: any;
  orderId: any;

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private companyService: CompanyService,
    private orderService: ScheduleOrderService,
    private addressCompanyService: CompanyAddressService,
    private addressDoctorService: DoctorAddressService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private userServices: UsersService
  ) {
    const savedColumnsOrder = localStorage.getItem('colsScheduleOrders');
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

  searchForm!: FormGroup;
  paginationArgs!: PaginatePipeArgs;
  role!: any;
  user!: any;
  totalRecords: any;

  ngOnInit(): void {
    // this.listenToCompanyChanges();
    const today = this.currentDate;

    this.searchForm = this.fb.group({
      Date_from: new FormControl(
        new Date(today.getFullYear(), today.getMonth(), 1),
        Validators.required
      ),
      Date_to: new FormControl(today, Validators.required),
    });
    const savedColumns = localStorage.getItem('colsScheduleOrders');
    if (savedColumns) {
      this._selectedColumns = JSON.parse(savedColumns);
    } else {
      this._selectedColumns = this.cols;
    }
    this.exportExcel();
    this.getOrders(1);
  }
  onColumnReorder(event: any) {
    // Save the new column order to local storage
    localStorage.setItem('colsScheduleOrders', JSON.stringify(event.columns));
    this.saveTable();

  }
  resetColumnOrder() {
    localStorage.removeItem('colsScheduleOrders'); // Remove saved order
    this.selectedColumns = this.cols; // Reset to default order
    // update the table's columns
    this.table.reset();
  }
  getOrders(page: number, search?: any, $event?: LazyLoadEvent) {
    this.loading = true;
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    this.user = this.storageService.getLocalStorageValue(USER_KEY);

    if (this.role === 'company') {
      this.orderService
        .getOrdersOfCompany(page, this.user.id, search)
        .subscribe({
          next: (res) => {
            this.data = res.data;
            this.source.load(this.data);
            this.paginationArgs = { ...res.pagination, id: 'pagination' };
            this.loading = false;
            this.totalRecords = res.pagination.totalItems;
          },
          error: (err) => {},
        });
    } else {
      const page = $event?.first || 0;
      this.orderService.getAllNewOrders(page / 15 + 1 || 0, search).subscribe({
        next: (res) => {
          this.data = res.data;
          this.source.load(this.data);
          this.paginationArgs = { ...res.pagination, id: 'pagination' };
          this.loading = false;
          this.totalRecords = res.pagination.totalItems;
        },
        error: (err) => {},
      });
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
    return this.allSchedsuleOrder
      ? this.first === this.allSchedsuleOrder.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.allSchedsuleOrder ? this.first === 0 : true;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // this._selectedColumns = this.cols.filter((col) => val.includes(col));
    this._selectedColumns = val;
    localStorage.setItem(
      'colsScheduleOrders',
      JSON.stringify(this._selectedColumns)
    );
    if (JSON.stringify(val) !== JSON.stringify(this._selectedColumns)) {
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
      // console.log(this._selectedColumns);
    }
  }

  onSearchKeyUp(event: any) {
    const term = event;
    this.search_term = term;
    if (term === '') {
      // this.getOrders(1, this.payload);
    }
    this.payload = {
      search: term,
      date_from: this.transformDate(this.searchForm.value.Date_from),
      date_to: this.transformDate(this.searchForm.value.Date_to),
    };
    // this.getOrders(1, this.payload);
  }
  onSubmit() {
    if (this.searchForm.valid) {
      const transformedDateFrom = this.transformDate(
        this.searchForm.value.Date_from
      );
      const transformedDateto = this.transformDate(
        this.searchForm.value.Date_to
      );
      this.payload = {
        search: this.search_term,
        date_from: transformedDateFrom,
        date_to: transformedDateto,
      };
      this.getOrders(1, this.payload);
    } else {
      console.log(this.payload);
      this.toasterService.showDanger('From and to is Required');
    }
  }
  private transformDate(date: Date): any {
    // Use the DatePipe to transform the Date to the desired format
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  resetSearch() {
    const today = this.currentDate;

    this.searchForm
      .get('Date_from')
      ?.setValue(new Date(today.getFullYear(), today.getMonth(), 1));
    this.searchForm.get('Date_to')?.setValue(today);
    this.searchForm.value.Date_to = '';
    this.search_term = '';
    this.getOrders(1);
  }
  exportExcel() {
    this.orderService.getExcel(2).subscribe({
      next: (res) => {
        // console.log(res);
        this.fileUrl = res[0];
      },
      error: (err) => {},
    });
  }

  navigateCreate() {
    this.router.navigate(['place-on-demand-order']);
  }

  // listenToCompanyChanges() {
  //   this.companyService.getSelectedCompany().subscribe((companyId) => {
  //     this.selectedCompanyId = companyId;
  //     this.getOrders(1);
  //   });
  // }

  editOrder(event: any): void {
    this.router.navigate(['/schedule-orders', 'update-order', event.id]);
  }
  deleteOrder() {
    this.orderService.deleteOrder(this.orderId).subscribe({
      next: (res) => {
        this.toasterService.showSuccess('Order Deleted!');
        this.getOrders(1);
      },
      error: (err) => this.toasterService.showDanger(err),
    });
  }
  confirmDeleteOrder(event: any, dialog: TemplateRef<any>): void {
    this.orderId = event.id;
    this.dialogService.open(dialog);
  }
  saveTable() {
    const payload = {
      // id: 1,
      colsScheduleOrders: this._selectedColumns,
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
  showData() {
    // console.log(this.source);
    // console.log(this.data);
    this.source.load({ ...this.data, days: this.data.days.join(', ') });
    this.loading = false;
  }
}
