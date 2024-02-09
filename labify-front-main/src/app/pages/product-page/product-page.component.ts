import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductDetails } from 'src/app/core/models/product-details.model';
import { Product } from 'src/app/core/models/product.model';
import { Variant } from 'src/app/core/models/variant.model';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductService } from 'src/app/core/services/products.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import SwiperCore, { SwiperOptions, Autoplay, Navigation } from 'swiper';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  product!: ProductDetails;
  selectedVariant!: Variant;
  productSwiperConfig!: SwiperOptions;
  similarProduct!: Product[];
  loading = false;

  addingToCart = false;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['productId']) {
        this.getProductDetails(params['productId']);
      }
    });

    SwiperCore.use([Navigation, Autoplay]);

    this.productSwiperConfig = {
      slidesPerView: 3,
      spaceBetween: 20,
      direction: 'vertical',
      grabCursor: true,
      navigation: {
        nextEl: '.product-nav-btn-next',
        prevEl: '.product-nav-btn-prev',
      },
    };
  }

  getProductDetails(productId: number) {
    this.loading = true;
    this.subscriptions.push(
      this.productService.getProductById(productId).subscribe({
        next: (res) => {
          this.product = res;
          console.log(this.product);
          this.selectedVariant = this.product.variants[0];
          this.getSimilarProducts();
          this.loading = false;
        },
      })
    );
  }

  getSimilarProducts() {
    this.subscriptions.push(
      this.productService
        .getSimilarProducts(this.product.category.id)
        .subscribe({
          next: (res) => {
            this.similarProduct = res;
          },
        })
    );
  }

  addToCart() {
    this.addingToCart = true;
    this.subscriptions.push(
      this.cartService.addToCart(this.selectedVariant.id).subscribe({
        next: () => {
          this.addingToCart = false;
          this.toaster.showSuccess('Product added to your cart');
        },
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
