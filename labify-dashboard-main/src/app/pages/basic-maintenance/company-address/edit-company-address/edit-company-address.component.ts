import { Component, OnInit } from "@angular/core";
@Component({
  selector: "ngx-edit-company-address",
  templateUrl: "./edit-company-address.component.html",
  styleUrls: ["./edit-company-address.component.scss"],
})
export class EditCompanyAddressComponent implements OnInit {
  companyId!: number;

  ngOnInit(): void {
  }
}
