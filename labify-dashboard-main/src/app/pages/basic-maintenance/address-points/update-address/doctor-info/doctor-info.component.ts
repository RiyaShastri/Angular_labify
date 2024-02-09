import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormManage } from "../../../../../core/classes/form-manage";
import { CompanyService } from "../../../../../core/services/company.service";
import { DoctorService } from "../../../../../core/services/doctor.service";
import { ToasterService } from "../../../../../core/services/toaster.service";

@Component({
  selector: "ngx-doctor-info",
  templateUrl: "./doctor-info.component.html",
  styleUrls: ["./doctor-info.component.scss"],
})
export class DoctorInfoComponent extends FormManage implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {
    super();
    // TODO: 8
    // this.selectedCompany_id = this.companyService.getSelectedCompany().value;
  }
  // selectedCompany_id;
  doctor: any = {};
  createDoctorForm!: FormGroup;
  loading = false;
  id:any;
  ngOnInit() {
    // this.id = parseInt(this.route.snapshot.paraMap.get('id'))
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.createDoctorForm = new FormGroup({
      name: new FormControl("", Validators.required),
      // phone: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),

      user_id: new FormControl(""),
    });
    this.setForm(this.createDoctorForm);
    this.getDoctor();
  }
  onSubmit() {
    // TODO: id
    this.createDoctorForm.patchValue({ user_id: 1 });
    if (this.isFormValid) {
      this.loading = true;
      this.doctorService.editeDoctor(this.id, this.FormValue).subscribe(
        (res) => {
          this.loading = false;
          this.resetForm();
          this.toaster.showSuccess("Your message sent successfully");
    this.router.navigate(['/basic-maintenance','address-points'])
    // this.router.navigate(["/pages/doctors", "doctors-table"]);
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

  getDoctor() {
    this.doctorService.getDoctorById(this.id).subscribe({
      next: (res) => {
        // console.log(res);
        this.createDoctorForm.setValue({
          name: res.data.name,
          // phone: res.data.phone,
          email: res.data.email,
          user_id: "",
        });
      },
      error: (error) => {
      },
    });
  }
  cancel() {
    this.router.navigate(['/basic-maintenance/address-points'])
  }
}
