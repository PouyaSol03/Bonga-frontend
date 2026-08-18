import type {
  GeofenceCoordinate,
  GeofenceResult,
  GeofenceValidationResult,
} from "./geofenceTypes";

export const MIN_CAPTURE_DISTANCE_PX = 5;
export const CLOSE_SNAP_DISTANCE_METERS = 3;
export const SIMPLIFY_TOLERANCE_METERS = 3;
export const EFFECTIVE_DUPLICATE_DISTANCE_METERS = 0.05;
export const MIN_GEOFENCE_AREA_SQUARE_METERS = 1;

const EARTH_RADIUS_METERS = 6_371_008.8;
const DEGREES_TO_RADIANS = Math.PI / 180;
const INTERSECTION_EPSILON = 1e-7;

type ProjectedCoordinate = {
  x: number;
  y: number;
};

type FinalizeGeofenceOptions = {
  closeSnapDistanceMeters?: number;
  duplicateDistanceMeters?: number;
  minimumAreaSquareMeters?: number;
  simplifyToleranceMeters?: number;
};

type FinalizeGeofenceResult =
  | { result: GeofenceResult; validation: { isValid: true } }
  | { result: null; validation: Exclude<GeofenceValidationResult, { isValid: true }> };

function copyCoordinate(coordinate: GeofenceCoordinate): GeofenceCoordinate {
  return [coordinate[0], coordinate[1]];
}

function coordinatesExactlyEqual(
  first: GeofenceCoordinate,
  second: GeofenceCoordinate,
) {
  return first[0] === second[0] && first[1] === second[1];
}

export function isValidGeofenceCoordinate(coordinate: GeofenceCoordinate) {
  const [longitude, latitude] = coordinate;

  return (
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

function shortestLongitudeDeltaDegrees(from: number, to: number) {
  let delta = to - from;

  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;

  return delta;
}

export function geographicDistanceMeters(
  first: GeofenceCoordinate,
  second: GeofenceCoordinate,
) {
  const latitudeOne = first[1] * DEGREES_TO_RADIANS;
  const latitudeTwo = second[1] * DEGREES_TO_RADIANS;
  const latitudeDelta = (second[1] - first[1]) * DEGREES_TO_RADIANS;
  const longitudeDelta =
    shortestLongitudeDeltaDegrees(first[0], second[0]) * DEGREES_TO_RADIANS;
  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);
  const haversine =
    sinLatitude * sinLatitude +
    Math.cos(latitudeOne) *
      Math.cos(latitudeTwo) *
      sinLongitude *
      sinLongitude;

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(Math.max(0, 1 - haversine)))
  );
}

export function removeEffectivelyDuplicateCoordinates(
  coordinates: GeofenceCoordinate[],
  thresholdMeters = EFFECTIVE_DUPLICATE_DISTANCE_METERS,
) {
  const cleaned: GeofenceCoordinate[] = [];

  coordinates.forEach((coordinate) => {
    if (!isValidGeofenceCoordinate(coordinate)) {
      cleaned.push(copyCoordinate(coordinate));
      return;
    }

    const previous = cleaned.at(-1);
    if (
      previous &&
      isValidGeofenceCoordinate(previous) &&
      geographicDistanceMeters(previous, coordinate) <= thresholdMeters
    ) {
      return;
    }

    cleaned.push(copyCoordinate(coordinate));
  });

  return cleaned;
}

export function closePolygonRing(
  coordinates: GeofenceCoordinate[],
  snapDistanceMeters = CLOSE_SNAP_DISTANCE_METERS,
) {
  const cleaned = removeEffectivelyDuplicateCoordinates(coordinates);
  if (cleaned.length === 0) return [];

  const first = cleaned[0];
  const last = cleaned.at(-1);
  if (!last) return [copyCoordinate(first)];

  if (coordinatesExactlyEqual(first, last)) {
    cleaned[cleaned.length - 1] = copyCoordinate(first);
    return cleaned;
  }

  if (
    isValidGeofenceCoordinate(first) &&
    isValidGeofenceCoordinate(last) &&
    geographicDistanceMeters(first, last) <= snapDistanceMeters
  ) {
    cleaned[cleaned.length - 1] = copyCoordinate(first);
    return removeEffectivelyDuplicateCoordinates(cleaned, 0);
  }

  cleaned.push(copyCoordinate(first));
  return cleaned;
}

