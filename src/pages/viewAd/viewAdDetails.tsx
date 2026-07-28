import { PageFrame } from "../../app/PageFrame";
import { ColorableSvgIcon } from "../../components/ColorableSvgIcon";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { TopBar } from "../../components/TopBar";
import { getApiAssetUrl } from "../../api/api";
import { getBuildingInfo } from "../../lib/handleBuildingInfo";
import { getFeatureIconSrc } from "../../lib/handleFeaturesIcons";
import type { AdvertisementItem } from "../../services/advertisement.service";
import { ViewAdIcon } from "./ViewAdIcon";
import { parseAdIdFromPath, viewAdDemo } from "./viewAdData";
import { getStoredBackTarget, isSafeAppPath, replaceRoute } from "../../routes/navigation";
import type { IconName, ViewAdDetails } from "./viewAdTypes";

export type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};

type AdvertisementImageItem = {
  path?: string;
  url?: string;
  src?: string;
  is_main?: boolean;
};

export type AdvertiserPreview = {
  href: string;
  kind: "agency" | "agent";
  location: string;
  name: string;
  subtitle: string;
};

const albumMediaItems: AlbumMediaItem[] = [
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "video" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
];


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

  return toText(getFeatureValue(features, "published_at"), viewAdDemo.age);
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

function readImages(ad: AdvertisementItem) {
  const apiImages = Array.isArray(ad.images) ? ad.images : [];

  const normalizedImages = apiImages
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          src: image,
          isMain: false,
          index,
        };
      }

      const imageItem = image as AdvertisementImageItem;

      return {
        src: imageItem.url ?? imageItem.src ?? imageItem.path ?? "",
        isMain: imageItem.is_main === true,
        index,
      };
    })
    .filter((image) => Boolean(image.src))
    .sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.index - b.index;
    });

  const imageSources =
    normalizedImages.length > 0
      ? normalizedImages.map((image) => image.src)
      : typeof ad.image === "string" && ad.image
        ? [ad.image]
        : [];

  return Array.from(new Set(imageSources)).map((image) =>
    getApiAssetUrl(image),
  );
}

function readAssetField(ad: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = ad[key];

    if (typeof value === "string" && value.trim()) {
      return getApiAssetUrl(value);
    }

    if (value && typeof value === "object") {
      const asset = value as { path?: unknown; src?: unknown; url?: unknown };
      const src = asset.url ?? asset.path ?? asset.src;

      if (typeof src === "string" && src.trim()) {
        return getApiAssetUrl(src);
      }
    }
  }

  return "";
}

function readBooleanFeature(ad: AdvertisementItem, labels: string[]) {
  const features = Array.isArray(ad.features) ? ad.features : [];

  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (["1", "true", "yes"].includes(normalizedValue)) return true;
      if (["0", "false", "no"].includes(normalizedValue)) return false;
    }
  }

  return false;
}

function readVideoUrl(ad: AdvertisementItem) {
  return readAssetField(ad, [
    "video",
    "video_url",
    "videoUrl",
    "video_path",
    "videoPath",
  ]);
}

export function hasTour3d(ad: AdvertisementItem) {
  return Boolean(
    readAssetField(ad, [
      "model_3d",
      "model3d",
      "model_3d_url",
      "model3d_url",
      "virtual_tour_link",
      "virtualTourLink",
      "virtual_tour",
      "tour_3d",
      "tour3d",
    ]) || readBooleanFeature(ad, ["has_virtual_tour", "has_3d_model", "has_model_3d"]),
  );
}

