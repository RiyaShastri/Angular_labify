import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CompanyPriceService } from '../../../../core/services/company-price.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DefaultPricesService } from 'src/app/core/services/default-prices.service';

@Component({
  selector: 'app-surcharge',
  templateUrl: './surcharge.component.html',
  styleUrls: ['./surcharge.component.scss'],
})
export class SurchargeComponent implements OnInit {
  settings = {
    mode: 'inline', // Set the mode to 'inline'
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
      confirmSave: true, // For inline mode, use confirmSave instead of confirmCreate
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      surcharge_id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      min: {
        title: 'Min',
        type: 'string',
        filterable: true,
      },
      max: {
        title: 'Max',
        type: 'string',
      },
      percentage: {
        title: 'percentage',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  currentSurcharge!: any;

  constructor(
    private dialogService: NbDialogService,
    private priceService: CompanyPriceService,
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private defaultPriceService: DefaultPricesService
  ) {
    this.route.params.subscribe((params) => {
      this.companyId = params['id'];
    });
  }
  companyId: any;
  surchargeId: any;

  ngOnInit() {
    this.getList();
    this.getCurrentSurchargeValue();
  }

  getCurrentSurchargeValue() {
    this.defaultPriceService
      .getCurrentSurcharge()
      .subscribe((res) => (this.currentSurcharge = res));
  }

  getList() {
    this.priceService.getAllSurcharge(this.companyId).subscribe({
      next: (res) => {
        // console.log(res);
        this.source.load(res.sort(this.compareMinMax));
      },
      error: (error) => {
        // console.log(error);
      },
    });
  }
  onSaveConfirm(event: any) {
    // // console.log(event.newData);
    // // console.log(event);
    // this.priceService.updateSurcharge(event.newData).subscribe(
    //   (res) => {
    //     event.confirm.resolve();
    //     this.toaster.showSuccess('Surcharge item Created!');
    //   },
    //   (err) => {
    //     event.confirm.reject();
    //     this.toaster.showDanger(err.error.message);
    //   });
  }
  onCreateConfirm(event: any) {
    // console.log(event.newData);
    // // console.log(event.source.data);
    const newArr = event.source.data;
    if (event.newData.min && event.newData.max && event.newData.percentage) {
      // // console.log("not empty");
      newArr.push(event.newData);
      // // console.log(newArr);
      const payload = {
        user_id: this.companyId,
        data: newArr,
      };
      // console.log(payload);
      this.priceService.updateSurcharge(payload).subscribe(
        (res) => {
          // // console.log(res);
          this.getList();
          // event.confirm.reject();
          this.toaster.showSuccess('Surcharge item Created!');
        },
        (err) => {
          event.confirm.reject();
          this.toaster.showDanger(err.error.message);
        }
      );
    } else {
      this.toaster.showDanger('Enter All Values');
    }
  }
  confirmDeleteSurcharge(event: any, dialog: TemplateRef<any>): void {
    // console.log(event);
    this.surchargeId = event.data.surcharge_id;
    this.dialogService.open(dialog);
  }
  onDelete() {
    // // console.log(event.data.surcharge_id);
    this.priceService.deleteSurcharge(this.surchargeId).subscribe({
      next: (res) => {
        this.getList();
        this.toaster.showSuccess('Surcharge Deleted successfully');
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message);
      },
    });
  }
  compareMinMax(a: any, b: any): number {
    const minA = parseFloat(a.min);
    const minB = parseFloat(b.min);
    const maxA = parseFloat(a.max);
    const maxB = parseFloat(b.max);
    if (minA < minB) {
      return -1;
    } else if (minA > minB) {
      return 1;
    } else {
      // If "min" values are equal, compare based on "max" values
      if (maxA < maxB) {
        return -1;
      } else if (maxA > maxB) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}
