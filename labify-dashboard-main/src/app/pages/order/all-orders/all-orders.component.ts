import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { CompanyService } from 'src/app/core/services/company.service';
import { OrderService } from 'src/app/core/services/order.service';
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
import { USER_ROLE, USER_KEY } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { StatusComponent } from './statusComponent.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UsersService } from 'src/app/core/services/users.service';
import { Observable, map, of } from 'rxjs';
import { CompanyName } from 'src/app/core/models/company-names.model';

@Component({
  selector: 'ngx-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent implements OnInit {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: any;
  allOrder!: any;
  selectedCompanyId!: any;
  pickup_address!: any;
  delivery_address!: any;
  fileUrl: any;
  selectedRows: any[] = [];
  first = 0;
  rows = 15;
  user_role: any;
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
    isAllSelected: false,
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
      order_code: {
        title: 'Order code',
        type: 'string',
      },
      order_date: {
        title: 'Order Date',
        type: 'string',
        width: '15%',
      },
      status_type: {
        title: 'status',
        type: 'string',
        // renderComponent:StatusComponent,
        width: '12%',
      },
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
      order_type: {
        title: 'Specimen Type',
        type: 'string',
      },

      pieces: {
        title: 'Pieces',
        type: 'string',
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
      // order_id: {
      //   title: 'ID',
      //   type: 'number',
      // },

      driver_name: {
        title: 'Driver',
        type: 'string',
      },

      pickup_actual_date: {
        title: 'Pickup actual Date',
        type: 'string',
      },
      deilvery_actual_date: {
        title: 'Delivery actual Date',
        type: 'string',
      },
    },
    rowClassFunction: (row: any) => {
      if (row.cells[0].newValue === 'pickedup') {
        return 'text-bg-white bg-warning ';
      } else if (row.cells[0].newValue === 'delivered') {
        return 'bg-success text-white';
      } else if (row.cells[0].newValue === 'Cancelled') {
        return 'bg-danger text-white';
      } else {
        return '';
      }
    },
  };
  totalRecords: any;
  search_term: any = '';
  payload: any;
  isAdmin: boolean = false;
  @ViewChild('companyInput') company_input: any;
  filteredCompanies$!: Observable<CompanyName[]>;
  companyName: any;
  allCompanies!: CompanyName[];
  optionsCompanies: CompanyName[];
  selected_user: any;
  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private companyService: CompanyService,
    private orderService: OrderService,
    private addressCompanyService: CompanyAddressService,
    private addressDoctorService: DoctorAddressService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private userServices: UsersService
  ) {
    this.selectedRows = [];
    const savedColumnsOrder = localStorage.getItem('colsOrders');
    this.user_role = localStorage.getItem('user_role');
    this.isAdmin = this.user_role === '"admin"';
    if (this.isAdmin) {
      this.companyService.getAllCompanyNames().subscribe((res) => {
        this.allCompanies = res;
        this.optionsCompanies = this.allCompanies;
        // console.log(this.drivers);
        this.filteredCompanies$ = of(this.optionsCompanies);
        // this.onCompanySelect(this.allCompanies[0].id);
        // console.log(this.allCompanies);
      });
    }
    console.log(this.isAdmin);
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

  role!: any;
  user!: any;
  paginationArgs!: any;
  currentDate: Date = new Date();
  firstDayDate: Date = new Date();
  searchForm!: FormGroup;
  @ViewChild('dt2') table: Table;
  ngOnInit(): void {
    // this.listenToCompanyChanges();
    const today = this.currentDate;
    this.searchForm = this.fb.group({
      Date_from: new FormControl(today, Validators.required),
      // Date_from: new FormControl(
      //   new Date(today.getFullYear(), today.getMonth(), 1),
      //   Validators.required
      // ),
      // Date_to: new FormControl(today, Validators.required),
      Date_to: new FormControl(today, Validators.required),
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      if (params['search']) {
        this.search_term = params['search'];
      }
      if (params['from']) {
        this.searchForm.get('Date_from')?.setValue(params['from']);
      }
      if (params['to']) {
        this.searchForm.get('Date_to')?.setValue(params['to']);
      }
      this.selected_user = params['company'];
      if (this.selected_user || this.search_term) {
        this.onCompanySelect(this.selected_user);
        this.onSearchKeyUp(this.search_term);
      }
      //  this.searchForm.get('Date_from')?.setValue(params['from']);
      console.log(this.search_term);
    });
    const savedColumns = localStorage.getItem('colsOrders');
    if (savedColumns) {
      this._selectedColumns = JSON.parse(savedColumns);
    } else {
      this._selectedColumns = this.cols;
    }
    this.exportExcel();
    this.onSubmit();
  }
  private filterCompanies(value: String): CompanyName[] {
    const filterValue = value.toLowerCase();
    return this.optionsCompanies.filter((optionValue: any) =>
      optionValue.name.toLowerCase().includes(filterValue)
    );
  }

  getFilteredCompany(value: String): Observable<CompanyName[]> {
    return of(value).pipe(
      map((filterString) => this.filterCompanies(filterString))
    );
  }
  onCompanyChange() {
    this.filteredCompanies$ = this.getFilteredCompany(
      this.company_input.nativeElement.value
    );
  }
  onCompanySelect(companyId: any) {
    this.selected_user = companyId;
    this.companyService.getCompanyById(companyId).subscribe((res) => {
      this.companyName = res.data.name;
    });
  }
  onColumnReorder(event: any) {
    // Save the new column order to local storage
    localStorage.setItem('colsOrders', JSON.stringify(event.columns));
    this.saveTable();
  }
  resetColumnOrder() {
    localStorage.removeItem('colsOrders'); // Remove saved order
    this.selectedColumns = this.cols; // Reset to default order
    // Optionally, you can update the table's columns
    this.table.reset();
  }
  getOrders(page: any, search?: any, $event?: LazyLoadEvent) {
    this.loading = true;
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    this.user = this.storageService.getLocalStorageValue(USER_KEY);

    if (this.role === 'company') {
      const page = $event?.first || 0;
      this.orderService
        .getOrdersOfCompany(page / 15 + 1 || 0, this.user.id, search)
        .subscribe({
          next: (res) => {
            this.data = res.data;
            this.source.load(this.data);
            this.paginationArgs = { ...res.pagination, id: 'pagination' };
            this.totalRecords = res.pagination.totalItems;
            this.loading = false;
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
    localStorage.setItem('colsOrders', JSON.stringify(this._selectedColumns));
    if (JSON.stringify(val) !== JSON.stringify(this._selectedColumns)) {
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
    }
  }

  onSearchKeyUp(event: any) {
    const term = event;
    this.search_term = term;
    if (term === '') {
      // this.getOrders(1, this.payload);
    }
    this.payload = {
      search: this.search_term,
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
      if (this.selected_user) {
        this.payload = {
          search: this.search_term,
          date_from: transformedDateFrom,
          date_to: transformedDateto,
          user_id: this.selected_user,
        };
        this.getOrders(1, this.payload);
      } else {
        this.payload = {
          search: this.search_term,
          // search: this.search_term,
          date_from: transformedDateFrom,
          date_to: transformedDateto,
        };
        this.getOrders(1, this.payload);
      }
    } else {
      console.log(this.payload);
      this.toasterService.showDanger('From and to is Required');
    }
  }
  private transformDate(date: Date): any {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  resetSearch() {
    const today = this.currentDate;

    this.searchForm.get('Date_from')?.setValue(today);
    this.searchForm.get('Date_to')?.setValue(today);
    this.searchForm.value.Date_to = '';
    this.search_term = '';
    this.companyName = '';
    this.getOrders(1);
  }
  exportExcel() {
    this.orderService.getExcel(22).subscribe({
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

  editOrder(event: any): void {
    this.router.navigate(['/track-orders', 'update-order', event.order_id], {
      queryParams: {
        search: this.search_term,
        from: this.transformDate(this.searchForm.value.Date_from),
        to: this.transformDate(this.searchForm.value.Date_to),
        company: this.selected_user,
      },
      queryParamsHandling: 'merge',
    });
  }
  viewOrder(event: any): void {
    this.router.navigate(['/track-orders', 'view-order', event.order_id], {
      queryParams: {
        search: this.search_term,
        from: this.transformDate(this.searchForm.value.Date_from),
        to: this.transformDate(this.searchForm.value.Date_to),
        company: this.selected_user,
      },
      queryParamsHandling: 'merge',
    });
  }
  saveTable() {
    const payload = {
      // id: 1,
      colsOrders: this._selectedColumns,
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
    this.source.load(this.data);
    this.loading = false;
  }
}
