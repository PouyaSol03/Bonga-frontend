import type { BrowserLocation } from "../../../shared/lib/browserLocation";
import type {
  SearchMapBounds,
  SearchMapCenter,
  SearchMapListing,
  SearchMapListingId,
} from "../searchMapData";
import { searchMapTileConfig } from "../searchMapData";
import { emptyListingIds } from "../map/constants";
import type { useSearchMapGeofence } from "../map/useSearchMapGeofence";
import { SearchMapListView } from "./SearchMapListView";
import { SearchMapView } from "./SearchMapView";

interface SearchMapViewContainerProps {
  apiListListings: SearchMapListing[];
  bluePriceMarkerListingIds: Set<SearchMapListingId>;
  geofence: ReturnType<typeof useSearchMapGeofence>;
  isFullListOpen: boolean;
  isGeofenceEditorOpen: boolean;
  isListLoading: boolean;
  mapCenter: SearchMapCenter;
  mapCenterSignal: number;
  mapResizeSignal: number;
  neighborhoodGeofences: Array<[number, number][]>;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
  onReturnToMapView: () => void;
  onSelectListing: (listing: SearchMapListing) => void;
  seenListingIds: Set<SearchMapListingId>;
  selectedListingId: string | number | null;
  userLocation: BrowserLocation | null;
  visibleListings: SearchMapListing[];
}

export function SearchMapViewContainer({
  apiListListings,
  bluePriceMarkerListingIds,
  geofence,
  isFullListOpen,
  isGeofenceEditorOpen,
  isListLoading,
  mapCenter,
  mapCenterSignal,
  mapResizeSignal,
  neighborhoodGeofences,
  onBoundsChange,
  onMapClick,
  onReturnToMapView,
  onSelectListing,
  seenListingIds,
  selectedListingId,
  userLocation,
  visibleListings,
}: SearchMapViewContainerProps) {
  if (isFullListOpen) {
    return (
      <SearchMapListView
        isLoading={isListLoading}
        listings={apiListListings}
        onMapClick={onReturnToMapView}
      />
    );
  }

  return (
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
      neighborhoodGeofences={neighborhoodGeofences}
      userLocation={userLocation}
      freehandGeofenceEnabled={geofence.isDrawMode}
      geofenceResetSignal={geofence.geofenceResetSignal}
      geofenceResult={geofence.geofenceResult}
      geofenceDisplayMode={geofence.isGeofenceConfirmed ? "confirmed" : "editing"}
      onGeofenceCancelled={geofence.cancelFreehandDrawing}
      onGeofenceComplete={geofence.handleGeofenceComplete}
      onGeofenceInvalid={geofence.handleGeofenceInvalid}
      onGeofenceStateChange={geofence.setDrawingState}
      onBoundsChange={onBoundsChange}
      onMapClick={onMapClick}
      onSelectListing={onSelectListing}
    />
  );
}
