export type PricingCardPlan = {
  discount: number;
  id: string;
  items?: {
    label: string;
    value: number;
  }[];
  price: number;
  priceAfterDiscount: number;
  title: string;
};

export type MobilePaymentTab = "packages" | "panel";

export type MobileCreditPlan = {
  benefits?: string[];
  currentPrice: number | string;
  discount: number;
  giftBenefits?: string[];
  id: string;
  originalPrice: number | string;
  selected?: boolean;
  title: string;
};
