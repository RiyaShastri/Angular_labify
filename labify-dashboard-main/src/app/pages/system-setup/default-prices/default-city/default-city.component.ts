import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { DefaultPricesService } from 'src/app/core/services/default-prices.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-default-city',
  templateUrl: './default-city.component.html',
  styleUrls: ['./default-city.component.scss']
})
export class DefaultCityComponent {
  settings = {
    mode: 'inline',
    actions: {
      delete: false,
      add:false,
    },
    pager: {
      display: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createDefaultButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmcreateDefault: false,
      add:false,
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
      default_reqular_price_new_city: {
        title: 'Reqular',
        type: 'string',
      },
      default_stat_new_city: {
        title: 'Stat',
        type: 'string',
      },
      default_super_stat_new_city: {
        title: 'Super stat',
        type: 'string',
      },
      default_next_day_new_city: {
        title: 'Next day',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  scheduleId: any;
  loading = false;
  data!: any[];
  paginationArgs!: PaginatePipeArgs;

  constructor(
    private dialogService: NbDialogService,
    private defaultPricesService: DefaultPricesService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getList(1);
  }

  getList(page: any) {
    this.loading = true;
    this.defaultPricesService.getDefaultCityPrice().subscribe((res)=>{
      // console.log(res);
      if(!res.data){
        // console.log("data empty");
        let newPrice = {
          default_reqular_price_new_city:10 ,
          default_stat_new_city: 20,
          default_super_stat_new_city:30 ,
          default_next_day_new_city:40,
        };
        this.defaultPricesService.createDefault( newPrice).subscribe(
          (res) => {
            this.getList(1);
            // console.log(res);
            this.loading = false;

          },
          (err) => {
            this.loading = false;
          }
        );
      }else{
        // console.log(res);
      this.data=[{
        id:res.data.id,
        default_reqular_price_new_city: res.data.default_reqular_price_new_city,
        default_stat_new_city: res.data.default_stat_new_city,
        default_super_stat_new_city: res.data.default_super_stat_new_city,
        default_next_day_new_city: res.data.default_next_day_new_city
      }];
      this.loading = false;
      this.source.load(this.data);
      }
    })
  }
  dataIsEmpty(data: any): boolean {
    return Object.keys(data).length === 0;
  }
  oncreateDefaultConfirm(event: any) {
    this.loading = true;

    let newPrice = {
      postal_code: event.newData.postal_code,
      default_reqular_price_new_city: event.newData.default_reqular_price_new_city,
      default_stat_new_city: event.newData.default_stat_new_city,
      default_super_stat_new_city: event.newData.default_super_stat_new_city,
      default_next_day_new_city: event.newData.default_next_day_new_city,
    };

    this.defaultPricesService.createDefault(newPrice).subscribe(
      (res) => {
        this.getList(1);
        this.toaster.showSuccess('Default price createDefaultd!');
        event.confirm.reject();
      },
      (err) => {
        event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }

  onEditConfirm(event: any) {
    this.loading = true;

    let updatedPrice = {
      id: event.newData.id,
      postal_code: event.newData.postal_code,
      default_reqular_price_new_city: event.newData.default_reqular_price_new_city,
      default_stat_new_city: event.newData.default_stat_new_city,
      default_super_stat_new_city: event.newData.default_super_stat_new_city,
      default_next_day_new_city: event.newData.default_next_day_new_city,
    };

    this.defaultPricesService.createDefault(updatedPrice).subscribe(
      (res) => {
        this.getList(1);
        this.toaster.showSuccess('Price updated!');
        this.loading = false;

      },
      (err) => {
        event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }
}
