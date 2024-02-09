import { Component, ViewEncapsulation } from '@angular/core';
import SwiperCore, { SwiperOptions, Autoplay, Pagination } from 'swiper';

@Component({
  selector: 'app-warehouse-page',
  templateUrl: './warehouse-page.component.html',
  styleUrls: ['./warehouse-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WarehousePageComponent {
  swiperConfig!: SwiperOptions;

  ngOnInit(): void {
    SwiperCore.use([Pagination, Autoplay]);

    this.swiperConfig = {
      slidesPerView: 3,
      grabCursor: true,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: false,
    };
  }
}
