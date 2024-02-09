import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { DefaultPricesService } from 'src/app/core/services/default-prices.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CompanyAddressService } from '../../../../core/services/company-address.service';
import { PostalCodeService } from '../../../../core/services/postalcode.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent {
  settings = {
    mode: 'external',
    actions: {
      delete: false,
    },
    pager: {
      display: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      // postal_code: {
      //   title: 'Postal code',
      //   type: 'string',
      // },
      default_reqular_cities: {
        title: 'Reqular',
        type: 'string',
      },
      default_stat_cities: {
        title: 'Stat',
        type: 'string',
      },
      default_super_stat_cities: {
        title: 'Super stat',
        type: 'string',
      },
      default_next_day_cities: {
        title: 'Next day',
        type: 'string',
      },
    },
  };
  editeMode: boolean = false;

  source: LocalDataSource = new LocalDataSource();
  scheduleId: any;
  loading = false;
  cityPrices!: any[];
  cityPricesPaginationArgs!: PaginatePipeArgs;
  pinPosition = {
    lat: 37.0902,
    lng: -95.7129,
  };
  postalCode!: number | null;
  postalCodeAdded = false;
  showPostalcodeError = false;
  companyId!: number;
  showPostalCodeAlert = false;
  city!: any;
  state!: any
  state_code!: any;
  postal_code!: any;
  default_reqular_cities: any;
  default_stat_cities: any;
  default_super_stat_cities: any;
  default_next_day_cities: any;
  id!: any;
  currentPage: any;
  constructor(
    private dialogService: NbDialogService,
    private defaultPricesService: DefaultPricesService,
    private toaster: ToasterService,
    private route: ActivatedRoute,
    private companyAddressService: CompanyAddressService,
    private postalCodeService: PostalCodeService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.getList(1);
  }

  getList(page: any) {
    this.loading = true;
    this.currentPage = page;
    // console.log(this.currentPage);
    this.defaultPricesService.getAllPrices(page, 'city').subscribe((res) => {
      this.cityPrices = res.data;
      // console.log(this.cityPrices);
      this.loading = false;
      this.source.load(this.cityPrices);
      this.cityPricesPaginationArgs = { id: 'pagination', ...res.pagination };
    });
  }
  updatePrice() {
    this.editeMode = true;
    // this.getCities()
  }
  onPriceChange(price: any, event: any,name:any) {
    // // console.log(price);
    const index= this.cityPrices.findIndex(item=>item.id===price.id)
    if(name==='default_reqular_cities'){
      // // console.log(index);
      this.cityPrices[index][name]= event.target.value;
    }else if(name==='default_stat_cities'){
      this.cityPrices[index][name]= parseFloat(event.target.value);
    }
    else if(name==="default_super_stat_cities"){
      this.cityPrices[index][name]= parseFloat(event.target.value);

    }
    else{
      this.cityPrices[index][name]= parseFloat(event.target.value);

    }
    // console.log(this.cityPrices);
  }
  submitCityPrice(page: any) {
    // this.create = false;
    this.editeMode = false;
    const newDataArray = this.cityPrices.map(item => ({
      id:item.id,
      city_id:item.city_id,
      default_reqular_cities:item.default_reqular_cities,
      default_stat_cities:item.default_stat_cities,
      default_super_stat_cities:item.default_super_stat_cities,
      default_next_day_cities:item.default_next_day_cities,
      default_reqular_miles:item.default_reqular_miles,
      default_stat_miles:item.default_stat_miles,
      default_super_stat_miles:item.default_super_stat_miles,
      default_next_day_miles:item.default_next_day_miles,
      // postal_code:item.postal_code,
      type:item.type
    }));
    const form = {
      // type: 'city',
      data: newDataArray,
    }
    // console.log(form);
    this.defaultPricesService.createPrice(form).subscribe({
      next: (res) => {
        // console.log(res);
        this.toaster.showSuccess('Changes Saved');
        this.getList(page);
      },
      error: (err) => {
        this.toaster.showDanger(err.message);
        // console.log(err);
      }
    })
    // this.priceService.updatePrice(form, this.companyId).subscribe({
    //   next: (res) => {
    //     this.getList(1);
    //     this.toaster.showSuccess('Changes Saved');
    //   },
    //   error: (err) => {
    //     this.toaster.showDanger(err.message);
    //   },
    // });
  }
  onCreateConfirm(event: any) {
    this.loading = true;
    let newPrice = {
      postal_code: event.newData.postal_code,
      default_reqular_cities: event.newData.default_reqular_cities,
      default_stat_cities: event.newData.default_stat_cities,
      default_super_stat_cities: event.newData.default_super_stat_cities,
      default_next_day_cities: event.newData.default_next_day_cities,
    };

    this.defaultPricesService.createPrice(newPrice).subscribe(
      (res) => {
        this.getList(1);
        this.toaster.showSuccess('Default price Created!');
        event.confirm.reject();
      },
      (err) => {
        event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }
  confirmCreateSchedule(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog);
  }
  confirmUpdateSchedule(event: any, dialog: TemplateRef<any>): void {
    // console.log(event);
    this.id = event.data.id;
    this.postal_code = event.data.postal_code;
    this.default_reqular_cities = event.data.default_reqular_cities;
    this.default_stat_cities = event.data.default_stat_cities;
    this.default_super_stat_cities = event.data.default_super_stat_cities;
    this.default_next_day_cities = event.data.default_next_day_cities;
    this.dialogService.open(dialog);
  }
  onEditConfirm(event: any) {
    this.loading = true;

    let updatedPrice = {
      id: event.newData.id,
      postal_code: event.newData.postal_code,
      default_reqular_cities: event.newData.default_reqular_cities,
      default_stat_cities: event.newData.default_stat_cities,
      default_super_stat_cities: event.newData.default_super_stat_cities,
      default_next_day_cities: event.newData.default_next_day_cities,
    };
    // console.log(updatedPrice);
    this.defaultPricesService.createPrice(updatedPrice).subscribe(
      (res) => {
        this.getList(this.cityPricesPaginationArgs.currentPage);
        this.toaster.showSuccess('Price updated!');
      },
      (err) => {
        event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }
  getAddressData() {
    if (this.postalCode)
      this.postalCodeService
        .getAddressData(this.postalCode)
        .subscribe((res) => {
          if (res) {

            this.pinPosition = { lat: res.latitude, lng: res.longitude };
            this.postalCodeAdded = true;
            this.showPostalCodeAlert = false;
            this.city = res.city;
            this.state = res.state;
            this.state_code = res.state_code;
            this.postal_code = res.postal_code;
          } else {
            this.toasterService.showDanger(
              'Invalid postalcode try anothor one'
            );
            this.postalCodeAdded = false;
          }

          this.postalCode = null;
        });
  }

  onPostalcodeChange() {
    this.showPostalcodeError = !this.isPostalCodeNumber();
  }

  isPostalCodeNumber() {
    if (this.postalCode) {
      let isNumber =
        !isNaN(parseFloat(`${this.postalCode}`)) && !isNaN(this.postalCode - 0);

      return isNumber;
    }
    return false;
  }
  addPostal() {
    const payload = {
      city: this.city,
      state: this.state,
      state_code: this.state_code,
      postal_code: this.postal_code,
    }
    this.defaultPricesService.storeCity(payload).subscribe({
      next: (res) => {
        // console.log(res);
        this.toaster.showSuccess('Postal Code Added!');
        this.city = '';
        this.state = '';
        this.postal_code = '';
        this.getList(1);
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message);

        // console.log(err);
      }

    });
  }
  updatePostal() {
    this.loading = true;

    let updatedPrice = {
      id: this.id,
      postal_code: this.postal_code,
      default_reqular_cities: this.default_reqular_cities,
      default_stat_cities: this.default_stat_cities,
      default_super_stat_cities: this.default_super_stat_cities,
      default_next_day_cities: this.default_next_day_cities,
    };

    this.defaultPricesService.createPrice(updatedPrice).subscribe(
      (res) => {
        this.getList(this.cityPricesPaginationArgs.currentPage);
        this.toaster.showSuccess('Price updated!');
      },
      (err) => {
        // event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }
  // setPinPosition(pinPosition: any) {
  //   this.setContollerValue('lat', `${pinPosition.lat}`);
  //   this.setContollerValue('long', `${pinPosition.lng}`);
  // }
}
