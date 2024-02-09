import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManage } from '../../../../core/classes/form-manage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss'],
})
export class UpdateCompanyComponent extends FormManage implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {
    super();
  }
  currentTab: 'Client-Address' | 'Client-info' | 'Price' = 'Client-info';
  onTabChange(event: any) {
    this.currentTab = event.tabTitle;
  }
  ngOnInit() {
    // this.id = parseInt(this.route.snapshot.paraMap.get('id'))
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.getCompany();
    });

    // this.getCompany();
  }

  id: any;
  company: any = {}; // Object to store the company data
  UpdateCompanyForm!: FormGroup;
  UpdatePassword!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  loadingPass = false;
  order_toggel: boolean;
  pickup_toggel: boolean;
  delivery_toggel: boolean;
  order_notification: boolean;
  pickup_notification: boolean;
  delivery_notification: boolean;
  editePass = false;
  onSubmit() {
    if (this.isFormValid) {
      this.loading = true;
      this.companyService.editeCompany(this.id, this.FormValue).subscribe(
        (res) => {
          this.loading = false;
          this.resetForm();
          this.toaster.showSuccess('Company Updated successfully');
          this.router.navigate(['/basic-maintenance', 'customers']);
        },
        (err) => {
          this.loading = false;
          this.toaster.showDanger(err.error.message);
        }
      );
    } else {
      this.markAllFeildsTouched();
    }
  }
  onPassSubmit(form: any) {
    if (true) {
      this.loadingPass = true;
      this.companyService.editeCompanyPass(form.value, this.id).subscribe(
        (res) => {
          this.loadingPass = false;
          this.resetForm();
          this.toaster.showSuccess('Password Updated successfully');
          this.toggelPass();
        },
        (err) => {
          this.loadingPass = false;
          this.toaster.showDanger(err.error.message);
        }
      );
    } else {
      this.markAllFeildsTouched();
    }
  }
  getCompany() {
    this.companyService.getCompanyById(this.id).subscribe({
      next: (res) => {
        this.company = res.data;
        // this.UpdateCompanyForm.setValue({
        //   name: res.data.name,
        //   email: res.data.email,
        //   type: res.data.type,
        //   order_toggel: res.data.email_order,
        //   pickup_toggel: res.data.email_pickup,
        //   delivery_toggel: res.data.email_delivery,
        //   order_notification: res.data.notification_order,
        //   pickup_notification: res.data.notification_pickup,
        //   delivery_notification: res.data.notification_delivery,
        // });
        this.initForms();
      },
      error: (error) => {},
    });
  }
  initForms() {
    this.UpdateCompanyForm = new FormGroup({
      name: new FormControl(this.company.name, Validators.required),
      email: new FormControl(this.company.email, Validators.required),
      type: new FormControl(this.company.type, Validators.required),
      email_order: new FormControl(this.company.email_order),
      email_pickup: new FormControl(this.company.email_pickup),
      email_delivery: new FormControl(this.company.email_delivery),
      notification_order: new FormControl(this.company.notification_order),
      notification_pickup: new FormControl(this.company.notification_pickup),
      notification_delivery: new FormControl(
        this.company.notification_delivery
      ),
    });
    this.UpdatePassword = new FormGroup(
      {
        user_id: new FormControl(this.id, Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      [this.matchFields('password', 'password_confirmation')]
    );
    this.setForm(this.UpdatePassword);
    this.setForm(this.UpdateCompanyForm);
  }
  cancel() {
    this.router.navigate(['/basic-maintenance', 'customers']);
  }
  toggelPass() {
    this.editePass = !this.editePass;
  }
}
