import { useEffect } from "react";

import { getStoredAuthSession, storeLoginRedirectPath } from "../../core/auth/auth-storage";
import {
  basicPropertyFieldsByListingType,
  blankValues,
  defaultBasicPropertyFields,
  draftKey,
  facilityItems,
  heatingItems,
  landFacilityItems,
  locationKey,
  locationLatKey,
  locationLngKey,
  moreFeatureFieldsByCategory,
  moreFeatureFieldsByListingType,
  neighborhoodIdKey,
  propertySpecs,
  subNeighborhoodIdKey,
} from "./data";
import type { ChipItem, MoreFeaturesFormValues, NewAdFormValues } from "./types";
import { clearNewAdFlowSession } from "./session";

export function getBasicPropertyFields() {
  const { transaction, category } = getParams();
  const listingKey = `${transaction}:${category}`;

  return (
    basicPropertyFieldsByListingType[listingKey] ??
    defaultBasicPropertyFields
  );
}

export function getMoreFeatureFields() {
  const { transaction, category } = getParams();
  const listingKey = `${transaction}:${category}`;

  return (
    moreFeatureFieldsByListingType[listingKey] ??
    moreFeatureFieldsByCategory[category] ??
    []
  );
}

export function pickMoreFeatures(values: NewAdFormValues): MoreFeaturesFormValues {
  return {
    floor: values.floor,
    rooms: values.rooms,
    totalFloors: values.totalFloors,
    unitsPerFloor: values.unitsPerFloor,
    unitType: values.unitType,
    unitPosition: values.unitPosition,
    documentType: values.documentType,
    renovated: values.renovated,
    furnished: values.furnished,
    facadeMaterial: values.facadeMaterial,
    floorMaterial: values.floorMaterial,
    cabinetMaterial: values.cabinetMaterial,
    landPosition: values.landPosition,
    villaType: values.villaType,
    density: values.density,
    landWidth: values.landWidth,
    streetWidth: values.streetWidth,
    constructionPermit: values.constructionPermit,
    commercialPermit: values.commercialPermit,
    commercialLicense: values.commercialLicense,
    ceilingHeight: values.ceilingHeight,
    singleRoomCount: values.singleRoomCount,
    doubleRoomCount: values.doubleRoomCount,
    suiteCount: values.suiteCount,
  };
}

export function navigateTo(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getLoginRequiredPath(returnTo: string) {
  const params = new URLSearchParams({ returnTo });

  return `/login-required?${params.toString()}`;
}

export function clearNewAdDraftStorage() {
  clearNewAdFlowSession();
  window.localStorage.removeItem(draftKey);
  window.localStorage.removeItem(locationKey);
  window.localStorage.removeItem(locationLatKey);
  window.localStorage.removeItem(locationLngKey);
  window.localStorage.removeItem(neighborhoodIdKey);
  window.localStorage.removeItem(subNeighborhoodIdKey);
}

export function getParams(): {
  category: string;
  label: string;
  registrantType: NewAdFormValues["registrantType"];
  transaction: string;
} {
  const params = new URLSearchParams(window.location.search);
  const registrantType = params.get("registrantType");

  return {
    category: params.get("category") ?? "",
    label: params.get("label") ?? "آگهی ملک",
    registrantType:
      registrantType === "personal" || registrantType === "agency"
        ? registrantType
        : "",
    transaction: params.get("transaction") ?? "",
  };
}

function getDraft(): Partial<NewAdFormValues> {
  try {
    return JSON.parse(window.localStorage.getItem(draftKey) ?? "{}") as Partial<NewAdFormValues>;
  } catch {
    window.localStorage.removeItem(draftKey);
    return {};
  }
}

type EditAdCard = Partial<{
  agency: string;
  area: string;
  id: number | string;
  priceLabelPrimary: string;
  priceLabelSecondary: string;
  pricePrimary: string;
  priceSecondary: string;
  rooms: string;
  timeAndLocation: string;
  title: string;
  year: string;
}>;

export type EditAdRouteState = {
  ad?: Record<string, unknown>;
  card?: EditAdCard;
  editReturnTo?: string;
  isEditMode?: boolean;
  returnTo?: string;
  tab?: string;
};

function readRouteState(): EditAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  return state as EditAdRouteState;
}

