import { type AdvertisementItem } from "./item-types";

export type AdvertisementShowResponse = {
  data: AdvertisementItem;
  status: boolean;
};

export type AdvertisementDailyViewPoint = {
  count: number;
  date: string;
};

export type AdvertisementDailyViews = {
  data: AdvertisementDailyViewPoint[];
  totalView: number;
};

export type AdvertisementPayment = Record<string, unknown> & {
  amount?: number | string;
  created_at?: string;
  id?: number | string;
  items?: string[];
  method?: string;
  payment_id?: number | string | null;
  payment_method?: string;
  payment_status?: number | string;
  price?: number | string;
  status?: number | string;
};

export type AdvertisementDailyViewsResponse = {
  data?: Array<{
    count?: number | string;
    date?: string;
  }>;
  status?: boolean;
  total_view?: number | string;
};

export type AdvertisementAccountShowResponse =
  | {
      advertise?: AdvertisementItem;
      category?: string;
      data?: AdvertisementItem;
      status?: boolean;
    }
  | AdvertisementItem;

export type AdvertisementCreateResponse =
  | {
      advertise?: AdvertisementItem;
      data?: AdvertisementItem;
      result?: AdvertisementItem;
      status?: boolean;
    }
  | AdvertisementItem;
