export type OrderWithoutDriver = {
  order_id: number;
  order_code: number;
  status_type: string;
  service: string;
  pieces: number;
  pickup_address_name: string;
  delivery_address_name: string;
  pickup_date: string;
  pickup_time: any;
  delivery_name: any;
  delivery_date: string;
  delivery_time: any;
  order_type: string;
  order_date: string;
  customer: string;
  pickup_actual_date: string;
  pickup_actual_time: string;
  deilvery_actual_date: string;
  deilvery_actual_time: string;
  status: {
    status: string;
    date: string;
  };
  pickup: {
    id: number;
    date: string;
    time: string;
    address_id: number;
    address: any;
    address_name: string;
    name: any;
  };
  delivery: {
    date: string;
    time: string;
    address_id: number;
    address: any;
    address_name: string;
    name: any;
  };
  driver: {
    id: string | number;
    name: string;
  };
};
