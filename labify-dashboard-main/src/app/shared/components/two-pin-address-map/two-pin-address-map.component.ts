import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {} from 'googlemaps';

type MarkerPosition = {
  lat: any;
  lng: any;
};

@Component({
  selector: 'ngx-two-pin-address-map',
  template: `<div
    #mapContainer
    style="width: 100%; height: 100%; min-height: 500px;"
  ></div>`,
  styles: [``],
})
export class TwoPinAddressMapComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() pinPosition?: MarkerPosition;
  @Input() secondPinPosition?: MarkerPosition;

  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private ds!: google.maps.DirectionsService;
  private dr!: google.maps.DirectionsRenderer;

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pinPosition'] || changes['secondPinPosition']) {
      const pinPosition = this.parseLatLng(
        changes['pinPosition']?.currentValue
      );
      const secondPinPosition = this.parseLatLng(
        changes['secondPinPosition']?.currentValue
      );
      this.updatePoints(pinPosition, secondPinPosition);
      this.setRoutePolyline();
    }
  }

  private initializeMap(): void {
    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true,
    });

    const mapOptions: google.maps.MapOptions = {
      center: { lat: 37.0902, lng: -95.7129 }, // Default center
      zoom: 5, // Default zoom level
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

  private addMarker(lat: number, lng: number, isPoint1: any): void {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: `assets/img/pin-${isPoint1 ? 1 : 2}.svg`,
    });

    this.markers.push(marker);
  }

  private clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  public updatePoints(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): void {
    this.clearMarkers();
    this.addMarker(point1.lat, point1.lng, true);
    this.addMarker(point2.lat, point2.lng, false);

    const midPoint = {
      lat: (point1.lat + point2.lat) / 2,
      lng: (point1.lng + point2.lng) / 2,
    };
    this.map?.setCenter(midPoint);

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(point1.lat, point1.lng));
    bounds.extend(new google.maps.LatLng(point2.lat, point2.lng));
    // this.map?.fitBounds(bounds);
  }

  private parseLatLng(latLng: MarkerPosition): MarkerPosition {
    return {
      lat: parseFloat(latLng?.lat),
      lng: parseFloat(latLng?.lng),
    };
  }

  setRoutePolyline() {
    if (this.pinPosition && this.secondPinPosition) {
      let request = {
        origin: this.parseLatLng(this.pinPosition),
        destination: this.parseLatLng(this.secondPinPosition),
        travelMode: google.maps.TravelMode.DRIVING,
      };

      this.ds?.route(request, (response, status) => {
        this.dr.setOptions({
          suppressPolylines: false,
          map: this.map,
          polylineOptions: {
            strokeColor: '#4466E1',
          },
        });

        if (status == google.maps.DirectionsStatus.OK) {
          this.dr.setDirections(response);
        }
      });
    }
  }
}
