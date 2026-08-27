import { useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import {
  FormChoiceChip,
  FormSegmentedControl,
  FormTextField,
} from "../../shared/form/FormControls";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { Button } from "../../shared/ui/Button";
import { TextField } from "../../shared/ui/TextField";
import { Chip } from "../../shared/ui/Chip";
import { ChoiceIndicator } from "../../shared/ui/Choice";
import { TopBar } from "../../shared/components/TopBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { FeatureIcon } from "../advertisements/components/FeatureIcon";
import { useNeighborhoodListQuery } from "../locations/api/neighborhood.hooks";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { formatBigNumber, formatPrice } from "../../shared/lib/MoneyHandler";
import type { NeighborhoodDto } from "../locations/api/neighborhood.service";
import {
  basicPropertyFieldsByListingType,
  defaultBasicPropertyFields,
  facilityItems,
  heatingItems,
  landFacilityItems,
  saleApartmentFacilityItems,
  saleApartmentHeatingItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
  saleLandFacilityItems,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
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
  rentConversionPolicyOptions,
  roomOptions,
  exchangeTargets,
  moreFeatureFieldsByCategory,
  moreFeatureFieldsByListingType,
  moreFeatureOptions,
  participationTypeOptions,
  projectFloorOptions,
  projectPositionOptions,
  projectRoomOptions,
  projectStatusOptions,
  projectTypeOptions,
  partnershipCurrentStatusOptions,
  projectHeatingItems,
  projectFacilityItems,
  saleLandPositionOptions,
} from "../advertisements/create/data";
import type { BasicPropertyField, ChipItem, MoreFeatureField } from "../advertisements/create/types";
import { JalaliDatePickerSheet } from "../advertisements/create/steps/project/JalaliDatePickerSheet";
import { Typography } from "../../shared/ui/Typography";
import LinearAgreement from "../../shared/icons/LinearAgreement";
import LinearApartmentAge from "../../shared/icons/LinearApartmentAge";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearArrowLeftRight from "../../shared/icons/LinearArrowLeftRight";
import LinearBed from "../../shared/icons/LinearBed";
import LinearBuilding from "../../shared/icons/LinearBuilding";
import LinearCancelCircle from "../../shared/icons/LinearCancelCircle";
import LinearCategory from "../../shared/icons/LinearCategory";
import LinearFloor from "../../shared/icons/LinearFloor";
import LinearLocation from "../../shared/icons/LinearLocation";
import LinearMoney from "../../shared/icons/LinearMoney";
import LinearNavigation from "../../shared/icons/LinearNavigation";
import LinearRuler from "../../shared/icons/LinearRuler";
import LinearSettingBuilding from "../../shared/icons/LinearSettingBuilding";
import LinearTemperature from "../../shared/icons/LinearTemperature";

export type TransactionType = "sale" | "rent" | "project";

export type CategoryKey =
  | "apartment"
  | "villa-house"
  | "garden-villa"
  | "land"
  | "office"
  | "commercial-unit"
  | "warehouse"
  | "hotel-apartment"
  | "factory-workshop"
  | "daily-apartment-suite"
  | "daily-garden-villa"
  | "daily-hotel-apartment"
  | "daily-workspace"
  | "project-presale"
  | "project-partnership";

type IconName =
  | "bed"
  | "building"
  | "floor"
  | "location"
  | "money"
  | "orientation"
  | "ruler"
  | "settings"
  | "temperature"
  | "year"
  | "exchange"
  | "agreement"
  | "unitBed";

type RangeBlock = {
  id: string;
  kind: "range";
  title: string;
  unit?: string;
  variant: "area" | "money" | "number" | "percent";
  showUnitInTitle?: boolean;
};

type SingleChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "single";
  options: readonly string[];
  title: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
};

type MultiChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "multi";
  options: readonly ChipItem[];
  title: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
};

type ToggleBlock = {
  id: string;
  kind: "toggle";
  title: string;
};

type DateBlock = {
  id: string;
  kind: "date";
  title: string;
};

type TimeBlock = {
  id: string;
  kind: "time";
  title: string;
};

type LoanBlock = {
  kind: "loan";
};

type FilterBlock =
  | { kind: "neighborhood" }
  | RangeBlock
  | SingleChoiceBlock
  | MultiChoiceBlock
  | ToggleBlock
  | DateBlock
  | TimeBlock
  | LoanBlock
  | { kind: "advertiser" }
  | { kind: "publicationTime" }
  | { kind: "adFlags" };

type RangeValue = {
  minimum: string;
  maximum: string;
};

type SelectedNeighborhood = {
  id: string;
  name: string;
};

type FilterState = {
  advertiser?: string;
  publicationTime?: string;
  transaction: TransactionType;
  category?: CategoryKey;
  neighborhoods: SelectedNeighborhood[];
  ranges: Record<string, RangeValue | undefined>;
  singles: Record<string, string | undefined>;
  multis: Record<string, string[] | undefined>;
  toggles: Record<string, boolean | undefined>;
  loanAmount: string;
  loanInstallment: string;
  featured: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
};

const initialFilters: FilterState = {
  transaction: "sale",
  category: undefined,
  advertiser: undefined,
  publicationTime: undefined,
  neighborhoods: [],
  ranges: {},
  singles: {},
  multis: {},
  toggles: {},
  loanAmount: "",
  loanInstallment: "",
  featured: false,
  hasPhoto: false,
  hasVideo: false,
};

type AdvertisementFilterPageProps = {
  applyBasePath?: string;
  applyButtonLabel?: string;
  backBasePath?: string;
  title?: string;
};

const categoryKeySet = new Set<CategoryKey>([
  "apartment",
  "villa-house",
  "garden-villa",
  "land",
  "office",
  "commercial-unit",
  "warehouse",
  "hotel-apartment",
  "factory-workshop",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel-apartment",
  "daily-workspace",
  "project-presale",
  "project-partnership",
]);

const formCodeByListingKey: Record<string, string> = {
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

export function getAdvertiseFormCode(transaction: TransactionType, category: CategoryKey) {
  return formCodeByListingKey[`${transaction}:${category}`] ?? `${transaction}-${category}`;
}

export function getListingFromFormCode(formCode: string): { transaction: TransactionType; category: CategoryKey } | null {
  if (!formCode) return null;

  const mappedEntry = Object.entries(formCodeByListingKey).find(([, value]) => value === formCode);

  if (mappedEntry) {
    const [transaction, category] = mappedEntry[0].split(":") as [TransactionType, CategoryKey];

    return { transaction, category };
  }

  const [transaction, ...categoryParts] = formCode.split("-");
  const category = categoryParts.join("-") as CategoryKey;

  if (["sale", "rent", "project"].includes(transaction) && categoryKeySet.has(category)) {
    return { transaction: transaction as TransactionType, category };
  }

  return null;
}

function getSafeReturnToPath() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo") ?? "";

  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) return "";

  return returnTo;
}

function getBackToSearchPath(backBasePath = "/search") {
  const returnTo = getSafeReturnToPath();

  if (returnTo) return returnTo;

  const params = new URLSearchParams(window.location.search);

  params.delete("focus");
  params.delete("returnTo");

  const queryString = params.toString();

  return queryString ? `${backBasePath}?${queryString}` : backBasePath;
}

function goBackOrNavigate(fallbackPath: string) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.history.replaceState(window.history.state ?? {}, "", fallbackPath);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function toEnglishDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);

    if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);

    return digit;
  });
}

function normalizeExactFilterValue(value: string | undefined) {
  if (!value) return "";

  const normalized = toEnglishDigits(value)
    .replace(/‌/g, " ")
    .replace(/سال/g, "")
    .replace(/اتاق/g, "")
    .replace(/طبقه/g, "")
    .replace(/نفر/g, "")
    .replace(/و بیشتر/g, "")
    .replace(/\+/g, "")
    .trim();

  if (normalized === "همکف" || normalized === "بدون") return "0";

  const numericValue = normalized.replace(/[^\d.-]/g, "");

  return numericValue || normalized;
}

function normalizeMultiExactFilterValue(values: string[] | undefined) {
  return (values ?? []).map(normalizeExactFilterValue).filter(Boolean).join("_");
}

function normalizeRangeNumber(value: string | undefined) {
  if (!value) return "";

  return toEnglishDigits(value).replace(/[^\d.]/g, "");
}

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function formatPersianGroupedNumberInput(value: string) {
  const normalized = normalizeRangeNumber(value);

  if (!normalized) return "";

  const [integerPart, decimalPart] = normalized.split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "،");

  return toPersianDigits(decimalPart !== undefined ? `${grouped}.${decimalPart}` : grouped);
}

function formatPersianPlainNumber(value: string | number) {
  const normalized = normalizeRangeNumber(String(value));

  return normalized ? toPersianDigits(normalized) : "";
}

function formatMoneyInputValue(value: string | number | undefined) {
  const normalized = normalizeRangeNumber(String(value ?? ""));
  const numericValue = Number(normalized);

  return normalized && numericValue > 0 ? formatPrice(numericValue) : "";
}

function getMoneySupportingText(value: string | number | undefined) {
  const normalized = normalizeRangeNumber(String(value ?? ""));
  const numericValue = Number(normalized);

  return normalized && numericValue > 0 ? `${formatBigNumber(numericValue)} تومان` : "";
}

export const customRangeOptionLabel = "مقدار دلخواه";

export const areaRangeOptions = [
  customRangeOptionLabel,
  "۳۰",
  "۴۰",
  "۵۰",
  "۶۰",
  "۷۰",
  "۸۰",
  "۹۰",
  "۱۰۰",
  "۱۲۰",
  "۱۵۰",
  "۲۰۰",
  "۲۵۰",
  "۳۰۰",
  "۴۰۰",
  "۵۰۰",
];

function getRange(filters: FilterState, ids: string[]) {
  for (const id of ids) {
    const range = filters.ranges[id];

    if (range?.minimum || range?.maximum) return range;
  }

  return undefined;
}

function readInitialFiltersFromUrl(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const formCode = params.get("form_code") || params.get("from_code") || "";
  const listing = getListingFromFormCode(formCode);
  const focusTarget = params.get("focus");
  const shouldOpenCategoryPicker = focusTarget === "category";
  const transaction = listing?.transaction ?? initialFilters.transaction;
  const category = shouldOpenCategoryPicker ? undefined : listing?.category;
  const nextFilters: FilterState = {
    ...initialFilters,
    transaction,
    category,
    ranges: {},
    singles: {},
    multis: {},
    toggles: {},
    neighborhoods: [],
  };

  const areaRange = {
    minimum: params.get("area_min") ?? "",
    maximum: params.get("area_max") ?? "",
  };
  const priceRange = {
    minimum: formatPersianGroupedNumberInput(params.get("price_min") ?? ""),
    maximum: formatPersianGroupedNumberInput(params.get("price_max") ?? ""),
  };

  if (areaRange.minimum || areaRange.maximum) {
    nextFilters.ranges.meterage = areaRange;
    nextFilters.ranges.landArea = areaRange;
    nextFilters.ranges.buildingArea = areaRange;
    nextFilters.ranges.projectMeterage = areaRange;
  }

  if (priceRange.minimum || priceRange.maximum) {
    nextFilters.ranges.price = priceRange;
    nextFilters.ranges.projectPrice = priceRange;
    nextFilters.ranges.dailyPrice = priceRange;
    nextFilters.ranges.rentPrice = priceRange;
    nextFilters.ranges.mortgagePrice = priceRange;
  }

  const floorValues = (params.get("floor") ?? "").split(/[_،,]/).filter(Boolean);
  const roomValues = (params.get("rooms") ?? "").split(/[_،,]/).filter(Boolean);
  const buildingAge = params.get("building_age") ?? "";
  const exchangeValues = (params.get("exchange_with") ?? "").split(/[_،,]/).filter(Boolean);

  if (floorValues.length > 0) nextFilters.multis.floor = floorValues;
  if (roomValues.length > 0) nextFilters.multis.rooms = roomValues;
  if (exchangeValues.length > 0) nextFilters.multis.exchangeWith = exchangeValues;
  if (buildingAge) nextFilters.singles.age = buildingAge;

  const neighborhoods = (params.get("neighborhood_id") || params.get("neighborhoods") || "")
    .split(/[_،,]/)
    .filter(Boolean);

  if (neighborhoods.length > 0) {
    nextFilters.neighborhoods = neighborhoods.map((id) => ({ id, name: id }));
  }

  if (params.get("published_at")) nextFilters.publicationTime = params.get("published_at") ?? undefined;
  nextFilters.featured = params.get("is_special") === "true" || params.get("is_special") === "1";
  nextFilters.hasPhoto = params.get("has_image") === "true" || params.get("has_image") === "1";
  nextFilters.hasVideo = params.get("has_video") === "true" || params.get("has_video") === "1";
  nextFilters.toggles.hasLoan = params.get("has_loan") === "true" || params.get("has_loan") === "1";
  nextFilters.loanAmount = params.get("loan_amount") ?? "";
  nextFilters.loanInstallment = params.get("loan_installment") ?? "";

  for (const [fieldId, paramKey] of Object.entries(filterFieldParamMap)) {
    const directValue = params.get(paramKey);
    const minValue = params.get(`${paramKey}_min`);
    const maxValue = params.get(`${paramKey}_max`);

    if (minValue || maxValue) {
      nextFilters.ranges[fieldId] = { minimum: minValue ?? "", maximum: maxValue ?? "" };
      continue;
    }

    if (!directValue) continue;

    const isApprovedSaleLandMulti =
      listing?.transaction === "sale" &&
      listing.category === "land" &&
      fieldId === "usageType";

    if (fieldId === "heatingCooling" || fieldId === "facilities" || fieldId === "suitableFor" || isApprovedSaleLandMulti) {
      nextFilters.multis[fieldId] = directValue.split(/[_،,]/).filter(Boolean);
    } else if (["renovated", "furnished", "constructionPermit", "commercialPermit", "hasDocument", "managementRoom", "conferenceRoom", "receptionHall", "signboard", "kitchen", "separateEntrance", "saleTermsEnabled"].includes(fieldId)) {
      nextFilters.toggles[fieldId] = directValue === "true" || directValue === "1" || directValue === "دارد";
    } else {
      nextFilters.singles[fieldId] = directValue;
    }
  }

  return nextFilters;
}

