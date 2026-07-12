import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ProjectDetailsStep } from "./steps/project/ProjectDetailsStep";
import { PageFrame } from "../../app/PageFrame";
import { getApiErrorMessage } from "../../api/api";
import { mapAdvertisementToAdCard, type AdvertisementItem } from "../../services/advertisement.service";
import { Snackbar } from "../../components/Snackbar";
import { useAdvertisementDetailQuery, useCreateAdvertisementMutation } from "../../hooks/advertisement.hooks";
import { Header } from "./components/NewAdControls";
import { adManagementPaths, getAdPaymentPath } from "../account/adManagement/adManagementData";
import {
  blankValues,
  dailyHotelRoomTypes,
  draftKey,
  facilityItems,
  heatingItems,
  landFacilityItems,
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  propertySpecs,
} from "./data";
import { DetailsStep } from "./steps/DetailsStep";
import { MediaStep } from "./steps/MediaStep";
import { MoreFeaturesStep } from "./steps/MoreFeaturesStep";
import type { ChipItem, FlowStep, NewAdFieldErrorKey, NewAdFieldErrors, NewAdFormValues, ProjectDetailItem } from "./types";
import { buildNewAdFormData, clearNewAdDraftStorage, getBasicPropertyFields, getDefaultValues, getEditAdRouteState, getParams, navigateTo, useRequireAuth } from "./utils";
export { NewAdLocationPage } from "./NewAdLocationPage";

type AdvertisementFeature = {
  key?: string;
  label?: string;
  value?: unknown;
};

type EditRouteParams = {
  category: string;
  label: string;
  transaction: string;
};

const editRouteParamsByFormCode: Record<string, EditRouteParams> = {
  "daily-apartment-suite": { category: "daily-apartment-suite", label: "آپارتمان، سوئیت", transaction: "rent" },
  "daily-garden-villa": { category: "daily-garden-villa", label: "باغ، ویلا", transaction: "rent" },
  "daily-hotel": { category: "daily-hotel-apartment", label: "هتل، هتل آپارتمان", transaction: "rent" },
  "daily-office-booth": { category: "daily-workspace", label: "دفاتر کار، غرفه، نمایشگاه", transaction: "rent" },
  partnership: { category: "project-partnership", label: "مشارکت", transaction: "project" },
  "presale-special": { category: "project-presale", label: "پیش فروش، فروش پروژه", transaction: "project" },
  "rent-apartment": { category: "apartment", label: "آپارتمان", transaction: "rent" },
  "rent-commercial": { category: "commercial-unit", label: "واحد تجاری", transaction: "rent" },
  "rent-factory-workshop": { category: "factory-workshop", label: "کارخانه، کارگاه", transaction: "rent" },
  "rent-garden-villa": { category: "garden-villa", label: "باغ، ویلا", transaction: "rent" },
  "rent-hotel": { category: "hotel-apartment", label: "هتل، هتل آپارتمان", transaction: "rent" },
  "rent-office": { category: "office", label: "واحد اداری", transaction: "rent" },
  "rent-villa-house": { category: "villa-house", label: "خانه ویلایی", transaction: "rent" },
  "rent-warehouse": { category: "warehouse", label: "انبار، سوله", transaction: "rent" },
  "sale-apartment": { category: "apartment", label: "آپارتمان", transaction: "sale" },
  "sale-commercial": { category: "commercial-unit", label: "واحد تجاری", transaction: "sale" },
  "sale-factory": { category: "factory-workshop", label: "کارخانه، کارگاه", transaction: "sale" },
  "sale-garden-villa": { category: "garden-villa", label: "باغ، ویلا", transaction: "sale" },
  "sale-hotel": { category: "hotel-apartment", label: "هتل، هتل آپارتمان", transaction: "sale" },
  "sale-land": { category: "land", label: "زمین", transaction: "sale" },
  "sale-office": { category: "office", label: "واحد اداری", transaction: "sale" },
  "sale-villa-house": { category: "villa-house", label: "خانه ویلایی", transaction: "sale" },
  "sale-warehouse": { category: "warehouse", label: "انبار، سوله", transaction: "sale" },
};

function getEditAdId(routeState: ReturnType<typeof getEditAdRouteState>) {
  const params = new URLSearchParams(window.location.search);
  const queryAdId = params.get("adId");
  const stateAdId = routeState.ad?.id ?? routeState.ad?._id ?? routeState.card?.id;

  return queryAdId || (stateAdId === undefined || stateAdId === null ? null : String(stateAdId));
}

