export type DipatchAllOrder = {
  order_id: number;
  order_code: number;
  pickup: {
    address: string;
  };
  status: {
    status: string;
  };
  delivery: {
    address: string;
  };
};
