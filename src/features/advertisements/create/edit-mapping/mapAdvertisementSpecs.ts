import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import {
  dailyHotelFacilityItems,
  dailyStayFacilityItems,
  dailyWorkspaceFacilityItems,
  facilityItems,
  heatingItems,
  landFacilityItems,
  propertySpecs,
  rentApartmentFacilityItems,
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
  saleLandFacilityItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
} from "../data";
import type { NewAdFormValues } from "../types";
import {
  idsFromLabels,
  isFilledValue,
  readArrayValue,
  readFirstValue,
  readText,
  toBooleanValue,
} from "./featureReaders";
import { mapDailyHotelRooms, mapProjectDetails } from "./specMappers";

export function mapAdvertisementSpecs(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  next: NewAdFormValues,
) {
  const setBool = (key: keyof NewAdFormValues, value: unknown) => {
    const booleanValue = toBooleanValue(value);
    if (booleanValue !== null) {
      (next[key] as boolean) = booleanValue;
    }
  };

  const projectDetails = mapProjectDetails(
    readFirstValue(ad, features, ["project_details"], ["project_details", "projectDetails"]),
  );
  if (projectDetails.length) next.projectDetails = projectDetails;

  next.dailyHotelRooms = mapDailyHotelRooms(
    readFirstValue(ad, features, ["daily_hotel_rooms"], ["daily_hotel_rooms", "dailyHotelRooms"]),
  );

  const selectedSpecs = idsFromLabels(
    propertySpecs,
    readFirstValue(ad, features, ["extra_specs"], ["extra_specs", "selectedSpecs"]),
  );
  if (selectedSpecs.length) next.selectedSpecs = selectedSpecs;

  const heatingCooling = idsFromLabels(
    [
      ...heatingItems,
      ...saleApartmentHeatingItems,
      ...saleVillaHouseHeatingItems,
      ...saleCommercialHeatingItems,
      ...saleFactoryHeatingItems,
      ...rentHeatingItems,
    ],
    readFirstValue(ad, features, ["heating_cooling"], ["heating_cooling", "heatingCooling"]),
  );
  if (heatingCooling.length) next.heatingCooling = heatingCooling;

  const facilities = idsFromLabels(
    [
      ...facilityItems,
      ...landFacilityItems,
      ...saleApartmentFacilityItems,
      ...saleVillaHouseFacilityItems,
      ...saleLandFacilityItems,
      ...saleCommercialFacilityItems,
      ...saleFactoryFacilityItems,
      ...rentApartmentFacilityItems,
      ...rentVillaHouseFacilityItems,
      ...rentOfficeFacilityItems,
      ...rentHotelFacilityItems,
      ...dailyStayFacilityItems,
      ...dailyHotelFacilityItems,
      ...dailyWorkspaceFacilityItems,
    ],
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

  const exchangeWith = readFirstValue(
    ad,
    features,
    ["exchange_with"],
    ["exchange_with", "exchangeWith"],
  );
  const exchangeTargets = readArrayValue(exchangeWith);
  if (exchangeTargets.length) {
    next.exchangeEnabled = true;
    next.exchangeTargets = exchangeTargets;
  }

  setBool(
    "hasDocument",
    readFirstValue(ad, features, ["has_document"], ["has_document", "hasDocument"]),
  );
  setBool("renovated", readFirstValue(ad, features, ["renovated", "is_renovated"], ["renovated"]));
  setBool("furnished", readFirstValue(ad, features, ["furnished", "is_furnished"], ["furnished"]));
  setBool(
    "constructionPermit",
    readFirstValue(
      ad,
      features,
      ["construction_permit", "build_permit"],
      ["construction_permit", "constructionPermit"],
    ),
  );
  setBool(
    "commercialPermit",
    readFirstValue(ad, features, ["commercial_permit"], ["commercial_permit", "commercialPermit"]),
  );
  setBool(
    "saleTermsEnabled",
    readFirstValue(
      ad,
      features,
      ["sale_terms_enabled", "installment_sale"],
      ["saleTermsEnabled", "installment_sale"],
    ),
  );

  const rawLoanAmount =
    readFirstValue(ad, features, ["loan_amount"], ["loan_amount", "loanAmount"]) ?? ad.loan?.amount;
  const rawLoanInstallment =
    readFirstValue(ad, features, ["loan_installment"], ["loan_installment", "loanInstallment"]) ??
    ad.loan?.installment;
  const hasLoanExplicit = readFirstValue(ad, features, ["has_loan"], ["has_loan", "loanEnabled"]);
  const hasLoanFromValues = Boolean(
    next.loanAmount ||
    next.loanInstallment ||
    isFilledValue(rawLoanAmount) ||
    isFilledValue(rawLoanInstallment) ||
    isFilledValue(ad.loan?.amount) ||
    isFilledValue(ad.loan?.installment) ||
    readFirstValue(
      ad,
      features,
      ["loan_amount", "loan_installment"],
      ["loan_amount", "loan_installment"],
    ),
  );
  if (hasLoanFromValues) {
    next.loanEnabled = true;
  } else {
    setBool("loanEnabled", hasLoanExplicit);
  }

  setBool(
    "exchangeEnabled",
    readFirstValue(ad, features, ["has_exchange"], ["has_exchange", "exchangeEnabled"]),
  );
  setBool("hasVideo", readFirstValue(ad, features, ["has_video"], ["has_video"]));
  setBool(
    "hasVirtualTour",
    readFirstValue(ad, features, ["has_virtual_tour"], ["has_virtual_tour"]),
  );
  setBool(
    "images_not_belong_to_ad",
    readFirstValue(
      ad,
      features,
      ["images_not_belong_to_ad", "imagesNotBelongToAd"],
      ["images_not_belong_to_ad", "imagesNotBelongToAd"],
    ),
  );

  if (next.virtualTourLink) next.hasVirtualTour = true;
  if (readText(ad.video ?? ad.video_url ?? ad.video_path)) next.hasVideo = true;
}