function buildSearchUrl(filters: FilterState, applyBasePath = "/search") {
  const returnTo = getSafeReturnToPath();
  const baseUrl = new URL(returnTo || applyBasePath, window.location.origin);
  const params = returnTo ? baseUrl.searchParams : new URLSearchParams(window.location.search);
  const formCode = filters.category
    ? getAdvertiseFormCode(filters.transaction, filters.category)
    : "";
  const neighborhoods = filters.neighborhoods.map((item) => item.id).join("_");
  // Only the generic `area`/`price` fields use these legacy params.
  // land_area, building_area, rent_price and mortgage_price are emitted below
  // through filterFieldParamMap so independent ranges do not accidentally AND
  // against a non-existent generic attribute.
  const areaRange = getRange(filters, ["meterage", "projectMeterage"]);
  const priceRange = getRange(filters, ["price", "projectPrice", "dailyPrice"]);
  const rooms =
    normalizeMultiExactFilterValue(filters.multis.rooms) ||
    normalizeExactFilterValue(filters.singles.rooms) ||
    normalizeMultiExactFilterValue(filters.multis.projectRooms);
  const floor =
    normalizeMultiExactFilterValue(filters.multis.floor) ||
    normalizeExactFilterValue(filters.singles.floor) ||
    normalizeMultiExactFilterValue(filters.multis.projectFloors);
  const buildingAge = normalizeExactFilterValue(filters.singles.age);
  const exchangeWith = normalizeMultiExactFilterValue(filters.multis.exchangeWith);

  const setOrDelete = (key: string, value: string) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  };

  params.delete("category_id");
  params.delete("categoryId");
  params.delete("focus");
  params.delete("returnTo");
  params.set("view", "list");

  setOrDelete("form_code", formCode);
  setOrDelete("from_code", formCode);
  setOrDelete("neighborhood_id", neighborhoods);
  setOrDelete("neighborhoods", neighborhoods);
  setOrDelete("area_min", normalizeRangeNumber(areaRange?.minimum));
  setOrDelete("area_max", normalizeRangeNumber(areaRange?.maximum));
  setOrDelete("price_min", normalizeRangeNumber(priceRange?.minimum));
  setOrDelete("price_max", normalizeRangeNumber(priceRange?.maximum));
  setOrDelete("rooms", rooms);
  setOrDelete("floor", floor);
  setOrDelete("building_age", buildingAge);
  setOrDelete("has_loan", filters.toggles.hasLoan ? "true" : "");
  setOrDelete("loan_amount", "");
  setOrDelete("loan_installment", "");
  setOrDelete("exchange_with", exchangeWith);
  setOrDelete("published_at", filters.publicationTime ?? "");
  setOrDelete("is_special", filters.featured ? "true" : "");
  setOrDelete("has_image", filters.hasPhoto ? "true" : "");
  setOrDelete("has_video", filters.hasVideo ? "true" : "");

  for (const [fieldId, paramKey] of Object.entries(filterFieldParamMap)) {
    const range = filters.ranges[fieldId];
    const single = filters.singles[fieldId];
    const multi = filters.multis[fieldId];
    const toggle = filters.toggles[fieldId];

    setOrDelete(`${paramKey}_min`, normalizeRangeNumber(range?.minimum));
    setOrDelete(`${paramKey}_max`, normalizeRangeNumber(range?.maximum));

    if (multi?.length) {
      setOrDelete(paramKey, multi.join("_"));
    } else if (single) {
      setOrDelete(paramKey, ["readyDeliveryDate", "projectDeliveryDate"].includes(fieldId) ? single : normalizeExactFilterValue(single));
    } else if (toggle) {
      setOrDelete(paramKey, "true");
    } else {
      setOrDelete(paramKey, "");
    }
  }

  const queryString = params.toString();
  const pathname = returnTo ? baseUrl.pathname : applyBasePath;

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export const categoryLabels: Record<CategoryKey, string> = {
  apartment: "آپارتمان",
  "villa-house": "خانه ویلایی",
  "garden-villa": "باغ، ویلا",
  land: "زمین، ملک کلنگی",
  office: "اداری",
  "commercial-unit": "واحد تجاری",
  warehouse: "انبار، سوله",
  "hotel-apartment": "هتل، اقامتگاه",
  "factory-workshop": "واحد صنعتی",
  "daily-apartment-suite": "آپارتمان، سوئیت",
  "daily-garden-villa": "باغ، ویلا",
  "daily-hotel-apartment": "هتل، اقامتگاه",
  "daily-workspace": "دفترکار، غرفه",
  "project-presale": "پروژه",
  "project-partnership": "مشارکت",
};

export const categoryGroupsByTransaction: Record<
  TransactionType,
  { title: string; items: CategoryKey[] }[]
