import { useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  FormChoiceChip,
  FormSegmentedControl,
  FormTextField,
} from "../../components/form/FormControls";
import { BottomSheet } from "../../components/BottomSheet";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { ChoiceIndicator } from "../../components/ui/Choice";
import { TopBar } from "../../components/TopBar";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { getFeatureIconSrc } from "../../lib/handleFeaturesIcons";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import { formatBigNumber, formatPrice } from "../../lib/MoneyHandler";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import {
  basicPropertyFieldsByListingType,
  defaultBasicPropertyFields,
  facilityItems,
  heatingItems,
  landFacilityItems,
  exchangeTargets,
  moreFeatureFieldsByCategory,
  moreFeatureFieldsByListingType,
  moreFeatureOptions,
  participationTypeOptions,
  projectFloorOptions,
  projectPositionOptions,
  projectRoomOptions,
  projectStatusOptions,
} from "../newAd/data";
import type { BasicPropertyField, ChipItem, MoreFeatureField } from "../newAd/types";
import { Typography } from "../../components/ui/Typography";

type TransactionType = "sale" | "rent" | "project";

type CategoryKey =
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
  | "exchange";

type RangeBlock = {
  id: string;
  kind: "range";
  title: string;
  unit?: string;
  variant: "area" | "money" | "number" | "percent";
};

type SingleChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "single";
  options: readonly string[];
  title: string;
};

type MultiChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "multi";
  options: readonly ChipItem[];
  title: string;
};

type ToggleBlock = {
  id: string;
  kind: "toggle";
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

function getAdvertiseFormCode(transaction: TransactionType, category: CategoryKey) {
  return formCodeByListingKey[`${transaction}:${category}`] ?? `${transaction}-${category}`;
}

function getListingFromFormCode(formCode: string): { transaction: TransactionType; category: CategoryKey } | null {
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

const customRangeOptionLabel = "افزودن مقدار دلخواه";

const areaRangeOptions = [
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
  customRangeOptionLabel,
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
  const areaRange = getRange(filters, [
    "meterage",
    "landArea",
    "buildingArea",
    "projectMeterage",
  ]);
  const priceRange = getRange(filters, [
    "price",
    "projectPrice",
    "dailyPrice",
    "rentPrice",
    "mortgagePrice",
  ]);
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

  const queryString = params.toString();
  const pathname = returnTo ? baseUrl.pathname : applyBasePath;

  return queryString ? `${pathname}?${queryString}` : pathname;
}

const categoryLabels: Record<CategoryKey, string> = {
  apartment: "آپارتمان",
  "villa-house": "خانه ویلایی",
  "garden-villa": "باغ، ویلا",
  land: "زمین",
  office: "واحد اداری",
  "commercial-unit": "واحد تجاری",
  warehouse: "انبار، سوله",
  "hotel-apartment": "هتل، هتل آپارتمان",
  "factory-workshop": "کارخانه، کارگاه",
  "daily-apartment-suite": "آپارتمان، سوئیت",
  "daily-garden-villa": "باغ، ویلا",
  "daily-hotel-apartment": "هتل، هتل آپارتمان",
  "daily-workspace": "دفاتر کار، غرفه، نمایشگاه",
  "project-presale": "پیش فروش، فروش پروژه",
  "project-partnership": "مشارکت",
};

const categoryGroupsByTransaction: Record<
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
      items: ["office", "commercial-unit", "warehouse", "hotel-apartment", "factory-workshop"],
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
      items: ["office", "commercial-unit", "warehouse", "hotel-apartment", "factory-workshop"],
    },
  ],

  project: [
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["project-presale", "project-partnership"],
    },
  ],
};

const transactionTabs: { label: string; value: TransactionType }[] = [
  { label: "فروش", value: "sale" },
  { label: "اجاره", value: "rent" },
  { label: "پروژه", value: "project" },
];

const advertiserOptions = ["آژانس املاک", "شخصی", "مشاور"];
const publicationTimeOptions = ["یک ساعت پیش", "سه ساعت پیش", "یک روز پیش", "یک هفته پیش", "یک ماه پیش"];
const removedFilterFieldKeys = new Set(["cabinetMaterial", "floorMaterial", "facadeMaterial"]);

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

function getListingKey(transaction: TransactionType, category: CategoryKey) {
  return `${transaction}:${category}`;
}

