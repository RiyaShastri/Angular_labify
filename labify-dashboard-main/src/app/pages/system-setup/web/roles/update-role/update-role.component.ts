import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/core/models/permission.model';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss'],
})
export class UpdateRoleComponent {
  allPermissions: Permission[] = [];
  selectedPermissions: number[] = [];
  name!: string;
  roleId!: number;

  constructor(
    private rolesService: RolesService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getAllPermissions();
    this.activatedRoute.params.subscribe((params) => {
      this.roleId = params['roleId'];
      if (this.roleId) {
        this.getRoleData();
      }
    });
  }

  getRoleData() {
    this.rolesService.getRoleById(this.roleId).subscribe((res) => {
      this.name = res.name;
      for (let permission of res.permissions) {
        this.selectedPermissions.push(permission.id);
      }
    });
  }

  isSelected(id: number): boolean {
    return this.selectedPermissions.includes(id);
  }

  toggleRole(role: any) {
    let index = this.selectedPermissions.indexOf(role.id);
    if (index !== -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(role.id);
    }
  }

  onSumbit() {
    this.rolesService
      .updateRole(this.roleId, this.name, this.selectedPermissions)
      .subscribe((res) => {
        this.route.navigate(['/system-setup/roles']);
      });
  }

  getAllPermissions() {
    this.rolesService.getAllPermissions().subscribe((res) => {
      this.allPermissions = res;
    });
  }
}
