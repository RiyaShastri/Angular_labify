import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { CompanyScheduleService } from "../../../../../../core/services/company-schedule.service";
import { CompanyService } from "../../../../../../core/services/company.service";
import { ToasterService } from "../../../../../../core/services/toaster.service";
import { DoctorScheduleService } from "../../../../../../core/services/doctor-schedule.service";

@Component({
  selector: "ngx-doctor-address-schedule",
  templateUrl: "./doctor-address-schedule.component.html",
  styleUrls: ["./doctor-address-schedule.component.scss"],
})
export class DoctorAddressScheduleComponent implements OnInit {
  selectedCompany!: number;
  source: LocalDataSource = new LocalDataSource();
  data!: any[];
  selectedDay:any;
  selectedUpdateDay:any;
  days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
  selectedDays: string[] = [];
  settings = {
    mode: "external",
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
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
        title: "ID",
        type: "number",
        editable: false,
        addable: false,
      },
      day: {
        title: "Day",
        type: "string",
      },
      from: {
        title: "From",
        type: "string",
      },
      to: {
        title: "To",
        type: "string",
      },
    },
  };
  ref:any;
  scheduleId!: number;
  addressId!: number;
  from:any;
  to:any;
  day!: string;

  constructor(
    private doctorScheduleService: DoctorScheduleService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.addressId = params["addressId"];
      this.getSchedules();
    });
  }

  getSchedules() {
    this.scheduleId = 0;
    this.doctorScheduleService
      .getAllDoctorSchedule(this.addressId)
      .subscribe((res) => {
        this.data = res;
        this.source.load(this.data);
      });
  }

  confirmCreateSchedule(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog);
  }

  confirmDeleteSchedule(event: any, dialog: TemplateRef<any>): void {
    this.scheduleId = event.data.id;
    this.dialogService.open(dialog);
  }

  confirmUpdateSchedule(event: any, dialog: TemplateRef<any>): void {
    this.scheduleId = event.data.id;
    this.selectedUpdateDay = event.data.day;
    this.from = event.data.from;
    this.to = event.data.to;
    this.dialogService.open(dialog);
  }

  deleteSchedule() {
    this.doctorScheduleService.deleteSchedule(this.scheduleId).subscribe({
      next: (res) => {
        this.getSchedules();
        this.toaster.showSuccess("Schedule Deleted successfully");
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message);
      },
    });
  }

  updateSchedule() {
    const form = {
      day: this.selectedUpdateDay,
      from: this.from,
      to: this.to,
      address_doctor_id: +this.addressId,
      schedule_id: this.scheduleId,
    };

    this.doctorScheduleService
      .updateDoctorSchedule(form, this.scheduleId)
      .subscribe({
        next: (res) => {
          this.toaster.showSuccess("Schedule Updated successfully");

          this.getSchedules();
        },
        error: (err) => {
          this.toaster.showDanger(err.error.message);
        },
      });
  }

  createSchedule() {
    // const form = {
    //   day: this.selectedDay,
    //   from:this.from,
    //   to: this.to,
    //   address_doctor_id:+this.addressId,
    // };
    const payloads = this.selectedDays.map((day, index) => (
      {
        day: day,
        from: this.from,
        to: this.to,
        address_doctor_id: this.addressId,
      }));
    // console.log(payloads);
    for (const payload of payloads) {
      this.doctorScheduleService.storeDoctorSchedule(payload).subscribe({
        next: (res) => {
          this.toaster.showSuccess("Schedule Created successfully");
          this.getSchedules();
        },
        error: (err) => {
          this.toaster.showDanger(err.error.message);
        },
      });
    }

  }
  toggleDaySelection(day: string): void {
    const index = this.selectedDays.indexOf(day);

    if (index !== -1) {
      // If the day is already selected, remove it from the array
      this.selectedDays.splice(index, 1);
      // console.log(this.selectedDays);
    } else {
      // If the day is not selected, add it to the array
      this.selectedDays.push(day);
      // console.log(this.selectedDays);
    }
  }
}
