import { Component, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  addToCart(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  buyNow(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