export function buildGalleryMediaItems(ad: AdvertisementItem) {
  const images = readImages(ad);
  const videoUrl = readVideoUrl(ad);
  const imageItems =
    images.length > 0
      ? images.map((src): AlbumMediaItem => ({ src, type: "image" }))
      : albumMediaItems.filter((item) => item.type === "image");

  if (!videoUrl) {
    return imageItems;
  }

  return [
    ...imageItems,
    {
      src: images[0] ?? "/figma/view-ad-gallery.png",
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
  has_document: "سند",
  renovated: "بازسازی شده",
  furnished: "مبله با لوازم",
  has_loan: "وام",
  suitable_for: "مناسب برای",
  document_type: "نوع سند",
  land_position: "موقعیت زمین",
  land_use: "کاربری",
  commercial_license: "مجوز تجاری",
  commercial_permit: "مجوز تجاری",
  construction_license: "مجوز ساخت",
  build_permit: "مجوز ساخت",
  height: "ارتفاع سقف",
  standard_capacity: "ظرفیت استاندارد",
  extra_people_capacity: "تعداد نفرات اضافه",
  hotel_stars: "رتبه‌بندی هتل",
  min_price: "حداقل قیمت",
  max_price: "حداکثر قیمت",
  mortgage_price: "رهن",
  rent_price: "اجاره",
  project_total_floors: "تعداد کل طبقات",
  project_total_units: "تعداد کل واحد ها",
  project_status: "وضعیت پروژه",
  delivery_date: "تاریخ تحویل",
  participation_type: "نوع مشارکت",
  partnership_type: "نوع مشارکت",
  builder_share: "سهم سازنده",
  builder_share_percent: "سهم سازنده",
  villa_type: "نوع ویلا",
  house_type: "نوع خانه",
  heating_cooling: "سرمایش و گرمایش",
  exchange_with: "قابل معاوضه با",
  advertiser_type: "نوع آگهی‌دهنده",
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
  "has_document",
  "renovated",
  "furnished",
  "has_loan",
  "suitable_for",
  "document_type",
  "commercial_license",
  "commercial_permit",
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
  "participation_type",
  "partnership_type",
  "builder_share",
  "builder_share_percent",
  "villa_type",
  "house_type",
  "heating_cooling",
  "exchange_with",
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
]);

function getFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  label: string,
) {
  return features.find((feature) => feature.label === label)?.value;
}

function getFirstFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

type PropertyPreviewField = {
  icon?: IconName;
  label: string;
  labels: string[];
  formatter?: (value: unknown) => string;
};

const propertyPreviewFieldsByFormCode: Record<string, PropertyPreviewField[]> = {
  "sale-apartment": [
    { labels: ["area", "meterage"], label: "متراژ آپارتمان", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
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
    { labels: ["land_use", "usage"], label: "کاربری" },
    { labels: ["land_position"], label: "موقعیت زمین" },
    { labels: ["document_type"], label: "نوع سند" },
  ],
  "sale-office": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["suitable_for"], label: "مناسب برای" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["document_type"], label: "نوع سند" },
  ],
  "sale-commercial": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["suitable_for"], label: "مناسب برای" },
    { labels: ["document_type"], label: "نوع سند" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "sale-warehouse": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area", "area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین" },
    { labels: ["suitable_for"], label: "مناسب برای" },
  ],
  "sale-hotel": [
    { labels: ["hotel_stars"], label: "رتبه‌بندی هتل", formatter: formatHotelStarsDetailValue, icon: "star" },
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["document_type"], label: "نوع سند" },
    { labels: ["land_position"], label: "موقعیت زمین" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "sale-factory": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area", "area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["document_type"], label: "نوع سند" },
  ],
  "rent-apartment": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor"], label: "طبقه", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-villa-house": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-garden-villa": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-office": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-commercial": [
    { labels: ["area", "meterage"], label: "متراژ", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["floor"], label: "طبقه آپارتمان", formatter: formatFloorDetailValue, icon: "building" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
    { labels: ["suitable_for"], label: "مناسب برای" },
  ],
  "rent-warehouse": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area", "area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین" },
    { labels: ["height", "ceiling_height"], label: "ارتفاع سقف", formatter: formatMeterDetailValue },
    { labels: ["suitable_for"], label: "مناسب برای" },
    { labels: ["commercial_permit", "commercial_license"], label: "مجوز تجاری" },
  ],
  "rent-hotel": [
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "building" },
  ],
  "rent-factory-workshop": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["building_area", "area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
  ],
  "presale-special": [
    { labels: ["project_total_floors"], label: "تعداد کل طبقات", formatter: formatTotalFloorsDetailValue, icon: "building" },
    { labels: ["project_total_units"], label: "تعداد کل واحد ها" },
    { labels: ["project_status"], label: "وضعیت پروژه" },
    { labels: ["delivery_date"], label: "تاریخ تحویل", icon: "calendar" },
    { labels: ["min_price"], label: "حداقل قیمت", formatter: formatTomanDetailValue, icon: "tooman" },
    { labels: ["max_price"], label: "حداکثر قیمت", formatter: formatTomanDetailValue, icon: "tooman" },
  ],
  partnership: [
    { labels: ["partnership_type", "participation_type"], label: "نوع مشارکت" },
    { labels: ["land_area", "area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["build_permit", "construction_license"], label: "مجوز ساخت" },
    { labels: ["document_type"], label: "نوع سند" },
    { labels: ["builder_share", "builder_share_percent"], label: "سهم سازنده", formatter: formatPercentDetailValue },
  ],
};

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
    icon: field.icon ?? iconForFeature(field.label),
    iconSrc,
    label: field.label,
    value: formattedValue,
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

function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
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

  if (label === "area" || label === "land_area" || label === "building_area") {
    const text = toText(value);
    return text ? `${text} متر` : "-";
  }

  if (label === "price") {
    return `${formatPrice(value)} تومان`;
  }

  return toText(value, "-");
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
    icon: iconForFeature(displayLabel),
    iconSrc,
    label: displayLabel,
    value: formattedValue,
  };
}

function buildFacilityItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const facilities = getFeatureValue(features, "facilities");

  if (!Array.isArray(facilities)) {
    return [];
  }

  return facilities
    .map((facility) => toText(facility))
    .filter(Boolean)
    .map((facility) => ({
      icon: "apartment" as IconName,
      iconSrc: getFeatureIconSrc(facility),
      label: facility,
      value: facility,
      featureIconLabel: facility,
      hideFallbackIcon: true,
    }));
}

function withFeatureIconAssets(items: ViewAdDetails["features"]) {
  return items.map((item) => ({
    ...item,
    featureIconLabel: item.featureIconLabel ?? item.value,
    hideFallbackIcon: true,
    iconSrc:
      item.iconSrc ?? getFeatureIconSrc(item.featureIconLabel ?? item.value),
  }));
}

function formatPricePerMeter(totalPrice: unknown, area: unknown) {
  const numericPrice = toNumber(totalPrice);
  const numericArea = toNumber(area);

  if (
    numericPrice === undefined ||
    numericArea === undefined ||
    numericArea <= 0
  ) {
    return viewAdDemo.pricePerMeter;
  }

  return formatPrice(numericPrice / numericArea);
}

export function getMapPosition(ad: AdvertisementItem) {
  const position = ad as {
    lat?: unknown;
    latitude?: unknown;
    lng?: unknown;
    long?: unknown;
    longitude?: unknown;
  };
  const lat = toNumber(position.lat ?? position.latitude);
  const lng = toNumber(position.lng ?? position.long ?? position.longitude);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

export function getAdvertiserPreview(ad: AdvertisementItem, details: ViewAdDetails): AdvertiserPreview | null {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const advertiserType = toText(getFeatureValue(features, "advertiser_type"));
  const ownerType = String((ad as { owner_type?: unknown }).owner_type ?? "").toLowerCase();
  const agencyName = toText(
    ad.agency ??
      (ad as { agency_name?: unknown }).agency_name ??
      (ad as { real_estate_name?: unknown }).real_estate_name,
  );
  const agentName = toText(
    (ad as { agent_name?: unknown }).agent_name ??
      (ad as { consultant_name?: unknown }).consultant_name ??
      (ad as { adviser_name?: unknown }).adviser_name ??
      (ad as { advertiser_name?: unknown }).advertiser_name ??
      (ad as { owner_name?: unknown }).owner_name,
  );
  const isAgent =
    advertiserType.includes("مشاور") ||
    ownerType.includes("consultant") ||
    ownerType.includes("agent");
  const isAgency =
    advertiserType.includes("آژانس") ||
    ownerType.includes("agency") ||
    Boolean(agencyName) ||
    (advertiserType.includes("املاک") && !advertiserType.includes("مشاور"));

  if (!isAgent && !isAgency) return null;

  const kind = isAgent && !isAgency ? "agent" : "agency";
  const name = (kind === "agent" ? agentName : agencyName) || details.agency || (kind === "agent" ? "مشاور املاک" : "آژانس املاک");
  const id = getAdvertiserPreviewId(ad, kind);
  if (!id) return null;
  const params = new URLSearchParams({
    location: details.agencyLocation || details.locationTitle || "",
    name,
  });

  if (kind === "agent" && agencyName) {
    params.set("agency", agencyName);
  }

  return {
    href: `/${kind === "agent" ? "agents" : "agencies"}/${encodeURIComponent(id)}?${params.toString()}`,
    kind,
    location: details.agencyLocation || details.locationTitle || "",
    name,
    subtitle: kind === "agent" ? agencyName || "مشاور املاک" : "آژانس املاک",
  };
}

function getAdvertiserPreviewId(ad: AdvertisementItem, kind: "agency" | "agent") {
  const agent = ad.agent && typeof ad.agent === "object" && !Array.isArray(ad.agent)
    ? ad.agent as Record<string, unknown>
    : {};
  const agency = ad.agency && typeof ad.agency === "object" && !Array.isArray(ad.agency)
    ? ad.agency as Record<string, unknown>
    : {};
  const candidates =
    kind === "agent"
      ? [
          (ad as { agent_id?: unknown }).agent_id,
          (ad as { consultant_id?: unknown }).consultant_id,
          (ad as { adviser_id?: unknown }).adviser_id,
          agent.id,
          agent._id,
        ]
      : [
          (ad as { agency_id?: unknown }).agency_id,
          (ad as { real_estate_id?: unknown }).real_estate_id,
          (ad as { office_id?: unknown }).office_id,
          agency.id,
          agency._id,
        ];

  const found = candidates.find((value) => value !== undefined && value !== null && String(value).trim());

  return found === undefined || found === null ? null : String(found);
}

function iconForFeature(label: string): IconName {
  if (label.includes("متراژ")) return "area";
  if (label.includes("اتاق") || label.includes("خواب")) return "bed";
  if (label.includes("سال")) return "building";
  return "apartment";
}

export function mapAdToDetails(ad: AdvertisementItem): ViewAdDetails {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const propertyInfoRows =
    features.length > 0
      ? buildPropertyInfoItems(features)
      : viewAdDemo.propertyInfoRows;
  const propertyInfoPreview =
    features.length > 0
      ? buildPropertyInfoPreviewItems(features)
      : viewAdDemo.propertyInfoPreview;
  const facilities =
    features.length > 0
      ? buildFacilityItems(features)
      : withFeatureIconAssets(viewAdDemo.features);
  const age = formatPublishedAge(ad, features);
  const totalPrice = ad.price ?? getFeatureValue(features, "price");
  const meterArea =
    getFirstFeatureValue(features, ["area", "land_area", "building_area"]) ??
    (ad as { area?: unknown }).area;
  const description =
    (ad as { description?: unknown }).description ??
    (ad as { short_description?: unknown }).short_description;

  return {
    ...viewAdDemo,
    adCode: toPersianDigits(
      (ad as { track_code?: unknown }).track_code ??
      ad.id ??
      ad._id ??
      viewAdDemo.adCode,
    ),
    age,
    agency: toText(
      getFeatureValue(features, "advertiser_type"),
      viewAdDemo.agency,
    ),
    description: toText(description, viewAdDemo.description),
    features: facilities,
    headline: toText(ad.title ?? ad.label, viewAdDemo.headline),
    locationTitle: toText(
      (ad as { form_neighborhood_title?: unknown }).form_neighborhood_title,
      toText(ad.label ?? ad.title, viewAdDemo.locationTitle),
    ),
    pricePerMeter: formatPricePerMeter(totalPrice, meterArea),
    propertyInfoPreview,
    propertyInfoRows,
    title: toText(ad.title ?? ad.label, viewAdDemo.title),
    totalPrice: formatPrice(totalPrice),
  };
}

const PROPERTY_DETAIL_ICONS = {
  loan: "/icons/loan.svg",
  exchange: "/icons/exchange.svg",
  selected: "/icons/selected-icon.svg",
};

type DetailInfoValue = string | string[];

type DetailInfoTone = "neutral" | "success" | "warning";

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
  badges?: DetailInfoItem[];
  showIcons?: boolean;
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

  // Routes opened inside the app are pushed with a stored back target. In that
  // case the previous browser entry is the correct page and preserves its own
  // filters, query string and scroll-related state.
  if ((storedBackTarget || legacyBackTarget) && window.history.length > 1) {
    window.history.back();
    return;
  }

  // A directly opened or refreshed ad may have browser history that belongs to
  // another website. Replace the ad entry with a safe app route instead of
  // relying on history.length or leaving the back button with no visible result.
  replaceRoute(targetPath, targetState, { rememberCurrent: false });
}

