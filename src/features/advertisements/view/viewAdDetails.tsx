import { getBuildingInfo } from "../../../shared/lib/handleBuildingInfo";
import type { AdvertisementItem } from "../api/advertisement.service";
import type {
  IconName,
  ViewAdDetails,
} from "./viewAdTypes";
import {
  parseDailyHotelRooms,
  parseProjectDetails,
} from "./details/hotelAndProjectDetails";
import { buildFacilityItems } from "./details/facilityItemsBuilder";
import {
  resolvePricePresentation,
  buildCategoryNeighborhoodLabel,
  readRentConvertible,
  parseHotelStarCount,
} from "./details/advertiserAndPricing";
import {
  toEnglishDigits,
  toPersianNumber as toPersianDigits,
} from "../../../shared/lib/numberUtils";
import { formatDetailPrice as formatPrice } from "../../../shared/lib/MoneyHandler";
import {
  formatAreaDetailValue,
  formatPercentDetailValue,
  isFilledValue,
  getFirstExistingFeatureValue,
  toBooleanLike,
} from "./details/detailFormatters";
import {
  type PropertyPreviewField,
  propertyPreviewFieldsByFormCode,
} from "./details/propertyPreviewFields";
import {
  propertyInfoLabelMap,
  propertyInfoOrder,
  ignoredFeatureLabels,
} from "./details/propertyInfoMaps";
import { formatPublishedAge } from "./details/adMedia";


export type AdvertiserPreview = {
  href: string;
  id: string;
  kind: "agency" | "agent";
  location: string;
  logoUrl?: string;
  name: string;
  rank?: string;
  ratingScore?: string;
  subtitle: string;
};

