import { Component, OnInit } from '@angular/core';
import { DoctorService } from './../../../../core/services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CompanyService } from '../../../../core/services/company.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit{

  constructor(
    private doctorService: DoctorService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService) {
    this.route.params.subscribe(
      params => {
        this.id = params['id'];
      }
    )
  }

  id:any;
  doctor: any = {};

  ngOnInit(): void {
    this.getDoctor();

  }
  getDoctor() {
    this.doctorService.getDoctorById(this.id).subscribe({
      next: (res) => {
        // this.createDoctorForm.setValue({
        //   first_name: res.data.first_name,
        //   last_name:res.data.last_name ,
        //   phone: res.data.phone,
        //   email: res.data.email,
        //   user_id: ''
        // });
        this.doctor = res.data
      },
      error: (error) => {
      }
    })
  }
  cancel() {
    this.router.navigate(['/basic-maintenance','address-points'])
  }

}
