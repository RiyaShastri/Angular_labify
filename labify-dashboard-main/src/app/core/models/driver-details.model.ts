export type DriverDetails = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders: DriverOrder[];
};

export type DriverOrder = {
  id: number;
  order_code: number;
  pickup: AddressData;
  delivery: AddressData;
  // color?: string;
};

type AddressData = {
  id: number;
  lat: number;
  long: number;
  name: string;
  address: string;
  postal_code: string;
  room_floor: string;
  status: string;
  notes: string;
  user_id: number;
};
