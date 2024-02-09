import { Product } from "./product.model";

export type Variant = {
  id: number;
  product: Product;
  additional_price: number;
  dimension_id: number;
  color_id: number;
  image: string;
  color: {
    id: number;
    name: string;
    code: string;
  };
  dimension: {
    id: number;
    dimension: string;
  };
  images: string[];
}
