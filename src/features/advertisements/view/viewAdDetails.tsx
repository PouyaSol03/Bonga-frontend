import { PageFrame } from "../../../shared/layout/PageFrame";
import { ColorableSvgIcon } from "../../../shared/components/ColorableSvgIcon";
import { FeaturesIcons } from "../components/FeaturesIcons";
import { TopBar } from "../../../shared/components/TopBar";
import { getApiAssetUrl } from "../../../shared/api/api";
import { getAdvertisementImageUrls } from "../utils/advertisement-images";
import { getBuildingInfo } from "../../../shared/lib/handleBuildingInfo";
import { getFeatureIconSrc } from "../../../shared/lib/handleFeaturesIcons";
import type { AdvertisementItem } from "../api/advertisement.service";
import { ViewAdIcon } from "./ViewAdIcon";
import { parseAdIdFromPath } from "./viewAdData";
import { getStoredBackTarget, isSafeAppPath, replaceRoute } from "../../../shared/navigation/navigation";
import type { DetailItem, IconName, ViewAdDetails } from "./viewAdTypes";
import { Typography } from "../../../shared/ui/Typography";
import LinearStar from "../../../shared/icons/LinearStar";
import {
  AccommodationRatingBanner,
  FormattedDetailValueView,
} from "./viewAdComponents";

export type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};

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




const persianDigitMap: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
  "٠": "۰",
  "١": "۱",
  "٢": "۲",
  "٣": "۳",
  "٤": "۴",
  "٥": "۵",
  "٦": "۶",
  "٧": "۷",
  "٨": "۸",
  "٩": "۹",
};

const englishDigitMap: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

function toPersianDigits(value: unknown) {
  return String(value).replace(/[0-9٠-٩]/g, (digit) => persianDigitMap[digit] ?? digit);
}