function unwrapLongitudes(coordinates: GeofenceCoordinate[]) {
  if (coordinates.length === 0) return [];

  const unwrapped: GeofenceCoordinate[] = [copyCoordinate(coordinates[0])];

  for (let index = 1; index < coordinates.length; index += 1) {
    const previousLongitude = unwrapped[index - 1][0];
    const coordinate = coordinates[index];
    const longitude =
      previousLongitude +
      shortestLongitudeDeltaDegrees(previousLongitude, coordinate[0]);

    unwrapped.push([longitude, coordinate[1]]);
  }

  return unwrapped;
}

function projectCoordinatesToMeters(
  coordinates: GeofenceCoordinate[],
): ProjectedCoordinate[] {
  if (coordinates.length === 0) return [];

  const unwrapped = unwrapLongitudes(coordinates);
  const referenceLatitude =
    unwrapped.reduce((sum, coordinate) => sum + coordinate[1], 0) /
    unwrapped.length;
  const referenceLongitude = unwrapped[0][0];
  const cosineLatitude = Math.max(
    1e-8,
    Math.cos(referenceLatitude * DEGREES_TO_RADIANS),
  );

  return unwrapped.map(([longitude, latitude]) => ({
    x:
      EARTH_RADIUS_METERS *
      (longitude - referenceLongitude) *
      DEGREES_TO_RADIANS *
      cosineLatitude,
    y:
      EARTH_RADIUS_METERS *
      (latitude - referenceLatitude) *
      DEGREES_TO_RADIANS,
  }));
}

function squaredDistanceToSegment(
  point: ProjectedCoordinate,
  start: ProjectedCoordinate,
  end: ProjectedCoordinate,
) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (deltaX === 0 && deltaY === 0) {
    const x = point.x - start.x;
    const y = point.y - start.y;
    return x * x + y * y;
  }

  const projection = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) /
        (deltaX * deltaX + deltaY * deltaY),
    ),
  );
  const nearestX = start.x + projection * deltaX;
  const nearestY = start.y + projection * deltaY;
  const x = point.x - nearestX;
  const y = point.y - nearestY;

  return x * x + y * y;
}

function ramerDouglasPeuckerIndices(
  points: ProjectedCoordinate[],
  toleranceMeters: number,
) {
  if (points.length <= 2) {
    return points.map((_, index) => index);
  }

  const toleranceSquared = toleranceMeters * toleranceMeters;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack: Array<[startIndex: number, endIndex: number]> = [
    [0, points.length - 1],
  ];

  while (stack.length > 0) {
    const segment = stack.pop();
    if (!segment) break;

    const [startIndex, endIndex] = segment;
    let maximumDistanceSquared = 0;
    let maximumIndex = -1;

    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distanceSquared = squaredDistanceToSegment(
        points[index],
        points[startIndex],
        points[endIndex],
      );

      if (distanceSquared > maximumDistanceSquared) {
        maximumDistanceSquared = distanceSquared;
        maximumIndex = index;
      }
    }

    if (
      maximumIndex !== -1 &&
      maximumDistanceSquared > toleranceSquared
    ) {
      keep[maximumIndex] = 1;
      stack.push([startIndex, maximumIndex], [maximumIndex, endIndex]);
    }
  }

  return Array.from(keep.entries())
    .filter(([, shouldKeep]) => shouldKeep === 1)
    .map(([index]) => index);
}

export function simplifyGeofenceCoordinates(
  coordinates: GeofenceCoordinate[],
  toleranceMeters = SIMPLIFY_TOLERANCE_METERS,
) {
  const closedRing = closePolygonRing(coordinates, 0);
  if (closedRing.length <= 4 || toleranceMeters <= 0) {
    return closedRing.map(copyCoordinate);
  }

  const openRing = removeEffectivelyDuplicateCoordinates(
    closedRing.slice(0, -1),
  );
  if (openRing.length < 3) return closedRing.map(copyCoordinate);

  const projected = projectCoordinatesToMeters(openRing);
  let currentTolerance = toleranceMeters;
  let simplified = openRing;

  while (currentTolerance >= 0.01) {
    const indices = ramerDouglasPeuckerIndices(projected, currentTolerance);
    const candidate = indices.map((index) => openRing[index]);

    if (candidate.length >= 3) {
      simplified = candidate;
      break;
    }

    currentTolerance /= 2;
  }

  if (simplified.length < 3) simplified = openRing;

  return [...simplified.map(copyCoordinate), copyCoordinate(simplified[0])];
}