export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(toEnglishDigits(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function toText(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) {
    return toPersianDigits(value);
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("fa-IR").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "دارد" : "ندارد";
  }

  if (Array.isArray(value)) {
    const text: string = value
      .map((item) => toText(item))
      .filter(Boolean)
      .join("، ");

    return text || fallback;
  }

  return fallback;
}


export * from "./details/adMedia";

export * from "./details/propertyInfoMaps";

export type AdvertisementFeatureMap = Record<string, unknown>;

export function getResolvedAdvertisementFeatures(
  ad: AdvertisementItem,
): NonNullable<AdvertisementItem["features"]> {
  const rawFeatures = Array.isArray(ad.features) ? ad.features : [];
  const resolved = rawFeatures.map((item) => {
    if (!item || typeof item !== "object") return item;
    const it = item as Record<string, unknown>;
    const label =
      (typeof it.label === "string" && it.label.trim()) ||
      (typeof it.key === "string" && it.key.trim()) ||
      (typeof it.name === "string" && it.name.trim()) ||
      "";
    return {
      ...it,
      label,
      value: it.value,
    };
  });
  const labels = new Set(
    resolved.map((item) => (typeof item.label === "string" ? item.label : "")).filter(Boolean),
  );

  const addRootValue = (label: string, value: unknown) => {
    if (labels.has(label) || !isFilledValue(value)) return;
    resolved.push({ label, value });
    labels.add(label);
  };

  // Detail serializers in different API versions do not always place the same
  // fields inside `features`. Promote known root-level values so the purchase
  // detail UI does not silently lose data that the API did return.
  addRootValue("form_code", ad.form_code);
  addRootValue("area", ad.area);
  addRootValue("floor", ad.floor ?? ad.unit_floor);
  addRootValue("rooms", ad.rooms);
  addRootValue("building_age", ad.building_age ?? ad.year);

  const rootKeys = new Set([
    ...Object.keys(propertyInfoLabelMap),
    "meterage",
    "apartment_area",
    "unit_area",
    "room_count",
    "bedrooms",
    "age",
    "construction_age",
    "unit_floor",
    "apartment_floor",
    "unit_per_floor",
    "units_per_floor",
    "units_per_floor_count",
    "building_position",
    "building_direction",
    "unit_direction",
    "direction",
    "unit_location",
    "ground_position",
    "plot_position",
    "land_location",
    "document",
    "deed_type",
    "floors",
    "building_floors",
    "apartment_floors",
    "is_renovated",
    "is_furnished",
    "facilities",
    "heating_cooling",
    "elevator_count",
    "elevatorCount",
    "parking_count",
    "parkingCount",
    "terrace_count",
    "terraceCount",
    "has_exchange",
    "exchange",
    "is_exchangeable",
    "exchange_items",
    "exchange_types",
    "loan_amount",
    "mortgage_amount",
    "loan_price",
    "loan_value",
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
    "rent_conversion_enabled",
    "rent_convertible",
    "is_rent_convertible",
    "rent_conversion_policy",
    "rent_convertibility",
    "conversion_policy",
    "is_special",
  ]);

  for (const key of rootKeys) {
    addRootValue(key, ad[key]);
  }

  const loanAmountVal =
    getFirstExistingFeatureValue(resolved, [
      "loan_amount",
      "mortgage_amount",
      "loan_price",
      "loan_value",
    ]) ?? ad.loan?.amount;
  const loanInstallmentVal =
    getFirstExistingFeatureValue(resolved, [
      "loan_installment",
      "installment_amount",
      "loan_payment",
      "monthly_installment",
    ]) ?? ad.loan?.installment;
  const hasLoanPresent = isFilledValue(loanAmountVal) || isFilledValue(loanInstallmentVal);
  if (hasLoanPresent) {
    const existingIndex = resolved.findIndex(
      (item) => item.label === "has_loan" || ("key" in item && item.key === "has_loan"),
    );
    if (existingIndex >= 0) {
      resolved[existingIndex] = { ...resolved[existingIndex], value: true };
    } else {
      resolved.push({ label: "has_loan", value: true });
      labels.add("has_loan");
    }
  }

  return resolved;
}

export function buildAdvertisementFeatureMap(ad: AdvertisementItem): AdvertisementFeatureMap {
  return Object.fromEntries(
    getResolvedAdvertisementFeatures(ad)
      .filter((item) => typeof item.label === "string" && item.label.trim().length > 0)
      .map((item) => [item.label, item.value]),
  );
}

export function getFeatureValue(features: NonNullable<AdvertisementItem["features"]>, label: string) {
  const target = label.toLowerCase().trim();
  return features.find((feature) => {
    const l = String(feature.label ?? "")
      .toLowerCase()
      .trim();
    const k = String(feature.key ?? "")
      .toLowerCase()
      .trim();
    return l === target || k === target;
  })?.value;
}


export * from "./details/propertyPreviewFields";
function buildPropertyPreviewItem(
  features: NonNullable<AdvertisementItem["features"]>,
  field: PropertyPreviewField,
): PropertyInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, field.labels);

  if (!isFilledValue(rawValue)) return null;

  const value = field.formatter
    ? field.formatter(rawValue)
    : Array.isArray(rawValue)
      ? rawValue
          .map((item) => toText(item))
          .filter(Boolean)
          .join("، ")
      : normalizeDetailValue(field.labels[0], rawValue).toString();

  if (!value || value === "-") return null;

  const { formattedValue, iconSrc } = getBuildingInfo(field.labels[0], value);

  return {
    icon: field.icon ?? getDetailIconByLabel(field.label),
    iconSrc: iconSrc ?? null,
    label: field.label,
    value: field.formatter ? value : formattedValue,
  };
}

function buildPropertyInfoPreviewItems(features: NonNullable<AdvertisementItem["features"]>) {
  const formCode = toText(getFeatureValue(features, "form_code"));
  const config = propertyPreviewFieldsByFormCode[formCode];

  if (!config) {
    return buildPropertyInfoItems(features).slice(0, 4);
  }

  const items = config
    .map((field) => buildPropertyPreviewItem(features, field))
    .filter((item): item is PropertyInfoItem => item !== null);

  return items.length ? items : buildPropertyInfoItems(features).slice(0, 4);
}

function buildPropertyInfoItems(features: NonNullable<AdvertisementItem["features"]>) {
  const orderedItems = propertyInfoOrder
    .map((label) => {
      const feature = features.find((item) => item.label === label);

      if (!feature) {
        return null;
      }

      return buildPropertyInfoItem(label, feature.value);
    })
    .filter((item): item is PropertyInfoItem => item !== null);

  const extraItems = features
    .filter((feature) => {
      const label = feature.label ?? "";

      return label && !propertyInfoOrder.includes(label) && !ignoredFeatureLabels.has(label);
    })
    .map((feature) => buildPropertyInfoItem(feature.label ?? "", feature.value))
    .filter((item): item is PropertyInfoItem => item !== null);

  return [...orderedItems, ...extraItems];
}

type PropertyInfoItem = {
  icon: IconName;
  iconSrc: string | null;
  label: string;
  value: string;
};

