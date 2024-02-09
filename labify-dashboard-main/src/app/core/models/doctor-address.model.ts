export type DoctorAddress = {
  id: number;
  name: string;
  address: string;
  address_2:string;
  lat: string;
  long: string;
  postal_code: string;
  room_floor: string;
  suit: string;
  notes: string;
  phone:string;
  ext:string;
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    image: string;
  };
  city: {
    id: number;
    city: string;
    postal_code: string;
  };
  state: {
    id: number;
    state: string;
    state_code: string;
  };
};
