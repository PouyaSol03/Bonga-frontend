import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { getApiErrorMessage } from "../../core/api/api";
import { useAdvertisementDetailQuery } from "../../core/hooks/advertisement.hooks";
import type { AdvertisementItem } from "../../core/services/advertisement.service";
import {
  blankValues,
  dailyHotelRoomTypes,
  facilityItems,
  heatingItems,
  landFacilityItems,
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  propertySpecs,
} from "./data";
import type { ChipItem, NewAdFormValues } from "./types";
import { getDefaultValues, type EditAdRouteState } from "./utils";

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

type UseEditAdPrefillArgs = {
  editAdState: EditAdRouteState;
  isEditMode: boolean;
  methods: UseFormReturn<NewAdFormValues>;
  onError: (message: string) => void;
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

export function getEditAdId(routeState: EditAdRouteState) {
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

function normalizeLookupText(value: unknown) {
  return toLatinDigits(String(value ?? "")).trim().toLowerCase();
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of ["name", "title", "label", "value"]) {
      const nestedText = readText(record[key]);
      if (nestedText) return nestedText;
    }
  }

  return "";
}

function readNestedText(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    const text = readText(value);

    if (text) return text;
  }

  return "";
}

function readFeatureValue(features: AdvertisementFeature[], labels: string[]) {
  const normalizedLabels = labels.map(normalizeLookupText);
  const feature = features.find((item) => {
    const key = item.label ?? item.key ?? "";

    return normalizedLabels.includes(normalizeLookupText(key));
  });

  return feature?.value;
}

function readFirstValue(ad: AdvertisementItem, features: AdvertisementFeature[], labels: string[], keys: string[] = labels) {
  const featureValue = readFeatureValue(features, labels);

  if (featureValue !== undefined && featureValue !== null && featureValue !== "") return featureValue;

  for (const key of keys) {
    const value = ad[key];

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function readTextValue(ad: AdvertisementItem, features: AdvertisementFeature[], labels: string[], keys: string[] = labels) {
  return readText(readFirstValue(ad, features, labels, keys));
}

function readArrayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => readText(item)).filter(Boolean);
  }

  const text = readText(value);

  return text
    ? text.split(/[،,]/).map((item) => item.trim()).filter(Boolean)
    : [];
}

function toBooleanValue(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  if (typeof value === "string" && value.trim()) {
    const normalized = normalizeLookupText(value);

    if (["1", "true", "yes", "y", "on", "دارد", "بله", "بلی"].includes(normalized)) return true;
    if (["0", "false", "no", "n", "off", "ندارد", "خیر"].includes(normalized)) return false;
  }

  return null;
}

function numericInputText(value: unknown) {
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

function selectText(value: unknown) {
  const text = readText(value);

  if (!text) return "";

  const normalized = toLatinDigits(text);

  return /^\d+$/.test(normalized) ? toPersianDigits(normalized) : text;
}

function ageText(value: unknown) {
  const text = selectText(value);
  const normalized = toLatinDigits(text);

  if (!text) return "";
  if (text.includes("سال") || text.includes("نوساز")) return text;
  if (/^\d+$/.test(normalized)) return `${toPersianDigits(normalized)} سال`;

  return text;
}

function firstText(value: unknown) {
  const values = readArrayValue(value);

  return values[0] ?? "";
}

function idsFromLabels(items: ChipItem[], value: unknown) {
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

function readContactTypes(ad: AdvertisementItem) {
  const contactTypes = Array.isArray(ad.contact_type) ? ad.contact_type : [];

  return contactTypes.map((item) => normalizeLookupText(item));
}

function readSocialValue(ad: AdvertisementItem, key: "telegram" | "whatsapp") {
  for (const sourceKey of ["contacts", "contact_social", "social"]) {
    const source = ad[sourceKey];

    if (source && typeof source === "object") {
      const value = readText((source as Record<string, unknown>)[key]);

      if (value) return value;
    }
  }

  return readText(ad[key]);
}

function readPublisherName(ad: AdvertisementItem, features: AdvertisementFeature[]) {
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
    .map((item, index): NewAdFormValues["projectDetails"][number] | null => {
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
    .filter((item): item is NewAdFormValues["projectDetails"][number] => Boolean(item));
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

export function mapAdvertisementToEditValues(ad: AdvertisementItem, base: NewAdFormValues): NewAdFormValues {
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
  setText("unitsPerFloor", readFirstValue(ad, features, ["units_per_floor"], ["units_per_floor", "unitsPerFloor"]), selectText);
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
  setText("agencyId", readTextValue(ad, features, ["agency_id", "agencyId"], ["agency_id", "agencyId"]));
  setText("ownerFullName", readTextValue(ad, features, ["owner_name", "advertiser_name"], ["owner_name", "advertiser_name"]));
  setText("ownerExactAddress", readTextValue(ad, features, ["owner_address", "contact_address"], ["owner_address", "contact_address"]));
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

export function useEditAdPrefill({ editAdState, isEditMode, methods, onError }: UseEditAdPrefillArgs) {
  const [, setRouteVersion] = useState(0);
  const editAdId = getEditAdId(editAdState);
  const editDataAppliedRef = useRef<string | null>(null);
  const editAdQuery = useAdvertisementDetailQuery(isEditMode ? editAdId : null);

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
      setRouteVersion((version) => version + 1);
    }

    return undefined;
  }, [editAdId, editAdQuery.data, editAdState, isEditMode, methods]);

  useEffect(() => {
    if (!isEditMode || !editAdQuery.isError) return;

    onError(getApiErrorMessage(editAdQuery.error, "دریافت اطلاعات آگهی برای ویرایش با خطا مواجه شد."));
  }, [editAdQuery.error, editAdQuery.isError, isEditMode, onError]);

  return {
    editAdId,
    editAdQuery,
  };
}
