import { readStoredSelectedCity, selectedCityStorageKeys } from "./selectedCityStorage";

export function readStoredCoordinate(key: string) {
  const value = window.localStorage.getItem(key);

  if (!value?.trim()) return null;

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

export function getStoredSelectedCityCenter() {
  const lat = readStoredCoordinate(selectedCityStorageKeys.latitude);
  const lng = readStoredCoordinate(selectedCityStorageKeys.longitude);

  if (lat !== null && Math.abs(lat) <= 90 && lng !== null && Math.abs(lng) <= 180) {
    return { lat, lng };
  }

  const selectedCity = readStoredSelectedCity();

  if (selectedCity?.latitude !== undefined && selectedCity.longitude !== undefined) {
    return {
      lat: selectedCity.latitude,
      lng: selectedCity.longitude,
    };
  }

  return null;
}
