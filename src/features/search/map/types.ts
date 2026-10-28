import type { GeofenceResult, GeofenceValidationResult } from "../geofence/geofenceTypes";

export type SearchMapMode = "map" | "preview" | "list";

export type SearchFilterChipId =
  | "filters"
  | "category"
  | "neighborhood"
  | "area"
  | "price"
  | "rooms"
  | "floor"
  | "building_age";

export type InvalidGeofenceResult = Exclude<GeofenceValidationResult, { isValid: true }>;

export type GeofenceHistoryEntry = {
  result: GeofenceResult;
  state: "preview" | "confirmed";
};

export type PendingSearchRequest = {
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  title: string;
};