function toEnglishDigits(value: unknown) {
  return String(value).replace(/[۰-۹٠-٩]/g, (digit) => englishDigitMap[digit] ?? digit);
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(toEnglishDigits(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = ""): string {
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

export function isOwnAdvertisement(ad: AdvertisementItem) {
  return (ad as { is_mine?: unknown }).is_mine === true;
}

function formatPublishedAge(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const publishedTimeAgo = toText(ad.published_time_ago);

  if (publishedTimeAgo) {
    return publishedTimeAgo;
  }

  const publishedDays =
    (ad as { published_days?: unknown }).published_days ??
    (ad as { published_date?: unknown }).published_date;
  const publishedDaysAgo = toNumber(publishedDays);

  if (
    publishedDays !== undefined &&
    publishedDays !== null &&
    publishedDaysAgo !== undefined
  ) {
    return `${new Intl.NumberFormat("fa-IR").format(publishedDaysAgo)} روز پیش`;
  }

  const publishedDaysText = toText(publishedDays);

  if (publishedDaysText) {
    return `${publishedDaysText} روز پیش`;
  }

  return toText(getFeatureValue(features, "published_at"));
}

function formatPrice(value: unknown) {
  const numericValue = toNumber(value);

  if (numericValue === undefined) {
    return toText(value, "توافقی");
  }

  if (numericValue >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000_000)} میلیارد`;
  }

  if (numericValue >= 1_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000)} میلیون`;
  }

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}


function readVideoUrl(ad: AdvertisementItem) {
  return typeof ad.video === "string" && ad.video.trim()
    ? getApiAssetUrl(ad.video)
    : "";
}

export function getVirtualTourUrl(ad: AdvertisementItem) {
  return typeof ad.virtual_tour_link === "string" && ad.virtual_tour_link.trim()
    ? ad.virtual_tour_link.trim()
    : "";
}

export function hasTour3d(ad: AdvertisementItem) {
  return Boolean(getVirtualTourUrl(ad));
}

export function buildGalleryMediaItems(ad: AdvertisementItem) {
  const images = getAdvertisementImageUrls(ad);
  const videoUrl = readVideoUrl(ad);
  const imageItems = images.map(
    (src): AlbumMediaItem => ({ src, type: "image" }),
  );

  if (!videoUrl) {
    return imageItems;
  }

  return [
    ...imageItems,
    {
      src: videoUrl,
      type: "video" as const,
    },
  ];
}

const propertyInfoLabelMap: Record<string, string> = {
  area: "متراژ",
  land_area: "متراژ زمین",
  building_area: "زیربنا",
  building_age: "سال ساخت",
  rooms: "تعداد اتاق ها",
  floor: "طبقه آپارتمان",
  has_document: "دارای سند",
  renovated: "بازسازی شده",
  furnished: "مبله با لوازم",
  has_loan: "وام",
  suitable_for: "مناسب برای",
  document_type: "نوع سند",
  land_position: "موقعیت زمین",
  land_use: "نوع کاربری",
  commercial_license: "مجوز تجاری",
  commercial_permit: "مجوز تجاری",
  commercial_position: "موقعیت تجاری",
  ownership_status: "وضعیت مالکیت",
  current_status: "وضعیت فعلی",
  industrial_property_type: "نوع ملک",
  access_type: "دسترسی",
  building_type: "نوع بنا",
  construction_license: "مجوز ساخت",
  build_permit: "مجوز ساخت",
  height: "ارتفاع سقف",
  ceiling_height: "ارتفاع سقف",
  opening_count: "تعداد دهنه",
  standard_capacity: "ظرفیت استاندارد",
  extra_people_capacity: "ظرفیت اضافه",
  hotel_stars: "رتبه بندی اقامتگاه",
  accommodation_type: "نوع اقامتگاه",
  space_type: "نوع فضا",
  rental_period: "دوره اجاره",
  view_type: "چشم انداز",
  check_in_time: "ساعت ورود",
  check_out_time: "ساعت خروج",
  min_stay_days: "حداقل مدت اقامت",
  evacuation_guarantee: "تضمین تخلیه",
  normal_daily_price: "روزهای عادی (شنبه تا چهارشنبه)",
  weekend_daily_price: "آخر هفته (چهار شنبه تا جمعه)",
  special_daily_price: "روزهای خاص (تعطیلات و مناسبت ها)",
  extra_person_price: "هزینه هر نفر اضافه",
  office_position: "موقعیت اداری",
  office_document_type: "سند اداری",
  management_room: "اتاق مدیریت",
  conference_room: "اتاق کنفرانس",
  reception_hall: "سالن پذیرش",
  signboard: "تابلو خور",
  kitchen: "آشپزخانه",
  separate_entrance: "ورودی مجزا",
  min_price: "حداقل قیمت",
  max_price: "حداکثر قیمت",
  min_meter_price: "حداقل قیمت متری",
  max_meter_price: "حداکثر قیمت متری",
  mortgage_price: "رهن",
  rent_price: "اجاره",
  builder_company_name: "نام سازنده/شرکت",
  builder_name: "نام سازنده/شرکت",
  developer_name: "نام سازنده/شرکت",
  project_type: "نوع پروژه",
  project_total_floors: "تعداد کل طبقات",
  project_total_units: "تعداد کل واحد ها",
  project_status: "وضعیت پروژه",
  delivery_date: "تاریخ تحویل",
  participation_type: "نوع مشارکت",
  partnership_type: "نوع مشارکت",
  builder_share: "درصد مشارکت / درصد سهم",
  builder_share_percent: "درصد مشارکت / درصد سهم",
  villa_type: "نوع ویلا",
  house_type: "نوع خانه",
  heating_cooling: "سرمایش و گرمایش",
  occupancy_status: "وضعیت سکونت",
  pet_policy: "حیوان خانگی",
  ready_delivery_date: "تاریخ آماده تحویل",
  min_contract_months: "حداقل مدت قرارداد",
  rent_conversion_policy: "تبدیل رهن و اجاره",
  kitchen_type: "نوع آشپزخانه",
  exchange_with: "قابل معاوضه با",
  advertiser_type: "نوع آگهی‌دهنده",
  meter_price: "قیمت متری",
  daily_price: "قیمت روزانه",
  capacity: "ظرفیت",
  unit_type: "جهت ساختمان",
  unit_position: "موقعیت واحد",
  density: "تراکم زمین",
  total_floors: "تعداد طبقات",
  facade_material: "جنس نما",
  floor_material: "جنس کف",
  cabinet_material: "جنس کابینت",
  land_width: "عرض زمین",
  street_width: "عرض خیابان",
  single_room_count: "تعداد اتاق یک تخته",
  double_room_count: "تعداد اتاق دو تخته",
  suite_count: "تعداد سوییت‌ها",
  sale_terms_percent: "درصد شرایط فروش",
  sale_terms_installment_months: "تعداد ماه اقساط",
  extra_specs: "مشخصات بیشتر",
  project_details: "جزئیات واحدهای پروژه",
  daily_hotel_rooms: "جزئیات اتاق‌های هتل",
};

const propertyInfoOrder = [
  "area",
  "land_area",
  "building_area",
  "land_use",
  "rooms",
  "building_age",
  "floor",
  "land_position",
  "height",
  "hotel_stars",
  "accommodation_type",
  "space_type",
  "rental_period",
  "view_type",
  "check_in_time",
  "check_out_time",
  "min_stay_days",
  "evacuation_guarantee",
  "normal_daily_price",
  "weekend_daily_price",
  "special_daily_price",
  "extra_person_price",
  "office_position",
  "office_document_type",
  "management_room",
  "conference_room",
  "reception_hall",
  "signboard",
  "kitchen",
  "separate_entrance",
  "has_document",
  "renovated",
  "furnished",
  "has_loan",
  "suitable_for",
  "document_type",
  "commercial_license",
  "commercial_permit",
  "commercial_position",
  "ownership_status",
  "current_status",
  "industrial_property_type",
  "access_type",
  "building_type",
  "construction_license",
  "build_permit",
  "standard_capacity",
  "extra_people_capacity",
  "project_total_floors",
  "project_total_units",
  "project_status",
  "delivery_date",
  "min_price",
  "max_price",
  "mortgage_price",
  "rent_price",
  "rent_conversion_policy",
  "participation_type",
  "partnership_type",
  "builder_share",
  "builder_share_percent",
  "villa_type",
  "house_type",
  "heating_cooling",
  "exchange_with",
  "meter_price",
  "daily_price",
  "capacity",
  "unit_type",
  "unit_position",
  "occupancy_status",
  "pet_policy",
  "ready_delivery_date",
  "min_contract_months",
  "density",
  "total_floors",
  "facade_material",
  "floor_material",
  "cabinet_material",
  "land_width",
  "street_width",
  "single_room_count",
  "double_room_count",
  "suite_count",
  "sale_terms_percent",
  "sale_terms_installment_months",
  "extra_specs",
  "project_details",
  "daily_hotel_rooms",
  "advertiser_type",
];

const ignoredFeatureLabels = new Set([
  "form_code",
  "neighborhood_id",
  "price",
  "published_at",
  "is_special",
  "has_image",
  "has_video",
  "facilities",
  "elevator_count",
  "elevatorCount",
  "parking_count",
  "parkingCount",
  "terrace_count",
  "terraceCount",
]);

export type AdvertisementFeatureMap = Record<string, unknown>;

function getResolvedAdvertisementFeatures(
  ad: AdvertisementItem,
): NonNullable<AdvertisementItem["features"]> {
  const resolved = Array.isArray(ad.features) ? [...ad.features] : [];
  const labels = new Set(
    resolved
      .map((item) => (typeof item.label === "string" ? item.label : ""))
      .filter(Boolean),
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

  return resolved;
}

export function buildAdvertisementFeatureMap(ad: AdvertisementItem): AdvertisementFeatureMap {
  return Object.fromEntries(
    getResolvedAdvertisementFeatures(ad)
      .filter((item) => typeof item.label === "string" && item.label.trim().length > 0)
      .map((item) => [item.label, item.value]),
  );
}

function getFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  label: string,
) {
  return features.find((feature) => feature.label === label)?.value;
}

type PropertyPreviewField = {
  icon?: IconName;
  label: string;
  labels: string[];
  formatter?: (value: unknown) => string;
};

const propertyPreviewFieldsByFormCode: Record<string, PropertyPreviewField[]> = {
  "sale-apartment": [
    { labels: ["area", "meterage", "apartment_area", "unit_area"], label: "متراژ آپارتمان", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor", "unit_floor", "apartment_floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "sale-villa-house": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "sale-garden-villa": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "sale-land": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "document" },
    { labels: ["land_width"], label: "عرض زمین", formatter: formatMeterDetailValue, icon: "ruler" },
    { labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue, icon: "ruler" },
  ],
  "sale-office": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_age", "age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" },
  ],
  "sale-commercial": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "document" },
    { labels: ["commercial_position"], label: "موقعیت تجاری", icon: "location" },
    { labels: ["ownership_status"], label: "وضعیت مالکیت", icon: "document" },
  ],
  "sale-warehouse": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position", "ground_position", "plot_position"], label: "موقعیت زمین", icon: "location" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "document" },
  ],
  "sale-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["document_type", "document", "deed_type"], label: "نوع سند", icon: "document" },
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
  ],
  "sale-factory": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین", icon: "location" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
    { labels: ["document_type"], label: "سند", icon: "document" },
  ],
  "rent-apartment": [
    { labels: ["area", "meterage", "apartment_area", "unit_area"], label: "متراژ آپارتمان", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor", "unit_floor", "apartment_floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-villa-house": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-garden-villa": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-office": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-commercial": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["commercial_position"], label: "موقعیت تجاری", icon: "location" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
    { labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" },
  ],
  "rent-warehouse": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position", "ground_position", "plot_position"], label: "موقعیت زمین", icon: "location" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["document_type", "document", "deed_type"], label: "نوع سند", icon: "document" },
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
  ],
  "rent-factory-workshop": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position", "ground_position", "plot_position"], label: "موقعیت زمین", icon: "location" },
    { labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "daily-apartment-suite": [
    { labels: ["accommodation_type", "villa_type", "house_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["area", "meterage", "apartment_area", "unit_area"], label: "متراژ", formatter: formatAreaDetailValue, icon: "ruler" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
  "daily-garden-villa": [
    { labels: ["accommodation_type", "villa_type", "house_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["area", "meterage", "land_area", "building_area"], label: "متراژ", formatter: formatAreaDetailValue, icon: "ruler" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
  "daily-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["rental_period"], label: "دوره اجاره", icon: "calendar" },
    { labels: ["check_in_time"], label: "ساعت ورود", icon: "calendar" },
    { labels: ["check_out_time"], label: "ساعت خروج", icon: "calendar" },
    { labels: ["min_stay_days"], label: "حداقل مدت اقامت", icon: "calendar" },
    { labels: ["pet_policy", "pets_allowed"], label: "حیوان خانگی", icon: "apartment" },
  ],
  "daily-office-booth": [
    { labels: ["accommodation_type", "space_type"], label: "نوع فضا", icon: "apartment" },
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "ruler" },
    { labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
  "presale-special": [
    { labels: ["builder_company_name", "builder_name", "developer_name"], label: "نام سازنده/شرکت", icon: "building" },
    { labels: ["project_type"], label: "نوع پروژه", icon: "apartment" },
    { labels: ["project_total_floors"], label: "تعداد کل طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" },
    { labels: ["project_total_units"], label: "تعداد کل واحد ها", icon: "building" },
    { labels: ["document_type"], label: "سند", icon: "document" },
    { labels: ["project_status"], label: "وضعیت پروژه", icon: "apartment" },
    { labels: ["delivery_date"], label: "تاریخ تحویل", icon: "calendar" },
    { labels: ["kitchen_type"], label: "نوع آشپزخانه", icon: "cabinet" },
    { labels: ["facade_material"], label: "جنس نما", icon: "building" },
    { labels: ["floor_material"], label: "جنس کف", icon: "ceramic" },
    { labels: ["cabinet_material"], label: "جنس کابینت", icon: "cabinet" },
    { labels: ["furnished"], label: "با لوازم و مبله", icon: "apartment" },
    { labels: ["min_meter_price", "min_price"], label: "حداقل قیمت متری", formatter: formatTomanDetailValue, icon: "tooman" },
    { labels: ["max_meter_price", "max_price"], label: "حداکثر قیمت متری", formatter: formatTomanDetailValue, icon: "tooman" },
    { labels: ["sale_terms_percent"], label: "درصد شرایط", formatter: formatPercentDetailValue, icon: "document" },
    { labels: ["sale_terms_installment_months"], label: "تعداد اقساط", icon: "calendar" },
  ],
  partnership: [
    { labels: ["partnership_type", "participation_type"], label: "نوع مشارکت", icon: "apartment" },
    { labels: ["current_status"], label: "وضعیت فعلی ملک", icon: "apartment" },
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین", icon: "location" },
    { labels: ["build_permit", "construction_license"], label: "مجوز ساخت", icon: "document" },
    { labels: ["document_type"], label: "نوع سند", icon: "document" },
    { labels: ["land_width"], label: "عرض زمین", formatter: formatMeterDetailValue, icon: "ruler" },
    { labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue, icon: "ruler" },
    { labels: ["builder_share", "builder_share_percent"], label: "درصد مشارکت / درصد سهم", formatter: formatPercentDetailValue, icon: "document" },
  ],
};

const propertyPreviewTitleByFormCode: Record<string, string> = {
  "sale-apartment": "اطلاعات آپارتمان",
  "sale-villa-house": "اطلاعات بنا",
  "sale-garden-villa": "اطلاعات بنا",
  "sale-land": "اطلاعات زمین",
  "sale-office": "اطلاعات واحد اداری",
  "sale-commercial": "اطلاعات واحد تجاری",
  "sale-factory": "اطلاعات واحد صنعتی",
  "sale-warehouse": "اطلاعات واحد صنعتی",
  "sale-hotel": "اطلاعات هتل، اقامتگاه",
  "rent-apartment": "اطلاعات آپارتمان",
  "rent-villa-house": "اطلاعات خانه، ویلا",
  "rent-garden-villa": "اطلاعات خانه، ویلا",
  "rent-office": "اطلاعات واحد اداری",
  "rent-commercial": "اطلاعات واحد تجاری",
  "rent-factory-workshop": "اطلاعات واحد صنعتی",
  "rent-warehouse": "اطلاعات واحد صنعتی",
  "rent-hotel": "اطلاعات هتل، اقامتگاه",
  "daily-apartment-suite": "اطلاعات آگهی",
  "daily-garden-villa": "اطلاعات آگهی",
  "daily-hotel": "اطلاعات هتل، اقامتگاه",
  "daily-office-booth": "اطلاعات آگهی",
};

export function getPropertyPreviewTitle(formCode: string) {
  return propertyPreviewTitleByFormCode[formCode] ?? "اطلاعات ملک";
}

function buildPropertyPreviewItem(
  features: NonNullable<AdvertisementItem["features"]>,
  field: PropertyPreviewField,
): PropertyInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, field.labels);

  if (!isFilledValue(rawValue)) return null;

  const value = field.formatter
    ? field.formatter(rawValue)
    : Array.isArray(rawValue)
      ? rawValue.map((item) => toText(item)).filter(Boolean).join("، ")
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

function buildPropertyInfoPreviewItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
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

function buildPropertyInfoItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
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

      return (
        label &&
        !propertyInfoOrder.includes(label) &&
        !ignoredFeatureLabels.has(label)
      );
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
          isFilledValue(record.extra_guest_count) ? `نفر اضافه: ${toText(record.extra_guest_count)}` : "",
          isFilledValue(record.meal_plan) ? `پذیرایی: ${toText(record.meal_plan)}` : "",
          isFilledValue(record.normal_price) ? `عادی: ${formatPrice(record.normal_price)}` : "",
          isFilledValue(record.weekend_price) ? `آخر هفته: ${formatPrice(record.weekend_price)}` : "",
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

  if (["price", "meter_price", "daily_price", "min_price", "max_price", "mortgage_price", "rent_price", "normal_daily_price", "weekend_daily_price", "special_daily_price", "extra_person_price", "evacuation_guarantee"].includes(label)) {
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

function getDetailIconByLabel(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("متراژ") || l.includes("area") || l.includes("زیربنا") || l.includes("بنا") || l.includes("زمین")) return "area";
  if (l.includes("اتاق") || l.includes("خواب") || l.includes("rooms") || l.includes("تخت")) return "bed";
  if (l.includes("سن") || l.includes("سال ساخت") || l.includes("طبقه") || l.includes("ساختمان") || l.includes("واحد") || l.includes("پروژه") || l.includes("سازنده")) return "building";
  if (l.includes("سند") || l.includes("قرارداد") || l.includes("مجوز") || l.includes("شرایط") || l.includes("مالکیت")) return "document";
  if (l.includes("موقعیت") || l.includes("جهت") || l.includes("دسترسی") || l.includes("تجاری") || l.includes("اداری")) return "location";
  if (l.includes("تاریخ") || l.includes("تحویل") || l.includes("ساعت") || l.includes("روز") || l.includes("دوره") || l.includes("اقساط")) return "calendar";
  if (l.includes("نفر") || l.includes("ظرفیت") || l.includes("مدیریت")) return "profile";
  if (l.includes("عرض") || l.includes("ارتفاع") || l.includes("گذر") || l.includes("سقف")) return "ruler";
  if (l.includes("قیمت") || l.includes("مبلغ") || l.includes("تومان") || l.includes("رهن") || l.includes("اجاره") || l.includes("ودیعه") || l.includes("تضمین")) return "tooman";
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
    Array.isArray(normalizedValue)
      ? normalizedValue.join("، ")
      : normalizedValue,
  );

  return {
    icon: getDetailIconByLabel(displayLabel),
    iconSrc: iconSrc ?? null,
    label: displayLabel,
    value: formattedValue,
  };
}

const parkingFacilityFormCodes = new Set([
  "sale-apartment",
  "sale-villa-house",
  "sale-garden-villa",
  "sale-office",
  "sale-commercial",
  "sale-hotel",
  "sale-warehouse",
  "rent-apartment",
  "rent-villa-house",
  "rent-garden-villa",
  "rent-office",
  "rent-commercial",
  "rent-hotel",
  "rent-warehouse",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel",
  "daily-office-booth",
  "presale-special",
]);


function getFirstFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function getAdOrFeatureValue(
  ad: AdvertisementItem | undefined,
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  if (ad) {
    for (const label of labels) {
      const value = ad[label];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }

  return getFirstFeatureValue(features, labels);
}

function getFacilityCountText(
  ad: AdvertisementItem | undefined,
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  const count = getAdOrFeatureValue(ad, features, labels);
  const text = toText(count);
  return text ? toPersianDigits(text) : "";
}

function getElevatorCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, [
    "elevator_count",
    "elevatorCount",
    "elevators_count",
  ]);
}

function getParkingCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, [
    "parking_count",
    "parkingCount",
    "parkings_count",
  ]);
}

function getTerraceCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, [
    "terrace_count",
    "terraceCount",
    "terraces_count",
  ]);
}