function getBasicFields(transaction: TransactionType, category: CategoryKey): BasicPropertyField[] {
  if (category === "project-partnership") {
    return [
      { key: "participationType", label: "نوع مشارکت", control: "select", options: participationTypeOptions, required: true },
      { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
      { key: "documentType", label: "نوع سند", control: "select", options: moreFeatureOptions.documentType, required: true },
      { key: "constructionLicense", label: "مجوز ساخت", control: "select", options: ["دارد", "ندارد"], required: true },
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

function getFacilityItems(category: CategoryKey) {
  return category === "land" || category === "factory-workshop"
    ? landFacilityItems
    : facilityItems;
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
  if (key === "age") return "year";
  if (key === "landPosition" || key === "unitPosition" || key === "unitType") return "orientation";

  return "settings";
}

function createRangeBlock(id: string, title: string, variant: RangeBlock["variant"], unit?: string): RangeBlock {
  return {
    id,
    kind: "range",
    title,
    unit,
    variant,
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
  if (field.control === "toggle") {
    return {
      id: field.key,
      kind: "toggle",
      title: field.label,
    };
  }

  if (field.control === "number") {
    const isPercentField = field.leftText?.includes("درصد") || field.key === "density";

    return createRangeBlock(
      field.key,
      field.label,
      isPercentField ? "percent" : "number",
      field.leftText,
    );
  }

  if (field.key === "rooms" || field.key === "floor") {
    return {
      icon: getFieldIcon(field.key),
      id: field.key,
      kind: "multi",
      options: (moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ?? []).map((label) => ({ id: label, label })),
      title: field.label,
    };
  }

  return {
    icon: getFieldIcon(field.key),
    id: field.key,
    kind: "single",
    options: moreFeatureOptions[field.key as keyof typeof moreFeatureOptions] ?? [],
    title: field.label,
  };
}

function getProjectPresaleBlocks(): FilterBlock[] {
  return [
    createRangeBlock("projectTotalFloors", "تعداد کل طبقات", "number"),
    createRangeBlock("projectTotalUnits", "تعداد کل واحدها", "number"),
    {
      icon: "settings",
      id: "projectStatus",
      kind: "single",
      options: projectStatusOptions,
      title: "وضعیت پروژه",
    },
    createRangeBlock("projectMeterage", "متراژ واحد", "area", "متر مربع"),
    {
      icon: "floor",
      id: "projectFloors",
      kind: "multi",
      options: projectFloorOptions.map((label) => ({ id: label, label })),
      title: "طبقه",
    },
    {
      icon: "bed",
      id: "projectRooms",
      kind: "multi",
      options: projectRoomOptions.map((label) => ({ id: label, label })),
      title: "تعداد اتاق",
    },
    {
      icon: "orientation",
      id: "projectPositions",
      kind: "multi",
      options: projectPositionOptions.map((label) => ({ id: label, label })),
      title: "موقعیت",
    },
  ];
}

function getPriceBlocks(transaction: TransactionType, category: CategoryKey): FilterBlock[] {
  if (category === "project-partnership") {
    return [createRangeBlock("builderSharePercent", "سهم سازنده", "percent", "درصد")];
  }

  if (transaction === "project") {
    return [createRangeBlock("projectPrice", "قیمت", "money", "تومان")];
  }

  if (transaction === "rent" && isDailyRentCategory(category)) {
    return [createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان")];
  }

  if (transaction === "rent") {
    return [
      createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
      createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    ];
  }

  return [createRangeBlock("price", "قیمت", "money", "تومان")];
}

function getFilterBlocks(transaction: TransactionType, category?: CategoryKey): FilterBlock[] {
  if (!category) return [];

  const isPartnership = category === "project-partnership";
  const hideHeatingCooling = isPartnership || category === "land" || category === "factory-workshop";
  const showFacilitiesSection = !isPartnership;
  const isDailyHotelRent = transaction === "rent" && category === "daily-hotel-apartment";

  const blocks: FilterBlock[] = [{ kind: "neighborhood" }];

  if (category === "project-presale") {
    blocks.push(...getProjectPresaleBlocks());
  } else {
    blocks.push(...getBasicFields(transaction, category).map(blockFromBasicField));
  }

  blocks.push(...getPriceBlocks(transaction, category));

  if (!isProjectCategory(category) && !isDailyHotelRent) {
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
  }

  if (!hideHeatingCooling) {
    blocks.push({
      icon: "temperature",
      id: "heatingCooling",
      kind: "multi",
      options: heatingItems,
      title: "سرمایش و گرمایش",
    });
  }

  if (showFacilitiesSection) {
    blocks.push({
      icon: "settings",
      id: "facilities",
      kind: "multi",
      options: getFacilityItems(category),
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
              <BuildingIcon />
              <Typography as="span" variant="body" size="medium" weight="regular">انتخاب دسته</Typography>
            </div>

            <FormChoiceChip
              label={categoryLabels[filters.category]}
              selected
              onClick={openCategoryPicker}
            />
          </Button>
        </div>
      </div>

      <main ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-0">
        {filterBlocks.map((block) => (
          <FilterBlockRenderer
            key={"id" in block ? `${block.kind}-${block.id}` : block.kind}
            block={block}
            filters={filters}
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
            onClick={() => {
              window.history.pushState(
                window.history.state ?? {},
                "",
                buildSearchUrl(filters, applyBasePath),
              );
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
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
  title: string;
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
  const iconSrc = getFeatureIconSrc(label);

  if (!iconSrc) return null;

  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-5 w-5 shrink-0 object-contain"
      src={iconSrc}
    />
  );
}

type SingleChoiceSectionProps = {
  icon: ReactNode;
  sectionId?: string;
  more?: boolean;
  onSelect: (value: string) => void;
  options: readonly string[];
  selected?: string;
  title: string;
};

function SingleChoiceSection({
  icon,
  sectionId,
  more = false,
  onSelect,
  options,
  selected,
  title,
}: SingleChoiceSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const moreLimit = 8;
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
          onClick={() => setExpanded((current) => !current)}
        />
      ) : null}
    </FilterSection>
  );
}

function MoreButton({
  count,
  expanded,
  onClick,
}: {
  count: number;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      className="mx-auto mt-3 flex h-10 items-center justify-center gap-1.5 pt-2.5 pb-0.5 px-3 text-sm font-medium leading-5 text-[#0048c4]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="medium" weight="medium">{expanded ? "نمایش کمتر" : `نمایش ${toPersianDigits(count)} مورد بیشتر`}</Typography>
      <ChevronDownIcon isOpen={expanded} />
    </Button>
  );
}

function FilterAssetIcon({ src }: { src: string }) {
  return (
    <img alt="" aria-hidden="true" className="h-6 w-6 shrink-0 object-contain" src={src} />
  );
}

function BuildingIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/features.svg" />;
}

function LocationIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/location.svg" />;
}

function RulerIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path
        d="M8.75 18V20.25H11.25V18H12.75V20.25H15.25V18H16.75V20.25H20C20.1381 20.25 20.25 20.1381 20.25 20V15C20.25 14.8619 20.1381 14.75 20 14.75H9.25V4C9.25 3.86193 9.13807 3.75 9 3.75H4C3.86193 3.75 3.75 3.86193 3.75 4V7.25H6V8.75H3.75V11.25H6V12.75H3.75V15.25H6V16.75H3.75V20C3.75 20.1381 3.86193 20.25 4 20.25H7.25V18H8.75ZM10.75 13.25H20C20.9665 13.25 21.75 14.0335 21.75 15V20C21.75 20.9665 20.9665 21.75 20 21.75H4C3.0335 21.75 2.25 20.9665 2.25 20V4C2.25 3.0335 3.0335 2.25 4 2.25H9C9.9665 2.25 10.75 3.0335 10.75 4V13.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoneyIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/money.svg" />;
}

function BedIcon() {
  return <FilterAssetIcon src="/icons/infos/bed.svg" />;
}

function FloorIcon() {
  return <FilterAssetIcon src="/icons/infos/floor.svg" />;
}

function YearIcon() {
  return <FilterAssetIcon src="/icons/infos/apartment-age.svg" />;
}

function OrientationIcon() {
  return <FilterAssetIcon src="/icons/infos/position.svg" />;
}

function TemperatureIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/tempreture.svg" />;
}

function SettingsIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/features.svg" />;
}

function ExchangeIcon() {
  return <FilterAssetIcon src="/icons/exchange.svg" />;
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
  block: FilterBlock;
  filters: FilterState;
  focusTarget?: string | null;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  setRangeValue: (id: string, key: keyof RangeValue, value: string) => void;
  setSingleValue: (id: string, value: string) => void;
  setToggleValue: (id: string, checked: boolean) => void;
  toggleMultiValue: (id: string, value: string) => void;
};

function FilterBlockRenderer({
  block,
  filters,
  focusTarget,
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
          sectionId={getFilterSectionAnchor(block)}
          focusTarget={focusTarget}
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

    case "single":
      return (
        <SingleChoiceSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          more={block.id !== "age" && block.options.length > 8}
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
          more={block.id === "facilities" && block.options.length > 6}
          moreLimit={block.id === "facilities" ? 6 : 8}
          onToggle={(value) => toggleMultiValue(block.id, value)}
          options={block.id === "floor" ? block.options.filter((option) => !option.label.includes("بیشتر")) : block.options}
          selected={filters.multis[block.id] ?? []}
          title={block.title}
        />
      );

    case "toggle":
      return (
        <SwitchOnlySection
          checked={Boolean(filters.toggles[block.id])}
          label={block.title}
          onChange={(checked) => setToggleValue(block.id, checked)}
        />
      );

    case "loan":
      return (
        <LoanFilterSection
          checked={Boolean(filters.toggles.hasLoan)}
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
  focusTarget?: string | null;
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  sectionId?: string;
  selectedNeighborhoods: SelectedNeighborhood[];
};

function NeighborhoodFilterSection({
  focusTarget,
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
    <section className="scroll-mt-4 border-b-8 border-[#f0f0f0] bg-white px-4 py-4" data-filter-section={sectionId} dir="rtl">
      <Button unstyled
        className="flex min-h-10 w-full items-center justify-between gap-3 text-right"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-2 text-base font-medium leading-6 text-[#1a1a1a]">
          <LocationIcon />
          <Typography as="span" variant="body" size="medium" weight="regular">محله</Typography>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-sm font-medium leading-5 text-[#0048c4]">
          <Typography as="span" variant="body" size="medium" weight="regular">انتخاب کنید</Typography>
          <ChevronLeftIcon />
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
                className="bg-[#f0f0f0]"
                onBack={() => setIsPickerOpen(false)}
                title="محله"
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col bg-[#f0f0f0]">
        <div className="shrink-0 bg-[#f0f0f0] px-4 py-3">
          <label className="flex h-12 items-center gap-2 rounded-xl border border-[#808080] bg-white px-3 focus-within:border-[#0048c4]" dir="rtl">
            <SearchIcon />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی محله"
              type="search"
              value={query}
            />
            {query ? (
              <Button unstyled
                aria-label="پاک کردن جستجوی محله"
                className="grid h-8 w-8 shrink-0 place-items-center text-[#4d4d4d]"
                onClick={() => setQuery("")}
                type="button"
              >
                <ClearCircleIcon />
              </Button>
            ) : null}
          </label>
        </div>

        {selectedNeighborhoods.length > 0 ? (
          <div className="flex shrink-0 justify-start gap-2 overflow-y-auto bg-[#f0f0f0] px-4 pb-3" dir="rtl">
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 py-3" dir="rtl">
          {!cityId ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
              برای انتخاب محله، ابتدا شهر را انتخاب کنید.
            </Typography>
          ) : neighborhoodsQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
              <div className="h-12 rounded-[10px] bg-[#f0f0f0]" />
            </div>
          ) : neighborhoods.length > 0 ? (
            <div className="space-y-1">
              {neighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodOptionId(neighborhood);
                const isSelected = selectedIds.has(neighborhoodId);

                return (
                  <Button unstyled
                    aria-pressed={isSelected}
                    className={`flex w-full items-center justify-center gap-3 rounded-[10px] px-2 py-3 text-right transition-colors focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]`}
                    key={neighborhoodId}
                    onClick={() => toggleNeighborhood(neighborhood)}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                      <Typography as="span" variant="label" size="medium" weight="semibold" className="block text-sm font-semibold leading-5 text-[#1a1a1a]">
                        {neighborhood.name}
                      </Typography>
                      <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-xs font-normal leading-5 text-[#808080]">
                        {selectedCity?.name ?? "شهر انتخاب‌شده"}
                      </Typography>
                    </Typography>
                    <ChoiceIndicator checked={isSelected} />
                  </Button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <SearchEmptyState compact />
          ) : (
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
              محله‌ای برای این شهر ثبت نشده است.
            </Typography>
          )}
        </div>
        <div className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
          <Button
            fullWidth
            onClick={() => setIsPickerOpen(false)}
            size="sm"
          >
            تایید
          </Button>
        </div>
            </div>
          </PageFrame>
        </div>
      ) : null}
    </section>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-[#4d4d4d] transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="m11.5 5.5-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ClearCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" fill="none" viewBox="0 0 20 20">
      <path
        d="M9 4a5 5 0 1 0 3.2 8.85l3.47 3.47a.75.75 0 0 0 1.06-1.06l-3.47-3.47A5 5 0 0 0 9 4Zm-3.5 5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z"
        fill="currentColor"
      />
    </svg>
  );
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
  minimum,
  maximum,
  onMinimumChange,
  onMaximumChange,
}: RangeSectionProps) {
  const normalizedTitle = title.includes("متراژ") ? "متراژ (متر)" : title;

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

function RangeSelectField({
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
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section className="border-b border-[#f0f0f0] bg-white px-4" dir="rtl">
      <CheckboxRow checked={checked} label={label} onChange={onChange} />
    </section>
  );
}

function LoanFilterSection({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white px-4" data-filter-section="hasLoan" dir="rtl">
      <CheckboxRow checked={checked} label="با وام" onChange={onChange} />
    </section>
  );
}

function CheckboxRow({
  bottomFilter = false,
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
      className={`flex w-full items-center justify-between gap-3 bg-white text-right ${
        bottomFilter ? "h-[59px]" : "py-2.25"
      } ${
        divider ? "border-b border-[#f0f0f0]" : ""
      }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <Typography as="span" variant="title" size="medium" weight="medium" className="min-w-0 flex-1 text-[#1a1a1a]">
        {label}
      </Typography>
      <ChoiceIndicator checked={checked} className="h-5 w-5 rounded" />
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