export function getEditAdRouteState(): EditAdRouteState {
  const params = new URLSearchParams(window.location.search);
  const routeState = readRouteState();
  const isEditRoute =
    params.get("edit") === "true" ||
    routeState.isEditMode === true ||
    window.location.pathname.includes("/published/edit");

  return {
    ...routeState,
    isEditMode: isEditRoute,
  };
}

function readText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
}

function pickFirstNumber(value: string) {
  const match = value.match(/[۰-۹٠-٩0-9]+/);

  return match?.[0] ?? "";
}

function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function priceTextToNumberString(value: string) {
  const normalized = toLatinDigits(value).replace(/\//g, ".");
  const decimalMatch = normalized.match(/\d+(?:\.\d+)?/);

  if (!decimalMatch) return "";

  const amount = Number(decimalMatch[0]);

  if (!Number.isFinite(amount)) return "";

  if (value.includes("میلیارد")) return String(Math.round(amount * 1_000_000_000));
  if (value.includes("میلیون")) return String(Math.round(amount * 1_000_000));

  return normalized.replace(/[^\d]/g, "");
}

function locationFromTimeAndLocation(value: string) {
  const parts = value.split(" در ");

  return parts.length > 1 ? parts.slice(1).join(" در ").trim() : value.trim();
}

function buildEditDefaultValues(routeState: EditAdRouteState): Partial<NewAdFormValues> {
  const card = routeState.card ?? {};
  const ad = routeState.ad ?? {};
  const title = readText(card.title, ad.title, ad.name);
  const location = readText(
    ad.location,
    ad.address,
    card.timeAndLocation ? locationFromTimeAndLocation(card.timeAndLocation) : "",
  );
  const publisherName = readText(card.agency, ad.agency, ad.publisherName, ad.publisher_name);
  const phoneNumber = readText(ad.owner_phone, ad.phone, ad.phoneNumber, ad.phone_number);
  const price = priceTextToNumberString(readText(card.pricePrimary, ad.price, ad.total_price));
  const mortgagePrice = priceTextToNumberString(readText(card.pricePrimary, ad.mortgagePrice, ad.mortgage_price));
  const rentPrice = priceTextToNumberString(readText(card.priceSecondary, ad.rentPrice, ad.rent_price));

  return {
    age: readText(card.year, ad.age, ad.building_age),
    chatEnabled: true,
    description: readText(ad.description, ad.body) || [title, card.timeAndLocation].filter(Boolean).join("\n"),
    location,
    meterage: pickFirstNumber(readText(card.area, ad.area, ad.meterage)),
    mortgagePrice,
    phoneEnabled: true,
    phoneNumber,
    price,
    publisherName,
    agencyId: readText(ad.agency_id, ad.agencyId),
    registrantType: publisherName ? "agency" : "personal",
    rentPrice,
    rooms: pickFirstNumber(readText(card.rooms, ad.rooms)),
    title,
  };
}

export function getDefaultValues(editState: EditAdRouteState = getEditAdRouteState()): NewAdFormValues {
  const editDefaults = editState.isEditMode ? buildEditDefaultValues(editState) : null;
  const selectedRegistrantType: NewAdFormValues["registrantType"] = editState.isEditMode
    ? ""
    : getParams().registrantType;
  const baseValues = editDefaults
    ? {
        ...blankValues,
        ...editDefaults,
      }
    : {
        ...blankValues,
        ...getDraft(),
        location: window.localStorage.getItem(locationKey) ?? "",
      };

  return {
    ...baseValues,
    registrantType: selectedRegistrantType || baseValues.registrantType,
    hasVideo: false,
    photos: [],
    video: null,
  };
}

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function normalizeNumberInput(value: string) {
  return normalizeDigits(value).replace(/[^\d,]/g, "");
}

function toNumber(value: string) {
  const normalized = normalizeDigits(value).replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) && normalized ? number : null;
}

function labels(items: ChipItem[], ids: string[]) {
  return items.filter((item) => ids.includes(item.id)).map((item) => item.label);
}

type NewAdFeatureValue = string | number | boolean | string[] | Record<string, unknown>[];

type NewAdFeature = {
  key: string;
  value: NewAdFeatureValue;
};

function hasFeatureValue(value: unknown) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;

  return true;
}

function addFeature(features: NewAdFeature[], key: string, value: unknown) {
  if (!hasFeatureValue(value)) return;

  features.push({
    key,
    value: value as NewAdFeatureValue,
  });
}

