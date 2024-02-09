import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Driver } from 'src/app/core/models/driver.model';
import { DriversService } from 'src/app/core/services/drivers.service';

@Component({
  selector: 'app-all-drivers',
  templateUrl: './all-drivers.component.html',
  styleUrls: ['./all-drivers.component.scss'],
})
export class AllDriversComponent implements OnInit {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: Driver[];
  allDrivers: any;
  customCoulmns: any = {
    id: {
      title: 'Id',
      type: 'number',
      editable: false,
      addable: false,
    },
    name: {
      title: 'Name',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
    phone: {
      title: 'Phone',
      type: 'string',
    },
    password_value: {
      title: 'Password',
      type: 'string',
    },
  }
  settings = {
    mode: 'external',
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
      confirmCreate: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: this.customCoulmns,
  };
  first = 0;

  rows = 10;
  cols : any[]= [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'email' },
    { field: 'phone', header: 'phone' },
    { field: 'password_value', header: 'password_value' }
  ];;
  savedColumns: any;
  filteredCustomColumns = {};
  _selectedColumns!: any[];
  deleteDriverId!: number;
  selectedKeys: string[] = [];
  constructor(
    private driversService: DriversService,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    const savedColumns = localStorage.getItem("colsDriver");
    if (savedColumns) {
      this._selectedColumns = JSON.parse(savedColumns);
    } else {
      this._selectedColumns = this.cols;
    }
    this.getDrivers();
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.allDrivers ? this.first === this.allDrivers.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.allDrivers ? this.first === 0 : true;
  }

  getDrivers() {
    this.loading = true;
    this.driversService.getAllDrivers().subscribe((res) => {
      this.data = res;
      this.allDrivers = res;
      // console.log(this.allDrivers);
      this.source.load(this.data);
      this.loading = false;

    });
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    // this._selectedColumns = this.cols.filter((col) => val.includes(col));
    this._selectedColumns = val;
    localStorage.setItem("colsDriver", JSON.stringify(this._selectedColumns));
    if (JSON.stringify(val) !== JSON.stringify(this._selectedColumns)) {
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
      // console.log(this._selectedColumns);
    }
    // const filteredArray = this.filterArrayByKeys(this._selectedColumns, this.allDrivers);
    // this.filteredCustomColumns = this.filterObjectByKeys(this._selectedColumns, this.customCoulmns);
    // this.settings.columns = Object.fromEntries(
    //   this.cols.map((col) => [
    //     col.field,
    //     {
    //       title: col.header,
    //       type: 'string',
    //       hide: !val.includes(col),
    //     },
    //   ])
    // );
    // Refresh the table
    // this.source.refresh();
    // // console.log(this.filteredCustomColumns);
    // this.source.load(filteredArray);
    // // console.log(filteredArray);
  }
  filterArrayByKeys(arr1: any[], arr2: any[]) {
    return arr2.map((obj2) => {
      const newObj: any = {};
      arr1.forEach((keyObj) => {
        const key = keyObj.field;
        if (obj2.hasOwnProperty(key)) {
          newObj[key] = obj2[key];
        }
      });
      return newObj;
    });
  }
  filterObjectByKeys(keysToKeep: any[], obj: any) {
    const newObj: any = {};
    keysToKeep.forEach((keyObj: any) => {
      const key = keyObj.field;
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }
  saveSelectedColumnsToLocalStorage() {
    localStorage.setItem("colsDriver", JSON.stringify(this.selectedColumns));
  }
  confirmDeleteDrivers(event: any, dialog: TemplateRef<any>): void {
    this.deleteDriverId = event.id;
    this.dialogService.open(dialog);
  }

  deleteDriver() {
    this.driversService.deleteDriver(this.deleteDriverId).subscribe((res) => {
      this.getDrivers();
    });
  }

  editDrivers(event: any) {
    // console.log(event);
    this.router.navigate([
      '/basic-maintenance/drivers',
      'update-driver',
      event.data.id,
    ]);
  }

  storeNewDriver() {
    this.router.navigate(['/basic-maintenance/drivers/store-driver']);
  }
}