export function goBackFromAd(fallbackPath: string) {
  goBackOrNavigate(fallbackPath, getLegacyHistoryBackTarget());
}

export function getDetailPageTitle(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const formCode = toText(getFeatureValue(features, "form_code"));

  if (formCode.includes("garden-villa")) return "اطلاعات ملک";
  if (formCode.includes("villa")) return "اطلاعات ویلا";
  if (formCode.includes("land")) return "اطلاعات زمین";

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
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  const text = toText(value);

  if (!text) {
    return [];
  }

  return text
    .split(/[،,]/)
    .map((item) => item.trim())
    .filter(Boolean);
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
  return appendSuffixIfNeeded(value, "متر");
}

function formatMeterDetailValue(value: unknown) {
  return appendSuffixIfNeeded(value, "متر");
}

function formatHotelStarsDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("ستاره")) {
    return text;
  }

  return `${text} ستاره`;
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

function getDetailIconByLabel(label: string): IconName {
  if (label.includes("متراژ") || label.includes("area")) return "area";
  if (
    label.includes("اتاق") ||
    label.includes("خواب") ||
    label.includes("rooms")
  )
    return "bed";
  if (
    label.includes("سن") ||
    label.includes("طبقه") ||
    label.includes("ساختمان")
  )
    return "building";
  return "apartment";
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

export function buildPropertyDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = Array.isArray(ad.features) ? ad.features : [];

  const mainItems = [
    createGridItem({
      features,
      labels: ["area", "apartment_area", "unit_area", "meterage"],
      label: "متراژ آپارتمان",
      formatter: formatAreaDetailValue,
      icon: "area",
    }),
    createGridItem({
      features,
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    }),
    createGridItem({
      features,
      labels: ["building_age", "age", "construction_age"],
      label: "سن ساخت",
      formatter: formatAgeDetailValue,
      icon: "building",
    }),
    createGridItem({
      features,
      labels: ["floor", "unit_floor", "apartment_floor"],
      label: "طبقه آپارتمان",
      formatter: formatFloorDetailValue,
      icon: "building",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingItems = [
    createGridItem({
      features,
      labels: ["unit_direction", "unit_position", "direction", "unit_location"],
      label: "موقعیت واحد",
    }),
    createGridItem({
      features,
      labels: [
        "land_position",
        "ground_position",
        "plot_position",
        "land_location",
      ],
      label: "موقعیت زمین",
    }),
    createGridItem({
      features,
      labels: ["document_type", "document", "deed_type"],
      label: "سند",
    }) ??
    createGridItem({
      features,
      labels: ["has_document"],
      label: "سند",
    }),
    createGridItem({
      features,
      labels: ["total_floors", "floors", "building_floors", "apartment_floors"],
      label: "طبقات آپارتمان",
      formatter: formatTotalFloorsDetailValue,
      icon: "building",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingBadges = [
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const finishItems = [
    createGridItem({
      features,
      labels: ["floor_material", "flooring", "floor_covering", "floor_type"],
      label: "جنس کف",
    }),
    createGridItem({
      features,
      labels: ["facade_material", "facade", "building_facade"],
      label: "جنس نما",
    }),
    createGridItem({
      features,
      labels: ["cabinet_material", "cabinet", "kitchen_cabinet"],
      label: "جنس کابینت",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const loanExchangeItems = [
    createLoanRow(ad, features),
    createExchangeRow(features),
  ];

  const sections: DetailInfoSection[] = [
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
    },
    {
      title: "موقعیت و ساختمان",
      items: buildingItems,
      layout: "grid",
      columns: 3,
      badges: buildingBadges,
    },
    {
      title: "متریال و نازک‌کاری",
      items: finishItems,
      layout: "grid",
      columns: 3,
    },
    {
      title: "وام و معاوضه",
      items: loanExchangeItems,
      layout: "rows",
    },
  ];

  return sections.filter(
    (section) =>
      section.items.length > 0 ||
      Boolean(section.badges && section.badges.length > 0),
  );
}

export function buildFacilitiesDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const facilities = getFeatureValue(features, "facilities");

  if (!Array.isArray(facilities)) {
    return [];
  }

  const items = facilities
    .map((facility) => toText(facility))
    .filter(Boolean)
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

  return [
    {
      title: "امکانات و تجهیزات",
      items,
      layout: "grid",
      columns: 3,
    },
  ];
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
    return <span aria-hidden="true" className={className} />;
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
          <span
            className="rounded-md bg-[#edeff3] px-2.5 py-1.5 text-base font-semibold leading-6 text-[#1A1A1A]"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    );
  }

  if (item.badge) {
    const badgeClassName =
      item.tone === "success"
        ? "bg-[#0FAF7314] text-[#0FAF73]"
        : item.tone === "warning"
          ? "bg-[#FF8D0014] text-[#FF8D00]"
          : "bg-[#edeff3] text-[#4d4d4d]";

    return (
      <span
        className={`inline-flex min-h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold leading-5 ${badgeClassName}`}
      >
        {item.value}
      </span>
    );
  }

  return <span>{item.value}</span>;
}

function DetailInfoItemCard({
  item,
  showIcon = false,
}: {
  item: DetailInfoItem;
  showIcon?: boolean;
}) {
  const labelPaddingClassName = showIcon ? "pr-[26px]" : "pr-0";

  return (
    <div className="flex w-full flex-col items-start justify-start gap-1 text-right [direction:rtl]">
      <div className="flex min-h-7 w-full items-center justify-start gap-2 text-right text-base font-semibold [direction:rtl]">
        {showIcon ? <DetailInfoIcon item={item} /> : null}

        <div className="text-base font-semibold text-[#1A1A1A]">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      <div
        className={`w-full text-right text-sm font-medium leading-5 text-[#808080] ${labelPaddingClassName}`}
      >
        {item.label}
      </div>
    </div>
  );
}

function DetailInfoCheckBadges({ badges }: { badges: DetailInfoItem[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-[#e0e0e0] pt-4">
      <div className="flex flex-wrap justify-start gap-2 [direction:rtl]">
        {badges.map((badge) => (
          <span
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#edeff3] p-2 text-sm font-semibold leading-5 text-[#4d4d4d]"
            key={badge.label}
          >
            <ColorableSvgIcon
              className="h-5 w-5 shrink-0"
              src={badge.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <span>{badge.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DetailInfoRowCard({ item }: { item: DetailInfoItem }) {
  return (
    <div className="border-b border-[#e0e0e0] last:border-b-0">
      <div className="flex items-center justify-start gap-2 py-4 text-right [direction:rtl]">
        {item.iconSrc ? (
          <ColorableSvgIcon className="h-6 w-6 shrink-0 text-[#4D4D4D]" src={item.iconSrc} />
        ) : null}

        <span className="text-base font-medium text-[#808080]">
          {item.label}
        </span>

        <div className="mr-0">
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
              <span className="text-sm font-medium leading-5 text-[#808080]">
                {row.label}
              </span>
              <strong className="text-sm font-semibold leading-5 text-[#1A1A1A]">
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DetailInfoSectionBlock({ section }: { section: DetailInfoSection }) {
  const columns = section.columns ?? 3;
  const gridClassName =
    columns === 2 ? "grid-cols-2 gap-x-12" : "grid-cols-3 gap-x-4";
  const isRowsLayout = section.layout === "rows";

  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white px-4 pt-4 last:border-b-0">
      <div className="border-b border-[#e0e0e0] pb-4 text-right text-[15px] font-medium leading-5 text-[#808080]">
        {section.title}
      </div>

      {isRowsLayout ? (
        <div>
          {section.items.map((item) => (
            <DetailInfoRowCard
              item={item}
              key={`${section.title}-${item.label}`}
            />
          ))}
        </div>
      ) : (
        <>
          <div
            className={`grid ${gridClassName} justify-items-start gap-y-6 py-5 [direction:rtl]`}
          >
            {section.items.map((item) => (
              <DetailInfoItemCard
                item={item}
                key={`${section.title}-${item.label}`}
                showIcon={section.showIcons === true}
              />
            ))}
          </div>

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
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar onBack={() => goBackToAd(adId)} title={title} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {sections.length > 0 ? (
          sections.map((section) => (
            <DetailInfoSectionBlock key={section.title} section={section} />
          ))
        ) : (
          <div className="bg-white px-4 py-10 text-center text-sm font-medium leading-5 text-[#808080]">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        )}
      </main>
    </PageFrame>
  );
}

