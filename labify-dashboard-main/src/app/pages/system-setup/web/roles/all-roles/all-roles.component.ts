import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
  selector: 'app-all-roles',
  templateUrl: './all-roles.component.html',
  styleUrls: ['./all-roles.component.scss'],
})
export class AllRolesComponent {
  loading = false;
  source: LocalDataSource = new LocalDataSource();
  data!: Role[];
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
      permissions: {
        title: 'Permissions',
        type: 'string',
      },
    },
  };

  deleteRoleId!: number;

  constructor(
    private RolesService: RolesService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.loading = true;
    this.RolesService.getAllRoles().subscribe((res) => {
      this.data = res;
      this.data = this.data.map((role) => {
        let permissions: any = [];

        for (let i = 0; i < role.permissions.length; i++) {
          if (i >= 4) {
            permissions.push(`... and ${role.permissions.length - i - 1} more`);
            break;
          }
          permissions.push(role.permissions[i].name);
        }

        return {
          id: role.id,
          name: role.name,
          permissions: permissions.join(', '),
        };
      });

      this.source.load(this.data);
      this.loading = false;
    });
  }

  confirmDeleteRoles(event: any, dialog: TemplateRef<any>): void {
    this.deleteRoleId = event.data.id;
    this.dialogService.open(dialog);
  }

  deleteRole() {
    this.RolesService.deleteRole(this.deleteRoleId).subscribe((res) => {
      this.getRoles();
    });
  }

  editRoles(event: any): void {
    this.router.navigate(['/system-setup/roles/update-role/', event.data.id]);
  }

  storeNewRole() {
    this.router.navigate(['/system-setup/roles/create-role']);
  }
}