function formatStructuredFeatureRows(label: string, value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;

  if (label === "project_details") {
    return value
      .map((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return "";
        const record = item as Record<string, unknown>;
        const parts = [
          record.meterage !== undefined ? `متراژ: ${formatAreaDetailValue(record.meterage)}` : "",
          isFilledValue(record.floors) ? `طبقات: ${toText(record.floors)}` : "",
          isFilledValue(record.rooms) ? `اتاق: ${toText(record.rooms)}` : "",
          isFilledValue(record.positions) ? `موقعیت: ${toText(record.positions)}` : "",
        ].filter(Boolean);

        return parts.length ? `واحد ${toPersianDigits(index + 1)} — ${parts.join("، ")}` : "";
      })
      .filter(Boolean);
  }

  if (label === "daily_hotel_rooms") {
    return value
      .map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return "";
        const record = item as Record<string, unknown>;
        const roomLabel = toText(record.room_label ?? record.room_type, "اتاق");
        const parts = [
          isFilledValue(record.guest_count) ? `ظرفیت: ${toText(record.guest_count)} نفر` : "",
          isFilledValue(record.extra_guest_count)
            ? `نفر اضافه: ${toText(record.extra_guest_count)}`
            : "",
          isFilledValue(record.meal_plan) ? `پذیرایی: ${toText(record.meal_plan)}` : "",
          isFilledValue(record.normal_price) ? `عادی: ${formatPrice(record.normal_price)}` : "",
          isFilledValue(record.weekend_price)
            ? `آخر هفته: ${formatPrice(record.weekend_price)}`
            : "",
          isFilledValue(record.special_price) ? `ویژه: ${formatPrice(record.special_price)}` : "",
        ].filter(Boolean);

        return parts.length ? `${roomLabel} — ${parts.join("، ")}` : roomLabel;
      })
      .filter(Boolean);
  }

  return null;
}

function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
  const structuredRows = formatStructuredFeatureRows(label, value);
  if (structuredRows) return structuredRows;

  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  if (typeof value === "boolean") {
    if (label === "has_loan") {
      return value ? "دارای وام" : "بدون وام";
    }

    if (label === "exchange_with") {
      return value ? "دارای معاوضه" : "بدون معاوضه";
    }

    return value ? "دارد" : "ندارد";
  }

  if (["area", "land_area", "building_area"].includes(label)) {
    return formatAreaDetailValue(value);
  }

  if (["land_width", "street_width", "height"].includes(label)) {
    const text = toText(value);
    return text ? `${text} متر` : "-";
  }

  if (
    [
      "price",
      "meter_price",
      "daily_price",
      "min_price",
      "max_price",
      "mortgage_price",
      "rent_price",
      "normal_daily_price",
      "weekend_daily_price",
      "special_daily_price",
      "extra_person_price",
      "evacuation_guarantee",
      "loan_amount",
      "loan_installment",
    ].includes(label)
  ) {
    return `${formatPrice(value)} تومان`;
  }

  if (["sale_terms_percent", "builder_share"].includes(label)) {
    return formatPercentDetailValue(value);
  }

  if (label === "sale_terms_installment_months" || label === "min_contract_months") {
    const text = toText(value);
    return text ? `${text} ماه` : "-";
  }

  return toText(value, "-");
}

export function getDetailIconByLabel(label: string): IconName {
  const l = label.toLowerCase();
  if (
    l.includes("متراژ") ||
    l.includes("area") ||
    l.includes("زیربنا") ||
    l.includes("بنا") ||
    l.includes("زمین")
  )
    return "area";
  if (l.includes("اتاق") || l.includes("خواب") || l.includes("rooms") || l.includes("تخت"))
    return "bed";
  if (
    l.includes("سن") ||
    l.includes("سال ساخت") ||
    l.includes("طبقه") ||
    l.includes("ساختمان") ||
    l.includes("واحد") ||
    l.includes("پروژه") ||
    l.includes("سازنده")
  )
    return "building";
  if (
    l.includes("سند") ||
    l.includes("قرارداد") ||
    l.includes("مجوز") ||
    l.includes("شرایط") ||
    l.includes("مالکیت")
  )
    return "document";
  if (
    l.includes("موقعیت") ||
    l.includes("جهت") ||
    l.includes("دسترسی") ||
    l.includes("تجاری") ||
    l.includes("اداری")
  )
    return "location";
  if (
    l.includes("تاریخ") ||
    l.includes("تحویل") ||
    l.includes("ساعت") ||
    l.includes("روز") ||
    l.includes("دوره") ||
    l.includes("اقساط")
  )
    return "calendar";
  if (l.includes("نفر") || l.includes("ظرفیت") || l.includes("مدیریت")) return "profile";
  if (l.includes("عرض") || l.includes("ارتفاع") || l.includes("گذر") || l.includes("سقف"))
    return "ruler";
  if (
    l.includes("قیمت") ||
    l.includes("مبلغ") ||
    l.includes("تومان") ||
    l.includes("رهن") ||
    l.includes("اجاره") ||
    l.includes("ودیعه") ||
    l.includes("تضمین")
  )
    return "tooman";
  if (l.includes("کابینت") || l.includes("آشپزخانه")) return "cabinet";
  if (l.includes("کف") || l.includes("سرامیک")) return "ceramic";
  return "apartment";
}

