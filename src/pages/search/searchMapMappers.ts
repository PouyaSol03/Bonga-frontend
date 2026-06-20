import { getApiAssetUrl } from "../../api/api";
import type { AdvertisementItem, AdvertisementMapParams } from "../../services/advertisement.service";
import {
  SEARCH_MAP_DEMO_PHOTO,
  type SearchMapBounds,
  type SearchMapListing,
} from "./searchMapData";

const mapRequestLimit = 100;

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

type FeatureItem = {
  key?: string;
  label?: string;
  value?: unknown;
};

type PositionLike = {
  lat?: unknown;
  latitude?: unknown;
  location?: { lat?: unknown; latitude?: unknown; lng?: unknown; longitude?: unknown };
  lng?: unknown;
  long?: unknown;
  longitude?: unknown;
  point?: { lat?: unknown; latitude?: unknown; lng?: unknown; longitude?: unknown };
};

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function getStoredCityId() {
  return window.localStorage.getItem("bonga-selected-city-id") ?? "";
}

function toPersianDigits(value: unknown) {
  return String(value).replace(/[0-9٠-٩]/g, (digit) => persianDigitMap[digit] ?? digit);
}

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const normalizedValue = value.replace(
      /[۰-۹٠-٩]/g,
      (digit) => englishDigitMap[digit] ?? digit,
    );
    const parsed = Number(normalizedValue.replace(/[^\d.-]/g, ""));

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return toPersianDigits(value);
  if (typeof value === "number") return new Intl.NumberFormat("fa-IR").format(value);
  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  return fallback;
}

function withUnit(value: unknown, unit: string, fallback = "-") {
  const text = toText(value, fallback);

  if (!text || text === fallback || text.includes(unit)) return text;

  return `${text} ${unit}`;
}

function formatPrice(value: unknown) {
  const numericValue = toNumber(value);

  if (numericValue === undefined) return toText(value, "توافقی");

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

function getFeatureName(feature: FeatureItem) {
  return String(feature.key ?? feature.label ?? "").toLowerCase();
}

function readFeatureRaw(item: AdvertisementItem, names: string[]) {
  const features = Array.isArray(item.features) ? (item.features as FeatureItem[]) : [];
  const normalizedNames = names.map((name) => name.toLowerCase());
  const feature = features.find((candidate) => {
    const featureName = getFeatureName(candidate);

    return normalizedNames.some((name) => featureName === name || featureName.includes(name));
  });

  return feature?.value;
}

function readFeatureText(item: AdvertisementItem, names: string[], fallback = "") {
  return toText(readFeatureRaw(item, names), fallback);
}

function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return toPersianDigits(value);

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return toPersianDigits(name);
    }
  }

  return "";
}

function readImageSources(item: AdvertisementItem) {
  const images = Array.isArray(item.images) ? item.images : [];
  const imageSources = images
    .map((image) => {
      if (typeof image === "string") return image;

      return image.url ?? image.path ?? "";
    })
    .filter(Boolean);

  if (typeof item.image === "string" && item.image.trim()) {
    imageSources.unshift(item.image);
  }

  const uniqueSources = Array.from(new Set(imageSources));

  return uniqueSources.length > 0
    ? uniqueSources.map((image) => getApiAssetUrl(image))
    : [SEARCH_MAP_DEMO_PHOTO];
}

function getAdMapPosition(item: AdvertisementItem) {
  const position = item as PositionLike;
  const nestedPosition = position.point ?? position.location;
  const latitude = toNumber(
    position.lat ?? position.latitude ?? nestedPosition?.lat ?? nestedPosition?.latitude,
  );
  const longitude = toNumber(
    position.lng ??
      position.long ??
      position.longitude ??
      nestedPosition?.lng ??
      nestedPosition?.longitude,
  );

  if (latitude === undefined || longitude === undefined) return null;

  return { latitude, longitude };
}

function readBadges(item: AdvertisementItem) {
  if (Array.isArray(item.badges)) {
    return item.badges.filter((badge): badge is string => typeof badge === "string" && badge.trim().length > 0);
  }

  const badges: string[] = [];
  const urgent = item.is_urgent ?? item.urgent ?? readFeatureRaw(item, ["is_urgent", "urgent"]);
  const featured = item.is_featured ?? item.featured ?? readFeatureRaw(item, ["is_featured", "featured"]);

  if (urgent === true || urgent === "true" || urgent === 1 || urgent === "1") badges.push("فوری");
  if (featured === true || featured === "true" || featured === 1 || featured === "1") badges.push("ویژه");

  return badges;
}

export function mapAdvertisementToSearchListing(
  item: AdvertisementItem,
  index: number,
): SearchMapListing | null {
  const position = getAdMapPosition(item);

  if (!position) return null;

  const images = readImageSources(item);
  const locationLabel = readNestedText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
    "city",
    "city_name",
  ]);
  const publishedAt = item.published_at ?? readFeatureRaw(item, ["published_at"]);
  const publishedHoursAgo = toNumber(item.published_hours_ago);
  const id = item.id ?? item._id ?? `map-ad-${index + 1}`;
  const price = item.price ?? readFeatureRaw(item, ["price", "total_price", "amount"]);
  const area = item.area ?? readFeatureRaw(item, ["area", "meterage", "building_area"]);
  const rooms = item.rooms ?? readFeatureRaw(item, ["rooms", "room", "bedroom", "bedrooms"]);
  const year = item.year ?? readFeatureRaw(item, ["building_age", "age", "year"]);
  const imageSrc = images[0] ?? SEARCH_MAP_DEMO_PHOTO;

  return {
    id,
    agencyName: toText(
      item.agency ??
        item.agency_name ??
        item.advertiser_name ??
        readFeatureRaw(item, ["advertiser_type"]),
    ),
    area: withUnit(area, "متر"),
    badges: readBadges(item),
    dotId: `dot-${id}`,
    imageClassName: imageSrc === SEARCH_MAP_DEMO_PHOTO ? `ad-card__image--${(index % 4) + 1}` : "",
    imageSrc,
    images,
    latitude: position.latitude,
    locationLabel,
    longitude: position.longitude,
    postedAt:
      toText(publishedAt) ||
      (publishedHoursAgo !== undefined
        ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش`
        : toText(item.created_at ?? item.updated_at)),
    priceLabel: toText(item.price_label, "قیمت"),
    priceValue: formatPrice(price),
    rooms: rooms !== undefined && rooms !== null && rooms !== "" ? `${toText(rooms)} اتاق` : "-",
    showPriceMarker: item.show_price_marker !== false,
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeatureText(item, ["building_age", "age", "year"], toText(year, "-")),
  };
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

export function buildMapQueryParams(bounds: SearchMapBounds | null): AdvertisementMapParams | null {
  if (!bounds) return null;

  const params = getSearchParams();
  const cityId = params.get("city_id") || getStoredCityId();
  const categoryId = params.get("category_id") || params.get("categoryId") || "";

  return {
    categoryId,
    cityId,
    east: roundCoordinate(bounds.east),
    limit: mapRequestLimit,
    north: roundCoordinate(bounds.north),
    south: roundCoordinate(bounds.south),
    west: roundCoordinate(bounds.west),
  };
}

export function getCurrentSearchParams() {
  return getSearchParams();
}

export function getCurrentStoredCityId() {
  return getStoredCityId();
}
