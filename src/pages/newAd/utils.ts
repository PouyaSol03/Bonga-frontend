import { useEffect } from "react";

import { getStoredAuthSession, storeLoginRedirectPath } from "../../auth/auth-storage";
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
} from "./data";
import type { ChipItem, MoreFeatureField, MoreFeaturesFormValues, NewAdFormValues } from "./types";

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

export function getMoreFeatureTags(
  values: NewAdFormValues,
  fields: MoreFeatureField[] = getMoreFeatureFields(),
) {
  return fields.reduce<string[]>((tags, field) => {
    const value = values[field.key];

    if (field.control === "toggle") {
      if (value === true) tags.push(field.label);
      return tags;
    }

    if (typeof value === "string" && value.trim()) {
      tags.push(`${field.label}: ${value}`);
    }

    return tags;
  }, []);
}

export function navigateTo(path: string, state?: unknown) {
  window.history.pushState(state ?? {}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function clearNewAdDraftStorage() {
  window.localStorage.removeItem(draftKey);
  window.localStorage.removeItem(locationKey);
  window.localStorage.removeItem(locationLatKey);
  window.localStorage.removeItem(locationLngKey);
  window.localStorage.removeItem(neighborhoodIdKey);
}

export function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") ?? "",
    label: params.get("label") ?? "آگهی ملک",
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

export function getDefaultValues(): NewAdFormValues {
  return {
    ...blankValues,
    ...getDraft(),
    hasVideo: false,
    photos: [],
    video: null,
    location: window.localStorage.getItem(locationKey) ?? "",
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

function getAdvertiseFormCode(transaction: string, category: string) {
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

  addFeature(features, "form_code", `${params.transaction}-${params.category}`);
  addFeature(features, "location", values.location);
  addFeature(features, "area", toNumber(values.meterage));
  addFeature(features, "land_area", toNumber(values.landArea));
  addFeature(features, "building_area", toNumber(values.buildingArea));
  addFeature(features, "floor", values.floor);
  addFeature(features, "rooms", values.rooms);
  addFeature(features, "building_age", values.age);
  addFeature(features, "density", toNumber(values.density));
  addFeature(features, "usage", values.usageType);
  addFeature(features, "land_position", values.landPosition);
  addFeature(features, "suitable_for", values.suitableFor);
  addFeature(features, "hotel_stars", values.hotelStars);
  addFeature(features, "standard_capacity", values.standardCapacity);
  addFeature(features, "extra_people_capacity", values.extraPeopleCapacity);
  addFeature(features, "commercial_license", values.commercialLicense || (values.commercialPermit ? "دارد" : ""));
  addFeature(features, "construction_license", values.constructionLicense || (values.constructionPermit ? "دارد" : ""));

  if (!isRent) {
    addFeature(features, "document_type", values.documentType);
  }

  addFeature(features, "total_floors", values.totalFloors);
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

  addFeature(features, "has_loan", isSale && !isSaleGardenVilla && values.loanEnabled);
  addFeature(features, "loan_amount", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanAmount) : null);
  addFeature(features, "loan_installment", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanInstallment) : null);
  addFeature(features, "has_exchange", isSale && values.exchangeEnabled);
  addFeature(features, "exchange_with", isSale && values.exchangeEnabled ? values.exchangeTargets : []);

  addFeature(features, "has_image", values.photos.length > 0);
  addFeature(features, "has_video", values.hasVideo);
  addFeature(features, "has_virtual_tour", values.hasVirtualTour);
  addFeature(features, "advertiser_type", values.registrantType);

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
    addFeature(features, "participation_type", values.participationType);
    addFeature(features, "builder_share_percent", toNumber(values.builderSharePercent));
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
    social: {
      telegram: values.telegram || null,
      whatsapp: values.whatsapp || null,
    },
  };
}

export function buildNewAdFormData(values: NewAdFormValues) {
  const params = getParams();
  const formCode = getAdvertiseFormCode(params.transaction, params.category);
  const heatingCooling = labels(heatingItems, values.heatingCooling);
  const facilities = labels(getFacilityItemsForCategory(params.category), values.facilities);
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
  const baseCreateFields = new Set([
    "form_code",
    "title",
    "description",
    "category_id",
    "neighborhood_id",
    "lat",
    "lng",
    "contact_type",
    "owner_phone",
    "owner_type",
  ]);
  const searchFlagFields = [
    "advertiser_type",
    "published_at",
    "is_special",
    "has_image",
    "has_video",
  ];
  const formFields: Record<string, string[]> = {
    "daily-apartment-suite": ["area", "rooms", "capacity", "daily_price", "heating_cooling", "facilities", ...searchFlagFields],
    "daily-garden-villa": ["area", "rooms", "capacity", "daily_price", "heating_cooling", "facilities", ...searchFlagFields],
    "daily-hotel": ["daily_price", "hotel_stars", "heating_cooling", "facilities", ...searchFlagFields],
    "daily-office-booth": ["daily_price", "rooms", "capacity", "heating_cooling", "facilities", ...searchFlagFields],
    partnership: ["area", "builder_share", "partnership_type", "document_type", "build_permit", ...searchFlagFields],
    "presale-special": ["area", "meter_price", "project_status", "rooms", "floor", "heating_cooling", "facilities", "exchange_with", "installment_sale", ...searchFlagFields],
    "rent-commercial": ["area", "rent_price", "mortgage_price", "building_age", "rooms", "floor", "renovated", "furnished", "suitable_for", "commercial_permit", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-factory-workshop": ["land_area", "building_area", "rent_price", "mortgage_price", "facilities", ...searchFlagFields],
    "rent-garden-villa": ["area", "rent_price", "mortgage_price", "building_age", "rooms", "furnished", "villa_type", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-hotel": ["area", "rent_price", "mortgage_price", "suitable_for", "building_age", "hotel_stars", "floor", "renovated", "furnished", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-office": ["area", "rent_price", "mortgage_price", "building_age", "rooms", "floor", "renovated", "furnished", "suitable_for", "commercial_permit", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-apartment": ["area", "rent_price", "mortgage_price", "building_age", "rooms", "floor", "renovated", "has_loan", "suitable_for", "unit_type", "unit_position", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-villa-house": ["area", "rent_price", "mortgage_price", "building_age", "rooms", "furnished", "renovated", "house_type", "heating_cooling", "facilities", ...searchFlagFields],
    "rent-warehouse": ["area", "rent_price", "mortgage_price", "suitable_for", "commercial_permit", "facilities", ...searchFlagFields],
    "sale-apartment": ["area", "price", "building_age", "rooms", "floor", "renovated", "furnished", "has_loan", "document_type", "unit_type", "unit_position", "heating_cooling", "facilities", ...searchFlagFields],
    "sale-commercial": ["area", "price", "building_age", "rooms", "renovated", "furnished", "has_loan", "suitable_for", "document_type", "heating_cooling", "facilities", "exchange_with", ...searchFlagFields],
    "sale-factory": ["area", "price", "document_type", "has_loan", "facilities", "exchange_with", ...searchFlagFields],
    "sale-garden-villa": ["land_area", "building_area", "price", "building_age", "rooms", "furnished", "document_type", "villa_type", "heating_cooling", "facilities", "exchange_with", ...searchFlagFields],
    "sale-hotel": ["area", "price", "building_age", "rooms", "hotel_stars", "floor", "renovated", "furnished", "has_loan", "document_type", "heating_cooling", "facilities", "exchange_with", ...searchFlagFields],
    "sale-land": ["land_area", "price", "land_use", "build_permit", "document_type", "density", "facilities", "exchange_with", ...searchFlagFields],
    "sale-office": ["area", "price", "building_age", "rooms", "floor", "has_document", "renovated", "furnished", "has_loan", "suitable_for", "document_type", "heating_cooling", "facilities", "exchange_with", ...searchFlagFields],
    "sale-villa-house": ["land_area", "building_area", "price", "building_age", "rooms", "renovated", "furnished", "has_loan", "document_type", "land_position", "house_type", "heating_cooling", "facilities", "exchange_with", ...searchFlagFields],
    "sale-warehouse": ["area", "price", "height", "commercial_permit", "suitable_for", "document_type", "has_loan", "facilities", "exchange_with", "building_age", ...searchFlagFields],
  };
  const allowedFields = new Set([
    ...baseCreateFields,
    ...(formFields[formCode] ?? []),
  ]);

  const appendValue = (key: string, value: unknown) => {
    if (!allowedFields.has(key)) return;
    if (!hasFeatureValue(value)) return;

    formData.append(key, String(value));
  };

  const appendArray = (key: string, value: string[]) => {
    if (!allowedFields.has(key)) return;

    value.filter(Boolean).forEach((item) => {
      formData.append(key, item);
    });
  };

  appendValue("form_code", formCode);
  appendValue("title", values.title);
  appendValue("description", values.description);
  appendValue("neighborhood_id", window.localStorage.getItem(neighborhoodIdKey));
  appendValue("lat", getStoredNewAdLocationNumber(locationLatKey));
  appendValue("lng", getStoredNewAdLocationNumber(locationLngKey));
  const meterageValue = toNumber(values.meterage);
  const landAreaValue = toNumber(values.landArea);
  const buildingAreaValue = toNumber(values.buildingArea);
  const areaValue = meterageValue ?? buildingAreaValue ?? landAreaValue;
  const apiLandAreaValue = formCode === "sale-land" ? (landAreaValue ?? meterageValue) : landAreaValue;

  appendValue("area", areaValue);
  appendValue("land_area", apiLandAreaValue);
  appendValue("building_area", toNumber(values.buildingArea));
  appendValue("price", getPriceValue(values, params.transaction, params.category));
  appendValue("rent_price", toNumber(values.rentPrice));
  appendValue("mortgage_price", toNumber(values.mortgagePrice));
  appendValue("daily_price", toNumber(values.minPrice));
  appendValue("meter_price", toNumber(values.minPrice));
  appendValue("building_age", values.age);
  appendValue("rooms", values.rooms);
  appendValue("floor", values.floor);
  appendValue("hotel_stars", values.hotelStars);
  appendValue("capacity", values.standardCapacity);
  appendValue("renovated", values.renovated);
  appendValue("furnished", values.furnished);
  appendValue("has_loan", values.loanEnabled);
  appendValue("has_document", Boolean(values.documentType));
  appendValue("document_type", values.documentType);
  appendValue("unit_type", values.unitType);
  appendValue("unit_position", values.unitPosition);
  appendValue("density", toNumber(values.density));
  appendValue("land_use", values.usageType);
  appendValue("land_position", values.landPosition);
  appendValue("house_type", values.villaType);
  appendValue("villa_type", values.villaType);
  appendValue("height", toNumber(values.ceilingHeight));
  appendValue("commercial_permit", values.commercialLicense || (values.commercialPermit ? "دارد" : ""));
  appendValue("project_status", values.projectStatus);
  appendValue("installment_sale", values.saleTermsEnabled);
  appendValue("builder_share", toNumber(values.builderSharePercent));
  appendValue("partnership_type", values.participationType);
  appendValue("build_permit", values.constructionPermit);
  appendValue("advertiser_type", advertiserType);
  appendValue("owner_type", values.registrantType);
  appendValue("has_image", values.photos.length > 0);
  appendValue("has_video", Boolean(values.video));

  appendArray("contact_type", contactTypes);
  appendArray("suitable_for", values.suitableFor ? [values.suitableFor] : []);
  appendArray("heating_cooling", heatingCooling);
  appendArray("facilities", facilities);
  appendArray("exchange_with", values.exchangeEnabled ? values.exchangeTargets : []);

  values.photos.forEach((photo) => {
    formData.append("images[]", photo.file);
  });

  if (values.video) {
    formData.append("video", values.video.file);
  }

  return formData;
}

export function useRequireAuth() {
  useEffect(() => {
    if (getStoredAuthSession()) return;
    storeLoginRedirectPath(`${window.location.pathname}${window.location.search}`);
    navigateTo("/login/phone");
  }, []);
}
