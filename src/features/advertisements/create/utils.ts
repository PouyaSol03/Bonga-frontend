import { useEffect } from "react";

import { getStoredAuthSession, storeLoginRedirectPath } from "../../../shared/auth/auth-storage";
import {
  basicPropertyFieldsByListingType,
  blankValues,
  defaultBasicPropertyFields,
  draftKey,
  facilityItems,
  heatingItems,
  landFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleLandFacilityItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentVillaHouseFacilityItems,
  rentOfficeFacilityItems,
  rentHotelFacilityItems,
  rentHeatingItems,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyHotelFacilityItems,
  dailyWorkspaceFacilityItems,
  projectFacilityItems,
  projectHeatingItems,
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
    age: values.age,
    buildingArea: values.buildingArea,
    floor: values.floor,
    rooms: values.rooms,
    totalFloors: values.totalFloors,
    unitsPerFloor: normalizeUnitsPerFloorValue(values.unitsPerFloor),
    unitType: values.unitType,
    unitPosition: values.unitPosition,
    documentType: values.documentType,
    usageType: values.usageType,
    suitableFor: values.suitableFor,
    occupancyStatus: values.occupancyStatus,
    kitchenType: values.kitchenType,
    petPolicy: values.petPolicy,
    readyDeliveryDate: values.readyDeliveryDate,
    projectDeliveryDate: values.projectDeliveryDate,
    projectStatus: values.projectStatus,
    minContractMonths: values.minContractMonths,
    rentalPeriod: values.rentalPeriod,
    viewType: values.viewType,
    checkInTime: values.checkInTime,
    checkOutTime: values.checkOutTime,
    minStayDays: values.minStayDays,
    evacuationGuarantee: values.evacuationGuarantee,
    extraPeopleCapacity: values.extraPeopleCapacity,
    renovated: values.renovated,
    furnished: values.furnished,
    facadeMaterial: values.facadeMaterial,
    floorMaterial: values.floorMaterial,
    cabinetMaterial: values.cabinetMaterial,
    landPosition: values.landPosition,
    buildingType: values.buildingType,
    villaType: values.villaType,
    commercialPosition: values.commercialPosition,
    ownershipStatus: values.ownershipStatus,
    currentStatus: values.currentStatus,
    industrialPropertyType: values.industrialPropertyType,
    accessType: values.accessType,
    officePosition: values.officePosition,
    officeDocumentType: values.officeDocumentType,
    hasDocument: values.hasDocument,
    managementRoom: values.managementRoom,
    conferenceRoom: values.conferenceRoom,
    receptionHall: values.receptionHall,
    signboard: values.signboard,
    kitchen: values.kitchen,
    separateEntrance: values.separateEntrance,
    density: values.density,
    landWidth: values.landWidth,
    streetWidth: values.streetWidth,
    constructionPermit: values.constructionPermit,
    commercialPermit: values.commercialPermit,
    commercialLicense: values.commercialLicense,
    ceilingHeight: values.ceilingHeight,
    openingCount: values.openingCount,
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

function normalizeDraftStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[،,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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
  const draftValues = editDefaults ? null : getDraft();
  const baseValues = editDefaults
    ? {
        ...blankValues,
        ...editDefaults,
      }
    : {
        ...blankValues,
        ...draftValues,
        suitableFor: normalizeDraftStringArray(draftValues?.suitableFor),
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

function normalizeDigits(value: unknown) {
  return String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function parseUnitsPerFloor(value: unknown) {
  const match = normalizeDigits(String(value ?? "")).match(/\d+/);

  if (!match) return null;

  const number = Number(match[0]);

  return Number.isInteger(number) && number >= 1 && number <= 8 ? number : null;
}

export function normalizeUnitsPerFloorValue(value: unknown) {
  const number = parseUnitsPerFloor(value);

  return number === null ? "" : new Intl.NumberFormat("fa-IR").format(number);
}

export function formatUnitsPerFloorLabel(value: unknown) {
  const normalized = normalizeUnitsPerFloorValue(value);
  const labelsByValue: Record<string, string> = {
    "۱": "تک واحدی",
    "۲": "دو واحدی",
    "۳": "سه واحدی",
    "۴": "چهار واحدی",
    "۵": "پنج واحدی",
    "۶": "شش واحدی",
    "۷": "هفت واحدی",
    "۸": "هشت واحد بیشتر",
  };

  return normalized ? labelsByValue[normalized] ?? `${normalized} واحد` : "";
}

export function normalizeNumberInput(value: unknown) {
  return normalizeDigits(value).replace(/[^\d,]/g, "");
}

function toNumber(value: unknown) {
  const normalized = normalizeDigits(value).replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) && normalized ? number : null;
}

function toUnitsPerFloorNumber(value: string) {
  return parseUnitsPerFloor(value);
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

function getHeatingItemsForListing(transaction: string, category: string) {
  if (transaction === "project" && category === "project-presale") return projectHeatingItems;
  if (transaction === "sale" && category === "apartment") return saleApartmentHeatingItems;
  if (transaction === "sale" && category === "villa-house") return saleVillaHouseHeatingItems;
  if (transaction === "sale" && category === "office") return saleOfficeHeatingItems;
  if (transaction === "sale" && category === "commercial-unit") return saleCommercialHeatingItems;
  if (transaction === "sale" && category === "factory-workshop") return saleFactoryHeatingItems;
  if (transaction === "sale" && category === "hotel-apartment") return saleHotelHeatingItems;
  if (transaction === "rent" && category.startsWith("daily-")) return dailyRentHeatingItems;
  if (transaction === "rent" && ["apartment", "villa-house", "office", "commercial-unit", "factory-workshop", "hotel-apartment"].includes(category)) return rentHeatingItems;

  return heatingItems;
}

function getFacilityItemsForListing(transaction: string, category: string) {
  if (transaction === "project" && category === "project-presale") return projectFacilityItems;
  if (transaction === "sale" && category === "apartment") return saleApartmentFacilityItems;
  if (transaction === "sale" && category === "villa-house") return saleVillaHouseFacilityItems;
  if (transaction === "sale" && category === "land") return saleLandFacilityItems;
  if (transaction === "sale" && category === "office") return saleOfficeFacilityItems;
  if (transaction === "sale" && category === "commercial-unit") return saleCommercialFacilityItems;
  if (transaction === "sale" && category === "factory-workshop") return saleFactoryFacilityItems;
  if (transaction === "sale" && category === "hotel-apartment") return saleHotelFacilityItems;
  if (transaction === "rent" && category === "apartment") return rentApartmentFacilityItems;
  if (transaction === "rent" && category === "villa-house") return rentVillaHouseFacilityItems;
  if (transaction === "rent" && category === "office") return rentOfficeFacilityItems;
  if (transaction === "rent" && category === "commercial-unit") return rentCommercialFacilityItems;
  if (transaction === "rent" && category === "factory-workshop") return rentFactoryFacilityItems;
  if (transaction === "rent" && category === "hotel-apartment") return rentHotelFacilityItems;
  if (transaction === "rent" && ["daily-apartment-suite", "daily-garden-villa"].includes(category)) return dailyStayFacilityItems;
  if (transaction === "rent" && category === "daily-hotel-apartment") return dailyHotelFacilityItems;
  if (transaction === "rent" && category === "daily-workspace") return dailyWorkspaceFacilityItems;

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
  const hideHeatingCooling = isPartnership || params.category === "land";
  const heatingItemsForListing = getHeatingItemsForListing(params.transaction, params.category);
  const featureItemsForCategory = getFacilityItemsForListing(params.transaction, params.category);
  const features: NewAdFeature[] = [];
  const heatingCooling = hideHeatingCooling ? [] : labels(heatingItemsForListing, values.heatingCooling);
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
  addFeature(
    features,
    "density",
    isSale && params.category === "land" ? values.density : toNumber(values.density),
  );
  addFeature(features, "land_use", values.usageType);
  addFeature(features, "land_position", values.landPosition);
  addFeature(features, "suitable_for", values.suitableFor);
  addFeature(features, "hotel_stars", values.hotelStars);
  addFeature(features, "accommodation_type", values.accommodationType);
  addFeature(features, "standard_capacity", values.standardCapacity);
  addFeature(features, "extra_people_capacity", values.extraPeopleCapacity);
  addFeature(features, "space_type", values.spaceType);
  addFeature(features, "rental_period", values.rentalPeriod);
  addFeature(features, "view_type", values.viewType);
  addFeature(features, "check_in_time", values.checkInTime);
  addFeature(features, "check_out_time", values.checkOutTime);
  addFeature(features, "min_stay_days", toNumber(values.minStayDays));
  addFeature(features, "evacuation_guarantee", toNumber(values.evacuationGuarantee));
  addFeature(features, "commercial_permit", values.commercialLicense || (values.commercialPermit ? "دارد" : ""));
  addFeature(features, "build_permit", values.constructionLicense ? values.constructionLicense === "دارد" : values.constructionPermit);
  addFeature(features, "builder_company_name", values.builderCompanyName);
  addFeature(features, "project_type", values.projectType);

  if (!isRent) {
    addFeature(features, "document_type", values.documentType);
  }

  addFeature(features, "total_floors", toNumber(pickFirstNumber(values.totalFloors)));
  if (params.category === "apartment" && (params.transaction === "sale" || params.transaction === "rent")) {
    addFeature(features, "unit_per_floor", toUnitsPerFloorNumber(values.unitsPerFloor));
  }
  addFeature(features, "unit_type", values.unitType);
  addFeature(features, "unit_direction", values.unitPosition);
  addFeature(features, "occupancy_status", values.occupancyStatus);
  addFeature(features, "kitchen_type", values.kitchenType);
  addFeature(features, "pet_policy", values.petPolicy);
  addFeature(features, "ready_delivery_date", values.readyDeliveryDate);
  addFeature(features, "min_contract_months", toNumber(values.minContractMonths));
  addFeature(features, "renovated", values.renovated);
  addFeature(features, "furnished", values.furnished);
  addFeature(features, "facade_material", values.facadeMaterial);
  addFeature(features, "floor_material", values.floorMaterial);
  addFeature(features, "cabinet_material", values.cabinetMaterial);
  addFeature(features, "building_type", values.buildingType);
  addFeature(features, "villa_type", values.villaType);
  addFeature(features, "commercial_position", values.commercialPosition);
  addFeature(features, "ownership_status", values.ownershipStatus);
  addFeature(features, "current_status", values.currentStatus);
  addFeature(features, "industrial_property_type", values.industrialPropertyType);
  addFeature(features, "access_type", values.accessType);
  addFeature(features, "office_position", values.officePosition);
  addFeature(features, "office_document_type", values.officeDocumentType);
  addFeature(features, "has_document", values.hasDocument || Boolean(values.documentType || values.officeDocumentType));
  addFeature(features, "management_room", values.managementRoom);
  addFeature(features, "conference_room", values.conferenceRoom);
  addFeature(features, "reception_hall", values.receptionHall);
  addFeature(features, "signboard", values.signboard);
  addFeature(features, "kitchen", values.kitchen);
  addFeature(features, "separate_entrance", values.separateEntrance);
  addFeature(features, "land_width", toNumber(values.landWidth));
  addFeature(features, "street_width", toNumber(values.streetWidth));
  addFeature(features, "ceiling_height", toNumber(values.ceilingHeight));
  addFeature(features, "opening_count", toNumber(values.openingCount));
  addFeature(
    features,
    "elevator_count",
    values.facilities.includes("elevator") ? toNumber(values.elevatorCount) : null,
  );
  addFeature(
    features,
    "parking_count",
    values.facilities.includes("parking") ? toNumber(values.parkingCount) : null,
  );
  addFeature(
    features,
    "terrace_count",
    values.facilities.includes("terrace") ? toNumber(values.terraceCount) : null,
  );
  addFeature(features, "images_belong_to_ad", values.images_belong_to_ad);
  addFeature(features, "single_room_count", toNumber(pickFirstNumber(values.singleRoomCount)));
  addFeature(features, "double_room_count", toNumber(pickFirstNumber(values.doubleRoomCount)));
  addFeature(features, "suite_count", toNumber(pickFirstNumber(values.suiteCount)));

  if (params.category === "daily-hotel-apartment") {
    addFeature(features, "daily_hotel_rooms", buildDailyHotelRoomFeatures(values));
  }

  addFeature(features, "extra_specs", extraSpecs);
  addFeature(features, "heating_cooling", heatingCooling);
  addFeature(features, "facilities", facilities);

  if (isDailyRent) {
    addFeature(features, "min_price", toNumber(values.minPrice));
    addFeature(features, "max_price", toNumber(values.maxPrice));
    if (params.category === "daily-hotel-apartment") {
      addFeature(features, "min_meter_price", toNumber(values.minPrice));
      addFeature(features, "max_meter_price", toNumber(values.maxPrice));
    } else {
      addFeature(features, "normal_daily_price", toNumber(values.normalDailyPrice));
      addFeature(features, "weekend_daily_price", toNumber(values.weekendDailyPrice));
      addFeature(features, "special_daily_price", toNumber(values.specialDailyPrice));
      addFeature(features, "extra_person_price", toNumber(values.extraPersonPrice));
    }
  } else if (isRent) {
    addFeature(features, "mortgage_price", toNumber(values.mortgagePrice));
    addFeature(features, "rent_price", toNumber(values.rentPrice));
    addFeature(features, "rent_conversion_policy", values.rentConversionPolicy);
  } else if (isProject) {
    if (!isPartnership) {
      addFeature(features, "min_price", toNumber(values.minPrice));
      addFeature(features, "max_price", toNumber(values.maxPrice));
      addFeature(features, "min_meter_price", toNumber(values.minPrice));
      addFeature(features, "max_meter_price", toNumber(values.maxPrice));
    }
  } else {
    addFeature(features, "price", toNumber(values.price));
  }

  addFeature(features, "loan_amount", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanAmount) : null);
  addFeature(features, "loan_installment", isSale && !isSaleGardenVilla && values.loanEnabled ? toNumber(values.loanInstallment) : null);
  const exchangeAllowed = isSale || (isProject && !isPartnership);
  addFeature(features, "has_exchange", exchangeAllowed && values.exchangeEnabled);
  addFeature(features, "exchange_with", exchangeAllowed && values.exchangeEnabled ? values.exchangeTargets : []);

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
  const heatingCooling = labels(
    getHeatingItemsForListing(params.transaction, params.category),
    values.heatingCooling,
  );
  const facilities = labels(
    getFacilityItemsForListing(params.transaction, params.category),
    values.facilities,
  );
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

  const appendDynamicAliasValue = (keys: string[], value: unknown) => {
    const matchingKey = keys.find((key) => dynamicFieldKeys.has(key));

    if (!matchingKey) return;
    appendDynamicValue(matchingKey, value);
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
  appendDynamicAliasValue(["rent_conversion_policy", "rent_convertibility", "conversion_policy"], values.rentConversionPolicy);
  // Updated daily forms use min/max. Keep daily_price only when the server form still exposes it.
  appendDynamicValue("daily_price", toNumber(values.minPrice));
  appendDynamicValue("meter_price", toNumber(values.minPrice));
  appendDynamicValue("min_price", toNumber(values.minPrice));
  appendDynamicValue("max_price", toNumber(values.maxPrice));
  appendDynamicValue("min_meter_price", toNumber(values.minPrice));
  appendDynamicValue("max_meter_price", toNumber(values.maxPrice));
  appendDynamicValue("normal_daily_price", toNumber(values.normalDailyPrice));
  appendDynamicValue("weekend_daily_price", toNumber(values.weekendDailyPrice));
  appendDynamicValue("special_daily_price", toNumber(values.specialDailyPrice));
  appendDynamicValue("extra_person_price", toNumber(values.extraPersonPrice));
  appendDynamicAliasValue(["builder_company_name", "builder_name", "developer_name"], values.builderCompanyName);
  appendDynamicValue("project_type", values.projectType);
  appendDynamicValue("project_total_floors", toNumber(values.projectTotalFloors));
  appendDynamicValue("project_total_units", toNumber(values.projectTotalUnits));
  appendDynamicValue("delivery_date", values.projectDeliveryDate);
  appendDynamicValue("building_age", values.age);
  appendDynamicValue("rooms", values.rooms);
  appendDynamicValue("floor", values.floor);
  appendDynamicValue("hotel_stars", values.hotelStars);
  appendDynamicValue("accommodation_type", values.accommodationType);
  appendDynamicValue("space_type", values.spaceType);
  appendDynamicValue("capacity", toNumber(pickFirstNumber(values.standardCapacity)));
  appendDynamicValue("extra_people_capacity", toNumber(pickFirstNumber(values.extraPeopleCapacity)));
  appendDynamicValue("rental_period", values.rentalPeriod);
  appendDynamicValue("view_type", values.viewType);
  appendDynamicValue("check_in_time", values.checkInTime);
  appendDynamicValue("check_out_time", values.checkOutTime);
  appendDynamicValue("min_stay_days", toNumber(values.minStayDays));
  appendDynamicValue("evacuation_guarantee", toNumber(values.evacuationGuarantee));
  appendDynamicValue("renovated", values.renovated);
  appendDynamicValue("furnished", values.furnished);
  appendDynamicValue("loan_amount", values.loanEnabled ? toNumber(values.loanAmount) : null);
  appendDynamicValue("loan_installment", values.loanEnabled ? toNumber(values.loanInstallment) : null);
  appendDynamicValue("has_document", values.hasDocument || Boolean(values.documentType || values.officeDocumentType));
  appendDynamicValue("document_type", values.documentType);
  appendDynamicValue("total_floors", toNumber(pickFirstNumber(values.totalFloors)));
  if (params.category === "apartment" && (params.transaction === "sale" || params.transaction === "rent")) {
    appendDynamicAliasValue(
      ["units_per_floor", "unit_per_floor"],
      toUnitsPerFloorNumber(values.unitsPerFloor),
    );
  }
  appendDynamicValue("unit_type", values.unitType);
  appendDynamicValue("unit_position", values.unitPosition);
  appendDynamicAliasValue(["occupancy_status", "residency_status", "occupancy"], values.occupancyStatus);
  appendDynamicAliasValue(["kitchen_type", "kitchen_style"], values.kitchenType);
  appendDynamicAliasValue(["pet_policy", "pets_allowed", "pet_status"], values.petPolicy);
  appendDynamicAliasValue(["ready_delivery_date", "delivery_ready_date", "available_from"], values.readyDeliveryDate);
  appendDynamicAliasValue(["min_contract_months", "minimum_contract_months", "contract_months"], toNumber(values.minContractMonths));
  appendDynamicValue(
    "density",
    params.transaction === "sale" && params.category === "land"
      ? values.density
      : toNumber(values.density),
  );
  appendDynamicValue("land_position", values.landPosition);
  appendDynamicAliasValue(["building_type", "house_building_type"], values.buildingType);
  appendDynamicValue("house_type", values.villaType);
  appendDynamicValue("villa_type", values.villaType);
  appendDynamicValue("commercial_position", values.commercialPosition);
  appendDynamicValue("ownership_status", values.ownershipStatus);
  appendDynamicValue("current_status", values.currentStatus);
  appendDynamicValue("industrial_property_type", values.industrialPropertyType);
  appendDynamicValue("access_type", values.accessType);
  appendDynamicValue("office_position", values.officePosition);
  appendDynamicValue("office_document_type", values.officeDocumentType);
  appendDynamicValue("management_room", values.managementRoom);
  appendDynamicValue("conference_room", values.conferenceRoom);
  appendDynamicValue("reception_hall", values.receptionHall);
  appendDynamicValue("signboard", values.signboard);
  appendDynamicValue("kitchen", values.kitchen);
  appendDynamicValue("separate_entrance", values.separateEntrance);
  appendDynamicValue("height", toNumber(values.ceilingHeight));
  appendDynamicAliasValue(["opening_count", "frontage_count", "openings"], toNumber(values.openingCount));
  appendDynamicValue(
    "elevator_count",
    values.facilities.includes("elevator") ? toNumber(values.elevatorCount) : null,
  );
  appendDynamicValue(
    "parking_count",
    values.facilities.includes("parking") ? toNumber(values.parkingCount) : null,
  );
  appendDynamicValue(
    "terrace_count",
    values.facilities.includes("terrace") ? toNumber(values.terraceCount) : null,
  );
  appendBaseValue("images_belong_to_ad", values.images_belong_to_ad);
  appendDynamicValue("images_belong_to_ad", values.images_belong_to_ad);
  appendDynamicValue("facade_material", values.facadeMaterial);
  appendDynamicValue("floor_material", values.floorMaterial);
  appendDynamicValue("cabinet_material", values.cabinetMaterial);
  appendDynamicValue("land_width", toNumber(values.landWidth));
  appendDynamicValue("street_width", toNumber(values.streetWidth));
  appendDynamicValue("single_room_count", toNumber(pickFirstNumber(values.singleRoomCount)));
  appendDynamicValue("double_room_count", toNumber(pickFirstNumber(values.doubleRoomCount)));
  appendDynamicValue("suite_count", toNumber(pickFirstNumber(values.suiteCount)));
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

  appendDynamicArray("land_use", values.usageType);
  appendDynamicArray("suitable_for", values.suitableFor);
  appendDynamicArray("heating_cooling", heatingCooling);
  appendDynamicArray("facilities", facilities);
  appendDynamicValue("has_exchange", values.exchangeEnabled);
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
