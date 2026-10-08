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

  if (changed.has("price")) appender.appendDynamic("price", getPriceValue(clean, params.transaction, params.category));
  if (changed.has("rentPrice")) appender.appendDynamic("rent_price", toNumber(clean.rentPrice));
  if (changed.has("mortgagePrice")) appender.appendDynamic("mortgage_price", toNumber(clean.mortgagePrice));

  if (changed.has("rentConversionEnabled") || changed.has("rentConversionMortgagePrice")) {
    appender.appendDynamic("rent_conversion_enabled", clean.rentConversionEnabled);
    appender.appendDynamic("rent_convertible", clean.rentConversionEnabled);
    if (clean.rentConversionEnabled) {
      appender.appendDynamic("rent_conversion_mortgage_price", toNumber(clean.rentConversionMortgagePrice));
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

  if (changed.has("normalDailyPrice")) appender.appendDynamic("normal_daily_price", toNumber(clean.normalDailyPrice));
  if (changed.has("weekendDailyPrice")) appender.appendDynamic("weekend_daily_price", toNumber(clean.weekendDailyPrice));
  if (changed.has("specialDailyPrice")) appender.appendDynamic("special_daily_price", toNumber(clean.specialDailyPrice));
  if (changed.has("extraPersonPrice")) appender.appendDynamic("extra_person_price", toNumber(clean.extraPersonPrice));
}



function mapCollections(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
  formCode: string,
  params: ReturnType<typeof getParams>,
): void {
  if (changed.has("elevatorCount")) appender.appendFacilityCount("elevator_count", clean.facilities.includes("elevator") ? toNumber(clean.elevatorCount) : null);
  if (changed.has("parkingCount")) appender.appendFacilityCount("parking_count", clean.facilities.includes("parking") ? toNumber(clean.parkingCount) : null);
  if (changed.has("terraceCount")) appender.appendFacilityCount("terrace_count", clean.facilities.includes("terrace") ? toNumber(clean.terraceCount) : null);

  if (changed.has("singleRoomCount")) appender.appendDynamic("single_room_count", toNumber(pickFirstNumber(clean.singleRoomCount)));
  if (changed.has("doubleRoomCount")) appender.appendDynamic("double_room_count", toNumber(pickFirstNumber(clean.doubleRoomCount)));
  if (changed.has("suiteCount")) appender.appendDynamic("suite_count", toNumber(pickFirstNumber(clean.suiteCount)));

  if (changed.has("usageType")) appender.appendDynamicArray("land_use", clean.usageType);
  if (changed.has("suitableFor")) appender.appendDynamicArray("suitable_for", clean.suitableFor);
  if (changed.has("heatingCooling")) {
    const heating = labels(getHeatingItemsForListing(params.transaction, params.category), clean.heatingCooling);
    appender.appendDynamicArray("heating_cooling", heating);
  }
  if (changed.has("facilities")) {
    const facs = labels(getFacilityItemsForListing(params.transaction, params.category), clean.facilities);
    appender.appendDynamicArray("facilities", facs);
  }

  if (changed.has("exchangeEnabled") || changed.has("exchangeTargets")) {
    const exchangeAllowed = !formCode.startsWith("rent-");
    appender.appendDynamic("has_exchange", exchangeAllowed && clean.exchangeEnabled);
    appender.appendDynamicArray("exchange_with", exchangeAllowed && clean.exchangeEnabled ? clean.exchangeTargets : []);
  }

  if (changed.has("selectedSpecs")) {
    const extraSpecs = labels(propertySpecs, clean.selectedSpecs);
    appender.appendDynamicJson("extra_specs", extraSpecs);
  }
  if (changed.has("projectDetails")) appender.appendDynamicJson("project_details", buildProjectDetailFeatures(clean));
  if (changed.has("dailyHotelRooms")) appender.appendDynamicJson("daily_hotel_rooms", buildDailyHotelRoomFeatures(clean));
}
