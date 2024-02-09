import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from 'src/app/core/classes/form-manage';
import { CompanyName } from 'src/app/core/models/company-names.model';
import { Role } from 'src/app/core/models/role.model';
import { User } from 'src/app/core/models/user.model';
import { AccountManagerService } from 'src/app/core/services/account-manager.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-account-manager-details',
  templateUrl: './account-manager-details.component.html',
  styleUrls: ['./account-manager-details.component.scss'],
})
export class AccountManagerDetailsComponent extends FormManage {
  userForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  roles!: Role[];
  accountManagerId!: number;
  user!: User;
  allCompanies!: CompanyName[];
  selectedCompanies: number[] = [];
  assignCompanyLoading = false;

  constructor(
    private toasterService: ToasterService,
    private userService: UsersService,
    private router: Router,
    private rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private accountManagerService: AccountManagerService,
    private companyService: CompanyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.accountManagerId = params['accountManagerId'];
      this.accountManagerService
        .getAccountManagerById(this.accountManagerId)
        .subscribe((res) => {
          for (let company of res.data.companies)
            this.selectedCompanies.push(company.id);
        });

      this.userService.getUserById(this.accountManagerId).subscribe((res) => {
        this.user = res;
        this.initUserForm();
      });
    });

    this.getAllCompanies();
  }

  initUserForm() {
    this.rolesService.getAllRoles().subscribe((roles) => {
      this.roles = roles;
      let accountManagerRoleId!: number;
      for (let role of this.roles) {
        if (role.name === this.user.role) {
          accountManagerRoleId = role.id;
          break;
        }
      }

      this.userForm = new FormGroup(
        {
          name: new FormControl(this.user.name),
          username: new FormControl(this.user.username),
          phone: new FormControl(this.user.phone),
          email: new FormControl(this.user.email, Validators.email),
          password: new FormControl(''),
          password_confirmation: new FormControl(''),
          role: new FormControl(accountManagerRoleId),
        },
        [this.matchFields('password', 'password_confirmation')]
      );

      this.setForm(this.userForm);
    });
  }

  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.userService
        .updateUser(this.accountManagerId, this.FormValue)
        .subscribe(
          (res) => {
            this.toasterService.showSuccess(
              'Account manager data updated successfully'
            );
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

  getAllCompanies() {
    return this.companyService.getAllCompanyNames().subscribe((res) => {
      this.allCompanies = res;
    });
  }

  toggleCompany(company: any) {
    let index = this.selectedCompanies.indexOf(company.id);
    if (index !== -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(company.id);
    }
  }

  updateAssignedCompanies() {
    this.assignCompanyLoading = true;
    this.accountManagerService
      .updateAssignedCompanies(this.accountManagerId, this.selectedCompanies)
      .subscribe(
        (res) => {
          this.assignCompanyLoading = false;
          this.toasterService.showSuccess('Assigned companies updated');
        },
        (err) => {
          this.assignCompanyLoading = false;
          let errors = err.error.errors;
          for (let error in errors) {
            this.toasterService.showDanger(errors[error]);
          }
        }
      );
  }

  goBack() {
    return this.router.navigate(['/basic-maintenance/account-managers']);
  }
}
