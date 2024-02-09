export type DispatchDriverDetails = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders: DispatchOrder[];
};

export type DispatchOrder = {
  order_id: number;
  order_code: string;
  service?: string;
  pickup_address: string;
  delivery_address: string;
  pickup_address_name: string;
  delivery_address_name: string;
  pickup: {
    lat: number;
    lng: number;
    status?: string;
  };
  delivery: {
    lat: number;
    lng: number;
    status?: string;
  };
  color: string;
};

//

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
  color?: string;
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
