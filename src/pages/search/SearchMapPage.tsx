import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../../api/api";
import { useAdvertisementMapQuery } from "../../hooks/advertisement.hooks";
import { DemoNotice } from "../../components/DemoNotice";
import { useDemoNotice } from "../../hooks/useDemoNotice";
import type { AdvertisementItem } from "../../services/advertisement.service";
import { HomeSearchScreen } from "../home/components/HomeSearchScreen";
import { SearchMapFloatingActions } from "./components/SearchMapFloatingActions";
import { SearchMapHeader } from "./components/SearchMapHeader";
import { SearchMapListingSlider } from "./components/SearchMapListingSlider";
import { SearchMapListView } from "./components/SearchMapListView";
import { SearchMapView } from "./components/SearchMapView";
import {
  SEARCH_MAP_DEMO_PHOTO,
  searchFilterChips,
  searchMapTileConfig,
  type SearchFilterChip,
  type SearchMapBounds,
  type SearchMapCenter,
  type SearchMapListing,
  type SearchMapListingId,
} from "./searchMapData";
import {
  getBrowserMapCenter,
  getInitialMapCenter,
  getIpBasedMapCenter,
  hasExplicitSearchCity,
  storeSearchMapCenter,
} from "./searchMapLocation";

type SearchMapMode = "map" | "preview" | "list";

const mapRequestLimit = 100;
const searchDefaultLabel = "جستجو در آگهی‌ها";

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
    const featureName = String(candidate.key ?? candidate.label ?? "").toLowerCase();

    return normalizedLabels.some((label) => featureName === label || featureName.includes(label));
  });

  return feature?.value;
}

function readFeature(item: AdvertisementItem, labels: string[], fallback = "") {
  return toText(readFeatureRaw(item, labels), fallback);
}

function withUnit(value: string, unit: string) {
  if (!value || value === "-" || value.includes(unit)) return value;

  return `${value} ${unit}`;
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
  const position = item as {
    lat?: unknown;
    latitude?: unknown;
    location?: { lat?: unknown; latitude?: unknown; lng?: unknown; longitude?: unknown };
    lng?: unknown;
    long?: unknown;
    longitude?: unknown;
    point?: { lat?: unknown; latitude?: unknown; lng?: unknown; longitude?: unknown };
  };
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
    agencyName: toText(
      item.agency ??
        item.agency_name ??
        item.advertiser_name ??
        readFeatureRaw(item, ["advertiser_type", "agency"]),
    ),
    area: withUnit(
      readFeature(item, ["area", "meterage", "building_area", "متراژ"], toText(item.area, "-")),
      "متر",
    ),
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
    rooms: withUnit(
      readFeature(item, ["rooms", "room", "bedroom", "bedrooms", "اتاق", "خواب"], toText(item.rooms, "-")),
      "اتاق",
    ),
    showPriceMarker: true,
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeature(item, ["building_age", "age", "year", "سال ساخت"], toText(item.year, "-")),
  };
}

function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

