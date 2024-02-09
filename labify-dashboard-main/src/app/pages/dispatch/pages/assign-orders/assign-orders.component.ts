import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';
import { Observable, Subscription, map, of } from 'rxjs';
import { Driver } from 'src/app/core/models/driver.model';
import { DispatchAPIsService } from 'src/app/pages/dispatch/services/dispatch-apis.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { NbDialogService } from '@nebular/theme';
import { OrderService } from 'src/app/core/services/order.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { DriverLocation } from 'src/app/core/models/driver-location.model';
import { DispatchUtilitiesService } from '../../services/dispatch-utilities.service';
import { DispatchOrder } from '../../models/dispatch-order.model';
import { COMPANY_ID, USER_ROLE } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-assign-orders',
  templateUrl: './assign-orders.component.html',
  styleUrls: ['./assign-orders.component.scss'],
})
export class AssignOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('driverInput') driver_input: any;
  loggedAsCompany = false;

  // map properties
  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;

  // assign driver properties
  assignDriverLoading = false;
  assigningDriver = false;
  allDrivers!: Driver[];
  filteredDrivers$!: Observable<Driver[]>;
  selectedDriver!: Driver;

  // active drivers properties
  activeDrivers: Map<number, DriverLocation> = new Map();
  activeDriversMarkers: Map<number, google.maps.Marker> = new Map();
  // activeDriversSocketPoints: Map<number, google.maps.Marker[]> = new Map();
  activeDriversSocketPoints: Map<number, google.maps.Polyline> = new Map();
  activeDriversOrdersPaths: Map<
    number,
    Map<
      number,
      {
        pMarker: google.maps.Marker;
        dMarker: google.maps.Marker;
        polyline: google.maps.Polyline;
      }
    >
  > = new Map();
  isShownDriverOrdersAndPoints: Map<number, boolean> = new Map();
  driversListendToHisPoints: Set<number> = new Set();

  // orders properties
  ordersLoading = false;
  allOrders!: DispatchOrder[];
  selectedOrders: Map<number, DispatchOrder> = new Map();
  coloredOrdersHashSet: Set<number> = new Set();
  ordersMarkersAndPaths: Map<
    number,
    {
      pickupMarker: google.maps.Marker;
      deliveryMarker: google.maps.Marker;
      directionRenderer: google.maps.DirectionsRenderer;
    }
  > = new Map();

  // selecting markers properties
  selectedPointsHashSet: Set<string> = new Set();
  selectedPointsMarkers: google.maps.Marker[] = [];
  selectedPointsPolylines: google.maps.Polyline[] = [];
  selectedPointsInfoWindows: google.maps.InfoWindow[] = [];
  lastSelectedPoint!: LatLng | null;
  totalDurationInSeconds = 0;

  constructor(
    private dispatchApisService: DispatchAPIsService,
    private driversService: DriversService,
    private socketService: SocketService,
    private dialogService: NbDialogService,
    private orderService: OrderService,
    private toasterService: ToasterService,
    private dispatchUtilities: DispatchUtilitiesService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (
      this.storageService.getLocalStorageValue(USER_ROLE) === 'company' ||
      this.storageService.getLocalStorageValue(COMPANY_ID) !== null
    ) {
      this.loggedAsCompany = true;
    }

    this.getUnassignedOrders();
    this.getAllDriveres();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }

  private initializeMap(): void {
    this.directionsService = new google.maps.DirectionsService();

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 40.73061, lng: -73.935242 }, // New Yourk id the default center
      zoom: 7,
    });

    this.getActiveDrivers();
    this.listenToOrdersStatusChanges();
  }

  /**
   * orders functions
   */
  private getUnassignedOrders() {
    this.ordersLoading = true;
    this.subscriptions.push(
      this.dispatchApisService.getDispatchOrders().subscribe((res) => {
        this.allOrders = res;
        for (let order of this.allOrders) {
          this.coloredOrdersHashSet.add(order.order_id);
          order.color = this.getRandomHexColor();
        }

        this.initializeMap();
        this.listenToOrdersChanges();
        this.ordersLoading = false;
      })
    );
  }

  /**
   * this socket event fires if theres a new order created or
   * there is an order assigned to driver
   */
  private listenToOrdersChanges() {
    this.subscriptions.push(
      this.socketService.listenToEvent('orders-updated').subscribe((orders) => {
        let newOrders = [];
        for (let order of orders)
          if (!this.coloredOrdersHashSet.has(order.order_id)) {
            order.color = this.getRandomHexColor();
            newOrders.push(order);
            this.coloredOrdersHashSet.add(order.order_id);
          }

        this.allOrders.push(...newOrders);
      })
    );
  }

  listenToOrdersStatusChanges() {
    this.subscriptions.push(
      this.socketService.listenToEvent('sendOrderData').subscribe((order) => {
        if (order.order_status_last === 'pickedup') {
          if (this.ordersMarkersAndPaths.has(order.order_id)) {
            let orderPath = this.ordersMarkersAndPaths.get(order.order_id);
            orderPath?.pickupMarker.setMap(null);
            orderPath?.directionRenderer.setMap(null);
            this.ordersMarkersAndPaths.set(order.order_id, {
              pickupMarker: new google.maps.Marker(),
              directionRenderer: new google.maps.DirectionsRenderer(),
              deliveryMarker: orderPath?.deliveryMarker!!,
            });
          } else if (this.activeDriversOrdersPaths.has(order.driver_id)) {
            let orderPath = this.activeDriversOrdersPaths
              .get(order.driver_id)
              ?.get(order.order_id);
            orderPath?.pMarker.setMap(null);
            orderPath?.polyline.setMap(null);
            this.ordersMarkersAndPaths.set(order.order_id, {
              pickupMarker: new google.maps.Marker(),
              directionRenderer: new google.maps.DirectionsRenderer(),
              deliveryMarker: orderPath?.dMarker!!,
            });
          }
        } else if (order.order_status_last === 'deliveried') {
          if (this.ordersMarkersAndPaths.has(order.order_id)) {
            let orderPath = this.ordersMarkersAndPaths.get(order.order_id);
            orderPath?.pickupMarker.setMap(null);
            orderPath?.deliveryMarker.setMap(null);
            orderPath?.directionRenderer.setMap(null);
            this.ordersMarkersAndPaths.delete(order.order_id);
            this.allOrders = this.allOrders.filter(
              (ord) => ord.order_id != order.order_id
            );
            this.selectedOrders.delete(order.order_id);
          } else if (this.activeDriversOrdersPaths.has(order.driver_id)) {
            let orderPath = this.activeDriversOrdersPaths
              .get(order.driver_id)
              ?.get(order.order_id);
            orderPath?.pMarker.setMap(null);
            orderPath?.dMarker.setMap(null);
            orderPath?.polyline.setMap(null);
            this.activeDriversOrdersPaths
              .get(order.driver_id)
              ?.delete(order.order_id);
          }
        }
      })
    );
  }

  onSelectOrder(order: DispatchOrder) {
    if (!this.selectedOrders.has(order.order_id)) {
      this.selectedOrders.set(order.order_id, order);
      try {
        this.showOrderMarkersAndDirectionRenderer(order);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.selectedOrders.delete(order.order_id);
      this.hideOrderMarkersAndDirectionRenderer(order.order_id);
    }
  }

  private showOrderMarkersAndDirectionRenderer(order: DispatchOrder) {
    if (this.ordersMarkersAndPaths.has(order.order_id)) {
      let orderMarkersAndPath = this.ordersMarkersAndPaths.get(order.order_id);
      orderMarkersAndPath?.pickupMarker.setMap(this.map);
      orderMarkersAndPath?.deliveryMarker.setMap(this.map);
      orderMarkersAndPath?.directionRenderer.setMap(this.map);
    } else {
      this.createOrderMarkersAndDirectionRenderer(order);
    }
  }

  private async createOrderMarkersAndDirectionRenderer(order: DispatchOrder) {
    const pickupLocation = await this.dispatchUtilities.getLatLngFromAddress(
      order.pickup_address
    );
    if (order.pickup) {
      order.pickup.lat = pickupLocation.lat();
      order.pickup.lng = pickupLocation.lng();
    } else {
      order = {
        ...order,
        pickup: {
          lat: pickupLocation.lat(),
          lng: pickupLocation.lng(),
        },
      };
    }

    const deliveryLocation = await this.dispatchUtilities.getLatLngFromAddress(
      order.delivery_address
    );
    if (order.delivery) {
      order.delivery.lat = deliveryLocation.lat();
      order.delivery.lng = deliveryLocation.lng();
    } else {
      order = {
        ...order,
        delivery: {
          lat: deliveryLocation.lat(),
          lng: deliveryLocation.lng(),
        },
      };
    }

    let pickupMarker = this.dispatchUtilities.addMarker(
      this.map,
      pickupLocation,
      'assets/img/pickup.svg',
      'Pickup location'
    );
    this.showOrderMarkerInfoWindowOnClick(order, pickupMarker, true);

    let deliveryMarker = this.dispatchUtilities.addMarker(
      this.map,
      deliveryLocation,
      'assets/img/delivery.svg',
      'Delivery location'
    );
    this.showOrderMarkerInfoWindowOnClick(order, deliveryMarker, false);

    let directionRenderer = await this.getDirectionRenderer(
      pickupLocation,
      deliveryLocation,
      order.color
    );

    this.ordersMarkersAndPaths.set(order.order_id, {
      pickupMarker,
      deliveryMarker,
      directionRenderer,
    });

    this.setCenter([pickupLocation, deliveryLocation]);
  }

  private hideOrderMarkersAndDirectionRenderer(orderId: number) {
    let orderMarkersAndPath = this.ordersMarkersAndPaths.get(orderId);
    orderMarkersAndPath?.pickupMarker.setMap(null);
    orderMarkersAndPath?.deliveryMarker.setMap(null);
    orderMarkersAndPath?.directionRenderer.setMap(null);
  }

  private showOrderMarkerInfoWindowOnClick(
    order: DispatchOrder,
    marker: google.maps.Marker,
    isPickupMarker: boolean
  ) {
    let windowIsOpenned = false;
    const infoWindow = new google.maps.InfoWindow({
      content: this.dispatchUtilities.getContentOfOrderMarkerInfoWindow(
        order.order_id,
        order.order_code,
        order.pickup_address,
        order.delivery_address,
        isPickupMarker
      ),
    });

    marker.addListener('click', () => {
      if (windowIsOpenned) {
        windowIsOpenned = false;
        infoWindow.close();
      } else {
        windowIsOpenned = true;
        infoWindow.open(this.map, marker);

        setTimeout(() => {
          const selectBtn = document.getElementById(
            `select-order-btn-${order.order_id}-${
              isPickupMarker ? 'pickup' : 'delivery'
            }`
          );

          selectBtn?.addEventListener('click', () => {
            this.onSelectMarker(marker);
            infoWindow.close();
          });
        }, 0);
      }
    });
  }

  /**
   * functions to select and deselect markers and show estimated time between them
   */

  private onSelectMarker(marker: google.maps.Marker) {
    let markerPoint = marker.getPosition();

    if (
      markerPoint &&
      !this.selectedPointsHashSet.has(JSON.stringify(markerPoint))
    ) {
      let marker = this.dispatchUtilities.addMarker(
        this.map,
        markerPoint,
        'assets/img/location-pin.svg'
      );
      this.selectedPointsMarkers.push(marker);
      this.selectedPointsHashSet.add(JSON.stringify(markerPoint));

      if (this.lastSelectedPoint) {
        let polyline = this.dispatchUtilities.addPolylineBetweenPoints(
          this.map,
          [markerPoint, this.lastSelectedPoint],
          '#3366ff',
          0.7,
          6
        );
        this.selectedPointsPolylines.push(polyline);
        this.showInfoWindowWithTimeOnPolylineClick(polyline, markerPoint);
      }

      this.lastSelectedPoint = markerPoint;
    }
  }

  private async showInfoWindowWithTimeOnPolylineClick(
    polyline: google.maps.Polyline,
    markerPoint: LatLng
  ) {
    const middlePoint = google.maps.geometry.spherical.interpolate(
      markerPoint!!,
      this.lastSelectedPoint!!,
      0.5
    );

    let durationInSeconds = await this.getTimeBetweenTwoPoints(
      markerPoint,
      this.lastSelectedPoint!!
    );

    this.totalDurationInSeconds += durationInSeconds;

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="no-close-btn">
          <span>Duration: ${this.dispatchUtilities.getDurationTextFromSeconds(
            durationInSeconds
          )}</span><br>
          <span>Total Duration: ${this.dispatchUtilities.getDurationTextFromSeconds(
            this.totalDurationInSeconds
          )}</span>
        </div>
        `,
    });

    infoWindow.setPosition(middlePoint);
    infoWindow.open(this.map);
    this.hideCloseBtnOfWindows();
    this.selectedPointsInfoWindows.push(infoWindow);

    let windowIsOpenned = true;
    polyline.addListener('click', () => {
      if (windowIsOpenned) {
        windowIsOpenned = false;
        infoWindow.close();
      } else {
        windowIsOpenned = true;
        infoWindow.open(this.map);
        this.hideCloseBtnOfWindows();
      }
    });
  }

  deselectAllMarkers() {
    for (let marker of this.selectedPointsMarkers) marker.setMap(null);
    for (let polyline of this.selectedPointsPolylines) polyline.setMap(null);
    for (let infowindow of this.selectedPointsInfoWindows) infowindow.close();

    this.selectedPointsMarkers = [];
    this.selectedPointsPolylines = [];
    this.selectedPointsInfoWindows = [];
    this.selectedPointsHashSet = new Set();
    this.lastSelectedPoint = null;
    this.totalDurationInSeconds = 0;
  }

  /**
   * selecting driver functions
   */

  private getAllDriveres(): void {
    this.subscriptions.push(
      this.driversService.getAllDrivers().subscribe((res) => {
        this.allDrivers = res;
        this.filteredDrivers$ = of(this.allDrivers);
      })
    );
  }

  openAssignDriverDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  onDriverChange() {
    this.filteredDrivers$ = this.getFilteredDrivers(
      this.driver_input.nativeElement.value
    );
  }

  private getFilteredDrivers(value: String): Observable<Driver[]> {
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

  onDriverSelectionChange($event: Driver) {
    this.filteredDrivers$ = this.getFilteredDrivers($event.name);
    this.selectedDriver = $event;
    this.driver_input.nativeElement.value = this.selectedDriver.name;
  }

  onDriverSelected() {
    this.assignDriverLoading = true;
    let assignedOrders = 0;

    for (let order of this.selectedOrders) {
      const payload = {
        order_id: order[1].order_id,
        driver_id: this.selectedDriver.id,
      };
      this.subscriptions.push(
        this.orderService.assignDriver(payload).subscribe({
          next: (res) => {
            assignedOrders++;
            // show success toaster after assigning the last order
            if (assignedOrders === this.selectedOrders.size) {
              this.toasterService.showSuccess('Driver assigned');
              this.assignDriverLoading = false;
              this.allOrders = this.allOrders.filter(
                (order) => !this.selectedOrders.has(order.order_id)
              );

              for (let order of this.selectedOrders) {
                let orderMarkerAndPath = this.ordersMarkersAndPaths.get(
                  order[1].order_id
                );
                this.ordersMarkersAndPaths.delete(order[1].order_id);
                orderMarkerAndPath?.pickupMarker.setMap(null);
                orderMarkerAndPath?.deliveryMarker.setMap(null);
                orderMarkerAndPath?.directionRenderer.setMap(null);
              }

              this.selectedOrders.clear();
              this.getDriverOrders(this.selectedDriver.id);
            }
          },
          error: (err) => {
            if (assignedOrders === this.selectedOrders.size) {
              this.toasterService.showDanger("Driver Didn't assigned");
              this.assignDriverLoading = false;
            }
          },
        })
      );
    }
  }

  /**
   * active drivers functions
   */

  getActiveDrivers() {
    this.subscriptions.push(
      this.driversService.getDriversByStatus('active').subscribe((res) => {
        for (let driver of res.data) this.getInitialDriverLocations(driver.id);

        this.listenToActiveDriversChanges();
      })
    );
  }

  listenToActiveDriversChanges() {
    this.subscriptions.push(
      //
      this.socketService.listenToEvent('drivers-updated').subscribe((res) => {
        // this.socketService.listenToEvent('drivers-updated-new').subscribe((res) => {
        for (let driver of res.active_data) {
          let driverLocation: DriverLocation = {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            email: driver.email,
            orders_count: driver.orders_count,
            points: [{ ...driver.current_location }],
          };

          this.setDriverMarker(driverLocation);
        }
      })
    );
  }

  getInitialDriverLocations(driverId: number) {
    this.subscriptions.push(
      this.driversService
        .getActiveDriverLocations(driverId)
        .subscribe((res) => {
          if (res) {
            // let driverPoints: google.maps.Marker[] = [];

            // for (let point of res.points) {
            //   let marker = this.dispatchUtilities.addMarker(
            //     this.map,
            //     new google.maps.LatLng({
            //       lat: point.lat,
            //       lng: point.lng,
            //     }),
            //     'assets/img/dot.svg'
            //   );

            //   marker.setMap(null);
            //   driverPoints?.push(marker);
            // }

            this.activeDriversSocketPoints.set(
              driverId,
              new google.maps.Polyline({
                path: res.points,
                geodesic: true,
                icons: this.dispatchUtilities.calculateArrowIcons(10),
                strokeColor: '#3366ff',
                strokeOpacity: 1.0,
                strokeWeight: 3,
              })
            );
            this.isShownDriverOrdersAndPoints.set(driverId, false);
            this.setDriverMarker(res);
          }
        })
    );
  }

  // addPath(points: { lat: number; lng: number }[]) {
  //   if (!this.arrowPath)
  //     this.arrowPath = new google.maps.Polyline({
  //       path: points,
  //       map: this.map,
  //       geodesic: true,
  //       icons: this.calculateArrowIcons(10),
  //       strokeColor: '#3366ff',
  //       strokeOpacity: 1.0,
  //       strokeWeight: 3,
  //     });
  //   else this.arrowPath.setPath(points);
  // }

  setDriverMarker(driver: DriverLocation) {
    this.activeDrivers.set(driver.id, driver);

    if (this.activeDriversMarkers.has(driver.id)) {
      let prevPosition = this.activeDriversMarkers
        .get(driver.id)
        ?.getPosition();

      let currPosition = new google.maps.LatLng({
        lat: driver.points[driver.points.length - 1].lat,
        lng: driver.points[driver.points.length - 1].lng,
      });

      if (
        prevPosition &&
        prevPosition.lat() !== currPosition.lat() &&
        prevPosition.lng() !== currPosition.lng()
      ) {
        this.activeDriversMarkers.get(driver.id)?.setMap(null);
        this.activeDriversMarkers.set(driver.id, this.getDriverMarker(driver));
      }
    } else
      this.activeDriversMarkers.set(driver.id, this.getDriverMarker(driver));
  }

  getDriverMarker(data: DriverLocation) {
    const marker = new google.maps.Marker({
      position: data.points[data.points.length - 1],
      map: this.map,
      title: data.name,
      label: `${data.id}`,
    });

    let showLocations = true;

    marker.addListener('click', () => {
      showLocations = !showLocations;
      if (!showLocations) {
        this.isShownDriverOrdersAndPoints.set(data.id, true);
        this.showDriverOrdersAndPoints(data.id);
      } else {
        this.isShownDriverOrdersAndPoints.set(data.id, false);
        this.hideDriverOrders(data.id);
        this.hideDriverPoints(data.id);
      }
    });

    return marker;
  }

  showDriverOrdersAndPoints(driverId: number) {
    if (this.activeDriversSocketPoints.has(driverId)) {
      // for (let marker of this.activeDriversSocketPoints.get(driverId)!!) {
      //   marker.setMap(this.map);
      // }

      this.activeDriversSocketPoints.get(driverId)?.setMap(this.map);
    }

    if (!this.driversListendToHisPoints.has(driverId)) {
      this.listenToDriverPoints(driverId);
      this.driversListendToHisPoints.add(driverId);
    }

    if (this.activeDriversOrdersPaths.has(driverId)) {
      for (let path of this.activeDriversOrdersPaths.get(driverId)!!) {
        path[1].dMarker.setMap(this.map);
        path[1].pMarker.setMap(this.map);
        path[1].polyline.setMap(this.map);
      }
    } else {
      this.getDriverOrders(driverId);
    }
  }

  hideDriverPoints(driverId: number) {
    if (this.activeDriversSocketPoints.has(driverId)) {
      // for (let marker of this.activeDriversSocketPoints.get(driverId)!!) {
      //   marker.setMap(null);
      // }

      this.activeDriversSocketPoints.get(driverId)?.setMap(null);
    }
  }

  hideDriverOrders(driverId: number) {
    if (this.activeDriversOrdersPaths.has(driverId)) {
      for (let path of this.activeDriversOrdersPaths.get(driverId)!!) {
        path[1].dMarker.setMap(null);
        path[1].pMarker.setMap(null);
        path[1].polyline.setMap(null);
      }
    }
  }

  getDriverOrders(driverId: number) {
    this.hideDriverOrders(driverId);
    this.activeDriversOrdersPaths.delete(driverId);

    this.subscriptions.push(
      this.dispatchApisService
        .getDispatchDriverDetails(driverId)
        .subscribe(async (res) => {
          let driverData = res;
          let paths: Map<
            number,
            {
              pMarker: google.maps.Marker;
              dMarker: google.maps.Marker;
              polyline: google.maps.Polyline;
            }
          > = new Map();

          for (let order of driverData.orders) {
            const pickupLocation =
              await this.dispatchUtilities.getLatLngFromAddress(
                order.pickup_address
              );
            if (order.pickup) {
              order.pickup.lat = pickupLocation.lat();
              order.pickup.lng = pickupLocation.lng();
            }

            const deliveryLocation =
              await this.dispatchUtilities.getLatLngFromAddress(
                order.delivery_address
              );
            if (order.delivery) {
              order.delivery.lat = deliveryLocation.lat();
              order.delivery.lng = deliveryLocation.lng();
            }

            if (
              order.pickup.status === 'pickedup' &&
              order.delivery.status !== 'delivered'
            ) {
              let deliveryMarker = this.dispatchUtilities.addMarker(
                this.map,
                deliveryLocation,
                'assets/img/delivery.svg',
                'Delivery location'
              );
              this.showOrderMarkerInfoWindowOnClick(
                order,
                deliveryMarker,
                false
              );

              if (!this.isShownDriverOrdersAndPoints.get(driverId))
                deliveryMarker.setMap(null);

              paths.set(order.order_id, {
                pMarker: deliveryMarker,
                dMarker: new google.maps.Marker(),
                polyline: new google.maps.Polyline(),
              });
            } else if (order.delivery.status !== 'delivered') {
              // add delivery and pickup markers and polyline between them
              let pickupMarker = this.dispatchUtilities.addMarker(
                this.map,
                pickupLocation,
                'assets/img/pickup.svg',
                'Pickup location'
              );
              this.showOrderMarkerInfoWindowOnClick(order, pickupMarker, true);

              let deliveryMarker = this.dispatchUtilities.addMarker(
                this.map,
                deliveryLocation,
                'assets/img/delivery.svg',
                'Delivery location'
              );
              this.showOrderMarkerInfoWindowOnClick(
                order,
                deliveryMarker,
                false
              );

              let polyline = this.dispatchUtilities.addPolylineBetweenPoints(
                this.map,
                [pickupLocation, deliveryLocation]
              );

              // initially hidden
              if (!this.isShownDriverOrdersAndPoints.get(driverId)) {
                pickupMarker.setMap(null);
                deliveryMarker.setMap(null);
                polyline.setMap(null);
              }

              paths.set(order.order_id, {
                pMarker: pickupMarker,
                dMarker: deliveryMarker,
                polyline,
              });
            }
          }

          this.activeDriversOrdersPaths.set(driverId, paths);
        })
    );
  }

  listenToDriverPoints(driverId: number) {
    this.subscriptions.push(
      this.socketService
        .listenToEvent(`admin-driver-location-updated-${driverId}`)
        .subscribe((res) => {
          // console.warn(`Driver ${driverId} Point Sent: `, res.latest_point);

          if (this.activeDriversSocketPoints.has(driverId)) {
            this.activeDriversSocketPoints.get(driverId)?.setMap(null);
          }

          let driverPolyline = new google.maps.Polyline({
            path: res.points,
            map: this.map,
            geodesic: true,
            icons: this.dispatchUtilities.calculateArrowIcons(10),
            strokeColor: '#3366ff',
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });

          if (!this.isShownDriverOrdersAndPoints.get(driverId))
            driverPolyline.setMap(null);

          this.activeDriversSocketPoints.set(driverId, driverPolyline);
        })
    );
  }

  /**
   * helper functions
   */

  /**
   * @description async function that takes two points on the map and add a get a direction renderer between them
   * @param origin {lat: number, lng: number}
   * @param destination {lat: number, lng: number}
   * @param color color of the path
   * @returns Promise of direction renderer
   */
  private async getDirectionRenderer(
    origin: LatLng,
    destination: LatLng,
    color = '#3366ff'
  ): Promise<google.maps.DirectionsRenderer> {
    return new Promise((resolve, reject) => {
      let directionRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        suppressPolylines: false,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: color,
        },
      });

      this.directionsService?.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionRenderer.setDirections(response);
            resolve(directionRenderer);
          } else {
            reject(
              new Error(
                `Erorr while generate this direction rendered between ${origin} and ${destination}`
              )
            );
          }
        }
      );
    });
  }

  /**
   * @description async function that calculate estimated time between two points on the map with google maps directions service
   * @param origin {lat: number, lng: number}
   * @param destination {lat: number, lng: number}
   * @returns Promise of number (time in seconds)
   */
  private async getTimeBetweenTwoPoints(
    origin: LatLng,
    destination: LatLng
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: any, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const leg = response.routes[0].legs[0];
            resolve(leg.duration.value);
          } else {
            reject(
              new Error(`Directions request failed with status: ${status}`)
            );
          }
        }
      );
    });
  }

  /**
   * @description functions that calculates the center of array of points and make it the center of the map
   * @param points array of {lat: number, lng: number}
   */
  private setCenter(points: LatLng[]): void {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) this.map?.setCenter(points[0]);

    let totalLat = 0;
    let totalLng = 0;
    for (let point of points) {
      totalLat += point.lat();
      totalLng += point.lng();
    }

    const centerLat = totalLat / points.length;
    const centerLng = totalLng / points.length;
    this.map?.setCenter({ lat: centerLat, lng: centerLng });
  }

  /**
   * @returns hex color string
   */
  private getRandomHexColor(): string {
    const letters = '0123456789';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 9)];
    }
    return color;
  }

  /**
   * function that hides the close btn of all infow windows with the child element that has a class='no-close-btn'
   */
  private hideCloseBtnOfWindows(): void {
    setTimeout(() => {
      const infoWindows = document.querySelectorAll(
        '.gm-style-iw.gm-style-iw-c'
      );
      infoWindows.forEach((infoWindow) => {
        const child = infoWindow.querySelector('.no-close-btn');

        if (child) {
          const closeBtn: any = infoWindow.querySelector(
            'button.gm-ui-hover-effect'
          );
          if (closeBtn) closeBtn.style.display = 'none';
        }
      });
    }, 0);
  }
}
