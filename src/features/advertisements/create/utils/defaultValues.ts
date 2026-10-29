import {
  blankValues,
  locationKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import { shouldPreserveNewAdDraft } from "../session";
import type { NewAdFormValues } from "../types";
import {
  locationFromTimeAndLocation,
  pickFirstNumber,
  priceTextToNumberString,
  readText,
} from "./formatters";
import {
  getDraft,
  getEditAdRouteState,
  getParams,
  normalizeDraftStringArray,
  type EditAdRouteState,
} from "./routeAndDraftState";

export function trimFormValues(values: NewAdFormValues): NewAdFormValues {
  const result = { ...values };
  for (const key of Object.keys(result) as Array<keyof NewAdFormValues>) {
    const val = result[key];
    if (typeof val === "string") {
      (result as Record<string, unknown>)[key] = val.trim();
    }
  }
  return result;
}

export function buildEditDefaultValues(routeState: EditAdRouteState): Partial<NewAdFormValues> {
  const card = routeState.card ?? {};
  const ad = routeState.ad ?? {};
  const title = readText(card.title, ad.title, ad.name);
  const confirmedLocation =
    typeof window !== "undefined" ? window.localStorage.getItem(locationKey)?.trim() : "";
  const location =
    confirmedLocation ||
    readText(
      ad.location?.label,
      ad.location_label,
      ad.user_address,
      ad.location,
      ad.address,
      ad.neighborhood?.name,
      ad.neighborhood_name,
      card.timeAndLocation ? locationFromTimeAndLocation(card.timeAndLocation) : "",
    );
  const publisherName = readText(card.agency, ad.agency, ad.publisherName, ad.publisher_name);
  const phoneNumber = readText(ad.owner_phone, ad.phone, ad.phoneNumber, ad.phone_number);
  const ownerPhone = readText(
    ad.owner_contact_phone,
    ad.ownerContactPhone,
    card.owner_contact_phone,
  );
  const ownerFullName = readText(
    ad.owner_contact_name,
    ad.ownerContactName,
    card.owner_contact_name,
    ad.owner_name,
    ad.ownerName,
    card.owner_name,
  );
  const ownerExactAddress = readText(
    ad.owner_contact_address,
    ad.ownerContactAddress,
    card.owner_contact_address,
    ad.owner_address,
    ad.ownerAddress,
    card.owner_address,
  );
  const price = priceTextToNumberString(readText(card.pricePrimary, ad.price, ad.total_price));
  const mortgagePrice = priceTextToNumberString(
    readText(card.pricePrimary, ad.mortgagePrice, ad.mortgage_price),
  );
  const rentPrice = priceTextToNumberString(
    readText(card.priceSecondary, ad.rentPrice, ad.rent_price),
  );
  const features = Array.isArray(ad.features) ? ad.features : [];
  const getFeature = (name: string) =>
    features.find((f) => f?.label === name || f?.key === name)?.value;
  const loanAmount = readText(
    ad.loan?.amount,
    getFeature("loan_amount"),
    ad.loan_amount,
  );
  const loanInstallment = readText(
    ad.loan?.installment,
    getFeature("loan_installment"),
    ad.loan_installment,
  );
  const hasLoan = Boolean(
    loanAmount || loanInstallment || getFeature("has_loan") || ad.has_loan,
  );

  return {
    age: readText(card.year, ad.age, ad.building_age),
    chatEnabled: true,
    description: readText(ad.description),
    location,
    meterage: pickFirstNumber(readText(card.area, ad.area, ad.meterage)),
    mortgagePrice,
    ownerExactAddress,
    ownerFullName,
    ownerPhone,
    phoneEnabled: true,
    phoneNumber,
    price,
    publisherName,
    agencyId: readText(ad.agency_id, ad.agencyId),
    consultantId: readText(ad.consultant_id, ad.consultantId, ad.assigned_consultant_id),
    registrantType: publisherName ? "agency" : "personal",
    rentPrice,
    rooms: pickFirstNumber(readText(card.rooms, ad.rooms, getFeature("rooms"))),
    floor: readText(
      card.floor,
      ad.floor,
      getFeature("floor"),
      getFeature("unit_floor"),
      getFeature("apartment_floor"),
    ),
    title,
    loanEnabled: hasLoan,
    loanAmount: loanAmount ? priceTextToNumberString(loanAmount) : "",
    loanInstallment: loanInstallment ? priceTextToNumberString(loanInstallment) : "",
  };
}

export function getDefaultValues(
  editState: EditAdRouteState = getEditAdRouteState(),
): NewAdFormValues {
  const editDefaults = editState.isEditMode ? buildEditDefaultValues(editState) : null;
  const selectedRegistrantType: NewAdFormValues["registrantType"] = editState.isEditMode
    ? ""
    : getParams().registrantType;
  const preserveDraft =
    typeof window !== "undefined" && shouldPreserveNewAdDraft(window.history.state);
  const draftValues = editDefaults || !preserveDraft ? null : getDraft();
  if (draftValues?.neighborhoodId && typeof window !== "undefined") {
    if (!window.localStorage.getItem(neighborhoodIdKey)) {
      window.localStorage.setItem(neighborhoodIdKey, draftValues.neighborhoodId);
    }
  }
  if (draftValues?.subNeighborhoodId && typeof window !== "undefined") {
    if (!window.localStorage.getItem(subNeighborhoodIdKey)) {
      window.localStorage.setItem(subNeighborhoodIdKey, draftValues.subNeighborhoodId);
    }
  }
  const baseValues = editDefaults
    ? {
        ...blankValues,
        ...editDefaults,
      }
    : {
        ...blankValues,
        ...draftValues,
        neighborhoodId:
          draftValues?.neighborhoodId ||
          (typeof window !== "undefined"
            ? (window.localStorage.getItem(neighborhoodIdKey) ?? "")
            : ""),
        subNeighborhoodId:
          draftValues?.subNeighborhoodId ||
          (typeof window !== "undefined"
            ? (window.localStorage.getItem(subNeighborhoodIdKey) ?? "")
            : ""),
        suitableFor: normalizeDraftStringArray(draftValues?.suitableFor),
        location: preserveDraft ? (window.localStorage.getItem(locationKey) ?? "") : "",
      };

  const queryParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const queryAgencyId = queryParams?.get("agencyId") || queryParams?.get("agency_id") || "";
  const queryAgencyName = queryParams?.get("agencyName") || queryParams?.get("publisherName") || "";

  return {
    ...baseValues,
    registrantType: editDefaults
      ? baseValues.registrantType
      : queryAgencyId
        ? "agency"
        : selectedRegistrantType || baseValues.registrantType,
    agencyId: editDefaults ? baseValues.agencyId : queryAgencyId || baseValues.agencyId,
    publisherName: editDefaults
      ? baseValues.publisherName
      : queryAgencyName || baseValues.publisherName,
    hasVideo: false,
    photos: [],
    video: null,
  };
}
