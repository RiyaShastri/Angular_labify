import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { DefaultPricesService } from 'src/app/core/services/default-prices.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'app-surcharge',
  templateUrl: './surcharge.component.html',
  styleUrls: ['./surcharge.component.scss'],
})
export class SurchargeComponent {
  settings = {
    mode: 'inline',
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
      min: {
        title: 'Min',
        type: 'string',
      },
      max: {
        title: 'Max',
        type: 'string',
      },
      percentage: {
        title: 'Percentage',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  scheduleId: any;
  loading = false;
  cityPrices!: any[];
  cityPricesPaginationArgs!: PaginatePipeArgs;
  currentSurcharge!: any;

  constructor(
    private dialogService: NbDialogService,
    private defaultPricesService: DefaultPricesService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getList(1);
    this.getCurrentValue();
  }

  getList(page: any) {
    this.loading = true;
    this.defaultPricesService.getAllSurcharge(page).subscribe((res) => {
      this.cityPrices = res.data;
      this.loading = false;
      this.source.load(this.cityPrices);
      this.cityPricesPaginationArgs = { id: 'pagination', ...res.pagination };
    });
  }

  getCurrentValue() {
    this.defaultPricesService
      .getCurrentSurcharge()
      .subscribe((res) => (this.currentSurcharge = res));
  }

  onCreateConfirm(event: any) {
    this.loading = true;

    let newPrice = {
      min: event.newData.min,
      max: event.newData.max,
      percentage: event.newData.percentage,
    };

    this.defaultPricesService.createSurcharge([newPrice]).subscribe(
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
      surcharge_id: event.newData.id,
      min: event.newData.min,
      max: event.newData.max,
      percentage: event.newData.percentage,
    };

    this.defaultPricesService.createSurcharge([updatedPrice]).subscribe(
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
}