> = {
  sale: [
    {
      title: "مسکونی",
      items: ["apartment", "land", "villa-house", "garden-villa"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  rent: [
    {
      title: "مسکونی",
      items: ["apartment", "villa-house", "garden-villa"],
    },
    {
      title: "روزانه",
      items: ["daily-apartment-suite", "daily-garden-villa", "daily-hotel-apartment", "daily-workspace"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  project: [
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["project-presale", "project-partnership"],
    },
  ],
};

function getApprovedSelectedCategoryLabel(transaction: TransactionType, category: CategoryKey) {
  if (transaction === "sale") {
    if (category === "apartment") return "فروش آپارتمان";
    if (category === "land") return "فروش زمین، ملک کلنگی";
    if (category === "garden-villa") return "فروش باغ، ویلا";
    if (category === "office") return "فروش واحد اداری";
    if (category === "commercial-unit") return "فروش واحد تجاری";
    if (category === "factory-workshop") return "فروش واحد صنعتی";
    if (category === "hotel-apartment") return "فروش هتل، اقامتگاه";
  }

  if (transaction === "rent") {
    if (category === "apartment") return "اجاره آپارتمان";
    if (category === "villa-house") return "اجاره خانه، ویلا";
    if (category === "office") return "اجاره واحد اداری";
    if (category === "commercial-unit") return "اجاره واحد تجاری";
    if (category === "factory-workshop") return "اجاره واحد صنعتی";
    if (category === "hotel-apartment") return "اجاره هتل، اقامتگاه";
    if (category === "daily-apartment-suite") return "اجاره روزانه آپارتمان، سوئیت";
    if (category === "daily-garden-villa") return "اجاره روزانه باغ، ویلا";
    if (category === "daily-hotel-apartment") return "اجاره روزانه هتل، اقامتگاه";
    if (category === "daily-workspace") return "اجاره روزانه دفترکار، غرفه";
  }

  // Both supplied project SVGs intentionally show the selected property category as apartment.
  if (transaction === "project" && (category === "project-presale" || category === "project-partnership")) {
    return "آپارتمان";
  }

  return categoryLabels[category];
}

export const transactionTabs: { label: string; value: TransactionType }[] = [
  { label: "فروش", value: "sale" },
  { label: "اجاره", value: "rent" },
  { label: "پروژه", value: "project" },
];

const advertiserOptions = ["آژانس املاک", "شخصی", "مشاور"];
const publicationTimeOptions = ["یک ساعت پیش", "سه ساعت پیش", "یک روز پیش", "یک هفته پیش", "یک ماه پیش"];
const removedFilterFieldKeys = new Set<string>();

const filterFieldParamMap: Record<string, string> = {
  projectType: "project_type",
  projectStatus: "project_status",
  projectDeliveryDate: "delivery_date",
  projectTotalFloors: "project_total_floors",
  projectTotalUnits: "project_total_units",
  saleTermsPercent: "sale_terms_percent",
  saleTermsInstallmentMonths: "sale_terms_installment_months",
  saleTermsEnabled: "installment_sale",
  builderSharePercent: "builder_share",
  participationType: "partnership_type",
  landArea: "land_area",
  buildingArea: "building_area",
  rentPrice: "rent_price",
  mortgagePrice: "mortgage_price",
  totalFloors: "total_floors",
  unitsPerFloor: "units_per_floor",
  unitType: "unit_type",
  unitPosition: "unit_position",
  unitLayout: "unit_layout",
  documentType: "document_type",
  usageType: "land_use",
  suitableFor: "suitable_for",
  occupancyStatus: "occupancy_status",
  petPolicy: "pet_policy",
  readyDeliveryDate: "ready_delivery_date",
  minContractMonths: "min_contract_months",
  rentConversionPolicy: "rent_conversion_policy",
  kitchenType: "kitchen_type",
  renovated: "renovated",
  furnished: "furnished",
  landPosition: "land_position",
  buildingType: "building_type",
  villaType: "villa_type",
  commercialPosition: "commercial_position",
  ownershipStatus: "ownership_status",
  accommodationType: "accommodation_type",
  hotelStars: "hotel_stars",
  officePosition: "office_position",
  officeDocumentType: "office_document_type",
  hasDocument: "has_document",
  managementRoom: "management_room",
  conferenceRoom: "conference_room",
  receptionHall: "reception_hall",
  signboard: "signboard",
  kitchen: "kitchen",
  separateEntrance: "separate_entrance",
  facadeMaterial: "facade_material",
  floorMaterial: "floor_material",
  cabinetMaterial: "cabinet_material",
  currentStatus: "current_status",
  industrialPropertyType: "industrial_property_type",
  accessType: "access_type",
  density: "density",
  landWidth: "land_width",
  streetWidth: "street_width",
  constructionPermit: "build_permit",
  constructionLicense: "build_permit",
  commercialPermit: "commercial_permit",
  commercialLicense: "commercial_permit",
  ceilingHeight: "height",
  openingCount: "opening_count",
  spaceType: "space_type",
  standardCapacity: "standard_capacity",
  rentalPeriod: "rental_period",
  viewType: "view_type",
  checkInTime: "check_in_time",
  checkOutTime: "check_out_time",
  minStayDays: "min_stay_days",
  evacuationGuarantee: "evacuation_guarantee",
  normalDailyPrice: "normal_daily_price",
  weekendDailyPrice: "weekend_daily_price",
  specialDailyPrice: "special_daily_price",
  extraPersonPrice: "extra_person_price",
  heatingCooling: "heating_cooling",
  facilities: "facilities",
};


const minNeighborhoodSearchLength = 2;
const neighborhoodSearchDebounceMs = 250;

function useOpenOnFilterFocus(sectionId?: string, focusTarget?: string | null) {
  const didOpenRef = useRef(false);

  useEffect(() => {
    if (!sectionId || focusTarget !== sectionId || didOpenRef.current) return;

    didOpenRef.current = true;
  }, [focusTarget, sectionId]);

  return !didOpenRef.current && Boolean(sectionId && focusTarget === sectionId);
}

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

function getNeighborhoodOptionId(neighborhood: Pick<NeighborhoodDto, "_id" | "id" | "name">) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodOptionId(neighborhood),
    name: neighborhood.name,
  };
}

function getNeighborhoodChildName(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  const name = record.name ?? record.title ?? record.label;

  return typeof name === "string" ? name.trim() : "";
}

function getNeighborhoodDescription(neighborhood: NeighborhoodDto) {
  const value = neighborhood.sub_neighbors;

  if (Array.isArray(value)) {
    return value.map(getNeighborhoodChildName).filter(Boolean).join("، ");
  }

  if (typeof value === "string") {
    return value
      .split(/[،,|]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("، ");
  }

  return "";
}

function getListingKey(transaction: TransactionType, category: CategoryKey) {
  return `${transaction}:${category}`;
}

function getBasicFields(transaction: TransactionType, category: CategoryKey): BasicPropertyField[] {
  if (category === "project-partnership") {
    return [
      { key: "participationType", label: "نوع مشارکت", control: "select", options: participationTypeOptions, required: true },
      { key: "currentStatus", label: "وضعیت فعلی ملک", control: "select", options: partnershipCurrentStatusOptions, required: true },
      { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
      { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions, required: true },
    ];
  }

  if (category === "project-presale") {
    return [];
  }

  return (
    basicPropertyFieldsByListingType[getListingKey(transaction, category)] ??
    defaultBasicPropertyFields
  );
}

function getMoreFields(transaction: TransactionType, category: CategoryKey): MoreFeatureField[] {
  return (
    moreFeatureFieldsByListingType[getListingKey(transaction, category)] ??
    moreFeatureFieldsByCategory[category] ??
    []
  ).filter((field) => !removedFilterFieldKeys.has(field.key));
}

function getHeatingItems(transaction: TransactionType, category: CategoryKey) {
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

function getFacilityItems(transaction: TransactionType, category: CategoryKey) {
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
  return category === "land" || category === "factory-workshop" ? landFacilityItems : facilityItems;
}

function isDailyRentCategory(category: CategoryKey) {
  return category.startsWith("daily-");
}

function isProjectCategory(category: CategoryKey) {
  return category.startsWith("project-");
}

function getFieldIcon(key: string): IconName {
  if (key === "floor" || key === "totalFloors" || key === "projectTotalFloors") return "floor";
  if (key === "rooms" || key === "singleRoomCount" || key === "doubleRoomCount" || key === "suiteCount") return "bed";
  if (key === "documentType") return "agreement";
  if (key === "unitType") return "unitBed";
  if (key === "age") return "year";
  if (key === "landPosition" || key === "unitPosition") return "orientation";

  return "settings";
}

function createRangeBlock(
  id: string,
  title: string,
  variant: RangeBlock["variant"],
  unit?: string,
  showUnitInTitle = false,
): RangeBlock {
  return {
    id,
    kind: "range",
    title,
    unit,
    variant,
    showUnitInTitle,
  };
}

function blockFromBasicField(field: BasicPropertyField): FilterBlock {
  if (field.control === "input") {
    const isAreaField = field.leftText?.includes("متر") || field.key === "meterage" || field.key === "landArea" || field.key === "buildingArea";
    const isPercentField = field.leftText?.includes("درصد") || field.key === "density";

    return createRangeBlock(
      field.key,
      field.label,
      isPercentField ? "percent" : isAreaField ? "area" : "number",
      field.leftText,
    );
  }

  if (field.key === "rooms" || field.key === "floor") {
    return {
      icon: getFieldIcon(field.key),
      id: field.key,
      kind: "multi",
      options: (field.options ?? []).map((label) => ({ id: label, label })),
      title: field.label,
    };
  }

  return {
    icon: getFieldIcon(field.key),
    id: field.key,
    kind: "single",
    options: field.options ?? [],
    title: field.label,
  };
}

function blockFromMoreFeatureField(field: MoreFeatureField): FilterBlock {
  if (field.control === "time") {
    return { id: field.key, kind: "time", title: field.label };
  }

  if (field.control === "date") {
    return { id: field.key, kind: "date", title: field.label };
  }

  if (field.control === "toggle") {
    return {
      id: field.key,
      kind: "toggle",
      title: field.label,
    };
  }

  if (field.control === "number") {
    const isPercentField = field.leftText?.includes("درصد") || field.key === "density";
    const isAreaField = field.key === "buildingArea" || field.leftText === "متر مربع";

    return createRangeBlock(
      field.key,
      field.label,
      isPercentField ? "percent" : isAreaField ? "area" : "number",
      field.leftText,
    );
  }

  if (field.key === "rooms" || field.key === "floor") {
    return {
      icon: getFieldIcon(field.key),
      id: field.key,
      kind: "multi",
      options: (field.options ?? moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ?? []).map((label) => ({ id: label, label })),
      title: field.label,
    };
  }

  return {
    icon: getFieldIcon(field.key),
    id: field.key,
    kind: "single",
    options: field.options ?? moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ?? [],
    title: field.label,
  };
}

function getProjectPresaleBlocks(): FilterBlock[] {
  return [
    { icon: "settings", id: "projectType", kind: "single", options: projectTypeOptions, title: "نوع پروژه" },
    createRangeBlock("projectTotalFloors", "تعداد کل طبقات", "number"),
    createRangeBlock("projectTotalUnits", "تعداد کل واحد ها", "number"),
    { icon: "agreement", id: "documentType", kind: "single", options: moreFeatureOptions.documentType, title: "سند" },
    { icon: "settings", id: "projectStatus", kind: "single", options: projectStatusOptions, title: "وضعیت پروژه" },
    { id: "projectDeliveryDate", kind: "date", title: "تاریخ تحویل" },
    { icon: "settings", id: "kitchenType", kind: "single", options: moreFeatureOptions.kitchenType, title: "نوع آشپزخانه" },
    { icon: "settings", id: "facadeMaterial", kind: "single", options: moreFeatureOptions.facadeMaterial, title: "جنس نما" },
    { icon: "settings", id: "floorMaterial", kind: "single", options: moreFeatureOptions.floorMaterial, title: "جنس کف" },
    { icon: "settings", id: "cabinetMaterial", kind: "single", options: moreFeatureOptions.cabinetMaterial, title: "جنس کابینت" },
    { id: "furnished", kind: "toggle", title: "با لوازم و مبله" },
    createRangeBlock("projectMeterage", "متراژ", "area", "متر مربع"),
    { icon: "floor", id: "projectFloors", kind: "multi", options: projectFloorOptions.map((label) => ({ id: label, label })), title: "طبقه" },
    { icon: "bed", id: "projectRooms", kind: "multi", options: projectRoomOptions.map((label) => ({ id: label, label })), title: "تعداد اتاق" },
    { icon: "orientation", id: "projectPositions", kind: "multi", options: projectPositionOptions.map((label) => ({ id: label, label })), title: "موقعیت" },
    createRangeBlock("saleTermsPercent", "درصد شرایط", "percent", "درصد"),
    createRangeBlock("saleTermsInstallmentMonths", "تعداد اقساط", "number", "ماه"),
  ];
}


const approvedSaleFilterAgeOptions = [
  "۱ سال",
  "نوساز",
  "۲ سال",
  "۳ سال",
  "۴ سال",
  "۱۰ سال",
  "۱۵ سال",
  "۲۰ سال",
  "بیشتر از ۳۰ سال",
];

const approvedSaleFilterDocumentTypeOptions = [
  "تک برگ",
  "منگوله‌دار",
  "آستانه",
  "اوقافی",
  "موقوفه",
  "وکالت محضری",
  "قولنامه",
  "مشاع",
  "در دست اقدام",
  "آماده انتقال",
];

const approvedSaleFilterLandUseOptions = [
  "مسکونی",
  "اداری",
  "تجاری",
  "صنعتی",
  "کشاورزی",
  "باغی",
  "آموزشی",
  "درمانی",
  "مذهبی",
  "ورزشی",
  "خدماتی",
  "گردشگری و توریستی",
  "پارکینگ",
  "حریم",
  "فاقد کاربری",
];

const approvedSaleFilterLandPositionOptions = [
  "شمالی",
  "جنوبی",
  "غربی",
  "شرقی",
  "دوممر",
  "دونبش",
  "سه نبش",
  "چهارنبش",
];

const approvedSaleFilterSuitableForOptions = [
  "ساخت آپارتمان",
  "ساخت ویلا",
  "سرمایه‌گذاری",
  "تجمیع با ملک مجاور",
];

const approvedSaleFilterBuildingPositionOptions = [
  "شمالی",
  "جنوبی",
  "شرقی",
  "غربی",
  "دونبش",
  "سه نبش",
  "دوممر",
];

const approvedSaleFilterUnitPositionOptions = [
  "جلو",
  "عقب",
  "وسط",
  "کنج",
  "دوبلکس",
  "پنت هاوس",
];

const approvedSaleFilterVillaBuildingTypeOptions = [
  "ویلایی مستقل",
  "شهرکی",
  "آپارتمانی",
];

const approvedSaleFilterVillaTypeOptions = [
  "تک طبقه",
  "دو طبقه",
  "سه طبقه",
  "دوبلکس",
  "تریبلکس",
  "فورلکس",
];

const approvedSaleFilterFloorOptions = ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
const approvedSaleFilterUnitsPerFloorOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "+۸"];

// The supplied filter SVGs show the first six heating/cooling chips and five more.
// Keep this filter-only list separate from create/edit feature contracts.
const approvedSaleFilterHeatingItems: ChipItem[] = [
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "water-cooler", label: "کولر آبی" },
  { id: "package", label: "پکیج" },
  { id: "water-heater", label: "آبگرمکن" },
  { id: "heater", label: "بخاری" },
  { id: "radiator", label: "شوفاژ" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
];

const approvedSaleFilterExchangeTargets = [
  "ویلا",
  "خودرو",
  "آپارتمان",
  "خانه ویلایی",
  "زمین",
  ...exchangeTargets.filter((item) => !["ویلا", "خودرو", "آپارتمان", "خانه ویلایی", "زمین"].includes(item)),
];


// Exact filter-screen contracts transcribed from the supplied sale/rent SVG references.
// These lists are intentionally filter-only so create/edit form contracts remain untouched.
const approvedBusinessCurrentStatusOptions = ["تخلیه", "فعال"];
const approvedOfficeCurrentStatusOptions = ["تخلیه", "فعال", "درحال بازسازی"];
const approvedOfficePositionOptions = ["مجتمع اداری", "برج اداری", "بر خیابان اصلی", "موقعیت مسکونی", "مجتمع پزشکان"];
const approvedOfficeDocumentOptions = ["دائم", "موقت"];
const approvedCommercialLicenseOptions = ["دائم", "موقت"];
const approvedRentIndustrialLicenseOptions = ["دائم", "موقت", "ندارد"];
const approvedIndustrialPropertyOptions = ["سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "گاوداری", "مرغداری"];
const approvedIndustrialAccessOptions = ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"];
const approvedCommercialPositionOptions = ["بر خیابان اصلی", "داخل پاساژ", "داخل کوچه", "غرفه", "مالکیت مشترک", "بازار محله"];
const approvedCommercialOwnershipOptions = ["مالکیت کامل", "فقط سرقفلی", "فقط مالکیت", "مالکیت مشترک"];
const approvedHotelAccommodationOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه", "مجتمع توریستی"];
const approvedHotelStarOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];
const approvedTotalFloorsOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
const approvedRentUnitLayoutOptions = ["تک طبقه", "دو طبقه", "سه طبقه", "دوبلکس", "فورلکس", "پنت هاوس"];
const approvedRentApartmentBuildingPositionOptions = ["شمالی", "جنوبی", "غربی", "شرقی", "دو ممر", "دونبش", "سه نبش", "چهارنبش"];
const approvedRentVillaLandPositionOptions = ["شمالی", "جنوبی", "دونبش", "سه نبش", "چهارنبش"];
const approvedRentVillaBuildingTypeOptions = ["ویلایی مستقل", "آپارتمانی", "شهرکی"];
const approvedRentVillaTypeOptions = ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"];

const approvedSaleOfficeSuitableOptions = [
  "شرکت‌ها", "مهندسین", "بیمه", "وکلا", "آموزشگاه",
  "مطب", "موسسه", "آتلیه", "مزون", "اسناد رسمی",
  "دفاتر دولت", "صنایع", "خدماتی", "ورزشی", "فرهنگی",
];

const approvedSaleCommercialSuitableOptions = [
  "پوشاک", "متفرقه", "کترینگ", "ابزار آلات", "آشپزخانه", "کیف و کفش", "سوپر مارکت",
  "موبایل و لوازم جانبی", "لوازم خانگی", "طلا و جواهر", "ساعت", "عطر و ادکلن", "آرایشی و بهداشتی",
  "داروخانه", "تجهیزات پزشکی", "عینک", "کتاب و لوازم تحریر", "اسباب بازی", "لوازم ورزشی",
  "دوچرخه و موتورسیکلت", "قطعات خودرو", "لوازم یدکی", "خدمات خودرو", "رستوران", "کافه", "فست فود",
  "نانوایی", "قنادی", "میوه و تره بار", "پروتئینی", "لبنیات", "خشکبار", "گل فروشی", "مبلمان",
  "فرش و موکت", "دکوراسیون", "پرده", "روشنایی", "الکتریکی", "تاسیسات", "مصالح ساختمانی",
  "ابزارآلات صنعتی", "چاپ و تبلیغات", "آتلیه", "سالن زیبایی", "خیاطی", "آموزشگاه", "دفتر خدماتی",
  "بیمه", "بانک و موسسه مالی", "املاک", "وکلا", "مطب",
];

const approvedRentApartmentSuitableOptions = [
  "شرکت‌ها", "مهندسین", "بیمه", "وکلا", "آموزشگاه",
  "خانواده", "مجرد", "دانشجو", "زوج", "مطب", "موسسه", "آتلیه", "مزون", "اسناد رسمی", "دفاتر دولت",
];

const approvedRentVillaSuitableOptions = [
  "خانواده", "برگزاری مراسم", "چند خانواده",
  "مجرد", "دانشجو", "زوج", "مهمانی", "جشن تولد", "عروسی", "دورهمی", "سفر خانوادگی", "اقامت گروهی", "استراحت",
];

const approvedRentOfficeSuitableOptions = [
  "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی",
  "درمانی", "انباری", "مهندسین", "شرکت ها", "وکلا", "مطب", "موسسه", "آموزشگاه", "آتلیه", "مزون",
  "اسناد رسمی", "دفاتر دولت", "ورزشی", "فرهنگی", "همه مشاغل",
];

const approvedRentCommercialSuitableOptions = [
  "وکلا", "مهندسین", "مطب", "درمانگاه", "آموزشگاه",
  "فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "درمانی", "انباری", "شرکت ها", "موسسه", "آتلیه",
  "مزون", "اسناد رسمی", "دفاتر دولت", "همه مشاغل", "سایر",
];

const approvedRentIndustrialSuitableOptions = ["صنایع پلاستیک", "صنایع چوب"];

// Exact filter-only contracts transcribed from the supplied daily-rent/project SVGs.
// These intentionally do not change create/edit-ad field definitions.
const approvedDailyAccommodationOptions = ["سوئیت", "آپارتمان", "اتاق", "خوابگاه یا پانسیون", "بوم گردی"];
const approvedDailyHotelAccommodationOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه"];
const approvedDailyHotelRankOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];
const approvedDailyWorkspaceTypeOptions = [
  "اتاق کار اشتراکی",
  "اتاق کار خصوصی",
  "اتاق جلسه",
  "کلاس آموزشی",
  "سالن همایش",
  "غرفه نمایشگاه",
  "کانتر",
];
const approvedDailyCapacityOptions = [
  "۱ نفر", "۲ نفر", "۳ نفر", "۴ نفر", "۵ نفر", "۶ نفر", "۷ نفر", "۸ نفر",
  "۹ نفر", "۱۰ نفر", "۱۲ نفر", "۱۵ نفر", "۲۰ نفر", "۳۰ نفر", "۴۰ نفر", "۵۰+ نفر",
];
const approvedPartnershipLandPositionOptions = [
  "شمالی", "جنوبی", "غربی", "شرقی", "دو ممر", "دونبش", "سه نبش", "چهار نبش",
];
const approvedPartnershipDocumentOptions = ["ملکی", "آستانه", "اوقاف", "موقوفه", "قولنامه، وکالت"];

const approvedDailyFacilities: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "lobby", label: "لابی" },
  { id: "guard", label: "نگهبانی" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فرتوکار" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "roof", label: "روف گاردن" },
  { id: "heated-pool", label: "استخر آب گرم" },
  { id: "outdoor-pool", label: "استخر روباز" },
  { id: "covered-pool", label: "استخر پوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" },
  { id: "internet", label: "اینترنت پر سرعت" },
];

const approvedRentBusinessHeatingItems: ChipItem[] = [
  { id: "air-handler", label: "هواساز" },
  { id: "heater", label: "بخاری" },
  { id: "water-cooler", label: "کولر آبی" },
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "radiator", label: "شوفاژ" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
  { id: "water-heater", label: "آبگرمکن" },
  { id: "package", label: "پکیج" },
  { id: "engine-room", label: "موتورخانه" },
  { id: "air-conditioning", label: "سیستم تهویه مطبوع" },
  { id: "split", label: "اسپیلت" },
];

const approvedRentBusinessFacilities: ChipItem[] = [
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "fireplace", label: "شومینه" },
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "storage", label: "انباری" },
  { id: "lobby", label: "لابی" },
  { id: "security", label: "نگهبانی" },
  { id: "roof-garden", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "sauna", label: "سونا" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "camera", label: "دوربین مدار بسته" },
  { id: "smart-system", label: "سیستم هوشمند" },
];

const approvedSaleHotelFacilities: ChipItem[] = (() => {
  const labels = ["آسانسور", "پارکینگ", "رستوران", "کافی شاپ", "لابی", "استخر"];
  const seen = new Set(labels);
  for (const item of dailyHotelFacilityItems) {
    if (labels.length >= 34) break;
    if (!seen.has(item.label)) {
      labels.push(item.label);
      seen.add(item.label);
    }
  }
  return labels.map((label) => ({ id: label, label }));
})();


function asChipItems(options: readonly string[]): ChipItem[] {
  return options.map((label) => ({ id: label, label }));
}

function getApprovedSaleApartmentFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    {
      icon: "floor",
      id: "floor",
      kind: "multi",
      options: asChipItems(approvedSaleFilterFloorOptions),
      title: "طبقه",
      more: true,
      moreLimit: 6,
      moreLabel: "مشاهده همه طبقات",
      moreIcon: "left",
    },
    { icon: "floor", id: "unitsPerFloor", kind: "single", options: approvedSaleFilterUnitsPerFloorOptions, title: "تعداد واحد در طبقه", more: false },
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند", more: false },
    { icon: "orientation", id: "unitType", kind: "single", options: approvedSaleFilterBuildingPositionOptions, title: "موقعیت ساختمان", more: false },
    { icon: "orientation", id: "unitPosition", kind: "single", options: approvedSaleFilterUnitPositionOptions, title: "موقعیت واحد", more: false },
    {
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: approvedSaleFilterHeatingItems,
      title: "سرمایش و گرمایش",
      more: true,
      moreLimit: 6,
    },
    {
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: facilityItems,
      title: "امکانات",
      more: true,
      moreLimit: 6,
    },
    { icon: "exchange", id: "exchangeWith", kind: "multi", options: asChipItems(approvedSaleFilterExchangeTargets), title: "معاوضه با" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedSaleLandFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("landWidth", "عرض زمین", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند", more: false },
    {
      icon: "settings",
      id: "usageType",
      kind: "multi",
      options: asChipItems(approvedSaleFilterLandUseOptions),
      title: "نوع کاربری",
      more: true,
      moreLimit: 10,
      moreLabel: `مشاهده ${toPersianDigits(Math.max(approvedSaleFilterLandUseOptions.length - 10, 0))} مورد دیگر`,
      moreIcon: "left",
    },
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedSaleFilterLandPositionOptions, title: "موقعیت زمین", more: false },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    { icon: "settings", id: "density", kind: "single", options: ["کم", "متوسط", "زیاد"], title: "تراکم زمین", more: false },
    { icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedSaleFilterSuitableForOptions), title: "مناسب برای" },
    { id: "constructionPermit", kind: "toggle", title: "مجوز ساخت" },
    { kind: "loan" },
    {
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: approvedSaleFilterHeatingItems,
      title: "سرمایش و گرمایش",
      more: true,
      moreLimit: 6,
    },
    {
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: facilityItems,
      title: "امکانات",
      more: true,
      moreLimit: 6,
    },
    { icon: "exchange", id: "exchangeWith", kind: "multi", options: asChipItems(approvedSaleFilterExchangeTargets), title: "معاوضه با" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedSaleGardenVillaFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedSaleFilterLandPositionOptions, title: "موقعیت زمین", more: false },
    { icon: "building", id: "buildingType", kind: "single", options: approvedSaleFilterVillaBuildingTypeOptions, title: "نوع بنا", more: false },
    { icon: "building", id: "villaType", kind: "single", options: approvedSaleFilterVillaTypeOptions, title: "تیپ بنا", more: false },
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند", more: false },
    {
      icon: "floor",
      id: "totalFloors",
      kind: "single",
      options: approvedSaleFilterFloorOptions,
      title: "تعداد طبقات",
      more: true,
      moreLimit: 6,
      moreLabel: "مشاهده همه طبقات",
      moreIcon: "left",
    },
    {
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: approvedSaleFilterHeatingItems,
      title: "سرمایش و گرمایش",
      more: true,
      moreLimit: 6,
    },
    {
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: facilityItems,
      title: "امکانات",
      more: true,
      moreLimit: 6,
    },
    { icon: "exchange", id: "exchangeWith", kind: "multi", options: asChipItems(approvedSaleFilterExchangeTargets), title: "معاوضه با" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}


function approvedSaleHeatingBlock(): MultiChoiceBlock {
  return {
    icon: "temperature",
    id: "heatingCooling",
    kind: "multi",
    options: approvedSaleFilterHeatingItems,
    title: "سرمایش و گرمایش",
    more: true,
    moreLimit: 6,
    moreLabel: "نمایش ۵ مورد دیگر",
  };
}

function approvedGenericFacilitiesBlock(): MultiChoiceBlock {
  return {
    icon: "settings",
    id: "facilities",
    kind: "multi",
    options: facilityItems,
    title: "امکانات",
    more: true,
    moreLimit: 6,
    moreLabel: "نمایش ۱۹ مورد دیگر",
  };
}

function approvedRentBusinessHeatingBlock(): MultiChoiceBlock {
  return {
    icon: "temperature",
    id: "heatingCooling",
    kind: "multi",
    options: approvedRentBusinessHeatingItems,
    title: "سرمایش و گرمایش",
    more: true,
    moreLimit: 3,
    moreLabel: "نمایش ۱۲ مورد دیگر",
  };
}

function approvedRentBusinessFacilitiesBlock(): MultiChoiceBlock {
  return {
    icon: "settings",
    id: "facilities",
    kind: "multi",
    options: approvedRentBusinessFacilities,
    title: "امکانات",
    more: true,
    moreLimit: 3,
    moreLabel: "نمایش ۱۲ مورد دیگر",
  };
}

function approvedExchangeBlock(): MultiChoiceBlock {
  return {
    icon: "exchange",
    id: "exchangeWith",
    kind: "multi",
    options: asChipItems(approvedSaleFilterExchangeTargets),
    title: "معاوضه با",
  };
}

function approvedFloorBlock(title = "طبقه"): MultiChoiceBlock {
  return {
    icon: "floor",
    id: "floor",
    kind: "multi",
    options: asChipItems(approvedSaleFilterFloorOptions),
    title,
    more: true,
    moreLimit: 6,
    moreLabel: "مشاهده همه طبقات",
    moreIcon: "left",
  };
}

function approvedTotalFloorsBlock(title = "تعداد طبقات"): SingleChoiceBlock {
  return {
    icon: "floor",
    id: "totalFloors",
    kind: "single",
    options: approvedTotalFloorsOptions,
    title,
    more: true,
    moreLimit: 7,
    moreLabel: "مشاهده همه طبقات",
    moreIcon: "left",
  };
}

function getApprovedSaleOfficeFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedFloorBlock(),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedSaleOfficeSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 5, moreLabel: "مشاهده ۱۰ مورد دیگر", moreIcon: "down",
    },
    { icon: "settings", id: "currentStatus", kind: "single", options: approvedOfficeCurrentStatusOptions, title: "وضعیت فعلی" },
    { icon: "location", id: "officePosition", kind: "single", options: approvedOfficePositionOptions, title: "موقعیت اداری" },
    { icon: "agreement", id: "officeDocumentType", kind: "single", options: approvedOfficeDocumentOptions, title: "سند اداری" },
    { id: "managementRoom", kind: "toggle", title: "اتاق مدیریت" },
    { id: "conferenceRoom", kind: "toggle", title: "اتاق کنفرانس" },
    { id: "receptionHall", kind: "toggle", title: "سالن پذیرش" },
    { id: "signboard", kind: "toggle", title: "تابلو خور" },
    { id: "separateEntrance", kind: "toggle", title: "ورودی مجزا" },
    { id: "kitchen", kind: "toggle", title: "آشپزخانه" },
    approvedSaleHeatingBlock(),
    approvedGenericFacilitiesBlock(),
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedSaleCommercialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند" },
    { icon: "location", id: "commercialPosition", kind: "single", options: approvedCommercialPositionOptions, title: "موقعیت تجاری" },
    { icon: "settings", id: "ownershipStatus", kind: "single", options: approvedCommercialOwnershipOptions, title: "نوع مالکیت" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    approvedFloorBlock(),
    approvedTotalFloorsBlock("تعداد کل طبقات"),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedSaleCommercialSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 7, moreLabel: "مشاهده ۴۶ مورد دیگر", moreIcon: "left",
    },
    { icon: "agreement", id: "commercialLicense", kind: "single", options: approvedCommercialLicenseOptions, title: "مجوز تجاری" },
    { icon: "settings", id: "currentStatus", kind: "single", options: approvedBusinessCurrentStatusOptions, title: "وضعیت فعلی" },
    { kind: "loan" },
    approvedSaleHeatingBlock(),
    approvedGenericFacilitiesBlock(),
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedSaleIndustrialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedSaleFilterLandPositionOptions, title: "موقعیت زمین" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند" },
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "building", id: "industrialPropertyType", kind: "single", options: approvedIndustrialPropertyOptions, title: "نوع ملک" },
    { icon: "location", id: "accessType", kind: "single", options: approvedIndustrialAccessOptions, title: "دسترسی" },
    { icon: "settings", id: "currentStatus", kind: "single", options: approvedBusinessCurrentStatusOptions, title: "وضعیت فعلی" },
    { icon: "agreement", id: "commercialLicense", kind: "single", options: approvedCommercialLicenseOptions, title: "مجوز تجاری" },
    { kind: "loan" },
    approvedSaleHeatingBlock(),
    { icon: "settings", id: "facilities", kind: "multi", options: landFacilityItems, title: "امکانات" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedSaleHotelFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { icon: "building", id: "accommodationType", kind: "single", options: approvedHotelAccommodationOptions, title: "نوع اقامتگاه" },
    { icon: "settings", id: "hotelStars", kind: "single", options: approvedHotelStarOptions, title: "ستاره هتل" },
    { icon: "agreement", id: "documentType", kind: "single", options: approvedSaleFilterDocumentTypeOptions, title: "نوع سند" },
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedSaleFilterLandPositionOptions, title: "موقعیت زمین" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    approvedTotalFloorsBlock("تعداد طبقات"),
    { kind: "loan" },
    approvedSaleHeatingBlock(),
    {
      icon: "settings", id: "facilities", kind: "multi", options: approvedSaleHotelFacilities, title: "امکانات",
      more: true, moreLimit: 6, moreLabel: "نمایش ۲۸ مورد دیگر",
    },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentApartmentFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ آپارتمان", "area", "متر مربع", true),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    approvedFloorBlock(),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedRentApartmentSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 5, moreLabel: "مشاهده ۱۰ مورد دیگر", moreIcon: "down",
    },
    approvedTotalFloorsBlock("تعداد طبقات آپارتمان"),
    { icon: "floor", id: "unitsPerFloor", kind: "single", options: approvedSaleFilterUnitsPerFloorOptions, title: "تعداد واحد در طبقه" },
    { icon: "orientation", id: "unitType", kind: "single", options: approvedRentApartmentBuildingPositionOptions, title: "موقعیت ساختمان" },
    { icon: "orientation", id: "unitPosition", kind: "single", options: approvedSaleFilterUnitPositionOptions, title: "موقعیت واحد" },
    { icon: "building", id: "unitLayout", kind: "single", options: approvedRentUnitLayoutOptions, title: "تیپ واحد" },
    approvedSaleHeatingBlock(),
    approvedGenericFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentVillaHouseFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedRentVillaSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 3, moreLabel: "مشاهده ۱۰ مورد دیگر", moreIcon: "down",
    },
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedRentVillaLandPositionOptions, title: "موقعیت زمین" },
    { icon: "building", id: "buildingType", kind: "single", options: approvedRentVillaBuildingTypeOptions, title: "نوع بنا" },
    { icon: "building", id: "villaType", kind: "single", options: approvedRentVillaTypeOptions, title: "تیپ بنا" },
    approvedTotalFloorsBlock("تعداد طبقات"),
    approvedSaleHeatingBlock(),
    approvedGenericFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentOfficeFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    approvedFloorBlock(),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedRentOfficeSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 5, moreLabel: "مشاهده ۱۵ مورد دیگر", moreIcon: "down",
    },
    { icon: "settings", id: "currentStatus", kind: "single", options: approvedBusinessCurrentStatusOptions, title: "وضعیت فعلی" },
    { icon: "location", id: "officePosition", kind: "single", options: approvedOfficePositionOptions, title: "موقعیت اداری" },
    { id: "hasDocument", kind: "toggle", title: "سند اداری" },
    { id: "managementRoom", kind: "toggle", title: "اتاق مدیریت" },
    { id: "conferenceRoom", kind: "toggle", title: "اتاق کنفرانس" },
    { id: "receptionHall", kind: "toggle", title: "سالن پذیرش" },
    { id: "signboard", kind: "toggle", title: "تابلو خور" },
    { id: "separateEntrance", kind: "toggle", title: "ورودی مجزا" },
    { id: "kitchen", kind: "toggle", title: "آشپزخانه" },
    approvedRentBusinessHeatingBlock(),
    approvedRentBusinessFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentCommercialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    { icon: "location", id: "commercialPosition", kind: "single", options: approvedCommercialPositionOptions, title: "موقعیت تجاری" },
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    approvedFloorBlock(),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    {
      icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedRentCommercialSuitableOptions), title: "مناسب برای",
      more: true, moreLimit: 5, moreLabel: "مشاهده ۱۵ مورد دیگر", moreIcon: "down",
    },
    approvedRentBusinessHeatingBlock(),
    approvedRentBusinessFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentIndustrialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    { icon: "settings", id: "suitableFor", kind: "multi", options: asChipItems(approvedRentIndustrialSuitableOptions), title: "مناسب برای" },
    { icon: "agreement", id: "commercialLicense", kind: "single", options: approvedRentIndustrialLicenseOptions, title: "مجوز تجاری" },
    { icon: "settings", id: "facilities", kind: "multi", options: landFacilityItems, title: "امکانات" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedRentHotelFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    { icon: "settings", id: "hotelStars", kind: "single", options: approvedHotelStarOptions, title: "ستاره هتل" },
    { icon: "building", id: "accommodationType", kind: "single", options: approvedHotelAccommodationOptions, title: "نوع اقامتگاه" },
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    { icon: "year", id: "age", kind: "single", options: approvedSaleFilterAgeOptions, title: "سن ساخت" },
    approvedTotalFloorsBlock("تعداد طبقات"),
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedSaleFilterLandPositionOptions, title: "موقعیت زمین" },
    approvedRentBusinessHeatingBlock(),
    approvedRentBusinessFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}


