import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { DoctorAddressService } from 'src/app/core/services/doctor-address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { OrderService } from 'src/app/core/services/order.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';

// import * as html2pdf from 'html2pdf.js';
import { TwoPinAddressMapComponent } from '../../../shared/components/two-pin-address-map/two-pin-address-map.component';
import { StorageService } from 'src/app/core/services/storage.service';
//@ts-ignore
import * as html2pdf from 'html2pdf.js';
import { Driver } from 'src/app/core/models/driver.model';
import { FormManage } from '../../../core/classes/form-manage';
import { FormGroup, FormControl } from '@angular/forms';
import { AssignDriversService } from 'src/app/core/services/assign-drivers.service';
import { Company } from '../../../core/models/company.model';
type MarkerPosition = {
  lat: any;
  lng: any;
};
@Component({
  selector: 'ngx-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class UpdateOrderComponent extends FormManage implements OnInit {
  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private orderService: OrderService,
    // private driversService: DriversService,
    private assignDriversService: AssignDriversService,
    private activatedRoute: ActivatedRoute,
    private StorageService: StorageService,
    private companyService: CompanyService,
    public location: Location,
    public datePipe: DatePipe,
    private storageService: StorageService
  ) {
    super();
  }
  // companyService: any;
  selectedCompanyId: any;
  selectedOrderType: any;
  selectedService: any;
  companyName: any;
  filteredPickup$!: Observable<any[]>;
  filteredDelivery$!: Observable<any[]>;
  inputText!: string;
  searchTerm = '';
  filteredItems = [];
  transformedArray: any;
  selectedPickup: any;
  isSelectedPickedup: boolean = false;
  isSelectedDelivery: boolean = false;
  selectedDelivery: any;
  pickupNotes: any;
  deliveryNotes: any;
  phone = '';
  delivery_phone = '';
  @ViewChild('autoInput') driver_input: any;
  @ViewChild('autoDeliveryInput') delivery_input: any;
  @ViewChild('autoPickupInput') pickup_input: any;

  @ViewChild('twoPinAddressMapComponent')
  twoPinAddressMapComponent!: TwoPinAddressMapComponent;
  printingBill = false;
  printingPieces = false;
  orderForm!: FormGroup;

  pieces: Piece[] = [];

  options!: Driver[];
  filteredDrivers$!: Observable<Driver[]>;
  selectedDriver!: Driver;

  addressList: any;
  deliveryArray: any;

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
  status = ['cancelled', 'pending', 'pickedup', 'delivered'];
  order_status: any;
  selectedStatus: any;
  formattedReference: any;
  formattedOrderCode: any;
  user: any;
  order_code: any;
  pickup_date: any;
  delivery_date: any;
  pickup_readyby: any;
  delivery_readyby: any;
  role: any;
  search_term: any;
  from: any;
  to: any;
  company: any;
  ngOnInit(): void {
    this.getAllDriveres();
    this.getOrderData();
    // this.secondPinPosition;
    this.initOrderForm();
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.search_term = params['search'];
      this.from = params['from'];
      this.to = params['to'];
      this.company = params['company'];
      console.log(this.search_term);
    });
    // this.listenToCompanyChanges();
  }

  initOrderForm() {
    this.orderForm = new FormGroup({
      orderId: new FormControl(this.orderId),
      pickup: new FormControl(''),
      pickup_contact: new FormControl(''),
      pickup_phone: new FormControl(''),
      pickup_ext: new FormControl(''),
      delivery_ext: new FormControl(''),
      pickup_instructions: new FormControl(''),
      pickup_date: new FormControl(''),
      delivery_date: new FormControl(''),
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
      // delivery_bol_number: new FormControl('123456'),
      order_type: new FormControl(''),
    });
    this.setForm(this.orderForm);
  }
  onDateInput(event: any) {
    this.pickup_date = event;
    this.pickup_date =
      this.datePipe.transform(new Date(this.pickup_date), 'yyyy-MM-dd') || '';
    this.setContollerValue('pickup_date', this.pickup_date);
    // console.log(this.pickup_date);
  }
  onDateDeliveryInput(event: any) {
    this.delivery_date = event;
    this.delivery_date =
      this.datePipe.transform(new Date(this.delivery_date), 'yyyy-MM-dd') || '';
    this.setContollerValue('delivery_date', this.delivery_date);
    // console.log(this.delivery_date);
  }
  onSubmit() {
    // console.log(this.FormValue);

    // this.setContollerValue('pickup_instructions', this.pickupNotes);
    // this.setContollerValue('delivery_instructions', this.deliveryNotes);
    // console.log(this.isFormValid);
    this.loading = true;
    if (this.pickup_readyby) {
      let time = this.getTime(new Date(this.pickup_readyby));
      this.setContollerValue('pickup_ready_by', time);
    }

    if (this.delivery_readyby) {
      let time = this.getTime(new Date(this.delivery_readyby));
      this.setContollerValue('delivery_ready_by', time);
    }
    this.orderService.updateOrder(this.FormValue, this.orderId).subscribe(
      (res) => {
        // this.openDialog(this.orderCreatedDialog);
        this.loading = false;
        this.toasterService.showSuccess('order updated successfuly');
        this.location.back();
      },
      (err) => {
        this.loading = false;
        this.toasterService.showDanger(err.error.message);
      }
    );
  }
  getTime(date: Date) {
    let hh = `${date.getHours()}`;
    let mm = `${date.getMinutes()}`;
    if (hh.length === 1) hh = `0${hh}`;
    if (mm.length === 1) mm = `0${mm}`;
    return `${hh}:${mm}`;
  }
  getAllDriveres() {
    this.assignDriversService.getAllDrivers().subscribe((res) => {
      this.drivers = res;
      this.options = this.drivers;
      this.filteredDrivers$ = of(this.options);
    });
  }

  onStatusSelected() {
    const payload = {
      status: this.selectedStatus,
      driver_id: this.selectedDriver?.id,
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

  getOrderData() {
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params['id'];
      if (this.orderId)
        this.orderService.getOrderById(this.orderId).subscribe((res) => {
          // console.log(res.data.user.id);
          this.order = res.data;
          console.log(this.order);
          this.selectedCompanyId = res.data.user.id;
          this.selectedService = this.order.service_type;
          this.selectedOrderType = this.order.order_type;
          this.selectedDriver = this.order.driver;
          this.selectedStatus = this.order.order_status;
          this.pickupAddress = this.order.pickup_address;
          this.pickup_address_name = this.order.pickup_address_name;
          this.deliveryAddress = this.order.delivery_address;
          this.delivery_address_name = this.order.delivery_address_name;
          this.phone = this.order.pickup_phone;
          this.delivery_phone = this.order.delivery_phone;
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
          this.pickup_date = this.order.pickup_date;
          this.delivery_date = this.order.delivery_date;
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
            lat: this.order.pickup_address_lat,
            lng: this.order.pickup_address_long,
          };
          this.secondPinPosition = {
            lat: this.order.delivery_address_lat,
            lng: this.order.delivery_address_long,
          };
          // const [hours, minutes] = this.pickup_readyby?.split(':').map(Number);
          // this.pickup_readyby = new Date();
          // this.pickup_readyby.setHours(hours, minutes, 0, 0);
          // this.delivery_readyby = this.order.delivery_time;
          // const [hours1, minutes1] = this.delivery_readyby
          //   .split(':')
          //   .map(Number);
          // this.delivery_readyby = new Date();
          // this.delivery_readyby.setHours(hours1, minutes1, 0, 0);
          // console.log(this.pickupAddress);

          // console.log(this.user);
          // this.getAddressData();
          this.getAllAddresses();
        });
    });
  }

  onMarkerPositionChanged(event: any) {
    // // console.log('Marker position changed:', event);
    // this.getAddressData()
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
    let piecesTotal = this.order.pickup_status.pickup_pieces || 1;
    // if (this.order.pickup_staus) {
    //   piecesTotal = this.order.pickup_status.pickup_pieces || 1;
    // } else {
    //   piecesTotal = this.order.delivery_pieces || 1;
    // }
    if (piecesTotal) {
      for (let i = 0; i < piecesTotal; i++) {
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
    } else {
      this.toasterService.showDanger('Pieces equal 0');
      this.printingPieces = false;
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
        this.location.back();
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
                  this.order?.delivery_pieces || 1
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
              <p>Instructions: (${this.order?.pickup_instructions})</p>
              <br />
              <p style="font-weight: bold">
                Actual Date:  (${
                  this.order?.pickup_date
                })<span style="font-weight: normal"></span>
              </p>
              <p style="font-weight: bold">
                Arrival Time: (${this.order?.pickup_status_time})
                <span style="font-weight: normal"> </span>
              </p>

            </td>
            <td>
              <p style="font-weight: bold">
                Requested Date: (${
                  this.order?.order_date
                }) <span style="font-weight: normal"></span>
              </p>
              <p style="font-weight: bold">
                Deliver By:  (${
                  this.order?.driver_name
                })<span style="font-weight: normal"></span>
              </p>
              <p>Instructions: (${this.order?.delivery_instructions})</p>
              <br />
              <p style="font-weight: bold">
                Actual Date:  (${
                  this.order?.delivery_date
                })<span style="font-weight: normal"> </span>
              </p>
              <p style="font-weight: bold">
                Arrival Time: (${this.order?.delivery_status_time})
                <span style="font-weight: normal"> </span>
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
               <!--<hr style="margin: 12px 0" />
                <p style="font-weight: bold">Date:</p>
                <hr style="margin: 12px 0" />
                <p style="font-weight: bold">Time:</p>-->
            </td>
            <td>
                <!--<p style="font-weight: bold">Received By:</p>
                <hr style="margin: 12px 0" /> -->
                <p style="font-weight: bold">Print Name: (${
                  this.order?.user.name
                })</p>
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
            <span style="font-weight: bold">Tel:</span> ${data.phone || ''}
          </p>
          <br />
          <p style="margin: 0"><span style="font-weight: bold">Ref:</span> ${
            data.ref || ''
          }</p>
        </div>

        <div style="font-weight: bold">Piece: ${current} of ${
      this.order.pickup_pieces || 1
    }</div>
        <p>
          <span style="font-weight: bold">Description:</span> ${data.desc}
        </p>

        <div style="margin: 16px 0; padding: 16px; border: 1px solid">
          <img src="${data.image}" width="50%" alt="" />
          <p style="margin: 0">${data.code}</p>
        </div>
        <p><span style="font-weight: bold; margin: 0">Control #: ${
          data.control
        }</span></p>
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
