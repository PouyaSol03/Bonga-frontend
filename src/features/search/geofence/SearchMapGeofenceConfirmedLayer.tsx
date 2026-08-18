import type { LatLngExpression } from "leaflet";
import { Pane, Polygon, Polyline } from "react-leaflet";
import type { GeofenceResult } from "./geofenceTypes";

type SearchMapGeofenceConfirmedLayerProps = {
  geofenceResult: GeofenceResult | null;
  isVisible: boolean;
};

const CONFIRMED_MASK_COLOR = "#0048c4";
const CONFIRMED_MASK_OPACITY = 0x29 / 0xff;

const WORLD_MASK_RING: LatLngExpression[] = [
  [-85.05112878, -180],
  [-85.05112878, 180],
  [85.05112878, 180],
  [85.05112878, -180],
  [-85.05112878, -180],
];

const MASK_OPTIONS = {
  color: "transparent",
  fillColor: CONFIRMED_MASK_COLOR,
  fillOpacity: CONFIRMED_MASK_OPACITY,
  fillRule: "evenodd" as const,
  interactive: false,
  opacity: 0,
  stroke: false,
  weight: 0,
};

const BOUNDARY_OPTIONS = {
  color: CONFIRMED_MASK_COLOR,
  interactive: false,
  lineCap: "round" as const,
  lineJoin: "round" as const,
  opacity: 1,
  weight: 3,
};

function toLeafletPositions(result: GeofenceResult): LatLngExpression[] {
  return result.simplifiedCoordinates.map(
    ([longitude, latitude]) => [latitude, longitude] as LatLngExpression,
  );
}

export function SearchMapGeofenceConfirmedLayer({
  geofenceResult,
  isVisible,
}: SearchMapGeofenceConfirmedLayerProps) {
  if (!isVisible || !geofenceResult) return null;

  const selectedRing = toLeafletPositions(geofenceResult);

  return (
    <Pane name="search-map-geofence-confirmed" style={{ zIndex: 430 }}>
      <Polygon
        interactive={false}
        pathOptions={MASK_OPTIONS}
        positions={[WORLD_MASK_RING, selectedRing]}
      />
      <Polyline
        interactive={false}
        pathOptions={BOUNDARY_OPTIONS}
        positions={selectedRing}
      />
    </Pane>
  );
}