function buildPropertyInfoItem(label: string, rawValue: unknown) {
  const displayLabel = propertyInfoLabelMap[label] ?? label;
  const normalizedValue = normalizeDetailValue(label, rawValue);
  const iconLookupLabel = propertyInfoLabelMap[label] ? label : displayLabel;
  const { formattedValue, iconSrc } = getBuildingInfo(
    iconLookupLabel,
    Array.isArray(normalizedValue) ? normalizedValue.join("، ") : normalizedValue,
  );

  return {
    icon: getDetailIconByLabel(displayLabel),
    iconSrc: iconSrc ?? null,
    label: displayLabel,
    value: formattedValue,
  };
}


export * from "./details/facilityItemsBuilder";


export * from "./details/advertiserAndPricing";

export * from "./details/hotelAndProjectDetails";

export function mapAdToDetails(ad: AdvertisementItem): ViewAdDetails {
  const features = getResolvedAdvertisementFeatures(ad);
  const featureMap = buildAdvertisementFeatureMap(ad);
  const formCode = toText(ad.form_code ?? featureMap.form_code);
  const isRentalForm = formCode.startsWith("rent-") || formCode.startsWith("daily-");
  const propertyInfoRows = (features.length > 0 ? buildPropertyInfoItems(features) : [])
    .filter((item) => !(isRentalForm && item.label === "وام"))
    .filter(
      (item) =>
        !(
          isRentalForm &&
          ["رهن", "اجاره", "تبدیل رهن و اجاره", "قابل معاوضه با"].includes(item.label)
        ),
    );
  const propertyInfoPreview = features.length > 0 ? buildPropertyInfoPreviewItems(features) : [];
  const facilities =
    features.length > 0 || ad.facilities !== undefined ? buildFacilityItems(ad, features) : [];
  const age = formatPublishedAge(ad, features);
  const meterArea = featureMap.area ?? featureMap.land_area ?? featureMap.building_area ?? ad.area;
  const dailyHotelRooms = parseDailyHotelRooms(ad, features, featureMap, formCode);
  const projectDetails = parseProjectDetails(ad, features, featureMap, formCode);
  const pricePresentation = resolvePricePresentation(
    formCode,
    featureMap,
    ad.price,
    meterArea,
    dailyHotelRooms,
  );
  const description = ad.description ?? ad.short_description;
  const title = toText(ad.title ?? ad.label);
  const cityName = toText(ad.city?.name ?? ad.city_name);
  const neighborhoodName = toText(ad.neighborhood?.name ?? ad.neighborhood_name);
  const subNeighborhoodName = toText(ad.sub_neighborhood?.name);
  const normalizedLocation = [cityName, neighborhoodName, subNeighborhoodName]
    .filter(Boolean)
    .join("، ");
  const locationTitle = toText(
    ad.location_label,
    normalizedLocation || toText(ad.form_neighborhood_title, neighborhoodName || title),
  );
  const ownerType = String(ad.publisher_type ?? ad.owner_type ?? "").toLowerCase();
  const agencyLocation =
    ownerType === "agency" && ad.agency && typeof ad.agency === "object"
      ? toText(ad.agency.location, locationTitle)
      : ownerType === "agent" && ad.agent && typeof ad.agent === "object"
        ? toText(ad.agent.agency_name, locationTitle)
        : locationTitle;

  return {
    adCode: toPersianDigits(ad.track_code ?? ad.id ?? ad._id ?? ""),
    agency:
      ownerType === "agency" && ad.agency && typeof ad.agency === "object"
        ? toText(ad.agency.name)
        : ownerType === "agent" && ad.agent && typeof ad.agent === "object"
          ? toText(ad.agent.agency_name)
          : toText(featureMap.advertiser_type),
    agencyLocation,
    age,
    categoryNeighborhood: toText(
      ad.category_neighborhood,
      buildCategoryNeighborhoodLabel(formCode, neighborhoodName, locationTitle),
    ),
    description: toText(description),
    equipmentSections: [],
    features: facilities,
    formCode,
    headline: title,
    locationTitle,
    pricePerMeter: pricePresentation.secondaryValue,
    pricePrimaryLabel: pricePresentation.primaryLabel,
    priceSecondaryLabel: pricePresentation.secondaryLabel,
    rentConversionPolicy: toText(
      featureMap.rent_conversion_policy ??
        featureMap.rent_convertibility ??
        featureMap.conversion_policy,
    ),
    rentMortgagePriceRaw: toNumber(featureMap.mortgage_price ?? ad.mortgage_price),
    rentMonthlyPriceRaw: toNumber(featureMap.rent_price ?? ad.rent_price),
    rentConversionMortgagePriceRaw: toNumber(
      featureMap.rent_conversion_mortgage_price ??
        featureMap.rent_conversion_mortgage ??
        ad.rent_conversion_mortgage_price ??
        ad.rent_conversion_mortgage,
    ),
    rentConvertible: readRentConvertible(featureMap, ad, formCode),
    hotelStars: parseHotelStarCount(featureMap.hotel_stars ?? ad.hotel_stars),
    normalDailyPrice: formatPrice(featureMap.normal_daily_price ?? ad.normal_daily_price),
    weekendDailyPrice: formatPrice(featureMap.weekend_daily_price ?? ad.weekend_daily_price),
    specialDailyPrice: formatPrice(featureMap.special_daily_price ?? ad.special_daily_price),
    extraPersonPrice: formatPrice(featureMap.extra_person_price ?? ad.extra_person_price),
    propertyInfoPreview,
    propertyInfoRows,
    rows: [
      { icon: "addToList", label: "ثبت بازخورد" },
      { icon: "apartment", label: "آژانس‌های محله" },
      { icon: "informationDiamond", label: "گزارش تخلف آگهی" },
    ],
    status: toText(ad.status_label ?? ad.status),
    title,
    totalPrice: pricePresentation.primaryValue,
    imagesNotBelongToAd:
      toBooleanLike(
        ad.images_not_belong_to_ad ??
          ad.imagesNotBelongToAd ??
          featureMap.images_not_belong_to_ad ??
          getFeatureValue(features, "images_not_belong_to_ad"),
      ) === true,
    isSpecial:
      toBooleanLike(
        ad.is_special ??
          ad.special ??
          featureMap.is_special ??
          getFeatureValue(features, "is_special"),
      ) === true,
    isLadder:
      toBooleanLike(
        ad.is_ladder ?? ad.ladder ?? featureMap.is_ladder ?? getFeatureValue(features, "is_ladder"),
      ) === true,
    dailyHotelRooms,
    projectDetails,
  };
}

