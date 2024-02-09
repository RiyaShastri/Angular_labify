import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';
import { DriverDetails } from 'src/app/core/models/driver-details.model';
import { DriverLocation } from 'src/app/core/models/driver-location.model';
import { DriverName } from 'src/app/core/models/driver-name.model';
import { USER_ROLE, USER_KEY } from 'src/app/core/services/auth.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-track-drivers-map',
  templateUrl: './track-drivers-map.component.html',
  styleUrls: ['./track-drivers-map.component.scss'],
})
export class TrackDriversMapComponent implements OnChanges, AfterViewInit {
  @Input() driverData!: DriverDetails;
  @Input() isActiveDriver!: boolean;
  @Input() activeDrivers!: DriverName[];

  activeDriversMarkers: Map<number, google.maps.Marker> = new Map();

  directionsService!: google.maps.DirectionsService;

  directions: {
    direction: google.maps.DirectionsRenderer;
    orderId: number;
  }[] = [];

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  arrowPath: google.maps.Polyline | undefined = undefined;
  currentDriverLocation!: { lat: number; lng: number };
  lastSelectedPoint: { lat: number; lng: number } | null = null;
  isSelectedPoint: Set<string> = new Set();
  selectedMarkersAndPolylines: any[] = [];
  totalDurationInSeconds = 0;
  driverSocketDirections: google.maps.DirectionsRenderer[] = [];
  // activeDrivers!: DriverName[];

  geocoder = new google.maps.Geocoder();

  isInit = false;

  ordersMarkersAndPaths: Map<
    number,
    {
      pickupMarker: google.maps.Marker;
      deliveryMarker: google.maps.Marker;
      polyline: google.maps.Polyline;
    }
  > = new Map();

  constructor(
    private socketService: SocketService,
    private driverService: DriversService,
    private driversService: DriversService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // console.log('New Init');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['driverData']) {
      this.initDriver();
    }

