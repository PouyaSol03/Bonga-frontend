export type GeofenceCoordinate = [longitude: number, latitude: number];

export type DrawingState =
  | "idle"
  | "drawing"
  | "preview"
  | "invalid"
  | "confirmed";

export type GeofenceResult = {
  type: "Polygon";
  coordinates: GeofenceCoordinate[][];
  rawCoordinates: GeofenceCoordinate[];
  simplifiedCoordinates: GeofenceCoordinate[];
  areaSquareMeters: number;
  perimeterMeters: number;
};

export type GeofenceValidationCode =
  | "invalid_coordinate"
  | "not_closed"
  | "too_few_points"
  | "duplicate_points"
  | "zero_area"
  | "self_intersection"
  | "pointer_cancelled";

export type GeofenceValidationResult =
  | { isValid: true }
  | {
      isValid: false;
      code: GeofenceValidationCode;
      message: string;
    };
