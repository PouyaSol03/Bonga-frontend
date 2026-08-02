import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./searchMap.css";
import {
  getApiAssetUrl,
  getApiErrorMessage,
  isUnauthorizedApiError,
} from "../../api/api";
import { getStoredAuthSession } from "../../auth/auth-storage";
import { useAdvertisementListQuery, useAdvertisementMapQuery } from "../../hooks/advertisement.hooks";
import { usePublisherOptions } from "../../hooks/publisher-options.hooks";
import { useCreatePropertyRequestMutation } from "../../hooks/property-request.hooks";
import {
  useSavedSearchesQuery,
  useSaveSearchMutation,
} from "../../hooks/saved-search.hooks";
import { TransientNotice } from "../../components/TransientNotice";
import { useTransientNotice } from "../../hooks/useTransientNotice";
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
import { SearchMapSearchScreen } from "./components/SearchMapSearchScreen";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";
import { SearchRequestSenderBottomSheet } from "./components/SearchRequestBottomSheets";
import { SearchMapListView } from "./components/SearchMapListView";
import {
  SearchMapQuickFilterBottomSheet,
  type SearchMapQuickFilterId,
} from "./components/SearchMapQuickFilterBottomSheet";
import { SearchNoResultsView } from "./components/SearchNoResultsView";
import { SearchMapView } from "./components/SearchMapView";
import { SearchMapGeofenceControls } from "./components/SearchMapGeofenceControls";
import { SearchMapResultsSummary } from "./components/SearchMapResultsSummary";
import type {
  DrawingState,
  GeofenceResult,
  GeofenceValidationResult,
} from "./geofence/geofenceTypes";
import { serializeGeofenceForApi } from "./geofence/geofenceApi";
import {
  SEARCH_MAP_FALLBACK_IMAGE,
  searchMapCenter,
  searchMapTileConfig,
  type SearchFilterChip,
  type SearchMapBounds,
  type SearchMapCenter,
  type SearchMapListing,
  type SearchMapListingId,
} from "./searchMapData";
import { getIpDefaultMapCenter } from "./searchMapLocation";
import type { SavedSearchItem, SaveSearchInput } from "../../services/saved-search.service";
import { getPropertyRequestScope } from "../../services/property-request.service";
import { getStoredBackTarget, replaceRoute } from "../../routes/navigation";

type SearchMapMode = "map" | "preview" | "list";
type SearchFilterChipId = "filters" | "category" | "neighborhood" | "area" | "price" | "rooms" | "floor" | "building_age";
type InvalidGeofenceResult = Exclude<
  GeofenceValidationResult,
  { isValid: true }
>;

type GeofenceHistoryEntry = {
  result: GeofenceResult;
  state: "preview" | "confirmed";
};

type PendingSearchRequest = {
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  title: string;
};

