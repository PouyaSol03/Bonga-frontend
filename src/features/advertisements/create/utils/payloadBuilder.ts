import { propertySpecs } from "../data";
import { getFacilityItemsForListing, getHeatingItemsForListing } from "../constants/listingOptions";
import type { NewAdFormValues } from "../types";
import { labels, toNumber } from "./formatters";
import {
  addFeature,
  getAdvertiseFormCode,
  getPriceValue,
  shouldOmitOwnerContactsOnAssignment,
  type NewAdFeature,
} from "./featureBuilders";
import { getParams } from "./routeAndDraftState";
import { appendPayloadPropertyFeatures } from "./payloadPropertyFeatures";
import { appendPayloadPricingAndAssignmentFeatures } from "./payloadPricingFeatures";

export function buildPayload(values: NewAdFormValues) {
  const params = getParams();
  const isProject = params.transaction === "project";
  const isPartnership = isProject && params.category === "project-partnership";
  const isRent = params.transaction === "rent";
  const isDailyRent = isRent && params.category.startsWith("daily-");
  const isSale = params.transaction === "sale";
  const isSaleGardenVilla = isSale && params.category === "garden-villa";
  const hideHeatingCooling = isPartnership || params.category === "land";
  const heatingItemsForListing = getHeatingItemsForListing(params.transaction, params.category);
  const featureItemsForCategory = getFacilityItemsForListing(params.transaction, params.category);
  const features: NewAdFeature[] = [];
  const heatingCooling = hideHeatingCooling
    ? []
    : labels(heatingItemsForListing, values.heatingCooling);
  const facilities = isPartnership ? [] : labels(featureItemsForCategory, values.facilities);
  const extraSpecs = labels(propertySpecs, values.selectedSpecs);

  const formCode = getAdvertiseFormCode(params.transaction, params.category);

  addFeature(features, "form_code", formCode);
  addFeature(features, "location", values.location);
  addFeature(features, "area", toNumber(values.meterage));
  addFeature(features, "land_area", toNumber(values.landArea));

  appendPayloadPropertyFeatures(features, values, params, isSale, isRent);

  addFeature(features, "extra_specs", extraSpecs);
  addFeature(features, "heating_cooling", heatingCooling);
  addFeature(features, "facilities", facilities);

  const isLoanActive = Boolean(values.loanEnabled || values.loanAmount || values.loanInstallment);
  appendPayloadPricingAndAssignmentFeatures(features, values, params, {
    isDailyRent,
    isLoanActive,
    isPartnership,
    isProject,
    isRent,
    isSale,
    isSaleGardenVilla,
  });

  const omitContacts = shouldOmitOwnerContactsOnAssignment(values);

  return {
    transaction: params.transaction,
    category: params.category,
    category_label: params.label,
    location: values.location,
    title: values.title,
    description: values.description,
    price: getPriceValue(values, params.transaction, params.category),
    features,
    contact_type: [values.chatEnabled ? "chat" : null, values.phoneEnabled ? "phone" : null].filter(
      Boolean,
    ),
    owner_phone: omitContacts ? null : values.phoneNumber || null,
    owner_name: omitContacts ? null : values.ownerFullName || null,
    owner_address: omitContacts ? null : values.ownerExactAddress || null,
    owner_contact_name: omitContacts ? null : values.ownerFullName || null,
    owner_contact_phone: omitContacts ? null : values.ownerPhone || null,
    owner_contact_address: omitContacts ? null : values.ownerExactAddress || null,
    social: {
      telegram: values.telegram || null,
      whatsapp: values.whatsapp || null,
    },
  };
}
