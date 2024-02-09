import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  appContainer = document.getElementById('app-container');

  constructor(private modalService: NgbModal, private location: Location) {
    this.modalService.activeInstances.subscribe((ai) => {
      if (!this.modalService.hasOpenModals()) {
        this.appContainer?.classList.remove('blur');
      }
    });

    window.onpopstate = (e) => {
      if (this.modalService.hasOpenModals()) history.go(1);
    };
  }

  openPopup(content: any, options?: NgbModalOptions) {
    this.modalService.open(content, options);
    this.appContainer?.classList.add('blur');
  }

  closePopups() {
    this.modalService.dismissAll();
  }
}