function approvedDailyHeatingBlock(): MultiChoiceBlock {
  return {
    icon: "temperature",
    id: "heatingCooling",
    kind: "multi",
    options: approvedSaleFilterHeatingItems,
    title: "سرمایش و گرمایش",
    more: true,
    moreLimit: 6,
    moreLabel: "نمایش ۵ مورد دیگر",
  };
}

function approvedDailyFacilitiesBlock(): MultiChoiceBlock {
  return {
    icon: "settings",
    id: "facilities",
    kind: "multi",
    options: approvedDailyFacilities,
    title: "امکانات",
    more: true,
    moreLimit: 6,
    moreLabel: "نمایش ۱۹ مورد دیگر",
  };
}

function approvedDailyCapacityBlock(): SingleChoiceBlock {
  return {
    icon: "unitBed",
    id: "standardCapacity",
    kind: "single",
    options: approvedDailyCapacityOptions,
    title: "ظرفیت استاندارد",
    more: true,
    moreLimit: 5,
    moreLabel: "مشاهده همه ظرفیتها",
    moreIcon: "left",
  };
}

function getApprovedDailyApartmentFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    { icon: "building", id: "accommodationType", kind: "single", options: approvedDailyAccommodationOptions, title: "نوع اقامتگاه" },
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    approvedDailyCapacityBlock(),
    approvedFloorBlock(),
    approvedDailyHeatingBlock(),
    approvedDailyFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedDailyVillaFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    approvedDailyCapacityBlock(),
    approvedDailyHeatingBlock(),
    approvedDailyFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedDailyHotelFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    { icon: "building", id: "accommodationType", kind: "single", options: approvedDailyHotelAccommodationOptions, title: "نوع اقامتگاه" },
    { icon: "settings", id: "hotelStars", kind: "single", options: approvedDailyHotelRankOptions, title: "رتبه اقامتگاه" },
    approvedDailyHeatingBlock(),
    approvedDailyFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedDailyWorkspaceFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    { icon: "building", id: "spaceType", kind: "single", options: approvedDailyWorkspaceTypeOptions, title: "نوع فضا" },
    { icon: "bed", id: "rooms", kind: "multi", options: asChipItems(roomOptions), title: "تعداد اتاق" },
    approvedDailyCapacityBlock(),
    approvedFloorBlock(),
    approvedDailyHeatingBlock(),
    approvedDailyFacilitiesBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedProjectPartnershipFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    { icon: "agreement", id: "participationType", kind: "single", options: participationTypeOptions, title: "نوع مشارکت" },
    { icon: "settings", id: "currentStatus", kind: "single", options: partnershipCurrentStatusOptions, title: "وضعیت فعلی ملک" },
    { icon: "orientation", id: "landPosition", kind: "single", options: approvedPartnershipLandPositionOptions, title: "موقعیت زمین" },
    { icon: "agreement", id: "documentType", kind: "single", options: approvedPartnershipDocumentOptions, title: "نوع سند" },
    { id: "constructionPermit", kind: "toggle", title: "مجوز ساخت" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getApprovedProjectPresaleFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("projectPrice", "قیمت متری", "money", "تومان"),
    { icon: "building", id: "projectType", kind: "single", options: projectTypeOptions, title: "نوع پروژه" },
    { icon: "settings", id: "projectStatus", kind: "single", options: projectStatusOptions, title: "وضعیت پروژه" },
    approvedRentBusinessHeatingBlock(),
    approvedRentBusinessFacilitiesBlock(),
    approvedExchangeBlock(),
    { id: "saleTermsEnabled", kind: "toggle", title: "فروش شرایطی" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

function getPriceBlocks(transaction: TransactionType, category: CategoryKey): FilterBlock[] {
  if (category === "project-partnership") {
    return [createRangeBlock("builderSharePercent", "درصد مشارکت / درصد سهم", "percent", "درصد")];
  }

  if (transaction === "project") {
    return [createRangeBlock("projectPrice", "قیمت متری", "money", "تومان")];
  }

  if (transaction === "rent" && isDailyRentCategory(category)) {
    const blocks = [createRangeBlock("dailyPrice", "بازه قیمت", "money", "تومان")];
    if (category === "daily-hotel-apartment") return blocks;
    return [
      ...blocks,
      createRangeBlock("normalDailyPrice", "روزهای عادی", "money", "تومان"),
      createRangeBlock("weekendDailyPrice", "آخر هفته", "money", "تومان"),
      createRangeBlock("specialDailyPrice", "روزهای خاص", "money", "تومان"),
      createRangeBlock("extraPersonPrice", "هزینه هر نفر اضافه", "money", "تومان"),
    ];
  }

  if (transaction === "rent") {
    return [
      createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
      createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
      {
        icon: "exchange",
        id: "rentConversionPolicy",
        kind: "single",
        options: rentConversionPolicyOptions,
        title: "تبدیل رهن و اجاره",
      },
    ];
  }

  return [createRangeBlock("price", "قیمت", "money", "تومان")];
}

export function getFilterBlocks(transaction: TransactionType, category?: CategoryKey): FilterBlock[] {
  if (!category) return [];

  if (transaction === "rent" && category === "daily-apartment-suite") {
    return getApprovedDailyApartmentFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-garden-villa") {
    return getApprovedDailyVillaFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-hotel-apartment") {
    return getApprovedDailyHotelFilterBlocks();
  }

  if (transaction === "rent" && category === "daily-workspace") {
    return getApprovedDailyWorkspaceFilterBlocks();
  }

  if (transaction === "project" && category === "project-partnership") {
    return getApprovedProjectPartnershipFilterBlocks();
  }

  if (transaction === "project" && category === "project-presale") {
    return getApprovedProjectPresaleFilterBlocks();
  }

  if (transaction === "sale" && category === "apartment") {
    return getApprovedSaleApartmentFilterBlocks();
  }

  if (transaction === "sale" && category === "land") {
    return getApprovedSaleLandFilterBlocks();
  }

  if (transaction === "sale" && category === "garden-villa") {
    return getApprovedSaleGardenVillaFilterBlocks();
  }

  if (transaction === "sale" && category === "office") {
    return getApprovedSaleOfficeFilterBlocks();
  }

  if (transaction === "sale" && category === "commercial-unit") {
    return getApprovedSaleCommercialFilterBlocks();
  }

  if (transaction === "sale" && category === "factory-workshop") {
    return getApprovedSaleIndustrialFilterBlocks();
  }

  if (transaction === "sale" && category === "hotel-apartment") {
    return getApprovedSaleHotelFilterBlocks();
  }

  if (transaction === "rent" && category === "apartment") {
    return getApprovedRentApartmentFilterBlocks();
  }

  if (transaction === "rent" && category === "villa-house") {
    return getApprovedRentVillaHouseFilterBlocks();
  }

  if (transaction === "rent" && category === "office") {
    return getApprovedRentOfficeFilterBlocks();
  }

  if (transaction === "rent" && category === "commercial-unit") {
    return getApprovedRentCommercialFilterBlocks();
  }

  if (transaction === "rent" && category === "factory-workshop") {
    return getApprovedRentIndustrialFilterBlocks();
  }

  if (transaction === "rent" && category === "hotel-apartment") {
    return getApprovedRentHotelFilterBlocks();
  }

  const isPartnership = category === "project-partnership";
  const hideHeatingCooling = isPartnership || category === "land";
  const showFacilitiesSection = !isPartnership;

  const blocks: FilterBlock[] = [{ kind: "neighborhood" }];

  if (category === "project-presale") {
    blocks.push(...getProjectPresaleBlocks());
  } else {
    blocks.push(...getBasicFields(transaction, category).map(blockFromBasicField));
  }

  blocks.push(...getPriceBlocks(transaction, category));

  if (!isProjectCategory(category) || category === "project-partnership") {
    blocks.push(...getMoreFields(transaction, category).map(blockFromMoreFeatureField));
  }

  if (transaction === "sale") {
    if (category !== "garden-villa") {
      blocks.push({ kind: "loan" });
    }

    blocks.push({
      icon: "exchange",
      id: "exchangeWith",
      kind: "multi",
      options: exchangeTargets.map((label) => ({ id: label, label })),
      title: "معاوضه با",
    });
  } else if (transaction === "project" && category === "project-presale") {
    blocks.push({
      icon: "exchange",
      id: "exchangeWith",
      kind: "multi",
      options: exchangeTargets.map((label) => ({ id: label, label })),
      title: "معاوضه با",
    });
  }

  if (!hideHeatingCooling) {
    blocks.push({
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: getHeatingItems(transaction, category),
      title: "سرمایش و گرمایش",
    });
  }

  if (showFacilitiesSection) {
    blocks.push({
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: getFacilityItems(transaction, category),
      title: "امکانات",
    });
  }

  blocks.push({ kind: "advertiser" }, { kind: "publicationTime" }, { kind: "adFlags" });

  const dedupedBlocks = dedupeBlocks(blocks);

  if (transaction === "sale" && category === "apartment") {
    return sortSaleApartmentBlocks(dedupedBlocks);
  }

  return dedupedBlocks;
}

function getBlockOrderKey(block: FilterBlock) {
  if (block.kind === "neighborhood") return "neighborhood";
  if (block.kind === "loan") return "hasLoan";
  if (block.kind === "advertiser") return "advertiser";
  if (block.kind === "publicationTime") return "publicationTime";
  if (block.kind === "adFlags") return "adFlags";

  return block.id;
}

function sortSaleApartmentBlocks(blocks: FilterBlock[]) {
  const order = [
    "neighborhood",
    "meterage",
    "price",
    "age",
    "rooms",
    "floor",
    "renovated",
    "furnished",
    "hasLoan",
    "documentType",
    "unitType",
    "unitPosition",
    "heatingCooling",
    "facilities",
    "exchangeWith",
    "advertiser",
    "publicationTime",
    "adFlags",
  ];
  const orderMap = new Map(order.map((key, index) => [key, index]));

  return [...blocks]
    .filter((block) => getBlockOrderKey(block) !== "totalFloors")
    .sort((first, second) => {
      const firstOrder = orderMap.get(getBlockOrderKey(first)) ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = orderMap.get(getBlockOrderKey(second)) ?? Number.MAX_SAFE_INTEGER;

      return firstOrder - secondOrder;
    });
}

function dedupeBlocks(blocks: FilterBlock[]) {
  const seen = new Set<string>();

  return blocks.filter((block) => {
    const key = "id" in block ? `${block.kind}:${block.id}` : block.kind;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function getIcon(icon: IconName) {
  switch (icon) {
    case "bed":
      return <BedIcon />;
    case "building":
      return <BuildingIcon />;
    case "floor":
      return <FloorIcon />;
    case "location":
      return <LocationIcon />;
    case "money":
      return <MoneyIcon />;
    case "orientation":
      return <OrientationIcon />;
    case "ruler":
      return <RulerIcon />;
    case "settings":
      return <SettingsIcon />;
    case "temperature":
      return <TemperatureIcon />;
    case "year":
      return <YearIcon />;
    case "exchange":
      return <ExchangeIcon />;
    case "agreement":
      return <AgreementIcon />;
    case "unitBed":
      return <UnitBedIcon />;
    default:
      return <SettingsIcon />;
  }
}

export function SearchMapFilterPage() {
  return <AdvertisementFilterPage />;
}

export function AdvertisementFilterPage({
  applyBasePath = "/search",
  applyButtonLabel = "نمایش ۱۲٬۴۰۰ آگهی",
  backBasePath = "/search",
  title = "فیلترها",
}: AdvertisementFilterPageProps) {
  const [filters, setFilters] = useState<FilterState>(readInitialFiltersFromUrl);
  const [categoryPickerInitial, setCategoryPickerInitial] = useState<CategoryKey | undefined>(
    filters.category,
  );
  const focusTarget = useMemo(
    () => new URLSearchParams(window.location.search).get("focus"),
    [],
  );
  const contentRef = useRef<HTMLElement | null>(null);

  const filterBlocks = useMemo(
    () => getFilterBlocks(filters.transaction, filters.category),
    [filters.transaction, filters.category],
  );

  useEffect(() => {
    if (!filters.category || !contentRef.current) return;

    const target = new URLSearchParams(window.location.search).get("focus");
    if (!target) return;

    const timer = window.setTimeout(() => {
      const container = contentRef.current;
      const targetSection = container?.querySelector<HTMLElement>(`[data-filter-section="${target}"]`);

      if (!container || !targetSection) return;

      container.scrollTo({
        behavior: "smooth",
        top: Math.max(targetSection.offsetTop - 8, 0),
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [filterBlocks, filters.category]);

  const changeCategory = (
    transaction: TransactionType,
    category: CategoryKey,
  ) => {
    setCategoryPickerInitial(category);
    setFilters({
      ...initialFilters,
      transaction,
      category,
    });
  };

  const openCategoryPicker = () => {
    setCategoryPickerInitial(filters.category);
    setFilters((current) => ({
      ...current,
      category: undefined,
    }));
  };

  const setRangeValue = (id: string, key: keyof RangeValue, value: string) => {
    setFilters((current) => ({
      ...current,
      ranges: {
        ...current.ranges,
        [id]: {
          minimum: current.ranges[id]?.minimum ?? "",
          maximum: current.ranges[id]?.maximum ?? "",
          [key]: value,
        },
      },
    }));
  };

  const setSingleValue = (id: string, value: string) => {
    setFilters((current) => {
      const currentValue = current.singles[id];
      const isSameValue =
        currentValue !== undefined && normalizeExactFilterValue(currentValue) === normalizeExactFilterValue(value);

      return {
        ...current,
        singles: {
          ...current.singles,
          [id]: isSameValue ? undefined : value,
        },
      };
    });
  };

  const toggleMultiValue = (id: string, value: string) => {
    setFilters((current) => {
      const selected = current.multis[id] ?? [];
      const normalizedValue = normalizeExactFilterValue(value);
      const hasValue = selected.some((item) => normalizeExactFilterValue(item) === normalizedValue);

      return {
        ...current,
        multis: {
          ...current.multis,
          [id]: hasValue
            ? selected.filter((item) => normalizeExactFilterValue(item) !== normalizedValue)
            : [...selected, value],
        },
      };
    });
  };

  const setToggleValue = (id: string, checked: boolean) => {
    setFilters((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        [id]: checked,
      },
    }));
  };

  const applyFilters = () => {
    window.history.pushState(
      window.history.state ?? {},
      "",
      buildSearchUrl(filters, applyBasePath),
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (!filters.category) {
    return (
      <CategorySelectionScreen
        backBasePath={backBasePath}
        initialCategory={categoryPickerInitial}
        initialTransaction={filters.transaction}
        onConfirm={changeCategory}
      />
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          backTo={getBackToSearchPath(backBasePath)}
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          onBack={() => goBackOrNavigate(getBackToSearchPath(backBasePath))}
          title={title}
        />

        <div className="border-b-8 border-[#f0f0f0] bg-white px-4 py-3">
          <Button unstyled
            className="flex w-full items-center justify-between gap-3 text-right"
            dir="rtl"
            onClick={openCategoryPicker}
            type="button"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
              <LinearCategory className="w-6 h-6" />
              <Typography as="span" variant="label" size="large" weight="medium">انتخاب دسته</Typography>
            </div>

            <FormChoiceChip
              label={getApprovedSelectedCategoryLabel(filters.transaction, filters.category)}
              selected
              onClick={openCategoryPicker}
            />
          </Button>
        </div>
      </div>

      <main ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-0">
        {filterBlocks.map((block, index) => (
          <FilterBlockRenderer
            key={"id" in block ? `${block.kind}-${block.id}` : block.kind}
            applyButtonLabel={applyButtonLabel}
            block={block}
            filters={filters}
            nextBlock={filterBlocks[index + 1]}
            onApply={applyFilters}
            previousBlock={filterBlocks[index - 1]}
            setFilters={setFilters}
            setRangeValue={setRangeValue}
            setSingleValue={setSingleValue}
            setToggleValue={setToggleValue}
            toggleMultiValue={toggleMultiValue}
            focusTarget={focusTarget}
          />
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <div dir="rtl">
          <Button unstyled
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
            onClick={applyFilters}
            type="button"
          >
            {applyButtonLabel}
          </Button>
        </div>
      </footer>
    </PageFrame>
  );
}

type FilterSectionProps = {
  children: ReactNode;
  icon: ReactNode;
  sectionId?: string;
  title: ReactNode;
};

function FilterSection({ children, icon, sectionId, title }: FilterSectionProps) {
  return (
    <section className="scroll-mt-4 border-b-8 border-[#f0f0f0] bg-white p-4" data-filter-section={sectionId} dir="rtl">
      <div className="mb-2 flex h-8 items-center justify-start gap-2 text-[#4d4d4d]">
        {icon}
        <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
          {title}
        </Typography>
      </div>
      {children}
    </section>
  );
}

type ChipSectionProps = {
  icon: ReactNode;
  sectionId?: string;
  showFeatureIcons?: boolean;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
  onToggle: (value: string) => void;
  options: readonly ChipItem[];
  selected: string[];
  title: string;
};

function ChipSection({
  icon,
  sectionId,
  showFeatureIcons = false,
  more = false,
  moreLimit = 8,
  moreLabel,
  moreIcon,
  onToggle,
  options,
  selected,
  title,
}: ChipSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = more && options.length > moreLimit;
  const visibleOptions = canExpand && !expanded ? options.slice(0, moreLimit) : options;

  return (
    <FilterSection icon={icon} sectionId={sectionId} title={title}>
      <div className="flex flex-wrap justify-start gap-2" dir="rtl">
        {visibleOptions.map((option) => (
          <FormChoiceChip
            key={option.id}
            icon={
              showFeatureIcons ? (
                <FeatureChipIcon label={option.label} />
              ) : undefined
            }
            label={option.label}
            onClick={() => onToggle(option.id)}
            selected={selected.some((item) => normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id))}
          />
        ))}
      </div>
      {canExpand ? (
        <MoreButton
          count={options.length - moreLimit}
          expanded={expanded}
          label={moreLabel}
          icon={moreIcon}
          onClick={() => setExpanded((current) => !current)}
        />
      ) : null}
    </FilterSection>
  );
}

type ExchangeFilterSectionProps = {
  icon: ReactNode;
  onToggle: (value: string) => void;
  options: readonly ChipItem[];
  sectionId?: string;
  selected: string[];
  title: string;
};

const exchangePreviewLabels = ["ویلا", "خودرو", "آپارتمان", "خانه ویلایی", "زمین"];

function ExchangeFilterSection({
  icon,
  onToggle,
  options,
  sectionId,
  selected,
  title,
}: ExchangeFilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const orderedOptions = useMemo(() => {
    const optionByLabel = new Map(options.map((option) => [option.label, option]));
    const previewOptions = exchangePreviewLabels
      .map((label) => optionByLabel.get(label))
      .filter((option): option is ChipItem => Boolean(option));
    const previewIds = new Set(previewOptions.map((option) => option.id));

    return [
      ...previewOptions,
      ...options.filter((option) => !previewIds.has(option.id)),
    ];
  }, [options]);
  const visibleOptions = expanded ? orderedOptions : orderedOptions.slice(0, exchangePreviewLabels.length);
  const canExpand = orderedOptions.length > exchangePreviewLabels.length;

  return (
    <section
      className="scroll-mt-4 border-b-8 border-[#f0f0f0] bg-white px-4 pb-2 pt-4"
      data-filter-section={sectionId}
      dir="rtl"
    >
      <div className="flex h-6 items-center justify-start gap-2 text-[#4d4d4d]">
        {icon}
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]"
        >
          {title}
        </Typography>
      </div>

      <div className="mt-4 flex flex-wrap justify-start gap-2" dir="rtl">
        {visibleOptions.map((option) => (
          <Chip
            className="h-9"
            key={option.id}
            onClick={() => onToggle(option.id)}
            selected={selected.some(
              (item) => normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id),
            )}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {canExpand ? (
        <Button
          unstyled
          className="mx-auto mt-4 flex items-center justify-center gap-1 py-2.5 text-sm font-medium leading-5 text-[#0048c4]"
          onClick={() => setExpanded((current) => !current)}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            {expanded ? "نمایش کمتر" : "مشاهده همه معاوضه‌ها"}
          </Typography>
          <ChevronDownIcon isOpen={expanded} />
        </Button>
      ) : null}
    </section>
  );
}

function FeatureChipIcon({ label }: { label: string }) {
  return <FeatureIcon feature={label} className="h-5 w-5 shrink-0 text-[#4d4d4d]" />;
}

type SingleChoiceSectionProps = {
  icon: ReactNode;
  sectionId?: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
  onSelect: (value: string) => void;
  options: readonly string[];
  selected?: string;
  title: string;
};

function SingleChoiceSection({
  icon,
  sectionId,
  more = false,
  moreLimit = 8,
  moreLabel,
  moreIcon,
  onSelect,
  options,
  selected,
  title,
}: SingleChoiceSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = more && options.length > moreLimit;
  const visibleOptions = canExpand && !expanded ? options.slice(0, moreLimit) : options;

  return (
    <FilterSection icon={icon} sectionId={sectionId} title={title}>
      <div className="flex flex-wrap justify-start gap-2" dir="rtl">
        {visibleOptions.map((option) => (
          <FormChoiceChip
            key={option}
            label={option}
            onClick={() => onSelect(option)}
            selected={
              selected !== undefined && normalizeExactFilterValue(selected) === normalizeExactFilterValue(option)
            }
          />
        ))}
      </div>
      {canExpand ? (
        <MoreButton
          count={options.length - moreLimit}
          expanded={expanded}
          label={moreLabel}
          icon={moreIcon}
          onClick={() => setExpanded((current) => !current)}
        />
      ) : null}
    </FilterSection>
  );
}

function MoreButton({
  count,
  expanded,
  icon = "down",
  label,
  onClick,
}: {
  count: number;
  expanded: boolean;
  icon?: "down" | "left";
  label?: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      className="mx-auto mt-3 flex h-10 items-center justify-center gap-1.5 pt-2.5 pb-0.5 px-3 text-sm font-medium leading-5 text-[#0048c4]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium" weight="medium">
        {expanded ? "نمایش کمتر" : label ?? `نمایش ${toPersianDigits(count)} مورد بیشتر`}
      </Typography>
      {icon === "left" && !expanded ? <ChevronLeftIcon /> : <ChevronDownIcon isOpen={expanded} />}
    </Button>
  );
}

function LocationIcon() {
  return <LinearLocation aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function RulerIcon() {
  return <LinearRuler aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function MoneyIcon() {
  return <LinearMoney aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function BedIcon() {
  return <LinearBed aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function BuildingIcon() {
  return <LinearBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function FloorIcon() {
  return <LinearFloor aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function YearIcon() {
  return <LinearApartmentAge aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function OrientationIcon() {
  return <LinearNavigation aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function TemperatureIcon() {
  return <LinearTemperature aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function SettingsIcon() {
  return <LinearSettingBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function ExchangeIcon() {
  return <LinearArrowLeftRight aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function AgreementIcon() {
  return <LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />;
}

function UnitBedIcon() {
  return <LinearBed aria-hidden="true" className="h-6 w-6 shrink-0" />;
}


type CategorySelectionScreenProps = {
  backBasePath?: string;
  initialCategory?: CategoryKey;
  initialTransaction: TransactionType;
  onConfirm: (transaction: TransactionType, category: CategoryKey) => void;
};

function CategorySelectionScreen({
  backBasePath = "/search",
  initialCategory,
  initialTransaction,
  onConfirm,
}: CategorySelectionScreenProps) {
  const [draftTransaction, setDraftTransaction] =
    useState<TransactionType>(initialTransaction);

  const [draftCategory, setDraftCategory] = useState<CategoryKey | undefined>(
    initialCategory,
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          backTo={getBackToSearchPath(backBasePath)}
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          onBack={() => goBackOrNavigate(getBackToSearchPath(backBasePath))}
          title="انتخاب دسته‌بندی"
        />

        <div className="bg-[#f0f0f0] px-4 py-2">
          <FormSegmentedControl
            ariaLabel="نوع معامله"
            onChange={(transaction) => {
              setDraftTransaction(transaction as TransactionType);
              setDraftCategory(undefined);
            }}
            options={transactionTabs}
            value={draftTransaction}
          />
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-0 pt-4">
        {categoryGroupsByTransaction[draftTransaction].map((group) => (
          <section key={group.title} className="mb-6 last:mb-0">
            <Typography as="h2" variant="title" size="medium" weight="medium" className="mb-4 border-b border-[#e6e6e6] pb-2 text-right text-base font-medium text-[#808080]">
              {group.title}
            </Typography>

            <div className="flex flex-wrap justify-start gap-2" dir="rtl">
              {group.items.map((item) => (
                <FormChoiceChip
                  key={item}
                  label={categoryLabels[item]}
                  onClick={() => setDraftCategory(item)}
                  selected={draftCategory === item}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <Button unstyled
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftCategory}
          onClick={() => {
            if (!draftCategory) return;
            onConfirm(draftTransaction, draftCategory);
          }}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </PageFrame>
  );
}

function getFilterSectionAnchor(block: FilterBlock) {
  if (block.kind === "neighborhood") return "neighborhood";
  if (block.kind === "range") {
    if (["meterage", "landArea", "buildingArea", "projectMeterage"].includes(block.id)) return "area";
    if (["price", "projectPrice", "dailyPrice", "rentPrice", "mortgagePrice"].includes(block.id)) return "price";

    return block.id;
  }
  if ("id" in block) return block.id;

  return block.kind;
}

type FilterBlockRendererProps = {
  applyButtonLabel: string;
  block: FilterBlock;
  filters: FilterState;
  focusTarget?: string | null;
  nextBlock?: FilterBlock;
  onApply: () => void;
  previousBlock?: FilterBlock;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  setRangeValue: (id: string, key: keyof RangeValue, value: string) => void;
  setSingleValue: (id: string, value: string) => void;
  setToggleValue: (id: string, checked: boolean) => void;
  toggleMultiValue: (id: string, value: string) => void;
};

function FilterBlockRenderer({
  applyButtonLabel,
  block,
  filters,
  focusTarget,
  nextBlock,
  onApply,
  previousBlock,
  setFilters,
  setRangeValue,
  setSingleValue,
  setToggleValue,
  toggleMultiValue,
}: FilterBlockRendererProps) {
  switch (block.kind) {
    case "neighborhood":
      return (
        <NeighborhoodFilterSection
          applyButtonLabel={applyButtonLabel}
          sectionId={getFilterSectionAnchor(block)}
          focusTarget={focusTarget}
          onApply={onApply}
          selectedNeighborhoods={filters.neighborhoods}
          onChange={(neighborhoods) =>
            setFilters((current) => ({ ...current, neighborhoods }))
          }
        />
      );

    case "range": {
      const value = filters.ranges[block.id] ?? { minimum: "", maximum: "" };

      if (block.variant === "money") {
        return (
          <MoneyRangeSection
            sectionId={getFilterSectionAnchor(block)}
            title={block.title}
            minimum={value.minimum}
            maximum={value.maximum}
            onMinimumChange={(nextValue) => setRangeValue(block.id, "minimum", nextValue)}
            onMaximumChange={(nextValue) => setRangeValue(block.id, "maximum", nextValue)}
          />
        );
      }

      if (block.variant === "area") {
        return (
          <AreaRangeSection
            sectionId={getFilterSectionAnchor(block)}
            title={block.title}
            unit={block.unit}
            showUnitInTitle={block.showUnitInTitle}
            minimum={value.minimum}
            maximum={value.maximum}
            onMinimumChange={(nextValue) => setRangeValue(block.id, "minimum", nextValue)}
            onMaximumChange={(nextValue) => setRangeValue(block.id, "maximum", nextValue)}
          />
        );
      }

      return (
        <NumberRangeSection
          sectionId={getFilterSectionAnchor(block)}
          title={block.title}
          unit={block.unit}
          minimum={value.minimum}
          maximum={value.maximum}
          onMinimumChange={(nextValue) => setRangeValue(block.id, "minimum", nextValue)}
          onMaximumChange={(nextValue) => setRangeValue(block.id, "maximum", nextValue)}
        />
      );
    }

    case "time":
      return (
        <TimeFilterSection
          sectionId={getFilterSectionAnchor(block)}
          title={block.title}
          value={filters.singles[block.id] ?? ""}
          onChange={(value) => setSingleValue(block.id, value)}
        />
      );

    case "date":
      return (
        <DateFilterSection
          sectionId={getFilterSectionAnchor(block)}
          title={block.title}
          value={filters.singles[block.id] ?? ""}
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              singles: { ...current.singles, [block.id]: value || undefined },
            }))
          }
        />
      );

    case "single":
      return (
        <SingleChoiceSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          more={block.more ?? (block.id !== "age" && block.options.length > 8)}
          moreLimit={block.moreLimit}
          moreLabel={block.moreLabel}
          moreIcon={block.moreIcon}
          onSelect={(value) => setSingleValue(block.id, value)}
          options={block.options}
          selected={filters.singles[block.id]}
          title={block.title}
        />
      );

    case "multi":
      if (block.id === "exchangeWith") {
        return (
          <ExchangeFilterSection
            icon={getIcon(block.icon)}
            sectionId={getFilterSectionAnchor(block)}
            onToggle={(value) => toggleMultiValue(block.id, value)}
            options={block.options}
            selected={filters.multis[block.id] ?? []}
            title={block.title}
          />
        );
      }

      return (
        <ChipSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          showFeatureIcons={block.id === "heatingCooling" || block.id === "facilities"}
          more={block.more ?? (block.id === "facilities" && block.options.length > 6)}
          moreLimit={block.moreLimit ?? (block.id === "facilities" ? 6 : 8)}
          moreLabel={block.moreLabel}
          moreIcon={block.moreIcon}
          onToggle={(value) => toggleMultiValue(block.id, value)}
          options={block.options}
          selected={filters.multis[block.id] ?? []}
          title={block.title}
        />
      );

    case "toggle": {
      const startsBooleanGroup = previousBlock?.kind !== "toggle";
      const endsBooleanGroup = nextBlock?.kind !== "toggle" && nextBlock?.kind !== "loan";

      return (
        <SwitchOnlySection
          checked={Boolean(filters.toggles[block.id])}
          groupEnd={endsBooleanGroup}
          groupStart={startsBooleanGroup}
          label={block.title}
          onChange={(checked) => setToggleValue(block.id, checked)}
        />
      );
    }

    case "loan":
      return (
        <LoanFilterSection
          checked={Boolean(filters.toggles.hasLoan)}
          groupStart={previousBlock?.kind !== "toggle"}
          onChange={(checked) => setToggleValue("hasLoan", checked)}
        />
      );

    case "advertiser":
      return (
        <SelectOnlySection
          label="آگهی دهنده"
          options={advertiserOptions}
          sectionId={getFilterSectionAnchor(block)}
          topPadding
          value={filters.advertiser}
          onChange={(advertiser) =>
            setFilters((current) => ({
              ...current,
              advertiser,
            }))
          }
        />
      );

    case "publicationTime":
      return (
        <SelectOnlySection
          label="زمان انتشار آگهی"
          options={publicationTimeOptions}
          sectionId={getFilterSectionAnchor(block)}
          value={filters.publicationTime}
          onChange={(publicationTime) =>
            setFilters((current) => ({
              ...current,
              publicationTime,
            }))
          }
        />
      );

    case "adFlags":
      return (
        <section className="bg-white px-4 pb-2" dir="rtl">
          <CheckboxRow
            bottomFilter
            checked={filters.featured}
            divider
            label="آگهی ویژه"
            onChange={(featured) =>
              setFilters((current) => ({ ...current, featured }))
            }
          />

          <CheckboxRow
            bottomFilter
            checked={filters.hasPhoto}
            divider
            label="آگهی با عکس"
            onChange={(hasPhoto) =>
              setFilters((current) => ({ ...current, hasPhoto }))
            }
          />

          <CheckboxRow
            bottomFilter
            checked={filters.hasVideo}
            label="آگهی با ویدیو"
            onChange={(hasVideo) =>
              setFilters((current) => ({ ...current, hasVideo }))
            }
          />
        </section>
      );

    default:
      return null;
  }
}

type NeighborhoodFilterSectionProps = {
  applyButtonLabel: string;
  focusTarget?: string | null;
  onApply: () => void;
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  sectionId?: string;
  selectedNeighborhoods: SelectedNeighborhood[];
};

function NeighborhoodFilterSection({
  applyButtonLabel,
  focusTarget,
  onApply,
  onChange,
  sectionId,
  selectedNeighborhoods,
}: NeighborhoodFilterSectionProps) {
  const shouldAutoOpen = useOpenOnFilterFocus(sectionId, focusTarget);
  const [isPickerOpen, setIsPickerOpen] = useState(shouldAutoOpen);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(
    query.trim(),
    neighborhoodSearchDebounceMs,
  );
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const canSearch = debouncedQuery.length >= minNeighborhoodSearchLength;
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isPickerOpen && Boolean(cityId),
    page: 1,
    perPage: 30,
    q: canSearch ? debouncedQuery : "",
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((item) => item.id)),
    [selectedNeighborhoods],
  );

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const nextNeighborhood = toSelectedNeighborhood(neighborhood);

    onChange(
      selectedIds.has(nextNeighborhood.id)
        ? selectedNeighborhoods.filter((item) => item.id !== nextNeighborhood.id)
        : [...selectedNeighborhoods, nextNeighborhood],
    );
  };

  const removeNeighborhood = (id: string) => {
    onChange(selectedNeighborhoods.filter((item) => item.id !== id));
  };

  return (
    <section className="scroll-mt-4 border-b-8 border-[#f0f0f0] bg-white px-4 py-2" data-filter-section={sectionId} dir="rtl">
      <Button unstyled
        className="flex min-h-10 w-full items-center justify-between gap-3 text-right"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2 text-base font-medium leading-6 text-[#1a1a1a]">
          <LinearLocation className="w-6 h-6" />
          <Typography as="span" variant="label" size="large" weight="medium">محله</Typography>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4]">
          <Typography as="span" variant="label" size="medium" weight="medium">انتخاب</Typography>
          <LinearArrowLeft1 className="w-5 h-5" />
        </div>
      </Button>

      {selectedNeighborhoods.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2">
          {selectedNeighborhoods.map((item) => (
            <FormChoiceChip
              key={item.id}
              label={item.name}
              onClick={() => removeNeighborhood(item.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}

      {isPickerOpen ? (
        <div className="fixed inset-0 z-[1100] flex justify-center bg-[#f0f0f0]">
          <PageFrame
            className="relative flex min-h-0 max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
            variant="flush"
          >
            <div className="shrink-0 bg-[#f0f0f0]">
              <TopBar
                centerClassName="px-0"
                centerSlot={
                  <label className="flex h-12 w-full min-w-0 items-center rounded-xl border border-[#808080] bg-white px-4 focus-within:border-[#0048c4]" dir="rtl">
                    <input
                      autoFocus
                      className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [&::-webkit-search-cancel-button]:hidden"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="جستجو محله"
                      type="search"
                      value={query}
                    />
                  </label>
                }
                className="bg-[#f0f0f0]"
                contentClassName="pl-4 pr-2"
                onBack={() => setIsPickerOpen(false)}
                placement="inline"
              />

              {selectedNeighborhoods.length > 0 ? (
                <div
                  className="flex min-h-12 shrink-0 items-center justify-start gap-2 overflow-x-auto bg-[#f0f0f0] px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  dir="rtl"
                >
                  {selectedNeighborhoods.map((item) => (
                    <FormChoiceChip
                      key={item.id}
                      label={item.name}
                      onClick={() => removeNeighborhood(item.id)}
                      removable
                      selected
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4" dir="rtl">
              {!cityId ? (
                <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full px-2 py-4 text-center text-sm font-normal leading-6 text-[#808080]">
                  برای انتخاب محله، ابتدا شهر را انتخاب کنید.
                </Typography>
              ) : neighborhoodsQuery.isLoading ? (
                <div>
                  {Array.from({ length: 7 }, (_, index) => (
                    <div className="flex min-h-[88px] animate-pulse items-center justify-between gap-5 py-3" key={index}>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="mr-auto h-5 w-28 rounded bg-[#f0f0f0]" />
                        <div className="mr-auto h-4 w-4/5 rounded bg-[#f4f4f4]" />
                      </div>
                      <div className="h-[18px] w-[18px] rounded-sm bg-[#eeeeee]" />
                    </div>
                  ))}
                </div>
              ) : neighborhoodsQuery.isError ? (
                <div className="mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7 text-[#a43232]">
                  دریافت محله‌ها با خطا مواجه شد.
                  <Button unstyled className="mt-3 font-semibold text-[#0048c4]" onClick={() => void neighborhoodsQuery.refetch()} type="button">
                    تلاش دوباره
                  </Button>
                </div>
              ) : neighborhoods.length > 0 ? (
                <div>
                  {neighborhoods.map((neighborhood) => {
                    const neighborhoodId = getNeighborhoodOptionId(neighborhood);
                    const description = getNeighborhoodDescription(neighborhood);
                    const isSelected = selectedIds.has(neighborhoodId);

                    return (
                      <Button unstyled
                        aria-pressed={isSelected}
                        className="flex min-h-[88px] w-full items-center justify-between gap-5 bg-white py-3 text-right text-[#1a1a1a] outline-none [-webkit-tap-highlight-color:transparent] hover:bg-white active:bg-white focus:bg-white focus:outline-none focus-visible:bg-white focus-visible:outline-none"
                        key={neighborhoodId}
                        onClick={() => toggleNeighborhood(neighborhood)}
                        type="button"
                      >
                        <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                          <Typography as="span" variant="body" size="medium" weight="regular" className="block text-base font-normal leading-6 text-[#1a1a1a]">
                            {neighborhood.name}
                          </Typography>
                          {description ? (
                            <Typography as="span" variant="body" size="small" weight="regular" className="mt-0.5 block line-clamp-2 text-sm font-normal leading-6 text-[#a6a6a6]">
                              {description}
                            </Typography>
                          ) : null}
                        </Typography>
                        <ChoiceIndicator checked={isSelected} />
                      </Button>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                <SearchEmptyState compact />
              ) : (
                <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full px-2 py-4 text-center text-sm font-normal leading-6 text-[#808080]">
                  محله‌ای برای این شهر ثبت نشده است.
                </Typography>
              )}
            </main>

            <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
              <Button unstyled
                className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
                onClick={onApply}
                type="button"
              >
                {applyButtonLabel}
              </Button>
            </footer>
          </PageFrame>
        </div>
      ) : null}
    </section>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <LinearArrowDown1
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-[#4d4d4d] transition-transform ${isOpen ? "rotate-180" : ""}`}
    />
  );
}

function ChevronLeftIcon() {
  return <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5 shrink-0" />;
}

function ClearCircleIcon() {
  return <LinearCancelCircle aria-hidden="true" className="h-5 w-5" />;
}

type RangeSectionProps = {
  sectionId?: string;
  title: string;
  unit?: string;
  minimum: string;
  maximum: string;
  onMinimumChange: (value: string) => void;
  onMaximumChange: (value: string) => void;
};

function AreaRangeSection({
  sectionId,
  title,
  unit,
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
  showUnitInTitle = false,
}: RangeSectionProps & { showUnitInTitle?: boolean }) {
  const titleUnit = (unit ?? "متر").replace(/\s+/g, "");
  const normalizedTitle = showUnitInTitle ? (
    <>
      {title}
      {" "}
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-[#4d4d4d]"
      >
        ({titleUnit})
      </Typography>
    </>
  ) : title.includes("متراژ") ? (
    <>
      متراژ
      {" "}
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-[#4d4d4d]"
      >
        (متر)
      </Typography>
    </>
  ) : title;

  return (
    <FilterSection icon={<RulerIcon />} sectionId={sectionId} title={normalizedTitle}>
      <div className="flex items-center gap-3" dir="rtl">
        <RangeSelectField
          label="حداقل"
          onChange={onMinimumChange}
          value={minimum}
        />

        <RangeSelectField
          label="حداکثر"
          onChange={onMaximumChange}
          value={maximum}
        />
      </div>
    </FilterSection>
  );
}

function TimeFilterSection({
  sectionId,
  title,
  value,
  onChange,
}: {
  sectionId?: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FilterSection icon={<LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />} sectionId={sectionId} title={title}>
      <TextField
        className="text-sm"
        containerClassName="w-full"
        dir="ltr"
        label={title}
        onChange={(event) => onChange(event.target.value)}
        onClear={() => onChange("")}
        placeholder={title}
        type="time"
        value={value}
      />
    </FilterSection>
  );
}

function DateFilterSection({
  sectionId,
  title,
  value,
  onChange,
}: {
  sectionId?: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FilterSection icon={<LinearAgreement aria-hidden="true" className="h-6 w-6 shrink-0" />} sectionId={sectionId} title={title}>
        <Button
          unstyled
          className="flex h-12 w-full items-center justify-between rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm text-[#1a1a1a]"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span>{value || "انتخاب تاریخ"}</span>
          <LinearArrowDown1 aria-hidden="true" className="h-5 w-5 text-[#666666]" />
        </Button>
      </FilterSection>
      <JalaliDatePickerSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={(nextValue) => {
          onChange(nextValue);
          setIsOpen(false);
        }}
        title={title}
        value={value}
      />
    </>
  );
}

function NumberRangeSection({
  sectionId,
  title,
  unit,
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
}: RangeSectionProps) {
  return (
    <FilterSection icon={<RulerIcon />} sectionId={sectionId} title={title}>
      <div className="flex items-center gap-3" dir="rtl">
        <FormTextField
          badge={unit}
          className="flex-1"
          label="حداقل"
          onChange={(event) => onMinimumChange(formatPersianPlainNumber(event.target.value))}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          value={formatPersianPlainNumber(minimum)}
        />

        <FormTextField
          badge={unit}
          className="flex-1"
          label="حداکثر"
          onChange={(event) => onMaximumChange(formatPersianPlainNumber(event.target.value))}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          value={formatPersianPlainNumber(maximum)}
        />
      </div>
    </FilterSection>
  );
}

export function RangeSelectField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const displayValue = formatPersianPlainNumber(value);

  const closeSheet = () => {
    setIsOpen(false);
    setIsCustomInputVisible(false);
    setCustomValue("");
  };

  const openCustomInput = () => {
    setCustomValue(formatPersianPlainNumber(value));
    setIsCustomInputVisible(true);
  };

  return (
    <div className="min-w-0 flex-1">
      <Button unstyled
        className="flex h-12 w-full items-center justify-between rounded-xl border border-[#d9d9d9] bg-white px-3 text-sm font-normal leading-5 [direction:ltr]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <ChevronDownIcon isOpen={isOpen} />
        <Typography as="span" variant="body" size="medium" weight="regular" className={`min-w-0 truncate text-right [direction:rtl] ${displayValue ? "text-[#1a1a1a]" : "text-[#a6a6a6]"}`}>
          {displayValue || label}
        </Typography>
      </Button>

      <BottomSheet
        ariaLabel={isCustomInputVisible ? customRangeOptionLabel : label}
        contentClassName="min-h-0 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2"
        isOpen={isOpen}
        onBack={isCustomInputVisible ? () => setIsCustomInputVisible(false) : closeSheet}
        onClose={closeSheet}
        showHeaderDivider
        title={isCustomInputVisible ? customRangeOptionLabel : label}
        variant="form"
      >
        {isCustomInputVisible ? (
          <div className="space-y-4 pt-2" dir="rtl">
            <FormTextField
              badge="متر"
              label="مقدار دلخواه"
              onChange={(event) => setCustomValue(formatPersianPlainNumber(event.target.value))}
              onClear={() => setCustomValue("")}
              placeholder="مقدار دلخواه را وارد کنید"
              value={customValue}
            />
            <Button
              disabled={!normalizeRangeNumber(customValue)}
              fullWidth
              onClick={() => {
                const normalizedCustomValue = normalizeRangeNumber(customValue);

                if (!normalizedCustomValue) return;

                onChange(normalizedCustomValue);
                closeSheet();
              }}
              size="sm"
            >
              تایید مقدار
            </Button>
          </div>
        ) : (
          <div className="space-y-1" dir="rtl">
            {value ? (
              <Button unstyled
                className="flex h-12 w-full items-center justify-center rounded-[10px] px-2 text-center text-sm font-medium leading-5 text-[#0048c4] active:bg-[#0048c40a]"
                onClick={() => {
                  onChange("");
                  closeSheet();
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">پاک کردن انتخاب</Typography>
              </Button>
            ) : null}

            {areaRangeOptions.map((option) => {
              const normalizedOption = normalizeRangeNumber(option);
              const selected = Boolean(normalizedOption) && normalizeRangeNumber(value) === normalizedOption;

              return (
                <Button unstyled
                  aria-pressed={selected}
                  className={`flex h-12 w-full items-center justify-center rounded-[10px] px-2 text-center text-sm font-medium leading-5 ${
                    selected ? "bg-[#0048c40a] text-[#0048c4]" : "bg-white text-[#1a1a1a]"
                  }`}
                  key={option}
                  onClick={() => {
                    if (option === customRangeOptionLabel) {
                      openCustomInput();
                      return;
                    }

                    onChange(normalizedOption);
                    closeSheet();
                  }}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular">{option}</Typography>
                </Button>
              );
            })}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function MoneyRangeSection({
  sectionId,
  title,
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
}: RangeSectionProps) {
  return (
    <FilterSection icon={<MoneyIcon />} sectionId={sectionId} title={title}>
      <div className="flex flex-col gap-4">
        <FormTextField
          badge="تومان"
          label="حداقل"
          onChange={(event) => onMinimumChange(normalizeRangeNumber(event.target.value))}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          supportingText={getMoneySupportingText(minimum)}
          value={formatMoneyInputValue(minimum)}
        />

        <FormTextField
          badge="تومان"
          label="حداکثر"
          onChange={(event) => onMaximumChange(normalizeRangeNumber(event.target.value))}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          supportingText={getMoneySupportingText(maximum)}
          value={formatMoneyInputValue(maximum)}
        />
      </div>
    </FilterSection>
  );
}

function SwitchOnlySection({
  checked,
  groupEnd,
  groupStart,
  label,
  onChange,
}: {
  checked: boolean;
  groupEnd: boolean;
  groupStart: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section
      className={`bg-white px-4 ${groupStart ? "pt-[7.5px]" : ""} ${
        groupEnd ? "border-b-8 border-[#f0f0f0] pb-[7.5px]" : ""
      }`}
      dir="rtl"
    >
      <CheckboxRow
        checked={checked}
        divider={!groupEnd}
        label={label}
        onChange={onChange}
      />
    </section>
  );
}

function LoanFilterSection({
  checked,
  groupStart,
  onChange,
}: {
  checked: boolean;
  groupStart: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section
      className={`border-b-8 border-[#f0f0f0] bg-white px-4 pb-[7.5px] ${
        groupStart ? "pt-[7.5px]" : ""
      }`}
      data-filter-section="hasLoan"
      dir="rtl"
    >
      <CheckboxRow checked={checked} label="با وام" onChange={onChange} />
    </section>
  );
}

function CheckboxRow({
  checked,
  divider = false,
  label,
  onChange,
}: {
  bottomFilter?: boolean;
  checked: boolean;
  divider?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Button unstyled
      aria-pressed={checked}
      className={`flex h-[59px] w-full items-center justify-between gap-3 bg-white pl-3 text-right ${
        divider ? "border-b border-[#f0f0f0]" : ""
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <Typography as="span" variant="title" size="medium" weight="medium" className="min-w-0 flex-1 text-[#1a1a1a]">
        {label}
      </Typography>
      <ChoiceIndicator checked={checked} className="rounded" />
    </Button>
  );
}

function SelectOnlySection({
  label,
  onChange,
  options,
  sectionId,
  topPadding = false,
  value,
}: {
  label: string;
  onChange: (value: string | undefined) => void;
  options: readonly string[];
  sectionId?: string;
  topPadding?: boolean;
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className={`bg-white px-4 ${topPadding ? "pt-2" : ""}`}
      data-filter-section={sectionId}
      dir="rtl"
    >
      <div className="flex h-[59px] w-full items-center justify-between gap-3 border-b border-[#f0f0f0] text-right">
        <Button
          unstyled
          className="flex h-full min-w-0 flex-1 items-center text-right"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Typography as="span" variant="label" size="large" weight="medium" className="truncate text-[#1a1a1a]">
            {label}
          </Typography>
        </Button>

        {value ? (
          <Chip
            aria-label={`حذف ${value}`}
            className="h-9 max-w-[55%] bg-[#edf0fb] px-2 py-2 [&_svg]:h-4 [&_svg]:w-4"
            onClick={() => onChange(undefined)}
            removable
            selected
          >
            {value}
          </Chip>
        ) : (
          <Button
            unstyled
            className="flex h-full shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4]"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">
              انتخاب
            </Typography>
            <ChevronLeftIcon />
          </Button>
        )}
      </div>

      <BottomSheet
        ariaLabel={label}
        contentClassName="px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showHeaderDivider
        title={label}
        variant="actions"
      >
        <div className="space-y-1" dir="rtl">
          {value ? (
            <Button unstyled
              className="flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right text-sm font-medium leading-5 text-[#0048c4] active:bg-[#0048c40a]"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">پاک کردن انتخاب</Typography>
              <ClearCircleIcon />
            </Button>
          ) : null}

          {options.map((option) => {
            const selected = value === option;

            return (
              <Button unstyled
                aria-pressed={selected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right text-sm font-medium leading-5 ${
                  selected ? "bg-[#0048c40a] text-[#0048c4]" : "bg-white text-[#1a1a1a]"
                }`}
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">{option}</Typography>
                <ChoiceIndicator checked={selected} />
              </Button>
            );
          })}
        </div>
      </BottomSheet>
    </section>
  );
}
