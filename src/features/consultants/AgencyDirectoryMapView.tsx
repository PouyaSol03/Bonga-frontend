import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import ListIcon from "../../shared/assets/icons/ListIcon";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { searchMapTileConfig } from "../search/searchMapData";
import { defaultSelectedCity } from "../../shared/lib/selectedCityStorage";
import LinearSearch from "../../shared/icons/LinearSearch";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { createAgencyMarkerIcon } from "./map/AgencyMarkerIcon";
import { AgencyMapController } from "./map/AgencyMapController";
import { AgencyDirectoryCard, AgencyMapSelectionFooter, AgencySelectionCard } from "./map/AgencyMapCards";
import type { AgencyDirectoryMapItem, AgencyDirectoryMapViewProps } from "./map/AgencyMap.types";

export type { AgencyDirectoryMapItem, AgencyDirectoryMapViewProps };

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
        (item): item is AgencyDirectoryMapItem & { id: string; latitude: number; longitude: number } =>
          Boolean(item.id) &&
          item.latitude !== undefined &&
          item.longitude !== undefined &&
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude) &&
          item.latitude >= 24 &&
          item.latitude <= 40 &&
          item.longitude >= 44 &&
          item.longitude <= 64,
      ),
    [items],
  );
  const fallbackCenter = center ?? {
    latitude: defaultSelectedCity.latitude,
    longitude: defaultSelectedCity.longitude,
  };
  const cityMappableItems = useMemo(
    () =>
      mappableItems.filter(
        (item) =>
          Math.abs(item.latitude - fallbackCenter.latitude) <= 0.8 &&
          Math.abs(item.longitude - fallbackCenter.longitude) <= 0.8,
      ),
    [fallbackCenter.latitude, fallbackCenter.longitude, mappableItems],
  );
  const selectedItem = useMemo(
    () =>
      selectedAgencyId === null
        ? null
        : mappableItems.find((item) => item.id === selectedAgencyId) ?? null,
    [mappableItems, selectedAgencyId],
  );
  const targetCenter = useMemo(() => {
    if (cityMappableItems.length > 0) {
      const sumLat = cityMappableItems.reduce((acc, item) => acc + item.latitude, 0);
      const sumLng = cityMappableItems.reduce((acc, item) => acc + item.longitude, 0);
      return {
        latitude: sumLat / cityMappableItems.length,
        longitude: sumLng / cityMappableItems.length,
      };
    }
    return fallbackCenter;
  }, [cityMappableItems, fallbackCenter]);
  const isSelection = variant === "selection";

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-surface-container [direction:rtl]">
      <TopBar onBack={onBack} title={title} />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapContainer
          attributionControl={false}
          center={[targetCenter.latitude, targetCenter.longitude]}
          className="h-full min-h-[320px] w-full bg-surface-container"
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          preferCanvas
          zoom={13}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            className={searchMapTileConfig.className}
            maxZoom={searchMapTileConfig.maxZoom}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />

          <AgencyMapController
            center={targetCenter}
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

        {isSelection ? (
          <label className="absolute inset-x-4 top-4 z-[500] flex h-12 items-center gap-3 rounded-xl border border-outline bg-surface-container-lowest px-4 text-on-surface-var shadow-[0_3px_12px_rgba(26,26,26,0.08)] focus-within:border-primary">
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base leading-6 text-on-surface outline-none placeholder:text-outline"
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue}
            />
            <LinearSearch className="w-6 h-6 text-on-surface-var" />
          </label>
        ) : null}

        {isSelection && searchValue.trim() && items.length === 0 ? (
          <div className="absolute inset-x-0 bottom-0 top-16 z-[450] overflow-y-auto bg-surface-container-lowest">
            <SearchEmptyState />
          </div>
        ) : mappableItems.length === 0 ? (
          <div className={`pointer-events-none absolute inset-x-6 z-[400] rounded-xl bg-surface-container-lowest/95 px-4 py-3 text-center text-sm font-medium leading-6 text-on-surface-var shadow-sm ${isSelection ? "top-20" : "top-6"}`}>
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
              className="pointer-events-auto flex h-10 min-w-[103px] items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-xl font-bold leading-6 text-on-primary shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary/40 active:opacity-80"
              onClick={onOpenList}
              type="button"
            >
              <ListIcon />
              <Typography as="span" variant="body" size="medium" weight="regular">{listLabel}</Typography>
            </Button>
          </div>
        ) : null}

        {isSelection ? (
          <AgencyMapSelectionFooter
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