    if (changes['activeDrivers'] && this.mapContainer && this.activeDrivers) {
      this.showActiveDriversMarkers();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    if (this.isInit) return;

    this.directionsService = new google.maps.DirectionsService();

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 40.73061, lng: -73.935242 },
      zoom: 7,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.initDriver();
    this.isInit = true;
    this.listenToOrdersStatusChanges();
  }

  initDriver() {
    let points = [];
    this.arrowPath?.setMap(null);
    this.arrowPath = undefined;
    if (this.driverData) {
      this.deleteOrdersMarkersAndPaths();

      for (let order of this.driverData.orders) {
        let role = this.storageService.getLocalStorageValue(USER_ROLE);
        let userId = this.storageService.getLocalStorageValue(USER_KEY).id;

        // show this order if the logged in user is:
        // - admin -> (show all)
        // - company -> (check if this order assigned to the logged in company)
        if (
          role !== 'company' ||
          (role == 'company' && userId == order.delivery.user_id)
        ) {
          let pickup = { lat: +order.pickup.lat, lng: +order.pickup.long };
          let delivery = {
            lat: +order.delivery.lat,
            lng: +order.delivery.long,
          };
          points.push(pickup, delivery);
          if (
            order.pickup.status === 'pickedup' &&
            order.delivery.status !== 'delivered'
          ) {
            let deliveryMarker = this.addMarker(
              delivery.lat,
              delivery.lng,
              false,
              order
            );
            this.ordersMarkersAndPaths.set(order.id, {
              deliveryMarker,
              pickupMarker: new google.maps.Marker(),
              polyline: new google.maps.Polyline(),
            });
          } else if (order.delivery.status !== 'delivered')
            this.addPathWithMarkers(order);
        }
      }
      if (points.length) this.setCenter(points);
      this.getInitialLocations(this.driverData.id);
      this.listenToDriverLocations();
      this.showActiveDriversMarkers();
      // this.listenToOrdersStatusChanges();
    }

    // this.map?.setCenter(
    //   this.activeDriversMarkers.get(this.driverData?.id)?.getPosition()!!
    // );
  }

  showActiveDriversMarkers() {
    if (this.activeDrivers) {
      for (let marker of this.activeDriversMarkers) marker[1].setMap(null);
      this.activeDriversMarkers = new Map();

      for (let driver of this.activeDrivers) {
        this.activeDriversMarkers.set(driver.id, this.addDriverMarker(driver));
      }
    }
  }

  addDriverMarker(driver: DriverName) {
    return new google.maps.Marker({
      position: {
        lat: driver.current_location.lat,
        lng: driver.current_location.lng,
      },
      map: this.map,
      title: driver.name,
      label: `${driver.id}`,
    });
  }

  addMarker(
    lat: number,
    lng: number,
    isPickup: boolean,
    data: any
  ): google.maps.Marker {
    // console.log('------');
    // console.log(data);

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: `assets/img/${isPickup ? 'pickup' : 'delivery'}.svg`,
    });

    const infowindow = new google.maps.InfoWindow({
      content: this.getContentOfMarker(data, isPickup),
    });

    marker.addListener('click', () => {
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

        if (!data.pickup.notes && pickupNote) pickupNote.style.display = 'none';
        if (!data.delivery.notes && deliveryNote)
          deliveryNote.style.display = 'none';

        if (this.isActiveDriver) {
          const timeElementId = `time-${data.order_code}-${
            isPickup ? 'pickup' : 'delivery'
          }`;
          const timeElement = document.getElementById(timeElementId);
          if (timeElement) {
            timeElement.style.display = 'none';
            this.getEstimatedTime(
              isPickup
                ? { lat: +data.pickup.lat, lng: +data.pickup.long }
                : { lat: +data.delivery.lat, lng: +data.delivery.long },
              this.currentDriverLocation,
              timeElement
            );
          }
        }
      }, 0);
    });

    return marker;
  }

  getEstimatedTime(
    src: { lat: number; lng: number },
    dest: { lat: number; lng: number },
    element: HTMLElement
  ): void {
    let directionsService = new google.maps.DirectionsService();
    let result!: string;

    // src = { lat: 40.9837002, lng: -73.6756099 };
    // dest = { lat: 40.846417, lng: -73.3673927 };

    directionsService.route(
      {
        origin: src,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      function (response, status) {
        if (status === 'OK') {
          // console.log(response?.routes[0].legs);

          if (response?.routes[0].legs[0].duration?.text)
            result = response?.routes[0].legs[0].duration?.text;
        } else {
          result = "Can't Be Calculated";
        }
        element.style.display = 'inline';
        element.innerHTML = result;
      }
    );
  }

  listenToOrdersStatusChanges() {
    this.socketService.listenToEvent('sendOrderData').subscribe((order) => {
      if (
        order.order_status_last === 'pickedup' &&
        this.ordersMarkersAndPaths.has(order.order_id)
      ) {
        let orderPath = this.ordersMarkersAndPaths.get(order.order_id);
        orderPath?.pickupMarker.setMap(null);
        orderPath?.polyline.setMap(null);
      } else if (
        order.order_status_last === 'deliveried' &&
        this.ordersMarkersAndPaths.has(order.order_id)
      ) {
        let orderPath = this.ordersMarkersAndPaths.get(order.order_id);
        orderPath?.pickupMarker.setMap(null);
        orderPath?.deliveryMarker.setMap(null);
        orderPath?.polyline.setMap(null);
        this.ordersMarkersAndPaths.delete(order.order_id);
      }
    });
  }

  async addPathWithMarkers(orderData: any) {
    let pickupPoint = await this.getLatLngFromAddress(orderData.pickup.address);
    let deliveryPoint = await this.getLatLngFromAddress(
      orderData.delivery.address
    );

    let pickupMarker = this.addMarker(
      pickupPoint.lat(),
      pickupPoint.lng(),
      true,
      orderData
    );

    let deliveryMarker = this.addMarker(
      deliveryPoint.lat(),
      deliveryPoint.lng(),
      false,
      orderData
    );

    const polyline = new google.maps.Polyline({
      path: [pickupPoint, deliveryPoint],
      geodesic: true,
      strokeColor: '#000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: this.map,
    });

    this.ordersMarkersAndPaths.set(orderData.id, {
      deliveryMarker,
      pickupMarker,
      polyline,
    });
  }

  deleteOrdersMarkersAndPaths() {
    for (let [orderId, orderPath] of this.ordersMarkersAndPaths) {
      orderPath.deliveryMarker.setMap(null);
      orderPath.pickupMarker.setMap(null);
      orderPath.polyline.setMap(null);
      this.ordersMarkersAndPaths.delete(orderId);
    }
  }

  deselectAll() {
    for (let marker of this.selectedMarkersAndPolylines) {
      marker.setMap(null);
    }

    this.selectedMarkersAndPolylines = [];
    this.isSelectedPoint = new Set();
    this.lastSelectedPoint = null;
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

  addPath(points: { lat: number; lng: number }[]) {
    if (!this.arrowPath)
      this.arrowPath = new google.maps.Polyline({
        path: points,
        map: this.map,
        geodesic: true,
        icons: this.calculateArrowIcons(10),
        strokeColor: '#3366ff',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });
    else this.arrowPath.setPath(points);
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

  getInitialLocations(driverId: number) {
    if (this.isActiveDriver)
      this.driverService.getActiveDriverLocations(driverId).subscribe((res) => {
        this.addPath(res.points);

        this.currentDriverLocation = {
          lat: res.points[res.points.length - 1].lat,
          lng: res.points[res.points.length - 1].lng,
        };
      });
  }

  listenToDriverLocations() {
    if (this.driverData && this.isActiveDriver) {
      // console.log('Driver: ', this.driverData.id);

      this.socketService
        .listenToEvent(`admin-driver-location-updated-${this.driverData.id}`)
        .subscribe(
          (res) => {
            // console.log('Locations change', res);
            if (res) {
              // console.log(res);

              this.currentDriverLocation = {
                lat: res.points[res.points.length - 1].lat,
                lng: res.points[res.points.length - 1].lng,
              };

              // this.addDotMaker(
              //   this.currentDriverLocation.lat,
              //   this.currentDriverLocation.lng
              // );
              this.addPath(res.points);

              // this.setCenter([this.currentDriverLocation]);
            }
          },
          (err) => {
            // console.log('Socket error', err);
          }
        );
    }
  }

  addDotMaker(lat: number, lng: number) {
    return new google.maps.Marker({
      position: new google.maps.LatLng({
        lat,
        lng,
      }),
      icon: 'assets/img/dot.svg',
      map: this.map,
    });
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
    return this.isActiveDriver
      ? `
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
        <p class="mb-2">Estimated time: <span id="time-${data.order_code}-${
          isPickup ? 'pickup' : 'delivery'
        }"></span></p>
        <button class="btn btn-primary" id="select-order-btn-${
          data.order_code
        }-${isPickup ? 'pickup' : 'delivery'}">select</button>
      <div>
    `
      : `
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
}
