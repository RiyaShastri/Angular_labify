import { Component, ElementRef, ViewChild } from '@angular/core';
import { DispatchAPIsService } from '../../services/dispatch-apis.service';
import { DispatchUtilitiesService } from '../../services/dispatch-utilities.service';
import { DipatchAllOrder } from '../../models/dispatch-all-orders.model';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss'],
})
export class AllOrdersComponent {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;

  constructor(
    private dispatchApisService: DispatchAPIsService,
    private dispatchUtilities: DispatchUtilitiesService,
    private socketService: SocketService
  ) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.getAllTodaysOrders();
  }

  private initializeMap(): void {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 40.73061, lng: -73.935242 }, // New Yourk id the default center
      zoom: 7,
    });
  }

  getAllTodaysOrders() {
    let page = 1;
    let lastPage = 1;
    this.dispatchApisService.getOrdersForPage().subscribe((res) => {
      for (let order of res) this.setOrderPath(order);
    });
  }

  async setOrderPath(order: DipatchAllOrder) {
    const pickupLocation = await this.dispatchUtilities.getLatLngFromAddress(
      order.pickup.address
    );

    const deliveryLocation = await this.dispatchUtilities.getLatLngFromAddress(
      order.delivery.address
    );

    if (order.status.status === 'pickedup') {
      let deliveryMarker = this.dispatchUtilities.addMarker(
        this.map,
        deliveryLocation,
        'assets/img/delivery.svg',
        'Delivery location'
      );
      this.showOrderMarkerInfoWindowOnClick(order, deliveryMarker, false);
    } else if (order.status.status === 'pending') {
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
      this.showOrderMarkerInfoWindowOnClick(order, deliveryMarker, false);

      this.dispatchUtilities.addPolylineBetweenPoints(this.map, [
        pickupLocation,
        deliveryLocation,
      ]);
    }
  }

  private showOrderMarkerInfoWindowOnClick(
    order: DipatchAllOrder,
    marker: google.maps.Marker,
    isPickupMarker: boolean
  ) {
    let windowIsOpenned = false;
    const infoWindow = new google.maps.InfoWindow({
      content: this.dispatchUtilities.getContentOfOrderMarkerInfoWindow(
        order.order_id,
        `${order.order_code}`,
        order.pickup.address,
        order.delivery.address,
        isPickupMarker,
        false
      ),
    });

    marker.addListener('click', () => {
      if (windowIsOpenned) {
        windowIsOpenned = false;
        infoWindow.close();
      } else {
        windowIsOpenned = true;
        infoWindow.open(this.map, marker);
      }
    });
  }
}
