import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { DefaultPricesService } from 'src/app/core/services/default-prices.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-mile',
  templateUrl: './mile.component.html',
  styleUrls: ['./mile.component.scss'],
})
export class MileComponent {
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
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: false,
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
      default_reqular_miles: {
        title: 'Reqular',
        type: 'string',
      },
      default_stat_miles: {
        title: 'Stat',
        type: 'string',
      },
      default_super_stat_miles: {
        title: 'Super stat',
        type: 'string',
      },
      default_next_day_miles: {
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
    this.defaultPricesService.getAllPrices(page, 'mile').subscribe((res) => {
      this.data = res.data;
      if(this.data.length===0){
        // console.log("data empty");
        let newPrice = {

          default_reqular_miles:10 ,
          default_stat_miles: 20,
          default_super_stat_miles:30 ,
          default_next_day_miles:40,
        };
        this.defaultPricesService.createMilePrice( newPrice).subscribe(
          (res) => {
            this.getList(1);
          },
          (err) => {
            this.loading = false;
          }
        );
      }
      this.loading = false;
      this.source.load(this.data);
      this.paginationArgs = { id: 'pagination', ...res.pagination };
    });
  }

  onCreateConfirm(event: any) {
    this.loading = true;

    let newPrice = {
      postal_code: event.newData.postal_code,
      default_reqular_miles: event.newData.default_reqular_miles,
      default_stat_miles: event.newData.default_stat_miles,
      default_super_stat_miles: event.newData.default_super_stat_miles,
      default_next_day_miles: event.newData.default_next_day_miles,
    };

    this.defaultPricesService.createMilePrice(newPrice).subscribe(
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

  onEditConfirm(event: any) {
    this.loading = true;

    let updatedPrice = {
      id: event.newData.id,
      postal_code: event.newData.postal_code,
      default_reqular_miles: event.newData.default_reqular_miles,
      default_stat_miles: event.newData.default_stat_miles,
      default_super_stat_miles: event.newData.default_super_stat_miles,
      default_next_day_miles: event.newData.default_next_day_miles,
    };

    this.defaultPricesService.createMilePrice(updatedPrice).subscribe(
      (res) => {
        this.getList(this.paginationArgs.currentPage);
        this.toaster.showSuccess('Price updated!');
      },
      (err) => {
        event.confirm.reject();
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      }
    );
  }
}
