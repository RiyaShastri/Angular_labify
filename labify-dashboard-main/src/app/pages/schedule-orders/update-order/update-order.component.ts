import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { DoctorAddressService } from 'src/app/core/services/doctor-address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { OrderService } from 'src/app/core/services/order.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { Observable, forkJoin, map, of } from 'rxjs';

// import * as html2pdf from 'html2pdf.js';
import { TwoPinAddressMapComponent } from '../../../shared/components/two-pin-address-map/two-pin-address-map.component';
import { StorageService } from 'src/app/core/services/storage.service';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';
//@ts-ignore
import * as html2pdf from 'html2pdf.js';
import { Driver } from 'src/app/core/models/driver.model';
import { FormManage } from '../../../core/classes/form-manage';
import { FormGroup, FormControl } from '@angular/forms';
import { ScheduleOrderService } from 'src/app/core/services/schedule-order.service';
import { NbDialogService } from '@nebular/theme';
import { AssignDriversService } from 'src/app/core/services/assign-drivers.service';
type MarkerPosition = {
  lat: any;
  lng: any;
};
@Component({
  selector: 'ngx-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UpdateOrderComponent extends FormManage implements OnInit {
  phone: any;
  pickupNotes: any;
  delivery_phone: any;
  deliveryNotes: any;
  role: any;
  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private orderService: ScheduleOrderService,
    // private driversService: DriversService,
    private assignDriversService: AssignDriversService,
    private activatedRoute: ActivatedRoute,
    private StorageService: StorageService,
    private companyService: CompanyService,
    private dialogService: NbDialogService
  ) {
    super();
  }
  // companyService: any;
  selectedCompanyId: any;
  addressList: any;
  deliveryArray: any;
  companyName: any;
  printingBill = false;
  printingPieces = false;
  orderForm!: FormGroup;
  filteredPickup$!: Observable<any[]>;
  filteredDelivery$!: Observable<any[]>;
  pieces: Piece[] = [];
  transformedArray: any;
  selectedPickup: any;
  isSelectedPickedup: boolean = false;
  isSelectedDelivery: boolean = false;
  selectedDelivery: any;
  options!: Driver[];
  filteredOptions$!: Observable<Driver[]>;
  selectedDriver!: Driver;
  searchTerm = '';
  filteredItems = [];
  @ViewChild('autoInput') input!: any;
  @ViewChild('autoDeliveryInput') delivery_input: any;
  @ViewChild('autoPickupInput') pickup_input: any;
  @ViewChild('twoPinAddressMapComponent')
  twoPinAddressMapComponent!: TwoPinAddressMapComponent;
  pickup_readyby2 = new FormControl(new Date());
  drivers: any;
  loading: any;
  orderId: any;
  order: any;
  pickup_address: any;
  pickupAddress: any;
  pickup_address_name: any;
  delivery_address: any;
  deliveryAddress: any;
  delivery_address_name: any;
  pinPosition: any;
  secondPinPosition: any;
  positionsAdded = false;
  lat: any;
  long: any;
  status = ['Cancelled', 'pending', 'pickedup', 'delivered'];
  order_status: any;
  selectedStatus: any;
  formattedReference: any;
  formattedOrderCode: any;
  user: any;
  order_code: any;
  selectedDays: string[] = [];
  pickup_readyby3 = new Date();
  pickup_readyby: any;
  delivery_readyby: any;

  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedOrderType: any;
  selectedService: any;
  updateDays() {
    this.order.days = this.selectedDays;
  }

  ngOnInit(): void {
    this.role = this.StorageService.getLocalStorageValue(USER_ROLE);

    this.getAllDriveres();
    this.getOrderData();
    // this.secondPinPosition;
    this.initOrderForm();
  }

  initOrderForm() {
    this.orderForm = new FormGroup({
      userId: new FormControl(this.selectedCompanyId),
      pickup: new FormControl(''),
      pickup_contact: new FormControl(''),
      pickup_phone: new FormControl(''),
      pickup_ext: new FormControl(''),
      delivery_ext: new FormControl(''),
      pickup_instructions: new FormControl(''),
      // pickup_date: new FormControl(this.getFormattedToday()),
      delivery_date: new FormControl(''),
      pickup_ready_by: new FormControl(''),
      pickup_time: new FormControl(this.pickup_readyby),
      delivery_time: new FormControl(this.delivery_readyby),
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
      driver_id: new FormControl(''),
      // delivery_bol_number: new FormControl('123456'),
      order_type: new FormControl(''),
    });
    this.setForm(this.orderForm);
  }

  // listenToCompanyChanges() {
  //   this.companyService.getSelectedCompany().subscribe((companyId:any) => {
  //     this.selectedCompanyId = companyId;
  //     // console.log("id:"+companyId);
  //     // this.setContollerValue('userId',companyId)
  //     // this.getAllAddresses();
  //     // this.companyService.getCompanyById(companyId).subscribe((res:any) => {
  //     //   // console.log(res);
  //     //   this.setContollerValue('type_price', res.data.type);
  //     //   this.companyName = res.data.name;
  //     // });
  //     this.initOrderForm();
  //     // this.setContollerValue('pickup_date', this.getFormattedToday());
  //   });
  // }

  onSubmit() {
    // // console.log(this.FormValue);
    this.setContollerValue('pickup_time', this.pickup_readyby);
    this.setContollerValue('delivery_time', this.delivery_readyby);
    // // console.log(this.isFormValid);
    this.loading = true;
    this.orderService
      .updateOrder({ ...this.FormValue, days: this.order.days }, this.orderId)
      .subscribe(
        (res) => {
          this.loading = false;
          this.toasterService.showSuccess('Order Updated Successfully');
          this.router.navigate(['/schedule-orders']);
        },
        (err) => {
          this.loading = false;
          this.toasterService.showDanger(err.error.message);
        }
      );
  }

  getAllDriveres() {
    this.assignDriversService.getAllDrivers().subscribe((res) => {
      this.drivers = res;
      this.options = this.drivers;
      this.filteredOptions$ = of(this.options);
    });
  }

  private filter(value: String): Driver[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((optionValue) =>
      optionValue.name.toLowerCase().includes(filterValue)
    );
  }

  getFilteredOptions(value: String): Observable<Driver[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString)));
  }

  onChange() {
    this.filteredOptions$ = this.getFilteredOptions(
      this.input.nativeElement.value
    );
  }

  onSelectionChange($event: Driver) {
    this.filteredOptions$ = this.getFilteredOptions($event.name);
    this.selectedDriver = $event;
    this.setContollerValue('driver_id', this.selectedDriver?.id);
    this.input.nativeElement.value = this.selectedDriver.name;
  }

  onOptionSelected() {
    this.onSubmit();
  }

  onStatusSelected() {
    const payload = {
      status: this.selectedStatus,
    };
    // console.log(payload);
    this.orderService.updateStatus(this.orderId, payload).subscribe({
      next: (res) => {
        this.toasterService.showSuccess('Status updated');
      },
      error: (err) => {
        this.toasterService.showDanger("status Didn't updated");
      },
    });
  }

  navigateUpdate() {
    this.router.navigate(['/track-orders', 'order-status', this.orderId]);
  }

  formatNumberWithLeadingZeros(num: number, desiredLength: number): string {
    const numStr = num?.toString();
    const numLength = numStr?.length;

    if (numLength >= desiredLength) {
      return numStr;
    }

    const diff = desiredLength - numLength;
    const leadingZeros = '0'.repeat(diff);
    return leadingZeros + numStr;
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog);
  }

  getOrderData() {
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params['id'];
      if (this.orderId)
        this.orderService.getOrderById(this.orderId).subscribe((res) => {
          // console.log(res);
          this.order = res.data;
          this.selectedCompanyId = res.data.user_id;
          this.selectedService = this.order.service;
          this.selectedOrderType = this.order.order_type;
          this.selectedDriver = this.order.driver;
          this.selectedStatus = this.order.status.status;
          this.pickupAddress = this.order.pickup.address;
          this.pickup_address_name = this.order.pickup_address_name;
          this.deliveryAddress = this.order.delivery.address;
          this.delivery_address_name = this.order.delivery_address_name;
          this.pieces = this.order.pieces;
          this.selectedDays = this.order.days;
          this.pickup_readyby = this.order.pickup_time;
          this.formattedReference = this.formatNumberWithLeadingZeros(
            res.data.delivery_reference_number,
            4
          );
          this.formattedOrderCode = this.formatNumberWithLeadingZeros(
            res.data.order_code,
            8
          );
          this.user = this.StorageService.getLocalStorageValue(USER_KEY);
          this.pinPosition = {
            lat: this.order.pickup.lat,
            lng: this.order.pickup.long,
          };
          this.secondPinPosition = {
            lat: this.order.delivery.lat,
            lng: this.order.delivery.long,
          };
          this.deliveryNotes = ` ${
            this.order.delivery_instructions
              ? this.order.delivery_instructions
              : ''
          }-${
            this.order.delivery_address_notes
              ? this.order.delivery_address_notes
              : ''
          }`;
          this.pickupNotes = ` ${
            this.order.pickup_instructions ? this.order.pickup_instructions : ''
          }-${this.order.pickup_address_notes}`;
          const [hours, minutes] = this.pickup_readyby.split(':').map(Number);
          this.pickup_readyby=new Date();
          this.pickup_readyby.setHours(hours, minutes,0,0)
          this.delivery_readyby = this.order.delivery_time;
          const [hours1, minutes1] = this.delivery_readyby.split(':').map(Number);
          this.delivery_readyby = new Date();
          this.delivery_readyby.setHours(hours1, minutes1, 0, 0);
          console.log(this.delivery_readyby);

          // console.log(this.user);
          this.getAllAddresses();
        });
    });
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
  onMarkerPositionChanged(event: any) {
    // // console.log('Marker position changed:', event);
    // this.getAddressData()
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
        // console.log(this.filteredPickup$);
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

  getFilteredPickup(value: string): Observable<string[]> {
    return of(value).pipe(
      map((filterString) => this.filterPickup(filterString))
    );
  }

  getFilteredDelivery(value: string): Observable<string[]> {
    return of(value).pipe(
      map((filterString) => this.filterDelivery(filterString))
    );
  }
  onDeliveryChange() {
    this.isSelectedDelivery = false;
    this.filteredDelivery$ = this.getFilteredDelivery(
      this.delivery_input.nativeElement.value
    );
  }

  onPickupChange() {
    this.isSelectedPickedup = false;
    this.filteredPickup$ = this.getFilteredPickup(
      this.pickup_input.nativeElement.value
    );
  }

  onPickupSelectionChange($event: any) {
    this.isSelectedPickedup = true;
    this.filteredPickup$ = this.getFilteredPickup($event);
    const selectedIndex = this.transformedArray.indexOf($event);
    this.selectedPickup = this.addressList[selectedIndex];
    // console.log(this.selectedPickup);
    this.phone = this.selectedPickup.phone;
    this.pickupNotes = this.selectedPickup.address_notes;
    this.pickup_address_name = this.selectedPickup.address_name;
    this.pickupAddress = this.selectedPickup.address;
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
    this.delivery_address_name = this.selectedDelivery.address_name;
    this.deliveryAddress = this.selectedDelivery.address;
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
  printBill() {
    this.printingBill = true;
    let ele = document.createElement('div');
    ele.innerHTML = this.getBillHtml();
    const opt = {
      margin: [0, 0, 0, 0],
      filename: 'bill.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .from(ele)
      .set(opt)
      .save()
      .then((res: any) => {
        this.printingBill = false;
      });
  }
  printPieces() {
    this.printingPieces = true;

    let piecies = [];
    for (let i = 0; i < this.order.delivery_pieces; i++) {
      this.pieces[i] = {
        from: this.order.pickup_address,
        to: ` <p style="margin: 0">${this.order.delivery_address_name}</p>
              <p style="margin: 0">${this.order.delivery_address}</p>`,
        phone: this.order.pickup_phone,
        image: 'assets/img/code.jpg',
        ref: this.order.delivery_reference_number,
        desc: this.order.order_type,
        control: this.order.order_code,
        code: `${this.formattedReference}-${this.formattedOrderCode}-00${
          i + 1
        }`,
      };

      piecies.push(this.getPieceHtml(this.pieces[i], i + 1));
      // console.log(i);
    }

    let ele = document.createElement('div');
    ele.innerHTML = piecies.join(' ');

    const options = {
      margin: [0, 0, 0, 0],
      filename: 'pieces_labels.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a6', orientation: 'portrait' },
    };

    html2pdf()
      .from(ele)
      .set(options)
      .save()
      .then((res: any) => {
        this.printingPieces = false;
      });
  }
  getBillHtml(): string {
    return `
      <div style="padding: 20px; display: flex; flex-direction: column">
        <h1 style="align-self: center">Bill of Lading</h1>

        <h2 style="font-size: 18px; margin: 0">NILE COURIER</h2>

        <div style="display: flex; flex-direction: column; align-self: end;width:fit-content">
          <img
            style="max-width: 100px"
            src="../../../../assets/img/code.jpg"
            alt=""
          />
          <p style="margin: 0"> <span style="font-weight: normal">${
            this.formattedReference
          }-${this.formattedOrderCode}</span></p>
        </div>

        <p style="font-weight: bold">Control Number:  <span style="font-weight: normal">${
          this.formattedOrderCode
        }</span></p>
        <table>
          <tr>
            <td>
              <h2 style="font-weight: bold">Submitter Information</h2>
            </td>
            <td>
              <h2 style="font-weight: bold">Shipping Information</h2>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-weight: bold">
                Account:  <span style="font-weight: normal">${
                  this.order?.user.id
                }</span>
              </p>
              <p style="font-weight: bold">
                Name: <span style="font-weight: normal">${
                  this.order?.user.name
                }</span>
              </p>
              <p style="font-weight: bold">
                Requested By: <span style="font-weight: normal">${
                  this.order?.ordered_by
                }</span>
              </p>
              <p style="font-weight: bold">
                Phone: <span style="font-weight: normal">${
                  this.order?.pickup_phone
                }</span>
              </p>
              <p style="font-weight: bold">
                Notes: <span style="font-weight: normal">${
                  this.order?.pickup_instructions
                }</span>
              </p>
            </td>
            <td>
              <p style="font-weight: bold">
                Service Type:
                <span style="font-weight: normal">${
                  this.order?.service_type
                }</span>
              </p>
              <p style="font-weight: bold">
                Pieces:
                <span style="font-weight: normal">${
                  this.order?.delivery_pieces
                }</span>
              </p>
              <p style="font-weight: bold">
                Weight:
                <span style="font-weight: normal"
                  >${this.order?.delivery_weight}
                </span>
              </p>
              <p style="font-weight: bold">
                Charges: <span style="font-weight: normal">${
                  this.order?.delivery_total_price || '0'
                }</span>
              </p>
              <p style="font-weight: bold">
                Reference: <span style="font-weight: normal">${
                  this.order?.delivery_reference_number
                }</span>
              </p>
              <p style="font-weight: bold">
                Entered: <span style="font-weight: normal"></span>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="font-weight: bold">Pick Up From</h2>
            </td>
            <td>
              <h2 style="font-weight: bold">Deliver To</h2>
            </td>
          </tr>
          <tr>
            <td>
              <p>${this.pickup_address_name}</p>
              <p>${this.pickupAddress}</p>
              <p>
                <span style="font-weight: bold">Phone: </span>
                ${this.order?.pickup_phone}
              </p>
            </td>
            <td>
              <p>${this.delivery_address_name}</p>
              <p>${this.deliveryAddress}</p>
              <p>
                <span style="font-weight: bold">Phone: </span>
                ${this.order?.delivery_phone}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="font-weight: bold">Pick Up Details</h2>
            </td>
            <td>
              <h2 style="font-weight: bold">Delivery Details</h2>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-weight: bold">
                Requested Date: <span style="font-weight: normal"></span>
              </p>
              <p style="font-weight: bold">
                Ready Time:
                <span style="font-weight: normal"></span>
              </p>
              <p>time: (${this.order?.pickup_instructions})</p>
              <br time     <p style="font-weight: bold">
                Actual Date: <span style="font-weight: normal"></span>
              </p>
              <p style="font-weight: bold">
                Arrival Time:
                <span style="font-weight: normal"> </span>
              </p>
              <p style="font-weight: bold">
                Departure Time:
                <span style="font-weight: normal"></span>
              </p>
            </td>
            <td>
              <p style="font-weight: bold">
                Requested Date: <span style="font-weight: normal"></span>
              </p>
              <p style="font-weight: bold">
                Deliver By: <span style="font-weight: normal"></span>
              </p>
              <p>Instructions: (${this.order?.delivery_instructions})</p>
              <br />
              <p style="font-weight: bold">
                Actual Date: <span style="font-weight: normal"> </span>
              </p>
              <p style="font-weight: bold">
                Arrival Time:
                <span style="font-weight: normal"> </span>
              </p>
              <p style="font-weight: bold">
                Departure Time:
                <span style="font-weight: normal"></span>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-weight: bold">
                Driver:
                <span style="font-weight: normal">${
                  this.order?.driver_name
                }</span>
              </p>
              <hr style="margin: 12px 0" />
              <p style="font-weight: bold">Date:</p>
              <hr style="margin: 12px 0" />
              <p style="font-weight: bold">Time:</p>
            </td>
            <td>
              <p style="font-weight: bold">Received By:</p>
              <hr style="margin: 12px 0" />
              <p style="font-weight: bold">Print Name:</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  }
  getPieceHtml(data: Piece, current: number): string {
    return `
      <div
        style="height: 148mm; width: 105mm; padding: 32px"
      >
        <p style="margin: 0">
          <span style="font-weight: bold">From:</span>
          <br />
          ${data.from}
        </p>

        <div style="margin: 16px 0; padding: 16px; border: 1px solid">
          <p style="font-weight: bold; margin: 0">Ship To:</p>
          ${data.to}
          <br />
          <p style="margin: 0">
            <span style="font-weight: bold">Tel:</span> ${data.phone}
          </p>
          <br />
          <p style="margin: 0"><span style="font-weight: bold">Ref:</span> ${data.ref}</p>
        </div>

        <div style="font-weight: bold">Piece: ${current} of ${this.pieces.length}</div>
        <p>
          <span style="font-weight: bold">Description:</span> ${data.desc}
        </p>

        <div style="margin: 16px 0; padding: 16px; border: 1px solid">
          <img src="${data.image}" width="50%" alt="" />
          <p style="margin: 0">${data.code}</p>
        </div>
        <p><span style="font-weight: bold; margin: 0">Control #: ${data.control}</span></p>
      </div>
    `;
  }
}

type Piece = {
  from: string;
  to: string;
  phone: string;
  ref: number;
  image: string;
  desc: string;
  control: number;
  code: string;
};
