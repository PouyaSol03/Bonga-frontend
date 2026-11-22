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

export function buildPayload(
  values: NewAdFormValues,
  options: { dynamicFieldKeys?: Iterable<string> } = {},
) {
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
  const dynamicKeys = options.dynamicFieldKeys ? new Set(options.dynamicFieldKeys) : null;
  const addDynamicFeature = (key: string, value: unknown) => {
    if (dynamicKeys && !dynamicKeys.has(key)) return;
    addFeature(features, key, value);
  };
  const addDynamicAliasFeature = (keys: string[], value: unknown) => {
    if (!dynamicKeys) {
      addFeature(features, keys[0], value);
      return;
    }
    const matched = keys.find((k) => dynamicKeys.has(k));
    if (matched) {
      addFeature(features, matched, value);
    }
  };

  if (!dynamicKeys) {
    addFeature(features, "form_code", formCode);
    addFeature(features, "location", values.location);
  }

  addDynamicAliasFeature(["area", "meterage"], toNumber(values.meterage));
  addDynamicFeature("land_area", toNumber(values.landArea));

  appendPayloadPropertyFeatures(features, values, params, isSale, isRent, options);

  addDynamicFeature("extra_specs", extraSpecs);
  addDynamicFeature("heating_cooling", heatingCooling);
  addDynamicFeature("facilities", facilities);

  const isLoanActive = Boolean(values.loanEnabled || values.loanAmount || values.loanInstallment);
  appendPayloadPricingAndAssignmentFeatures(
    features,
    values,
    params,
    {
      isDailyRent,
      isLoanActive,
      isPartnership,
      isProject,
      isRent,
      isSale,
      isSaleGardenVilla,
    },
    options,
  );

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
