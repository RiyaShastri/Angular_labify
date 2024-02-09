export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  slug: string;
  price: number;
  image: string;
  currency: string;
  availability: string;
  price_after_discount: number;
  have_discount: boolean;
  tag: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
};
