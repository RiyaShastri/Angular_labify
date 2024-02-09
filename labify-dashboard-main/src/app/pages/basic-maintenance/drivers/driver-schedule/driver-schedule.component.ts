import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { DriverScheduleService } from 'src/app/core/services/driver-schedule.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CustomInputComponent } from './custom-input.component';
import { CustomSelectComponent } from './custom-select.component';

@Component({
  selector: 'app-driver-schedule',
  templateUrl: './driver-schedule.component.html',
  styleUrls: ['./driver-schedule.component.scss'],
})
export class DriverScheduleComponent {
  settings = {
    mode: 'inline', // Set the mode to 'inline'
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true, // For inline mode, use confirmSave instead of confirmCreate
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'Id',
        type: 'number',
        editable: false,
        addable: false,
      },
      day: {
        title: 'Day',
        type: 'string',
        editor: {
          type: 'custom',
          component: CustomSelectComponent,
        },
      },
      from: {
        title: 'From',
        type: 'string',
        editor: {
          type: 'custom',
          component: CustomInputComponent,
        },
      },
      to: {
        title: 'To',
        type: 'string',
        editor: {
          type: 'custom',
          component: CustomInputComponent,
        },
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();
  driverId: any;
  scheduleId: any;
  loading = false;

  constructor(
    private dialogService: NbDialogService,
    private driverScheduleService: DriverScheduleService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.driverId = params['driverId'];
    });
  }

  ngOnInit() {
    this.getList();
  }



  getList() {
    this.loading = true;
    this.driverScheduleService.getAllSchedules(this.driverId).subscribe({
      next: (res) => {
        // console.log(res);
        if (res.length) this.source.load(res);
        this.loading = false;
      },
      error: (error) => {
        // console.log(error);
        this.loading = false;
      },
    });
  }

  onCreateConfirm(event: any) {
    this.loading = true;
    const schedule: any = [];
    schedule.push({
      from: event.newData.from,
      to: event.newData.to,
      day: event.newData.day,
    });

    this.driverScheduleService
      .updateSchedule(this.driverId, schedule)
      .subscribe(
        (res) => {
          this.getList();
          this.toaster.showSuccess('Schedule item Created!');
          event.confirm.reject();
        },
        (err) => {
          event.confirm.reject();
          this.toaster.showDanger(err.error.message);
          this.loading = false;
        }
      );
  }

  onEditConfirm(event: any) {
    this.loading = true;

    this.driverScheduleService
      .updateSchedule(this.driverId, [
        {
          schedule_id: event.newData.id,
          from: event.newData.from,
          to: event.newData.to,
          day: event.newData.day,
        },
      ])
      .subscribe(
        (res) => {
          this.getList();
          this.toaster.showSuccess('Schedule item updated!');
        },
        (err) => {
          event.confirm.reject();
          this.toaster.showDanger(err.error.message);
          this.loading = false;
        }
      );
  }

  confirmDeleteSchedule(event: any, dialog: TemplateRef<any>): void {
    // console.log(event);
    this.scheduleId = event.data.id;
    this.dialogService.open(dialog);
  }

  onDelete() {
    this.loading = true;
    this.driverScheduleService.deleteSchedule(this.scheduleId).subscribe({
      next: (res) => {
        this.getList();
        this.toaster.showSuccess('Schedule Deleted successfully');
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message);
        this.loading = false;
      },
    });
  }
}
