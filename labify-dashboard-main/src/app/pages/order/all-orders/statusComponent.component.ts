import { Component, Input } from "@angular/core";
import { retry } from "rxjs";

@Component({
  selector: "ngx-icon-renderer",
  template: `
  <div class="mr-2" [ngClass]="getStatusClass(value)">{{ value }}</div>
`,
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent {
  @Input() value!: string;

  getStatusClass(status: string): string {
    // Define your custom CSS classes based on status
    switch (status) {
      case "pickedup":
        return "bg-pickedup";
      case "delivered":
        return "bg-delivered";
      case 'Cancelled':
        return 'bg-cancelled';
      default:
        return ""; // Use a default class if the status is not recognized
    }
  }
}
