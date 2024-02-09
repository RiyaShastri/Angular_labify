import { Component, OnInit, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router } from "@angular/router";
import { DoctorService } from "../../../../core/services/doctor.service";
import { NbDialogService } from "@nebular/theme";
import { ToasterService } from "../../../../core/services/toaster.service";
import { CompanyService } from "../../../../core/services/company.service";

@Component({
  selector: 'app-all-address',
  templateUrl: './all-address.component.html',
  styleUrls: ['./all-address.component.scss']
})
export class AllAddressComponent implements OnInit{
  settings = {
    mode: "external",
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
      name: {
        title: "Name",
        type: "string",
      },
      email: {
        title: "E-mail",
        type: "string",
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();
  data!: any[];
  doctorId!: number;
  selectedCompany!: number;

  constructor(
    private service: DoctorService,
    private dialogService: NbDialogService,
    private router: Router,
    private toaster: ToasterService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
  }

  getDoctors(companyId: number) {
    this.service.getAllDoctors(companyId).subscribe({
      next: (res) => {
        this.data = res.data;
        this.source.load(this.data);
      },
      error: (error) => {
      },
    });
  }

  confirmDeleteDoctor(event: any, dialog: TemplateRef<any>): void {
    this.doctorId = event.data.id;
    this.dialogService.open(dialog);
  }

  onDeleteConfirm(): void {
    this.service.deleteDoctor(this.doctorId).subscribe({
      next: (res) => {
        this.getDoctors(this.selectedCompany);
        this.toaster.showSuccess("Doctor Deleted!");
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message);
      },
    });
  }

  onEditeConfirm(event:any): void {
    this.router.navigate(['/basic-maintenance/address-points', 'address-details', event.data.id])
  }

  onSaveConfirm(event:any) {
    event.confirm.resolve();
  }

  saveDoctor() {
    this.router.navigate(['/basic-maintenance/address-points','create-address'])
  }

}
