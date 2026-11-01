import type { PackageItem } from "../../packages/api/package.service";
import type { MobileCreditPlan, PricingCardPlan } from "./types";

export function getCreditItems(plan: PackageItem) {
  return [
    { label: "آگهی", value: plan.ad_credit },
    { label: "ویژه", value: plan.special_credit },
    { label: "بروزرسانی", value: plan.renew_credit },
  ].filter((item) => item.value > 0);
}

export function mapPanelPlan(plan: PackageItem): PricingCardPlan {
  return {
    discount: plan.discount_percent,
    id: plan.id,
    price: plan.real_price,
    priceAfterDiscount: plan.final_price,
    title: plan.title,
  };
}

export function mapBundlePlan(plan: PackageItem): PricingCardPlan {
  return {
    discount: plan.discount_percent,
    id: plan.id,
    items: getCreditItems(plan),
    price: plan.real_price,
    priceAfterDiscount: plan.final_price,
    title: plan.title,
  };
}

export function toFaNumber(value: number | string) {
  if (typeof value === "number") {
    return value.toLocaleString("fa-IR");
  }

  return String(value);
}

export function getGiftBenefits(plan: PackageItem) {
  return getCreditItems(plan).map(
    (item) => `${item.value.toLocaleString("fa-IR")} ${item.label}`,
  );
}

export function mapMobilePanelPlan(
  plan: PackageItem,
  index: number,
  hasManagerGift: boolean,
): MobileCreditPlan {
  const giftBenefits = hasManagerGift ? getGiftBenefits(plan) : [];

  return {
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    giftBenefits,
    id: String(plan.id),
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}

export function mapMobilePackagePlan(plan: PackageItem, index: number): MobileCreditPlan {
  return {
    benefits: getCreditItems(plan).map(
      (item) => `${item.value.toLocaleString("fa-IR")} اعتبار ${item.label}`,
    ),
    currentPrice: plan.final_price,
    discount: plan.discount_percent,
    id: String(plan.id),
    originalPrice: plan.real_price,
    selected: index === 0,
    title: plan.title,
  };
}