function getAdvertisementFeatures(ad: AdvertisementItem | Record<string, unknown> | undefined) {
  if (!ad || !Array.isArray(ad.features)) return [];

  return ad.features.filter(
    (feature): feature is AdvertisementFeature =>
      Boolean(feature) && typeof feature === "object",
  );
}

function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function toPersianDigits(value: string) {
  return value.replace(/[0-9٠-٩]/g, (digit) => {
    const latinDigit = digit >= "0" && digit <= "9"
      ? digit
      : String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));

    return "۰۱۲۳۴۵۶۷۸۹"[Number(latinDigit)] ?? digit;
  });
}

function normalizeLookupText(value: unknown): string {
  return toLatinDigits(String(value ?? "")).trim().toLowerCase();
}

function readText(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of ["name", "title", "label", "value"]) {
      const nestedText: string = readText(record[key]);
      if (nestedText) return nestedText;
    }
  }

  return "";
}

function readNestedText(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    const text = readText(value);

    if (text) return text;
  }

  return "";
}

function readFeatureValue(features: AdvertisementFeature[], labels: string[]): unknown {
  const normalizedLabels = labels.map(normalizeLookupText);
  const feature = features.find((item) => {
    const key = item.label ?? item.key ?? "";

    return normalizedLabels.includes(normalizeLookupText(key));
  });

  return feature?.value;
}

function readFirstValue(ad: AdvertisementItem, features: AdvertisementFeature[], labels: string[], keys: string[] = labels): unknown {
  const featureValue = readFeatureValue(features, labels);

  if (featureValue !== undefined && featureValue !== null && featureValue !== "") return featureValue;

  for (const key of keys) {
    const value = ad[key];

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function readTextValue(ad: AdvertisementItem, features: AdvertisementFeature[], labels: string[], keys: string[] = labels): string {
  return readText(readFirstValue(ad, features, labels, keys));
}

function readArrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => readText(item)).filter(Boolean);
  }

  const text = readText(value);

  return text
    ? text.split(/[،,]/).map((item) => item.trim()).filter(Boolean)
    : [];
}

function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  if (typeof value === "string" && value.trim()) {
    const normalized = normalizeLookupText(value);

    if (["1", "true", "yes", "y", "on", "دارد", "بله", "بلی"].includes(normalized)) return true;
    if (["0", "false", "no", "n", "off", "ندارد", "خیر"].includes(normalized)) return false;
  }

  return null;
}

function numericInputText(value: unknown): string {
  const text = readText(value);

  if (!text) return "";

  const normalized = toLatinDigits(text)
    .replace(/[٬,]/g, "")
    .replace(/\//g, ".");
  const decimalMatch = normalized.match(/\d+(?:\.\d+)?/);

  if (!decimalMatch) return "";

  const amount = Number(decimalMatch[0]);

  if (!Number.isFinite(amount)) return "";
  if (text.includes("میلیارد")) return String(Math.round(amount * 1_000_000_000));
  if (text.includes("میلیون")) return String(Math.round(amount * 1_000_000));

  return String(Math.round(amount));
}

function selectText(value: unknown): string {
  const text = readText(value);

  if (!text) return "";

  const normalized = toLatinDigits(text);

  return /^\d+$/.test(normalized) ? toPersianDigits(normalized) : text;
}

function ageText(value: unknown): string {
  const text = selectText(value);
  const normalized = toLatinDigits(text);

  if (!text) return "";
  if (text.includes("سال") || text.includes("نوساز")) return text;
  if (/^\d+$/.test(normalized)) return `${toPersianDigits(normalized)} سال`;

  return text;
}

function firstText(value: unknown): string {
  const values = readArrayValue(value);

  return values[0] ?? "";
}

function idsFromLabels(items: ChipItem[], value: unknown): string[] {
  const selectedLabels = readArrayValue(value).map(normalizeLookupText);

  if (!selectedLabels.length) return [];

  return items
    .filter((item) => {
      const itemId = normalizeLookupText(item.id);
      const itemLabel = normalizeLookupText(item.label);

      return selectedLabels.some((label) => label === itemId || label === itemLabel);
    })
    .map((item) => item.id);
}

function readContactTypes(ad: AdvertisementItem): string[] {
  const contactTypes = Array.isArray(ad.contact_type) ? ad.contact_type : [];

  return contactTypes.map((item) => normalizeLookupText(item));
}

function readSocialValue(ad: AdvertisementItem, key: "telegram" | "whatsapp"): string {
  for (const sourceKey of ["contacts", "contact_social", "social"]) {
    const source = ad[sourceKey];

    if (source && typeof source === "object") {
      const value = readText((source as Record<string, unknown>)[key]);

      if (value) return value;
    }
  }

  return readText(ad[key]);
}

function readPublisherName(ad: AdvertisementItem, features: AdvertisementFeature[]): string {
  return readTextValue(ad, features, ["publisher", "publisher_name", "agency"], [
    "publisher",
    "publisherName",
    "publisher_name",
    "agency",
    "agency_name",
  ]);
}

function readRegistrantType(ad: AdvertisementItem, features: AdvertisementFeature[]): NewAdFormValues["registrantType"] {
  const ownerType = normalizeLookupText(ad.owner_type);
  const advertiserType = normalizeLookupText(readFeatureValue(features, ["advertiser_type"]));

  if (ownerType.includes("agency") || advertiserType.includes("مشاور") || advertiserType.includes("املاک") || advertiserType.includes("آژانس")) {
    return "agency";
  }

  if (ownerType.includes("owner") || ownerType.includes("personal") || advertiserType.includes("شخصی")) {
    return "personal";
  }

  return "";
}

function mapProjectDetails(value: unknown): NewAdFormValues["projectDetails"] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index): ProjectDetailItem | null => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const meterage = numericInputText(record.meterage ?? record.area ?? record.min_meterage ?? record.minMeterage);

      return {
        floors: readArrayValue(record.floors ?? record.floor),
        id: readText(record.id) || `project-detail-${index}`,
        maxMeterage: numericInputText(record.max_meterage ?? record.maxMeterage),
        meterage,
        minMeterage: numericInputText(record.min_meterage ?? record.minMeterage),
        positions: readArrayValue(record.positions ?? record.position ?? record.unit_position),
        rooms: readArrayValue(record.rooms),
      };
    })
    .filter((item): item is ProjectDetailItem => item !== null);
}

