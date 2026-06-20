import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../../api/api";
import { useAdvertisementMapQuery } from "../../hooks/advertisement.hooks";
import { DemoNotice } from "../../components/DemoNotice";
import { useDemoNotice } from "../../hooks/useDemoNotice";
import {
  getBrowserLocation,
  getBrowserLocationNotice,
  type BrowserLocation,
} from "../../lib/browserLocation";
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

function buildMapQueryParams(bounds: SearchMapBounds | null) {
  if (!bounds) return null;

  const params = getSearchParams();
  const cityId = params.get("city_id") || "";
  const categoryId = params.get("category_id") || params.get("categoryId") || "";

  return {
    categoryId,
    ...(cityId ? { cityId } : {}),
    east: roundCoordinate(bounds.east),
    limit: mapRequestLimit,
    north: roundCoordinate(bounds.north),
    south: roundCoordinate(bounds.south),
    west: roundCoordinate(bounds.west),
  };
}

function filterListings(listings: SearchMapListing[], _chips: SearchFilterChip[]) {
  return listings;
}

export function SearchMapPage() {
  const [selectedListingId, setSelectedListingId] = useState<SearchMapListingId | null>(null);
  const [seenListingIds, setSeenListingIds] = useState<Set<SearchMapListingId>>(
    () => new Set(),
  );
  const [mode, setMode] = useState<SearchMapMode>("preview");
  const [chips] = useState(searchFilterChips);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [isLocated, setIsLocated] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<BrowserLocation | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<SearchMapCenter>(searchMapCenter);
  const [mapBounds, setMapBounds] = useState<SearchMapBounds | null>(null);
  const [stableListings, setStableListings] = useState<SearchMapListing[]>([]);
  const didResolveIpLocationRef = useRef(false);
  const [queryLabel, setQueryLabel] = useState(
    getSearchParams().get("qsearch") || searchDefaultLabel,
  );
  const { message, showNotice } = useDemoNotice();
  const mapQueryParams = useMemo(() => buildMapQueryParams(mapBounds), [mapBounds]);
  const mapQuery = useAdvertisementMapQuery(mapQueryParams);
  const apiListings = useMemo(
    () =>
      (mapQuery.data ?? [])
        .map((item, index) => mapAdvertisementToSearchListing(item, index))
        .filter((item): item is SearchMapListing => item !== null),
    [mapQuery.data],
  );
  const isMapLoading = !mapQueryParams || (mapQuery.isFetching && stableListings.length === 0);
  const visibleListings = useMemo(
    () => filterListings(stableListings, chips),
    [chips, stableListings],
  );

  useEffect(() => {
    if (!mapQuery.isSuccess) return;

    setStableListings(apiListings);
  }, [apiListings, mapQuery.isSuccess]);

  useEffect(() => {
    if (didResolveIpLocationRef.current) return;

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
  const visibleListingIds = new Set(
    visibleListings
      .filter((listing) => !listing.showPriceMarker)
      .map((listing) => listing.id),
  );
  const visibleDotMarkers = visibleListings
    .filter((listing) => visibleListingIds.has(listing.id))
    .map((listing) => ({
      id: listing.dotId,
      listingId: listing.id,
      latitude: listing.latitude,
      longitude: listing.longitude,
    }));

  useEffect(() => {
    if (!mapQuery.isError) return;

    showNotice(getApiErrorMessage(mapQuery.error, "دریافت آگهی‌های نقشه با خطا مواجه شد."));
  }, [mapQuery.error, mapQuery.isError, showNotice]);

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

  const toggleChip = (_chip: SearchFilterChip) => {
    window.history.pushState({}, "", "/search/filter");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleSelectListing = (listing: SearchMapListing) => {
    setSeenListingIds((current) => {
      if (current.has(listing.id)) return current;

      const next = new Set(current);
      next.add(listing.id);
      return next;
    });
    setSelectedListingId(listing.id);
    setMode("preview");
  };

  const handleMapClick = useCallback(() => {
    setMode("map");
  }, []);

  const handleSliderActiveListing = useCallback((listing: SearchMapListing) => {
    setSelectedListingId(listing.id);
  }, []);

  const handleSearchResult = (item: { title: string }) => {
    const params = getSearchParams();
    const cityId = params.get("city_id") || "";

    params.set("qsearch", item.title);

    if (cityId) {
      params.set("city_id", cityId);
    }

    setQueryLabel(item.title);
    setIsSearchOpen(false);
    setSelectedListingId(null);
    setMode("map");
    window.history.replaceState({}, "", `/search?${params.toString()}`);
  };

  const locateUser = () => {
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
          dotMarkers={visibleDotMarkers}
          listings={visibleListings}
          seenListingIds={seenListingIds}
          selectedListingId={selectedListingId}
          tileConfig={searchMapTileConfig}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          onMapClick={handleMapClick}
          onSelectListing={handleSelectListing}
        />
      )}

      <SearchMapHeader
        savedCount={2}
        chips={chips}
        onChipClick={toggleChip}
        queryLabel={queryLabel}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <SearchMapFloatingActions
        isDrawing={isDrawMode}
        isHidden={mode !== "map"}
        isLocated={isLocated}
        isLocating={isLocating}
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
        onActiveListingChange={handleSliderActiveListing}
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
