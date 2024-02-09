import { Injectable } from '@angular/core';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';

@Injectable({
  providedIn: 'root',
})
export class DispatchUtilitiesService {
  private geocoder = new google.maps.Geocoder();

  constructor() {}

  /**
   * @param durationInSeconds number of seconds
   * @returns duration string like this (1 hour 5 min)
   */
  getDurationTextFromSeconds(durationInSeconds: number): string {
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

  /**
   * @description function gets the order data and returns the HTML content of Info window
   * this info window has a select btn with
   * id = 'select-order-btn-[orderId]-pickup' | 'select-order-btn-[orderId]-delivery'
   */
  getContentOfOrderMarkerInfoWindow(
    orderId: number,
    orderCode: string,
    pickupAddress: string,
    deliveryAddress: string,
    isPickup: boolean,
    hasSelectBtn = true
  ): string {
    return `
      <div class="p-2">
        <p class="mb-2">Order: ${orderCode}</p>
        <p class="mb-2">Pickup address: ${
          // data.pickup_address ? data.pickup_address : data.pickup.address
          pickupAddress
        }</p>
        <p class="mb-2">Delivery address: ${
          // data.delivery_address ? data.delivery_address : data.delivery.address
          deliveryAddress
        }</p>
        ${
          hasSelectBtn
            ? `<button class="btn btn-primary" id="select-order-btn-${orderId}-${
                isPickup ? 'pickup' : 'delivery'
              }">select</button>`
            : ''
        }
      </div>`;
  }

  /**
   * @description async function that takes an address as a string it must be like this: (111 E 210th St, Bronx, NY 10467, USA)
   * @param address string
   * @returns a promis of LatLng
   */
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

  /**
   * @description function that adds a marker to the map and returns it
   * @param map
   * @param position {lat: number, lng: number}
   * @param title optional title displayed on marker hover
   * @param iconPath optional marker image
   * @param label optional label displayed on the marker
   * @param onClick optional callback function that called on marker click
   * @returns the marker
   */
  addMarker(
    map: google.maps.Map,
    position: LatLng,
    iconPath?: string,
    title?: string,
    label?: string
  ): google.maps.Marker {
    let markerOptions: google.maps.MarkerOptions = {
      position,
      map,
    };

    if (label) markerOptions = { ...markerOptions, label };
    if (iconPath) markerOptions = { ...markerOptions, icon: iconPath };
    if (title) markerOptions = { ...markerOptions, title };

    return new google.maps.Marker(markerOptions);
  }


  /**
   * @param map
   * @param points
   * @param strokeColor
   * @param strokeOpacity
   * @param strokeWeight
   * @returns
   */
  addPolylineBetweenPoints(
    map: google.maps.Map,
    points: LatLng[],
    strokeColor = '#000',
    strokeOpacity = 1,
    strokeWeight = 3
  ) {
    const polyline = new google.maps.Polyline({
      map,
      path: points,
      geodesic: true,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    });

    return polyline;
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
}
