import { Component } from '@angular/core';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  styleUrls: ['./update-address.component.scss']
})
export class UpdateAddressComponent {
  companyId!: number;

  constructor() {}

  ngOnInit(): void {
  }

}
