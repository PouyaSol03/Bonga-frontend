import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import { searchMapCenter, type SearchMapCenter } from "../searchMapData";
import { selectedCityMapZoom } from "./constants";
import { toNumber } from "./featureHelpers";

export type PositionContainer = Record<string, unknown> & {
  coordinates?: unknown;
  lat?: unknown;
  latitude?: unknown;
  lng?: unknown;
  long?: unknown;
  longitude?: unknown;
};

export type PositionLike = PositionContainer & {
  address?: PositionContainer;
  coordinate?: PositionContainer;
  geo?: PositionContainer;
  location?: PositionContainer;
  map?: PositionContainer;
  point?: PositionContainer;
};

export function isValidCoordinatePair(latitude: number, longitude: number) {
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

export function isLikelyIranLatitude(value: number) {
  return value >= 24 && value <= 41;
}

export function isLikelyIranLongitude(value: number) {
  return value >= 43 && value <= 65;
}

export function normalizeCoordinatePair(first: unknown, second: unknown) {
  const firstNumber = toNumber(first);
  const secondNumber = toNumber(second);

  if (firstNumber === undefined || secondNumber === undefined) return null;

  if (isLikelyIranLongitude(firstNumber) && isLikelyIranLatitude(secondNumber)) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  if (isLikelyIranLatitude(firstNumber) && isLikelyIranLongitude(secondNumber)) {
    return { latitude: firstNumber, longitude: secondNumber };
  }

  if (Math.abs(firstNumber) > 90 && Math.abs(secondNumber) <= 90) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  if (isValidCoordinatePair(firstNumber, secondNumber)) {
    return { latitude: firstNumber, longitude: secondNumber };
  }

  if (isValidCoordinatePair(secondNumber, firstNumber)) {
    return { latitude: secondNumber, longitude: firstNumber };
  }

  return null;
}

export function readPositionFromContainer(container?: PositionContainer | null) {
  if (!container) return null;

  const coordinateArray = Array.isArray(container.coordinates) ? container.coordinates : null;

  if (coordinateArray && coordinateArray.length >= 2) {
    const normalizedCoordinates = normalizeCoordinatePair(coordinateArray[0], coordinateArray[1]);

    if (normalizedCoordinates) return normalizedCoordinates;
  }

  const latitude = toNumber(container.lat ?? container.latitude);
  const longitude = toNumber(container.lng ?? container.long ?? container.longitude);

  if (latitude === undefined || longitude === undefined) return null;
  if (!isValidCoordinatePair(latitude, longitude)) return null;

  return { latitude, longitude };
}

export function getAdMapPosition(item: AdvertisementItem) {
  const position = item as PositionLike;
  const directPosition = readPositionFromContainer(position);

  if (directPosition) return directPosition;

  for (const nestedPosition of [
    position.point,
    position.location,
    position.geo,
    position.coordinate,
    position.map,
    position.address,
  ]) {
    const parsedPosition = readPositionFromContainer(nestedPosition);

    if (parsedPosition) return parsedPosition;
  }

  return null;
}

export function roundCoordinate(value: number) {
  return Number(value.toFixed(6));
}

export function getInitialMapCenter(): SearchMapCenter {
  const selectedCity = readStoredSelectedCity();

  if (selectedCity?.latitude !== undefined && selectedCity.longitude !== undefined) {
    return {
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      zoom: selectedCityMapZoom,
    };
  }

  return {
    ...searchMapCenter,
    zoom: selectedCityMapZoom,
  };
}
