import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormManage } from 'src/app/core/classes/form-manage';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-create-account-manager',
  templateUrl: './create-account-manager.component.html',
  styleUrls: ['./create-account-manager.component.scss'],
})
export class CreateAccountManagerComponent extends FormManage {
  userForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  roles!: Role[];

  constructor(
    private toasterService: ToasterService,
    private userService: UsersService,
    private router: Router,
    private rolesService: RolesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initUserForm();
    this.getAccountManagerRole();
  }

  initUserForm() {
    this.userForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        // username: new FormControl(''),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        password_confirmation: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
      },
      [this.matchFields('password', 'password_confirmation')]
    );

    this.setForm(this.userForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.userService.createUser(this.FormValue).subscribe(
        (res) => {
          this.toasterService.showSuccess('Account manager created successfully');
          this.goBack();
        },
        (err) => {
          this.loading = false;
          let errors = err.error.errors;
          for (let error in errors) {
            this.toasterService.showDanger(errors[error]);
          }
        }
      );
    } else this.markAllFeildsTouched();
  }

  getAccountManagerRole() {
    this.rolesService.getAllRoles().subscribe((roles) => {
      for (let role of roles) {
        if (role.name === 'account_manager') {
          this.setContollerValue('role', role.id);
          break;
        }
      }
    });
  }

  goBack() {
    return this.router.navigate(['/basic-maintenance/account-managers']);
  }
}