function buildProjectDetailFeatures(values: NewAdFormValues) {
  return values.projectDetails
    .map((item) => ({
      meterage: toNumber(item.meterage || item.minMeterage || ""),
      floors: item.floors,
      rooms: item.rooms,
      positions: item.positions,
    }))
    .filter((item) =>
      Object.values(item).some((value) => hasFeatureValue(value)),
    );
}

function buildDailyHotelRoomFeatures(values: NewAdFormValues) {
  return values.dailyHotelRooms
    .map((room) => ({
      room_type: room.id,
      room_label: room.label,
      guest_count: toNumber(room.guestCount),
      extra_guest_count: toNumber(room.extraGuestCount),
      meal_plan: room.mealPlan || null,
      normal_price: toNumber(room.normalPrice),
      weekend_price: toNumber(room.weekendPrice),
      special_price: toNumber(room.specialPrice),
    }))
    .filter((room) => Object.values(room).some((value) => hasFeatureValue(value)));
}

function getFacilityItemsForCategory(category: string) {
  return category === "land" || category === "factory-workshop"
    ? landFacilityItems
    : facilityItems;
}

function getPriceValue(values: NewAdFormValues, transaction: string, category: string) {
  if (transaction === "rent" && category.startsWith("daily-")) return toNumber(values.minPrice);
  if (transaction === "rent") return toNumber(values.rentPrice);
  if (transaction === "project") return toNumber(values.minPrice);

  return toNumber(values.price);
}

export function getAdvertiseFormCode(transaction: string, category: string) {
  const formCodes: Record<string, string> = {
    "project:project-partnership": "partnership",
    "project:project-presale": "presale-special",
    "rent:commercial-unit": "rent-commercial",
    "rent:daily-apartment-suite": "daily-apartment-suite",
    "rent:daily-garden-villa": "daily-garden-villa",
    "rent:daily-hotel-apartment": "daily-hotel",
    "rent:daily-workspace": "daily-office-booth",
    "rent:factory-workshop": "rent-factory-workshop",
    "rent:hotel-apartment": "rent-hotel",
    "rent:warehouse": "rent-warehouse",
    "sale:commercial-unit": "sale-commercial",
    "sale:factory-workshop": "sale-factory",
    "sale:garden-villa": "sale-garden-villa",
    "sale:hotel-apartment": "sale-hotel",
    "sale:office": "sale-office",
    "sale:warehouse": "sale-warehouse",
  };

  return formCodes[`${transaction}:${category}`] ?? [transaction, category].filter(Boolean).join("-");
}

function getStoredNewAdLocationNumber(key: string) {
  const value = window.localStorage.getItem(key);
  const number = value ? Number(value) : Number.NaN;

  return Number.isFinite(number) ? number : null;
}

