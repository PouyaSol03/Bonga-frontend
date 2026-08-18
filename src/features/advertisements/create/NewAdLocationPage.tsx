import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { getBrowserLocation } from "../../../shared/lib/browserLocation";
import { defaultSelectedCity, readStoredSelectedCity, selectedCityStorageKeys } from "../../../shared/lib/selectedCityStorage";
import { useNeighborhoodInfoQuery } from "../../locations/api/neighborhood.hooks";
import { useLocationSearchByCoordinates, useLocationSearchByQuery } from "../../locations/api/location-search.hooks";
import { getNeighborhoodPolygonPoints, getNeighborhoodSubNeighborhoodNames, getNeighborhoodSubNeighborhoods, type NeighborhoodDto, type SubNeighborhoodDto } from "../../locations/api/neighborhood.service";
import { searchMapTileConfig } from "../../search/searchMapData";
import { Header } from "./components/NewAdControls";
import { NewAdDesktopLayoutContext } from "./NewAdLayoutContext";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "./data";
import { clearNewAdDraftStorage, navigateTo, useRequireAuth } from "./utils";
import { updateNewAdFlowSessionLocation } from "./session";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearCancelCircle from "../../../shared/icons/LinearCancelCircle";

type NewAdMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

const defaultMapCenter: NewAdMapCenter = {
  lat: defaultSelectedCity.latitude,
  lng: defaultSelectedCity.longitude,
  zoom: 15,
};
const selectedCityMapZoom = 12;
const selectedNeighborhoodMapZoom = 16;
const minNeighborhoodSearchLength = 3;

function readStoredCoordinate(key: string) {
  const value = window.localStorage.getItem(key);

  if (!value?.trim()) return null;

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

function getStoredCityId() {
  return readStoredSelectedCity()?.id ?? "";
}

function getStoredSelectedCityCenter() {
  const lat = readStoredCoordinate(selectedCityStorageKeys.latitude);
  const lng = readStoredCoordinate(selectedCityStorageKeys.longitude);

  if (
    lat !== null &&
    Math.abs(lat) <= 90 &&
    lng !== null &&
    Math.abs(lng) <= 180
  ) {
    return { lat, lng };
  }

  const selectedCity = readStoredSelectedCity();

  if (
    selectedCity?.latitude !== undefined &&
    selectedCity.longitude !== undefined
  ) {
    return {
      lat: selectedCity.latitude,
      lng: selectedCity.longitude,
    };
  }

  return null;
}

function getStoredMapCenter(): NewAdMapCenter {
  const storedLat = readStoredCoordinate(locationLatKey);
  const storedLng = readStoredCoordinate(locationLngKey);

  if (
    storedLat !== null &&
    Math.abs(storedLat) <= 90 &&
    storedLng !== null &&
    Math.abs(storedLng) <= 180
  ) {
    return {
      lat: storedLat,
      lng: storedLng,
      zoom: selectedNeighborhoodMapZoom,
    };
  }

  const selectedCityCenter = getStoredSelectedCityCenter();

  if (selectedCityCenter) {
    return {
      lat: selectedCityCenter.lat,
      lng: selectedCityCenter.lng,
      zoom: selectedCityMapZoom,
    };
  }

  return { ...defaultMapCenter, zoom: selectedCityMapZoom };
}

function getNeighborhoodId(neighborhood: NeighborhoodDto | null) {
  return String(neighborhood?.id ?? neighborhood?._id ?? "");
}

function getSubNeighborhoodId(subNeighborhood: SubNeighborhoodDto | null) {
  return String(subNeighborhood?.id ?? "");
}

function normalizeLocationName(value: string) {
  return value.trim().toLocaleLowerCase("fa");
}

function getPolygonCenter(points: Array<[number, number]>) {
  if (!points.length) return null;

  let twiceArea = 0;
  let longitudeSum = 0;
  let latitudeSum = 0;

  for (let index = 0; index < points.length; index += 1) {
    const [latitudeA, longitudeA] = points[index];
    const [latitudeB, longitudeB] = points[(index + 1) % points.length];
    const cross = longitudeA * latitudeB - longitudeB * latitudeA;

    twiceArea += cross;
    longitudeSum += (longitudeA + longitudeB) * cross;
    latitudeSum += (latitudeA + latitudeB) * cross;
  }

  if (Math.abs(twiceArea) > Number.EPSILON) {
    return {
      lat: latitudeSum / (3 * twiceArea),
      lng: longitudeSum / (3 * twiceArea),
    };
  }

  const total = points.reduce(
    (sum, [lat, lng]) => ({ lat: sum.lat + lat, lng: sum.lng + lng }),
    { lat: 0, lng: 0 },
  );

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length,
  };
}

