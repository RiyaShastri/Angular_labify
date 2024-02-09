import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private router: Router) {}

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  scrollToSection(sectionId: string) {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView();
    }, 0);
  }
}