export function buildPayload(values: NewAdFormValues) {
  const params = getParams();
  const isProject = params.transaction === "project";
  const isPartnership = isProject && params.category === "project-partnership";
  const isRent = params.transaction === "rent";
  const isDailyRent = isRent && params.category.startsWith("daily-");
  const isSale = params.transaction === "sale";
  const isSaleGardenVilla = isSale && params.category === "garden-villa";
  const hideHeatingCooling = isPartnership || params.category === "land" || params.category === "factory-workshop";
  const featureItemsForCategory = getFacilityItemsForCategory(params.category);
  const features: NewAdFeature[] = [];
  const heatingCooling = hideHeatingCooling ? [] : labels(heatingItems, values.heatingCooling);
  const facilities = isPartnership ? [] : labels(featureItemsForCategory, values.facilities);
  const extraSpecs = labels(propertySpecs, values.selectedSpecs);

  const formCode = getAdvertiseFormCode(params.transaction, params.category);

  addFeature(features, "form_code", formCode);
  addFeature(features, "location", values.location);
  addFeature(features, "area", toNumber(values.meterage));
  addFeature(features, "land_area", toNumber(values.landArea));
  addFeature(features, "building_area", toNumber(values.buildingArea));
  addFeature(features, "floor", values.floor);
  addFeature(features, "rooms", values.rooms);
  addFeature(features, "building_age", values.age);
  addFeature(features, "density", toNumber(values.density));
  addFeature(features, "land_use", values.usageType);
  addFeature(features, "land_position", values.landPosition);
  addFeature(features, "suitable_for", values.suitableFor);
  addFeature(features, "hotel_stars", values.hotelStars);
  addFeature(features, "standard_capacity", values.standardCapacity);
  addFeature(features, "extra_people_capacity", values.extraPeopleCapacity);
  addFeature(features, "commercial_permit", values.commercialLicense || (values.commercialPermit ? "دارد" : ""));
  addFeature(features, "build_permit", values.constructionLicense ? values.constructionLicense === "دارد" : values.constructionPermit);

  if (!isRent) {
    addFeature(features, "document_type", values.documentType);
  }

  addFeature(features, "total_floors", values.totalFloors);
  addFeature(features, "units_per_floor", values.unitsPerFloor);
  addFeature(features, "unit_type", values.unitType);
  addFeature(features, "unit_direction", values.unitPosition);
  addFeature(features, "renovated", values.renovated);
  addFeature(features, "furnished", values.furnished);
  addFeature(features, "facade_material", values.facadeMaterial);
  addFeature(features, "floor_material", values.floorMaterial);
  addFeature(features, "cabinet_material", values.cabinetMaterial);
  addFeature(features, "villa_type", values.villaType);
  addFeature(features, "land_width", toNumber(values.landWidth));
  addFeature(features, "street_width", toNumber(values.streetWidth));
  addFeature(features, "ceiling_height", toNumber(values.ceilingHeight));
  addFeature(features, "single_room_count", toNumber(values.singleRoomCount));
  addFeature(features, "double_room_count", toNumber(values.doubleRoomCount));
  addFeature(features, "suite_count", toNumber(values.suiteCount));

  if (params.category === "daily-hotel-apartment") {
    addFeature(features, "daily_hotel_rooms", buildDailyHotelRoomFeatures(values));
  }

  addFeature(features, "extra_specs", extraSpecs);
  addFeature(features, "heating_cooling", heatingCooling);
  addFeature(features, "facilities", facilities);

  if (isDailyRent) {
    addFeature(features, "min_price", toNumber(values.minPrice));
    addFeature(features, "max_price", toNumber(values.maxPrice));
  } else if (isRent) {
    addFeature(features, "mortgage_price", toNumber(values.mortgagePrice));
    addFeature(features, "rent_price", toNumber(values.rentPrice));
  } else if (isProject) {
    if (!isPartnership) {
      addFeature(features, "min_price", toNumber(values.minPrice));
      addFeature(features, "max_price", toNumber(values.maxPrice));
    }
  } else {
    addFeature(features, "price", toNumber(values.price));
  }

  addFeature(features, "loan_amount", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanAmount) : null);
  addFeature(features, "loan_installment", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanInstallment) : null);
  addFeature(features, "has_exchange", isSale && values.exchangeEnabled);
  addFeature(features, "exchange_with", isSale && values.exchangeEnabled ? values.exchangeTargets : []);

  addFeature(features, "has_image", values.photos.length > 0);
  addFeature(features, "has_video", values.hasVideo);
  addFeature(features, "has_virtual_tour", values.hasVirtualTour);
  addFeature(features, "advertiser_type", values.registrantType);
  addFeature(features, "publisher", values.registrantType === "agency" ? values.publisherName : "");
  addFeature(features, "agency_id", values.registrantType === "agency" ? values.agencyId : "");

  if (isProject && !isPartnership) {
    addFeature(features, "project_total_floors", toNumber(values.projectTotalFloors));
    addFeature(features, "project_total_units", toNumber(values.projectTotalUnits));
    addFeature(features, "project_status", values.projectStatus);
    addFeature(features, "delivery_date", values.projectDeliveryDate);
    addFeature(features, "project_details", buildProjectDetailFeatures(values));
    addFeature(features, "sale_terms_enabled", values.saleTermsEnabled);
    addFeature(features, "sale_terms_percent", values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null);
    addFeature(features, "sale_terms_installment_months", values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null);
  }

  if (isPartnership) {
    addFeature(features, "partnership_type", values.participationType);
    addFeature(features, "builder_share", toNumber(values.builderSharePercent));
  }

  return {
    transaction: params.transaction,
    category: params.category,
    category_label: params.label,
    location: values.location,
    title: values.title,
    description: values.description,
    price: getPriceValue(values, params.transaction, params.category),
    features,
    contact_type: [
      values.chatEnabled ? "chat" : null,
      values.phoneEnabled ? "phone" : null,
    ].filter(Boolean),
    owner_phone: values.phoneNumber || null,
    owner_name: values.ownerFullName || null,
    owner_address: values.ownerExactAddress || null,
    social: {
      telegram: values.telegram || null,
      whatsapp: values.whatsapp || null,
    },
  };
}