function getSubNeighborhoodCenter(subNeighborhood: SubNeighborhoodDto | null) {
  if (!subNeighborhood) return null;

  if (Number.isFinite(subNeighborhood.lat) && Number.isFinite(subNeighborhood.lng)) {
    return {
      lat: Number(subNeighborhood.lat),
      lng: Number(subNeighborhood.lng),
    };
  }

  return getPolygonCenter(
    getNeighborhoodPolygonPoints(subNeighborhood.geofence ?? subNeighborhood.polygon),
  );
}

function findMatchingSubNeighborhood(
  neighborhood: NeighborhoodDto,
  selectedSubNeighborhood: SubNeighborhoodDto | null,
) {
  if (!selectedSubNeighborhood) return null;

  const subNeighborhoods = getNeighborhoodSubNeighborhoods(neighborhood);
  const selectedId = getSubNeighborhoodId(selectedSubNeighborhood);

  if (selectedId) {
    const idMatch = subNeighborhoods.find(
      (item) => getSubNeighborhoodId(item) === selectedId,
    );
    if (idMatch) return idMatch;
  }

  const selectedName = normalizeLocationName(selectedSubNeighborhood.name);
  if (!selectedName) return null;

  return subNeighborhoods.find(
    (item) => normalizeLocationName(item.name) === selectedName,
  ) ?? null;
}

function isPointInsidePolygon(
  latitude: number,
  longitude: number,
  points: Array<[number, number]>,
) {
  if (points.length < 3) return false;

  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const [latA, lngA] = points[index];
    const [latB, lngB] = points[previous];
    const intersects =
      (latA > latitude) !== (latB > latitude) &&
      longitude < ((lngB - lngA) * (latitude - latA)) / (latB - latA || Number.EPSILON) + lngA;

    if (intersects) inside = !inside;
  }

  return inside;
}

function resolveSubNeighborhoodAtPoint(
  subNeighborhoods: SubNeighborhoodDto[],
  latitude: number,
  longitude: number,
) {
  return subNeighborhoods.find((item) => {
    const points = getNeighborhoodPolygonPoints(item.geofence ?? item.polygon);
    return isPointInsidePolygon(latitude, longitude, points);
  }) ?? null;
}

function createStoredNeighborhood(): NeighborhoodDto | null {
  const id = window.localStorage.getItem(neighborhoodIdKey) ?? "";
  const name = window.localStorage.getItem(locationKey) ?? "";
  const lat = readStoredCoordinate(locationLatKey);
  const lng = readStoredCoordinate(locationLngKey);

  if (!id || !name) return null;

  return {
    id,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    name,
  };
}

