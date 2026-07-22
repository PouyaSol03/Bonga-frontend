import { useFreehandGeofence } from "./useFreehandGeofence";
import type {
  DrawingState,
  GeofenceResult,
  GeofenceValidationResult,
} from "./geofenceTypes";

type InvalidGeofenceResult = Exclude<
  GeofenceValidationResult,
  { isValid: true }
>;

type SearchMapGeofenceLayerProps = {
  enabled: boolean;
  geofenceResult: GeofenceResult | null;
  displayMode?: "editing" | "confirmed";
  resetSignal: number;
  onCancelled: () => void;
  onComplete: (result: GeofenceResult) => void;
  onInvalid: (validation: InvalidGeofenceResult) => void;
  onStateChange: (state: DrawingState) => void;
};

export function SearchMapGeofenceLayer(props: SearchMapGeofenceLayerProps) {
  useFreehandGeofence(props);
  return null;
}
