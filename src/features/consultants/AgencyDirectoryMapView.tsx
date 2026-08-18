import "leaflet/dist/leaflet.css";
import { DivIcon, LatLngBounds } from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import ListIcon from "../../shared/assets/icons/ListIcon";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { searchMapCenter, searchMapTileConfig } from "../search/searchMapData";
import LinearList from "../../shared/icons/LinearList";
import LinearArrowLeft2 from "../../shared/icons/LinearArrowLeft2";
import LinearStar from "../../shared/icons/LinearStar";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearSearch from "../../shared/icons/LinearSearch";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

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
  confirmDisabled?: boolean;
  confirmLabel?: string;
  items: AgencyDirectoryMapItem[];
  listLabel?: string;
  onBack: () => void;
  onConfirmSelection?: () => void;
  onOpenAgency: (item: AgencyDirectoryMapItem) => void;
  onOpenList: () => void;
  onSearchChange?: (value: string) => void;
  onSelectAgency: (id: string | null) => void;
  profileLabel?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  selectedAgencyId: string | null;
  title?: string;
  variant?: "directory" | "selection";
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
  selectionLayout,
}: {
  items: AgencyDirectoryMapItem[];
  onMapClick: () => void;
  selectionLayout: boolean;
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
      paddingBottomRight: [36, selectionLayout ? 240 : 170],
      paddingTopLeft: [36, selectionLayout ? 96 : 36],
    });
  }, [coordinates, map, selectionLayout]);

  return null;
}

function AgencyDirectoryCard({
  item,
  onClick,
}: {
  item: AgencyDirectoryMapItem;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      className="absolute inset-x-4 bottom-4 z-[500] flex min-h-[104px] items-center gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-4 text-right shadow-[0_-4px_16px_rgba(26,26,26,0.08)] active:bg-[#fafafa]"
      dir="rtl"
      onClick={onClick}
      type="button"
    >
      <AgencyImage item={item} />
      <AgencySummary item={item} />
    </Button>
  );
}