function parseFeatureList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) return [];

  const text = value.trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => toText(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to the delimiter-based parser for legacy payloads.
    }
  }

  return text
    .split(/[،,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFacilityDisplayLabel(value: string) {
  const normalized = value.trim();

  if (normalized === "سرویس فرهنگی") return "سرویس فرنگی";
  if (normalized === "western") return "سرویس فرنگی";
  if (normalized === "iranian") return "سرویس ایرانی";

  return normalized;
}

function buildFacilityItems(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const facilities = getFeatureValue(features, "facilities") ?? ad.facilities;
  const heatingCooling = getFeatureValue(features, "heating_cooling") ?? ad.heating_cooling;
  const elevatorCount = getElevatorCountText(features, ad);
  const parkingCount = getParkingCountText(features, ad);
  const terraceCount = getTerraceCountText(features, ad);

  const rawFacilityList = parseFeatureList(facilities).map(normalizeFacilityDisplayLabel);
  const heatingList = parseFeatureList(heatingCooling).map(normalizeFacilityDisplayLabel);
  const facilitySet = new Set(rawFacilityList);
  const formCode = toText(getFeatureValue(features, "form_code"), toText(ad.form_code));
  const supportsStructuralFacilities = parkingFacilityFormCodes.has(formCode);

  const hasElevator = facilitySet.has("آسانسور") || facilitySet.has("elevator") || Boolean(elevatorCount);
  const hasParking = facilitySet.has("پارکینگ") || facilitySet.has("parking") || Boolean(parkingCount);
  const hasTerrace = facilitySet.has("تراس") || facilitySet.has("terrace") || Boolean(terraceCount);
  const hasWarehouse = facilitySet.has("انباری") || facilitySet.has("warehouse") || facilitySet.has("storage");

  const makeFeatureItem = (feature: string): DetailItem => ({
    icon: "apartment",
    iconSrc: getFeatureIconSrc(feature),
    label: feature,
    value: feature,
    featureIconLabel: feature,
    hideFallbackIcon: true,
  });

  if (formCode === "rent-factory-workshop" || formCode === "rent-warehouse") {
    const utilityPriority = [
      "امتیاز برق",
      "برق تک فاز",
      "برق سه فاز",
      "امتیاز گاز",
      "امتیاز آب",
      "چاه آب",
      "دور دیوار/حصار",
      "دور دیوار",
      "نگهبانی",
      "امتیاز تلفن",
    ];
    const priorityIndex = new Map(utilityPriority.map((label, index) => [label, index]));
    const orderedFacilities = [...rawFacilityList].sort((a, b) => {
      const aIndex = priorityIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = priorityIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
    const seenIndustrial = new Set<string>();
    const makeIndustrialItem = (feature: string): DetailItem => {
      const item = makeFeatureItem(feature);
      if ((feature === "آسانسور" || feature === "elevator") && elevatorCount) item.inlineNote = `(${elevatorCount})`;
      if ((feature === "پارکینگ" || feature === "parking") && parkingCount) item.inlineNote = `(${parkingCount})`;
      if ((feature === "تراس" || feature === "terrace") && terraceCount) item.inlineNote = `(${terraceCount})`;
      return item;
    };

    return [...orderedFacilities, ...heatingList]
      .filter((name) => {
        if (!name || seenIndustrial.has(name)) return false;
        seenIndustrial.add(name);
        return true;
      })
      .map(makeIndustrialItem);
  }

  const structuralItems: DetailItem[] = [];

  if (supportsStructuralFacilities && hasWarehouse) {
    structuralItems.push(makeFeatureItem("انباری"));
  }

  if (supportsStructuralFacilities && hasElevator) {
    structuralItems.push({
      ...makeFeatureItem("آسانسور"),
      inlineNote: elevatorCount ? `(${elevatorCount})` : undefined,
    });
  }

  if (supportsStructuralFacilities && hasTerrace) {
    structuralItems.push({
      ...makeFeatureItem("تراس"),
      inlineNote: terraceCount ? `(${terraceCount})` : undefined,
    });
  }

  if (supportsStructuralFacilities && hasParking) {
    structuralItems.push({
      ...makeFeatureItem("پارکینگ"),
      inlineNote: parkingCount ? `(${parkingCount})` : undefined,
    });
  }

  const mandatoryKeys = new Set([
    "آسانسور",
    "elevator",
    "پارکینگ",
    "parking",
    "تراس",
    "terrace",
    "انباری",
    "warehouse",
    "storage",
  ]);

  const otherFacilityNames = rawFacilityList.filter((name) => !mandatoryKeys.has(name));
  const seen = new Set<string>();
  const uniqueHeatingNames = heatingList.filter((name) => {
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  const uniqueOtherNames = otherFacilityNames.filter((name) => {
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });

  const heatingItems = uniqueHeatingNames.map(makeFeatureItem);
  const otherFacilities = uniqueOtherNames.map(makeFeatureItem);

  return [...structuralItems, ...heatingItems, ...otherFacilities];
}

function formatPricePerMeter(totalPrice: unknown, area: unknown) {
  const numericPrice = toNumber(totalPrice);
  const numericArea = toNumber(area);

  if (
    numericPrice === undefined ||
    numericArea === undefined ||
    numericArea <= 0
  ) {
    return "—";
  }

  return formatPrice(numericPrice / numericArea);
}

function resolvePricePresentation(
  formCode: string,
  featureMap: AdvertisementFeatureMap,
  rootPrice: unknown,
  area: unknown,
) {
  if (formCode.startsWith("rent-")) {
    return {
      primaryLabel: "رهن",
      primaryValue: formatPrice(featureMap.mortgage_price),
      secondaryLabel: "اجاره ماهیانه",
      secondaryValue: formatPrice(featureMap.rent_price),
    };
  }

  if (formCode.startsWith("daily-")) {
    const minPrice = featureMap.min_price ?? featureMap.daily_price ?? featureMap.normal_daily_price;
    const maxPrice = featureMap.max_price;
    return {
      primaryLabel: "حداقل قیمت",
      primaryValue: formatPrice(minPrice),
      secondaryLabel: "حداکثر قیمت",
      secondaryValue: formatPrice(maxPrice),
    };
  }

  if (formCode === "presale-special") {
    const minPrice = featureMap.min_price ?? featureMap.meter_price;
    const maxPrice = featureMap.max_price;

    return {
      primaryLabel: maxPrice === undefined ? "قیمت متری" : "حداقل قیمت",
      primaryValue: formatPrice(minPrice),
      secondaryLabel: maxPrice === undefined ? "قیمت هر متر" : "حداکثر قیمت",
      secondaryValue: maxPrice === undefined ? formatPrice(featureMap.meter_price) : formatPrice(maxPrice),
    };
  }

  const totalPrice = rootPrice ?? featureMap.price;

  return {
    primaryLabel: "قیمت کل",
    primaryValue: formatPrice(totalPrice),
    secondaryLabel: "قیمت هر متر",
    secondaryValue: formatPricePerMeter(totalPrice, area),
  };
}

export function getMapPosition(ad: AdvertisementItem) {
  const lat = toNumber(ad.lat);
  const lng = toNumber(ad.lng);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

function readMetric(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return toPersianDigits(value);
  }

  if (typeof value === "string" && value.trim()) {
    return toPersianDigits(value.trim());
  }

  return undefined;
}

export function getAdvertiserPreview(ad: AdvertisementItem, details: ViewAdDetails): AdvertiserPreview | null {
  const ownerType = String(ad.publisher_type ?? ad.owner_type ?? "").toLowerCase();

  if (ownerType === "agency") {
    const agency = ad.agency && typeof ad.agency === "object" && !Array.isArray(ad.agency)
      ? ad.agency
      : null;
    const id = agency?.id;

    if (id === undefined || id === null) return null;

    const name = toText(agency?.name, details.agency || "آژانس املاک");
    const location = toText(agency?.location, details.agencyLocation || details.locationTitle);
    const params = new URLSearchParams({ location, name });

    return {
      href: `/agencies/${encodeURIComponent(String(id))}?${params.toString()}`,
      id: String(id),
      kind: "agency",
      location,
      logoUrl: typeof agency?.logo === "string" && agency.logo.trim()
        ? getApiAssetUrl(agency.logo.trim())
        : undefined,
      name,
      rank: readMetric(agency?.rank),
      ratingScore: readMetric(agency?.rating_score),
      subtitle: "آژانس املاک",
    };
  }

  if (ownerType === "agent") {
    const agent = ad.agent && typeof ad.agent === "object" && !Array.isArray(ad.agent)
      ? ad.agent
      : null;
    const id = agent?.id;

    if (id === undefined || id === null) return null;

    const name = toText(agent?.name, "مشاور املاک");
    const agencyName = toText(agent?.agency_name);
    const location = details.agencyLocation || details.locationTitle || "";
    const params = new URLSearchParams({ location, name });

    if (agencyName) params.set("agency", agencyName);

    return {
      href: `/agents/${encodeURIComponent(String(id))}?${params.toString()}`,
      id: String(id),
      kind: "agent",
      location,
      name,
      rank: readMetric(agent?.rank),
      ratingScore: readMetric(agent?.rating_score),
      subtitle: agencyName || "مشاور املاک",
    };
  }

  return null;
}


const saleCategoryLabelByFormCode: Record<string, string> = {
  "sale-apartment": "فروش آپارتمان",
  "sale-villa-house": "فروش خانه، ویلا",
  "sale-garden-villa": "فروش باغ، ویلا",
  "sale-land": "فروش زمین، ملک کلنگی",
  "sale-office": "فروش واحد اداری",
  "sale-commercial": "فروش واحد تجاری",
  "sale-factory": "فروش واحد صنعتی",
  "sale-warehouse": "فروش انبار، سوله",
  "sale-hotel": "فروش هتل، اقامتگاه",
};

const rentCategoryLabelByFormCode: Record<string, string> = {
  "rent-apartment": "اجاره آپارتمان",
  "rent-villa-house": "اجاره خانه، ویلا",
  "rent-garden-villa": "اجاره باغ، ویلا",
  "rent-office": "اجاره واحد اداری",
  "rent-commercial": "اجاره واحد تجاری",
  "rent-factory-workshop": "اجاره واحد صنعتی",
  "rent-warehouse": "اجاره انبار، سوله",
  "rent-hotel": "اجاره هتل، اقامتگاه",
};

function buildCategoryNeighborhoodLabel(formCode: string, neighborhoodName: string, fallback: string) {
  const listingCategory = saleCategoryLabelByFormCode[formCode] ?? rentCategoryLabelByFormCode[formCode];
  if (listingCategory && neighborhoodName) {
    return `${listingCategory} در محله ${neighborhoodName}`;
  }
  return listingCategory || fallback;
}

function parseHotelStarCount(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.min(5, Math.max(1, Math.round(value)));
  }
  const text = toText(value);
  if (!text) return undefined;
  if (text.includes("★")) {
    const count = (text.match(/★/g) || []).length;
    if (count > 0) return Math.min(5, Math.max(1, count));
  }
  const english = text
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  const match = english.match(/\d+/);
  if (!match) return undefined;
  const valueNumber = Number(match[0]);
  if (!Number.isFinite(valueNumber) || valueNumber <= 0) return undefined;
  return Math.min(5, Math.max(1, Math.round(valueNumber)));
}

function readRentConvertible(featureMap: AdvertisementFeatureMap, ad: AdvertisementItem, formCode: string) {
  const explicit = toBooleanLike(
    featureMap.rent_conversion_enabled ??
    featureMap.rent_convertible ??
    featureMap.is_rent_convertible ??
    ad.rent_conversion_enabled ??
    ad.rent_convertible ??
    ad.is_rent_convertible,
  );
  if (explicit !== undefined) return explicit;

  const policy = toText(
    featureMap.rent_conversion_policy ??
    featureMap.rent_convertibility ??
    featureMap.conversion_policy ??
    ad.rent_conversion_policy ??
    ad.rent_convertibility ??
    ad.conversion_policy,
  );
  if (policy) {
    if (policy.includes("نیست") || policy.includes("غیر قابل") || policy.includes("غیرقابل")) return false;
    if (policy.includes("قابل تبدیل") || policy.includes("تبدیل")) return true;
  }

  // The reference apartment UI exposes the conversion calculator whenever both
  // rent figures are present. This fallback also keeps old apartment ads useful
  // when older API payloads did not persist a dedicated conversion flag.
  if (formCode === "rent-apartment") {
    const mortgage = toNumber(featureMap.mortgage_price ?? ad.mortgage_price);
    const rent = toNumber(featureMap.rent_price ?? ad.rent_price);
    return Boolean((mortgage ?? 0) > 0 && (rent ?? 0) > 0);
  }

  return false;
}

export function mapAdToDetails(ad: AdvertisementItem): ViewAdDetails {
  const features = getResolvedAdvertisementFeatures(ad);
  const featureMap = buildAdvertisementFeatureMap(ad);
  const formCode = toText(ad.form_code ?? featureMap.form_code);
  const isRentalForm = formCode.startsWith("rent-") || formCode.startsWith("daily-");
  const propertyInfoRows = (features.length > 0 ? buildPropertyInfoItems(features) : [])
    .filter((item) => !(isRentalForm && item.label === "وام"))
    .filter((item) => !(isRentalForm && ["رهن", "اجاره", "تبدیل رهن و اجاره", "قابل معاوضه با"].includes(item.label)));
  const propertyInfoPreview = features.length > 0 ? buildPropertyInfoPreviewItems(features) : [];
  const facilities = features.length > 0 || ad.facilities !== undefined
    ? buildFacilityItems(ad, features)
    : [];
  const age = formatPublishedAge(ad, features);
  const meterArea = featureMap.area ?? featureMap.land_area ?? featureMap.building_area ?? ad.area;
  const pricePresentation = resolvePricePresentation(formCode, featureMap, ad.price, meterArea);
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
  const agencyLocation = ownerType === "agency" && ad.agency && typeof ad.agency === "object"
    ? toText(ad.agency.location, locationTitle)
    : ownerType === "agent" && ad.agent && typeof ad.agent === "object"
      ? toText(ad.agent.agency_name, locationTitle)
      : locationTitle;

  return {
    adCode: toPersianDigits(ad.track_code ?? ad.id ?? ad._id ?? ""),
    agency: ownerType === "agency" && ad.agency && typeof ad.agency === "object"
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
    imagesBelongToAd: toBooleanLike(
      ad.images_belong_to_ad ??
      featureMap.images_belong_to_ad ??
      getFeatureValue(features, "images_belong_to_ad"),
    ),
    isSpecial:
      toBooleanLike(
        ad.is_special ??
        ad.special ??
        featureMap.is_special ??
        getFeatureValue(features, "is_special"),
      ) === true,
  };
}

const PROPERTY_DETAIL_ICONS = {
  loan: "/icons/loan.svg",
  exchange: "/icons/exchange.svg",
  selected: "/icons/selected-icon.svg",
};

type DetailInfoValue = string | string[];

type DetailInfoTone = "neutral" | "success" | "warning" | "danger";

type DetailInfoLayout = "grid" | "rows";

type DetailInfoItem = {
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

type DetailInfoSection = {
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

export function parseViewAdIdFromPath(pathname: string) {
  const parsedId = parseAdIdFromPath(pathname);

  if (parsedId) {
    return parsedId;
  }

  const match = pathname.match(/\/(?:ads|preview-ad)\/([^/]+)/);
  return match?.[1] ?? null;
}

function goBackToAd(adId: string) {
  const fallbackPath = getCurrentViewAdBasePath(adId);

  goBackOrNavigate(fallbackPath);
}

export function getCurrentViewAdBasePath(adId: string) {
  return window.location.pathname.startsWith("/preview-ad/")
    ? `/preview-ad/${adId}`
    : `/ads/${adId}`;
}

function getLegacyHistoryBackTarget() {
  const state = window.history.state as { from?: unknown } | null;
  const from = state?.from;

  if (!isSafeAppPath(from) || from.startsWith("/ads/") || from.startsWith("/preview-ad/")) {
    return null;
  }

  return from;
}

function goBackOrNavigate(fallbackPath: string, legacyBackTarget?: string | null) {
  const storedBackTarget = getStoredBackTarget();
  const safeFallbackPath = isSafeAppPath(fallbackPath) ? fallbackPath : "/home";
  const targetPath = storedBackTarget?.backTo ?? legacyBackTarget ?? safeFallbackPath;
  const targetState = storedBackTarget?.backState;

  // Navigate directly to the resolved in-app return target. Browser history can
  // contain duplicate ad entries or entries from another site, which made the
  // back action appear to need multiple clicks.
  replaceRoute(targetPath, targetState, { rememberCurrent: false });
}

export function goBackFromAd(fallbackPath: string) {
  const storedBackTarget = getStoredBackTarget();

  // Preview/detail pages are opened as real navigation entries. When we have
  // a stored back target, use the browser back stack so the user returns to
  // the exact previous page (including its URL/state) instead of replacing
  // the current entry with a guessed destination.
  if (storedBackTarget && window.history.length > 1) {
    window.history.back();
    return;
  }

  goBackOrNavigate(fallbackPath, getLegacyHistoryBackTarget());
}

export function getDetailPageTitle(
  features: NonNullable<AdvertisementItem["features"]>,
  fallbackFormCode = "",
) {
  const formCode = toText(getFeatureValue(features, "form_code"), fallbackFormCode);

  const titles: Record<string, string> = {
    "sale-apartment": "اطلاعات آپارتمان",
    "sale-villa-house": "اطلاعات ویلا",
    "sale-garden-villa": "اطلاعات ویلا",
    "sale-land": "اطلاعات زمین",
    "sale-office": "اطلاعات واحد اداری",
    "sale-commercial": "اطلاعات واحد تجاری",
    "sale-factory": "اطلاعات واحد صنعتی",
    "sale-warehouse": "اطلاعات واحد صنعتی",
    "sale-hotel": "اطلاعات هتل، اقامتگاه",
    "rent-apartment": "اطلاعات آپارتمان",
    "rent-villa-house": "اطلاعات خانه، ویلا",
    "rent-garden-villa": "اطلاعات خانه، ویلا",
    "rent-office": "اطلاعات واحد اداری",
    "rent-commercial": "اطلاعات واحد تجاری",
    "rent-factory-workshop": "اطلاعات واحد صنعتی",
    "rent-warehouse": "اطلاعات واحد صنعتی",
    "rent-hotel": "اطلاعات هتل، اقامتگاه",
  };

  if (titles[formCode]) return titles[formCode];
  if (formCode.includes("garden-villa")) return "اطلاعات باغ، ویلا";
  if (formCode.includes("villa")) return "اطلاعات ویلا";
  if (formCode.includes("land")) return "اطلاعات زمین";
  if (formCode.includes("office")) return "اطلاعات واحد اداری";
  if (formCode.includes("commercial")) return "اطلاعات واحد تجاری";
  if (formCode.includes("factory") || formCode.includes("warehouse")) return "اطلاعات واحد صنعتی";
  if (formCode.includes("hotel")) return "اطلاعات هتل، اقامتگاه";

  return "اطلاعات ملک";
}

function isFilledValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item): boolean => isFilledValue(item));
  }

  return value !== undefined && value !== null && value !== "";
}

function getFirstExistingFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (isFilledValue(value)) {
      return value;
    }
  }

  return undefined;
}

function toValueArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => toText(item)).filter(Boolean)
    : [];
}

