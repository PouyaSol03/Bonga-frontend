import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../../api/api";
import { getStoredAuthSession } from "../../auth/auth-storage";
import { useAdvertisementListQuery, useAdvertisementMapQuery } from "../../hooks/advertisement.hooks";
import { DemoNotice } from "../../components/DemoNotice";
import { useDemoNotice } from "../../hooks/useDemoNotice";
import {
  getBrowserLocation,
  getBrowserLocationNotice,
  type BrowserLocation,
} from "../../lib/browserLocation";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import type {
  AdvertisementItem,
  AdvertisementListParams,
  AdvertisementSearchFilters,
} from "../../services/advertisement.service";
import { HomeSearchScreen } from "../home/components/HomeSearchScreen";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";
import { SearchNoResultsRequestCard } from "./components/SearchNoResultsRequestCard";
import {
  SearchRequestSenderBottomSheet,
  type SearchRequestSenderOption,
} from "./components/SearchRequestBottomSheets";
import LinearMapsLocation from "../../components/(icons)/LinearMapsLocation";
import { SearchMapListView } from "./components/SearchMapListView";
import { SearchMapView } from "./components/SearchMapView";
import {
  SEARCH_MAP_DEMO_PHOTO,
  searchMapCenter,
  searchMapTileConfig,
  type SearchFilterChip,
  type SearchMapBounds,
  type SearchMapCenter,
  type SearchMapListing,
  type SearchMapListingId,
} from "./searchMapData";
import { getIpDefaultMapCenter } from "./searchMapLocation";

type SearchMapMode = "map" | "preview" | "list";
type SearchFilterChipId = "filters" | "category" | "neighborhood" | "area" | "price" | "rooms" | "floor" | "building_age";
type PendingSearchRequest = {
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  title: string;
};

const mapRequestLimit = 100;
const maxBluePriceMarkers = 4;
const selectedCityMapZoom = 12;
const searchDefaultLabel = "جستجو در آگهی‌ها";
const searchMapMinQueryLength = 1;
const requestRoleLabels: Record<string, string> = {
  user: "کاربر",
  real_estate_manager: "مدیر آژانس",
  real_estate_consultant: "مشاور آژانس",
  independent_consultant: "مشاور مستقل",
  "super-admin": "مدیر کل",
};
const requestRoleDescriptions: Record<string, string> = {
  user: "درخواست به‌عنوان متقاضی ملک ثبت می‌شود.",
  real_estate_manager: "درخواست با حساب مدیر آژانس ثبت می‌شود.",
  real_estate_consultant: "درخواست با حساب مشاور آژانس ثبت می‌شود.",
  independent_consultant: "درخواست با حساب مشاور مستقل ثبت می‌شود.",
  "super-admin": "درخواست با دسترسی مدیر کل ثبت می‌شود.",
};

function getRequestSenderIcon(role: string): SearchRequestSenderOption["icon"] {
  if (role === "user") return "user";
  if (role === "independent_consultant") return "building";
  return "agency";
}
const filterableParamKeys = [
  "form_code",
  "from_code",
  "category_id",
  "neighborhood_id",
  "neighborhoods",
  "area_min",
  "area_max",
  "price_min",
  "price_max",
  "rooms",
  "floor",
  "building_age",
  "published_at",
  "is_special",
  "has_image",
  "has_video",
];

