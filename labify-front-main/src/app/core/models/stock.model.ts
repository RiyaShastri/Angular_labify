import { Variant } from "./variant.model";

export type Stock = {
  id: number;
  variant_id:number;
  product: string;
  size: number;
  color: string;
  quantity: number;
  variant:Variant;
};
