import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  propertySpecs,
  subNeighborhoodIdKey,
} from "../data";
import { getFacilityItemsForListing, getHeatingItemsForListing } from "../constants/listingOptions";
import type { NewAdFormValues } from "../types";
import { labels } from "./formatters";
import {
  getAdvertiseFormCode,
  getStoredNewAdLocationNumber,
  shouldOmitOwnerContactsOnAssignment,
  shouldSendConsultantAssignment,
} from "./featureBuilders";
import { getParams } from "./routeAndDraftState";
import { trimFormValues } from "./defaultValues";
import { createFormDataAppenders } from "./formDataAppenders";
import { appendFormDataMedia } from "./formDataMedia";
import { appendFormDataSpecs } from "./formDataSpecs";

export function buildNewAdFormData(
  values: NewAdFormValues,
  options: {
    categoryId?: string | null;
    dynamicFieldKeys?: Iterable<string>;
    formCode?: string | null;
    isEdit?: boolean;
    isDraft?: boolean;
  } = {},
): FormData {
  const cleanValues = trimFormValues(values);
  const params = getParams();
  const formCode =
    options.formCode?.trim() || getAdvertiseFormCode(params.transaction, params.category);

  const heatingCooling = labels(
    getHeatingItemsForListing(params.transaction, params.category),
    cleanValues.heatingCooling,
  );
  const facilities = labels(
    getFacilityItemsForListing(params.transaction, params.category),
    cleanValues.facilities,
  );
  const extraSpecs = labels(propertySpecs, cleanValues.selectedSpecs);
  const contactTypes = [
    cleanValues.chatEnabled ? "chat" : null,
    cleanValues.phoneEnabled ? "phone" : null,
  ].filter((value): value is string => Boolean(value));

  const formData = new FormData();
  const dynamicFieldKeys = new Set(options.dynamicFieldKeys ?? []);
  const appenders = createFormDataAppenders(formData, dynamicFieldKeys);
  const { appendBaseValue } = appenders;

  appendBaseValue("form_code", formCode);
  appendBaseValue("category_id", options.categoryId);
  if (!options.isDraft) {
    appendBaseValue("title", cleanValues.title);
    appendBaseValue("description", cleanValues.description);
  }

  const storedNeighborhoodId =
    cleanValues.neighborhoodId ||
    window.localStorage.getItem(neighborhoodIdKey) ||
    (cleanValues as NewAdFormValues & { neighborhood_id?: string }).neighborhood_id;
  const storedSubNeighborhoodId =
    cleanValues.subNeighborhoodId ||
    window.localStorage.getItem(subNeighborhoodIdKey) ||
    (cleanValues as NewAdFormValues & { sub_neighborhood_id?: string }).sub_neighborhood_id;

  appendBaseValue("neighborhood_id", storedNeighborhoodId);
  appendBaseValue("sub_neighborhood_id", storedSubNeighborhoodId);
  appendBaseValue("lat", getStoredNewAdLocationNumber(locationLatKey));
  appendBaseValue("lng", getStoredNewAdLocationNumber(locationLngKey));
  appendBaseValue(
    "location_label",
    cleanValues.location || window.localStorage.getItem(locationKey),
  );
  appendBaseValue(
    "virtual_tour_link",
    cleanValues.hasVirtualTour ? cleanValues.virtualTourLink.trim() : "",
  );
  appendBaseValue(
    "agency_id",
    cleanValues.registrantType === "agency" ? cleanValues.agencyId.trim() : "",
  );

  if (cleanValues.consultantId && shouldSendConsultantAssignment(cleanValues)) {
    appendBaseValue("consultant_id", cleanValues.consultantId.trim());
  }

  const omitContacts = shouldOmitOwnerContactsOnAssignment(cleanValues);
  if (!options.isEdit && !omitContacts) {
    if (cleanValues.phoneNumber) appendBaseValue("owner_phone", cleanValues.phoneNumber);
    if (cleanValues.ownerFullName) appendBaseValue("owner_name", cleanValues.ownerFullName);
    if (cleanValues.ownerExactAddress)
      appendBaseValue("owner_address", cleanValues.ownerExactAddress);
  }
  if (cleanValues.ownerPhone && !omitContacts) {
    appendBaseValue("owner_contact_phone", cleanValues.ownerPhone);
  }
  if (cleanValues.ownerFullName && !omitContacts) {
    appendBaseValue("owner_contact_name", cleanValues.ownerFullName);
  }
  if (cleanValues.ownerExactAddress && !omitContacts) {
    appendBaseValue("owner_contact_address", cleanValues.ownerExactAddress);
  }
  appendBaseValue("telegram", cleanValues.telegram);
  appendBaseValue("whatsapp", cleanValues.whatsapp);

  contactTypes.forEach((contactType) => {
    formData.append("contact_type[]", contactType);
  });

  appendFormDataSpecs(
    appenders,
    values,
    params,
    formCode,
    extraSpecs,
    facilities,
    heatingCooling,
  );

  appendFormDataMedia(formData, cleanValues, options);

  return formData;
}
