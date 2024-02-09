import { Injectable } from "@angular/core";
import { NbGlobalPhysicalPosition, NbToastrService } from "@nebular/theme";

@Injectable({
  providedIn: "root",
})
export class ToasterService {
  private positions = NbGlobalPhysicalPosition;

  constructor(private toastrService: NbToastrService) {}

  showSuccess(message: string) {
    let position = this.positions.TOP_RIGHT;
    let status = "success";
    this.toastrService.show(null, message, {
      position,
      status,
    });
  }

  showDanger(message: string) {
    let position = this.positions.TOP_RIGHT;
    let status = "danger";
    this.toastrService.show(null, message, {
      position,
      status,
    });
  }

  showInfo(message: string) {
    let position = this.positions.TOP_RIGHT;
    let status = "info";
    this.toastrService.show(null, message, {
      position,
      status,
    });
  }
}
