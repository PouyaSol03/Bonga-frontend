export type AdvertisementCheckoutPaymentMethodCode =
  "free_quota" | "gateway" | "package_credit" | "wallet";

export type AgencyAdvertisementCheckoutPaymentMethodCode =
  "ad_credit" | "by_consultant" | "free_quota" | "gateway" | "wallet";

export type SubmitAdvertisementCheckoutPayload = {
  advertiseId: string;
  discount_code?: string;
  items: string[];
  paymentMethod: AdvertisementCheckoutPaymentMethodCode;
};

export type SubmitAdvertisementCheckoutResult = {
  paymentUrl: string | null;
  response: unknown;
};

export type SubmitAgencyAdvertisementCheckoutPayload = {
  advertiseId: string;
  consultantId?: string;
  discount_code?: string;
  items: string[];
  paymentMethod: AgencyAdvertisementCheckoutPaymentMethodCode;
};