const mapRequestLimit = 100;
const emptyListingIds = new Set<SearchMapListingId>();
const maxBluePriceMarkers = 4;
const selectedCityMapZoom = 12;
const searchDefaultLabel = "جستجو در آگهی‌ها";
const searchMapMinQueryLength = 1;
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

  const currentHistoryState = window.history.state ?? {};

  if (options.replace) {
    window.history.replaceState(currentHistoryState, "", nextUrl);
  } else {
    window.history.pushState(currentHistoryState, "", nextUrl);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

function navigateToLoginRequired(action: string) {
  const returnTo = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({ action, returnTo });

  window.history.pushState({}, "", `/login-required?${params.toString()}`);
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
    : [SEARCH_MAP_FALLBACK_IMAGE];
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
  const description = toText(item.description ?? item.short_description);
  const id = item.id ?? item._id ?? `map-ad-${index + 1}`;

  return {
    id,
    agencyName: toText(item.agency ?? item.agency_name ?? item.advertiser_name ?? readFeatureRaw(item, ["advertiser_type"])),
    area: readFeature(item, ["area", "meterage", "building_area", "متراژ"], item.area ? `${toText(item.area)} متر` : "-"),
    badges: readBadges(item),
    dotId: `dot-${id}`,
    imageClassName: images[0] === SEARCH_MAP_FALLBACK_IMAGE ? `ad-card__image--${(index % 4) + 1}` : "",
    imageSrc: images[0] ?? SEARCH_MAP_FALLBACK_IMAGE,
    images,
    latitude: position.latitude,
    locationLabel,
    longitude: position.longitude,
    postedAt: description,
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

function buildMapQueryParams(
  bounds: SearchMapBounds | null,
  search: string,
  geofence?: string,
) {
  if (!bounds) return null;

  const params = getSearchParamsFromSnapshot(search);
  const selectedCity = readStoredSelectedCity();
  const cityId = params.get("city_id") || selectedCity?.id || "";
  const filters = readSearchFilters(params);

  return {
    filters,
    ...(cityId ? { cityId } : {}),
    east: roundCoordinate(bounds.east),
    ...(geofence ? { geofence } : {}),
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

function buildSaveSearchInput(
  search: string,
  chips: SearchFilterChip[],
): SaveSearchInput | null {
  const params = getSearchParamsFromSnapshot(search);

  params.delete("focus");
  params.delete("view");
  if (!hasSearchCriteria(`?${params.toString()}`)) return null;

  const selectedCity = readStoredSelectedCity();
  if (!params.get("city_id") && selectedCity?.id) {
    params.set("city_id", selectedCity.id);
  }

  const query = getSearchQuery(params);
  const content = chips
    .filter((chip) => chip.id !== "filters" && chip.isActive)
    .map((chip) => chip.label);
  const filters = Object.fromEntries(
    Array.from(params.entries())
      .filter(([key]) => !["query", "q", "qsearch"].includes(key))
      .map(([key, value]) => {
        const numericValue = Number(value);
        return [key, value !== "" && Number.isFinite(numericValue) ? numericValue : value];
      }),
  );

  return {
    content,
    filters,
    title: query || content[0] || "جستجوی آگهی",
    url: `/search?${params.toString()}`,
  };
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

export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<SearchMapListingId | null>(null);
  const [seenListingIds, setSeenListingIds] = useState<Set<SearchMapListingId>>(
    () => new Set(),
  );
  const [mode, setMode] = useState<SearchMapMode>(getInitialSearchMode);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>("idle");
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null);
  const [geofenceError, setGeofenceError] = useState<string | null>(null);
  const [geofenceHistory, setGeofenceHistory] = useState<GeofenceHistoryEntry | null>(null);
  const [geofenceResetSignal, setGeofenceResetSignal] = useState(0);
  const [isLocated, setIsLocated] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<BrowserLocation | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickFilterId, setQuickFilterId] = useState<SearchMapQuickFilterId | null>(null);
  const [searchInitialView, setSearchInitialView] = useState<"search" | "saved">("search");
  const [mapCenter, setMapCenter] = useState<SearchMapCenter>(getInitialMapCenter);
  const [mapCenterSignal, setMapCenterSignal] = useState(0);
  const [mapResizeSignal, setMapResizeSignal] = useState(0);
  const [mapBounds, setMapBounds] = useState<SearchMapBounds | null>(null);
  const [pendingSearchRequest, setPendingSearchRequest] = useState<PendingSearchRequest | null>(null);
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);
  const [savedSearchUrl, setSavedSearchUrl] = useState<string | null>(null);
  const didResolveIpLocationRef = useRef(false);
  const [searchSnapshot, setSearchSnapshot] = useState(() => window.location.search);
  const { message, showNotice } = useTransientNotice();
  const requestSenderOptions = usePublisherOptions(pendingSearchRequest !== null);
  const createPropertyRequestMutation = useCreatePropertyRequestMutation();
  const requestResultsPath =
    getPropertyRequestScope().ownerType === "agency"
      ? "/account/dashboard/requests?tab=results"
      : "/account/requests?tab=results";
  const isAuthenticated = Boolean(getStoredAuthSession());
  const savedSearchesQuery = useSavedSearchesQuery(isAuthenticated);
  const saveSearchMutation = useSaveSearchMutation();
  const currentSearch = searchSnapshot;
  const chips = useMemo(() => getDynamicFilterChips(currentSearch), [currentSearch]);
  const currentSearchQuery = useMemo(() => {
    const params = getSearchParamsFromSnapshot(currentSearch);

    return getSearchQuery(params);
  }, [currentSearch]);
  const queryLabel = useMemo(() => {
    return currentSearchQuery || searchDefaultLabel;
  }, [currentSearchQuery]);
  const confirmedGeofence = useMemo(
    () =>
      drawingState === "confirmed" && geofenceResult
        ? serializeGeofenceForApi(geofenceResult)
        : undefined,
    [drawingState, geofenceResult],
  );
  const mapQueryParams = useMemo(
    () => buildMapQueryParams(mapBounds, currentSearch, confirmedGeofence),
    [confirmedGeofence, currentSearch, mapBounds],
  );
  const listQueryParams = useMemo(() => buildListQueryParams(currentSearch), [currentSearch]);
  const hasActiveSearchCriteria = useMemo(() => hasSearchCriteria(currentSearch), [currentSearch]);
  const saveSearchInput = useMemo(
    () => buildSaveSearchInput(currentSearch, chips),
    [chips, currentSearch],
  );
  const isCurrentSearchSaved = Boolean(
    saveSearchInput &&
      (savedSearchUrl === saveSearchInput.url ||
        savedSearchesQuery.data?.some((item) => item.url === saveSearchInput.url)),
  );
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
    if (chip.id !== "filters") {
      const quickFilterIds: SearchMapQuickFilterId[] = [
        "category",
        "neighborhood",
        "area",
        "price",
        "rooms",
        "floor",
        "building_age",
      ];

      if (quickFilterIds.includes(chip.id as SearchMapQuickFilterId)) {
        setQuickFilterId(chip.id as SearchMapQuickFilterId);
        return;
      }
    }

    window.history.pushState(
      window.history.state ?? {},
      "",
      buildFilterPageUrl(chip),
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const handleQuickFilterApply = useCallback((params: URLSearchParams) => {
    setSelectedListingId(null);
    writeSearchParams(params);
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
    if (isDrawMode) return;

    setSelectedListingId(null);
    setMode("map");
  }, [isDrawMode]);

  const startFreehandDrawing = useCallback(() => {
    if (geofenceResult) {
      setGeofenceHistory({
        result: geofenceResult,
        state: drawingState === "confirmed" ? "confirmed" : "preview",
      });
    } else if (drawingState !== "invalid") {
      setGeofenceHistory(null);
    }

    setSelectedListingId(null);
    setMode("map");
    setGeofenceResult(null);
    setGeofenceError(null);
    setDrawingState("idle");
    setGeofenceResetSignal((current) => current + 1);
    setMapResizeSignal((current) => current + 1);
    setIsDrawMode(true);
  }, [drawingState, geofenceResult]);

  const cancelFreehandDrawing = useCallback(() => {
    setIsDrawMode(false);
    setGeofenceError(null);
    setGeofenceResetSignal((current) => current + 1);
    setMapResizeSignal((current) => current + 1);

    if (geofenceHistory) {
      setGeofenceResult(geofenceHistory.result);
      setDrawingState(geofenceHistory.state);
      setGeofenceHistory(null);
    } else {
      setGeofenceResult(null);
      setDrawingState("idle");
    }
  }, [geofenceHistory]);

  const handleGeofenceComplete = useCallback((result: GeofenceResult) => {
    setGeofenceResult(result);
    setGeofenceError(null);
    setDrawingState("preview");
    setIsDrawMode(false);
  }, []);

  const handleGeofenceInvalid = useCallback(
    (validation: InvalidGeofenceResult) => {
      setGeofenceResult(null);
      setGeofenceError(validation.message);
      setDrawingState("invalid");
      setIsDrawMode(false);
    },
    [],
  );

  const deleteGeofenceAndRedraw = useCallback(() => {
    setDrawingState("idle");
    setGeofenceResult(null);
    setGeofenceError(null);
    setGeofenceHistory(null);
    setGeofenceResetSignal((current) => current + 1);
    setIsDrawMode(true);
  }, []);

  const confirmGeofence = useCallback(() => {
    if (!geofenceResult) return;

    setDrawingState("confirmed");
    setIsDrawMode(false);
    setGeofenceHistory(null);
    setMapResizeSignal((current) => current + 1);
    window.dispatchEvent(
      new CustomEvent<GeofenceResult>("search:geofence:confirmed", {
        detail: geofenceResult,
      }),
    );
  }, [geofenceResult]);

  const clearConfirmedGeofence = useCallback(() => {
    setDrawingState("idle");
    setGeofenceResult(null);
    setGeofenceError(null);
    setGeofenceHistory(null);
    setGeofenceResetSignal((current) => current + 1);
    setIsDrawMode(false);
  }, []);

  const handleSliderActiveListing = useCallback((listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
  }, []);

  const handleSearchResult = useCallback((item: { title: string }) => {
    const params = getSearchParams();

    params.set("query", item.title);
    params.delete("qsearch");
    params.delete("q");
    setIsSearchOpen(false);
    setSelectedListingId(null);
    writeSearchParams(params, { replace: true });
    setSearchSnapshot(window.location.search);
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
    setSelectedListingId(null);
    writeSearchParams(params, { replace: true });
    setSearchSnapshot(window.location.search);
  }, []);

  const handleSavedSearchSelect = useCallback((item: SavedSearchItem) => {
    let params: URLSearchParams;

    if (item.url) {
      try {
        const savedUrl = new URL(item.url, window.location.origin);
        params = savedUrl.searchParams;
      } catch {
        params = new URLSearchParams();
      }
    } else {
      params = new URLSearchParams();
      Object.entries(item.filters).forEach(([key, value]) => {
        params.set(key, Array.isArray(value) ? value.join("_") : String(value));
      });
    }

    params.delete("focus");
    params.delete("view");
    writeSearchParams(params);
    setSearchSnapshot(window.location.search);
    setSelectedListingId(null);
    setMode("map");
  }, []);

  const handleEmptyRequestSubmit = useCallback((title: string) => {
    if (!isAuthenticated) {
      navigateToLoginRequired("ثبت درخواست");
      return;
    }

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
  }, [currentSearchQuery, isAuthenticated]);

  const handleConfirmSearchRequest = useCallback((_senderId: string) => {
    if (!pendingSearchRequest || createPropertyRequestMutation.isPending) return;

    createPropertyRequestMutation.mutate(
      {
        filters: pendingSearchRequest.filters,
        name: pendingSearchRequest.title,
      },
      {
        onError: (error) => {
          showNotice(
            getApiErrorMessage(error, "ثبت درخواست با خطا مواجه شد."),
          );
        },
        onSuccess: () => {
          setPendingSearchRequest(null);
          window.requestAnimationFrame(() => {
            setIsRequestSuccessOpen(true);
          });
        },
      },
    );
  }, [createPropertyRequestMutation, pendingSearchRequest, showNotice]);

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

  const handleSaveSearch = useCallback(() => {
    if (!isAuthenticated) {
      navigateToLoginRequired("ذخیره جستجو");
      return;
    }

    if (isCurrentSearchSaved) {
      openSavedSearches();
      return;
    }

    if (!saveSearchInput || saveSearchMutation.isPending) return;

    saveSearchMutation.mutate(saveSearchInput, {
      onError: (error) => {
        if (isUnauthorizedApiError(error)) {
          const returnTo = `${window.location.pathname}${window.location.search}`;
          const params = new URLSearchParams({
            action: "ذخیره جستجو",
            returnTo,
          });

          window.history.pushState({}, "", `/login-required?${params.toString()}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }

        showNotice(
          getApiErrorMessage(error, "ذخیره جستجو انجام نشد. دوباره تلاش کنید."),
        );
      },
      onSuccess: () => {
        setSavedSearchUrl(saveSearchInput.url);
        showNotice("جستجوی شما ذخیره شد.");
      },
    });
  }, [
    isAuthenticated,
    isCurrentSearchSaved,
    openSavedSearches,
    saveSearchInput,
    saveSearchMutation,
    showNotice,
  ]);

  const handleBack = useCallback(() => {
    const storedBackTarget = getStoredBackTarget();

    if (storedBackTarget && !storedBackTarget.backTo.startsWith("/search")) {
      replaceRoute(
        storedBackTarget.backTo,
        storedBackTarget.backState,
        { rememberCurrent: false },
      );
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    replaceRoute("/home", undefined, { rememberCurrent: false });
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const changeViewMode = useCallback((nextMode: "map" | "list") => {
    const params = getSearchParams();

    if (nextMode === "list") {
      params.set("view", "list");
      params.delete("focus");
    } else {
      params.delete("view");
    }

    const queryString = params.toString();
    window.history.replaceState(
      window.history.state ?? {},
      "",
      queryString ? `/search?${queryString}` : "/search",
    );
    setSearchSnapshot(window.location.search);
    setSelectedListingId(null);
    setMode(nextMode);

  }, []);

  const returnToMapView = useCallback(() => {
    changeViewMode("map");
  }, [changeViewMode]);

  const isListPreviewOpen = mode === "preview";
  const isFullListOpen = mode === "list";
  const isGeofenceConfirmed =
    drawingState === "confirmed" && geofenceResult !== null;
  const showMapEmptyState =
    !isGeofenceConfirmed &&
    hasActiveSearchCriteria &&
    mapQuery.isSuccess &&
    !isMapLoading &&
    visibleListings.length === 0;
  const showListEmptyState =
    hasActiveSearchCriteria &&
    listQuery.isSuccess &&
    !isListLoading &&
    apiListListings.length === 0;
  const showCurrentEmptyState = isFullListOpen
    ? showListEmptyState
    : showMapEmptyState;
  const isGeofenceEditorOpen =
    mode === "map" &&
    !showCurrentEmptyState &&
    (isDrawMode || drawingState === "preview" || drawingState === "invalid");

  return (
    <div
      className={
        isGeofenceEditorOpen
          ? "fixed inset-y-0 left-1/2 z-[900] h-[100svh] w-full max-w-[500px] -translate-x-1/2 overflow-hidden bg-[#f0f0f0]"
          : "relative h-full min-h-0 overflow-hidden bg-[#f0f0f0]"
      }
    >
      {!showCurrentEmptyState ? (
        isFullListOpen ? (
          <SearchMapListView
            isLoading={isListLoading}
            listings={apiListListings}
            onMapClick={returnToMapView}
          />
        ) : (
          <SearchMapView
            center={mapCenter}
            centerSignal={mapCenterSignal}
            resizeSignal={mapResizeSignal}
            listings={isGeofenceEditorOpen ? [] : visibleListings}
            priceMarkerListingIds={
              isGeofenceEditorOpen ? emptyListingIds : bluePriceMarkerListingIds
            }
            seenListingIds={seenListingIds}
            selectedListingId={isGeofenceEditorOpen ? null : selectedListingId}
            tileConfig={searchMapTileConfig}
            userLocation={userLocation}
            freehandGeofenceEnabled={isDrawMode}
            geofenceResetSignal={geofenceResetSignal}
            geofenceResult={geofenceResult}
            geofenceDisplayMode={isGeofenceConfirmed ? "confirmed" : "editing"}
            onGeofenceCancelled={cancelFreehandDrawing}
            onGeofenceComplete={handleGeofenceComplete}
            onGeofenceInvalid={handleGeofenceInvalid}
            onGeofenceStateChange={setDrawingState}
            onBoundsChange={handleBoundsChange}
            onMapClick={handleMapClick}
            onSelectListing={handleSelectListing}
          />
        )
      ) : null}

      {showCurrentEmptyState ? (
        <SearchNoResultsView
          mode={isFullListOpen ? "list" : "map"}
          onRequestSubmit={handleEmptyRequestSubmit}
          onToggleMode={() => changeViewMode(isFullListOpen ? "map" : "list")}
        />
      ) : null}

      {!isGeofenceEditorOpen ? (
        <SearchMapHeader
          savedCount={savedSearchesQuery.data?.length ?? 0}
          isCurrentSearchSaved={isCurrentSearchSaved}
          isSavingSearch={saveSearchMutation.isPending}
          isSaveSearchDisabled={!saveSearchInput}
          chips={chips}
          onChipClick={toggleChip}
          onChipRemove={handleRemoveChip}
          queryLabel={queryLabel}
          onSearchClick={openSearch}
          onSavedClick={handleSaveSearch}
          onBack={handleBack}
        />
      ) : null}

      {mode === "map" && !isGeofenceEditorOpen && !showCurrentEmptyState ? (
        <SearchMapResultsSummary
          count={mapQuery.data?.length ?? 0}
          hasGeofence={isGeofenceConfirmed}
          isLoading={isMapLoading || mapQuery.isFetching}
          onRemoveGeofence={clearConfirmedGeofence}
        />
      ) : null}

      <SearchMapFloatingActions
        isDrawing={isDrawMode}
        isEditorMode={isGeofenceEditorOpen}
        isHidden={mode !== "map" || showCurrentEmptyState || isGeofenceEditorOpen}
        isLocated={isLocated}
        isLocating={isLocating}
        onLocateClick={locateUser}
        onHandClick={startFreehandDrawing}
        onListClick={() => changeViewMode("list")}
        showListButton={!isGeofenceEditorOpen}
      />

      {isGeofenceEditorOpen ? (
        <SearchMapGeofenceControls
          drawingState={drawingState}
          errorMessage={geofenceError}
          geofenceResult={geofenceResult}
          onBack={cancelFreehandDrawing}
          onConfirm={confirmGeofence}
          onDelete={deleteGeofenceAndRedraw}
        />
      ) : null}

      <SearchMapListingSlider
        isLoading={isMapLoading}
        isOpen={isListPreviewOpen && !isGeofenceEditorOpen}
        listings={visibleListings}
        selectedListingId={selectedListingId}
        onActiveListingChange={handleSliderActiveListing}
      />
      <SearchMapSearchScreen
        initialQuery={currentSearchQuery}
        initialView={searchInitialView}
        isOpen={isSearchOpen}
        minSearchQueryLength={searchMapMinQueryLength}
        onBack={handleBack}
        onClose={closeSearch}
        onQueryChange={handleLiveSearchQueryChange}
        onSavedSelect={handleSavedSearchSelect}
        onSubmit={(query) => handleSearchResult({ title: query })}
        saveInput={saveSearchInput}
      />
      <SearchMapQuickFilterBottomSheet
        filterId={quickFilterId}
        isOpen={quickFilterId !== null}
        onApply={handleQuickFilterApply}
        onClose={() => setQuickFilterId(null)}
        resultCount={listQuery.data?.total ?? listQuery.data?.data.length ?? mapQuery.data?.length ?? 0}
        search={currentSearch}
      />
      <SearchRequestSenderBottomSheet
        isOpen={pendingSearchRequest !== null || isRequestSuccessOpen}
        isSuccess={isRequestSuccessOpen}
        onClose={() => {
          if (createPropertyRequestMutation.isPending) return;

          setPendingSearchRequest(null);
          setIsRequestSuccessOpen(false);
        }}
        onOpenResults={() => {
          window.location.assign(requestResultsPath);
        }}
        onSelect={handleConfirmSearchRequest}
        options={requestSenderOptions}
      />
      <TransientNotice message={message} />
    </div>
  );
}
