import { Component } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  host: {
    class: 'toast-container position-fixed end-0 p-3',
    style: 'z-index: 1200; top: 90px',
  },
})
export class ToasterComponent {
  constructor(public toasterService: ToasterService) {}
}
