import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, { Autoplay, Navigation, SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  clientsSwiperConfig!: SwiperOptions;
  newsSwiperConfig!: SwiperOptions;

  ngOnInit(): void {
    SwiperCore.use([Navigation, Autoplay]);

    this.clientsSwiperConfig = {
      slidesPerView: 1,
      spaceBetween: 32,
      breakpoints: {
        800: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
      grabCursor: true,
      navigation: {
        nextEl: '.client-nav-btn-next',
        prevEl: '.client-nav-btn-prev',
      },
    };

    this.newsSwiperConfig = {
      slidesPerView: 1,
      spaceBetween: 32,
      autoplay: {
        delay: 3000,
      },
      breakpoints: {
        800: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
        1400: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      },
      grabCursor: true,
    };
  }
}
