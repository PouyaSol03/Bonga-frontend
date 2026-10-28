import { beforeEach, expect, test } from "vitest";
import {
  defaultSelectedCity,
  selectedCityStorageKeys,
} from "../../src/shared/lib/selectedCityStorage";

import {
  getStoredSelectedCityCenter,
  readStoredCoordinate,
} from "../../src/shared/lib/selectedCityCenter";

const defaultCenter = { lat: defaultSelectedCity.latitude, lng: defaultSelectedCity.longitude };

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test.each([
  [null, null],
  ["", null],
  ["  ", null],
  ["garbage", null],
  ["NaN", null],
  ["Infinity", null],
  ["-Infinity", null],
  ["۱۲", null],
  ["0", 0],
  [" -0 ", -0],
  ["35.7", 35.7],
  ["1e2", 100],
  ["0x10", 16],
  ["91", 91],
])("coordinate %s preserves %s", (stored, expected) => {
  if (stored !== null) window.localStorage.setItem("coordinate", stored);
  expect(readStoredCoordinate("coordinate")).toBe(expected);
});

test("missing city falls back to default", () => {
  expect(getStoredSelectedCityCenter()).toEqual(defaultCenter);
});

test("explicit coordinates win even without a stored city name", () => {
  window.localStorage.setItem(selectedCityStorageKeys.latitude, " 35.7 ");
  window.localStorage.setItem(selectedCityStorageKeys.longitude, "51.4");
  expect(getStoredSelectedCityCenter()).toEqual({ lat: 35.7, lng: 51.4 });
});

test.each([
  ["90", "180"],
  ["-90", "-180"],
  ["0", "0"],
])("accepts inclusive coordinate bounds %s %s", (lat, lng) => {
  window.localStorage.setItem(selectedCityStorageKeys.latitude, lat);
  window.localStorage.setItem(selectedCityStorageKeys.longitude, lng);
  expect(getStoredSelectedCityCenter()).toEqual({ lat: Number(lat), lng: Number(lng) });
});

test.each([
  ["90.01", "51"],
  ["35", "180.01"],
  ["bad", "51"],
  ["", "51"],
  ["35", ""],
])("invalid pair %s %s uses default-city per-axis fallback", (lat, lng) => {
  window.localStorage.setItem(selectedCityStorageKeys.name, defaultSelectedCity.name);
  window.localStorage.setItem(selectedCityStorageKeys.latitude, lat);
  window.localStorage.setItem(selectedCityStorageKeys.longitude, lng);
  const expected = {
    lat: lat === "35" ? 35 : defaultCenter.lat,
    lng: lng === "51" ? 51 : defaultCenter.lng,
  };
  expect(getStoredSelectedCityCenter()).toEqual(expected);
});

test("unknown city cannot supply a missing coordinate", () => {
  window.localStorage.setItem(selectedCityStorageKeys.name, "تهران");
  window.localStorage.setItem(selectedCityStorageKeys.latitude, "35");
  expect(getStoredSelectedCityCenter()).toBeNull();
});

test("session city name participates in fallback", () => {
  window.sessionStorage.setItem(selectedCityStorageKeys.name, "تهران");
  expect(getStoredSelectedCityCenter()).toBeNull();
  window.sessionStorage.setItem(selectedCityStorageKeys.name, defaultSelectedCity.name);
  expect(getStoredSelectedCityCenter()).toEqual(defaultCenter);
});
