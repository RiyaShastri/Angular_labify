import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { } from '@angular/google-maps';

@Component({
    selector: 'AutocompleteComponent',
    template: `
      <input class="input"
      [value]='address'
        nbInput
        type="text"
        [(ngModel)]="autocompleteInput"
        #addresstext
        style="width: 100%;"
        >
    `,
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() adressType!: string;
    @Input() address!: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;
    @ViewChild('postalCodeInput') postalCodeInput !: any;
    @ViewChild('stateInput') stateInput !: any;
    @ViewChild('cityInput') cityInput !: any;
    @Output() dialogOpened: EventEmitter<void> = new EventEmitter<void>();

    autocompleteInput!: string;
    queryWait!: boolean;

    constructor() {
      // // console.log("From gPlaces");

      // this.getPlaceAutocomplete();

    }

    ngOnInit() {
      // this.getPlaceAutocomplete();

    }

    ngAfterViewInit() {
      // console.log("From gPlaces");
      setTimeout(() => {
      this.getPlaceAutocomplete();

    }, 1000);

    }
    initializeGooglePlacesAutocomplete() {
      setTimeout(() => {
        this.getPlaceAutocomplete();
        this.dialogOpened.emit();
      }, 1000);
    }
     getPlaceAutocomplete() {
      // console.log("From gPlaces func");

        const autocomplete = new google.maps.places.Autocomplete(this.addresstext?.nativeElement,
            {
                componentRestrictions: { country: 'US' },
                types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {

            const place = autocomplete?.getPlace();
            // this.updateInputFields(place);
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
      // console.log("From gPlaces func33");

        this.setAddress.emit(place);
    }
     updateInputFields(place: google.maps.places.PlaceResult) {
      if (place) {
          // Update the input fields with the selected place details
          // this.postalCodeInput.nativeElement.value = this.getPostalCodeFromPlace(place);
          // this.stateInput.nativeElement.value = this.getStateFromPlace(place);
          // this.cityInput.nativeElement.value = this.getCityFromPlace(place);
          place.address_components?.forEach((component: any) => {
            if (component.types.includes('administrative_area_level_1')) {
              this.stateInput.nativeElement.value = component.long_name;
              // this.stateCode = component.short_name;
            }
            if (component.types.includes('locality')) {
              this.cityInput.nativeElement.value = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              this.postalCodeInput.nativeElement.value = component.long_name;
            }
          });
      }
  }
    private getPostalCodeFromPlace(place: google.maps.places.PlaceResult): any {
      // Implement logic to extract postal code from place
      // You may need to iterate through address_components to find it
  }

  private getStateFromPlace(place: google.maps.places.PlaceResult): any {
      // Implement logic to extract state from place
  }

  private getCityFromPlace(place: google.maps.places.PlaceResult): any {
      // Implement logic to extract city from place
  }

}
