import type { AdvertisementItem } from "./item-types";
import { readFeatureValue, toText } from "./card-values";
import { formatCardPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";

export function readCardPricing(
  item: AdvertisementItem,
  category: string,
  formCode: string,
  projectMinMeterPrice: unknown,
  projectMaxMeterPrice: unknown,
  builderShare?: string,
) {
  const rentPrice =
    readFeatureValue(item, ["rent_price", "rentPrice", "اجاره", "اجاره ماهانه"]) ?? item.rent_price;
  const mortgagePrice =
    readFeatureValue(item, ["mortgage_price", "mortgagePrice", "رهن", "ودیعه"]) ??
    item.mortgage_price;
  const minPrice = readFeatureValue(item, ["min_price", "minPrice", "حداقل قیمت"]);
  const maxPrice = readFeatureValue(item, ["max_price", "maxPrice", "حداکثر قیمت"]);
  const normalDailyPrice =
    readFeatureValue(item, [
      "normal_daily_price",
      "normalDailyPrice",
      "قیمت عادی روزانه",
      "daily_price",
      "dailyPrice",
    ]) ??
    item.normal_daily_price ??
    minPrice;
  const weekendDailyPrice =
    readFeatureValue(item, ["weekend_daily_price", "weekendDailyPrice", "قیمت آخر هفته"]) ??
    maxPrice;
  const isRentForm = formCode.startsWith("rent-") || category.includes("اجاره");
  const isDailyForm = formCode.startsWith("daily-") || category.includes("روزانه");
  const isPartnership = formCode.includes("partnership") || category.includes("مشارکت");
  const isPresale =
    formCode.includes("presale") ||
    formCode === "presale-special" ||
    category.includes("پیش فروش") ||
    category.includes("پیشفروش") ||
    category.includes("project-presale");
  let pricePrimary = formatPrice(isPresale ? (projectMinMeterPrice ?? item.price) : item.price);
  let priceSecondary =
    isPresale && projectMaxMeterPrice !== undefined ? formatPrice(projectMaxMeterPrice) : "";
  let priceLabelPrimary = isPresale ? "قیمت متری:" : toText(item.price_label);
  let priceLabelSecondary =
    isPresale && projectMaxMeterPrice !== undefined ? "حداکثر قیمت متری" : "";
  if (isPartnership) {
    priceLabelPrimary = "درصد مشارکت:";
    const cleanShare = (builderShare || "").replace(/[%٪]/g, "").trim();
    pricePrimary = cleanShare
      ? cleanShare.endsWith("درصد")
        ? cleanShare
        : `${cleanShare} درصد`
      : item.price
        ? formatPrice(item.price)
        : "توافقی";
    priceSecondary = "";
  } else if (isPresale) {
    priceLabelPrimary = "قیمت متری:";
    pricePrimary = formatPrice(projectMinMeterPrice ?? item.price);
    if (
      projectMaxMeterPrice !== undefined &&
      String(projectMaxMeterPrice) !== String(projectMinMeterPrice ?? item.price)
    ) {
      priceSecondary = formatPrice(projectMaxMeterPrice);
    }
  } else if (isDailyForm && (normalDailyPrice || weekendDailyPrice || item.price)) {
    priceLabelPrimary = "قیمت";
    const startPrice = normalDailyPrice || item.price;
    const endPrice = weekendDailyPrice;
    pricePrimary = formatPrice(startPrice);
    if (endPrice && String(endPrice) !== String(startPrice)) {
      priceSecondary = formatPrice(endPrice);
    }
  } else if (isRentForm && (rentPrice || mortgagePrice)) {
    priceLabelPrimary = "اجاره:";
    pricePrimary = formatPrice(rentPrice || 0);
    priceLabelSecondary = "رهن:";
    priceSecondary = formatPrice(mortgagePrice || 0);
  }
  return { pricePrimary, priceSecondary, priceLabelPrimary, priceLabelSecondary };
}