export function calculatePolygonAreaSquareMeters(
  coordinates: GeofenceCoordinate[],
) {
  const closedRing = closePolygonRing(coordinates, 0);
  if (closedRing.length < 4) return 0;

  const projected = projectCoordinatesToMeters(closedRing);
  let twiceArea = 0;

  for (let index = 0; index < projected.length - 1; index += 1) {
    const current = projected[index];
    const next = projected[index + 1];
    twiceArea += current.x * next.y - next.x * current.y;
  }

  return Math.abs(twiceArea) / 2;
}

export function calculatePolygonPerimeterMeters(
  coordinates: GeofenceCoordinate[],
) {
  const closedRing = closePolygonRing(coordinates, 0);
  let perimeter = 0;

  for (let index = 0; index < closedRing.length - 1; index += 1) {
    perimeter += geographicDistanceMeters(
      closedRing[index],
      closedRing[index + 1],
    );
  }

  return perimeter;
}

function orientation(
  first: ProjectedCoordinate,
  second: ProjectedCoordinate,
  third: ProjectedCoordinate,
) {
  return (
    (second.x - first.x) * (third.y - first.y) -
    (second.y - first.y) * (third.x - first.x)
  );
}

function isPointOnSegment(
  point: ProjectedCoordinate,
  start: ProjectedCoordinate,
  end: ProjectedCoordinate,
) {
  return (
    Math.abs(orientation(start, end, point)) <= INTERSECTION_EPSILON &&
    point.x >= Math.min(start.x, end.x) - INTERSECTION_EPSILON &&
    point.x <= Math.max(start.x, end.x) + INTERSECTION_EPSILON &&
    point.y >= Math.min(start.y, end.y) - INTERSECTION_EPSILON &&
    point.y <= Math.max(start.y, end.y) + INTERSECTION_EPSILON
  );
}

function segmentsIntersect(
  firstStart: ProjectedCoordinate,
  firstEnd: ProjectedCoordinate,
  secondStart: ProjectedCoordinate,
  secondEnd: ProjectedCoordinate,
) {
  const firstOrientation = orientation(firstStart, firstEnd, secondStart);
  const secondOrientation = orientation(firstStart, firstEnd, secondEnd);
  const thirdOrientation = orientation(secondStart, secondEnd, firstStart);
  const fourthOrientation = orientation(secondStart, secondEnd, firstEnd);

  if (
    ((firstOrientation > 0 && secondOrientation < 0) ||
      (firstOrientation < 0 && secondOrientation > 0)) &&
    ((thirdOrientation > 0 && fourthOrientation < 0) ||
      (thirdOrientation < 0 && fourthOrientation > 0))
  ) {
    return true;
  }

  return (
    isPointOnSegment(secondStart, firstStart, firstEnd) ||
    isPointOnSegment(secondEnd, firstStart, firstEnd) ||
    isPointOnSegment(firstStart, secondStart, secondEnd) ||
    isPointOnSegment(firstEnd, secondStart, secondEnd)
  );
}