export function toBooleanLike(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1 ? true : value === 0 ? false : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "دارد", "بله", "هست"].includes(normalized)) {
      return true;
    }

    if (
      ["false", "0", "no", "n", "ندارد", "خیر", "نیست"].includes(normalized)
    ) {
      return false;
    }
  }

  return undefined;
}

function appendSuffixIfNeeded(value: unknown, suffix: string) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes(suffix)) {
    return text;
  }

  return `${text} ${suffix}`;
}

function formatAreaDetailValue(value: unknown) {
  const text = toText(value);
  if (!text) return "-";
  if (text.includes("مترمربع") || text.includes("متر مربع")) return text;
  if (text.includes("متر")) return text.replace(/متر/g, "مترمربع");
  return `${text} مترمربع`;
}

function formatMeterDetailValue(value: unknown) {
  return appendSuffixIfNeeded(value, "متر");
}


function formatPercentDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("درصد") || text.includes("%")) {
    return text;
  }

  return `${text} درصد`;
}

function formatAgeDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("سال") || text.includes("نوساز")) {
    return text;
  }

  return `${text} سال`;
}

function formatRoomDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("اتاق") || text.includes("خواب")) {
    return text;
  }

  return `${text} اتاق`;
}

function formatFloorDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `طبقه ${text}`;
}

function formatTotalFloorsDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `${text} طبقه`;
}

function formatUnitsPerFloorDetailValue(value: unknown) {
  const normalized = toText(value);
  const labelsByValue: Record<string, string> = {
    "1": "تک واحدی",
    "۱": "تک واحدی",
    "2": "دو واحدی",
    "۲": "دو واحدی",
    "3": "سه واحدی",
    "۳": "سه واحدی",
    "4": "چهار واحدی",
    "۴": "چهار واحدی",
    "5": "پنج واحدی",
    "۵": "پنج واحدی",
    "6": "شش واحدی",
    "۶": "شش واحدی",
    "7": "هفت واحدی",
    "۷": "هفت واحدی",
    "8": "هشت واحد بیشتر",
    "۸": "هشت واحد بیشتر",
  };
  return normalized ? labelsByValue[normalized] ?? appendSuffixIfNeeded(value, "واحد") : "-";
}

function formatTomanDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "";
  }

  if (
    text.includes("تومان") ||
    text.includes("میلیون") ||
    text.includes("میلیارد")
  ) {
    return text;
  }

  return `${formatPrice(value)} تومان`;
}

function createGridItem({
  features,
  labels,
  label,
  formatter,
  icon,
}: {
  features: NonNullable<AdvertisementItem["features"]>;
  labels: string[];
  label: string;
  formatter?: (value: unknown) => string;
  icon?: IconName;
}): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const value = formatter ? formatter(rawValue) : toText(rawValue, "-");

  if (!value || value === "-") {
    return null;
  }

  const iconInfo = getBuildingInfo(label, value);

  return {
    icon: icon ?? getDetailIconByLabel(label),
    iconSrc: iconInfo.iconSrc,
    label,
    value,
  };
}

function createChoiceRow(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const values = Array.isArray(rawValue)
    ? rawValue.map((item) => toText(item)).filter(Boolean)
    : [toText(rawValue)].filter(Boolean);

  if (!values.length) {
    return null;
  }

  return {
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    value: values,
  };
}

function createCheckBadge(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);
  const isActive = toBooleanLike(rawValue);

  if (isActive !== true) {
    return null;
  }

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    tone: "neutral",
    value: label,
  };
}

function createLoanRow(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const loanStatusRaw = getFirstExistingFeatureValue(features, [
    "has_loan",
    "loan",
    "has_mortgage",
    "mortgage",
  ]);

  const loanAmountRaw = ad.loan?.amount ?? getFirstExistingFeatureValue(features, [
    "loan_amount",
    "mortgage_amount",
    "loan_price",
    "loan_value",
  ]);

  const installmentRaw = ad.loan?.installment ?? getFirstExistingFeatureValue(features, [
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
  ]);

  const statusFromBoolean = toBooleanLike(loanStatusRaw);
  const hasTopLevelLoan = isFilledValue(ad.loan?.amount) || isFilledValue(ad.loan?.installment);
  const hasLoan = hasTopLevelLoan || (
    statusFromBoolean ?? (isFilledValue(loanAmountRaw) || isFilledValue(installmentRaw))
  );

  const extraRows =
    hasLoan === true
      ? [
        loanAmountRaw
          ? {
            label: "مبلغ وام:",
            value: formatTomanDetailValue(loanAmountRaw),
          }
          : null,
        installmentRaw
          ? {
            label: "مبلغ قسط:",
            value: formatTomanDetailValue(installmentRaw),
          }
          : null,
      ].filter(
        (item): item is { label: string; value: string } =>
          item !== null && Boolean(item.value),
      )
      : [];

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.loan,
    label: "وام",
    tone: hasLoan ? "success" : "warning",
    value: hasLoan ? "دارای وام" : "بدون وام",
    extraRows,
  };
}

function createExchangeRow(
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const exchangeStatusRaw = getFirstExistingFeatureValue(features, [
    "has_exchange",
    "exchange",
    "is_exchangeable",
  ]);

  const exchangeWithRaw = getFirstExistingFeatureValue(features, [
    "exchange_with",
    "exchange_items",
    "exchange_types",
  ]);

  const exchangeValues = toValueArray(exchangeWithRaw);
  const statusFromBoolean = toBooleanLike(exchangeStatusRaw);
  const hasExchange = statusFromBoolean ?? exchangeValues.length > 0;

  if (hasExchange && exchangeValues.length > 0) {
    return {
      icon: "arrowLeft",
      iconSrc: PROPERTY_DETAIL_ICONS.exchange,
      label: "معاوضه با:",
      tone: "neutral",
      value: exchangeValues,
    };
  }

  return {
    badge: true,
    icon: "arrowLeft",
    iconSrc: PROPERTY_DETAIL_ICONS.exchange,
    label: "معاوضه با:",
    tone: hasExchange ? "success" : "warning",
    value: hasExchange ? "دارای معاوضه" : "بدون معاوضه",
  };
}

function filterDetailSections(sections: DetailInfoSection[]) {
  return sections.filter(
    (section) =>
      section.items.length > 0 ||
      Boolean(section.choiceRows && section.choiceRows.length > 0) ||
      Boolean(section.badges && section.badges.length > 0),
  );
}

