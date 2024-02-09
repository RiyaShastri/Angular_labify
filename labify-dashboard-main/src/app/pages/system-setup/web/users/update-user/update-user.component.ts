import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from 'src/app/core/classes/form-manage';
import { Role } from 'src/app/core/models/role.model';
import { User } from 'src/app/core/models/user.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent extends FormManage implements OnInit {
  userForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  roles!: Role[];
  userId!: number;
  user!: User;

  constructor(
    private toasterService: ToasterService,
    private userService: UsersService,
    private router: Router,
    private rolesService: RolesService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllRoles();
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params['userId'];
      this.userService.getUserById(this.userId).subscribe((res) => {
        this.user = res;
        // console.log(this.user);

        this.initUserForm();
      });
    });
  }

  getAllRoles() {
    this.rolesService.getAllRoles().subscribe((res) => {
      this.roles = res;
    });
  }

  initUserForm() {
    this.userForm = new FormGroup(
      {
        name: new FormControl(this.user.name),
        username: new FormControl(this.user.username),
        phone: new FormControl(this.user.phone),
        email: new FormControl(this.user.email, Validators.email),
        password: new FormControl(),
        password_confirmation: new FormControl(),
        role: new FormControl(this.user.roles[0].id),
      },
      [this.matchFields('password', 'password_confirmation')]
    );

    this.setForm(this.userForm);
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.userService.updateUser(this.userId, this.FormValue).subscribe(
        (res) => {
          this.toasterService.showSuccess('User updated successfully');
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

  goBack() {
    return this.router.navigate(['/system-setup/users']);
  }
}