const formCodeLabels: Record<string, string> = {
  partnership: "مشارکت",
  "presale-special": "پیش فروش پروژه",
  "daily-apartment-suite": "اجاره روزانه آپارتمان",
  "daily-garden-villa": "اجاره روزانه باغ ویلا",
  "daily-hotel": "اجاره روزانه هتل",
  "daily-office-booth": "اجاره روزانه دفتر کار",
  "rent-apartment": "اجاره آپارتمان",
  "rent-commercial": "اجاره واحد تجاری",
  "rent-factory-workshop": "اجاره کارخانه و کارگاه",
  "rent-garden-villa": "اجاره باغ ویلا",
  "rent-hotel": "اجاره هتل",
  "rent-office": "اجاره واحد اداری",
  "rent-villa-house": "اجاره خانه ویلایی",
  "rent-warehouse": "اجاره انبار و سوله",
  "sale-apartment": "فروش آپارتمان",
  "sale-commercial": "فروش واحد تجاری",
  "sale-factory": "فروش کارخانه و کارگاه",
  "sale-garden-villa": "فروش باغ ویلا",
  "sale-hotel": "فروش هتل",
  "sale-land": "فروش زمین",
  "sale-office": "فروش واحد اداری",
  "sale-villa-house": "فروش خانه ویلایی",
  "sale-warehouse": "فروش انبار و سوله",
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

function getSearchQuery(params: URLSearchParams) {
  return (params.get("query") || params.get("qsearch") || params.get("q") || "").trim();
}

function getApiSearchQuery(params: URLSearchParams) {
  const query = getSearchQuery(params);

  return query.length >= searchMapMinQueryLength ? query : undefined;
}

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function getSearchParamsFromSnapshot(search: string) {
  return new URLSearchParams(search);
}

function getInitialSearchMode(): SearchMapMode {
  return getSearchParams().get("view") === "list" ? "list" : "map";
}

function writeSearchParams(params: URLSearchParams, options: { replace?: boolean } = {}) {
  const queryString = params.toString();
  const nextUrl = queryString ? `/search?${queryString}` : "/search";

  if (options.replace) {
    window.history.replaceState({}, "", nextUrl);
  } else {
    window.history.pushState({}, "", nextUrl);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}


function getFilterOpenTarget(chip: SearchFilterChip): string {
  if (chip.id === "category") return "category";
  if (chip.id === "neighborhood") return "neighborhood";
  if (chip.id === "area") return "area";
  if (chip.id === "price") return "price";
  if (chip.id === "rooms") return "rooms";
  if (chip.id === "floor") return "floor";
  if (chip.id === "building_age") return "age";

  return "filters";
}

function buildFilterPageUrl(chip: SearchFilterChip) {
  const params = getSearchParams();
  const target = getFilterOpenTarget(chip);

  params.set("focus", target);

  return `/search/filter?${params.toString()}`;
}

function getActiveFilterCount(params: URLSearchParams) {
  const uniqueFilterKeys = new Set<string>();

  filterableParamKeys.forEach((key) => {
    if (!params.get(key)) return;

    if (key === "from_code") {
      uniqueFilterKeys.add("form_code");
      return;
    }

    if (key === "category_id") {
      uniqueFilterKeys.add("category_id");
      return;
    }

    if (key === "neighborhoods") {
      uniqueFilterKeys.add("neighborhood_id");
      return;
    }

    if (key === "area_min" || key === "area_max") {
      uniqueFilterKeys.add("area");
      return;
    }

    if (key === "price_min" || key === "price_max") {
      uniqueFilterKeys.add("price");
      return;
    }

    uniqueFilterKeys.add(key);
  });

  return uniqueFilterKeys.size;
}

function formatRangeChipLabel(title: string, minimum?: string | null, maximum?: string | null) {
  if (minimum && maximum) return `${title}: ${toPersianDigits(minimum)} تا ${toPersianDigits(maximum)}`;
  if (minimum) return `${title}: از ${toPersianDigits(minimum)}`;
  if (maximum) return `${title}: تا ${toPersianDigits(maximum)}`;

  return title;
}

function getDynamicFilterChips(search: string): SearchFilterChip[] {
  const params = getSearchParamsFromSnapshot(search);
  const formCode = params.get("form_code") || params.get("from_code") || "";
  const neighborhoods = (params.get("neighborhood_id") || params.get("neighborhoods") || "")
    .split(/[_،,]/)
    .filter(Boolean);
  const activeFilterCount = getActiveFilterCount(params);
  const chips: SearchFilterChip[] = [
    {
      id: "filters",
      label: activeFilterCount > 0 ? `${toPersianDigits(activeFilterCount)} فیلتر` : "فیلترها",
      isActive: activeFilterCount > 0,
    },
  ];

  chips.push({
    id: "category",
    label: formCode ? formCodeLabels[formCode] ?? formCode : "دسته‌بندی",
    isActive: Boolean(formCode),
    removable: Boolean(formCode),
  });

  if (neighborhoods.length > 0) {
    chips.push({
      id: "neighborhood",
      label: `${toPersianDigits(neighborhoods.length)} محله`,
      isActive: true,
      removable: true,
    });
  } else {
    chips.push({ id: "neighborhood", label: "محله" });
  }

  if (params.get("area_min") || params.get("area_max")) {
    chips.push({
      id: "area",
      label: formatRangeChipLabel("متراژ", params.get("area_min"), params.get("area_max")),
      isActive: true,
      removable: true,
    });
  } else {
    chips.push({ id: "area", label: "متراژ" });
  }

  if (params.get("price_min") || params.get("price_max")) {
    chips.push({
      id: "price",
      label: formatRangeChipLabel("قیمت", params.get("price_min"), params.get("price_max")),
      isActive: true,
      removable: true,
    });
  } else {
    chips.push({ id: "price", label: "قیمت" });
  }

  if (params.get("rooms")) {
    chips.push({ id: "rooms", label: `اتاق: ${toPersianDigits(params.get("rooms")?.replace(/_/g, "، ") ?? "")}`, isActive: true, removable: true });
  }

  if (params.get("floor")) {
    chips.push({ id: "floor", label: `طبقه: ${toPersianDigits(params.get("floor")?.replace(/_/g, "، ") ?? "")}`, isActive: true, removable: true });
  }

  if (params.get("building_age")) {
    chips.push({ id: "building_age", label: `سن ساخت: ${toPersianDigits(params.get("building_age") ?? "")}`, isActive: true, removable: true });
  }

  return orderResultHeaderChips(chips);
}

function orderResultHeaderChips(chips: SearchFilterChip[]) {
  const [filtersChip, ...filterChips] = chips;
  const activeChips = filterChips.filter((chip) => chip.isActive);
  const inactiveChips = filterChips.filter((chip) => !chip.isActive);

  return filtersChip
    ? [filtersChip, ...activeChips, ...inactiveChips]
    : [...activeChips, ...inactiveChips];
}

function removeFilterFromSearch(chip: SearchFilterChip) {
  const params = getSearchParams();

  switch (chip.id as SearchFilterChipId) {
    case "category":
      params.delete("form_code");
      params.delete("from_code");
      break;
    case "neighborhood":
      params.delete("neighborhood_id");
      params.delete("neighborhoods");
      break;
    case "area":
      params.delete("area_min");
      params.delete("area_max");
      break;
    case "price":
      params.delete("price_min");
      params.delete("price_max");
      break;
    case "rooms":
      params.delete("rooms");
      break;
    case "floor":
      params.delete("floor");
      break;
    case "building_age":
      params.delete("building_age");
      break;
    default:
      break;
  }

  params.delete("focus");
  writeSearchParams(params);
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

function readFeatureRaw(item: AdvertisementItem, labels: string[]) {
  const features = Array.isArray(item.features) ? item.features : [];
  const normalizedLabels = labels.map((label) => label.toLowerCase());
  const feature = features.find((candidate) => {
    const featureItem = candidate as { key?: unknown; label?: unknown };
    const featureName = String(featureItem.key ?? featureItem.label ?? "").toLowerCase();

    return normalizedLabels.some(
      (label) => featureName === label || featureName.includes(label),
    );
  });

  return feature?.value;
}

function readFeature(item: AdvertisementItem, labels: string[], fallback = "") {
  return toText(readFeatureRaw(item, labels), fallback);
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

type PositionContainer = Record<string, unknown> & {
  coordinates?: unknown;
  lat?: unknown;
  latitude?: unknown;
  lng?: unknown;
  long?: unknown;
  longitude?: unknown;
};

type PositionLike = PositionContainer & {
  address?: PositionContainer;
  coordinate?: PositionContainer;
  geo?: PositionContainer;
  location?: PositionContainer;
  map?: PositionContainer;
  point?: PositionContainer;
};

function isValidCoordinatePair(latitude: number, longitude: number) {
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

function isLikelyIranLatitude(value: number) {
  return value >= 24 && value <= 41;
}

function isLikelyIranLongitude(value: number) {
  return value >= 43 && value <= 65;
}

function normalizeCoordinatePair(first: unknown, second: unknown) {
  const firstNumber = toNumber(first);
  const secondNumber = toNumber(second);

  if (firstNumber === undefined || secondNumber === undefined) return null;

  if (isLikelyIranLongitude(firstNumber) && isLikelyIranLatitude(secondNumber)) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  if (isLikelyIranLatitude(firstNumber) && isLikelyIranLongitude(secondNumber)) {
    return { latitude: firstNumber, longitude: secondNumber };
  }

  if (Math.abs(firstNumber) > 90 && Math.abs(secondNumber) <= 90) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  if (isValidCoordinatePair(firstNumber, secondNumber)) {
    return { latitude: firstNumber, longitude: secondNumber };
  }

  if (isValidCoordinatePair(secondNumber, firstNumber)) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  return null;
}

function readPositionFromContainer(container?: PositionContainer | null) {
  if (!container) return null;

  const coordinateArray = Array.isArray(container.coordinates)
    ? container.coordinates
    : null;

  if (coordinateArray && coordinateArray.length >= 2) {
    const normalizedCoordinates = normalizeCoordinatePair(
      coordinateArray[0],
      coordinateArray[1],
    );

    if (normalizedCoordinates) return normalizedCoordinates;
  }

  const latitude = toNumber(container.lat ?? container.latitude);
  const longitude = toNumber(container.lng ?? container.long ?? container.longitude);

  if (latitude === undefined || longitude === undefined) return null;
  if (!isValidCoordinatePair(latitude, longitude)) return null;

  return { latitude, longitude };
}

function getAdMapPosition(item: AdvertisementItem) {
  const position = item as PositionLike;
  const directPosition = readPositionFromContainer(position);

  if (directPosition) return directPosition;

  for (const nestedPosition of [
    position.point,
    position.location,
    position.geo,
    position.coordinate,
    position.map,
    position.address,
  ]) {
    const parsedPosition = readPositionFromContainer(nestedPosition);

    if (parsedPosition) return parsedPosition;
  }

  return null;
}

function readBadges(item: AdvertisementItem) {
  if (Array.isArray(item.badges)) {
    return item.badges.filter(
      (badge): badge is string => typeof badge === "string" && badge.trim().length > 0,
    );
  }

  const badges: string[] = [];
  const urgent = item.is_urgent ?? item.urgent ?? readFeatureRaw(item, ["is_urgent", "urgent"]);
  const featured = item.is_featured ?? item.featured ?? readFeatureRaw(item, ["is_featured", "featured"]);

  if (urgent === true || urgent === "true" || urgent === 1 || urgent === "1") badges.push("فوری");
  if (featured === true || featured === "true" || featured === 1 || featured === "1") badges.push("ویژه");

  return badges;
}

function mapAdvertisementToSearchListing(
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
  const publishedHoursAgo = toNumber(item.published_hours_ago);
  const id = item.id ?? item._id ?? `map-ad-${index + 1}`;

  return {
    id,
    agencyName: toText(item.agency ?? item.agency_name ?? item.advertiser_name ?? readFeatureRaw(item, ["advertiser_type"])),
    area: readFeature(item, ["area", "meterage", "building_area", "متراژ"], item.area ? `${toText(item.area)} متر` : "-"),
    badges: readBadges(item),
    dotId: `dot-${id}`,
    imageClassName: images[0] === SEARCH_MAP_DEMO_PHOTO ? `ad-card__image--${(index % 4) + 1}` : "",
    imageSrc: images[0] ?? SEARCH_MAP_DEMO_PHOTO,
    images,
    latitude: position.latitude,
    locationLabel,
    longitude: position.longitude,
    postedAt:
      publishedHoursAgo !== undefined
        ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش`
        : "",
    priceLabel: toText(item.price_label, "قیمت"),
    priceValue: formatPrice(item.price ?? readFeatureRaw(item, ["price", "total_price", "amount"])),
    rooms: readFeature(item, ["rooms", "room", "bedroom", "bedrooms", "اتاق", "خواب"], item.rooms ? `${toText(item.rooms)} اتاق` : "-"),
    showPriceMarker: true,
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeature(item, ["building_age", "age", "year", "سال ساخت"], toText(item.year, "-")),
  };
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

function readSearchFilters(params: URLSearchParams): AdvertisementSearchFilters {
  return {
    areaMax: params.get("area_max") || undefined,
    areaMin: params.get("area_min") || undefined,
    buildingAge: params.get("building_age") || undefined,
    categoryId: params.get("category_id") || undefined,
    floor: params.get("floor") || undefined,
    formCode: params.get("form_code") || params.get("from_code") || undefined,
    hasImage: params.get("has_image") || undefined,
    hasVideo: params.get("has_video") || undefined,
    isSpecial: params.get("is_special") || undefined,
    neighborhoodId:
      params.get("neighborhood_id") || params.get("neighborhoods") || undefined,
    priceMax: params.get("price_max") || undefined,
    priceMin: params.get("price_min") || undefined,
    publishedAt: params.get("published_at") || undefined,
    query: getApiSearchQuery(params),
    rooms: params.get("rooms") || undefined,
  };
}

function buildMapQueryParams(bounds: SearchMapBounds | null, search: string) {
  if (!bounds) return null;

  const params = getSearchParamsFromSnapshot(search);
  const selectedCity = readStoredSelectedCity();
  const cityId = params.get("city_id") || selectedCity?.id || "";
  const filters = readSearchFilters(params);

  return {
    filters,
    ...(cityId ? { cityId } : {}),
    east: roundCoordinate(bounds.east),
    limit: mapRequestLimit,
    north: roundCoordinate(bounds.north),
    south: roundCoordinate(bounds.south),
    west: roundCoordinate(bounds.west),
  };
}

function buildListQueryParams(search: string): AdvertisementListParams {
  const params = getSearchParamsFromSnapshot(search);

  const selectedCity = readStoredSelectedCity();

  return {
    cityId: params.get("city_id") || selectedCity?.id || undefined,
    filters: readSearchFilters(params),
    page: 1,
    perPage: 20,
  };
}

function hasSearchCriteria(search: string) {
  const params = getSearchParamsFromSnapshot(search);

  return (
    getActiveFilterCount(params) > 0 ||
    Boolean(getApiSearchQuery(params))
  );
}

function filterListings(listings: SearchMapListing[]) {
  return listings;
}

function getInitialMapCenter(): SearchMapCenter {
  const selectedCity = readStoredSelectedCity();

  if (
    selectedCity?.latitude !== undefined &&
    selectedCity.longitude !== undefined
  ) {
    return {
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      zoom: selectedCityMapZoom,
    };
  }

  return {
    ...searchMapCenter,
    zoom: selectedCityMapZoom,
  };
}

function getRequestSenderOptions(): SearchRequestSenderOption[] {
  const session = getStoredAuthSession();
  const sessionRoles = session?.roles ?? [];
  const options: SearchRequestSenderOption[] = [
    {
      description: requestRoleDescriptions.user,
      id: "user",
      icon: "user",
      title: requestRoleLabels.user,
    },
  ];

  sessionRoles.forEach((role) => {
    if (!role?.slug || role.slug === "user") return;
    if (options.some((option) => option.id === role.slug)) return;

    options.push({
      description: requestRoleDescriptions[role.slug] ?? "درخواست با این حساب ثبت می‌شود.",
      id: role.slug,
      icon: getRequestSenderIcon(role.slug),
      title: role.name || requestRoleLabels[role.slug] || role.slug,
    });
  });

  return options;
}

export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<SearchMapListingId | null>(null);
  const [seenListingIds, setSeenListingIds] = useState<Set<SearchMapListingId>>(
    () => new Set(),
  );
  const [mode, setMode] = useState<SearchMapMode>(getInitialSearchMode);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<BrowserLocation | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmptyStateDismissed, setIsEmptyStateDismissed] = useState(false);
  const [searchInitialView, setSearchInitialView] = useState<"search" | "saved">("search");
  const [mapCenter, setMapCenter] = useState<SearchMapCenter>(getInitialMapCenter);
  const [mapCenterSignal, setMapCenterSignal] = useState(0);
  const [mapBounds, setMapBounds] = useState<SearchMapBounds | null>(null);
  const [pendingSearchRequest, setPendingSearchRequest] = useState<PendingSearchRequest | null>(null);
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);
  const didResolveIpLocationRef = useRef(false);
  const [searchSnapshot, setSearchSnapshot] = useState(() => window.location.search);
  const { message, showNotice } = useDemoNotice();
  const requestSenderOptions = useMemo(() => getRequestSenderOptions(), []);
  const currentSearch = searchSnapshot;
  const chips = useMemo(() => getDynamicFilterChips(currentSearch), [currentSearch]);
  const currentSearchQuery = useMemo(() => {
    const params = getSearchParamsFromSnapshot(currentSearch);

    return getSearchQuery(params);
  }, [currentSearch]);
  const queryLabel = useMemo(() => {
    return currentSearchQuery || searchDefaultLabel;
  }, [currentSearchQuery]);
  const mapQueryParams = useMemo(() => buildMapQueryParams(mapBounds, currentSearch), [currentSearch, mapBounds]);
  const listQueryParams = useMemo(() => buildListQueryParams(currentSearch), [currentSearch]);
  const hasActiveSearchCriteria = useMemo(() => hasSearchCriteria(currentSearch), [currentSearch]);
  const mapQuery = useAdvertisementMapQuery(mapQueryParams);
  const listQuery = useAdvertisementListQuery(listQueryParams);
  const apiListings = useMemo(
    () =>
      (mapQuery.data ?? [])
        .map((item, index) => mapAdvertisementToSearchListing(item, index))
        .filter((item): item is SearchMapListing => item !== null),
    [mapQuery.data],
  );
  const apiListListings = useMemo(
    () =>
      (listQuery.data?.data ?? [])
        .map((item, index) => {
          const listing = mapAdvertisementToSearchListing(item, index);

          if (listing) return listing;

          return mapAdvertisementToSearchListing(
            {
              ...item,
              lat: mapCenter.latitude,
              lng: mapCenter.longitude,
            },
            index,
          );
        })
        .filter((item): item is SearchMapListing => item !== null),
    [listQuery.data, mapCenter.latitude, mapCenter.longitude],
  );
  const listingSource = mode === "list" ? apiListListings : apiListings;
  const isMapLoading = !mapQueryParams || (mapQuery.isFetching && apiListings.length === 0);
  const isListLoading = listQuery.isFetching && apiListListings.length === 0;
  const visibleListings = useMemo(
    () => filterListings(listingSource),
    [listingSource],
  );
  const bluePriceMarkerListingIds = useMemo(() => {
    const markerIds = new Set<SearchMapListingId>();

    for (const listing of visibleListings) {
      if (markerIds.size >= maxBluePriceMarkers) break;
      if (listing.showPriceMarker === false) continue;
      if (
        selectedListingId != null &&
        String(listing.id) === String(selectedListingId)
      ) {
        continue;
      }

      markerIds.add(listing.id);
    }

    return markerIds;
  }, [selectedListingId, visibleListings]);

  useEffect(() => {
    const handleSearchSnapshotChange = () => {
      const nextSearch = window.location.search;

      setSearchSnapshot(nextSearch);
      setMode(getInitialSearchMode());
      setSelectedListingId(null);
      setIsEmptyStateDismissed(false);
    };

    window.addEventListener("popstate", handleSearchSnapshotChange);

    return () => window.removeEventListener("popstate", handleSearchSnapshotChange);
  }, []);

  useEffect(() => {
    const params = getSearchParams();
    const hasLegacySearchQuery = params.has("qsearch") || params.has("q");

    if (!hasLegacySearchQuery) return;

    const query = getSearchQuery(params);

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    params.delete("qsearch");
    params.delete("q");
    writeSearchParams(params, { replace: true });
  }, []);

  useEffect(() => {
    if (didResolveIpLocationRef.current) return;
    const selectedCity = readStoredSelectedCity();
    if (
      selectedCity?.latitude !== undefined &&
      selectedCity.longitude !== undefined
    ) {
      return;
    }

    didResolveIpLocationRef.current = true;

    void getIpDefaultMapCenter().then((ipCenter) => {
      if (!ipCenter) return;

      setMapCenter((current) => {
        if (current.latitude !== searchMapCenter.latitude || current.longitude !== searchMapCenter.longitude) {
          return current;
        }

        return ipCenter;
      });
    });
  }, []);
  useEffect(() => {
    if (!mapQuery.isError) return;

    showNotice(getApiErrorMessage(mapQuery.error, "دریافت آگهی‌های نقشه با خطا مواجه شد."));
  }, [mapQuery.error, mapQuery.isError, showNotice]);

  useEffect(() => {
    if (!listQuery.isError) return;

    showNotice(getApiErrorMessage(listQuery.error, "دریافت لیست آگهی‌ها با خطا مواجه شد."));
  }, [listQuery.error, listQuery.isError, showNotice]);

  useEffect(() => {
    if (selectedListingId == null) return;

    const selectedListingExists = visibleListings.some(
      (listing) => String(listing.id) === String(selectedListingId),
    );

    if (!selectedListingExists) {
      setSelectedListingId(null);
      setMode("map");
    }
  }, [selectedListingId, visibleListings]);

  const handleBoundsChange = useCallback((bounds: SearchMapBounds) => {
    setMapBounds((current) => {
      if (
        current &&
        Math.abs(current.north - bounds.north) < 0.00001 &&
        Math.abs(current.south - bounds.south) < 0.00001 &&
        Math.abs(current.east - bounds.east) < 0.00001 &&
        Math.abs(current.west - bounds.west) < 0.00001
      ) {
        return current;
      }

      return bounds;
    });
  }, []);

  const toggleChip = useCallback((chip: SearchFilterChip) => {
    window.history.pushState({}, "", buildFilterPageUrl(chip));
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const handleRemoveChip = useCallback((chip: SearchFilterChip) => {
    removeFilterFromSearch(chip);
  }, []);

  const handleSelectListing = useCallback((listing: SearchMapListing) => {
    setSeenListingIds((current) => {
      if (current.has(listing.id)) return current;

      const next = new Set(current);
      next.add(listing.id);
      return next;
    });
    setSelectedListingId(listing.id);
    setMode("preview");
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedListingId(null);
    setMode("map");
  }, []);

  const handleSliderActiveListing = useCallback((listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
  }, []);

  const handleSearchResult = useCallback((item: { title: string }) => {
    const params = getSearchParams();
    const cityId = params.get("city_id") || "";

    params.set("query", item.title);
    params.delete("qsearch");
    params.delete("q");

    if (cityId) {
      params.set("city_id", cityId);
    }

    params.delete("focus");
    params.delete("categoryId");
    params.delete("view");
    setIsSearchOpen(false);
    setSelectedListingId(null);
    setMode("map");
    writeSearchParams(params, { replace: true });
  }, []);

  const handleLiveSearchQueryChange = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    const params = getSearchParams();
    const currentQuery = getSearchQuery(params);

    if (!trimmedQuery && !currentQuery && !params.get("qsearch") && !params.get("q")) return;
    if (trimmedQuery && currentQuery === trimmedQuery && !params.get("qsearch") && !params.get("q")) return;

    if (trimmedQuery) {
      params.set("query", trimmedQuery);
    } else {
      params.delete("query");
    }

    params.delete("qsearch");
    params.delete("q");
    params.delete("focus");
    params.delete("view");
    setSelectedListingId(null);
    setMode("map");
    writeSearchParams(params, { replace: true });
  }, []);

  const handleEmptyRequestSubmit = useCallback((title: string) => {
    const params = getSearchParams();
    const requestFilters: Record<string, string> = {};
    params.forEach((value, key) => {
      requestFilters[key] = value;
    });
    const request = {
      createdAt: new Date().toISOString(),
      filters: requestFilters,
      id: `search-request-${Date.now()}`,
      title: title || currentSearchQuery || "درخواست ملک مشابه",
    };

    setPendingSearchRequest(request);
  }, [currentSearchQuery]);

  const handleConfirmSearchRequest = useCallback((senderId: string) => {
    if (!pendingSearchRequest) return;

    const sender = requestSenderOptions.find((option) => option.id === senderId)
      ?? requestSenderOptions[0]
      ?? {
        description: requestRoleDescriptions.user,
        id: "user",
        icon: "user" as const,
        title: requestRoleLabels.user,
      };
    const request = {
      ...pendingSearchRequest,
      senderLabel: sender.title,
      senderRole: sender.id || "user",
    };

    try {
      const storageKey = "bonga-property-search-requests";
      const stored = window.localStorage.getItem(storageKey);
      const current = stored ? JSON.parse(stored) : [];
      const requests = Array.isArray(current) ? current : [];
      window.localStorage.setItem(storageKey, JSON.stringify([request, ...requests]));
    } catch {
      // The request UI still succeeds even when browser storage is unavailable.
    }

    setPendingSearchRequest(null);
    setIsRequestSuccessOpen(true);
  }, [pendingSearchRequest, requestSenderOptions]);

  const locateUser = useCallback(() => {
    if (isLocating) return;

    setIsLocating(true);
    showNotice("در حال دریافت موقعیت شما...");

    void getBrowserLocation({ maximumAge: 30_000, timeout: 15_000 })
      .then((location) => {
        setIsLocated(true);
        setUserLocation(location);
        setMapCenter({
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 16,
        });
        setMapCenterSignal((current) => current + 1);
        setSelectedListingId(null);
        setMode("map");
        showNotice("موقعیت شما روی نقشه مشخص شد");
      })
      .catch((error) => {
        setIsLocated(false);
        showNotice(getBrowserLocationNotice(error));
      })
      .finally(() => {
        setIsLocating(false);
      });
  }, [isLocating, showNotice]);

  const openSearch = useCallback(() => {
    setSearchInitialView("search");
    setIsSearchOpen(true);
  }, []);

  const openSavedSearches = useCallback(() => {
    setSearchInitialView("saved");
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const returnToMapView = useCallback(() => {
    const params = getSearchParams();
    params.delete("view");
    writeSearchParams(params, { replace: true });
    setMode("map");
  }, []);

  const isListPreviewOpen = mode === "preview";
  const isFullListOpen = mode === "list";
  const showMapEmptyState =
    hasActiveSearchCriteria &&
    mapQuery.isSuccess &&
    !isMapLoading &&
    visibleListings.length === 0;
  const showListEmptyState =
    hasActiveSearchCriteria &&
    listQuery.isSuccess &&
    !isListLoading &&
    apiListListings.length === 0;

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#f0f0f0]">
      {isFullListOpen ? (
        <SearchMapListView
          hasEmptyResults={showListEmptyState}
          isLoading={isListLoading}
          listings={apiListListings}
          onMapClick={returnToMapView}
          onRequestSubmit={handleEmptyRequestSubmit}
        />
      ) : (
        <SearchMapView
          center={mapCenter}
          centerSignal={mapCenterSignal}
          listings={visibleListings}
          priceMarkerListingIds={bluePriceMarkerListingIds}
          seenListingIds={seenListingIds}
          selectedListingId={selectedListingId}
          tileConfig={searchMapTileConfig}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          onMapClick={handleMapClick}
          onSelectListing={handleSelectListing}
        />
      )}

      {!isFullListOpen && showMapEmptyState && !isEmptyStateDismissed ? (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 top-[116px] z-400 overflow-y-auto bg-white pb-20 pt-4">
          <SearchNoResultsRequestCard onSubmit={handleEmptyRequestSubmit} />
          <button
            className="absolute bottom-4 left-1/2 flex h-10 min-w-[99px] -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-sm font-bold leading-5 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={() => setIsEmptyStateDismissed(true)}
            type="button"
          >
            <LinearMapsLocation className="h-5 w-5" />
            <span>نقشه</span>
          </button>
        </div>
      ) : null}

      <SearchMapHeader
        savedCount={2}
        chips={chips}
        onChipClick={toggleChip}
        onChipRemove={handleRemoveChip}
        queryLabel={queryLabel}
        onSearchClick={openSearch}
        onSavedClick={openSavedSearches}
      />


      <SearchMapFloatingActions
        isDrawing={isDrawMode}
        isHidden={mode !== "map" || (showMapEmptyState && !isEmptyStateDismissed)}
        isLocated={isLocated}
        isLocating={isLocating}
        onLocateClick={locateUser}
        onHandClick={() => {
          setIsDrawMode((current) => !current);
          showNotice(isDrawMode ? "انتخاب محدوده پایان یافت" : "محدوده موردنظر را روی نقشه مشخص کنید");
        }}
        onListClick={() => {
          const params = getSearchParams();
          params.set("view", "list");
          params.delete("focus");
          writeSearchParams(params, { replace: true });
          setSelectedListingId(null);
          setMode("list");
        }}
      />

      <SearchMapListingSlider
        isLoading={isMapLoading}
        isOpen={isListPreviewOpen}
        listings={visibleListings}
        selectedListingId={selectedListingId}
        onActiveListingChange={handleSliderActiveListing}
      />
      <HomeSearchScreen
        advertisementSearchCityId={listQueryParams.cityId}
        advertisementSearchPerPage={20}
        initialQuery={currentSearchQuery}
        initialView={searchInitialView}
        isOpen={isSearchOpen}
        minSearchQueryLength={searchMapMinQueryLength}
        onClose={closeSearch}
        onQuerySearchChange={handleLiveSearchQueryChange}
        onSelectResult={handleSearchResult}
      />
      <SearchRequestSenderBottomSheet
        isOpen={pendingSearchRequest !== null || isRequestSuccessOpen}
        isSuccess={isRequestSuccessOpen}
        onClose={() => {
          setPendingSearchRequest(null);
          setIsRequestSuccessOpen(false);
        }}
        onOpenResults={() => {
          window.location.assign("/account/requests?tab=results");
        }}
        onSelect={handleConfirmSearchRequest}
        options={requestSenderOptions}
      />
      <DemoNotice message={message} />
    </div>
  );
}