function mapDailyHotelRooms(value: unknown): NewAdFormValues["dailyHotelRooms"] {
  const baseRooms = dailyHotelRoomTypes.map((room) => ({
    id: room.id,
    label: room.label,
    guestCount: "",
    extraGuestCount: "",
    mealPlan: "",
    normalPrice: "",
    weekendPrice: "",
    specialPrice: "",
  }));

  if (!Array.isArray(value)) return baseRooms;

  return baseRooms.map((room) => {
    const apiRoom = value.find((item) => {
      if (!item || typeof item !== "object") return false;

      const record = item as Record<string, unknown>;
      const roomType = normalizeLookupText(record.room_type ?? record.id ?? record.label ?? record.room_label);

      return roomType === normalizeLookupText(room.id) || roomType === normalizeLookupText(room.label);
    });

    if (!apiRoom || typeof apiRoom !== "object") return room;

    const record = apiRoom as Record<string, unknown>;

    return {
      ...room,
      extraGuestCount: selectText(record.extra_guest_count ?? record.extraGuestCount),
      guestCount: selectText(record.guest_count ?? record.guestCount ?? record.capacity),
      mealPlan: readText(record.meal_plan ?? record.mealPlan),
      normalPrice: numericInputText(record.normal_price ?? record.normalPrice ?? record.price),
      specialPrice: numericInputText(record.special_price ?? record.specialPrice),
      weekendPrice: numericInputText(record.weekend_price ?? record.weekendPrice),
    };
  });
}

function readFormCode(ad: AdvertisementItem, features: AdvertisementFeature[]) {
  return normalizeLookupText(readFirstValue(ad, features, ["form_code"], ["form_code", "formCode"]));
}

function getEditRouteParamsFromAd(ad: AdvertisementItem) {
  const features = getAdvertisementFeatures(ad);
  const formCode = readFormCode(ad, features);

  return editRouteParamsByFormCode[formCode] ?? null;
}

