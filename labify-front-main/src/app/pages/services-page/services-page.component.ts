import { Component, ViewEncapsulation } from '@angular/core';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicesPageComponent {
  swiperConfig!: SwiperOptions;

  ngOnInit(): void {
    SwiperCore.use([Pagination, Autoplay]);

    this.swiperConfig = {
      slidesPerView: 1,
      grabCursor: true,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    };
  }
}
