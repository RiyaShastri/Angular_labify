import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { PaginatePipeArgs } from 'ngx-pagination';
import { User } from 'src/app/core/models/user.model';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss'],
})
export class AllUsersComponent {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: User[];
  settings = {
    mode: 'external',
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
      type: {
        title: 'Type',
        type: 'string',
      },
      role: {
        title: 'Role',
        type: 'string',
      },
    },
  };

  deleteUserId!: number;
  paginationArgs!: PaginatePipeArgs;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(page: number = 1) {
    this.loading = true;
    this.usersService.getAllUsers(page).subscribe((res) => {
      this.data = res.data;
      this.source.load(this.data);
      this.paginationArgs = { ...res.pagination, id: 'pagination' };
      // console.log(this.data);

      // console.log(this.paginationArgs);

      this.loading = false;
    });
  }

  confirmDeleteUsers(event: any, dialog: TemplateRef<any>): void {
    this.deleteUserId = event.data.id;
    this.dialogService.open(dialog);
  }

  deleteUser() {
    this.usersService.deleteUser(this.deleteUserId).subscribe((res) => {
      this.getUsers();
    });
  }

  editusers(event: any): void {
    this.router.navigate(['/system-setup/users/update-user/', event.data.id]);
  }

  storeNewUser() {
    this.router.navigate(['/system-setup/users/create-user']);
  }
}
