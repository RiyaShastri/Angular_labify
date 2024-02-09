import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyPriceService } from '../../../../core/services/company-price.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { LocalDataSource } from 'ng2-smart-table';
@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
  constructor(private route: ActivatedRoute, private priceService: CompanyPriceService, private router: Router, private toaster: ToasterService) {
    // this.getCities();
    this.route.params.subscribe(
      params => {
        this.companyId = params['id'];
        this.price_type = params["type"];
      }
    )
  }
  companyId: any;
  // price_type: any;
  isFound: boolean = false;
  create: boolean = false;
  editeMode: boolean = false;
  milePrices: any;
  // cities: any;
  price_type: any;
  // pricePostalCodes: any;
  // priceNextDay: any;
  // priceRegular: any;
  // priceSTAT: any;
  // priceSuperSTAT: any;
  priceNextDayMiles: any;
  priceRegularMiles: any;
  priceSTATMiles: any;
  priceSuperSTATMiles: any;
  // postalCodes: any;
  // selectedPriceType: any;
  defaultPrice: any;
  // citiesList: any;
  source: LocalDataSource = new LocalDataSource();
  pricesList: any;

  ngOnInit(): void {
    this.getPrice();
  }
  // settings = {
  //   mode: 'external',
  //   actions: {
  //     delete: false,
  //   },
  //   pager: {
  //     display: false,
  //   },
  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //     createButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  //     confirmCreate: true,
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //     saveButtonContent: '<i class="nb-checkmark"></i>',
  //     cancelButtonContent: '<i class="nb-close"></i>',
  //     confirmSave: true,
  //   },
  //   columns: {
  //     id: {
  //       title: 'ID',
  //       type: 'number',
  //       editable: false,
  //       addable: false,
  //     },
  //     postal_code: {
  //       title: 'Postal code',
  //       type: 'string',
  //     },
  //     reqular_cities: {
  //       title: 'Reqular',
  //       type: 'string',
  //     },
  //     stat_cities: {
  //       title: 'Stat',
  //       type: 'string',
  //     },
  //     super_stat_cities: {
  //       title: 'Super stat',
  //       type: 'string',
  //     },
  //     next_day_cities: {
  //       title: 'Next day',
  //       type: 'string',
  //     },
  //   },
  // };
  getPrice() {
    this.priceService.getCompanyPrices(this.companyId).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.price_type=res.data.type;
        if(this.price_type==='city'){
          this.pricesList = res.data.prices;
          this.source.load(res.data.prices);
        }else{
          this.milePrices= res.data.prices;
          this.source.load(res.data.prices);
        }
        // if (res.data.prices.length === 0) {
        //   this.isFound = false;
        // } else {
        //   this.isFound = true;
        // }
        // this.price_type = res.data.type;
        // this.selectedPriceType = res.data.type;
        // this.getCities()
        // // // console.log(res);
        // this.prices = res.data.prices;
        // // console.log(this.prices);
        // // // console.log(this.citiesList);
        // this.priceSTAT = this.prices.map((p: any) => p.stat_cities);
        // // // console.log(this.priceSTAT);
        // this.priceNextDay = this.prices.map((p: any) => p.next_day_cities);
        // this.priceRegular = this.prices.map((p: any) => p.reqular_cities);
        // // // console.log(this.priceRegular);
        // this.priceSuperSTAT = this.prices.map((p: any) => p.super_stat_cities);


        // this.postalCodes = this.prices.map((price: any) => price.postal_code);
        // this.priceNextDayMiles = this.prices[0]?.next_day_miles;
        // this.priceSTATMiles = this.prices[0]?.stat_miles;
        // this.priceSuperSTATMiles = this.prices[0]?.super_stat_miles;
        // this.priceRegularMiles = this.prices[0]?.reqular_miles;
      },
      error: (err: any) => {},
    });
  }
  updatePrice() {
    this.editeMode = true;
    // this.getCities()
  }
  createPrice() {
    this.create = true;
    this.editeMode = false;
    // // console.log(this.price_type);
    // this.getCities()
  }
  // onPriceTypeChange(event: any) {
  //   // this.selectedPriceType = event;
  //   // this.getCities();
  // }
  submitCityPrice() {
    this.create = false;
    this.editeMode = false;
    const form = {
      type: 'city',
      user_id: this.companyId,
      data: this.pricesList,
    }
    // console.log(form);
    this.priceService.updatePrice(form, this.companyId).subscribe({
      next: (res) => {
        this.getPrice();
        this.toaster.showSuccess('Changes Saved');
      },
      error: (err) => {
        this.toaster.showDanger(err.message);
      },
    });
  }
  submitMilePrice() {
    this.create = false;
    this.editeMode = false;
    const form = {
      type: 'mile',
      user_id: this.companyId,
      id:this.milePrices[0].id,
      reqular_miles: this.milePrices[0].reqular_miles,
      stat_miles: this.milePrices[0].stat_miles,
      super_stat_miles: this.milePrices[0].super_stat_miles,
      next_day_miles: this.milePrices[0].next_day_miles,
    }
    // console.log(form);
    this.priceService.updateMilePrice(form, this.companyId).subscribe({
      next: (res) => {
        // // console.log(res);
        this.toaster.showSuccess("Changes Saved");
        this.getPrice();
      },
      error: (err) => {
        // // console.log(err);
        this.toaster.showDanger(err.message);
      },
    });
  }
  onPriceRegularChange(price: any, event: any) {

    // // console.log(i);
    // // console.log(price);
    // // console.log(this.pricesList);
    if (this.price_type === 'city') {
      price.reqular_cities = event.target.value;
    } else {
      price.reqular_miles = event.target.value;

    }
    // this.priceRegular[i]= event.target.value;
    // this.priceRegular = this.prices.map((p: any) => p.reqular_cities);
  }
  onPriceSTATChange(price: any, value: any) {
    if (this.price_type === "city") {
      price.stat_cities = value.target.value;
    } else {
      price.stat_miles = value.target.value;

    }
    // // console.log(this.pricesList);
    // this.priceSTAT = this.prices.map((p: any) => p.stat_cities);
    // // console.log("STAT");
    // // console.log(this.priceSTAT);
  }
  onPriceSuperSTATChange(price: any, value: any) {
    if (this.price_type === "city") {
      price.super_stat_cities = value.target.value;
    } else {
      price.super_stat_miles = value.target.value;
    }
    // // console.log(this.pricesList);
    // this.priceSuperSTAT = this.prices.map((p: any) => p.super_stat_cities);
  }
  onPriceNextDayChange(price: any, value: any) {
    if (this.price_type === "city") {
      price.next_day_cities = value.target.value;
    } else {
      price.next_day_miles = value.target.value;
    }
    // // console.log(this.pricesList);
    // this.priceNextDay = this.prices.map((p: any) => p.next_day_cities);
  }
  // onPriceRegularCreate(index: any, value: any) {
  //   this.priceRegular[index] = +value.target.value;
  // }
  // onPriceSTATCreate(index: any, value: any) {
  //   this.priceSTAT[index] = +value.target.value;
  // }
  // onPriceSuperSTATCreate(index: any, value: any) {
  //   this.priceSuperSTAT[index] = +value.target.value;
  // }
  // onPriceNextDayCreate(index: any, value: any) {
  //   this.priceNextDay[index] = +value.target.value;
  // }
  // getCities() {
  //   // // console.log(this.price_type);
  //   if (this.price_type === 'city' || this.selectedPriceType === 'city') {
  //     this.priceService.getCitiesList().subscribe({
  //       next: (res) => {
  //         this.cities = res.data;
  //         // // console.log(res);
  //         // // console.log(this.cities);
  //         this.postalCodes = this.cities.map((city: any) => city.postal_code);
  //         this.citiesList = this.cities.map((p: any) => p.city);

  //         this.cities.forEach((city: any) => {
  //           const foundPrice = this.prices.find((price: any) => price.postal_code === city.postal_code);
  //           if (!foundPrice) {
  //             // If no corresponding price object is found, create a default price object
  //             this.prices.push({
  //               postal_code: city.postal_code,
  //               reqular_cities: 0,
  //               stat_cities: 0,
  //               super_stat_cities: 0,
  //               next_day_cities: 0,
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }



  // }

  navigateSurcharge() {
    this.router.navigate([
      '/basic-maintenance/customers',
      'surcharge',
      this.companyId,
    ]);
  }
}