export const PROPERTY_DETAIL_ICONS = {
  loan: "/icons/loan.svg",
  exchange: "/icons/exchange.svg",
  selected: "/icons/selected-icon.svg",
};

export type DetailInfoValue = string | string[];

export type DetailInfoTone = "neutral" | "success" | "warning" | "danger";

export type DetailInfoLayout = "grid" | "rows";

export type DetailInfoItem = {
  icon: IconName;
  label: string;
  value: DetailInfoValue;
  badge?: boolean;
  tone?: DetailInfoTone;
  featureIconLabel?: string;
  hideFallbackIcon?: boolean;
  iconSrc?: string | null;
  extraRows?: Array<{
    label: string;
    value: string;
  }>;
};

export type DetailInfoSection = {
  title: string;
  items: DetailInfoItem[];
  layout?: DetailInfoLayout;
  columns?: 2 | 3;
  choiceRows?: DetailInfoItem[];
  badges?: DetailInfoItem[];
  showIcons?: boolean;
  ratingBanner?: {
    count: number;
    label?: string;
  };
};


export * from "./details/viewAdNavigation";

export * from "./details/detailFormatters";
export * from "./details/salePropertySections";
export * from "./details/rentPropertySections";
export * from "./details/dailyPropertySections";
export * from "./details/presalePropertySections";
export * from "./details/detailSectionBuilders";

export { DetailInfoFullPage } from "./components/DetailInfoFullPage";
