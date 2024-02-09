import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-market-place-page',
  templateUrl: './market-place-page.component.html',
  styleUrls: ['./market-place-page.component.scss'],
})
export class MarketPlacePageComponent {
  subscriptions: Subscription[] = [];
  allProducts!: Product[];
  pagination!: any;
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts(1);
  }

  getProducts(page: number) {
    this.loading = true;
    this.subscriptions.push(
      this.productService.getAllProducts(page).subscribe({
        next: (res) => {
          this.allProducts = res.data;
          this.pagination = res.pagination;
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) subscription.unsubscribe();
  }
}
