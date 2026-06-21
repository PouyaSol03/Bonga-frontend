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
          className="absolute bottom-[200px] right-4 z-20 flex h-9 items-center gap-1 rounded-[10px] bg-white px-3 text-xs font-medium leading-4 text-[#1a1a1a] shadow-[0_4px_14px_rgba(26,26,26,0.14)]"
          onClick={moveToBrowserLocation}
          type="button"
        >
          <span className="text-[#4d4d4d]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.8 8C12.8 10.651 10.651 12.8 8 12.8M12.8 8C12.8 5.34903 10.651 3.2 8 3.2M12.8 8H14M8 12.8C5.34903 12.8 3.2 10.651 3.2 8M8 12.8V14M3.2 8C3.2 5.34903 5.34903 3.2 8 3.2M3.2 8H2M8 3.2V2" stroke="#4D4D4D" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" fill="#4D4D4D" />
            </svg>
          </span>
          <span>موقعیت من</span>
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
                onClick={() => setQuery("")}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.25 12C20.25 7.44365 16.5563 3.75 12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12ZM14.6201 8.31934C14.9129 8.0266 15.3877 8.02681 15.6807 8.31934C15.9736 8.61221 15.9735 9.08697 15.6807 9.37988L13.0605 12L15.6807 14.6201C15.9732 14.913 15.9734 15.3879 15.6807 15.6807C15.3879 15.9734 14.913 15.9732 14.6201 15.6807L12 13.0605L9.38184 15.6807C9.08904 15.9734 8.61418 15.9732 8.32129 15.6807C8.0284 15.3878 8.02848 14.913 8.32129 14.6201L10.9395 12L8.32031 9.37988C8.02765 9.08696 8.02748 8.61214 8.32031 8.31934C8.61314 8.02667 9.088 8.02674 9.38086 8.31934L12 10.9395L14.6201 8.31934ZM21.75 12C21.75 17.3847 17.3847 21.75 12 21.75C6.61522 21.75 2.25 17.3847 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3847 2.25 21.75 6.61522 21.75 12Z" fill="#4D4D4D" />
                </svg>
              </button>
            ) : <SearchIcon />}
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18.4502 11.0996C18.45 7.0405 15.1588 3.75 11.0996 3.75C7.04063 3.75021 3.75021 7.04063 3.75 11.0996C3.75 15.1588 7.0405 18.45 11.0996 18.4502C15.1589 18.4502 18.4502 15.1589 18.4502 11.0996ZM19.9502 11.0996C19.9502 13.2734 19.1646 15.2632 17.8643 16.8037L21.5303 20.4697C21.8232 20.7626 21.8232 21.2374 21.5303 21.5303C21.2374 21.8232 20.7626 21.8232 20.4697 21.5303L16.8037 17.8643C15.2632 19.1646 13.2734 19.9502 11.0996 19.9502C6.21207 19.95 2.25 15.9872 2.25 11.0996C2.25021 6.2122 6.2122 2.25021 11.0996 2.25C15.9872 2.25 19.95 6.21207 19.9502 11.0996Z" fill="#4D4D4D" />
    </svg>
  );
}
