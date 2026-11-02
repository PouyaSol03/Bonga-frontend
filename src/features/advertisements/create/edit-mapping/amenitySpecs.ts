import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import type { NewAdFormValues } from "../types";
import {
  dailyHotelFacilityItems,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyWorkspaceFacilityItems,
  facilityItems,
  heatingItems,
  landFacilityItems,
  projectFacilityItems,
  projectHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentHeatingItems,
  rentHotelFacilityItems,
  rentOfficeFacilityItems,
  rentVillaHouseFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleLandFacilityItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
} from "../data";
import { idsFromLabels } from "./featureFormatters";
import { readFirstValue } from "./featureReaders";

export const allHeatingItems = [
  ...heatingItems,
  ...projectHeatingItems,
  ...saleApartmentHeatingItems,
  ...saleVillaHouseHeatingItems,
  ...saleOfficeHeatingItems,
  ...saleCommercialHeatingItems,
  ...saleFactoryHeatingItems,
  ...saleHotelHeatingItems,
  ...rentHeatingItems,
  ...dailyRentHeatingItems,
];

export const allFacilityItems = [
  ...facilityItems,
  ...landFacilityItems,
  ...projectFacilityItems,
  ...saleApartmentFacilityItems,
  ...saleVillaHouseFacilityItems,
  ...saleLandFacilityItems,
  ...saleOfficeFacilityItems,
  ...saleCommercialFacilityItems,
  ...saleFactoryFacilityItems,
  ...saleHotelFacilityItems,
  ...rentApartmentFacilityItems,
  ...rentVillaHouseFacilityItems,
  ...rentOfficeFacilityItems,
  ...rentCommercialFacilityItems,
  ...rentFactoryFacilityItems,
  ...rentHotelFacilityItems,
  ...dailyStayFacilityItems,
  ...dailyHotelFacilityItems,
  ...dailyWorkspaceFacilityItems,
];

export function mapAmenitySpecs(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  next: NewAdFormValues,
) {
  const heatingCooling = idsFromLabels(
    allHeatingItems,
    readFirstValue(ad, features, ["heating_cooling"], ["heating_cooling", "heatingCooling"]),
  );
  if (heatingCooling.length) next.heatingCooling = heatingCooling;

  const facilities = idsFromLabels(
    allFacilityItems,
    readFirstValue(ad, features, ["facilities"], ["facilities"]),
  );
  if (facilities.length) next.facilities = Array.from(new Set(facilities));
  if (next.elevatorCount && !next.facilities.includes("elevator")) {
    next.facilities.push("elevator");
  }
  if (next.parkingCount && !next.facilities.includes("parking")) {
    next.facilities.push("parking");
  }
  if (next.terraceCount && !next.facilities.includes("terrace")) {
    next.facilities.push("terrace");
  }
}
