export type CheckoutPayload =
  | {
      payment_type_id: number;
      card_no: number;
      exp_month: number;
      exp_year: number;
      cvc: string;
    }
  | {
      payment_type_id: number;
    };
