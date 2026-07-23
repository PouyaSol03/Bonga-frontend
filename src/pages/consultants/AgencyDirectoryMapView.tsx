import { DivIcon, LatLngBounds } from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import ListIcon from "../../assets/icons/ListIcon";
import { TopBar } from "../../components/TopBar";
import { searchMapCenter, searchMapTileConfig } from "../search/searchMapData";

export type AgencyDirectoryMapItem = {
  address?: string;
  id?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  name: string;
  neighborhoodIds?: string[];
  rank: string;
  score: string;
};

type AgencyDirectoryMapViewProps = {
  center?: {
    latitude: number;
    longitude: number;
  };
  items: AgencyDirectoryMapItem[];
  onBack: () => void;
  onOpenAgency: (item: AgencyDirectoryMapItem) => void;
  onOpenList: () => void;
  onSelectAgency: (id: string | null) => void;
  selectedAgencyId: string | null;
};

function createAgencyMarkerIcon(isSelected: boolean) {
  const markerColor = isSelected ? "#11A366" : "#0048C4";
  const markerWidth = isSelected ? 31 : 18;
  const markerHeight = isSelected ? 40 : 24;

  return new DivIcon({
    className: "agency-directory-map-marker-wrapper",
    html: `
      <svg aria-hidden="true" width="${markerWidth}" height="${markerHeight}" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15.5" cy="40.5" rx="6" ry="1.5" fill="#1A1A1A" fill-opacity="0.12"/>
        <path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484C31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="${markerColor}"/>
        <circle cx="15.5" cy="15" r="6" fill="white"/>
      </svg>
    `,
    iconAnchor: [markerWidth / 2, markerHeight],
    iconSize: [markerWidth, markerHeight],
  });
}

function AgencyMapController({
  items,
  onMapClick,
}: {
  items: AgencyDirectoryMapItem[];
  onMapClick: () => void;
}) {
  const map = useMap();
  const coordinates = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.latitude !== undefined && item.longitude !== undefined,
        )
        .map(
          (item) =>
            [item.latitude as number, item.longitude as number] as [
              number,
              number,
            ],
        ),
    [items],
  );

  useMapEvents({
    click: onMapClick,
  });

  useEffect(() => {
    map.invalidateSize();

    if (coordinates.length === 0) return;

    if (coordinates.length === 1) {
      map.setView(coordinates[0], Math.max(map.getZoom(), 15), {
        animate: false,
      });
      return;
    }

    map.fitBounds(new LatLngBounds(coordinates), {
      animate: false,
      maxZoom: 16,
      paddingBottomRight: [36, 170],
      paddingTopLeft: [36, 36],
    });
  }, [coordinates, map]);

  return null;
}

function AgencyMapCard({
  item,
  onClick,
}: {
  item: AgencyDirectoryMapItem;
  onClick: () => void;
}) {
  return (
    <button
      className="absolute inset-x-4 bottom-4 z-[500] flex min-h-[104px] items-center gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4 text-right shadow-[0_10px_28px_rgba(26,26,26,0.16)] active:bg-[#fafafa]"
      dir="rtl"
      onClick={onClick}
      type="button"
    >
      {item.image ? (
        <img
          alt=""
          className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover shadow-[0_0_16px_rgba(77,77,77,0.1)]"
          src={item.image}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[#e9f1ff] text-2xl font-bold text-[#0048c4]"
        >
          {item.name.trim().charAt(0) || "آ"}
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col">
        <strong className="truncate text-base font-semibold leading-6 text-[#4d4d4d]">
          {item.name}
        </strong>
        {item.address ? (
          <span className="mt-1 truncate text-[10px] font-normal leading-4 text-[#808080]">
            {item.address}
          </span>
        ) : null}
        <span className="mt-auto flex items-center justify-between pt-4 text-xs leading-5 text-[#1a1a1a]">
          <span>
            رتبه <b className="mr-1 text-sm text-[#00a66a]">{item.rank}</b>
          </span>
          <span>
            امتیاز <b className="mr-1 text-sm text-[#00a66a]">{item.score}</b>
          </span>
        </span>
      </span>
    </button>
  );
}

export function AgencyDirectoryMapView({
  center,
  items,
  onBack,
  onOpenAgency,
  onOpenList,
  onSelectAgency,
  selectedAgencyId,
}: AgencyDirectoryMapViewProps) {
  const mappableItems = useMemo(
    () =>
      items.filter(
        (item): item is AgencyDirectoryMapItem & {
          id: string;
          latitude: number;
          longitude: number;
        } =>
          Boolean(item.id) &&
          item.latitude !== undefined &&
          item.longitude !== undefined &&
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude),
      ),
    [items],
  );
  const selectedItem = useMemo(
    () =>
      selectedAgencyId === null
        ? null
        : mappableItems.find((item) => item.id === selectedAgencyId) ?? null,
    [mappableItems, selectedAgencyId],
  );
  const initialCenter = center ?? {
    latitude: searchMapCenter.latitude,
    longitude: searchMapCenter.longitude,
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f0f0f0] [direction:rtl]">
      <TopBar onBack={onBack} title="مشاورین" />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapContainer
          attributionControl={false}
          center={[initialCenter.latitude, initialCenter.longitude]}
          className="h-full min-h-[320px] w-full bg-[#f5f5f5]"
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          preferCanvas
          zoom={15}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />

          <AgencyMapController
            items={mappableItems}
            onMapClick={() => onSelectAgency(null)}
          />

          {mappableItems.map((item) => {
            const isSelected = selectedAgencyId === item.id;

            return (
              <Marker
                bubblingMouseEvents={false}
                eventHandlers={{
                  click: (event) => {
                    event.originalEvent?.stopPropagation?.();
                    onSelectAgency(item.id);
                  },
                }}
                icon={createAgencyMarkerIcon(isSelected)}
                key={item.id}
                position={[item.latitude, item.longitude]}
                zIndexOffset={isSelected ? 10_000 : 1_000}
              />
            );
          })}
        </MapContainer>

        {mappableItems.length === 0 ? (
          <div className="pointer-events-none absolute inset-x-6 top-6 z-[400] rounded-xl bg-white/95 px-4 py-3 text-center text-sm font-medium leading-6 text-[#4d4d4d] shadow-sm">
            برای آژانس‌های دریافت‌شده هنوز موقعیت مکانی ثبت نشده است.
          </div>
        ) : null}

        {selectedItem ? (
          <AgencyMapCard
            item={selectedItem}
            onClick={() => onOpenAgency(selectedItem)}
          />
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[500] flex justify-center">
            <button
              className="pointer-events-auto flex h-10 min-w-[103px] items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              onClick={onOpenList}
              type="button"
            >
              <ListIcon />
              <span>لیست</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
