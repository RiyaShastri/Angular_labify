export type DriverName = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders_count: number;
  current_location: {
    lat: number;
    lng: number;
  };
};
