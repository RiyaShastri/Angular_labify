import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'labify-front';
  @ViewChild('goToTopBtn') scrollToTopBtn!: ElementRef;
  showContact = true;

  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit() {
    if (this.router.url.includes('career') || this.router.url.includes('privacy-policy')) this.showContact = false;

    this.router.events.pipe(map((ev) => ev as NavigationEnd)).subscribe(() => {
      if (this.router.url.includes('career') || this.router.url.includes('privacy-policy')) this.showContact = false;
      else this.showContact = true;
    });
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(map((ev) => ev as NavigationStart))
      .subscribe((route) => {
        this.modalService.dismissAll();
      });

    window.addEventListener('scroll', () => {
      const scrollToTopBtn = this.scrollToTopBtn.nativeElement;
      if (window.scrollY > 100) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });
  }

  scrollToTop() {
    window.scroll({ top: 0 });
  }
}
