import type { AdvertisementItem } from "./item-types";
import { readFeatureValue, toText } from "./card-values";

export function readCardProjectValues(item: AdvertisementItem) {
  const capacityRaw = readFeatureValue(item, [
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
  const starsRaw = readFeatureValue(item, [
    "hotel_stars",
    "hotelStars",
    "ستاره",
    "رتبه بندی اقامتگاه",
  ]);
  const stars =
    starsRaw !== undefined && starsRaw !== null && starsRaw !== ""
      ? String(starsRaw).includes("ستاره")
        ? toText(starsRaw)
        : `${toText(starsRaw)} ستاره`
      : undefined;
  const rentalPeriodRaw = readFeatureValue(item, ["rental_period", "rentalPeriod", "دوره اجاره"]);
  const rentalPeriod =
    rentalPeriodRaw !== undefined && rentalPeriodRaw !== null && rentalPeriodRaw !== ""
      ? toText(rentalPeriodRaw)
      : undefined;
  const projectTypeRaw = readFeatureValue(item, ["project_type", "projectType", "نوع پروژه"]);
  const projectType =
    projectTypeRaw !== undefined && projectTypeRaw !== null && projectTypeRaw !== ""
      ? toText(projectTypeRaw)
      : undefined;
  const totalFloorsRaw = readFeatureValue(item, [
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
  const totalUnitsRaw = readFeatureValue(item, [
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
  const builderShareRaw = readFeatureValue(item, [
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
  const currentStatusRaw = readFeatureValue(item, [
    "current_status",
    "currentStatus",
    "وضعیت فعلی ملک",
    "وضعیت ملک",
    "وضعیت فعلی",
  ]);
  const currentStatus =
    currentStatusRaw !== undefined && currentStatusRaw !== null && currentStatusRaw !== ""
      ? toText(currentStatusRaw)
      : undefined;
  return {
    capacity,
    stars,
    rentalPeriod,
    projectType,
    totalFloors,
    totalUnits,
    builderShare,
    currentStatus,
  };
}
