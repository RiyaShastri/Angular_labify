export type Order = {
  id: number;
  code: string;
  grand_total: number;
  payment_type: string;
  order_status: string;
  items: number;
};
