import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserAuthData } from '../../models/user-data.model';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userData!: UserAuthData | undefined;
  cartLength!: number;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscribeIsLoggedIn();
    this.subscribeUserData();
  }

  subscribeIsLoggedIn() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) this.userData = this.authService.getUserFromStorage();
      if (isLoggedIn) this.subscribeCartLength();
    });
  }

  subscribeCartLength() {
    this.cartService.cartLength$.subscribe((length) => {
      this.cartLength = length;
      console.log(this.cartLength);
    });
  }

  subscribeUserData() {
    this.profileService.userData$.subscribe((userData) => {
      this.userData = userData;
    });
  }

  openNav(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end', scroll: true });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  scrollToContact() {
    let contact = document.getElementById('contact');
    contact?.scrollIntoView();
  }

  scrollToContactFromMobile() {
    setTimeout(() => {
      this.scrollToContact();
    }, 0);
  }

  login() {
    this.authService.openAuthPopup();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
