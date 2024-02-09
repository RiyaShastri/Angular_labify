import { Permission } from './permission.model';

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
};
