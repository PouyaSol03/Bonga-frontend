import type {
  AdvertisementCheckout,
  AdvertisementCheckoutItem,
} from "../../../advertisements/api/advertisement.service";
import { toSafeNumber } from "./checkoutNumbers";
export const checkoutItems = ["advertise_publish"];
export const unavailableAfterPublishWarning = "این قابلیت پس از انتشار آگهی فعال می‌شود.";
export const unavailableAfterPaidPublishWarning =
  "بعد از انتشار آگهی این امکان قابل استفاده خواهد بود";
export const consultantUpgradeDisabledWarning =
  "امکانات ارتقای آگهی هنگام «ارسال به مشاور» قابل انتخاب نیست.";

export const disabledUpgradeOptions = [
  {
    description: "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.",
    id: "refresh",
    title: "بروزرسانی",
  },
  {
    description:
      "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.",
    id: "special",
    title: "ویژه",
  },
  {
    description: "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.",
    id: "renew",
    title: "تمدید",
  },
  {
    description: "آگهی بروزرسانی و ویژه به صورت همزمان فعال می‌شود.",
    id: "refresh-special",
    title: "بروزرسانی و ویژه",
  },
] as const;

export type UpgradeOptionId = (typeof disabledUpgradeOptions)[number]["id"];

export const upgradeProductByOption: Record<UpgradeOptionId, string> = {
  refresh: "advertise_update",
  special: "advertise_special",
  renew: "advertise_extend",
  "refresh-special": "advertise_update_special",
};

export function resolveUpgradeCheckoutItem(
  optionId: UpgradeOptionId,
  items: AdvertisementCheckoutItem[],
): AdvertisementCheckoutItem | undefined {
  return items.find((item) => item.product === upgradeProductByOption[optionId]);
}

export function getUpgradeDescription(optionId: UpgradeOptionId, item?: AdvertisementCheckoutItem) {
  if (item?.description?.trim()) return item.description.trim();

  const days = Math.max(toSafeNumber(item?.duration_days), 0);
  const months = Math.max(toSafeNumber(item?.duration_months), 0);

  if (optionId === "refresh") {
    return days > 0
      ? `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.`
      : "آگهی شما به مدت ۳ روز، هر ۶ ساعت در اولویت نمایش قرار می‌گیرد.";
  }
  if (optionId === "special") {
    return days > 0
      ? `آگهی شما به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.`
      : "آگهی شما به مدت ۳ روز با برچسب ویژه، برای جلب توجه بیشتر و دیده شدن بهتر نمایش داده می‌شود.";
  }
  if (optionId === "renew") {
    return months > 0
      ? `آگهی شما پیش از انقضا، برای ${new Intl.NumberFormat("fa-IR").format(months)} ماه دیگر تمدید می‌شود.`
      : "آگهی شما پیش از انقضا، برای یک ماه دیگر تمدید می‌شود.";
  }
  if (optionId === "refresh-special" && days > 0) {
    return `بروزرسانی و ویژه به مدت ${new Intl.NumberFormat("fa-IR").format(days)} روز همزمان فعال می‌شوند.`;
  }

  return disabledUpgradeOptions.find((option) => option.id === optionId)?.description ?? "";
}

export function getUpgradeCheckoutItems(checkout: AdvertisementCheckout | undefined) {
  return (checkout?.items ?? []).filter(
    (item) => item.product !== "advertise_publish" && !/publish|ثبت|انتشار/i.test(item.product),
  );
}
