export type Order = {
  order_id: number;
  order_code: number;
  status_type: string;
  service: string;
  pieces: number;
  pickup_address_name: string;
  delivery_address_name: string;
  driver_name: string;
  pickup_name: string;
  pickup_date: string;
  pickup_time: string;
  delivery_name: string;
  delivery_date: string;
  delivery_time: string;
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
    address: string;
    lat: string;
    long: string;
    address_name: string;
    name: string;
  };
  delivery: {
    date: string;
    time: string;
    address_id: number;
    address: string;
    lat: string;
    long: string;
    address_name: string;
    name: string;
  };
  driver: {
    id: string;
    name: string;
  };
};
