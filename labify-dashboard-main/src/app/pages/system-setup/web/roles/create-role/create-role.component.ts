import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/core/models/permission.model';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent {
  allPermissions: Permission[] = [];
  selectedPermissions: number[] = [];
  name!: string;

  constructor(private rolesService: RolesService, private route: Router) {}

  ngOnInit() {
    this.getAllPermissions();
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
      .createRole(this.name, this.selectedPermissions)
      .subscribe((res) => {
        this.route.navigate(['/system-setup/roles']);
      });
  }

  getAllPermissions() {
    this.rolesService.getAllPermissions().subscribe((res) => {
      this.allPermissions = res;
      console.log(res);
    });
  }
}
