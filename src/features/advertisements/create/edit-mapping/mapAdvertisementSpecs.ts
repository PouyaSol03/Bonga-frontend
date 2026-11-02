import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import { propertySpecs } from "../data";
import type { NewAdFormValues } from "../types";
import {
  idsFromLabels,
  readArrayValue,
  readFirstValue,
  readText,
  toBooleanValue,
} from "./featureReaders";
import { numericInputText } from "./featureFormatters";
import { mapDailyHotelRooms, mapProjectDetails } from "./specMappers";
import { mapAmenitySpecs } from "./amenitySpecs";
import { mapOfficeSpecs } from "./officeSpecs";

function hasNumericLoan(value: unknown): boolean {
  const text = numericInputText(value);
  if (!text) return false;
  const num = Number(text);
  return Number.isFinite(num) && num > 0;
}

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

  mapAmenitySpecs(ad, features, next);
  mapOfficeSpecs(ad, features, next);

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
  const explicitBool = toBooleanValue(hasLoanExplicit);

  const hasLoanAmount =
    hasNumericLoan(next.loanAmount) ||
    hasNumericLoan(rawLoanAmount) ||
    hasNumericLoan(ad.loan?.amount);
  const hasLoanInstallment =
    hasNumericLoan(next.loanInstallment) ||
    hasNumericLoan(rawLoanInstallment) ||
    hasNumericLoan(ad.loan?.installment);

  if (explicitBool !== null) {
    next.loanEnabled = explicitBool;
  } else {
    next.loanEnabled = hasLoanAmount || hasLoanInstallment;
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
