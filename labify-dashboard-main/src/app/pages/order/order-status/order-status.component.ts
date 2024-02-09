import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster.service';
import { OrderService } from '../../../core/services/order.service';
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  SwiperOptions,
} from 'swiper';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'ngx-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  search_term: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private orderService: OrderService,
    public location: Location
  ) {
    this.user_role = localStorage.getItem('user_role');
    this.isAdmin = this.user_role === '"admin"';
  }
  isAdmin: boolean = false;
  user_role: any;

  gallerySwiper: SwiperOptions = {
    // spaceBetween: 24,
    // speed: 500,
    grabCursor: true,
    // loop: true,
    navigation: {
      nextEl: '.gallery-button-next',
      prevEl: '.gallery-button-prev',
    },
    pagination: {
      type: 'fraction',
      el: '.swiper-pagination',
    },
    direction: 'horizontal',
    roundLengths: true,
  };
  orderId: any;
  order: any;
  allOrder: any;
  pickupImgList: any;
  deliveryImgList: any;
  // selectedFile:any[]=[];
  selectedFile: ImageSnippet;
  selectedFileNew: File[] = [];
  imgLoadin: boolean = false;
  deliveryPiecesLoading: boolean = false;
  pickupPiecesLoading: boolean = false;
  pickup_pieces: number;
  delivery_pieces: number;

  ngOnInit(): void {
    this.getOrderData();
    SwiperCore.use([Navigation, Autoplay, Pagination]);

  }
  getOrderData() {
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = params['id'];
      if (this.orderId)
        this.orderService.getOrderById(this.orderId).subscribe((res) => {
          // console.log( res.data.status);
          // console.log( res.data);

          // this.order = res.data.status[0];
          this.allOrder = res.data;
          this.pickupImgList = this.allOrder.pickup_status?.image_orders;
          this.pickup_pieces = this.allOrder.pickup_status?.pickup_pieces;
          this.delivery_pieces = this.allOrder.delivery_pieces;
          this.deliveryImgList = this.allOrder.delivery_status?.image_orders;
        });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileNew.push(file);
    }
  }
  updatePieces(type: string) {
    if (type === 'pickup') {
      this.pickupPiecesLoading = true;
      const payload = {
        pieces: +this.pickup_pieces,
        id: this.allOrder.pickup_status.id,
      };
      this.orderService.updateStatusPieces(payload).subscribe({
        next: (res) => {
          this.toasterService.showSuccess('Pieces Updateded');
          //  this.getOrderData();
          this.pickupPiecesLoading = false;
        },
        error: (err) => {
          this.toasterService.showDanger('error happened');
          this.pickupPiecesLoading = false;
        },
      });

      console.log(payload);
    } else {
      this.deliveryPiecesLoading = true;
      const payload = {
        pieces: +this.delivery_pieces,
        id: this.allOrder.delivery_status.id,
      };
      this.orderService.updateStatusPieces(payload).subscribe({
        next: (res) => {
          this.toasterService.showSuccess('Pieces Updateded');
          //  this.getOrderData();
          this.deliveryPiecesLoading = false;
        },
        error: (err) => {
          this.toasterService.showDanger('error happened');
          this.deliveryPiecesLoading = false;
        },
      });
      console.log(payload);
    }
  }
  uploadSelectedFile(name: string) {
    if (this.selectedFileNew) {
      // Add the selected file to your list of images
      // this.deliveryImgList.push(this.selectedFile);
      this.imgLoadin = true;

      const payLoad = {
        driver_id: this.allOrder.driver.id,
        status: this.allOrder.order_status,
        images: this.selectedFileNew,
      };

      let formData = new FormData();
      formData.append('driver_id', this.allOrder.driver.id.toString());
      formData.append('status', this.allOrder.order_status.toString());

      // Append the selected file to the formData
      formData.append('images[0]', this.selectedFileNew[0]);

      // Clear the selected file
      // console.log(payLoad);
      this.orderService.updateStatus(this.allOrder.id, formData).subscribe({
        next: (res) => {
          this.toasterService.showSuccess('Image Added');
          this.selectedFileNew = [];
          this.getOrderData();
          this.imgLoadin = false;
        },
        error: (err) => {
          this.toasterService.showDanger('error happened');
          this.selectedFileNew = [];
          this.imgLoadin = false;
        },
      });
      // this.selectedFile = null;
    }
  }
}