function NewAdLocationMap({
  center,
  onCenterChange,
}: {
  center: NewAdMapCenter;
  onCenterChange: (center: NewAdMapCenter) => void;
}) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const nextCenter = map.getCenter();

      onCenterChange({
        lat: nextCenter.lat,
        lng: nextCenter.lng,
        zoom: map.getZoom(),
      });
    },
    zoomend: () => {
      const nextCenter = map.getCenter();

      onCenterChange({
        lat: nextCenter.lat,
        lng: nextCenter.lng,
        zoom: map.getZoom(),
      });
    },
  });

  useEffect(() => {
    map.setView([center.lat, center.lng], center.zoom, {
      animate: true,
    });
  }, [center.lat, center.lng, center.zoom, map]);

  useEffect(() => {
    map.invalidateSize();

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

export function NewAdLocationPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const label = searchParams.get("label") ?? "آگهی ملک";
  const isCrmSource = searchParams.get("editSource") === "crm";
  const cityId = getStoredCityId();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(
    createStoredNeighborhood,
  );
  const [query, setQuery] = useState(() => {
    const stored = createStoredNeighborhood();
    return stored ? stored.name : "";
  });
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [selectedSearchSubNeighborhood, setSelectedSearchSubNeighborhood] = useState<SubNeighborhoodDto | null>(null);
  const [mapCenter, setMapCenter] = useState<NewAdMapCenter>(getStoredMapCenter);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pendingQuerySelectionRef = useRef<{
    neighborhoodId: string;
    subNeighborhood: SubNeighborhoodDto | null;
  } | null>(null);
  const normalizedQuery = query.trim();
  const canSearchNeighborhoods =
    isManualSearch && normalizedQuery.length >= minNeighborhoodSearchLength;

  const locationSearchQuery = useLocationSearchByQuery({
    cityId,
    enabled: Boolean(cityId) && canSearchNeighborhoods,
    query: normalizedQuery,
  });
  const locationByCoordinatesQuery = useLocationSearchByCoordinates({
    cityId,
    enabled: Boolean(cityId),
    lat: Number(mapCenter.lat.toFixed(7)),
    lng: Number(mapCenter.lng.toFixed(7)),
  });
  const selectedNeighborhoodId = getNeighborhoodId(selectedNeighborhood);
  const neighborhoodInfoQuery = useNeighborhoodInfoQuery(
    selectedNeighborhoodId,
    Boolean(selectedNeighborhoodId),
  );
  const selectedSubNeighborhood = useMemo(() => {
    const fullInfo = neighborhoodInfoQuery.data;
    const subNeighborhoods = fullInfo ? getNeighborhoodSubNeighborhoods(fullInfo) : [];
    const matchedSearchSubNeighborhood = fullInfo
      ? findMatchingSubNeighborhood(fullInfo, selectedSearchSubNeighborhood)
      : null;

    return matchedSearchSubNeighborhood ??
      selectedSearchSubNeighborhood ??
      resolveSubNeighborhoodAtPoint(subNeighborhoods, mapCenter.lat, mapCenter.lng);
  }, [mapCenter.lat, mapCenter.lng, neighborhoodInfoQuery.data, selectedSearchSubNeighborhood]);

  useEffect(() => {
    const fullInfo = neighborhoodInfoQuery.data;
    if (!fullInfo || !selectedNeighborhood) return;

    const neighborhoodId = getNeighborhoodId(selectedNeighborhood);
    if (neighborhoodId !== String(fullInfo.id)) return;

    const pendingSelection = pendingQuerySelectionRef.current;
    const isPendingQuerySelection =
      pendingSelection?.neighborhoodId === neighborhoodId;
    const matchedSearchSubNeighborhood = findMatchingSubNeighborhood(
      fullInfo,
      isPendingQuerySelection
        ? pendingSelection.subNeighborhood
        : selectedSearchSubNeighborhood,
    );

    const needsNeighborhoodHydration =
      selectedNeighborhood.name !== fullInfo.name ||
      (!selectedNeighborhood.polygon && Boolean(fullInfo.polygon)) ||
      (!selectedNeighborhood.geofence && Boolean(fullInfo.geofence));

    if (needsNeighborhoodHydration) {
      setSelectedNeighborhood({
        ...fullInfo,
        matched_sub_neighborhood:
          matchedSearchSubNeighborhood ?? selectedSearchSubNeighborhood ?? undefined,
      });
    }

    // Query selection is allowed to move the map once only. Never keep the map
    // attached to the result after that, and never change the user's zoom.
    if (!isPendingQuerySelection) return;

    pendingQuerySelectionRef.current = null;

    const subNeighborhoodCenter = getSubNeighborhoodCenter(
      matchedSearchSubNeighborhood ?? pendingSelection.subNeighborhood,
    );
    const target = subNeighborhoodCenter ?? (
      Number.isFinite(fullInfo.lat) && Number.isFinite(fullInfo.lng)
        ? { lat: Number(fullInfo.lat), lng: Number(fullInfo.lng) }
        : null
    );

    if (!target) return;

    setMapCenter((current) => {
      const threshold = 0.00001;
      if (
        Math.abs(current.lat - target.lat) <= threshold &&
        Math.abs(current.lng - target.lng) <= threshold
      ) {
        return current;
      }

      return {
        ...current,
        lat: target.lat,
        lng: target.lng,
      };
    });
  }, [neighborhoodInfoQuery.data, selectedNeighborhood, selectedSearchSubNeighborhood]);
  const locations = useMemo(
    () => (canSearchNeighborhoods ? locationSearchQuery.data ?? [] : []),
    [canSearchNeighborhoods, locationSearchQuery.data],
  );
  const selectedLocation = selectedNeighborhood?.name ?? "";
  const selectedNeighborhoodGeofence = useMemo(() => {
    const fullInfo = neighborhoodInfoQuery.data;

    // Draw only the hydrated parent neighborhood boundary. Search/coordinate
    // responses can briefly contain sub-neighborhood geometry at the top level,
    // which must never be rendered as the neighborhood outline.
    if (
      !fullInfo ||
      !selectedNeighborhoodId ||
      String(fullInfo.id ?? fullInfo._id ?? "") !== selectedNeighborhoodId
    ) {
      return [];
    }

    return getNeighborhoodPolygonPoints(fullInfo.geofence ?? fullInfo.polygon);
  }, [neighborhoodInfoQuery.data, selectedNeighborhoodId]);

  useRequireAuth();

  useEffect(() => {
    const clearOnExit = () => {
      if (window.location.pathname.startsWith("/new-ad")) return;

      clearNewAdDraftStorage();
    };
    const clearOnPageHide = () => clearNewAdDraftStorage();

    window.addEventListener("popstate", clearOnExit);
    window.addEventListener("pagehide", clearOnPageHide);

    return () => {
      window.removeEventListener("popstate", clearOnExit);
      window.removeEventListener("pagehide", clearOnPageHide);
    };
  }, []);

  useEffect(() => {
    if (locationByCoordinatesQuery.isFetching || isManualSearch) return;
    if (selectedNeighborhood && !isResolvingLocation) return;

    const neighborhood = locationByCoordinatesQuery.data;

    if (!neighborhood || !getNeighborhoodId(neighborhood) || !neighborhood.name.trim()) {
      setSelectedNeighborhood(null);
      setSelectedSearchSubNeighborhood(null);
      setQuery("");
      setIsResolvingLocation(false);
      return;
    }

    setSelectedNeighborhood(neighborhood);
    setSelectedSearchSubNeighborhood(neighborhood.matched_sub_neighborhood ?? null);
    setQuery(neighborhood.name);
    setIsResolvingLocation(false);
  }, [
    isManualSearch,
    locationByCoordinatesQuery.data,
    locationByCoordinatesQuery.isError,
    locationByCoordinatesQuery.isFetching,
    selectedNeighborhood,
    isResolvingLocation,
  ]);

  const updateMapCenter = (center: NewAdMapCenter) => {
    const threshold = 0.00005;
    const hasLocationChanged =
      Math.abs(center.lat - mapCenter.lat) > threshold ||
      Math.abs(center.lng - mapCenter.lng) > threshold;

    if (hasLocationChanged) {
      pendingQuerySelectionRef.current = null;
      setSelectedNeighborhood(null);
      setSelectedSearchSubNeighborhood(null);
      setIsManualSearch(false);
      setIsResolvingLocation(true);
      window.localStorage.removeItem(subNeighborhoodIdKey);
    }

    setMapCenter(center);
  };

  const selectNeighborhood = (neighborhood: NeighborhoodDto) => {
    const matchedSubNeighborhood = neighborhood.matched_sub_neighborhood ?? null;
    const neighborhoodId = getNeighborhoodId(neighborhood);

    searchInputRef.current?.blur();
    setIsManualSearch(false);
    setIsSearchExpanded(false);
    setSelectedNeighborhood(neighborhood);
    setSelectedSearchSubNeighborhood(matchedSubNeighborhood);
    setQuery(neighborhood.name);

    const matchedSubNeighborhoodCenter = getSubNeighborhoodCenter(matchedSubNeighborhood);

    if (matchedSubNeighborhoodCenter) {
      pendingQuerySelectionRef.current = null;
      setMapCenter((current) => ({
        ...current,
        lat: matchedSubNeighborhoodCenter.lat,
        lng: matchedSubNeighborhoodCenter.lng,
      }));
      return;
    }

    // When the clicked query item matched a sub-neighborhood but the search
    // payload did not include its center, hydrate the parent neighborhood and
    // move to that sub-neighborhood once. If there is no sub-neighborhood, the
    // same one-shot fallback uses the parent neighborhood center.
    if (neighborhoodId && (matchedSubNeighborhood || !Number.isFinite(neighborhood.lat) || !Number.isFinite(neighborhood.lng))) {
      pendingQuerySelectionRef.current = {
        neighborhoodId,
        subNeighborhood: matchedSubNeighborhood,
      };

      if (matchedSubNeighborhood) return;
    } else {
      pendingQuerySelectionRef.current = null;
    }

    if (Number.isFinite(neighborhood.lat) && Number.isFinite(neighborhood.lng)) {
      pendingQuerySelectionRef.current = null;
      setMapCenter((current) => ({
        ...current,
        lat: Number(neighborhood.lat),
        lng: Number(neighborhood.lng),
      }));
    }
  };

  const moveToBrowserLocation = () => {
    void getBrowserLocation().then((location) => {
      updateMapCenter({
        lat: location.latitude,
        lng: location.longitude,
        zoom: Math.max(mapCenter.zoom, selectedNeighborhoodMapZoom),
      });
    });
  };

  return (
    <NewAdDesktopLayoutContext.Provider value={isCrmSource}>
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <Header title="موقعیت ملک" />
      <main className="relative min-h-0 flex-1 overflow-hidden bg-[#e9eef2]">
        <MapContainer
          attributionControl={false}
          center={[mapCenter.lat, mapCenter.lng]}
          className="absolute inset-0 z-0 h-full w-full bg-[#e9eef2]"
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          preferCanvas
          zoom={mapCenter.zoom}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <NewAdLocationMap
            center={mapCenter}
            onCenterChange={updateMapCenter}
          />
          {selectedNeighborhoodGeofence.length >= 3 ? (
            <Polygon
              interactive={false}
              pathOptions={{
                color: "#0048c4",
                fillColor: "#0048c4",
                fillOpacity: 0.18,
                opacity: 0.9,
                weight: 2,
              }}
              positions={selectedNeighborhoodGeofence}
            />
          ) : null}
        </MapContainer>

        <Button unstyled
          aria-label="موقعیت من"
          className={`absolute z-20 flex h-9 items-center gap-1 rounded-[10px] bg-white px-3 text-xs font-medium leading-4 text-[#1a1a1a] shadow-[0_4px_14px_rgba(26,26,26,0.14)] ${isCrmSource ? "bottom-6 left-6" : "bottom-[200px] right-4"}`}
          onClick={moveToBrowserLocation}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.8 8C12.8 10.651 10.651 12.8 8 12.8M12.8 8C12.8 5.34903 10.651 3.2 8 3.2M12.8 8H14M8 12.8C5.34903 12.8 3.2 10.651 3.2 8M8 12.8V14M3.2 8C3.2 5.34903 5.34903 3.2 8 3.2M3.2 8H2M8 3.2V2" stroke="#4D4D4D" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" fill="#4D4D4D" />
            </svg>
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">موقعیت من</Typography>
        </Button>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full">
          <MapPickerPinIcon />
        </div>

        <section className={isCrmSource
          ? "absolute bottom-6 right-6 z-30 flex w-[420px] max-w-[calc(100%_-_48px)] flex-col rounded-xl border border-[#e1e7f0] bg-white px-5 pb-5 pt-4 shadow-[0_18px_50px_rgba(26,26,26,0.2)]"
          : isSearchExpanded
            ? "absolute inset-x-0 bottom-0 top-0 z-30 flex min-h-0 flex-col rounded-t-[24px] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3"
            : "absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-[24px] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-12px_28px_rgba(26,26,26,0.14)]"}>
          <div className="mx-auto mb-4 h-1 w-[42px] rounded-full bg-[#d6d6d6]" />

          <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#cccccc] bg-white px-3 text-right focus-within:border-[#0048c4]" dir="rtl">
            <input
              ref={searchInputRef}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onFocus={() => {
                if (!isCrmSource) setIsSearchExpanded(true);
                setIsManualSearch(true);
              }}
              onChange={(event) => {
                pendingQuerySelectionRef.current = null;
                setQuery(event.target.value);
                setSelectedNeighborhood(null);
                setSelectedSearchSubNeighborhood(null);
                setIsManualSearch(true);
                if (!isCrmSource) setIsSearchExpanded(true);
              }}
              placeholder="جستجوی محله، خیابان..."
              type="search"
              value={query}
            />
            {query ? (
              <Button unstyled
                aria-label="پاک کردن"
                onClick={() => {
                  pendingQuerySelectionRef.current = null;
                  setQuery("");
                  setSelectedNeighborhood(null);
                  setSelectedSearchSubNeighborhood(null);
                  setIsManualSearch(true);
                  if (!isCrmSource) setIsSearchExpanded(true);
                }}
                type="button"
              >
                <LinearCancelCircle aria-hidden="true" className="h-6 w-6 text-[#4d4d4d]" />
              </Button>
            ) : <SearchIcon />}
          </label>

          {canSearchNeighborhoods ? (
            <div
              className={`${isSearchExpanded && !isCrmSource ? "min-h-0 flex-1" : locationSearchQuery.isLoading || locations.length ? "max-h-40" : "max-h-[280px]"} overflow-y-auto pt-3`}
            >
              {locationSearchQuery.isLoading ? (
                <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              ) : locations.length ? (
                <div className="space-y-1">
                  {locations.map((item) => (
                    <Button unstyled
                      className={`w-full rounded-[10px] px-3 py-2 text-right ${getNeighborhoodId(selectedNeighborhood) === getNeighborhoodId(item) ? "bg-[#0048c414]" : "bg-white"}`}
                      key={`${getNeighborhoodId(item)}:${item.lat ?? ""}:${item.lng ?? ""}:${item.name}`}
                      onClick={() => selectNeighborhood(item)}
                      type="button"
                    >
                      <Typography as="span" variant="label" size="medium" weight="semibold" className="block text-sm font-semibold leading-5 text-[#1a1a1a]">{item.name}</Typography>
                      <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-xs font-normal leading-5 text-[#808080]">
                        {getNeighborhoodSubNeighborhoodNames(item).join("، ") || "\u00A0"}
                      </Typography>
                    </Button>
                  ))}
                </div>
              ) : (
                <SearchEmptyState compact className="px-2" />
              )}
            </div>
          ) : null}

          <Button unstyled
            className={`${isSearchExpanded && !isCrmSource ? "mt-auto" : "mt-4"} h-12 w-full shrink-0 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white disabled:bg-[#e0e0e0] disabled:text-[#a6a6a6]`}
            disabled={
              isResolvingLocation ||
              locationByCoordinatesQuery.isFetching ||
              neighborhoodInfoQuery.isFetching ||
              !selectedLocation ||
              !getNeighborhoodId(selectedNeighborhood)
            }
            onClick={() => {
              if (!selectedNeighborhood) return;

              const confirmedLocation = selectedNeighborhood.name.trim();

              window.localStorage.setItem(locationKey, confirmedLocation);
              window.localStorage.setItem(neighborhoodIdKey, getNeighborhoodId(selectedNeighborhood));
              const subNeighborhoodId = getSubNeighborhoodId(selectedSubNeighborhood);
              if (subNeighborhoodId) {
                window.localStorage.setItem(subNeighborhoodIdKey, subNeighborhoodId);
              } else {
                window.localStorage.removeItem(subNeighborhoodIdKey);
              }
              window.localStorage.setItem(locationLatKey, String(mapCenter.lat));
              window.localStorage.setItem(locationLngKey, String(mapCenter.lng));
              updateNewAdFlowSessionLocation(confirmedLocation);
              navigateTo(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`);
            }}
            type="button"
          >
            تایید موقعیت
          </Button>
        </section>
      </main>
    </PageFrame>
    </NewAdDesktopLayoutContext.Provider>
  );
}


function MapPickerPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[42px] w-[31px] drop-shadow-[0_8px_14px_rgba(26,26,26,0.18)]"
      fill="none"
      viewBox="0 0 31 42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="15" cy="40.5" fill="#1A1A1A" fillOpacity="0.12" rx="6" ry="1.5" />
      <path
        d="M20.7379 30.0613C26.7208 27.9158 31 22.199 31 15.4839C31 6.93237 24.0604 0 15.5 0C6.93959 0 0 6.93237 0 15.4839C0 22.1987 4.27872 27.9152 10.2612 30.061C12.3965 30.9288 14.2083 32.6522 14.2083 34.8387V38.7097C14.2083 39.4223 14.7866 40 15.5 40C16.2133 40 16.7916 39.4223 16.7916 38.7097V34.8387C16.7916 32.6525 18.6029 30.9292 20.7379 30.0613Z"
        fill="#11A366"
      />
      <path
        d="M15.5 21C17.16 21 18.575 20.415 19.745 19.245C20.915 18.075 21.5 16.66 21.5 15C21.5 13.34 20.915 11.925 19.745 10.755C18.575 9.585 17.16 9 15.5 9C13.84 9 12.425 9.585 11.255 10.755C10.085 11.925 9.5 13.34 9.5 15C9.5 16.66 10.085 18.075 11.255 19.245C12.425 20.415 13.84 21 15.5 21Z"
        fill="white"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18.4502 11.0996C18.45 7.0405 15.1588 3.75 11.0996 3.75C7.04063 3.75021 3.75021 7.04063 3.75 11.0996C3.75 15.1588 7.0405 18.45 11.0996 18.4502C15.1589 18.4502 18.4502 15.1589 18.4502 11.0996ZM19.9502 11.0996C19.9502 13.2734 19.1646 15.2632 17.8643 16.8037L21.5303 20.4697C21.8232 20.7626 21.8232 21.2374 21.5303 21.5303C21.2374 21.8232 20.7626 21.8232 20.4697 21.5303L16.8037 17.8643C15.2632 19.1646 13.2734 19.9502 11.0996 19.9502C6.21207 19.95 2.25 15.9872 2.25 11.0996C2.25021 6.2122 6.2122 2.25021 11.0996 2.25C15.9872 2.25 19.95 6.21207 19.9502 11.0996Z" fill="#4D4D4D" />
    </svg>
  );
}
