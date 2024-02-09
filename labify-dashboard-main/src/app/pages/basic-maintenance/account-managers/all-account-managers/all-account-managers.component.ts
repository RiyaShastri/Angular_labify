import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { AccountManager } from 'src/app/core/models/account-manager.model';
import { Driver } from 'src/app/core/models/driver.model';
import { AccountManagerService } from 'src/app/core/services/account-manager.service';
import { DriversService } from 'src/app/core/services/drivers.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-all-account-managers',
  templateUrl: './all-account-managers.component.html',
  styleUrls: ['./all-account-managers.component.scss'],
})
export class AllAccountManagersComponent {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: AccountManager[];

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
      // username: {
      //   title: 'Username',
      //   type: 'string',
      // },
      email: {
        title: 'Email',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
      },
    },
  };

  deleteAccountManagerId!: number;
  paginationArgs!: PaginatePipeArgs;

  constructor(
    private accountManagersService: AccountManagerService,
    private router: Router,
    private dialogService: NbDialogService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getAccountManagers(1);
  }

  getAccountManagers(page: number) {
    this.loading = true;
    this.accountManagersService.getAllAccountManagers(page).subscribe((res) => {
      this.data = res.data;
      this.paginationArgs = { ...res.pagination, id: 'pagination' };
      this.source.load(this.data);
      this.loading = false;
    });
  }

  confirmDeleteAccountManager(event: any, dialog: TemplateRef<any>): void {
    this.deleteAccountManagerId = event.data.id;
    this.dialogService.open(dialog);
  }

  deleteAccountManager() {
    this.usersService
      .deleteUser(this.deleteAccountManagerId)
      .subscribe((res) => {
        this.getAccountManagers(
          this.paginationArgs.currentPage ? +this.paginationArgs.currentPage : 1
        );
      });
  }

  editAccountManager(event: any): void {
    this.router.navigate([
      '/basic-maintenance/account-managers/account-manager-details',
      event.data.id,
    ]);
  }

  storeNewAccountManager() {
    this.router.navigate([
      '/basic-maintenance/account-managers/store-account-manager',
    ]);
  }
}