function buildMapQueryParams(bounds: SearchMapBounds | null) {
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

function filterListings(listings: SearchMapListing[]) {
  return listings;
}


export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<SearchMapListingId | null>(null);
  const [mode, setMode] = useState<SearchMapMode>("map");
  const chips = searchFilterChips;
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchRevision, setSearchRevision] = useState(0);
  const [mapCenter, setMapCenter] = useState<SearchMapCenter>(getInitialMapCenter);
  const didRequestPreciseLocationRef = useRef(false);
  const [mapBounds, setMapBounds] = useState<SearchMapBounds | null>(null);
  const [queryLabel, setQueryLabel] = useState(
    getSearchParams().get("qsearch") || searchDefaultLabel,
  );
  const { message, showNotice } = useDemoNotice();
  const mapQueryParams = useMemo(() => buildMapQueryParams(mapBounds), [mapBounds, searchRevision]);
  const mapQuery = useAdvertisementMapQuery(mapQueryParams);
  const applyMapCenter = useCallback((center: SearchMapCenter) => {
    setMapCenter(center);
    storeSearchMapCenter(center);
  }, []);
  const apiListings = useMemo(
    () =>
      (mapQuery.data ?? [])
        .map((item, index) => mapAdvertisementToSearchListing(item, index))
        .filter((item): item is SearchMapListing => item !== null),
    [mapQuery.data],
  );
  const isMapLoading = !mapQueryParams || (mapQuery.isLoading && apiListings.length === 0);
  const visibleListings = useMemo(
    () => filterListings(apiListings),
    [apiListings],
  );
  useEffect(() => {
    if (!mapQuery.isError) return;

    showNotice(getApiErrorMessage(mapQuery.error, "دریافت آگهی‌های نقشه با خطا مواجه شد."));
  }, [mapQuery.error, mapQuery.isError, showNotice]);

  useEffect(() => {
    if (hasExplicitSearchCity()) return;

    const controller = new AbortController();

    void getIpBasedMapCenter(controller.signal).then((center) => {
      if (!center || controller.signal.aborted || didRequestPreciseLocationRef.current) return;

      applyMapCenter(center);
    });

    return () => {
      controller.abort();
    };
  }, [applyMapCenter]);

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

  const openFilterPage = (chip?: SearchFilterChip) => {
    const params = getSearchParams();

    if (chip?.id && chip.id !== "filters") {
      params.set("filter", chip.id);
    }

    const queryString = params.toString();
    window.history.pushState({}, "", queryString ? `/search/filter?${queryString}` : "/search/filter");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };



  const handleSelectListing = useCallback((listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
    setMode("preview");
  }, []);

  const handleActiveListingChange = useCallback((listing: SearchMapListing) => {
    setSelectedListingId((currentId) =>
      String(currentId) === String(listing.id) ? currentId : listing.id,
    );
    setMode("preview");
  }, []);

  const handleSearchResult = (item: { title: string }) => {
    const params = getSearchParams();
    const cityId = params.get("city_id") || getStoredCityId();

    params.set("qsearch", item.title);

    if (cityId) {
      params.set("city_id", cityId);
    }

    setQueryLabel(item.title);
    setIsSearchOpen(false);
    setSelectedListingId(null);
    setMode("map");
    window.history.replaceState({}, "", `/search?${params.toString()}`);
    setSearchRevision((revision) => revision + 1);
  };

  const locateUser = () => {
    didRequestPreciseLocationRef.current = true;

    void getBrowserMapCenter()
      .then((center) => {
        setIsLocated(true);
        applyMapCenter(center);
        setSelectedListingId(null);
        setMode("map");
        showNotice("موقعیت شما روی نقشه مشخص شد");
      })
      .catch(() => {
        setIsLocated(false);
        showNotice("امکان دریافت موقعیت شما وجود ندارد");
      });
  };


  const isListPreviewOpen = mode === "preview";
  const isFullListOpen = mode === "list";

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#f0f0f0]">
      {isFullListOpen ? (
        <SearchMapListView
          isLoading={isMapLoading}
          listings={visibleListings}
          onMapClick={() => setMode("map")}
        />
      ) : (
        <SearchMapView
          center={mapCenter}
          listings={visibleListings}
          selectedListingId={selectedListingId}
          tileConfig={searchMapTileConfig}
          onBoundsChange={handleBoundsChange}
          onSelectListing={handleSelectListing}
        />
      )}

      <SearchMapHeader
        savedCount={2}
        chips={chips}
        onChipClick={openFilterPage}
        queryLabel={queryLabel}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <SearchMapFloatingActions
        isDrawing={isDrawMode}
        isHidden={mode !== "map"}
        isLocated={isLocated}
        onLocateClick={locateUser}
        onHandClick={() => {
          setIsDrawMode((current) => !current);
          showNotice(isDrawMode ? "انتخاب محدوده پایان یافت" : "محدوده موردنظر را روی نقشه مشخص کنید");
        }}
        onListClick={() => {
          setSelectedListingId(null);
          setMode("list");
        }}
      />

      <SearchMapListingSlider
        isLoading={isMapLoading}
        isOpen={isListPreviewOpen}
        listings={visibleListings}
        selectedListingId={selectedListingId}
        onActiveListingChange={handleActiveListingChange}
      />
      <HomeSearchScreen
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResult}
      />
      <DemoNotice message={message} />
    </div>
  );
}
