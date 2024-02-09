import {
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OldMapOrder } from '../../../../core/models/map-order.model';
import { DispatchAPIsService } from 'src/app/pages/dispatch/services/dispatch-apis.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { DriverName } from 'src/app/core/models/driver-name.model';
import { SocketService } from 'src/app/core/services/socket.service';
import { DriverLocation } from 'src/app/core/models/driver-location.model';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';
import { Observable, of, map, Subscription } from 'rxjs';
import { Driver } from 'src/app/core/models/driver.model';
import { OrderService } from 'src/app/core/services/order.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { Order } from 'src/app/core/models/order.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-track-orders',
  templateUrl: './track-orders.component.html',
  styleUrls: ['./track-orders.component.scss'],
})
export class TrackOrdersComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('autoInput') driver_input: any;

  map!: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  directionsService!: google.maps.DirectionsService;
  directions: {
    direction: google.maps.DirectionsRenderer;
    orderId: number;
  }[] = [];

  orders!: any[];
  ordersHashSet: Set<number> = new Set();
  selectedOrders: OldMapOrder[] = [];
  ordersMarkers: {
    pMarker: google.maps.Marker;
    dMarker: google.maps.Marker;
    orderId: number;
  }[] = [];

  loading = false;
  activeDrivers!: DriverName[];
  activeDriversLocations: Map<number, DriverLocation> = new Map();
  activeDriversPaths: Map<
    number,
    {
      markers: google.maps.Marker[];
      polylines: google.maps.Polyline[];
      socketPolyline: google.maps.DirectionsRenderer[];
    }
  > = new Map();
  activeDriversMarkers: Map<number, google.maps.Marker> = new Map();

  allDrivers!: Driver[];
  filteredDrivers$!: Observable<Driver[]>;
  selectedDriver!: Driver;
  assignDriverLoading = false;

  lastSelectedPoint: { lat: number; lng: number } | null = null;
  isSelectedPoint: Set<string> = new Set();
  selectedMarkersAndPolylines: any[] = [];

  totalDurationInSeconds = 0;

  constructor(
    private dispatchApisService: DispatchAPIsService,
    private driversService: DriversService,
    private socketService: SocketService,
    private orderService: OrderService,
    private toasterService: ToasterService,
    private dialogService: NbDialogService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllDriveres();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.directionsService = new google.maps.DirectionsService();

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 40.73061, lng: -73.935242 }, // Default center
      zoom: 7, // Default zoom level
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.getActiveDrivers();
  }

  getActiveDrivers() {
    this.subscriptions.push(
      this.driversService.getDriversByStatus('active').subscribe((res) => {
        this.activeDrivers = res.data;
        console.log(this.activeDrivers);

        for (let dirver of this.activeDrivers)
          this.getInitialDriverLocation(dirver.id);

        this.listenToDriversChanges();
      })
    );
  }

  listenToDriversChanges() {
    this.subscriptions.push(
      //
      this.socketService.listenToEvent('drivers-updated').subscribe((res) => {
        // this.socketService.listenToEvent('drivers-updated-new').subscribe((res) => {
        this.activeDrivers = res.active_data;
        for (let driver of this.activeDrivers) {
          let driverLocation: DriverLocation = {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            email: driver.email,
            orders_count: driver.orders_count,
            points: [{ ...driver.current_location }],
          };

          this.setDriverLocation(driverLocation);
          this.listenToDriverLocation(driver.id);
        }
      })
    );
  }

  getInitialDriverLocation(driverId: number) {
    this.subscriptions.push(
      this.driversService
        .getActiveDriverLocations(driverId)
        .subscribe((res) => {
          console.log(res);
          if (res) {
            this.setDriverLocation(res);
          }
        })
    );

    this.listenToDriverLocation(driverId);
  }

  setDriverLocation(driverLocation: DriverLocation) {
    this.activeDriversLocations.set(driverLocation.id, driverLocation);

    if (this.activeDriversMarkers.has(driverLocation.id)) {
      this.activeDriversMarkers.get(driverLocation.id)?.setMap(null);
    }

    this.addDriverMarker(driverLocation);
  }

  listenToDriverLocation(driverId: number) {
    this.subscriptions.push(
      this.socketService
        .listenToEvent(`admin-driver-location-updated-${driverId}`)
        .subscribe((res) => {
          this.activeDriversLocations.set(driverId, res);

          if (this.activeDriversMarkers.has(driverId)) {
            this.activeDriversMarkers.get(driverId)?.setMap(null);
            this.addDriverMarker(res);

            let paths = this.activeDriversPaths.get(driverId);

            let newPolyline = this.addActiveDriverPath([
              res.points[res.points.length - 2],
              res.points[res.points.length - 1],
            ]);

            if (newPolyline && paths) {
              newPolyline = [...paths.socketPolyline, ...newPolyline];

              // for (let polyline of paths.socketPolyline) polyline.setMap(null);

              this.activeDriversPaths.set(driverId, {
                polylines: paths?.polylines,
                markers: paths?.markers,
                socketPolyline: newPolyline,
              });
            }
          }
        })
    );
  }

  addDriverMarker(data: DriverLocation) {
    const marker = new google.maps.Marker({
      position: data.points[data.points.length - 1],
      map: this.map,
      title: data.name,
      label: `${data.id}`,
    });

    let showLocations = true;

    marker.addListener('click', () => {
      showLocations = !showLocations;
      if (!showLocations) this.showDriverLocations(data.id);
      else this.hideDriverLocations(data.id);
    });

    this.activeDriversMarkers.set(data.id, marker);
  }

  showDriverLocations(driverId: number) {
    let driverPoints = this.activeDriversLocations.get(driverId)?.points;
    let paths: {
      polylines: google.maps.Polyline[];
      markers: google.maps.Marker[];
      socketPolyline: google.maps.DirectionsRenderer[];
    } = {
      polylines: [],
      markers: [],
      socketPolyline: this.addActiveDriverPath(driverPoints!!),
    };

    this.subscriptions.push(
      this.driversService.getDriverDetails(driverId).subscribe(async (res) => {
        let driverData = res;
        for (let order of driverData.orders) {
          if (
            order.pickup.status === 'pickedup' &&
            order.delivery.status !== 'delivered'
          ) {
            let marker: google.maps.Marker = this.addMarker(
              +order.delivery.lat,
              +order.delivery.long,
              false,
              order
            );

            paths.markers.push(marker);
          } else if (order.delivery.status !== 'delivered') {
            let orderPath = await this.addDriverOrderPathWithMarkers(
              { lat: +order.pickup.lat, lng: +order.pickup.long },
              { lat: +order.delivery.lat, lng: +order.delivery.long },
              order
            );

            paths.polylines.push(orderPath.polyline);
            paths.markers.push(...orderPath.markers);
          }
        }
      })
    );

    this.activeDriversPaths.set(driverId, paths);
  }

  hideDriverLocations(driverId: number) {
    let paths:
      | {
          polylines: google.maps.Polyline[];
          markers: google.maps.Marker[];
          socketPolyline: google.maps.DirectionsRenderer[];
        }
      | undefined = this.activeDriversPaths.get(driverId);

    if (paths) {
      for (let polyline of paths.polylines) {
        polyline.setMap(null);
      }

      for (let marker of paths.markers) {
        marker.setMap(null);
      }

      for (let polyline of paths.socketPolyline) polyline.setMap(null);
    }

    if (this.activeDriversPaths.has(driverId))
      this.activeDriversPaths.delete(driverId);
  }

  async addDriverOrderPathWithMarkers(
    pickup: { lat: number; lng: number },
    delivery: { lat: number; lng: number },
    data: any
  ) {
    let markers: google.maps.Marker[] = [];
    let pickupPoint = await this.getLatLngFromAddress(data.pickup.address);
    let deliveryPoint = await this.getLatLngFromAddress(data.delivery.address);

    markers.push(
      this.addMarker(pickupPoint.lat(), pickupPoint.lng(), true, data)
    );
    markers.push(
      this.addMarker(deliveryPoint.lat(), deliveryPoint.lng(), false, data)
    );

    const polyline = new google.maps.Polyline({
      path: [pickupPoint, deliveryPoint],
      geodesic: true,
      strokeColor: '#000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    polyline.setMap(this.map);
    return {
      polyline,
      markers,
    };
  }

  addActiveDriverPath(
    points: { lat: number; lng: number }[]
  ): google.maps.DirectionsRenderer[] {
    let polylines = [];
    for (let i = 0; i < points.length - 1; i++) {
      let request = {
        origin: points[i],
        destination: points[i + 1],
        travelMode: google.maps.TravelMode.DRIVING,
      };

      let polyline = new google.maps.DirectionsRenderer({
        map: undefined,
        suppressMarkers: true,
      });

      this.directionsService?.route(request, (response, status) => {
        polyline.setOptions({
          suppressPolylines: false,
          map: this.map,
          preserveViewport: true,
          polylineOptions: {
            icons: this.calculateArrowIcons(30),
            strokeColor: '#3366ff',
            strokeOpacity: 1.0,
            strokeWeight: 3,
          },
        });

        if (status == google.maps.DirectionsStatus.OK) {
          polyline.setDirections(response);
        }
      });

      polylines.push(polyline);
    }

    return polylines;
  }

  // addActiveDriverPath(
  //   points: { lat: number; lng: number }[]
  // ): google.maps.Polyline {
  //   const polyline = new google.maps.Polyline({
  //     geodesic: true,
  //     icons: this.calculateArrowIcons(10),
  //     strokeColor: '#3366ff',
  //     strokeOpacity: 1.0,
  //     strokeWeight: 3,
  //     map: this.map,
  //   });

  //   const latLngArray = points.map(
  //     (point) => new google.maps.LatLng(point.lat, point.lng)
  //   );

  //   this.snapToRoads(latLngArray)
  //     .then((snappedPoints) => {
  //       console.log(points);
  //       console.log(snappedPoints);
  //       polyline.setPath(snappedPoints);
  //       this.setCenter([points[points.length - 1]]);
  //     })
  //     .catch((error) => {
  //       console.error('Error snapping to roads:', error);
  //     });

  //   return polyline;
  // }

  async snapToRoads(points: LatLng[]) {
    const api_key = 'AIzaSyBvBFvz1U4Kl2RRGJq-AI0k53FY4bmXCOU';
    const path = points
      .map((point) => `${point.lat()},${point.lng()}`)
      .join('|');
    const url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${api_key}`;

    const response = await fetch(url);
    if (response.status === 200) {
      return response.json().then((data) => {
        let pointsArray = data.snappedPoints;
        let points = [];
        for (let point of pointsArray) {
          points.push({
            lat: point.location.latitude,
            lng: point.location.longitude,
          });
        }

        return points;
      });
    } else {
      throw new Error(`Failed to snap to roads. Status: ${response.status}`);
    }
  }

  calculateArrowIcons(stepPercentage: number) {
    const icons = [];

    icons.push({
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      },
      offset: '0%',
    });

    for (let offset = stepPercentage; offset < 100; offset += stepPercentage) {
      icons.push({
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        },
        offset: `${offset}%`,
      });
    }

    icons.push({
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      },
      offset: '100%',
    });

    return icons;
  }

  onSelectOrder(order: OldMapOrder) {
    if (!this.selectedOrders.includes(order)) {
      this.selectedOrders.push(order);

      this.geocoder.geocode(
        { address: order.pickup_address },
        (results: any, status) => {
          if (status == 'OK') {
            let latLng: LatLng = results[0].geometry.location;
            order = {
              ...order,
              pickup: {
                ...order.pickup,
                lat: 0,
                long: 0,
              },
              delivery: {
                ...order.delivery,
                lat: 0,
                long: 0,
              },
            };

            order.pickup.lat = latLng.lat();
            order.pickup.long = latLng.lng();

            // console.log(order.pickup_address, order.delivery_address);

            this.geocoder.geocode(
              { address: order.delivery_address },
              (results: any, status) => {
                if (status == 'OK') {
                  let latLng: LatLng = results[0].geometry.location;
                  order.delivery.lat = latLng.lat();
                  order.delivery.long = latLng.lng();

                  this.addPath(order);
                } else {
                  alert(
                    'Geocode was not successful for the following reason: ' +
                      status
                  );
                }
              }
            );
          } else {
            alert(
              'Geocode was not successful for the following reason: ' + status
            );
          }
        }
      );
      // }
    } else {
      this.selectedOrders = this.selectedOrders.filter(
        (selectedOrder) => selectedOrder !== order
      );
      this.deletePath(order);
    }
  }

  getAllOrders() {
    this.loading = true;
    this.subscriptions.push(
      this.dispatchApisService
        .getAllOrdersWithoutDrivers(0, 0)
        .subscribe((res) => {
          this.orders = res.data;
          this.selectedOrders = [];
          for (let order of this.orders) {
            this.ordersHashSet.add(order.order_id);
            order.color = this.getRandomHexColor();
          }

          this.listenToOrderChanges();
          // console.log(this.orders);

          this.initializeMap();
          this.loading = false;
        })
    );
  }

  listenToOrderChanges() {
    this.subscriptions.push(
      this.socketService.listenToEvent('orders-updated').subscribe((res) => {
        // console.log('Socket orders');

        // console.log(res);

        let newOrders = [];
        for (let order of res)
          if (!this.ordersHashSet.has(order.order_id)) {
            order.color = this.getRandomHexColor();
            newOrders.push(order);
            this.ordersHashSet.add(order.order_id);
          }

        // console.log(this.ordersHashSet);
        // console.log(newOrders);

        this.orders.push(...newOrders);
      })
    );
  }

  // addMarker(lat: number, lng: number, isPickup: boolean): google.maps.Marker {
  //   // console.log(lat, lng);

  //   const marker = new google.maps.Marker({
  //     position: { lat, lng },
  //     map: this.map,
  //     icon: `assets/img/${isPickup ? 'delivery' : 'pickup'}.svg`,
  //   });

  //   return marker;
  // }

  addMarker(
    lat: number,
    lng: number,
    isPickup: boolean,
    data: any
  ): google.maps.Marker {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: `assets/img/${isPickup ? 'pickup' : 'delivery'}.svg`,
    });

    // console.warn('------');
    // console.warn(data);

    marker.addListener('click', () => {
      const infowindow = new google.maps.InfoWindow({
        content: this.getContentOfMarker(data, isPickup),
      });

      // console.log(data);
      infowindow.open(this.map, marker);
      setTimeout(() => {
        const pickupNote = document.getElementById(
          `pickup-note-${data.order_code}-${isPickup ? 'pickup' : 'delivery'}`
        );
        const deliveryNote = document.getElementById(
          `delivery-note-${data.order_code}-${isPickup ? 'pickup' : 'delivery'}`
        );

        const selectBtn = document.getElementById(
          `select-order-btn-${data.order_code}-${
            isPickup ? 'pickup' : 'delivery'
          }`
        );

        if (!data.pickup.notes && pickupNote) pickupNote.style.display = 'none';
        if (!data.delivery.notes && deliveryNote)
          deliveryNote.style.display = 'none';

        selectBtn?.addEventListener('click', () => {
          infowindow.close();

          let point = {
            lat: isPickup ? +data.pickup.lat : +data.delivery.lat,
            lng: isPickup ? +data.pickup.long : +data.delivery.long,
          };

          if (this.isSelectedPoint.has(JSON.stringify(point))) return;

          this.isSelectedPoint.add(JSON.stringify(point));
          this.getTimeBetweenPointAndLastSelectedOne(point);
          this.addSelectMarker(point);
        });
      }, 0);
    });

    return marker;
  }

  addPath(order: OldMapOrder): void {
    let point1 = { lat: +order.pickup.lat, lng: +order.pickup.long };
    let point2 = { lat: +order.delivery.lat, lng: +order.delivery.long };
    let pMarker = this.addMarker(point1.lat, point1.lng, true, order);
    let dMarker = this.addMarker(point2.lat, point2.lng, false, order);
    this.ordersMarkers.push({ pMarker, dMarker, orderId: order.order_id });

    this.addRoutePolyline(point1, point2, order);
    this.setCenter([point1, point2]);
  }

  deletePath(order: OldMapOrder) {
    let filteredMarkers = [];
    for (let marker of this.ordersMarkers) {
      if (marker.orderId === order.order_id) {
        marker.pMarker.setMap(null);
        marker.dMarker.setMap(null);
      } else {
        filteredMarkers.push(marker);
      }
    }
    this.ordersMarkers = filteredMarkers;

    let filteredDirections = [];
    for (let dr of this.directions) {
      if (dr.orderId === order.order_id) {
        dr.direction.setMap(null);
      } else {
        filteredDirections.push(dr);
      }
    }
    this.directions = filteredDirections;
  }

  addRoutePolyline(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
    order: OldMapOrder
  ) {
    let request = {
      origin: point1,
      destination: point2,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService?.route(request, (response, status) => {
      let dr = new google.maps.DirectionsRenderer({
        map: undefined,
        suppressMarkers: true,
      });
      dr.setOptions({
        suppressPolylines: false,
        preserveViewport: true,
        map: this.map,
        polylineOptions: {
          strokeColor: order.color,
        },
      });

      if (status == google.maps.DirectionsStatus.OK) {
        dr.setDirections(response);
      }

      this.directions.push({ direction: dr, orderId: order.order_id });
    });
  }

  deselectAll() {
    for (let marker of this.selectedMarkersAndPolylines) {
      marker.setMap(null);
    }

    this.selectedMarkersAndPolylines = [];
    this.isSelectedPoint = new Set();
    this.lastSelectedPoint = null;
    this.totalDurationInSeconds = 0;
  }

  addSelectMarker(point: { lat: number; lng: number }) {
    const marker = new google.maps.Marker({
      position: point,
      map: this.map,
      icon: `assets/img/location-pin.svg`,
    });

    this.selectedMarkersAndPolylines.push(marker);
  }

  getTimeBetweenPointAndLastSelectedOne(point: { lat: number; lng: number }) {
    if (this.lastSelectedPoint) {
      const directionsService = new google.maps.DirectionsService();
      // const directionsDisplay = new google.maps.DirectionsRenderer();
      // directionsDisplay.setMap(this.map);

      const request = {
        origin: this.lastSelectedPoint,

        destination: point,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (response: any, status) => {
        if (status === 'OK') {
          const route = response.routes[0];
          const leg = route.legs[0];
          this.totalDurationInSeconds += leg.duration.value;

          // console.log(leg.duration.text);
          const startLocation = leg.start_location;
          const endLocation = leg.end_location;
          this.addPathWithDuration(
            startLocation,
            endLocation,
            leg.duration.text,
            leg.distance.text
          );
        } else {
          console.error(`Directions request failed with status: ${status}`);
        }
      });
    }

    this.lastSelectedPoint = point;
  }

  addPathWithDuration(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
    duration: string,
    distance: string
  ) {
    if (point1.lat == point2.lat && point1.lng == point2.lng) return;

    const polyline = new google.maps.Polyline({
      path: [point1, point2],
      geodesic: true,
      strokeColor: '#3366ff',
      strokeOpacity: 0.7,
      strokeWeight: 6,
    });

    polyline.setMap(this.map);

    const middleLocation = google.maps.geometry.spherical.interpolate(
      point1,
      point2,
      0.5 // 0.5 represents the midpoint
    );

    const infoWindow = new google.maps.InfoWindow({
      content: `
      <div class="no-close-btn">
        <span>Duration: ${duration}</span><br>
        <span>Total Duration: ${this.formatDurationFromSeconds(
          this.totalDurationInSeconds
        )}</span>
      </div>
      `,
    });

    infoWindow.setPosition(middleLocation);
    infoWindow.open(this.map);
    this.hideCloseBtnOfWindows();

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

    this.selectedMarkersAndPolylines.push(polyline, infoWindow);
  }

  formatDurationFromSeconds(durationInSeconds: number) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${
          minutes > 1 ? 's' : ''
        }`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      }
    } else {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  }

  hideCloseBtnOfWindows() {
    setTimeout(() => {
      const infoWindows = document.querySelectorAll(
        '.gm-style-iw.gm-style-iw-c'
      );
      infoWindows.forEach((win) => {
        const child = win.querySelector('.no-close-btn');

        if (child) {
          const closeBtn: any = win.querySelector('button.gm-ui-hover-effect');
          if (closeBtn) closeBtn.style.display = 'none';
        }
      });
    }, 0);
  }

  getRandomHexColor(): string {
    const letters = '0123456789';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 9)];
    }
    return color;
  }

  setCenter(points: { lat: number; lng: number }[]) {
    const center = this.calculateCenter(points);

    if (center) {
      this.map?.setCenter(center);
      // if (this.map.getZoom()!! > 5) this.map.setZoom(5);
    }
  }

  calculateCenter(points: { lat: number; lng: number }[]) {
    if (points.length === 0) {
      return null;
    }

    let totalLat = 0;
    let totalLng = 0;
    for (let point of points) {
      totalLat += point.lat;
      totalLng += point.lng;
    }

    const centerLat = totalLat / points.length;
    const centerLng = totalLng / points.length;

    return new google.maps.LatLng(centerLat, centerLng);
  }

  getAllDriveres() {
    this.subscriptions.push(
      this.driversService.getAllDrivers().subscribe((res) => {
        this.allDrivers = res;
        this.filteredDrivers$ = of(this.allDrivers);
      })
    );
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
    let assignedOrders = 0;

    for (let order of this.selectedOrders) {
      const payload = {
        order_id: order.order_id,
        driver_id: this.selectedDriver.id,
      };
      this.subscriptions.push(
        this.orderService.assignDriver(payload).subscribe({
          next: (res) => {
            assignedOrders++;
            if (assignedOrders === this.selectedOrders.length) {
              this.toasterService.showSuccess('Driver assigned');
              this.assignDriverLoading = false;
              this.getAllOrders();
            }
          },
          error: (err) => {
            if (assignedOrders === this.selectedOrders.length) {
              this.toasterService.showDanger("Driver Didn't assigned");
              this.assignDriverLoading = false;
              this.getAllOrders();
            }
          },
        })
      );
    }
  }

  openAssignDriverDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  async getLatLngFromAddress(address: string): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address: address }, (results: any, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const latLng: LatLng = results[0].geometry.location;
          resolve(latLng);
        } else {
          reject(new Error(`Geocoding failed for address: ${address}`));
        }
      });
    });
  }

  getContentOfMarker(data: any, isPickup: boolean): string {
    return `
      <div class="p-2">
        <p class="mb-2">Order: ${data.order_code}</p>
        <p class="mb-2">Pickup address: ${data.pickup.address}</p>
        <p class="mb-2" id="pickup-note-${data.order_code}-${
      isPickup ? 'pickup' : 'delivery'
    }">Pickup notes: ${data.pickup.notes}</p>
        <p class="mb-2">Delivery address: ${data.delivery.address}</p>
        <p class="mb-2" id="delivery-note-${data.order_code}-${
      isPickup ? 'pickup' : 'delivery'
    }">Delivery notes: ${data.delivery.notes}</p>
        <button class="btn btn-primary" id="select-order-btn-${
          data.order_code
        }-${isPickup ? 'pickup' : 'delivery'}">select</button>
      </div>`;
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