function AgencyImage({ item }: { item: AgencyDirectoryMapItem }) {
  return item.image ? (
    <img
      alt=""
      className="h-[72px] w-[72px] block shrink-0 rounded-xl object-cover shadow-[0_0_16px_rgba(77,77,77,0.08)]"
      src={item.image}
    />
  ) : (
    <Typography as="span" variant="headline" size="small"
      aria-hidden="true"
      className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[#e9f1ff] text-2xl font-bold text-[#0048c4]"
    >
      {item.name.trim().charAt(0) || "آ"}
    </Typography>
  );
}

function AgencySummary({ item }: { item: AgencyDirectoryMapItem }) {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="flex flex-1 flex-col h-full gap-y-4">
      <strong className="truncate text-base font-medium text-[#4d4d4d]">{item.name}</strong>
      {item.address ? (
        <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 truncate text-[10px] font-normal text-[#808080]">{item.address}</Typography>
      ) : null}
      <Typography as="span" variant="label" size="small" weight="medium" className="flex items-center justify-between text-xs font-medium leading-5 text-[#1a1a1a]">
        <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1.5"><LinearStar className="w-4 h-4 text-[#4D4D4D]" /><Typography as="span" variant="body" size="medium" weight="regular">امتیاز</Typography><b className="text-sm font-semibold text-[#00a66a] px-2">{item.score}</b></Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1.5"><LinearRanking className="w-4 h-4 text-[#4D4D4D]"/><Typography as="span" variant="body" size="medium" weight="regular">رتبه</Typography><b className="text-sm font-semibold text-[#00a66a] px-2">{item.rank}</b></Typography>
      </Typography>
    </Typography>
  );
}

function AgencySelectionCard({
  item,
  onOpen,
  profileLabel,
}: {
  item: AgencyDirectoryMapItem;
  onOpen: () => void;
  profileLabel: string;
}) {
  return (
    <div className="absolute inset-x-0 bottom-[76px] z-[500] rounded-t-[22px] bg-white px-4 pb-3 pt-4 shadow-[0_-8px_26px_rgba(26,26,26,0.08)]" dir="rtl">
      <Typography as="span" variant="body" size="medium" weight="regular" aria-hidden="true" className="mx-auto mb-3 block h-1 w-[42px] rounded-full bg-[#d8d8d8]" />
      <article className="flex flex-col gap-y-2 rounded-2xl border-2 border-[#0b55d4] bg-[#eef4ff] p-4">
        <div className="flex gap-4">
          <AgencyImage item={item} />
          <AgencySummary item={item} />
        </div>

        <div className="h-px bg-[#cbdcff]" />

        <div className="flex items-center justify-between gap-3">
          <Typography as="span" variant="label" size="large" weight="medium" className="flex items-center gap-2 text-base font-medium text-[#4d4d4d]">
            <RadioIndicator checked />
            <Typography as="span" variant="body" size="medium" weight="regular">انتخاب</Typography>
          </Typography>
          <Button unstyled
            className="flex items-center justify-center gap-2 rounded-xl border border-[#0b55d4] bg-white/35 px-4 py-2.5 text-[#0b55d4] active:bg-white"
            onClick={onOpen}
            type="button"
          >
            <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium">{profileLabel}</Typography>
            <LinearArrowLeft2 className="w-5 h-5 text-[#0048C4]"/>
          </Button>
        </div>
      </article>
    </div>
  );
}

function SelectionFooter({
  confirmDisabled,
  confirmLabel,
  listLabel,
  onConfirm,
  onOpenList,
}: {
  confirmDisabled: boolean;
  confirmLabel: string;
  listLabel: string;
  onConfirm: () => void;
  onOpenList: () => void;
}) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-[550] flex h-[76px] items-center gap-3 border-t border-[#eeeeee] bg-white px-4" dir="rtl">
      <Button unstyled
        className="flex h-12 w-[104px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cccccc] bg-white text-base font-semibold text-[#1a1a1a] active:bg-[#f7f7f7]"
        onClick={onOpenList}
        type="button"
      >
        <LinearList className="w-6 h-6" />
        <Typography as="span" variant="body" size="medium" weight="regular">{listLabel}</Typography>
      </Button>
      <Button unstyled
        className="h-12 min-w-0 flex-1 rounded-xl bg-[#0048c4] px-4 text-base font-semibold text-white active:bg-[#003fae] disabled:bg-[#e3e3e3] disabled:text-[#b3b3b3]"
        disabled={confirmDisabled}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </Button>
    </footer>
  );
}

export function AgencyDirectoryMapView({
  center,
  confirmDisabled = true,
  confirmLabel = "ارسال به آژانس",
  items,
  listLabel = "لیست",
  onBack,
  onConfirmSelection,
  onOpenAgency,
  onOpenList,
  onSearchChange,
  onSelectAgency,
  profileLabel = "مشاهده صفحه",
  searchPlaceholder = "جستجوی آژانس",
  searchValue = "",
  selectedAgencyId,
  title = "مشاورین",
  variant = "directory",
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
  const isSelection = variant === "selection";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#f0f0f0] [direction:rtl]">
      <TopBar onBack={onBack} title={title} />

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
            selectionLayout={isSelection}
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

        {isSelection ? (
          <label className="absolute inset-x-4 top-4 z-[500] flex h-12 items-center gap-3 rounded-xl border border-[#808080] bg-white px-4 text-[#4d4d4d] shadow-[0_3px_12px_rgba(26,26,26,0.08)] focus-within:border-[#0048c4]">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue}
            />
            <LinearSearch className="w-6 h-6 text-[#4D4D4D]" />
          </label>
        ) : null}

        {isSelection && searchValue.trim() && items.length === 0 ? (
          <div className="absolute inset-x-0 bottom-0 top-16 z-[450] overflow-y-auto bg-white">
            <SearchEmptyState />
          </div>
        ) : mappableItems.length === 0 ? (
          <div className={`pointer-events-none absolute inset-x-6 z-[400] rounded-xl bg-white/95 px-4 py-3 text-center text-sm font-medium leading-6 text-[#4d4d4d] shadow-sm ${isSelection ? "top-20" : "top-6"}`}>
            برای آژانس‌های دریافت‌شده هنوز موقعیت مکانی ثبت نشده است.
          </div>
        ) : null}

        {selectedItem ? (
          isSelection ? (
            <AgencySelectionCard
              item={selectedItem}
              onOpen={() => onOpenAgency(selectedItem)}
              profileLabel={profileLabel}
            />
          ) : (
            <AgencyDirectoryCard item={selectedItem} onClick={() => onOpenAgency(selectedItem)} />
          )
        ) : !isSelection ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[500] flex justify-center">
            <Button unstyled
              className="pointer-events-auto flex h-10 min-w-[103px] items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              onClick={onOpenList}
              type="button"
            >
              <ListIcon />
              <Typography as="span" variant="body" size="medium" weight="regular">{listLabel}</Typography>
            </Button>
          </div>
        ) : null}

        {isSelection ? (
          <SelectionFooter
            confirmDisabled={confirmDisabled}
            confirmLabel={confirmLabel}
            listLabel={listLabel}
            onConfirm={() => onConfirmSelection?.()}
            onOpenList={onOpenList}
          />
        ) : null}
      </main>
    </div>
  );
}
