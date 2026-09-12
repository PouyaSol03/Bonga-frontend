import "leaflet/dist/leaflet.css";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { DivIcon } from "leaflet";
import { Circle, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { BrowserLocation } from "../../../shared/lib/browserLocation";
import type { NeighborhoodGeoPoint } from "../../locations/api/neighborhood.service";
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
  selectedListing,
  onBoundsChange,
  onMapClick,
}: {
  center: SearchMapCenter;
  centerSignal?: number;
  resizeSignal?: number;
  selectedListing?: SearchMapListing | null;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
}) {
  const map = useMap();
  const emitBounds = useCallback(() => {
    onBoundsChange(getMapBounds(map));
  }, [map, onBoundsChange]);

  useMapEvents({
    click: (event) => {
      const originalEvent = event.originalEvent;
      const target = originalEvent?.target as HTMLElement | null;
      if (
        target?.closest(".leaflet-marker-icon") ||
        target?.closest(".search-map-marker-wrapper") ||
        target?.closest(".search-map-dot-hit-area") ||
        target?.closest(".search-map-price-hit-area") ||
        target?.closest(".search-map-marker") ||
        target?.closest(".search-map-dot") ||
        target?.closest("[data-map-slider-card]")
      ) {
        return;
      }
      onMapClick();
    },
    moveend: emitBounds,
    zoomend: emitBounds,
  });

  const lastPannedListingIdRef = useRef<SearchMapListingId | null>(null);

  useEffect(() => {
    if (!selectedListing) {
      lastPannedListingIdRef.current = null;
      return;
    }

    if (String(lastPannedListingIdRef.current) === String(selectedListing.id)) {
      return;
    }
    lastPannedListingIdRef.current = selectedListing.id;

    const timer = window.setTimeout(() => {
      const latLng: [number, number] = [selectedListing.latitude, selectedListing.longitude];
      const containerPoint = map.latLngToContainerPoint(latLng);
      const containerSize = map.getSize();

      const minX = 70;
      const maxX = containerSize.x - 70;
      const minY = 90;
      const maxY = containerSize.y - 250;

      let deltaX = 0;
      let deltaY = 0;

      if (containerPoint.x < minX) {
        deltaX = containerPoint.x - minX;
      } else if (containerPoint.x > maxX) {
        deltaX = containerPoint.x - maxX;
      }

      if (containerPoint.y < minY) {
        deltaY = containerPoint.y - minY;
      } else if (containerPoint.y > maxY) {
        deltaY = containerPoint.y - maxY;
      }

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        map.panBy([deltaX, deltaY], {
          animate: true,
          duration: 0.35,
          easeLinearity: 0.25,
        });
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [map, selectedListing]);

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
  const selectedListing = useMemo(() => {
    if (selectedListingId == null) return null;
    return listings.find((listing) => String(listing.id) === String(selectedListingId)) ?? null;
  }, [listings, selectedListingId]);

  return (
    <MapContainer
      className="relative z-0 h-full min-h-[320px] w-full bg-surface-container-low"
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
        selectedListing={selectedListing}
        onBoundsChange={onBoundsChange}
        onMapClick={onMapClick}
      />

      {neighborhoodGeofences.map((points, index) => (
        <Polygon
          key={`selected-neighborhood-${index}`}
          interactive={false}
          pathOptions={{
            color: "var(--primary)",
            fillColor: "var(--primary)",
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

      {dotMarkers.map((marker) => (
        <SearchMapMarker
          key={marker.id}
          marker={marker}
        />
      ))}

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
                color: "var(--primary)",
                fillColor: "var(--primary)",
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
