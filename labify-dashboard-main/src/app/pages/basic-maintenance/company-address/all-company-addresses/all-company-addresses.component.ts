import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyAddressService } from 'src/app/core/services/company-address.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { NbDialogService } from '@nebular/theme';
import { CompanyName } from 'src/app/core/models/company-names.model';
import { USER_KEY, USER_ROLE } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'ngx-all-company-addresses',
  templateUrl: './all-company-addresses.component.html',
  styleUrls: ['./all-company-addresses.component.scss'],
})
export class AllCompanyAddressesComponent implements OnInit {
  selectedCompany!: number;
  source: LocalDataSource = new LocalDataSource();
  loading = false;
  data!: any;
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
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
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

  deleteAddressId!: number;

  constructor(
    private companyAddressService: CompanyAddressService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
  ) { }

  user!: any;
  role!: any;
  allCompanies!: CompanyName[];
  selectedCompanyId!: any;
  id: any;

  ngOnInit(): void {
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);
    if (this.role === 'company') {
      this.onCompanySelect(this.user.id);
    this.selectedCompanyId = this.user.id;

    } else {
      this.route.params.subscribe((params) => {
        this.id = params['id'];
        this.onCompanySelect(this.id)
      });
    }
  }

  onCompanySelect(companyId: any) {
    this.selectedCompanyId = companyId;
    this.companyAddressService.setSelectedCompanyId(this.selectedCompanyId);
    this.getAddresses(companyId);
  }

  getAddresses(id: any) {
    this.loading = true;
    this.companyAddressService.getAllCompanyAddresses(id).subscribe((res) => {
      this.data = res.data;
      // console.log(res);
      this.data = this.data.map((address: any) => {
        return {
          ...address,
          city: address.city.city,
          state: address.state.state,
        };
      });
      this.source.load(this.data);
      this.loading = false;
    });
  }

  confirmDeleteAddress(event: any, dialog: TemplateRef<any>): void {
    this.deleteAddressId = event.data.id;
    this.dialogService.open(dialog);
  }

  deleteAddress() {
    this.companyAddressService
      .deleteAddress(this.deleteAddressId)
      .subscribe((res) => {
this.getAddresses(this.selectedCompanyId)
        this.router
          .navigateByUrl('/RefreshComponent', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['basic-maintenance/addresses']);
          });
      });
  }

  editAddress(event: any): void {
    // console.log(event.data.id);
    this.router.navigate([
      '/basic-maintenance/company-address',
      'edit-company-address',
      event.data.id,
    ]);
  }

  storeNewAddress() {
    this.router.navigate([
      '/basic-maintenance/company-address',
      'store-company-address',
    ]);
  }
}
