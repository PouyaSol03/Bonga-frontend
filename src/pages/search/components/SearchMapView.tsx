import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { DivIcon } from "leaflet";
import { Circle, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { BrowserLocation } from "../../../shared/lib/browserLocation";
import type { NeighborhoodGeoPoint } from "../../../core/services/neighborhood.service";
import { SearchMapMarker } from "./SearchMapMarker";
import { SearchMapGeofenceConfirmedLayer } from "../geofence/SearchMapGeofenceConfirmedLayer";
import { SearchMapGeofenceLayer } from "../geofence/SearchMapGeofenceLayer";
import { SearchMapGeofencePreviewLayer } from "../geofence/SearchMapGeofencePreviewLayer";
import type {
  DrawingState,
  GeofenceResult,
  GeofenceValidationResult,
} from "../geofence/geofenceTypes";
import type {
  SearchMapBounds,
  SearchMapCenter,
  SearchMapDotMarker,
  SearchMapListing,
  SearchMapListingId,
  SearchMapTileConfig,
} from "../searchMapData";

type InvalidGeofenceResult = Exclude<
  GeofenceValidationResult,
  { isValid: true }
>;

type SearchMapViewProps = {
  center: SearchMapCenter;
  centerSignal?: number;
  resizeSignal?: number;
  listings: SearchMapListing[];
  neighborhoodGeofences?: NeighborhoodGeoPoint[][];
  dotMarkers?: SearchMapDotMarker[];
  priceMarkerListingIds: Set<SearchMapListingId>;
  seenListingIds: Set<SearchMapListingId>;
  selectedListingId: SearchMapListingId | null;
  tileConfig: SearchMapTileConfig;
  userLocation?: BrowserLocation | null;
  freehandGeofenceEnabled?: boolean;
  geofenceResetSignal?: number;
  geofenceResult?: GeofenceResult | null;
  geofenceDisplayMode?: "editing" | "confirmed";
  onGeofenceCancelled?: () => void;
  onGeofenceComplete?: (result: GeofenceResult) => void;
  onGeofenceInvalid?: (validation: InvalidGeofenceResult) => void;
  onGeofenceStateChange?: (state: DrawingState) => void;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
  onSelectListing: (listing: SearchMapListing) => void;
};

function getMapBounds(map: ReturnType<typeof useMap>): SearchMapBounds {
  const bounds = map.getBounds();

  return {
    east: bounds.getEast(),
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    west: bounds.getWest(),
  };
}

function createUserLocationIcon() {
  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: '<div class="search-map-user-marker"><Typography as="span" variant="body" size="medium" weight="regular"></Typography></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function SearchMapController({
  center,
  centerSignal = 0,
  resizeSignal = 0,
  onBoundsChange,
  onMapClick,
}: {
  center: SearchMapCenter;
  centerSignal?: number;
  resizeSignal?: number;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
}) {
  const map = useMap();
  const emitBounds = useCallback(() => {
    onBoundsChange(getMapBounds(map));
  }, [map, onBoundsChange]);

  useMapEvents({
    click: onMapClick,
    moveend: emitBounds,
    zoomend: emitBounds,
  });

  useEffect(() => {
    map.invalidateSize();
    emitBounds();

    const timer = window.setTimeout(() => {
      map.invalidateSize();
      emitBounds();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [emitBounds, map, resizeSignal]);

  useEffect(() => {
    map.setView([center.latitude, center.longitude], center.zoom, {
      animate: true,
    });
  }, [center.latitude, center.longitude, center.zoom, centerSignal, map]);

  return null;
}

function SearchMapViewComponent({
  center,
  centerSignal = 0,
  resizeSignal = 0,
  listings,
  neighborhoodGeofences = [],
  dotMarkers = [],
  priceMarkerListingIds,
  seenListingIds,
  selectedListingId,
  tileConfig,
  userLocation,
  freehandGeofenceEnabled = false,
  geofenceResetSignal = 0,
  geofenceResult = null,
  geofenceDisplayMode = "editing",
  onGeofenceCancelled = () => undefined,
  onGeofenceComplete = () => undefined,
  onGeofenceInvalid = () => undefined,
  onGeofenceStateChange = () => undefined,
  onBoundsChange,
  onMapClick,
  onSelectListing,
}: SearchMapViewProps) {
  const visibleMarkerIdsRef = useRef<Set<string>>(new Set());
  const currentMarkerIds = useMemo(() => {
    const markerIds = new Set<string>();

    dotMarkers.forEach((marker) => {
      markerIds.add(`dot:${String(marker.id)}`);
    });

    listings.forEach((listing) => {
      markerIds.add(`listing:${String(listing.id)}`);
    });

    return markerIds;
  }, [dotMarkers, listings]);
  const newlyRenderedMarkerIds = useMemo(() => {
    const previouslyVisibleIds = visibleMarkerIdsRef.current;
    const freshIds = new Set<string>();

    currentMarkerIds.forEach((markerId) => {
      if (!previouslyVisibleIds.has(markerId)) {
        freshIds.add(markerId);
      }
    });

    return freshIds;
  }, [currentMarkerIds]);

  useEffect(() => {
    visibleMarkerIdsRef.current = currentMarkerIds;
  }, [currentMarkerIds]);

  return (
    <MapContainer
      className="relative z-0 h-full min-h-[320px] w-full bg-[#f5f5f5]"
      center={[center.latitude, center.longitude]}
      zoom={center.zoom}
      minZoom={tileConfig.minZoom}
      maxZoom={tileConfig.maxZoom}
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <TileLayer
        url={tileConfig.urlTemplate}
        attribution={tileConfig.attribution}
        tms={tileConfig.isTms}
      />

      <SearchMapController
        center={center}
        centerSignal={centerSignal}
        resizeSignal={resizeSignal}
        onBoundsChange={onBoundsChange}
        onMapClick={onMapClick}
      />

      {neighborhoodGeofences.map((points, index) => (
        <Polygon
          key={`selected-neighborhood-${index}`}
          interactive={false}
          pathOptions={{
            color: "#0048c4",
            fillColor: "#0048c4",
            fillOpacity: 0.18,
            opacity: 0.9,
            weight: 2,
          }}
          positions={points}
        />
      ))}

      <SearchMapGeofenceLayer
        enabled={freehandGeofenceEnabled}
        geofenceResult={geofenceResult}
        displayMode={geofenceDisplayMode}
        resetSignal={geofenceResetSignal}
        onCancelled={onGeofenceCancelled}
        onComplete={onGeofenceComplete}
        onInvalid={onGeofenceInvalid}
        onStateChange={onGeofenceStateChange}
      />

      <SearchMapGeofencePreviewLayer
        geofenceResult={geofenceResult}
        isVisible={geofenceDisplayMode === "editing"}
      />

      <SearchMapGeofenceConfirmedLayer
        geofenceResult={geofenceResult}
        isVisible={geofenceDisplayMode === "confirmed"}
      />

      {dotMarkers.map((marker) => {
        const markerId = `dot:${String(marker.id)}`;

        return (
          <SearchMapMarker
            key={marker.id}
            marker={marker}
            shouldAnimate={newlyRenderedMarkerIds.has(markerId)}
          />
        );
      })}

      {listings.map((listing) => {
        const isSelected =
          selectedListingId != null &&
          String(listing.id) === String(selectedListingId);

        return (
          <SearchMapMarker
            key={listing.id}
            listing={listing}
            isPriceVisible={isSelected || priceMarkerListingIds.has(listing.id)}
            isSeen={seenListingIds.has(listing.id)}
            isSelected={isSelected}
            shouldAnimate={newlyRenderedMarkerIds.has(`listing:${String(listing.id)}`)}
            onSelect={onSelectListing}
          />
        );
      })}

      {userLocation ? (
        <>
          {userLocation.accuracy ? (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              pathOptions={{
                color: "#0048c4",
                fillColor: "#0048c4",
                fillOpacity: 0.08,
                opacity: 0.18,
                weight: 1,
              }}
              radius={Math.min(userLocation.accuracy, 250)}
            />
          ) : null}
          <Marker
            icon={createUserLocationIcon()}
            position={[userLocation.latitude, userLocation.longitude]}
            zIndexOffset={20_000}
          />
        </>
      ) : null}
    </MapContainer>
  );
}

export const SearchMapView = memo(SearchMapViewComponent);
