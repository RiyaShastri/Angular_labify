import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { StorageService } from 'src/app/core/services/storage.service';
import { USER_KEY, USER_ROLE, USER_TYPE } from 'src/app/core/services/auth.service';
import { CompanyName } from 'src/app/core/models/company-names.model';
import { Driver } from '../../core/models/driver.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAddressComponent } from '../basic-maintenance/address-points/create-address/create-address.component';
import { AssignDriversService } from 'src/app/core/services/assign-drivers.service';

@Component({
  selector: 'app-place-on-demand-order',
  templateUrl: './place-on-demand-order.component.html',
  styleUrls: ['./place-on-demand-order.component.scss'],
})
export class PlaceOnDemandOrderComponent extends FormManage implements OnInit {
  isDays: boolean = false;
  // isOpen: boolean=false;
  private _isOpen = false;
  user_type: string;

  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    this.onIsOpenChange();
  }

  get isOpen(): boolean {
    return this._isOpen;
  }
  onIsOpenChange() {
    // This function will be called whenever isOpen changes
    if (this.isOpen) {
      // Handle the case when isOpen becomes true
      this.getAllAddresses();
    } else {
      // Handle the case when isOpen becomes false
      this.getAllAddresses();
    }
  }
  isCompanySelected: boolean = false;
  openedByOverlay: boolean = false;
  constructor(
    // public dialogServicePrime: DialogService,
    private companyService: CompanyService,
    private addressCompanyService: CompanyAddressService,
    private addressDoctorService: DoctorAddressService,
    public datePipe: DatePipe,
    private router: Router,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private storageService: StorageService,
    private assignDriversService: AssignDriversService
  ) {
    super();
    this.pickupDate = new Date();
  }
  // ref: DynamicDialogRef;
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
  optionsCompanies: any;
  filteredDrivers$!: Observable<Driver[]>;
  filteredCompanies$!: Observable<CompanyName[]>;
  selectedDriver!: Driver;
  drivers: any;
  transformedArray: any;
  selectedPickup: any;
  isSelectedPickedup: boolean = false;
  isSelectedDelivery: boolean = false;
  selectedDelivery: any;
  deliveryArray: any;
  order_code: any;
  @ViewChild('autoInput') input: any;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  @ViewChild('orderCreatedDialog') orderCreatedDialog!: TemplateRef<any>;
  @ViewChild('autoDeliveryInput') delivery_input: any;
  @ViewChild('driverInput') driver_input: any;
  @ViewChild('companyInput') company_input: any;

  SelectAddress: any;
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

  user!: any;
  role!: any;
  allCompanies!: CompanyName[];
  optionsDriver!: Driver[];
  isSchedule = false;
  ngOnInit(): void {
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    this.user_type = this.storageService.getLocalStorageValue(USER_TYPE);
    if (this.role === 'company' ) {
      this.companyName = this.user.name;
      this.selectedCompanyId = this.user.id;
      this.onCompanySelect(this.selectedCompanyId);
    }else if (this.user.id && this.role !== 'admin' && this.role !== 'account_manager') {
      this.selectedCompanyId = this.user.id;
      console.log(this.selectedCompanyId);
      this.onCompanySelect(this.selectedCompanyId);
    } else {
      this.companyService.getAllCompanyNames().subscribe((res) => {
        this.allCompanies = res;
        this.optionsCompanies = this.allCompanies;
        // console.log(this.drivers);
        this.filteredCompanies$ = of(this.optionsCompanies);
        // this.onCompanySelect(this.allCompanies[0].id);
        // console.log(this.allCompanies);
      });
    }
    if (this.user_type === 'admin' || this.user_type === 'user-admin') {
      this.role = 'admin';
       this.companyService.getAllCompanyNames().subscribe((res) => {
         this.allCompanies = res;
         this.optionsCompanies = this.allCompanies;
         // console.log(this.drivers);
         this.filteredCompanies$ = of(this.optionsCompanies);
         // this.onCompanySelect(this.allCompanies[0].id);
         // console.log(this.allCompanies);
       });
    } else {
      this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    }
    // this.listenToCompanyChanges();
    this.initOrderForm();
    this.getAllDriveres();
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

  getAllDriveres() {
    this.assignDriversService.getAllDrivers().subscribe((res) => {
      this.drivers = res;
      this.optionsDriver = this.drivers;
      // console.log(this.drivers);
      this.filteredDrivers$ = of(this.optionsDriver);
    });
  }
  private filterDrivers(value: String): Driver[] {
    const filterValue = value.toLowerCase();
    return this.optionsDriver.filter((optionValue: any) =>
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
      // order_id: this.orderId,
      driver_id: this.selectedDriver.id,
    };
    // this.orderService.assignDriver(payload).subscribe({
    //   next: (res) => {
    //     this.toasterService.showSuccess('Driver assigned');
    //     this.location.back();

    //   },
    //   error: (err) => {
    //     this.toasterService.showDanger("Driver Didn't assigned");
    //   },
    // });
  }

  onDriverSelectionChange($event: Driver) {
    this.filteredDrivers$ = this.getFilteredDrivers($event.name);
    this.selectedDriver = $event;
    this.setContollerValue('driver_id', this.selectedDriver?.id);
    this.driver_input.nativeElement.value = this.selectedDriver.name;
  }

  toggle(checked: boolean) {
    this.isSchedule = checked;
  }
  getTime(date: Date) {
    let hh = `${date.getHours()}`;
    let mm = `${date.getMinutes()}`;
    if (hh.length === 1) hh = `0${hh}`;
    if (mm.length === 1) mm = `0${mm}`;
    return `${hh}:${mm}`;
  }

  onCompanySelect(companyId: any) {
    this.isCompanySelected = true;
    this.selectedCompanyId = companyId;
    this.addressDoctorService.setSelectedCompanyId(this.selectedCompanyId);
    this.selectedPickup = {};
    this.selectedDelivery = {};
    this.selectedPickup = '';
    this.SelectAddress = '';
    this.filteredPickup$ = of([]);
    this.filteredDelivery$ = of([]);
    // if (this.input) this.input.nativeElement.value = '';
    // this.delivery_input.nativeElement.value = '';
    this.getAllAddresses();
    this.companyService.getCompanyById(companyId).subscribe((res) => {
      // console.log(res);
      this.setContollerValue('type_price', res.data.type);
      this.companyName = res.data.name;
      // this.resetForm();
      this.setContollerValue('pickup_contact', '');
      this.setContollerValue('pickup_ready_by', '');
      this.setContollerValue('pickup_no_later_than', '');
      this.pickupNotes = '';
      this.readyByTime = 0;
      this.noLaterThan = 0;
    });
    // this.setContollerValue('delivery_date', this.getFormattedToday());
    this.pickupDate = new Date();
    this.deliveryDate = new Date();
  }

  initOrderForm() {
    this.orderForm = new FormGroup({
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
      driver_id: new FormControl(''),
    });
    this.setForm(this.orderForm);
  }
  getFormattedToday(): string {
    const today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }

  onSubmit(dialog: TemplateRef<any>) {
    // console.log(this.FormValue);
    // this.setContollerValue('pickup_date', this.getFormattedToday());

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

    // this.setContollerValue('pickup_instructions', this.pickupNotes);
    // this.setContollerValue('delivery_instructions', this.deliveryNotes);
    // console.log(this.isFormValid);
    this.loading = true;
    if (this.isSchedule) {
      this.setContollerValue('pickup_date','');
      this.setContollerValue('delivery_date', '');
      this.orderService
        .createScheduleOrder(this.FormValue, this.selectedCompanyId)
        .subscribe(
          (res) => {
            this.openDialog(this.orderCreatedDialog);
            this.loading = false;
            // this.order_code = res.order.order_code;
            // // console.log(res.order.order_code);
          },
          (err) => {
            this.loading = false;
            this.toasterService.showDanger(err.error.message);
          }
        );
    } else {
      this.orderService
        .createOrder(this.FormValue, this.selectedCompanyId)
        .subscribe(
          (res) => {
            this.openDialog(this.orderCreatedDialog);
            this.loading = false;
            this.order_code = res.order.order_code;
          },
          (err) => {
            this.loading = false;
            this.toasterService.showDanger(err.error.message);
          }
        );
    }
  }

  getAllAddresses() {
    this.orderService.getAllAddresses(this.selectedCompanyId).subscribe({
      next: (data) => {
        // console.log(data);
        this.addressList = data;
        this.transformedArray = data.map(
          (item: any) => item.address_name + ', ' + item.address
        );
        this.deliveryArray = data.map(
          (item: any) => item.address_name + ', ' + item.address
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
    this.windowService.open(CreateAddressComponent, {
      title: `Company Address`,
      context: {},
    });
    // this.ref = this.dialogServicePrime.open(StoreCompanyAddressComponent, { header: 'new Address'});

    // // console.log(NbWindowRef);
  }
  show() {}
  openDoctorWindow(event: MouseEvent) {
    // const dialogRef = this.windowService.open(StoreDoctorAddressComponent, {
    //   title: `Doctor Address`,
    //   context: {},
    // });

    // // console.log(NbWindowRef);
    if (event.target === event.currentTarget) {
      this.isOpen = !this.isOpen;
      this.openedByOverlay = true;
      this.getAllAddresses();
    }
  }
  stopPropagation(event: MouseEvent) {
    this.getAllAddresses();

    // Stop event propagation to prevent it from reaching the overlay div
    event.stopPropagation();
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
  toggleDeliveryAuto() {
    this.autoDelivery = !this.autoDelivery;
    this.selectedDelivery = {};
    this.delivery_phone = '';
    this.deliveryNotes = '';
    this.setContollerValue('delivery_address_company_id', '');
    this.setContollerValue('delivery', '');
  }
  confirmCreateSchedule(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog);
  }
  openAddLocation(dialog: TemplateRef<any>): void {
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
  createSchedule() {
    // console.log(this.selectedDays);
    this.isDays = true;
    this.setContollerValue('days', this.selectedDays);
  }
  goBack() {
    return this.router.navigate(['track-orders']);
  }
  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: 'This is a title passed to the dialog component',
    });
  }
}
