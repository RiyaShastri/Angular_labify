import { Address } from './address.model';

export type UserAuthData = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  phone: string;
  type: number;
  email: string;
  image: string;
  token: string;
  user_type: 'Customer';
  addresses: Address[];
};