function saleLoanExchangeSection(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoSection {
  return {
    title: "وام و معاوضه",
    items: [createLoanRow(ad, features), createExchangeRow(features)],
    layout: "rows",
  };
}

function saleFinishSection(
  features: NonNullable<AdvertisementItem["features"]>,
  options: { cabinet?: boolean; facade?: boolean; floor?: boolean; kitchen?: boolean } = {
    cabinet: true,
    facade: true,
    floor: true,
    kitchen: false,
  },
): DetailInfoSection {
  const items = [
    options.facade === false
      ? null
      : createGridItem({
          features,
          labels: ["facade_material", "facade", "building_facade"],
          label: "جنس نما",
        }),
    options.kitchen === true
      ? createGridItem({
          features,
          labels: ["kitchen_type", "kitchen_style"],
          label: "نوع آشپزخانه",
        })
      : null,
    options.floor === false
      ? null
      : createGridItem({
          features,
          labels: ["floor_material", "flooring", "floor_covering", "floor_type"],
          label: "جنس کف",
        }),
    options.cabinet === false
      ? null
      : createGridItem({
          features,
          labels: ["cabinet_material", "cabinet", "kitchen_cabinet"],
          label: "جنس کابینت",
        }),
  ].filter((item): item is DetailInfoItem => item !== null);

  return {
    title: "متریال و نازک‌کاری",
    items,
    layout: "grid",
    columns: options.kitchen === true ? 2 : 3,
  };
}

function buildSalePropertyDetailSections(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (!formCode.startsWith("sale-")) return null;

  if (formCode === "sale-apartment") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage", "apartment_area", "unit_area"], label: "متراژ آپارتمان", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["floor", "unit_floor", "apartment_floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["unit_type", "building_position", "building_direction"], label: "موقعیت ساختمان" }),
      createGridItem({ features, labels: ["unit_position", "unit_direction", "direction", "unit_location"], label: "موقعیت واحد" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors", "apartment_floors"], label: "تعداد طبقات آپارتمان", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["unit_per_floor", "units_per_floor", "units_per_floor_count"], label: "تعداد واحد در طبقه", formatter: formatUnitsPerFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "نوع سند" }),
      createGridItem({ features, labels: ["occupancy_status", "residency_status", "occupancy"], label: "وضعیت سکونت" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
      saleFinishSection(features, { kitchen: true }),
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-villa-house" || formCode === "sale-garden-villa") {
    const mainItems = [
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_type", "house_building_type"], label: "نوع بنا" }),
      createGridItem({ features, labels: ["villa_type", "house_type"], label: "تیپ بنا" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "سند" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
      saleFinishSection(features, { kitchen: true }),
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-land") {
    const mainItems = [
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["land_width"], label: "عرض زمین", formatter: formatMeterDetailValue, icon: "area" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["density"], label: "تراکم زمین" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "نوع سند" }),
      createGridItem({ features, labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [
      createChoiceRow(features, ["land_use", "usage"], "نوع کاربری"),
      createChoiceRow(features, ["suitable_for"], "مناسب برای"),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["build_permit", "construction_license", "construction_permit"], "مجوز ساخت"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows, badges },
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-office") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["office_position"], label: "موقعیت اداری" }),
      createGridItem({ features, labels: ["office_document_type"], label: "سند اداری" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد کل طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter((item): item is DetailInfoItem => item !== null);
    const badges = [
      createCheckBadge(features, ["management_room"], "اتاق مدیریت"),
      createCheckBadge(features, ["conference_room"], "اتاق کنفرانس"),
      createCheckBadge(features, ["reception_hall"], "سالن پذیرش"),
      createCheckBadge(features, ["signboard"], "تابلو خور"),
      createCheckBadge(features, ["separate_entrance"], "ورودی مجزا"),
      createCheckBadge(features, ["kitchen"], "آشپزخانه"),
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows, badges },
      saleFinishSection(features),
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-commercial") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "سند" }),
      createGridItem({ features, labels: ["commercial_position"], label: "موقعیت تجاری" }),
      createGridItem({ features, labels: ["ownership_status"], label: "وضعیت مالکیت" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد کل طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["opening_count", "frontage_count", "openings"], label: "تعداد دهنه" }),
      createGridItem({ features, labels: ["commercial_license", "commercial_permit"], label: "مجوز تجاری" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows },
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-factory" || formCode === "sale-warehouse") {
    const mainItems = [
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "سند" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["height", "ceiling_height"], label: "ارتفاع سقف", formatter: formatMeterDetailValue }),
      createGridItem({ features, labels: ["industrial_property_type", "property_type"], label: "نوع ملک" }),
      createGridItem({ features, labels: ["access_type", "access"], label: "دسترسی" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["commercial_license", "commercial_permit"], label: "مجوز تجاری" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2 },
      saleLoanExchangeSection(ad, features),
    ]);
  }

  if (formCode === "sale-hotel") {
    const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
    const hasHotelStars = isFilledValue(hotelStarsRaw);
    const starCount = parseHotelStarCount(hotelStarsRaw);

    const mainItems = [
      createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "نوع سند" }),
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["single_room_count"], label: "اتاق یک تخته" }),
      createGridItem({ features, labels: ["double_room_count"], label: "اتاق دو تخته" }),
      createGridItem({ features, labels: ["suite_count"], label: "تعداد سوییت" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      {
        title: "مشخصات اصلی",
        items: mainItems,
        layout: "grid",
        columns: 2,
        showIcons: true,
        ratingBanner: hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
      },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
      saleFinishSection(features, { cabinet: false, facade: false, floor: true }),
      saleLoanExchangeSection(ad, features),
    ]);
  }

  return null;
}

function buildRentPropertyDetailSections(
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (!formCode.startsWith("rent-")) return null;

  const contractMonthsFormatter = (value: unknown) => {
    const text = toText(value);
    return text ? `${text} ماه` : "-";
  };

  if (formCode === "rent-apartment") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage", "apartment_area", "unit_area"], label: "متراژ آپارتمان", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["floor", "unit_floor", "apartment_floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["unit_type", "building_position", "building_direction"], label: "موقعیت ساختمان" }),
      createGridItem({ features, labels: ["unit_position", "unit_direction", "direction", "unit_location"], label: "موقعیت واحد" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors", "apartment_floors"], label: "تعداد طبقات آپارتمان", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["unit_per_floor", "units_per_floor", "units_per_floor_count"], label: "تعداد واحد در طبقه", formatter: formatUnitsPerFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["occupancy_status", "residency_status", "occupancy"], label: "وضعیت سکونت" }),
      createGridItem({ features, labels: ["min_contract_months", "minimum_contract_months", "contract_months"], label: "حداقل مدت قرارداد", formatter: contractMonthsFormatter }),
      createGridItem({ features, labels: ["ready_delivery_date", "delivery_ready_date", "available_from"], label: "تاریخ آماده تحویل", icon: "calendar" }),
      createGridItem({ features, labels: ["pet_policy", "pets_allowed", "pet_status"], label: "حیوان خانگی" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [
      createChoiceRow(features, ["suitable_for"], "مناسب برای"),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows, badges },
      saleFinishSection(features, { kitchen: true }),
    ]);
  }

  if (formCode === "rent-villa-house" || formCode === "rent-garden-villa") {
    const mainItems = [
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_type", "house_building_type"], label: "نوع بنا" }),
      createGridItem({ features, labels: ["villa_type", "house_type"], label: "تیپ بنا" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue }),
      createGridItem({ features, labels: ["pet_policy", "pets_allowed", "pet_status"], label: "حیوان خانگی" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [
      createChoiceRow(features, ["suitable_for"], "مناسب برای"),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows, badges },
      saleFinishSection(features, { kitchen: true }),
    ]);
  }

  if (formCode === "rent-office") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["office_position"], label: "موقعیت اداری" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["office_document_type"], label: "سند اداری" }),
      createGridItem({ features, labels: ["min_contract_months", "minimum_contract_months", "contract_months"], label: "حداقل مدت قرارداد", formatter: contractMonthsFormatter }),
      createGridItem({ features, labels: ["ready_delivery_date", "delivery_ready_date", "available_from"], label: "تاریخ آماده تحویل", icon: "calendar" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [
      createChoiceRow(features, ["suitable_for"], "مناسب برای"),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["management_room"], "اتاق مدیریت"),
      createCheckBadge(features, ["conference_room"], "اتاق کنفرانس"),
      createCheckBadge(features, ["reception_hall"], "سالن پذیرش"),
      createCheckBadge(features, ["signboard"], "تابلو خور"),
      createCheckBadge(features, ["separate_entrance"], "ورودی مجزا"),
      createCheckBadge(features, ["kitchen"], "آشپزخانه"),
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows, badges },
      saleFinishSection(features),
    ]);
  }

  if (formCode === "rent-commercial") {
    const mainItems = [
      createGridItem({ features, labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["commercial_position"], label: "موقعیت تجاری" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["floor", "unit_floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["opening_count", "frontage_count", "openings"], label: "تعداد دهنه" }),
      createGridItem({ features, labels: ["ceiling_height", "height"], label: "ارتفاع سقف", formatter: formatMeterDetailValue }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["min_contract_months", "minimum_contract_months", "contract_months"], label: "حداقل مدت قرارداد", formatter: contractMonthsFormatter }),
      createGridItem({ features, labels: ["ready_delivery_date", "delivery_ready_date", "available_from"], label: "تاریخ آماده تحویل", icon: "calendar" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [
      createChoiceRow(features, ["suitable_for"], "مناسب برای"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows },
    ]);
  }

  if (formCode === "rent-factory-workshop" || formCode === "rent-warehouse") {
    const mainItems = [
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق", formatter: formatRoomDetailValue, icon: "bed" }),
      createGridItem({ features, labels: ["ceiling_height", "height"], label: "ارتفاع سقف", formatter: formatMeterDetailValue }),
      createGridItem({ features, labels: ["industrial_property_type", "property_type"], label: "نوع ملک" }),
      createGridItem({ features, labels: ["access_type", "access"], label: "دسترسی" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["commercial_permit", "commercial_license"], label: "مجوز تجاری" }),
      createGridItem({ features, labels: ["min_contract_months", "minimum_contract_months", "contract_months"], label: "حداقل مدت قرارداد", formatter: contractMonthsFormatter }),
      createGridItem({ features, labels: ["ready_delivery_date", "delivery_ready_date", "available_from"], label: "تاریخ آماده تحویل", icon: "calendar" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2 },
    ]);
  }

  if (formCode === "rent-hotel") {
    const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
    const hasHotelStars = isFilledValue(hotelStarsRaw);
    const starCount = parseHotelStarCount(hotelStarsRaw);

    const mainItems = [
      createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
      createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "نوع سند" }),
      createGridItem({ features, labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
      createGridItem({ features, labels: ["building_area"], label: "متراژ بنا", formatter: formatAreaDetailValue, icon: "area" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
      createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["total_floors", "floors", "building_floors"], label: "تعداد طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" }),
      createGridItem({ features, labels: ["single_room_count"], label: "اتاق یک تخته" }),
      createGridItem({ features, labels: ["double_room_count"], label: "اتاق دو تخته" }),
      createGridItem({ features, labels: ["suite_count"], label: "تعداد سوییت" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      {
        title: "مشخصات اصلی",
        items: mainItems,
        layout: "grid",
        columns: 2,
        showIcons: true,
        ratingBanner: hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
      },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
      saleFinishSection(features, { cabinet: false, facade: false, floor: true }),
    ]);
  }

  return null;
}

function buildDailyPropertyDetailSections(
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (!formCode.startsWith("daily-")) return null;

  const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
  const hasHotelStars = isFilledValue(hotelStarsRaw);
  const starCount = parseHotelStarCount(hotelStarsRaw);

  const mainItems = [
    createGridItem({ features, labels: ["accommodation_type", "villa_type", "house_type", "space_type"], label: formCode === "daily-office-booth" ? "نوع فضا" : "نوع اقامتگاه" }),
    createGridItem({ features, labels: ["area", "meterage", "apartment_area", "unit_area", "land_area", "building_area"], label: "متراژ", formatter: formatAreaDetailValue, icon: "ruler" }),
    createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
    createGridItem({ features, labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", formatter: (val) => `${toText(val)} نفر`, icon: "profile" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const spaceItems = [
    createGridItem({ features, labels: ["extra_people_capacity"], label: "تعدادنفر اضافه", formatter: (val) => `${toText(val)} نفر` }),
    createGridItem({ features, labels: ["space_type"], label: "بافت اقامتگاه" }),
    createGridItem({ features, labels: ["view_type"], label: "چشم انداز" }),
    createGridItem({ features, labels: ["rental_period"], label: "دوره اجاره" }),
    createGridItem({ features, labels: ["check_in_time"], label: "ساعت تحویل" }),
    createGridItem({ features, labels: ["check_out_time"], label: "ساعت تخلیه" }),
    createGridItem({ features, labels: ["min_stay_days"], label: "حداقل مدت اقامت", formatter: (val) => `${toText(val)} روز` }),
    createGridItem({ features, labels: ["evacuation_guarantee"], label: "تضمین تخلیه", formatter: formatTomanDetailValue }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const badges = [
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const sections: DetailInfoSection[] = [
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
      ratingBanner: hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
    },
  ];

  if (spaceItems.length || badges.length) {
    sections.push({ title: "موقعیت و فضا", items: spaceItems, layout: "grid", columns: 2, badges });
  }

  return filterDetailSections(sections);
}

export function buildPropertyDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = getResolvedAdvertisementFeatures(ad);
  const featureMap = buildAdvertisementFeatureMap(ad);
  const formCode = toText(ad.form_code ?? featureMap.form_code ?? getFeatureValue(features, "form_code"));

  const saleSections = buildSalePropertyDetailSections(ad, features, formCode);
  if (saleSections) return saleSections;

  const rentSections = buildRentPropertyDetailSections(features, formCode);
  if (rentSections) return rentSections;

  const dailySections = buildDailyPropertyDetailSections(features, formCode);
  if (dailySections) return dailySections;

  const isApartment = formCode === "sale-apartment" || formCode === "rent-apartment";
  const isRentalForm = formCode.startsWith("rent-") || formCode.startsWith("daily-");
  const isOffice = formCode === "sale-office" || formCode === "rent-office";
  const isCommercial = formCode === "sale-commercial" || formCode === "rent-commercial";
  const isHotel = formCode === "sale-hotel" || formCode === "rent-hotel";
  const isFactory = formCode === "sale-factory" || formCode === "rent-factory-workshop";
  const areaLabel = isApartment ? "متراژ آپارتمان" : "متراژ";
  const floorLabel = isApartment ? "طبقه" : isOffice || isCommercial ? "طبقه" : "طبقه";
  const ageLabel = isOffice || isCommercial || isFactory ? "سال ساخت" : "سن ساخت";
  const totalFloorsLabel = isApartment
    ? "تعداد طبقات آپارتمان"
    : isOffice || isCommercial
      ? "تعداد کل طبقات"
      : "تعداد طبقات";
  const buildingAreaLabel = isHotel || isFactory ? "متراژ بنا" : "متراژ زیربنا";

  const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
  const hasHotelStars = isFilledValue(hotelStarsRaw);
  const starCount = parseHotelStarCount(hotelStarsRaw);
  const mainItems = [
    createGridItem({ features, labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" }),
    createGridItem({ features, labels: ["building_area"], label: buildingAreaLabel, formatter: formatAreaDetailValue, icon: "area" }),
    createGridItem({ features, labels: ["area", "apartment_area", "unit_area", "meterage"], label: areaLabel, formatter: formatAreaDetailValue, icon: "area" }),
    createGridItem({ features, labels: ["rooms", "room_count", "bedrooms"], label: "تعداد اتاق‌ها", formatter: formatRoomDetailValue, icon: "bed" }),
    createGridItem({ features, labels: ["building_age", "age", "construction_age"], label: ageLabel, formatter: formatAgeDetailValue, icon: "building" }),
    createGridItem({ features, labels: ["floor", "unit_floor", "apartment_floor"], label: floorLabel, formatter: formatFloorDetailValue, icon: "building" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingItems = [
    createGridItem({ features, labels: ["unit_direction", "unit_position", "direction", "unit_location"], label: "موقعیت واحد" }),
    createGridItem({ features, labels: ["land_position", "ground_position", "plot_position", "land_location"], label: "موقعیت زمین" }),
    createGridItem({ features, labels: ["unit_type", "building_position", "building_direction"], label: "موقعیت ساختمان" }),
    createGridItem({ features, labels: ["density"], label: "تراکم زمین" }),
    createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "سند" }),
    createGridItem({ features, labels: ["total_floors", "floors", "building_floors", "apartment_floors"], label: totalFloorsLabel, formatter: formatTotalFloorsDetailValue, icon: "building" }),
    createGridItem({ features, labels: ["unit_per_floor", "units_per_floor", "units_per_floor_count"], label: "تعداد واحد در طبقه", formatter: formatUnitsPerFloorDetailValue, icon: "building" }),
    createGridItem({ features, labels: ["commercial_position"], label: "موقعیت تجاری" }),
    createGridItem({ features, labels: ["office_position"], label: "موقعیت اداری" }),
    createGridItem({ features, labels: ["office_document_type"], label: "سند اداری" }),
    createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
    createGridItem({ features, labels: ["ownership_status"], label: "وضعیت مالکیت" }),
    createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
    createGridItem({ features, labels: ["industrial_property_type", "property_type"], label: "نوع ملک" }),
    createGridItem({ features, labels: ["access_type", "access"], label: "دسترسی" }),
    createGridItem({ features, labels: ["building_type", "house_building_type"], label: "نوع بنا" }),
    createGridItem({ features, labels: ["villa_type", "house_type"], label: "تیپ بنا" }),
    createGridItem({ features, labels: ["commercial_permit", "commercial_license"], label: "مجوز تجاری" }),
    createGridItem({ features, labels: ["height", "ceiling_height"], label: "ارتفاع سقف", formatter: formatMeterDetailValue }),
    createGridItem({ features, labels: ["opening_count", "frontage_count", "openings"], label: "تعداد دهنه" }),
    createGridItem({ features, labels: ["land_width"], label: "عرض زمین", formatter: formatMeterDetailValue }),
    createGridItem({ features, labels: ["street_width"], label: "عرض گذر", formatter: formatMeterDetailValue }),
    createGridItem({ features, labels: ["kitchen_type", "kitchen_style"], label: "نوع آشپزخانه" }),
    createGridItem({ features, labels: ["occupancy_status", "residency_status", "occupancy"], label: "وضعیت سکونت" }),
    createGridItem({ features, labels: ["pet_policy", "pets_allowed", "pet_status"], label: "حیوان خانگی" }),
    createGridItem({ features, labels: ["ready_delivery_date", "delivery_ready_date", "available_from"], label: "تاریخ آماده تحویل", icon: "calendar" }),
    createGridItem({ features, labels: ["min_contract_months", "minimum_contract_months", "contract_months"], label: "حداقل مدت قرارداد", formatter: (value) => { const text = toText(value); return text ? `${text} ماه` : "-"; } }),
    createGridItem({ features, labels: ["single_room_count"], label: "تعداد اتاق یک تخته" }),
    createGridItem({ features, labels: ["double_room_count"], label: "تعداد اتاق دو تخته" }),
    createGridItem({ features, labels: ["suite_count"], label: "تعداد سوییت ها" }),
    createGridItem({ features, labels: ["capacity", "standard_capacity"], label: "ظرفیت استاندارد" }),
    createGridItem({ features, labels: ["extra_people_capacity"], label: "ظرفیت اضافه" }),
    createGridItem({ features, labels: ["rental_period"], label: "دوره اجاره" }),
    createGridItem({ features, labels: ["view_type"], label: "چشم انداز" }),
    createGridItem({ features, labels: ["check_in_time"], label: "ساعت ورود" }),
    createGridItem({ features, labels: ["check_out_time"], label: "ساعت خروج" }),
    createGridItem({ features, labels: ["min_stay_days"], label: "حداقل مدت اقامت", formatter: (value) => { const text = toText(value); return text ? `${text} روز` : "-"; } }),
    createGridItem({ features, labels: ["evacuation_guarantee"], label: "تضمین تخلیه", formatter: formatTomanDetailValue }),
    createGridItem({ features, labels: ["project_status"], label: "وضعیت پروژه" }),
    createGridItem({ features, labels: ["delivery_date"], label: "تاریخ تحویل", icon: "calendar" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingChoiceRows = [
    createChoiceRow(features, ["land_use", "usage"], "نوع کاربری"),
    createChoiceRow(features, ["suitable_for"], "مناسب برای"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingBadges = [
    createCheckBadge(features, ["has_document"], "دارای سند"),
    createCheckBadge(features, ["build_permit"], "مجوز ساخت"),
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
    createCheckBadge(features, ["management_room"], "اتاق مدیریت"),
    createCheckBadge(features, ["conference_room"], "اتاق کنفرانس"),
    createCheckBadge(features, ["reception_hall"], "سالن پذیرش"),
    createCheckBadge(features, ["signboard"], "تابلو خور"),
    createCheckBadge(features, ["kitchen"], "آشپزخانه"),
    createCheckBadge(features, ["separate_entrance"], "ورودی مجزا"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const finishItems = [
    createGridItem({ features, labels: ["floor_material", "flooring", "floor_covering", "floor_type"], label: "جنس کف" }),
    createGridItem({ features, labels: ["facade_material", "facade", "building_facade"], label: "جنس نما" }),
    createGridItem({ features, labels: ["cabinet_material", "cabinet", "kitchen_cabinet"], label: "جنس کابینت" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const loanExchangeItems = isRentalForm
    ? []
    : [createLoanRow(ad, features), createExchangeRow(features)];

  return filterDetailSections([
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
      ratingBanner: hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
    },
    { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows: buildingChoiceRows, badges: buildingBadges },
    { title: "متریال و نازک‌کاری", items: finishItems, layout: "grid", columns: 2 },
    { title: "وام و معاوضه", items: loanExchangeItems, layout: "rows" },
  ]);
}

export function buildFacilitiesDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = getResolvedAdvertisementFeatures(ad);
  const facilities = getFeatureValue(features, "facilities") ?? ad.facilities;
  const heatingCooling = getFeatureValue(features, "heating_cooling") ?? ad.heating_cooling;
  const elevatorCount = getElevatorCountText(features, ad);
  const parkingCount = getParkingCountText(features, ad);
  const terraceCount = getTerraceCountText(features, ad);

  const heatingItems = Array.isArray(heatingCooling)
    ? heatingCooling
        .map((item) => toText(item))
        .filter(Boolean)
        .map((item) => ({
          icon: "apartment" as IconName,
          iconSrc: getFeatureIconSrc(item),
          label: item,
          value: "دارد",
          badge: true,
          tone: "neutral" as DetailInfoTone,
          featureIconLabel: item,
          hideFallbackIcon: true,
        }))
    : [];

  const rawList = parseFeatureList(facilities).map(normalizeFacilityDisplayLabel);
  const facilitySet = new Set(rawList);

  const hasElevator = facilitySet.has("آسانسور") || facilitySet.has("elevator") || Boolean(elevatorCount);
  const hasParking = facilitySet.has("پارکینگ") || facilitySet.has("parking") || Boolean(parkingCount);
  const hasTerrace = facilitySet.has("تراس") || facilitySet.has("terrace") || Boolean(terraceCount);
  const hasWarehouse = facilitySet.has("انباری") || facilitySet.has("warehouse") || facilitySet.has("storage");

  const elevatorItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("آسانسور"),
    label: "آسانسور",
    value: hasElevator ? (elevatorCount ? `${elevatorCount} دستگاه` : "دارد") : "ندارد",
    badge: true,
    tone: (hasElevator ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "آسانسور",
    hideFallbackIcon: true,
  };

  const parkingItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("پارکینگ"),
    label: "پارکینگ",
    value: hasParking ? (parkingCount ? `${parkingCount} فضا` : "دارد") : "ندارد",
    badge: true,
    tone: (hasParking ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "پارکینگ",
    hideFallbackIcon: true,
  };

  const terraceItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("تراس"),
    label: "تراس",
    value: hasTerrace ? (terraceCount ? `${terraceCount} عدد` : "دارد") : "ندارد",
    badge: true,
    tone: (hasTerrace ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "تراس",
    hideFallbackIcon: true,
  };

  const warehouseItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("انباری"),
    label: "انباری",
    value: hasWarehouse ? "دارد" : "ندارد",
    badge: true,
    tone: (hasWarehouse ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "انباری",
    hideFallbackIcon: true,
  };

  const mandatoryKeys = new Set([
    "آسانسور",
    "elevator",
    "پارکینگ",
    "parking",
    "تراس",
    "terrace",
    "انباری",
    "warehouse",
    "storage",
  ]);

  const otherFacilities = rawList
    .filter((name) => !mandatoryKeys.has(name))
    .map((facility) => ({
      icon: "apartment" as IconName,
      iconSrc: getFeatureIconSrc(facility),
      label: facility,
      value: "دارد",
      badge: true,
      tone: "neutral" as DetailInfoTone,
      featureIconLabel: facility,
      hideFallbackIcon: true,
    }));

  const facilityItems = [elevatorItem, parkingItem, terraceItem, warehouseItem, ...otherFacilities];

  const sections: DetailInfoSection[] = [];
  if (heatingItems.length) {
    sections.push({ title: "گرمایش و سرمایش", items: heatingItems, layout: "grid", columns: 2 });
  }
  if (facilityItems.length) {
    sections.push({ title: "امکانات", items: facilityItems, layout: "grid", columns: 2 });
  }

  return sections;
}

function DetailInfoIcon({
  item,
  className = "h-6 w-6 shrink-0 text-[#4D4D4D]",
}: {
  item: DetailInfoItem;
  className?: string;
}) {
  if (item.featureIconLabel) {
    return (
      <FeaturesIcons
        feature={item.featureIconLabel}
        className={className}
      />
    );
  }

  if (item.iconSrc) {
    return <ColorableSvgIcon className={className} src={item.iconSrc} />;
  }

  if (item.hideFallbackIcon) {
    return <Typography as="span" variant="body" size="medium" weight="regular" aria-hidden="true" className={className} />;
  }

  return <ViewAdIcon className={className} name={item.icon} />;
}

function DetailInfoValueView({
  item,
  align = "start",
}: {
  item: DetailInfoItem;
  align?: "start" | "center" | "end";
}) {
  const alignClassName =
    align === "center"
      ? "justify-center"
      : align === "end"
        ? "justify-end"
        : "justify-start";

  if (Array.isArray(item.value)) {
    return (
      <div className={`flex flex-wrap gap-2 ${alignClassName}`}>
        {item.value.map((value) => (
          <Typography as="span" variant="label" size="large" weight="semibold"
            className="rounded-md bg-[#edeff3] px-2.5 py-1.5 text-base font-semibold leading-6 text-[#1A1A1A]"
            key={value}
          >
            {value}
          </Typography>
        ))}
      </div>
    );
  }

  if (item.label === "رتبه اقامتگاه" || item.label.includes("رتبه") || item.label.includes("ستاره") || item.icon === "star") {
    const count = parseHotelStarCount(item.value);
    if (count) {
      return (
        <div className="flex items-center gap-0.5 [direction:ltr]" aria-label={`${count} ستاره از ۵`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <LinearStar
              aria-hidden="true"
              className={`h-5 w-5 ${star <= count ? "text-[#ffb100]" : "text-[#d9d9d9]"}`}
              innerColor={star <= count ? "currentColor" : "transparent"}
              key={star}
            />
          ))}
        </div>
      );
    }
  }

  if (item.badge) {
    const badgeClassName =
      item.tone === "success"
        ? "bg-[#0FAF7314] text-[#0FAF73]"
        : item.tone === "danger"
          ? "bg-[#FF3B3014] text-[#FF3B30] border border-[#FF3B30]"
        : item.tone === "warning"
          ? "bg-[#FF8D0014] text-[#FF6D00] border border-[#FF6D00]"
          : "bg-[#edeff3] text-[#4d4d4d]";

    return (
      <Typography as="span" variant="label" size="medium" weight="semibold"
        className={`p-2 rounded-lg ${badgeClassName}`}
      >
        {item.value}
      </Typography>
    );
  }

  return <FormattedDetailValueView tone={item.tone} value={item.value} />;
}

function DetailInfoItemCard({
  item,
  showIcon = false,
}: {
  item: DetailInfoItem;
  showIcon?: boolean;
}) {
  const labelPaddingClassName = showIcon ? "pr-[32px]" : "pr-0";

  return (
    <div className="flex w-full flex-col items-start justify-start text-right [direction:rtl]">
      <div className="flex min-h-7 w-full items-center justify-start gap-2 text-right text-base font-semibold [direction:rtl]">
        {showIcon ? <DetailInfoIcon item={item} /> : null}

        <div className="text-base font-semibold text-[#1A1A1A]">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      <Typography variant="label" size="small" weight="medium" className={`text-[#808080] ${labelPaddingClassName}`}>
        {item.label}
      </Typography>
    </div>
  );
}

function DetailInfoChoiceRows({ rows }: { rows: DetailInfoItem[] }) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div>
      {rows.map((row) => (
        <div
          className="flex flex-wrap items-center justify-start gap-2 border-t border-dashed border-[#d9d9d9] py-4 [direction:rtl]"
          key={row.label}
        >
          <div className="inline-flex shrink-0 items-center gap-1 text-[#808080]">
            <ColorableSvgIcon
              className="h-5 w-5 shrink-0"
              src={row.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <Typography as="span" variant="label" size="large" weight="medium">
              {row.label}:
            </Typography>
          </div>
          <DetailInfoValueView item={row} />
        </div>
      ))}
    </div>
  );
}

function DetailInfoCheckBadges({ badges }: { badges: DetailInfoItem[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-dashed border-[#d9d9d9]">
      <div className="flex flex-wrap justify-start gap-2 pb-4 pt-4 [direction:rtl]">
        {badges.map((badge) => (
          <Typography as="span" variant="label" size="medium" weight="semibold"
            className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-[#E9EAEE] p-2 text-sm font-semibold leading-5 text-[#4d4d4d]"
            key={badge.label}
          >
            <ColorableSvgIcon
              className="h-5 w-5 shrink-0"
              src={badge.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <Typography as="span" variant="label" size="medium" weight="semibold">{badge.value}</Typography>
          </Typography>
        ))}
      </div>
    </div>
  );
}

function DetailInfoRowCard({
  item,
  showDivider,
}: {
  item: DetailInfoItem;
  showDivider: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-start h-9 my-4 text-right [direction:rtl]">
        {item.iconSrc ? (
          <ColorableSvgIcon className="h-6 w-6 shrink-0 text-[#4D4D4D]" src={item.iconSrc} />
        ) : null}

        <Typography as="span" variant="label" size="large" weight="medium" className="text-base mr-1 font-medium text-[#808080]">
          {item.label}
        </Typography>

        <div className="mr-2">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      {item.extraRows && item.extraRows.length > 0 ? (
        <div className="space-y-3 pb-5 text-left [direction:ltr]">
          {item.extraRows.map((row) => (
            <div
              className="flex items-center justify-start gap-2 text-sm font-medium leading-5 [direction:rtl]"
              key={row.label}
            >
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-[#808080]">
                {row.label}
              </Typography>
              <strong className="text-sm font-semibold leading-5 text-[#1A1A1A]">
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}

      {showDivider ? (
        <div aria-hidden="true" className="h-px w-full bg-[#e5e5e5]" />
      ) : null}
    </div>
  );
}

function DetailInfoSectionBlock({
  section,
  separated = false,
}: {
  section: DetailInfoSection;
  separated?: boolean;
}) {
  const isRowsLayout = section.layout === "rows";

  return (
    <section
      className={`bg-white px-4 ${separated ? "border-t-8 border-[#f0f0f0]" : ""}`}
    >
      <div className="py-4">
        <Typography variant="label" size="medium" weight="medium" className="text-[#808080]">
          {section.title}
        </Typography>
      </div>
      <div aria-hidden="true" className="h-px w-full bg-[#e5e5e5]" />

      {section.ratingBanner ? (
        <div className="pt-4">
          <AccommodationRatingBanner count={section.ratingBanner.count} label={section.ratingBanner.label} />
        </div>
      ) : null}

      {isRowsLayout ? (
        <div>
          {section.items.map((item, index) => (
            <DetailInfoRowCard
              item={item}
              key={`${section.title}-${item.label}`}
              showDivider={index < section.items.length - 1}
            />
          ))}
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-2 justify-items-start gap-x-6 gap-y-6 py-4 [direction:rtl]"
          >
            {section.items.map((item) => (
              <DetailInfoItemCard
                item={item}
                key={`${section.title}-${item.label}`}
                showIcon={section.showIcons === true}
              />
            ))}
          </div>

          <DetailInfoChoiceRows rows={section.choiceRows ?? []} />
          <DetailInfoCheckBadges badges={section.badges ?? []} />
        </>
      )}
    </section>
  );
}

export function DetailInfoFullPage({
  title,
  sections,
  adId,
}: {
  title: string;
  sections: DetailInfoSection[];
  adId: string;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar onBack={() => goBackToAd(adId)} title={title} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <DetailInfoSectionBlock
              key={section.title}
              section={section}
              separated={index > 0}
            />
          ))
        ) : (
          <div className="mx-auto w-full bg-white px-4 py-10 text-center text-sm font-medium leading-5 text-[#808080]">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        )}
      </main>
    </PageFrame>
  );
}

