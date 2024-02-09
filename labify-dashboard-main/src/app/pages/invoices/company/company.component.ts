import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyName } from 'src/app/core/models/company-names.model';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { OrderService } from '../../../core/services/order.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  isCompanySelected: boolean = false;
  selectedCompanyId: any;
  user: any;
  role: any;
  companyName: any;
  allCompanies: CompanyName[];
  searchForm: FormGroup;
  data!: any;
  paginationArgs!: any;
  totalRecords: any;
  first = 0;
  rows = 15;
  currentDate: Date = new Date();
  firstDayOfCurrentMonth: Date;
  date_to: Date;
  isLoading: boolean = false;
  total = 0;
  isLink = false;
  linkUrl:any;
  constructor(
    private companyService: CompanyService,
    public datePipe: DatePipe,
    private router: Router,
    private toasterService: ToasterService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.calculateDates();
    // this.pickupDate = new Date();
  }

  ngOnInit(): void {
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    this.searchForm = this.fb.group({
      Date_from: new FormControl(
        this.firstDayOfCurrentMonth,
        Validators.required
      ),
      Date_to: new FormControl(this.date_to, Validators.required),
    });
    if (this.role === 'company') {
      this.companyName = this.user.name;
      this.selectedCompanyId = this.user.id;

      this.getInvoice(1);
      // this.onCompanySelect(this.selectedCompanyId);
    } else {
      this.companyService.getAllCompanyNames().subscribe((res) => {
        this.allCompanies = res;
        // this.onCompanySelect(this.allCompanies[0].id);
        console.log(this.allCompanies);
      });
    }
  }
  calculateDates() {
    // Get the current date
    // Get the current date
    const today = this.currentDate;

    // Calculate the first day of the current month
    const firstDayOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    this.firstDayOfCurrentMonth = firstDayOfCurrentMonth;
    this.date_to = today;
  }
  onSubmit() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
      const transformedDateFrom = this.transformDate(
        this.searchForm.value.Date_from
      );
      const transformedDateto = this.transformDate(
        this.searchForm.value.Date_to
      );
      console.log(transformedDateFrom);
      const payload = {
        date_from: this.transformDate(transformedDateFrom),
        date_to: this.transformDate(transformedDateto),
      };
      this.getInvoice(1);
      // this.getOrders(1, payload);
    } else {
      this.toasterService.showDanger('From and to is Required');
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
  private transformDate(date: Date): any {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  resetSearch() {
    this.searchForm.reset();
    // this.selectedCompanyId='';
    // this.getOrders(1);
  }
  onCompanySelect(companyId: any) {
    this.isCompanySelected = true;
    this.selectedCompanyId = companyId;
  }
  getInvoice(page: any, $event?: LazyLoadEvent) {
    this.isLoading = true;

    if (page !== 1) {
      page = $event?.first || 0;
      this.orderService
        .getInvoices(
          page / 15 + 1 || 0,
          this.selectedCompanyId,
          this.transformDate(this.searchForm.value.Date_from),
          this.transformDate(this.searchForm.value.Date_to)
        )
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.getDownloadLink();
            this.data = res.data;
            this.paginationArgs = { ...res.pagination, id: 'pagination' };
            this.totalRecords = res.pagination.totalItems;
            this.total = res.total;
            console.log(this.data, this.totalRecords, this.paginationArgs);
          },
          error: (err) => {
            this.isLoading = false;
            this.toasterService.showDanger(err.error.message);
          },
        });
    } else {
      this.orderService
        .getInvoices(
          page,
          this.selectedCompanyId,
          this.transformDate(this.searchForm.value.Date_from),
          this.transformDate(this.searchForm.value.Date_to)
        )
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.getDownloadLink();

            this.data = res.data;
            this.paginationArgs = { ...res.pagination, id: 'pagination' };
            this.totalRecords = res.pagination.totalItems;
            console.log(this.data, this.totalRecords, this.paginationArgs);
          },
          error: (err) => {
            this.isLoading = false;
            this.toasterService.showDanger(err.error.message);
          },
        });
    }
  }
  getDownloadLink() {
    this.orderService
      .getCompanyInvoicesLink(
        this.selectedCompanyId,
        this.transformDate(this.searchForm.value.Date_from),
        this.transformDate(this.searchForm.value.Date_to)
      )
      .subscribe({
        next: (res) => {
          if (res.pdf_url) {
            this.isLink = true;
            this.linkUrl=res.pdf_url;
          }
        },
        error: (err) => {
          this.isLink = false;
          //  this.toasterService.showDanger(err.error.message);
        },
      });
  }
}
