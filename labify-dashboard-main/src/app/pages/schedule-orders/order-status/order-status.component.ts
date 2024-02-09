import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { OrderService } from '../../../core/services/order.service';
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  SwiperOptions,
} from "swiper";
@Component({
  selector: 'ngx-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],

})
export class OrderStatusComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private orderService: OrderService,
  ) { }
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
  orderId:any;
  order:any;
  allOrder:any;
  ngOnInit(): void {
    this.getOrderData();
    SwiperCore.use([Navigation, Autoplay, Pagination]);

  }
  getOrderData() {
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params["id"];
      if (this.orderId)
        this.orderService.getOrderById(this.orderId).subscribe((res) => {
          // console.log( res.data.status);
          // console.log( res.data);

          // this.order = res.data.status[0];
          this.allOrder=res.data;
        });
    });
  }
}
