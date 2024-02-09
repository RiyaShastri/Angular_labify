import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';

import { NbDialogService } from '@nebular/theme';
import { CompanyService } from 'src/app/core/services/company.service';
import { CompanyScheduleService } from 'src/app/core/services/company-schedule.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
  selector: 'ngx-company-address-schedule',
  templateUrl: './company-address-schedule.component.html',
  styleUrls: ['./company-address-schedule.component.scss'],
})
export class CompanyAddressScheduleComponent implements OnInit {
  selectedCompany!: number;
  source: LocalDataSource = new LocalDataSource();
  data!: any[];
  selectedDay!: any;
  selectedUpdateDay!: any;
  settings = {
    mode: 'external',
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
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      day: {
        title: 'Day',
        type: 'string',
      },
      from: {
        title: 'From',
        type: 'string',
      },
      to: {
        title: 'To',
        type: 'string',
      },
    },
  };
  ref!: any;
  scheduleId!: number;
  addressId!: number;
  from!: string;
  to!: string;
  day!: string;
  days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDays: string[] = [];
  constructor(
    private companyScheduleService: CompanyScheduleService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toaster: ToasterService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.addressId = params['addressId'];
      this.getSchedules();
    });
  }
  getSchedules() {
    this.scheduleId = 0;
    this.companyScheduleService
      .getCompanyAllSchedule(this.addressId)
      .subscribe((res) => {
        this.data = res.data;
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
    this.companyScheduleService.deleteSchedule(this.scheduleId).subscribe({
      next: (res) => {
        this.getSchedules();
        this.toaster.showSuccess('Schedule Deleted successfully');
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
      address_company_id: this.addressId,
      schedule_id: this.scheduleId,
    };
    this.companyScheduleService
      .updateSchedule(this.scheduleId, form)
      .subscribe({
        next: (res) => {
          this.toaster.showSuccess('Schedule Updated successfully');
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
    //   from: this.from,
    //   to: this.to,
    //   address_company_id: this.addressId,
    // }
    const payloads = this.selectedDays.map((day, index) => ({
      day: day,
      from: this.from,
      to: this.to,
      address_company_id: this.addressId,
    }));
    // console.log(payloads);
    for (const payload of payloads) {
      this.companyScheduleService.createSchedule(payload).subscribe({
        next: (res) => {
          this.toaster.showSuccess('Schedule Created successfully');
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
    // console.log('index: ' + index);
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
