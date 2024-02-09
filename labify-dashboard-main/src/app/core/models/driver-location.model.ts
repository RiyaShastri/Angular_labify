export type DriverLocation = {
  id: number;
  name: string;
  phone: string;
  email: string;
  orders_count: number;
  points: { lat: number; lng: number }[];
};
