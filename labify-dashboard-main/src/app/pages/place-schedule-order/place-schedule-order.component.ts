import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';
import { CompanyAddressService } from '../../core/services/company-address.service';
import { DoctorAddressService } from '../../core/services/doctor-address.service';
import { DatePipe } from '@angular/common';
import { FormManage } from '../../core/classes/form-manage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../core/services/toaster.service';
import { OrderService } from '../../core/services/order.service';
// import { StoreCompanyAddressComponent } from '../../company-address/store-company-address/store-company-address.component';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
// import { StoreDoctorAddressComponent } from '../../doctors/update-doctor/store-doctor-address/store-doctor-address.component';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreCompanyAddressComponent } from '../basic-maintenance/company-address/store-company-address/store-company-address.component';
import { NbDialogService } from '@nebular/theme';
import { StoreDoctorAddressComponent } from '../basic-maintenance/address-points/update-address/store-doctor-address/store-doctor-address.component';
import { CompanyName } from 'src/app/core/models/company-names.model';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-place-schedule-order',
  templateUrl: './place-schedule-order.component.html',
  styleUrls: ['./place-schedule-order.component.scss'],
})
export class PlaceScheduleOrderComponent extends FormManage implements OnInit {
  selectedCompanyId: any;
  selectedOption: any;
  selectedDeliveryOption: any;
  selectedItem = '0';
  selectedDeliveryItem = '0';
  addressList: any;
  addressListDelivery: any;
  deliveryAddressList: any;
  phone = '';
  delivery_phone = '';
  pickupDate: any = new Date();
  deliveryDate: any = new Date();
  readyByTime: any;
  noLaterThan: any;
  deliveryReadyByTime: any;
  deliveryNoLaterThan: any;
  formattedDate: any;
  pickupNotes: any;
  deliveryNotes: any;
  selectedAddress: any;
  selectedDeliveryAddress: any;
  orderForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  selectedService: any;
  companyName: any;
  autoPickup = false;
  address: any;
  autoDelivery: boolean = false;
  selectedOrderType: any;
  filteredPickup$!: Observable<any[]>;
  filteredDelivery$!: Observable<any[]>;
  inputText!: string;
  searchTerm = '';
  filteredItems = [];
  options: any;
  transformedArray: any;
  selectedPickup: any;
  isSelectedPickedup: boolean = false;
  isSelectedDelivery: boolean = false;
  selectedDelivery: any;
  deliveryArray: any;
  order_code: any;
  day!: string;
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDays: string[] = [];
  selectedDay: any;
  @ViewChild('autoInput') input: any;
  @ViewChild('deleteDialog') dialog!: TemplateRef<any>;
  @ViewChild('orderCreatedDialog') orderCreatedDialog!: TemplateRef<any>;
  @ViewChild('autoDeliveryInput') delivery_input: any;
  constructor(
    private companyService: CompanyService,
    private addressCompanyService: CompanyAddressService,
    private addressDoctorService: DoctorAddressService,
    public datePipe: DatePipe,
    private router: Router,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private storageService: StorageService
  ) {
    super();
    this.pickupDate = new Date();
  }
  user!: any;
  role!: any;
  allCompanies!: CompanyName[];

  getTime(date: Date) {
    let hh = `${date.getHours()}`;
    let mm = `${date.getMinutes()}`;
    if (hh.length === 1) hh = `0${hh}`;
    if (mm.length === 1) mm = `0${mm}`;
    return `${hh}:${mm}`;
  }

  ngOnInit(): void {
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    if (this.role === 'company') {
      this.companyName = this.user.name;
      this.selectedCompanyId = this.user.id;
      this.onCompanySelect(this.selectedCompanyId);
    } else {
      this.companyService.getAllCompanyNames().subscribe((res) => {
        this.allCompanies = res;
        // this.onCompanySelect(this.allCompanies[0].id);
        // console.log(this.allCompanies);
      });
    }
    this.initOrderForm();
  }

