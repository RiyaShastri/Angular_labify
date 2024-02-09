import { City } from "./city.model";

export type Driver = {
  id: number;
  name: string;
  email: string;
  password_value: string;
  phone: string;
  price:number;
  type_payment:string;
  cities: City[];
};
