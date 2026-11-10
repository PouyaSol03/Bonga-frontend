export type AdvertisementCheckoutItem = {
  available?: boolean;
  available_at?: string | null;
  available_in?: {
    days?: number;
    hours?: number;
    total_seconds?: number;
  } | null;
  credit_cost?: number;
  credit_requirements?: Array<{
    amount?: number;
    credit_type?: "ad_credit" | "special_credit" | "renew_credit" | string;
  }>;
  description?: string | null;
  duration_days?: number | null;
  duration_months?: number | null;
  free_quota?: {
    available?: boolean;
    remaining?: number;
  } | null;
  price?: number;
  product: string;
  title?: string;
  required?: boolean;
  selected?: boolean;
};

export type AdvertisementCheckoutPaymentMethod = {
  action?: string | null;
  balances?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  required_by_type?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  shortage_by_type?: {
    ad_credit?: number;
    special_credit?: number;
    renew_credit?: number;
  };
  available?: boolean;
  balance?: number;
  method: string;
  remaining?: number;
  required?: number;
  shortage?: number;
};

export type AdvertisementCheckout = {
  advertise_id: number | string;
  context?: {
    advertise_status?: number | string;
    agency_id?: number | string | null;
    roles?: string[];
    user_id?: number | string;
  };
  items: AdvertisementCheckoutItem[];
  payment_methods: AdvertisementCheckoutPaymentMethod[];
  state?: string;
  status?: boolean;
  summary: {
    credit_cost?: number;
    items_count?: number;
    payable_amount?: number;
    total_price?: number;
  };
};

export type AdvertisementCheckoutResponse =
  | AdvertisementCheckout
  | {
      data?: AdvertisementCheckout;
      result?: AdvertisementCheckout;
      status?: boolean;
    };
