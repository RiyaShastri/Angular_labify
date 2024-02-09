import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../core/services/company.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../../core/services/toaster.service';
import { PriceLinkComponent } from './priceLink.component';

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.scss']
})
export class AllCompaniesComponent implements OnInit {

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
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
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,

      },
      name: {
        title: 'Name',
        type: 'string',
      },



      email: {
        title: 'E-mail',
        type: 'string',
      },
      // phone: {
      //   title: 'phone',
      //   type: 'string',
      // },
      type: {
        title: "Price type",
        type: "string",
      },
      // Price: {
      //   title: 'Price',
      //   type: 'custom',
      //   renderComponent: PriceLinkComponent, // Use the custom component for rendering
      //   filter: false,
      //   sort: false,
      //   width: '10%',
      // },
    },
  };
  companyId: any;
  source: LocalDataSource = new LocalDataSource();
  data!: any[];
  constructor(
    private service: CompanyService,
    http: HttpClient,
    private router: Router,
    private dialogService: NbDialogService,
    private toaster: ToasterService,) {
    this.getCompanies();
  }
  ngOnInit() {
    this.getCompanies();

  }
  getCompanies() {
    this.service.getData().subscribe({
      next: (res) => {
        this.data = [];
        if (Array.isArray(res.data)) {
          // If the response data is an array, assign it directly to the dataArray
          this.data = res.data;
        } else {
          // If the response data is an object, push it to the dataArray
          this.data.push(res.data);
        }
        this.source.load(this.data);
      },
      error: (error) => { }
    })
  }
  confirmDeleteCompany(event: any, dialog: TemplateRef<any>): void {
    this.companyId = event.data.id;
    this.dialogService.open(dialog);

  }
  onDeleteConfirm(): void {
    this.service.deleteCompany(this.companyId).subscribe({
      next: (res) => {
        this.getCompanies();
        this.toaster.showSuccess("Company Deleted!")
      },
      error: (err) => {
        this.toaster.showDanger(err.error.message)
      }
    });
  }
  onEditeConfirm(event: any): void {
    this.router.navigate(['/basic-maintenance/customers', 'update-company', event.data.id])
  }
  onSaveConfirm(event: any) {
    event.confirm.resolve();

  }
  saveCompany() {
    this.router.navigate(['/basic-maintenance/customers','create-company'])

  }
  navigatePrice(id: any) {
    this.router.navigate(['/basic-maintenance/customers', 'price', id])

  }
}
