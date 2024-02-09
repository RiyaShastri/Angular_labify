import { Component, Input } from "@angular/core";

@Component({
  selector: "ngx-icon-renderer",
  template: `<nb-icon [icon]="getIconName(value)" class="text-danger mr-2"></nb-icon>{{ value }}`,
})
export class IconRendererComponent {
  @Input() value!: string;

  getIconName(serviceType: string): string {
    // You can customize the icon based on the service type
    switch (serviceType) {
      case "super_stat":
        return "flag";
      case "stat":
        return "flag";
      default:
        return ""; // Add a default icon in case the service type is not recognized
    }
  }
}
