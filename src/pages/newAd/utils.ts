import { useEffect } from "react";

import { getStoredAuthSession, storeLoginRedirectPath } from "../../auth/auth-storage";
import {
  basicPropertyFieldsByListingType,
  blankValues,
  defaultBasicPropertyFields,
  draftKey,
  facilityItems,
  heatingItems,
  locationKey,
  moreFeatureFieldsByCategory,
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
  const { category } = getParams();
  return moreFeatureFieldsByCategory[category] ?? [];
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

export function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
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
      min_meterage: toNumber(item.minMeterage),
      max_meterage: toNumber(item.maxMeterage),
      floors: item.floors,
      rooms: item.rooms,
      positions: item.positions,
    }))
    .filter((item) =>
      Object.values(item).some((value) => hasFeatureValue(value)),
    );
}

export function buildPayload(values: NewAdFormValues) {
  const params = getParams();
  const isProject = params.transaction === "project";
  const features: NewAdFeature[] = [];
  const heatingCooling = labels(heatingItems, values.heatingCooling);
  const facilities = labels(facilityItems, values.facilities);
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
  addFeature(features, "document_type", values.documentType);
  addFeature(features, "suitable_for", values.suitableFor);
  addFeature(features, "hotel_stars", values.hotelStars);
  addFeature(features, "standard_capacity", toNumber(values.standardCapacity));
  addFeature(features, "extra_people_capacity", toNumber(values.extraPeopleCapacity));

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
  addFeature(features, "construction_license", values.constructionPermit);
  addFeature(features, "commercial_license", values.commercialPermit);
  addFeature(features, "ceiling_height", toNumber(values.ceilingHeight));
  addFeature(features, "single_room_count", toNumber(values.singleRoomCount));
  addFeature(features, "double_room_count", toNumber(values.doubleRoomCount));
  addFeature(features, "suite_count", toNumber(values.suiteCount));

  addFeature(features, "extra_specs", extraSpecs);
  addFeature(features, "heating_cooling", heatingCooling);
  addFeature(features, "facilities", facilities);

  addFeature(features, "price", toNumber(values.price));
  addFeature(features, "has_loan", !isProject && values.loanEnabled);
  addFeature(features, "loan_amount", !isProject && values.loanEnabled ? toNumber(values.loanAmount) : null);
  addFeature(features, "loan_installment", !isProject && values.loanEnabled ? toNumber(values.loanInstallment) : null);
  addFeature(features, "has_exchange", values.exchangeEnabled);
  addFeature(features, "exchange_with", values.exchangeEnabled ? values.exchangeTargets : []);

  addFeature(features, "has_image", values.photos.length > 0);
  addFeature(features, "has_video", values.hasVideo);
  addFeature(features, "has_virtual_tour", values.hasVirtualTour);
  addFeature(features, "advertiser_type", values.registrantType);

  if (isProject) {
    addFeature(features, "project_total_floors", toNumber(values.projectTotalFloors));
    addFeature(features, "project_total_units", toNumber(values.projectTotalUnits));
    addFeature(features, "project_status", values.projectStatus);
    addFeature(features, "delivery_date", values.projectDeliveryDate);
    addFeature(features, "project_details", buildProjectDetailFeatures(values));
    addFeature(features, "sale_terms_enabled", values.saleTermsEnabled);
    addFeature(features, "sale_terms_percent", values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null);
    addFeature(features, "sale_terms_installment_months", values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null);
  }

  return {
    transaction: params.transaction,
    category: params.category,
    category_label: params.label,
    location: values.location,
    title: values.title,
    description: values.description,
    price: toNumber(values.price),
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
  const payload = buildPayload(values);
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  values.photos.forEach((photo) => {
    formData.append("photos[]", photo.file);
  });

  if (values.hasVideo && values.video) {
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

