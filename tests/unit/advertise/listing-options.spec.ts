import { expect, test } from "vitest";
import * as options from "../../../src/features/advertisements/create/constants/facilityHeatingItems";
import {
  getFacilityItemsForListing,
  getHeatingItemsForListing,
} from "../../../src/features/advertisements/create/utils";

const sale = [
  ["apartment", options.saleApartmentHeatingItems, options.saleApartmentFacilityItems],
  ["villa-house", options.saleVillaHouseHeatingItems, options.saleVillaHouseFacilityItems],
  ["land", options.heatingItems, options.saleLandFacilityItems],
  ["office", options.saleOfficeHeatingItems, options.saleOfficeFacilityItems],
  ["commercial-unit", options.saleCommercialHeatingItems, options.saleCommercialFacilityItems],
  ["factory-workshop", options.saleFactoryHeatingItems, options.saleFactoryFacilityItems],
  ["hotel-apartment", options.saleHotelHeatingItems, options.saleHotelFacilityItems],
] as const;
const rent = [
  ["apartment", options.rentHeatingItems, options.rentApartmentFacilityItems],
  ["villa-house", options.rentHeatingItems, options.rentVillaHouseFacilityItems],
  ["office", options.rentHeatingItems, options.rentOfficeFacilityItems],
  ["commercial-unit", options.rentHeatingItems, options.rentCommercialFacilityItems],
  ["factory-workshop", options.rentHeatingItems, options.rentFactoryFacilityItems],
  ["hotel-apartment", options.rentHeatingItems, options.rentHotelFacilityItems],
  ["daily-apartment-suite", options.dailyRentHeatingItems, options.dailyStayFacilityItems],
  ["daily-garden-villa", options.dailyRentHeatingItems, options.dailyStayFacilityItems],
  ["daily-hotel-apartment", options.dailyRentHeatingItems, options.dailyHotelFacilityItems],
  ["daily-workspace", options.dailyRentHeatingItems, options.dailyWorkspaceFacilityItems],
] as const;
const cases = [
  ...sale.map(
    ([category, heating, facilities]) => ["sale", category, heating, facilities] as const,
  ),
  ...rent.map(
    ([category, heating, facilities]) => ["rent", category, heating, facilities] as const,
  ),
  ["project", "project-presale", options.projectHeatingItems, options.projectFacilityItems],
  ["project", "project-partnership", options.heatingItems, options.facilityItems],
  ["sale", "unknown", options.heatingItems, options.facilityItems],
  ["rent", "land", options.heatingItems, options.landFacilityItems],
  ["unknown", "factory-workshop", options.heatingItems, options.landFacilityItems],
  ["rent", "daily-unknown", options.dailyRentHeatingItems, options.facilityItems],
] as const;

test.each(cases)(
  "preserves heating and facilities for %s / %s",
  (transaction, category, heating, facilities) => {
    expect(getHeatingItemsForListing(transaction, category)).toBe(heating);
    expect(getFacilityItemsForListing(transaction, category)).toBe(facilities);
  },
);
