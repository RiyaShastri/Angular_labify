import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { CompanyAddressService } from '../../../../../core/services/company-address.service';
import { CompanyService } from '../../../../../core/services/company.service';
import { DoctorAddressService } from '../../../../../core/services/doctor-address.service';
import { CompanyName } from 'src/app/core/models/company-names.model';
import {
  USER_KEY,
  USER_ROLE,
  USER_TYPE,
} from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { PaginatePipeArgs } from 'ngx-pagination';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-doctor-address',
  templateUrl: './doctor-address.component.html',
  styleUrls: ['./doctor-address.component.scss'],
})
export class DoctorAddressComponent implements OnInit {
  selectedCompany!: number;
  // source: LocalDataSource = new LocalDataSource();
  source2: LocalDataSource = new LocalDataSource();
  // source: ServerDataSource ;

  data!: any[];
  paginationArgs!: PaginatePipeArgs;
  settings = {
    // pager: {
    //   display: false,
    // },
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
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      name: {
        title: 'Name',
        // type: 'string',
        filter: {
          type: 'search',
          config: {
            search: {
              data: this.data,
              searchFields: 'name',
              titleField: 'name',
            },
          },
        },
      },
      address: {
        title: 'Address',
        type: 'string',
      },
      room_floor: {
        title: 'Floor',
        type: 'string',
      },
      postal_code: {
        title: 'Postalcode',
        type: 'string',
      },
      city: {
        title: 'City',
        type: 'string',
      },
      state: {
        title: 'State',
        type: 'string',
      },
    },
  };

  doctorId!: number;
  deleteAddressId!: number;
  data2: any;

  constructor(
    private doctorAddressService: DoctorAddressService,
    private companyService: CompanyService,
    private router: Router,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private http: HttpClient
  ) {}

  user!: any;
  role!: any;
  user_type!: any;
  allCompanies!: CompanyName[];

  ngOnInit(): void {
    this.doctorId = +this.router.url.split('/')[4];
    this.user_type = this.storageService.getLocalStorageValue(USER_TYPE);
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    if (this.user_type === 'admin' || this.user_type === 'user-admin') {
      this.role ='admin';
    } else {
      this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    }
    if (this.role === 'company' || this.role === 'CUSTOMER SERVICE') {
      this.onCompanySelect(this.user.id);
    } else {
      this.companyService.getAllCompanyNames().subscribe((res) => {
        this.allCompanies = res;
        // this.onCompanySelect(
        //   this.doctorAddressService.getSelectedCompanyId()
        //     ? this.doctorAddressService.getSelectedCompanyId()
        //     : this.allCompanies[0].id
        // );
        // console.log(this.allCompanies);
      });
    }
  }

  onCompanySelect(companyId: any) {
    this.selectedCompany = companyId;
    this.doctorAddressService.setSelectedCompanyId(this.selectedCompany);
    // this.getAddresses(1);
    this.getAddressesWithPage();
  }

  // getAddresses(page: number) {
  //   this.doctorAddressService
  //     .getAllAddressesByCompanyId(this.selectedCompany, page)
  //     .subscribe((res) => {
  //       this.data = res.data;
  //       this.paginationArgs = { ...res.pagination, id: 'pagination' };
  //       // console.log(this.paginationArgs);

  //       this.data = this.data.map((address) => {
  //         return {
  //           ...address,
  //           city: address.city.city,
  //           state: address.state.state,
  //         };
  //       });
  //       this.source.load(this.data);
  //       this.getAddressesWithPage();
  //       // this.source = this.data;
  //     });
  // }
  getAddressesWithPage() {
    this.doctorAddressService
      .getAllAddressesByCompanyIdCustom(this.selectedCompany, 0, 1)
      .subscribe((res) => {
        this.data2 = res.data;
        // console.log(this.paginationArgs);

        this.data2 = this.data2.map((address: any) => {
          return {
            ...address,
            city: address.city.city,
            state: address.state.state,
          };
        });
        console.log(this.data2);
        // this.source.load(this.data);
        this.source2 = this.data2;
      });
  }
  confirmDeleteAddress(event: any, dialog: TemplateRef<any>): void {
    this.deleteAddressId = event.data.id;
    this.dialogService.open(dialog);
  }

  deleteAddress() {
    this.doctorAddressService
      .deleteAddress(this.deleteAddressId)
      .subscribe((res) => {
        // this.getAddresses(1);
        this.getAddressesWithPage();
      });
  }

  editAddress(event: any): void {
    // console.log(event.data.id);
    this.router.navigate([
      `/basic-maintenance/address-points/edit-address/${event.data.id}`,
    ]);
  }

  storeNewAddress() {
    this.router.navigate([`/basic-maintenance/address-points/store-address`]);
  }
}
