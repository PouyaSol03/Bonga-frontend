import { Pane, Polygon } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { GeofenceResult } from "./geofenceTypes";

type SearchMapGeofencePreviewLayerProps = {
  geofenceResult: GeofenceResult | null;
  isVisible: boolean;
};

const PREVIEW_POLYGON_OPTIONS = {
  color: "#0048c4",
  fillColor: "#0048c4",
  fillOpacity: 0.24,
  interactive: false,
  lineCap: "round" as const,
  lineJoin: "round" as const,
  opacity: 1,
  weight: 4,
};

function toLeafletPositions(result: GeofenceResult): LatLngExpression[] {
  return result.simplifiedCoordinates.map(
    ([longitude, latitude]) => [latitude, longitude] as LatLngExpression,
  );
}

export function SearchMapGeofencePreviewLayer({
  geofenceResult,
  isVisible,
}: SearchMapGeofencePreviewLayerProps) {
  if (!isVisible || !geofenceResult) return null;

  return (
    <Pane name="search-map-geofence-preview" style={{ zIndex: 460 }}>
      <Polygon
        interactive={false}
        pathOptions={PREVIEW_POLYGON_OPTIONS}
        positions={toLeafletPositions(geofenceResult)}
      />
    </Pane>
  );
}