function syncEditRouteParams(ad: AdvertisementItem) {
  const routeParams = getEditRouteParamsFromAd(ad);

  if (!routeParams) return false;

  const searchParams = new URLSearchParams(window.location.search);
  let changed = false;

  Object.entries(routeParams).forEach(([key, value]) => {
    if (searchParams.get(key) === value) return;

    searchParams.set(key, value);
    changed = true;
  });

  if (searchParams.get("edit") !== "true") {
    searchParams.set("edit", "true");
    changed = true;
  }

  if (changed) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${searchParams.toString()}`,
    );
  }

  return changed;
}

function syncEditLocationStorage(ad: AdvertisementItem, features: AdvertisementFeature[], values: NewAdFormValues) {
  if (values.location) window.localStorage.setItem(locationKey, values.location);

  const lat = numericInputText(ad.lat ?? ad.latitude);
  const lng = numericInputText(ad.lng ?? ad.long ?? ad.longitude);
  const neighborhoodId = readTextValue(ad, features, ["neighborhood_id"], ["neighborhood_id"]);

  if (lat) window.localStorage.setItem(locationLatKey, lat);
  if (lng) window.localStorage.setItem(locationLngKey, lng);
  if (neighborhoodId) window.localStorage.setItem(neighborhoodIdKey, neighborhoodId);
}


type NewAdValidationResult = {
  errors: NewAdFieldErrors;
  step: FlowStep;
};

function hasRequiredText(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function hasErrors(errors: NewAdFieldErrors) {
  return Object.values(errors).some(Boolean);
}

function getDetailsValidationErrors(values: NewAdFormValues): NewAdFieldErrors {
  const { transaction, category } = getParams();
  const isProject = transaction === "project";
  const isPartnership = isProject && category === "project-partnership";
  const isRent = transaction === "rent";
  const isDailyRent = isRent && category.startsWith("daily-");
  const errors: NewAdFieldErrors = {};

  if (!isProject) {
    getBasicPropertyFields().forEach((field) => {
      if (!field.required) return;
      if (hasRequiredText(values[field.key])) return;

      errors[field.key] = `لطفا ${field.label} را وارد کنید.`;
    });
  }

  if (isPartnership) {
    if (!hasRequiredText(values.builderSharePercent)) {
      errors.builderSharePercent = "لطفا سهم سازنده را وارد کنید.";
    }
  } else if (isProject || isDailyRent) {
    if (!hasRequiredText(values.minPrice)) errors.minPrice = "لطفا حداقل قیمت را وارد کنید.";
    if (!hasRequiredText(values.maxPrice)) errors.maxPrice = "لطفا حداکثر قیمت را وارد کنید.";
  } else if (isRent) {
    if (!hasRequiredText(values.mortgagePrice)) errors.mortgagePrice = "لطفا مبلغ رهن را وارد کنید.";
    if (!hasRequiredText(values.rentPrice)) errors.rentPrice = "لطفا مبلغ اجاره را وارد کنید.";
  } else if (!hasRequiredText(values.price)) {
    errors.price = "لطفا قیمت آگهی را وارد کنید.";
  }

  if (values.loanEnabled && !hasRequiredText(values.loanAmount)) {
    errors.loanAmount = "لطفا مبلغ وام را وارد کنید.";
  }

  if (values.loanEnabled && !hasRequiredText(values.loanInstallment)) {
    errors.loanInstallment = "لطفا قسط وام را وارد کنید.";
  }

  if (values.exchangeEnabled && values.exchangeTargets.length === 0) {
    errors.exchangeTargets = "لطفا مورد معاوضه را انتخاب کنید.";
  }

  if (values.saleTermsEnabled && !hasRequiredText(values.saleTermsPercent)) {
    errors.saleTermsPercent = "لطفا درصد شرایط فروش را وارد کنید.";
  }

  if (values.saleTermsEnabled && !hasRequiredText(values.saleTermsInstallmentMonths)) {
    errors.saleTermsInstallmentMonths = "لطفا تعداد قسط شرایط فروش را وارد کنید.";
  }

  return errors;
}

function getMediaValidationErrors(
  values: NewAdFormValues,
  options: { forceFullEditFields?: boolean } = {},
): NewAdFieldErrors {
  const errors: NewAdFieldErrors = {};
  const shouldRequireContactFields =
    options.forceFullEditFields || values.registrantType !== "agency";

  if (values.photos.length === 0) {
    errors.photos = "لطفا حداقل یک عکس برای آگهی انتخاب کنید.";
  }

  if (values.hasVideo && !values.video) {
    errors.video = "لطفا ویدیوی آگهی را انتخاب کنید.";
  }

  if (values.hasVirtualTour && !hasRequiredText(values.virtualTourLink)) {
    errors.virtualTourLink = "لطفا لینک تور مجازی را وارد کنید.";
  }

  if (shouldRequireContactFields && !values.registrantType) {
    errors.registrantType = "لطفا نوع ثبت کننده آگهی را انتخاب کنید.";
  }

  if (shouldRequireContactFields && !values.chatEnabled && !values.phoneEnabled) {
    errors.contactMethods = "لطفا حداقل یکی از روش‌های ارتباطی چت با کاربران یا شماره تماس را انتخاب کنید.";
  }

  if (shouldRequireContactFields && values.phoneEnabled && !hasRequiredText(values.phoneNumber)) {
    errors.phoneNumber = "لطفا شماره تماس را وارد کنید.";
  }

  if (!hasRequiredText(values.title)) {
    errors.title = "لطفا عنوان آگهی را وارد کنید.";
  }

  if (!hasRequiredText(values.description)) {
    errors.description = "لطفا توضیحات آگهی را وارد کنید.";
  }

  return errors;
}

function validateNewAdDetails(values: NewAdFormValues): NewAdValidationResult | null {
  const errors = getDetailsValidationErrors(values);

  return hasErrors(errors) ? { errors, step: "details" } : null;
}

function validateNewAd(
  values: NewAdFormValues,
  options: { forceFullEditFields?: boolean } = {},
): NewAdValidationResult | null {
  const detailsErrors = getDetailsValidationErrors(values);
  const mediaErrors = getMediaValidationErrors(values, options);

  if (hasErrors(detailsErrors)) {
    return { errors: { ...detailsErrors, ...mediaErrors }, step: "details" };
  }

  return hasErrors(mediaErrors) ? { errors: mediaErrors, step: "media" } : null;
}

function mapAdvertisementToEditValues(ad: AdvertisementItem, base: NewAdFormValues): NewAdFormValues {
  const features = getAdvertisementFeatures(ad);
  const next: NewAdFormValues = {
    ...blankValues,
    ...base,
    dailyHotelRooms: base.dailyHotelRooms.length ? base.dailyHotelRooms : blankValues.dailyHotelRooms,
    photos: [],
    video: null,
  };
  const setText = (key: keyof NewAdFormValues, value: unknown, transform: (value: unknown) => string = readText) => {
    const text = transform(value);

    if (text) {
      (next[key] as string) = text;
    }
  };
  const setBool = (key: keyof NewAdFormValues, value: unknown) => {
    const booleanValue = toBooleanValue(value);

    if (booleanValue !== null) {
      (next[key] as boolean) = booleanValue;
    }
  };
  const contactTypes = readContactTypes(ad);
  const contacts = ad.contacts && typeof ad.contacts === "object" ? (ad.contacts as Record<string, unknown>) : {};

  setText("location", readFirstValue(ad, features, ["location"], ["location", "address", "form_neighborhood_title"]));
  if (!next.location) {
    next.location = readNestedText(ad, ["neighborhood", "neighborhood_name", "district", "district_name", "city", "city_name"]);
  }

  setText("meterage", readFirstValue(ad, features, ["area", "meterage"], ["area", "meterage"]), numericInputText);
  setText("landArea", readFirstValue(ad, features, ["land_area"], ["land_area", "landArea"]), numericInputText);
  setText("buildingArea", readFirstValue(ad, features, ["building_area"], ["building_area", "buildingArea"]), numericInputText);
  setText("floor", readFirstValue(ad, features, ["floor"], ["floor"]), selectText);
  setText("rooms", readFirstValue(ad, features, ["rooms"], ["rooms"]), selectText);
  setText("age", readFirstValue(ad, features, ["building_age"], ["building_age", "age", "year"]), ageText);
  setText("density", readFirstValue(ad, features, ["density"], ["density"]), numericInputText);
  setText("usageType", readFirstValue(ad, features, ["land_use", "usage"], ["land_use", "usageType"]));
  setText("landPosition", readFirstValue(ad, features, ["land_position"], ["land_position", "landPosition"]));
  setText("documentType", readFirstValue(ad, features, ["document_type"], ["document_type", "documentType"]));
  setText("suitableFor", firstText(readFirstValue(ad, features, ["suitable_for"], ["suitable_for", "suitableFor"])));
  setText("hotelStars", readFirstValue(ad, features, ["hotel_stars"], ["hotel_stars", "hotelStars"]), selectText);
  setText("standardCapacity", readFirstValue(ad, features, ["standard_capacity", "capacity"], ["standard_capacity", "capacity"]), selectText);
  setText("extraPeopleCapacity", readFirstValue(ad, features, ["extra_people_capacity"], ["extra_people_capacity", "extraPeopleCapacity"]), selectText);
  setText("commercialLicense", readFirstValue(ad, features, ["commercial_license", "commercial_permit"], ["commercial_license", "commercialLicense"]));
  setText("constructionLicense", readFirstValue(ad, features, ["construction_license", "build_permit"], ["construction_license", "constructionLicense"]));
  setText("participationType", readFirstValue(ad, features, ["participation_type", "partnership_type"], ["participation_type", "partnershipType"]));
  setText("projectTotalFloors", readFirstValue(ad, features, ["project_total_floors"], ["project_total_floors", "projectTotalFloors"]), numericInputText);
  setText("projectTotalUnits", readFirstValue(ad, features, ["project_total_units"], ["project_total_units", "projectTotalUnits"]), numericInputText);
  setText("projectStatus", readFirstValue(ad, features, ["project_status"], ["project_status", "projectStatus"]));
  setText("projectDeliveryDate", readFirstValue(ad, features, ["delivery_date"], ["delivery_date", "projectDeliveryDate"]));
  setText("saleTermsPercent", readFirstValue(ad, features, ["sale_terms_percent"], ["sale_terms_percent", "saleTermsPercent"]), numericInputText);
  setText("saleTermsInstallmentMonths", readFirstValue(ad, features, ["sale_terms_installment_months"], ["sale_terms_installment_months", "saleTermsInstallmentMonths"]), numericInputText);
  setText("builderSharePercent", readFirstValue(ad, features, ["builder_share", "builder_share_percent"], ["builder_share", "builderSharePercent"]), numericInputText);
  setText("totalFloors", readFirstValue(ad, features, ["total_floors"], ["total_floors", "totalFloors"]), selectText);
  setText("unitType", readFirstValue(ad, features, ["unit_type"], ["unit_type", "unitType"]));
  setText("unitPosition", readFirstValue(ad, features, ["unit_position", "unit_direction"], ["unit_position", "unitPosition"]));
  setText("facadeMaterial", readFirstValue(ad, features, ["facade_material"], ["facade_material", "facadeMaterial"]));
  setText("floorMaterial", readFirstValue(ad, features, ["floor_material"], ["floor_material", "floorMaterial"]));
  setText("cabinetMaterial", readFirstValue(ad, features, ["cabinet_material"], ["cabinet_material", "cabinetMaterial"]));
  setText("villaType", readFirstValue(ad, features, ["villa_type", "house_type"], ["villa_type", "villaType"]));
  setText("landWidth", readFirstValue(ad, features, ["land_width"], ["land_width", "landWidth"]), numericInputText);
  setText("streetWidth", readFirstValue(ad, features, ["street_width"], ["street_width", "streetWidth"]), numericInputText);
  setText("ceilingHeight", readFirstValue(ad, features, ["ceiling_height", "height"], ["ceiling_height", "ceilingHeight"]), numericInputText);
  setText("singleRoomCount", readFirstValue(ad, features, ["single_room_count"], ["single_room_count", "singleRoomCount"]), selectText);
  setText("doubleRoomCount", readFirstValue(ad, features, ["double_room_count"], ["double_room_count", "doubleRoomCount"]), selectText);
  setText("suiteCount", readFirstValue(ad, features, ["suite_count"], ["suite_count", "suiteCount"]), selectText);
  setText("price", readFirstValue(ad, features, ["price"], ["price"]), numericInputText);
  setText("mortgagePrice", readFirstValue(ad, features, ["mortgage_price"], ["mortgage_price", "mortgagePrice"]), numericInputText);
  setText("rentPrice", readFirstValue(ad, features, ["rent_price"], ["rent_price", "rentPrice"]), numericInputText);
  setText("minPrice", readFirstValue(ad, features, ["min_price", "daily_price", "meter_price"], ["min_price", "minPrice"]), numericInputText);
  setText("maxPrice", readFirstValue(ad, features, ["max_price"], ["max_price", "maxPrice"]), numericInputText);
  setText("loanAmount", readFirstValue(ad, features, ["loan_amount"], ["loan_amount", "loanAmount"]), numericInputText);
  setText("loanInstallment", readFirstValue(ad, features, ["loan_installment"], ["loan_installment", "loanInstallment"]), numericInputText);
  setText("virtualTourLink", readFirstValue(ad, features, ["virtual_tour_link", "virtual_tour", "tour_3d", "tour3d"], ["virtual_tour_link", "virtualTourLink"]));
  setText("title", readFirstValue(ad, features, ["title"], ["title", "label", "name"]));
  setText("description", readFirstValue(ad, features, ["description"], ["description", "short_description", "body"]));
  setText("publisherName", readPublisherName(ad, features));
  setText("telegram", readSocialValue(ad, "telegram"));
  setText("whatsapp", readSocialValue(ad, "whatsapp"));

  const projectDetails = mapProjectDetails(readFirstValue(ad, features, ["project_details"], ["project_details", "projectDetails"]));
  if (projectDetails.length) next.projectDetails = projectDetails;

  next.dailyHotelRooms = mapDailyHotelRooms(readFirstValue(ad, features, ["daily_hotel_rooms"], ["daily_hotel_rooms", "dailyHotelRooms"]));

  const selectedSpecs = idsFromLabels(propertySpecs, readFirstValue(ad, features, ["extra_specs"], ["extra_specs", "selectedSpecs"]));
  if (selectedSpecs.length) next.selectedSpecs = selectedSpecs;

  const heatingCooling = idsFromLabels(heatingItems, readFirstValue(ad, features, ["heating_cooling"], ["heating_cooling", "heatingCooling"]));
  if (heatingCooling.length) next.heatingCooling = heatingCooling;

  const facilities = idsFromLabels(
    [...facilityItems, ...landFacilityItems],
    readFirstValue(ad, features, ["facilities"], ["facilities"]),
  );
  if (facilities.length) next.facilities = Array.from(new Set(facilities));

  const exchangeWith = readFirstValue(ad, features, ["exchange_with"], ["exchange_with", "exchangeWith"]);
  const exchangeTargets = readArrayValue(exchangeWith);
  if (exchangeTargets.length) {
    next.exchangeEnabled = true;
    next.exchangeTargets = exchangeTargets;
  }

  setBool("renovated", readFirstValue(ad, features, ["renovated", "is_renovated"], ["renovated"]));
  setBool("furnished", readFirstValue(ad, features, ["furnished", "is_furnished"], ["furnished"]));
  setBool("constructionPermit", readFirstValue(ad, features, ["construction_permit", "build_permit"], ["construction_permit", "constructionPermit"]));
  setBool("commercialPermit", readFirstValue(ad, features, ["commercial_permit"], ["commercial_permit", "commercialPermit"]));
  setBool("saleTermsEnabled", readFirstValue(ad, features, ["sale_terms_enabled", "installment_sale"], ["saleTermsEnabled", "installment_sale"]));
  setBool("loanEnabled", readFirstValue(ad, features, ["has_loan"], ["has_loan", "loanEnabled"]));
  setBool("exchangeEnabled", readFirstValue(ad, features, ["has_exchange"], ["has_exchange", "exchangeEnabled"]));
  setBool("hasVideo", readFirstValue(ad, features, ["has_video"], ["has_video"]));
  setBool("hasVirtualTour", readFirstValue(ad, features, ["has_virtual_tour"], ["has_virtual_tour"]));

  if (next.virtualTourLink) next.hasVirtualTour = true;
  if (readText(ad.video ?? ad.video_url ?? ad.video_path)) next.hasVideo = true;

  const registrantType = readRegistrantType(ad, features);
  if (registrantType) next.registrantType = registrantType;
  if (!next.registrantType && next.publisherName) next.registrantType = "agency";

  if (contactTypes.length) {
    next.chatEnabled = contactTypes.includes("chat");
    next.phoneEnabled = contactTypes.includes("phone");
  } else {
    const chatContact = toBooleanValue(contacts.chat);
    next.chatEnabled = chatContact ?? next.chatEnabled;
    const phoneNumber = readText(contacts.phone) || readText(ad.owner_phone);
    next.phoneEnabled = Boolean(phoneNumber || next.phoneEnabled);
    if (phoneNumber) next.phoneNumber = phoneNumber;
  }

  syncEditLocationStorage(ad, features, next);

  return next;
}

export function NewAdFlowPage() {
  const [, setEditRouteVersion] = useState(0);
  const { label } = getParams();
  const editAdState = getEditAdRouteState();
  const isEditMode = editAdState.isEditMode === true;
  const editAdId = getEditAdId(editAdState);
  const editDataAppliedRef = useRef<string | null>(null);
  const [step, setStep] = useState<FlowStep>("details");
  const [fieldErrors, setFieldErrors] = useState<NewAdFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const methods = useForm<NewAdFormValues>({ defaultValues: getDefaultValues(editAdState), mode: "onChange" });
  const createAdvertisement = useCreateAdvertisementMutation();
  const editAdQuery = useAdvertisementDetailQuery(isEditMode ? editAdId : null);

  useRequireAuth();

  useEffect(() => {
    if (!isEditMode) return undefined;
    if (!editAdQuery.data || !editAdId) return undefined;
    if (editDataAppliedRef.current === editAdId) return undefined;

    const routeChanged = syncEditRouteParams(editAdQuery.data);
    const editDefaults = getDefaultValues({
      ...editAdState,
      ad: editAdQuery.data,
      isEditMode: true,
    });

    methods.reset(mapAdvertisementToEditValues(editAdQuery.data, editDefaults));
    editDataAppliedRef.current = editAdId;

    if (routeChanged) {
      setEditRouteVersion((version) => version + 1);
    }

    return undefined;
  }, [editAdId, editAdQuery.data, isEditMode, methods]);

  useEffect(() => {
    if (!isEditMode || !editAdQuery.isError) return;

    setSubmitError(getApiErrorMessage(editAdQuery.error, "دریافت اطلاعات آگهی برای ویرایش با خطا مواجه شد."));
  }, [editAdQuery.error, editAdQuery.isError, isEditMode]);

  useEffect(() => {
    if (isEditMode) return undefined;

    const subscription = methods.watch((values) => {
      const safeDraft = {
        ...values,
        hasVideo: false,
        photos: [],
        video: null,
      };

      window.localStorage.setItem(draftKey, JSON.stringify(safeDraft));
    });

    return () => subscription.unsubscribe();
  }, [isEditMode, methods]);


  const clearFieldError = (key: NewAdFieldErrorKey) => {
    setFieldErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    const clearOnExit = () => {
      if (window.location.pathname.startsWith("/new-ad")) return;

      clearNewAdDraftStorage();
    };
    const clearOnPageHide = () => clearNewAdDraftStorage();

    window.addEventListener("popstate", clearOnExit);
    window.addEventListener("pagehide", clearOnPageHide);

    return () => {
      window.removeEventListener("popstate", clearOnExit);
      window.removeEventListener("pagehide", clearOnPageHide);
    };
  }, []);

  const submit = methods.handleSubmit((values) => {
    if (createAdvertisement.isPending) return;

    const validation = validateNewAd(values, { forceFullEditFields: isEditMode });

    if (validation) {
      setFieldErrors(validation.errors);
      setSubmitError("");
      setStep(validation.step);
      return;
    }

    if (isEditMode) {
      const updatedCard = {
        ...(editAdState.card ?? editAdState.ad ?? {}),
        title: values.title || editAdState.card?.title || "آگهی ملک",
        agency: values.publisherName || editAdState.card?.agency || "",
        area: values.meterage ? `${values.meterage} متر` : editAdState.card?.area,
        rooms: values.rooms ? `${values.rooms} اتاق` : editAdState.card?.rooms,
        year: values.age || editAdState.card?.year,
      };

      clearNewAdDraftStorage();
      navigateTo(editAdState.editReturnTo ?? adManagementPaths.published, {
        ad: updatedCard,
        card: updatedCard,
        isEditMode: true,
        returnTo: editAdState.returnTo,
        tab: editAdState.tab,
      });
      return;
    }

    const formData = buildNewAdFormData(values);

    setFieldErrors({});
    setSubmitError("");
    createAdvertisement.mutate(formData, {
      onError: (error) => {
        setSubmitError(getApiErrorMessage(error, "ثبت آگهی با خطا مواجه شد."));
      },
      onSuccess: (createdAd) => {
        const createdAdId = createdAd.id ?? createdAd._id;

        if (createdAdId === undefined || createdAdId === null || String(createdAdId).trim() === "") {
          setSubmitError("شناسه آگهی ثبت‌شده از سرور دریافت نشد.");
          return;
        }

        const ad = mapAdvertisementToAdCard(createdAd, 0);

        clearNewAdDraftStorage();
        navigateTo(getAdPaymentPath(createdAdId), {
          ad,
          paymentFlow: "new-ad",
          tab: "status",
        });
      },
    });
  });

  const goToDetails = () => setStep("details");
  const goToMedia = () => {
    const validation = validateNewAdDetails(methods.getValues());

    if (validation) {
      setFieldErrors(validation.errors);
      setSubmitError("");
      return;
    }

    setFieldErrors({});
    setSubmitError("");
    setStep("media");
  };
  const headerTitle =
    step === "moreFeatures"
      ? "ویژگی‌های بیشتر"
      : step === "projectDetails"
        ? "جزئیات پروژه"
        : isEditMode
          ? "ویرایش آگهی"
          : "ثبت آگهی";

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <FormProvider {...methods}>
        <Header
          title={headerTitle}
          onBack={step === "moreFeatures" || step === "projectDetails" ? goToDetails : undefined}
        />

        {submitError ? (
          <Snackbar
            message={submitError}
            onDismiss={() => setSubmitError("")}
            title="خطا"
          />
        ) : null}

        {step === "details" ? (
          <DetailsStep
            errors={fieldErrors}
            label={label}
            onClearError={clearFieldError}
            onMoreFeatures={() => setStep("moreFeatures")}
            onProjectDetails={() => setStep("projectDetails")}
            onNext={goToMedia}
          />
        ) : step === "moreFeatures" ? (
          <MoreFeaturesStep
            onCancel={goToDetails}
            onConfirm={goToDetails}
          />
        ) : step === "projectDetails" ? (
          <ProjectDetailsStep
            onBack={goToDetails}
          />
        ) : (
          <MediaStep
            errors={fieldErrors}
            forceFullEditFields={isEditMode}
            label={label}
            onBack={goToDetails}
            onClearError={clearFieldError}
            onSubmit={submit}
            submitDisabled={createAdvertisement.isPending || (isEditMode && editAdQuery.isLoading)}
          />
        )}
      </FormProvider>
    </PageFrame>
  );
}
