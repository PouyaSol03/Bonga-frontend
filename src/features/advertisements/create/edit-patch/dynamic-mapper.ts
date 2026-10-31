import type { NewAdFormValues } from "../types";
import type { PatchAppender } from "./types";
import { propertySpecs } from "../data";
import {
  buildDailyHotelRoomFeatures,
  buildProjectDetailFeatures,
  getFacilityItemsForListing,
  getHeatingItemsForListing,
  getParams,
  getPriceValue,
  labels,
  pickFirstNumber,
  toNumber,
  trimFormValues,
} from "../utils";

import { mapBuildingSpecs, mapPermitsAndTerms } from "./specs-mapper";

export function mapChangedDynamicFields(
  values: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
  formCode: string,
): void {
  const clean = trimFormValues(values);
  const params = getParams();

  mapAreasAndPrices(clean, changed, appender, formCode, params);
  mapBuildingSpecs(clean, changed, appender, params);
  mapPermitsAndTerms(clean, changed, appender);
  mapCollections(clean, changed, appender, formCode, params);
}

function mapAreasAndPrices(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
  formCode: string,
  params: ReturnType<typeof getParams>,
): void {
  if (changed.has("meterage") || changed.has("landArea") || changed.has("buildingArea")) {
    const meterage = toNumber(clean.meterage);
    const land = toNumber(clean.landArea);
    const building = toNumber(clean.buildingArea);
    appender.appendDynamic("area", meterage ?? building ?? land);
    appender.appendDynamic("land_area", formCode === "sale-land" ? (land ?? meterage) : land);
    appender.appendDynamic("building_area", building);
  }

  if (changed.has("price"))
    appender.appendDynamic("price", getPriceValue(clean, params.transaction, params.category));
  if (changed.has("rentPrice")) appender.appendDynamic("rent_price", toNumber(clean.rentPrice));
  if (changed.has("mortgagePrice"))
    appender.appendDynamic("mortgage_price", toNumber(clean.mortgagePrice));

  if (changed.has("rentConversionEnabled") || changed.has("rentConversionMortgagePrice")) {
    appender.appendDynamic("rent_conversion_enabled", clean.rentConversionEnabled);
    appender.appendDynamic("rent_convertible", clean.rentConversionEnabled);
    if (clean.rentConversionEnabled) {
      appender.appendDynamic(
        "rent_conversion_mortgage_price",
        toNumber(clean.rentConversionMortgagePrice),
      );
      appender.appendDynamic("rent_conversion_policy", "قابل تبدیل");
    } else {
      appender.appendDynamic("rent_conversion_policy", "غیر قابل تبدیل");
    }
  }

  if (changed.has("minPrice") || changed.has("maxPrice")) {
    if (params.transaction === "project") {
      appender.appendDynamic("min_meter_price", toNumber(clean.minPrice));
      appender.appendDynamic("max_meter_price", toNumber(clean.maxPrice));
    } else {
      appender.appendDynamic("daily_price", toNumber(clean.minPrice));
      appender.appendDynamic("meter_price", toNumber(clean.minPrice));
      appender.appendDynamic("min_price", toNumber(clean.minPrice));
      appender.appendDynamic("max_price", toNumber(clean.maxPrice));
    }
  }

  if (changed.has("normalDailyPrice"))
    appender.appendDynamic("normal_daily_price", toNumber(clean.normalDailyPrice));
  if (changed.has("weekendDailyPrice"))
    appender.appendDynamic("weekend_daily_price", toNumber(clean.weekendDailyPrice));
  if (changed.has("specialDailyPrice"))
    appender.appendDynamic("special_daily_price", toNumber(clean.specialDailyPrice));
  if (changed.has("extraPersonPrice"))
    appender.appendDynamic("extra_person_price", toNumber(clean.extraPersonPrice));
}

function resolveFeatureLabels(items: ReturnType<typeof getFacilityItemsForListing>, ids: string[]): string[] {
  const result: string[] = [];
  for (const id of ids) {
    if (!id || !id.trim()) continue;
    const trimmed = id.trim();
    const matchedById = items.find((item) => item.id === trimmed);
    if (matchedById) {
      result.push(matchedById.label);
      continue;
    }
    const matchedByLabel = items.find((item) => item.label === trimmed);
    if (matchedByLabel) {
      result.push(matchedByLabel.label);
      continue;
    }
    result.push(trimmed);
  }
  return Array.from(new Set(result));
}

function mapCollections(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
  formCode: string,
  params: ReturnType<typeof getParams>,
): void {
  if (changed.has("elevatorCount") || changed.has("facilities")) {
    const hasElevator =
      clean.facilities.includes("elevator") || clean.facilities.includes("آسانسور");
    const countElevator =
      hasElevator && clean.elevatorCount ? toNumber(clean.elevatorCount) : null;
    appender.appendFacilityCount("elevator_count", countElevator);
  }

  if (changed.has("parkingCount") || changed.has("facilities")) {
    const hasParking =
      clean.facilities.includes("parking") || clean.facilities.includes("پارکینگ");
    const countParking =
      hasParking && clean.parkingCount ? toNumber(clean.parkingCount) : null;
    appender.appendFacilityCount("parking_count", countParking);
  }

  if (changed.has("terraceCount") || changed.has("facilities")) {
    const hasTerrace =
      clean.facilities.includes("terrace") ||
      clean.facilities.includes("تراس") ||
      clean.facilities.includes("بالکن");
    const countTerrace =
      hasTerrace && clean.terraceCount ? toNumber(clean.terraceCount) : null;
    appender.appendFacilityCount("terrace_count", countTerrace);
  }

  if (changed.has("singleRoomCount"))
    appender.appendDynamic("single_room_count", toNumber(pickFirstNumber(clean.singleRoomCount)));
  if (changed.has("doubleRoomCount"))
    appender.appendDynamic("double_room_count", toNumber(pickFirstNumber(clean.doubleRoomCount)));
  if (changed.has("suiteCount"))
    appender.appendDynamic("suite_count", toNumber(pickFirstNumber(clean.suiteCount)));

  if (changed.has("usageType")) appender.appendDynamicArray("land_use", clean.usageType);
  if (changed.has("suitableFor")) appender.appendDynamicArray("suitable_for", clean.suitableFor);

  if (changed.has("heatingCooling")) {
    const heating = resolveFeatureLabels(
      getHeatingItemsForListing(params.transaction, params.category),
      clean.heatingCooling,
    );
    appender.appendDynamicArray("heating_cooling", heating);
  }

  if (changed.has("facilities")) {
    const facs = resolveFeatureLabels(
      getFacilityItemsForListing(params.transaction, params.category),
      clean.facilities,
    );
    appender.appendDynamicArray("facilities", facs);
  }

  if (changed.has("exchangeEnabled") || changed.has("exchangeTargets")) {
    const exchangeAllowed = !formCode.startsWith("rent-");
    appender.appendDynamic("has_exchange", exchangeAllowed && clean.exchangeEnabled);
    appender.appendDynamicArray(
      "exchange_with",
      exchangeAllowed && clean.exchangeEnabled ? clean.exchangeTargets : [],
    );
  }

  if (changed.has("selectedSpecs")) {
    const extraSpecs = labels(propertySpecs, clean.selectedSpecs);
    appender.appendDynamicJson("extra_specs", extraSpecs);
  }
  if (changed.has("projectDetails"))
    appender.appendDynamicJson("project_details", buildProjectDetailFeatures(clean));
  if (changed.has("dailyHotelRooms"))
    appender.appendDynamicJson("daily_hotel_rooms", buildDailyHotelRoomFeatures(clean));
}
