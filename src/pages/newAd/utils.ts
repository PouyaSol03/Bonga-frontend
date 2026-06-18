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

export function buildPayload(values: NewAdFormValues) {
  const params = getParams();
  const isProject = params.transaction === "project";

  return {
    transaction: params.transaction,
    category: params.category,
    category_label: params.label,
    location: values.location,
    property: {
      project: isProject
        ? {
          total_floors: toNumber(values.projectTotalFloors),
          total_units: toNumber(values.projectTotalUnits),
          status: values.projectStatus || null,
          delivery_date_jalali: values.projectDeliveryDate || null,
          details: values.projectDetails.map((item) => ({
            min_meterage: toNumber(item.minMeterage),
            max_meterage: toNumber(item.maxMeterage),
            floors: item.floors,
            rooms: item.rooms,
            positions: item.positions,
          })),
          sale_terms: values.saleTermsEnabled
            ? {
              percent: toNumber(values.saleTermsPercent),
              installment_months: toNumber(values.saleTermsInstallmentMonths),
            }
            : null,
        }
        : null,
      meterage: toNumber(values.meterage),
      land_area: toNumber(values.landArea),
      building_area: toNumber(values.buildingArea),

      floor: values.floor || null,
      rooms: values.rooms || null,
      age: values.age || null,

      density: toNumber(values.density),
      usage_type: values.usageType || null,
      land_position: values.landPosition || null,
      document_type: values.documentType || null,
      suitable_for: values.suitableFor || null,
      hotel_stars: values.hotelStars || null,
      standard_capacity: toNumber(values.standardCapacity),
      extra_people_capacity: toNumber(values.extraPeopleCapacity),

      more_features: {
        total_floors: values.totalFloors || null,
        unit_type: values.unitType || null,
        unit_position: values.unitPosition || null,
        document_type: values.documentType || null,
        renovated: values.renovated,
        furnished: values.furnished,
        facade_material: values.facadeMaterial || null,
        floor_material: values.floorMaterial || null,
        cabinet_material: values.cabinetMaterial || null,
        land_position: values.landPosition || null,
        villa_type: values.villaType || null,
        density: toNumber(values.density),
        land_width: toNumber(values.landWidth),
        street_width: toNumber(values.streetWidth),
        construction_permit: values.constructionPermit,
        commercial_permit: values.commercialPermit,
        ceiling_height: toNumber(values.ceilingHeight),
        single_room_count: toNumber(values.singleRoomCount),
        double_room_count: toNumber(values.doubleRoomCount),
        suite_count: toNumber(values.suiteCount),
      },

      extra_specs: labels(propertySpecs, values.selectedSpecs),
    },
    heating_cooling: labels(heatingItems, values.heatingCooling),
    facilities: labels(facilityItems, values.facilities),
    price: {
      amount: toNumber(values.price),

      loan_enabled: isProject ? false : values.loanEnabled,
      loan_amount: !isProject && values.loanEnabled ? toNumber(values.loanAmount) : null,
      loan_installment: !isProject && values.loanEnabled ? toNumber(values.loanInstallment) : null,

      exchange_enabled: values.exchangeEnabled,
      exchange_targets: values.exchangeEnabled ? values.exchangeTargets : [],
    },
    media: {
      photos: values.photos.map((photo) => ({
        name: photo.name,
        size: photo.size,
        type: photo.type,
      })),
      has_video: values.hasVideo,
      video:
        values.hasVideo && values.video
          ? {
            name: values.video.name,
            size: values.video.size,
            type: values.video.type,
          }
          : null,
      has_virtual_tour: values.hasVirtualTour,
    },
    owner: {
      registrant_type: values.registrantType || null,
      contact_methods: { chat: values.chatEnabled, phone: values.phoneEnabled },
      social: { telegram: values.telegram, whatsapp: values.whatsapp },
    },
    content: { title: values.title, description: values.description },
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

