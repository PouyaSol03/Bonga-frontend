import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { searchMapTileConfig } from "../../search/searchMapData";
import { Header } from "./components/NewAdControls";
import { NewAdDesktopLayoutContext } from "./NewAdLayoutContext";
import { clearNewAdDraftStorage, useRequireAuth } from "./utils";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

import { getNeighborhoodId } from "./location/newAdLocationStorage";
import { MapPickerPinIcon } from "./location/NewAdLocationIcons";
import { NewAdLocationMap } from "./location/NewAdLocationMap";
import { LocationSearchDrawer } from "./location/LocationSearchDrawer";
import { useNewAdLocationState } from "./location/useNewAdLocationState";
import { useLocationConfirmation } from "./location/useLocationConfirmation";

export function NewAdLocationPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const label = searchParams.get("label") ?? "آگهی ملک";
  const isCrmSource = searchParams.get("editSource") === "crm";

  const state = useNewAdLocationState();

  const confirmation = useLocationConfirmation({
    label,
    mapCenter: state.mapCenter,
    query: state.query,
    selectedNeighborhood: state.selectedNeighborhood,
    selectedSubNeighborhood: state.selectedSubNeighborhood,
    updateMapCenter: state.updateMapCenter,
  });

  useRequireAuth();

  useEffect(() => {
    const clearOnExit = () => {
      if (window.location.pathname.startsWith("/new-ad")) return;
      clearNewAdDraftStorage();
    };

    window.addEventListener("popstate", clearOnExit);
    return () => window.removeEventListener("popstate", clearOnExit);
  }, []);

  return (
    <NewAdDesktopLayoutContext.Provider value={isCrmSource}>
      <PageFrame
        className="bg-surface-container-lowest text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden [direction:rtl]"
        variant="flush"
      >
        <Header onBack={confirmation.handleBack} title="موقعیت آگهی" />
        <main className="bg-surface-container relative min-h-0 flex-1 overflow-hidden">
          <MapContainer
            attributionControl={false}
            center={[state.mapCenter.lat, state.mapCenter.lng]}
            className="bg-surface-container absolute inset-0 z-0 h-full w-full"
            maxZoom={searchMapTileConfig.maxZoom}
            minZoom={searchMapTileConfig.minZoom}
            preferCanvas
            zoom={state.mapCenter.zoom}
            zoomControl={false}
          >
            <TileLayer
              attribution={searchMapTileConfig.attribution}
              className={searchMapTileConfig.className}
              maxZoom={searchMapTileConfig.maxZoom}
              tms={searchMapTileConfig.isTms}
              url={searchMapTileConfig.urlTemplate}
            />
            <NewAdLocationMap center={state.mapCenter} onCenterChange={state.updateMapCenter} />
            {state.selectedNeighborhoodGeofence.length >= 3 ? (
              <Polygon
                interactive={false}
                pathOptions={{
                  color: "#0048C4",
                  fillColor: "#0048C4",
                  fillOpacity: 0.18,
                  opacity: 0.9,
                  weight: 2,
                }}
                positions={state.selectedNeighborhoodGeofence}
              />
            ) : null}
          </MapContainer>

          <Button
            unstyled
            aria-label="موقعیت من"
            className={`bg-surface-container-lowest text-on-surface absolute z-20 flex h-9 items-center gap-1 rounded-[10px] px-3 text-xs leading-4 font-medium shadow-[0_4px_14px_rgba(26,26,26,0.14)] ${isCrmSource ? "bottom-6 left-6" : "right-4 bottom-[200px]"}`}
            onClick={confirmation.moveToBrowserLocation}
            type="button"
          >
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12.8 8C12.8 10.651 10.651 12.8 8 12.8M12.8 8C12.8 5.34903 10.651 3.2 8 3.2M12.8 8H14M8 12.8C5.34903 12.8 3.2 10.651 3.2 8M8 12.8V14M3.2 8C3.2 5.34903 5.34903 3.2 8 3.2M3.2 8H2M8 3.2V2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
                  fill="currentColor"
                />
              </svg>
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular">
              موقعیت من
            </Typography>
          </Button>

          <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-full">
            <MapPickerPinIcon />
          </div>

          <LocationSearchDrawer
            canSearchNeighborhoods={state.canSearchNeighborhoods}
            isCrmSource={isCrmSource}
            isLoading={state.locationSearchQuery.isLoading}
            isResolvingLocation={state.isResolvingLocation}
            isSearchExpanded={state.isSearchExpanded}
            locations={state.locations}
            onConfirm={confirmation.handleConfirmLocation}
            onQueryChange={(q) => {
              state.pendingQuerySelectionRef.current = null;
              state.setQuery(q);
              state.setSelectedNeighborhood(null);
              state.setSelectedSearchSubNeighborhood(null);
              state.setIsManualSearch(true);
              if (!isCrmSource) state.setIsSearchExpanded(true);
            }}
            onSearchFocus={() => {
              if (!isCrmSource) state.setIsSearchExpanded(true);
              state.setIsManualSearch(true);
            }}
            onSelectNeighborhood={state.selectNeighborhood}
            query={state.query}
            searchInputRef={state.searchInputRef}
            selectedNeighborhood={state.selectedNeighborhood}
            submitDisabled={
              state.isResolvingLocation ||
              state.locationByCoordinatesQuery.isFetching ||
              state.neighborhoodInfoQuery.isFetching ||
              !getNeighborhoodId(state.selectedNeighborhood)
            }
          />
        </main>
      </PageFrame>
    </NewAdDesktopLayoutContext.Provider>
  );
}
