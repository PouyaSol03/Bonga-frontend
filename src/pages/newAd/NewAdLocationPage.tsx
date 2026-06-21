import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { PageFrame } from "../../app/PageFrame";
import { getBrowserLocation } from "../../lib/browserLocation";
import { useNeighborhoodInfoWithLocQuery, useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import { searchMapTileConfig } from "../search/searchMapData";
import { Header } from "./components/NewAdControls";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
} from "./data";
import { clearNewAdDraftStorage, navigateTo, useRequireAuth } from "./utils";

type NewAdMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

const defaultMapCenter: NewAdMapCenter = {
  lat: 36.2605,
  lng: 59.5986,
  zoom: 15,
};
const minNeighborhoodSearchLength = 3;

function getStoredCityId() {
  return window.localStorage.getItem("bonga-selected-city-id") ?? "";
}

function getStoredMapCenter(): NewAdMapCenter {
  const storedLat = Number(window.localStorage.getItem(locationLatKey));
  const storedLng = Number(window.localStorage.getItem(locationLngKey));

  if (Number.isFinite(storedLat) && Number.isFinite(storedLng)) {
    return {
      lat: storedLat,
      lng: storedLng,
      zoom: defaultMapCenter.zoom,
    };
  }

  return defaultMapCenter;
}

function getNeighborhoodId(neighborhood: NeighborhoodDto | null) {
  return String(neighborhood?.id ?? neighborhood?._id ?? "");
}

function createStoredNeighborhood(): NeighborhoodDto | null {
  const id = window.localStorage.getItem(neighborhoodIdKey) ?? "";
  const name = window.localStorage.getItem(locationKey) ?? "";
  const lat = Number(window.localStorage.getItem(locationLatKey));
  const lng = Number(window.localStorage.getItem(locationLngKey));

  if (!id || !name) return null;

  return {
    id,
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined,
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
  const label = new URLSearchParams(window.location.search).get("label") ?? "آگهی ملک";
  const cityId = getStoredCityId();
  const [query, setQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<NewAdMapCenter>(getStoredMapCenter);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(
    createStoredNeighborhood,
  );
  const normalizedQuery = query.trim();
  const canSearchNeighborhoods = normalizedQuery.length >= minNeighborhoodSearchLength;

  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId) && canSearchNeighborhoods,
    q: normalizedQuery,
  });
  const neighborhoodByLocationQuery = useNeighborhoodInfoWithLocQuery({
    cityId,
    enabled: Boolean(cityId),
    lat: Number(mapCenter.lat.toFixed(7)),
    lng: Number(mapCenter.lng.toFixed(7)),
  });

  const locations = useMemo(
    () => (canSearchNeighborhoods ? neighborhoodsQuery.data ?? [] : []),
    [canSearchNeighborhoods, neighborhoodsQuery.data],
  );
  const selectedLocation = selectedNeighborhood?.name ?? "";

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
    if (!neighborhoodByLocationQuery.data) return;

    setSelectedNeighborhood(neighborhoodByLocationQuery.data);
  }, [neighborhoodByLocationQuery.data]);

  const selectNeighborhood = (neighborhood: NeighborhoodDto) => {
    setSelectedNeighborhood(neighborhood);
    setQuery(neighborhood.name);

    if (Number.isFinite(neighborhood.lat) && Number.isFinite(neighborhood.lng)) {
      setMapCenter({
        lat: Number(neighborhood.lat),
        lng: Number(neighborhood.lng),
        zoom: Math.max(mapCenter.zoom, 16),
      });
    }
  };

  const moveToBrowserLocation = () => {
    void getBrowserLocation().then((location) => {
      setMapCenter({
        lat: location.latitude,
        lng: location.longitude,
        zoom: Math.max(mapCenter.zoom, 16),
      });
    });
  };

  return (
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
            onCenterChange={setMapCenter}
          />
        </MapContainer>

        <button
          aria-label="موقعیت من"
          className="absolute bottom-[150px] left-4 z-20 flex h-9 items-center gap-1 rounded-[10px] bg-white px-3 text-xs font-medium leading-4 text-[#1a1a1a] shadow-[0_4px_14px_rgba(26,26,26,0.14)]"
          onClick={moveToBrowserLocation}
          type="button"
        >
          <span>موقعیت من</span>
          <span className="text-[#4d4d4d]">⌖</span>
        </button>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full">
          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[#12a36a] text-white shadow-[0_8px_18px_rgba(18,163,106,0.35)]">
            <span className="h-5 w-5 rounded-full border-[5px] border-white bg-[#12a36a]" />
            <span className="absolute -bottom-2 h-4 w-4 rotate-45 rounded-br-[4px] bg-[#12a36a]" />
          </div>
        </div>

        <section className="absolute inset-x-0 bottom-0 z-30 rounded-t-[24px] bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-12px_28px_rgba(26,26,26,0.14)]">
          <div className="mx-auto mb-4 h-1 w-[42px] rounded-full bg-[#d6d6d6]" />

          <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#cccccc] bg-white px-3 text-right focus-within:border-[#0048c4]" dir="rtl">
            <SearchIcon />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی محله، خیابان..."
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="پاک کردن"
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#808080] text-xs leading-none text-[#4d4d4d]"
                onClick={() => setQuery("")}
                type="button"
              >
                ×
              </button>
            ) : null}
          </label>

          {canSearchNeighborhoods ? (
            <div className="max-h-40 overflow-y-auto pt-3">
              {neighborhoodsQuery.isLoading ? (
                <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              ) : locations.length ? (
                <div className="space-y-1">
                  {locations.map((item) => (
                    <button
                      className={`w-full rounded-[10px] px-3 py-2 text-right ${getNeighborhoodId(selectedNeighborhood) === getNeighborhoodId(item) ? "bg-[#0048c414]" : "bg-white"}`}
                      key={getNeighborhoodId(item)}
                      onClick={() => selectNeighborhood(item)}
                      type="button"
                    >
                      <span className="block text-sm font-semibold leading-5 text-[#1a1a1a]">{item.name}</span>
                      <span className="mt-1 block text-xs font-normal leading-5 text-[#808080]">
                        {window.localStorage.getItem("bonga-selected-city") ?? "شهر انتخاب‌شده"}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="m-0 px-3 py-2 text-right text-xs font-normal leading-5 text-[#808080]">
                  محله‌ای با این عبارت پیدا نشد.
                </p>
              )}
            </div>
          ) : null}

          <button
            className="mt-4 h-12 w-full rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white disabled:bg-[#e0e0e0] disabled:text-[#a6a6a6]"
            disabled={!selectedLocation || !getNeighborhoodId(selectedNeighborhood)}
            onClick={() => {
              if (!selectedNeighborhood) return;

              window.localStorage.setItem(locationKey, selectedNeighborhood.name);
              window.localStorage.setItem(neighborhoodIdKey, getNeighborhoodId(selectedNeighborhood));
              window.localStorage.setItem(locationLatKey, String(mapCenter.lat));
              window.localStorage.setItem(locationLngKey, String(mapCenter.lng));
              navigateTo(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`);
            }}
            type="button"
          >
            تایید موقعیت
          </button>
        </section>
      </main>
    </PageFrame>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-[#808080]" fill="none" viewBox="0 0 24 24">
      <path d="M11 19a8 8 0 1 1 5.657-2.343L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
