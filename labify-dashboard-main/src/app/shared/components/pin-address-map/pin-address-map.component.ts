import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {} from 'googlemaps';

type MarkerPosition = {
  lat: number;
  lng: number;
};

@Component({
  selector: 'ngx-pin-address-map',
  template: `
  <span class="text-danger text-bold">*Select your location</span>
  <div #map style="width: 100%; height: 500px;"></div>`,
  styles: [``],
})
export class PinAddressMapComponent implements AfterViewInit, OnChanges {
  @Input() pinPosition!: MarkerPosition;
  @Output() markerPositionChanged = new EventEmitter<MarkerPosition>();

  @ViewChild('map') mapElement: any;
  map!: google.maps.Map;
  pin!: google.maps.Marker;

  constructor() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pinPosition'] && this.map && this.pin) {
      this.map.panTo(this.pinPosition);
      this.updatePinPosition(this.pinPosition);
    }
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: new google.maps.LatLng(
        this.pinPosition.lat,
        this.pinPosition.lng
      ),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    this.initPin();

    this.map.addListener('center_changed', () => {
      let center = this.map.getCenter();
      if (center) {
        let newPinPosition = {
          lat: center.lat(),
          lng: center.lng(),
        };

        this.updatePinPosition(newPinPosition);
      }
    });
  }

  initPin() {
    this.pin = new google.maps.Marker({
      position: this.pinPosition,
      map: this.map,
      icon: 'assets/img/pin.png',
    });
  }

  updatePinPosition(newPinPosition: MarkerPosition) {
    this.pin.setPosition(newPinPosition);
    this.changePinPosition(newPinPosition);
  }

  changePinPosition(value: MarkerPosition) {
    this.markerPositionChanged.emit(value);
  }
}