  onCompanySelect(companyId: any) {
    this.selectedCompanyId = companyId;
    this.addressDoctorService.setSelectedCompanyId(this.selectedCompanyId);
    this.selectedPickup={};
    this.selectedDelivery={};
    this.selectedPickup = '';
    this.filteredPickup$ = of([]);
    this.filteredDelivery$ = of([]);
    this.input.nativeElement.value = '';
    this.delivery_input.nativeElement.value = "";
    this.getAllAddresses();
    this.companyService.getCompanyById(companyId).subscribe((res) => {
      // console.log(res);
      this.setContollerValue('type_price', res.data.type);
      this.companyName = res.data.name;
    });
    this.resetForm();
    this.setContollerValue('pickup_date', this.getFormattedToday());
    this.setContollerValue('delivery_date', this.getFormattedToday());
    this.pickupDate = new Date();
    this.deliveryDate = new Date();
  }

  initOrderForm() {
    this.orderForm = new FormGroup({
      // orderId: new FormControl(this.orderId),

      pickup: new FormControl(''),
      pickup_contact: new FormControl(''),
      pickup_phone: new FormControl(''),
      pickup_ext: new FormControl(''),
      delivery_ext: new FormControl(''),
      pickup_instructions: new FormControl(''),
      pickup_date: new FormControl(this.getFormattedToday()),
      delivery_date: new FormControl(this.getFormattedToday()),
      pickup_ready_by: new FormControl(''),
      pickup_no_later_than: new FormControl(''),
      delivery_ready_by: new FormControl(''),
      delivery_no_later_than: new FormControl(''),
      pickup_address_company_id: new FormControl(''),
      pickup_address_doctor_id: new FormControl(''),
      delivery_address_company_id: new FormControl(''),
      delivery_address_doctor_id: new FormControl(''),
      delivery: new FormControl(''),
      delivery_contact: new FormControl(''),
      delivery_phone: new FormControl(''),
      delivery_instructions: new FormControl(''),
      delivery_pieces: new FormControl(''),
      delivery_weight: new FormControl(''),
      delivery_insurance_value: new FormControl(''),
      delivery_reference_number: new FormControl(''),
      service_type: new FormControl(''),
      type_price: new FormControl(''),
      delivery_bol_number: new FormControl('123456'),
      order_type: new FormControl(''),
      days: new FormControl(''),
    });
    this.setForm(this.orderForm);
  }
  getFormattedToday(): string {
    const today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }
  onSubmit(dialog: TemplateRef<any>) {
    // console.log(this.FormValue);

    if (this.readyByTime) {
      let time = this.getTime(new Date(this.readyByTime));
      this.setContollerValue('pickup_ready_by', time);
    }

    if (this.noLaterThan) {
      let time = this.getTime(new Date(this.noLaterThan));
      this.setContollerValue('pickup_no_later_than', time);
    }

    if (this.deliveryReadyByTime) {
      let time = this.getTime(new Date(this.deliveryReadyByTime));
      this.setContollerValue('delivery_ready_by', time);
    }

    if (this.deliveryNoLaterThan) {
      let time = this.getTime(new Date(this.deliveryNoLaterThan));
      this.setContollerValue('delivery_no_later_than', time);
    }

    this.setContollerValue('pickup_instructions', this.pickupNotes);
    this.setContollerValue('delivery_instructions', this.deliveryNotes);
    // console.log(this.isFormValid);
    this.loading = true;
    this.orderService
      .createScheduleOrder(this.FormValue, this.selectedCompanyId)
      .subscribe(
        (res) => {
          this.openDialog(this.orderCreatedDialog);
          this.loading = false;
          this.order_code = res.order.order_code;
          // console.log(res.order.order_code);
        },
        (err) => {
          this.loading = false;
          this.toasterService.showDanger(err.error.message);
        }
      );
  }
  // listenToCompanyChanges() {
  //   this.companyService.getSelectedCompany().subscribe((companyId) => {
  //     this.selectedCompanyId = companyId;
  //     this.getAllAddresses();
  //     this.companyService.getCompanyById(companyId).subscribe((res) => {
  //       // console.log(res);
  //       this.setContollerValue('type_price', res.data.type);
  //       this.companyName = res.data.name;
  //     });
  //     this.resetForm();
  //     this.setContollerValue('pickup_date', this.getFormattedToday());
  //   });
  // }
  getAllAddresses() {
    this.orderService.getAllAddresses(this.selectedCompanyId).subscribe({
      next: (data) => {
        // console.log(data);
        this.addressList = data;
        this.transformedArray = data.map(
          (item: any) =>
            item.address_name + ', ' + item.address + ', ' + item.phone
        );
        this.deliveryArray = data.map(
          (item: any) =>
            item.address_name + ', ' + item.address + ', ' + item.phone
        );
        // console.log(this.transformedArray);
        this.filteredPickup$ = of(this.transformedArray);
        this.filteredDelivery$ = of(this.deliveryArray);
      },
    });
  }
  private filterPickup(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.transformedArray.filter((optionValue: any) =>
      optionValue.toLowerCase().includes(filterValue)
    );
  }
  private filterDelivery(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.deliveryArray.filter((optionValue: any) =>
      optionValue.toLowerCase().includes(filterValue)
    );
  }
  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map((filterString) => this.filterPickup(filterString))
    );
  }
  getFilteredDelivery(value: string): Observable<string[]> {
    return of(value).pipe(
      map((filterString) => this.filterDelivery(filterString))
    );
  }
  onChange() {
    this.isSelectedPickedup = false;
    // console.log(this.isSelectedPickedup);
    this.filteredPickup$ = this.getFilteredOptions(
      this.input.nativeElement.value
    );
  }
  onDeliveryChange() {
    this.isSelectedDelivery = false;
    this.filteredDelivery$ = this.getFilteredDelivery(
      this.delivery_input.nativeElement.value
    );
  }
  onSelectionChange($event: any) {
    this.isSelectedPickedup = true;
    // console.log(this.isSelectedPickedup);
    this.filteredPickup$ = this.getFilteredOptions($event);
    const selectedIndex = this.transformedArray.indexOf($event);
    this.selectedPickup = this.addressList[selectedIndex];
    this.phone = this.selectedPickup.phone;
    this.pickupNotes = this.selectedPickup.address_notes;
    // console.log('Selected Index:', selectedIndex);
    // console.log(this.addressList[selectedIndex]);
    this.setContollerValue('pickup', this.selectedPickup.type);
    if (this.selectedPickup.type === 'company') {
      this.setContollerValue(
        'pickup_address_company_id',
        this.selectedPickup.id
      );
    } else {
      this.setContollerValue(
        'pickup_address_doctor_id',
        this.selectedPickup.id
      );
    }
  }
  onDeliverySelectionChange($event: any) {
    this.isSelectedDelivery = true;
    // console.log(this.isSelectedDelivery);
    this.filteredDelivery$ = this.getFilteredDelivery($event);
    const selectedIndex = this.transformedArray.indexOf($event);
    this.selectedDelivery = this.addressList[selectedIndex];
    this.delivery_phone = this.selectedDelivery.phone;
    this.deliveryNotes = this.selectedDelivery.address_notes;
    // console.log('Selected Index:', selectedIndex);
    // console.log(this.addressList[selectedIndex]);
    this.setContollerValue('delivery', this.selectedDelivery.type);
    if (this.selectedDelivery.type === 'company') {
      this.setContollerValue(
        'delivery_address_company_id',
        this.selectedDelivery.id
      );
    } else {
      this.setContollerValue(
        'delivery_address_doctor_id',
        this.selectedDelivery.id
      );
    }
  }
  onDateInput(event: any) {
    this.pickupDate = event;
    this.pickupDate =
      this.datePipe.transform(new Date(this.pickupDate), 'yyyy-MM-dd') || '';
    this.setContollerValue('pickup_date', this.pickupDate);
    // console.log(this.pickupDate);
  }
  onDateDeliveryInput(event: any) {
    this.deliveryDate = event;
    this.deliveryDate =
      this.datePipe.transform(new Date(this.deliveryDate), 'yyyy-MM-dd') || '';
    this.setContollerValue('delivery_date', this.deliveryDate);
    // console.log(this.deliveryDate);
  }
  openWindow() {
    this.windowService.open(StoreCompanyAddressComponent, {
      title: `Company Address`,
      context: {},
    });
    // console.log(NbWindowRef);
  }
  openDoctorWindow() {
    this.windowService.open(StoreDoctorAddressComponent, {
      title: `Doctor Address`,
      context: {},
    });
    // console.log(NbWindowRef);
  }
  getAddress() {
    this.autoPickup = true;
    this.selectedItem = 'company';
    this.setContollerValue('pickup', 'company');
    this.isSelectedPickedup = true;
    this.selectedPickup = this.addressList[0];
    this.phone = this.selectedPickup.phone;
    this.pickupNotes = this.selectedPickup.address_notes;
    this.setContollerValue('pickup', this.selectedPickup.type);
    if (this.selectedPickup.type === 'company') {
      this.setContollerValue(
        'pickup_address_company_id',
        this.selectedPickup.id
      );
    } else {
      this.setContollerValue(
        'pickup_address_doctor_id',
        this.selectedPickup.id
      );
    }
  }
  toggleAuto() {
    this.autoPickup = !this.autoPickup;
    this.selectedPickup = {};
     this.phone = '';
     this.pickupNotes = '';
     this.setContollerValue('pickup_address_company_id', '');
     this.setContollerValue('pickup', '');
  }
  toggleDeliveryAuto() {
    this.autoDelivery = !this.autoDelivery;
    this.selectedDelivery = {};
     this.delivery_phone = '';
     this.deliveryNotes = '';
     this.setContollerValue('delivery_address_company_id', '');
     this.setContollerValue('delivery', '');
  }
  getDeliveryAddress() {
    this.autoDelivery = true;
    this.selectedDeliveryItem = 'company';
    this.setContollerValue('delivery', 'company');
    this.isSelectedDelivery = true;
    this.selectedDelivery = this.addressList[0];
    this.delivery_phone = this.selectedDelivery.phone;
    this.deliveryNotes = this.selectedDelivery.address_notes;
    this.setContollerValue('delivery', this.selectedDelivery.type);

    if (this.selectedDelivery.type === 'company') {
      this.setContollerValue(
        'delivery_address_company_id',
        this.selectedDelivery.id
      );
    } else {
      this.setContollerValue(
        'delivery_address_doctor_id',
        this.selectedDelivery.id
      );
    }
  }
  goBack() {
    return this.router.navigate(['schedule-orders']);
  }
  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: 'This is a title passed to the dialog component',
    });
  }
  createSchedule() {
    // const form = {
    //   day: this.selectedDay,
    // }
    // const payloads = this.selectedDays.map((day) => ({
    //   day: day,

    // }));
    // console.log(this.selectedDays);
    this.setContollerValue('days', this.selectedDays);

    // // console.log(payloads);
    // for (const payload of payloads) {
    //   this.companyScheduleService.createSchedule(payload).subscribe({
    //     next: (res) => {
    //       this.toaster.showSuccess('Schedule Created successfully');
    //       this.getSchedules();
    //     },
    //     error: (err) => {
    //       this.toaster.showDanger(err.error.message);
    //     },
    //   });
    // }
  }
  confirmCreateSchedule(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog);
  }
  toggleDaySelection(day: string): void {
    const index = this.selectedDays.indexOf(day);
    // console.log('index: ' + index);
    if (index !== -1) {
      // If the day is already selected, remove it from the array
      this.selectedDays.splice(index, 1);
      // console.log(this.selectedDays);
    } else {
      // If the day is not selected, add it to the array
      this.selectedDays.push(day);
      // console.log(this.selectedDays);
    }
  }
}