export function buildNewAdFormData(
  values: NewAdFormValues,
  options: {
    categoryId?: string | null;
    dynamicFieldKeys?: Iterable<string>;
    formCode?: string | null;
  } = {},
) {
  const params = getParams();
  const formCode =
    options.formCode?.trim() ||
    getAdvertiseFormCode(params.transaction, params.category);
  const heatingCooling = labels(heatingItems, values.heatingCooling);
  const facilities = labels(getFacilityItemsForCategory(params.category), values.facilities);
  const extraSpecs = labels(propertySpecs, values.selectedSpecs);
  const contactTypes = [
    values.chatEnabled ? "chat" : null,
    values.phoneEnabled ? "phone" : null,
  ].filter((value): value is string => Boolean(value));
  const advertiserType =
    values.registrantType === "personal"
      ? "شخصی"
      : values.registrantType === "agency"
        ? "مشاور املاک"
        : "";
  const formData = new FormData();
  const dynamicFieldKeys = new Set(options.dynamicFieldKeys ?? []);

  const appendBaseValue = (key: string, value: unknown) => {
    if (!hasFeatureValue(value)) return;

    const serializedValue =
      typeof value === "boolean" ? (value ? "1" : "0") : String(value);

    formData.append(key, serializedValue);
  };

  const appendDynamicValue = (key: string, value: unknown) => {
    if (!dynamicFieldKeys.has(key) || !hasFeatureValue(value)) return;

    const serializedValue =
      typeof value === "boolean" ? (value ? "1" : "0") : String(value);

    formData.append(key, serializedValue);
  };

  const appendDynamicArray = (key: string, value: string[]) => {
    if (!dynamicFieldKeys.has(key)) return;

    value.filter(Boolean).forEach((item) => {
      formData.append(key, item);
    });
  };

  const appendDynamicJson = (key: string, value: unknown) => {
    if (!dynamicFieldKeys.has(key)) return;
    if (!hasFeatureValue(value)) return;

    if (Array.isArray(value) && value.length === 0) return;
    if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value as Record<string, unknown>).length === 0) return;

    formData.append(key, JSON.stringify(value));
  };

  appendBaseValue("form_code", formCode);
  appendBaseValue("category_id", options.categoryId);
  appendBaseValue("title", values.title);
  appendBaseValue("description", values.description);
  appendBaseValue("neighborhood_id", window.localStorage.getItem(neighborhoodIdKey));
  appendBaseValue("sub_neighborhood_id", window.localStorage.getItem(subNeighborhoodIdKey));
  appendBaseValue("lat", getStoredNewAdLocationNumber(locationLatKey));
  appendBaseValue("lng", getStoredNewAdLocationNumber(locationLngKey));
  appendBaseValue("location_label", values.location);
  appendBaseValue(
    "virtual_tour_link",
    values.hasVirtualTour ? values.virtualTourLink.trim() : "",
  );
  appendBaseValue("owner_type", values.registrantType);
  appendBaseValue(
    "agency_id",
    values.registrantType === "agency" ? values.agencyId.trim() : "",
  );
  appendBaseValue("owner_phone", values.phoneNumber);
  appendBaseValue("owner_name", values.ownerFullName);
  appendBaseValue("owner_address", values.ownerExactAddress);
  appendBaseValue("telegram", values.telegram);
  appendBaseValue("whatsapp", values.whatsapp);

  contactTypes.forEach((contactType) => {
    formData.append("contact_type[]", contactType);
  });

  const meterageValue = toNumber(values.meterage);
  const landAreaValue = toNumber(values.landArea);
  const buildingAreaValue = toNumber(values.buildingArea);
  const areaValue = meterageValue ?? buildingAreaValue ?? landAreaValue;
  const apiLandAreaValue = formCode === "sale-land" ? (landAreaValue ?? meterageValue) : landAreaValue;

  appendDynamicValue("area", areaValue);
  appendDynamicValue("land_area", apiLandAreaValue);
  appendDynamicValue("building_area", buildingAreaValue);
  appendDynamicValue("price", getPriceValue(values, params.transaction, params.category));
  appendDynamicValue("rent_price", toNumber(values.rentPrice));
  appendDynamicValue("mortgage_price", toNumber(values.mortgagePrice));
  // Updated daily forms use min/max. Keep daily_price only when the server form still exposes it.
  appendDynamicValue("daily_price", toNumber(values.minPrice));
  appendDynamicValue("meter_price", toNumber(values.minPrice));
  appendDynamicValue("min_price", toNumber(values.minPrice));
  appendDynamicValue("max_price", toNumber(values.maxPrice));
  appendDynamicValue("project_total_floors", toNumber(values.projectTotalFloors));
  appendDynamicValue("project_total_units", toNumber(values.projectTotalUnits));
  appendDynamicValue("delivery_date", values.projectDeliveryDate);
  appendDynamicValue("building_age", values.age);
  appendDynamicValue("rooms", values.rooms);
  appendDynamicValue("floor", values.floor);
  appendDynamicValue("hotel_stars", values.hotelStars);
  appendDynamicValue("capacity", toNumber(pickFirstNumber(values.standardCapacity)));
  appendDynamicValue("extra_people_capacity", toNumber(pickFirstNumber(values.extraPeopleCapacity)));
  appendDynamicValue("renovated", values.renovated);
  appendDynamicValue("furnished", values.furnished);
  appendDynamicValue("loan_amount", values.loanEnabled ? toNumber(values.loanAmount) : null);
  appendDynamicValue("loan_installment", values.loanEnabled ? toNumber(values.loanInstallment) : null);
  appendDynamicValue("has_document", Boolean(values.documentType));
  appendDynamicValue("document_type", values.documentType);
  appendDynamicValue("total_floors", values.totalFloors);
  appendDynamicValue("units_per_floor", values.unitsPerFloor);
  appendDynamicValue("unit_type", values.unitType);
  appendDynamicValue("unit_position", values.unitPosition);
  appendDynamicValue("density", toNumber(values.density));
  appendDynamicValue("land_use", values.usageType);
  appendDynamicValue("land_position", values.landPosition);
  appendDynamicValue("house_type", values.villaType);
  appendDynamicValue("villa_type", values.villaType);
  appendDynamicValue("height", toNumber(values.ceilingHeight));
  appendDynamicValue("facade_material", values.facadeMaterial);
  appendDynamicValue("floor_material", values.floorMaterial);
  appendDynamicValue("cabinet_material", values.cabinetMaterial);
  appendDynamicValue("land_width", toNumber(values.landWidth));
  appendDynamicValue("street_width", toNumber(values.streetWidth));
  appendDynamicValue("single_room_count", toNumber(values.singleRoomCount));
  appendDynamicValue("double_room_count", toNumber(values.doubleRoomCount));
  appendDynamicValue("suite_count", toNumber(values.suiteCount));
  appendDynamicValue(
    "commercial_permit",
    values.commercialLicense || (values.commercialPermit ? "دارد" : ""),
  );
  appendDynamicValue("project_status", values.projectStatus);
  appendDynamicValue("installment_sale", values.saleTermsEnabled);
  appendDynamicValue(
    "sale_terms_percent",
    values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null,
  );
  appendDynamicValue(
    "sale_terms_installment_months",
    values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null,
  );
  appendDynamicValue("builder_share", toNumber(values.builderSharePercent));
  appendDynamicValue("partnership_type", values.participationType);
  appendDynamicValue(
    "build_permit",
    values.constructionLicense
      ? values.constructionLicense === "دارد"
      : values.constructionPermit,
  );
  appendDynamicValue("advertiser_type", advertiserType);
  appendDynamicValue("has_image", values.photos.length > 0);
  appendDynamicValue("has_video", Boolean(values.video));

  appendDynamicArray("suitable_for", values.suitableFor ? [values.suitableFor] : []);
  appendDynamicArray("heating_cooling", heatingCooling);
  appendDynamicArray("facilities", facilities);
  appendDynamicArray("exchange_with", values.exchangeEnabled ? values.exchangeTargets : []);

  appendDynamicJson("project_details", buildProjectDetailFeatures(values));
  appendDynamicJson("extra_specs", extraSpecs);
  appendDynamicJson("daily_hotel_rooms", buildDailyHotelRoomFeatures(values));

  values.photos.forEach((photo) => {
    if (photo.file) {
      formData.append("images", photo.file, photo.file.name);
    }
  });

  if (values.video?.file) {
    formData.append("video", values.video.file);
  }

  return formData;
}

export function useRequireAuth() {
  useEffect(() => {
    if (getStoredAuthSession()) return;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    storeLoginRedirectPath(returnTo);
    navigateTo(getLoginRequiredPath(returnTo));
  }, []);
}
