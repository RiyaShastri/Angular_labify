import { Variant } from './variant.model';

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  currency: string;
  availability: string;
  price_after_discount: number;
  have_discount: boolean;
  variants: Variant[];
  tag: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}
