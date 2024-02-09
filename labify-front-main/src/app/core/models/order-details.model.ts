export type OrderDetails = {
  id: number;
  code: string;
  subtotal: number;
  coupon_price: number;
  grand_total: number;
  payment_status: boolean;
  shipping_price: number;
  payment_type: string;
  order_status: string;
  items: {
    item_id: number;
    quantity: number;
    item_price: number;
    total_item_price: number;
    image: string;
    product_name: string;
    product_slug: string;
    product_description: string;
    category_name: string;
    color_name: string;
    color_code: string;
    dimension: string;
  }[];
};