export function polygonHasSelfIntersections(
  coordinates: GeofenceCoordinate[],
) {
  const closedRing = closePolygonRing(coordinates, 0);
  if (closedRing.length < 5) return false;

  const projected = projectCoordinatesToMeters(closedRing);
  const segmentCount = projected.length - 1;

  for (let firstIndex = 0; firstIndex < segmentCount; firstIndex += 1) {
    const firstStart = projected[firstIndex];
    const firstEnd = projected[firstIndex + 1];

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < segmentCount;
      secondIndex += 1
    ) {
      const areAdjacent = secondIndex === firstIndex + 1;
      const areClosingNeighbors =
        firstIndex === 0 && secondIndex === segmentCount - 1;

      if (areAdjacent || areClosingNeighbors) continue;

      if (
        segmentsIntersect(
          firstStart,
          firstEnd,
          projected[secondIndex],
          projected[secondIndex + 1],
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function countUniqueVertices(
  coordinates: GeofenceCoordinate[],
  thresholdMeters: number,
) {
  const unique: GeofenceCoordinate[] = [];

  coordinates.forEach((coordinate) => {
    if (
      !unique.some(
        (existing) =>
          geographicDistanceMeters(existing, coordinate) <= thresholdMeters,
      )
    ) {
      unique.push(coordinate);
    }
  });

  return unique.length;
}

export function validateGeofencePolygon(
  coordinates: GeofenceCoordinate[],
  options: {
    duplicateDistanceMeters?: number;
    minimumAreaSquareMeters?: number;
  } = {},
): GeofenceValidationResult {
  const duplicateDistanceMeters =
    options.duplicateDistanceMeters ?? EFFECTIVE_DUPLICATE_DISTANCE_METERS;
  const minimumAreaSquareMeters =
    options.minimumAreaSquareMeters ?? MIN_GEOFENCE_AREA_SQUARE_METERS;

  if (coordinates.some((coordinate) => !isValidGeofenceCoordinate(coordinate))) {
    return {
      isValid: false,
      code: "invalid_coordinate",
      message: "مختصات ترسیم‌شده معتبر نیست. دوباره محدوده را رسم کنید.",
    };
  }

  const hasClosedRing =
    coordinates.length >= 2 &&
    coordinatesExactlyEqual(coordinates[0], coordinates.at(-1) ?? coordinates[0]);
  const openRing = hasClosedRing ? coordinates.slice(0, -1) : coordinates;

  if (countUniqueVertices(openRing, duplicateDistanceMeters) < 3) {
    return {
      isValid: false,
      code: "too_few_points",
      message: "برای ساخت محدوده، یک شکل با حداقل سه گوشه رسم کنید.",
    };
  }

  if (!hasClosedRing) {
    return {
      isValid: false,
      code: "not_closed",
      message: "مرز محدوده به‌درستی بسته نشده است.",
    };
  }

  for (let index = 1; index < coordinates.length - 1; index += 1) {
    if (
      geographicDistanceMeters(coordinates[index - 1], coordinates[index]) <=
      duplicateDistanceMeters
    ) {
      return {
        isValid: false,
        code: "duplicate_points",
        message: "بعضی نقاط ترسیم بیش از حد به هم نزدیک‌اند. دوباره رسم کنید.",
      };
    }
  }

  if (polygonHasSelfIntersections(coordinates)) {
    return {
      isValid: false,
      code: "self_intersection",
      message: "خط محدوده از روی خودش عبور کرده است. محدوده را بدون تقاطع رسم کنید.",
    };
  }

  if (
    calculatePolygonAreaSquareMeters(coordinates) < minimumAreaSquareMeters
  ) {
    return {
      isValid: false,
      code: "zero_area",
      message: "محدوده رسم‌شده بیش از حد کوچک است. یک محدوده بزرگ‌تر رسم کنید.",
    };
  }

  return { isValid: true };
}

export function calculateGeofenceMeasurements(
  coordinates: GeofenceCoordinate[],
) {
  return {
    areaSquareMeters: calculatePolygonAreaSquareMeters(coordinates),
    perimeterMeters: calculatePolygonPerimeterMeters(coordinates),
  };
}

export function finalizeGeofenceDrawing(
  coordinates: GeofenceCoordinate[],
  options: FinalizeGeofenceOptions = {},
): FinalizeGeofenceResult {
  const duplicateDistanceMeters =
    options.duplicateDistanceMeters ?? EFFECTIVE_DUPLICATE_DISTANCE_METERS;
  const rawCoordinates = closePolygonRing(
    removeEffectivelyDuplicateCoordinates(
      coordinates,
      duplicateDistanceMeters,
    ),
    options.closeSnapDistanceMeters ?? CLOSE_SNAP_DISTANCE_METERS,
  );
  const rawValidation = validateGeofencePolygon(rawCoordinates, {
    duplicateDistanceMeters,
    minimumAreaSquareMeters: options.minimumAreaSquareMeters,
  });

  if (!rawValidation.isValid) {
    return { result: null, validation: rawValidation };
  }

  let simplifiedCoordinates = simplifyGeofenceCoordinates(
    rawCoordinates,
    options.simplifyToleranceMeters ?? SIMPLIFY_TOLERANCE_METERS,
  );
  const simplifiedValidation = validateGeofencePolygon(simplifiedCoordinates, {
    duplicateDistanceMeters,
    minimumAreaSquareMeters: options.minimumAreaSquareMeters,
  });

  if (!simplifiedValidation.isValid) {
    simplifiedCoordinates = rawCoordinates.map(copyCoordinate);
  }

  const finalValidation = validateGeofencePolygon(simplifiedCoordinates, {
    duplicateDistanceMeters,
    minimumAreaSquareMeters: options.minimumAreaSquareMeters,
  });

  if (!finalValidation.isValid) {
    return { result: null, validation: finalValidation };
  }

  const measurements = calculateGeofenceMeasurements(simplifiedCoordinates);

  return {
    validation: { isValid: true },
    result: {
      type: "Polygon",
      coordinates: [simplifiedCoordinates.map(copyCoordinate)],
      rawCoordinates: rawCoordinates.map(copyCoordinate),
      simplifiedCoordinates: simplifiedCoordinates.map(copyCoordinate),
      areaSquareMeters: measurements.areaSquareMeters,
      perimeterMeters: measurements.perimeterMeters,
    },
  };
}
