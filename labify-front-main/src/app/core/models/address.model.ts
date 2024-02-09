export type Address = {
  id: number;
  district: {
    id: number;
    name: string;

    city: {
      id: number;
      name: string;
    };
  };
  postal_code: number;
  address: string;
};
