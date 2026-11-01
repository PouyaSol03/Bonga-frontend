import { formatCardPrice as formatPrice } from "../../../shared/lib/MoneyHandler";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import { readFeatureRaw, toText } from "./featureHelpers";

export interface ResolvedListingPricing {
  builderShare?: string;
  capacity?: string;
  currentStatus?: string;
  priceLabel: string;
  priceSecondary: string;
  priceValue: string;
  projectType?: string;
  totalFloors?: string;
  totalUnits?: string;
}

export function resolveListingPricing(
  item: AdvertisementItem,
  formCode: string,
  category: string,
): ResolvedListingPricing {
  const isDailyForm = formCode.startsWith("daily") || category.includes("روزانه");
  const isRentForm = formCode.startsWith("rent") || category.includes("اجاره");
  const isPartnership = formCode.includes("partnership") || category.includes("مشارکت");
  const isPresale =
    formCode.includes("presale") ||
    formCode === "presale-special" ||
    category.includes("پیش فروش") ||
    category.includes("پیشفروش") ||
    category.includes("project-presale");

  const projectMinMeterPrice = readFeatureRaw(item, [
    "min_meter_price",
    "min_price",
    "meter_price",
    "قیمت هر متر",
    "قیمت متری",
  ]);
  const projectMaxMeterPrice = readFeatureRaw(item, [
    "max_meter_price",
    "max_price",
    "حداکثر قیمت متری",
  ]);

  const builderShareRaw = readFeatureRaw(item, [
    "builder_share",
    "builderShare",
    "builder_share_percent",
    "builderSharePercent",
    "درصد مشارکت",
    "درصد سهم",
    "سهم سازنده",
    "partnership_percent",
  ]);
  const builderShare =
    builderShareRaw !== undefined && builderShareRaw !== null && builderShareRaw !== ""
      ? String(builderShareRaw).includes("٪") || String(builderShareRaw).includes("%")
        ? toText(builderShareRaw)
        : `${toText(builderShareRaw)}٪`
      : undefined;

  const projectType =
    toText(readFeatureRaw(item, ["project_type", "projectType", "نوع پروژه"]), "") || undefined;
  const totalFloorsRaw = readFeatureRaw(item, [
    "project_total_floors",
    "projectTotalFloors",
    "total_floors",
    "totalFloors",
    "تعداد کل طبقات",
    "تعداد طبقات",
  ]);
  const totalFloors =
    totalFloorsRaw !== undefined && totalFloorsRaw !== null && totalFloorsRaw !== ""
      ? String(totalFloorsRaw).includes("طبقه")
        ? toText(totalFloorsRaw)
        : `${toText(totalFloorsRaw)} طبقه`
      : undefined;
  const totalUnitsRaw = readFeatureRaw(item, [
    "project_total_units",
    "projectTotalUnits",
    "total_units",
    "totalUnits",
    "تعداد کل واحد ها",
    "تعداد کل واحدها",
    "تعداد واحدها",
    "تعداد واحد",
  ]);
  const totalUnits =
    totalUnitsRaw !== undefined && totalUnitsRaw !== null && totalUnitsRaw !== ""
      ? String(totalUnitsRaw).includes("واحد")
        ? toText(totalUnitsRaw)
        : `${toText(totalUnitsRaw)} واحد`
      : undefined;
  const currentStatus =
    toText(
      readFeatureRaw(item, [
        "current_status",
        "currentStatus",
        "وضعیت فعلی ملک",
        "وضعیت ملک",
        "وضعیت فعلی",
      ]),
      "",
    ) || undefined;

  let priceLabel = toText(item.price_label, "قیمت");
  let priceValue = formatPrice(
    item.price ?? readFeatureRaw(item, ["price", "total_price", "amount"]),
  );
  let priceSecondary = "";

  if (isPartnership) {
    priceLabel = "درصد مشارکت:";
    priceValue = builderShare || (item.price ? formatPrice(item.price) : "توافقی");
    priceSecondary = "";
  } else if (isPresale) {
    priceLabel = "قیمت متری:";
    priceValue = formatPrice(projectMinMeterPrice ?? item.price);
    if (
      projectMaxMeterPrice !== undefined &&
      String(projectMaxMeterPrice) !== String(projectMinMeterPrice ?? item.price)
    ) {
      priceSecondary = formatPrice(projectMaxMeterPrice);
    }
  } else if (isDailyForm) {
    const normalDailyPrice = readFeatureRaw(item, [
      "normal_daily_price",
      "normalDailyPrice",
      "قیمت عادی روزانه",
      "daily_price",
      "min_price",
    ]);
    const weekendDailyPrice = readFeatureRaw(item, [
      "weekend_daily_price",
      "weekendDailyPrice",
      "قیمت آخر هفته",
      "max_price",
    ]);
    const startPrice = normalDailyPrice ?? item.price;
    const endPrice = weekendDailyPrice;
    priceLabel = "قیمت";
    priceValue = formatPrice(startPrice);
    if (endPrice && String(endPrice) !== String(startPrice)) {
      priceSecondary = formatPrice(endPrice);
    }
  } else if (isRentForm) {
    const rentPrice = readFeatureRaw(item, ["rent_price", "rentPrice", "اجاره", "اجاره ماهانه"]);
    const mortgagePrice = readFeatureRaw(item, ["mortgage_price", "mortgagePrice", "رهن", "ودیعه"]);
    if (rentPrice || mortgagePrice) {
      priceLabel = "اجاره:";
      priceValue = formatPrice(rentPrice || 0);
      priceSecondary = formatPrice(mortgagePrice || 0);
    }
  }

  const capacityRaw = readFeatureRaw(item, [
    "capacity",
    "standard_capacity",
    "standardCapacity",
    "ظرفیت استاندارد",
    "ظرفیت",
  ]);
  const capacity =
    capacityRaw !== undefined && capacityRaw !== null && capacityRaw !== ""
      ? String(capacityRaw).includes("نفر")
        ? toText(capacityRaw)
        : `${toText(capacityRaw)} نفر`
      : undefined;

  return {
    builderShare,
    capacity,
    currentStatus,
    priceLabel,
    priceSecondary,
    priceValue,
    projectType,
    totalFloors,
    totalUnits,
  };
}
