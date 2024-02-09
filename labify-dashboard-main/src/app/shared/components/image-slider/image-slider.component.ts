import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Input,
} from "@angular/core";
// core version + navigation, pagination modules:
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  SwiperOptions,
} from "swiper"; // import Swiper and modules styles
// import 'swiper/css/bundle';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: "ngx-image-slider",
  templateUrl: "./image-slider.component.html",
  styleUrls: ["./image-slider.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ImageSliderComponent implements OnInit {
  @Input() imgList: any;
  @Input() order_id: any;


  gallerySwiper: SwiperOptions = {
    // spaceBetween: 24,
    // speed: 500,
    grabCursor: true,
    // loop: true,
    navigation: {
      nextEl: ".gallery-button-next",
      prevEl: ".gallery-button-prev",
    },
    pagination: {
      type: "fraction",
      el: ".swiper-pagination",
    },
    direction: "horizontal",
    roundLengths: true,
  };
  constructor(private orderService:OrderService) {}
  ngOnInit() {
    SwiperCore.use([Navigation, Autoplay, Pagination]);
  }
  onDelete(item: any) {
    const index = this.imgList.indexOf(item);
    if (index !== -1) {
      this.imgList.splice(index, 1);
      this.orderService.deleteImage(item.order_id,item.id).subscribe((res)=>{
        // console.log(res);
      })
    }
    // console.log(item);
  }


}
