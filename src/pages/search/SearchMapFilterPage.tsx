import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PageFrame } from "../../app/PageFrame";
import {
  FormChoiceChip,
  FormSegmentedControl,
  FormSelectField,
  FormSwitch,
  FormTextField,
} from "../../components/form/FormControls";
import { BottomSheet } from "../../components/BottomSheet";
import { TopBar } from "../../components/TopBar";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { getFeatureIconSrc } from "../../lib/handleFeaturesIcons";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import {
  basicPropertyFieldsByListingType,
  defaultBasicPropertyFields,
  facilityItems,
  heatingItems,
  landFacilityItems,
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
  | "year";

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

type FilterBlock =
  | { kind: "neighborhood" }
  | RangeBlock
  | SingleChoiceBlock
  | MultiChoiceBlock
  | ToggleBlock
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
  featured: false,
  hasPhoto: false,
  hasVideo: false,
};

const defaultFilterTransaction: TransactionType = "sale";
const defaultFilterCategory: CategoryKey = "apartment";
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

function getBackToSearchPath() {
  const params = new URLSearchParams(window.location.search);

  params.delete("focus");

  const queryString = params.toString();

  return queryString ? `/search?${queryString}` : "/search";
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
  const shouldOpenDefaultSection = Boolean(focusTarget) && !shouldOpenCategoryPicker;
  const transaction = listing?.transaction ?? (shouldOpenDefaultSection ? defaultFilterTransaction : initialFilters.transaction);
  const category = shouldOpenCategoryPicker
    ? undefined
    : listing?.category ?? (shouldOpenDefaultSection ? defaultFilterCategory : undefined);
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
    minimum: params.get("price_min") ?? "",
    maximum: params.get("price_max") ?? "",
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

  if (floorValues.length > 0) nextFilters.multis.floor = floorValues;
  if (roomValues.length > 0) nextFilters.multis.rooms = roomValues;
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

  return nextFilters;
}

function buildSearchUrl(filters: FilterState) {
  const params = new URLSearchParams(window.location.search);
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
  setOrDelete("published_at", filters.publicationTime ?? "");
  setOrDelete("is_special", filters.featured ? "true" : "");
  setOrDelete("has_image", filters.hasPhoto ? "true" : "");
  setOrDelete("has_video", filters.hasVideo ? "true" : "");

  return `/search?${params.toString()}`;
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

const advertiserOptions = ["شخصی", "مشاور املاک", "سازنده"];
const publicationTimeOptions = ["امروز", "دیروز", "هفته اخیر", "ماه اخیر"];

const minNeighborhoodSearchLength = 2;
const neighborhoodSearchDebounceMs = 250;

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
  );
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

  if (!isProjectCategory(category) && !isDailyHotelRent) {
    blocks.push(...getMoreFields(transaction, category).map(blockFromMoreFeatureField));
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

  blocks.push(...getPriceBlocks(transaction, category));
  blocks.push({ kind: "advertiser" }, { kind: "publicationTime" }, { kind: "adFlags" });

  return dedupeBlocks(blocks);
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
    default:
      return <SettingsIcon />;
  }
}

export function SearchMapFilterPage() {
  const [filters, setFilters] = useState<FilterState>(readInitialFiltersFromUrl);

  const filterBlocks = useMemo(
    () => getFilterBlocks(filters.transaction, filters.category),
    [filters.transaction, filters.category],
  );

  useEffect(() => {
    if (!filters.category) return;

    const target = new URLSearchParams(window.location.search).get("focus");
    if (!target) return;

    window.setTimeout(() => {
      const targetSection = document.querySelector(`[data-filter-section="${target}"]`);

      targetSection?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 80);
  }, [filterBlocks, filters.category]);

  const changeCategory = (
    transaction: TransactionType,
    category: CategoryKey,
  ) => {
    setFilters({
      ...initialFilters,
      transaction,
      category,
    });
  };

  const openCategoryPicker = () => {
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
          backTo={getBackToSearchPath()}
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
          title="فیلترها"
        />

        <div className="border-b-8 border-[#f0f0f0] bg-white px-4 py-3">
          <button
            className="flex w-full items-center justify-between gap-3 text-right"
            dir="rtl"
            onClick={openCategoryPicker}
            type="button"
          >
            <FormChoiceChip
              label={categoryLabels[filters.category]}
              selected
              onClick={openCategoryPicker}
            />

            <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a]">
              <span>انتخاب دسته</span>
              <BuildingIcon />
            </div>
          </button>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-4">
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
          />
        ))}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <div className="flex items-center gap-4" dir="rtl">
          <button
            className="flex h-10 w-[119px] items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4]"
            onClick={() => setFilters({ ...initialFilters, transaction: filters.transaction, category: filters.category })}
            type="button"
          >
            <TrashIcon />
            <span>حذف همه</span>
          </button>
          <button
            className="flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white no-underline"
            onClick={() => {
              window.history.pushState({}, "", buildSearchUrl(filters));
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            type="button"
          >
            نمایش ۱۲٬۴۰۰ آگهی
          </button>
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
    <section className="scroll-mt-4 border-b-8 border-[#f0f0f0] bg-white px-4 pb-4 pt-4" data-filter-section={sectionId} dir="rtl">
      <div className="mb-2 flex h-8 items-center justify-start gap-2 text-[#4d4d4d]">
        {icon}
        <h2 className="m-0 text-right text-base font-medium leading-6 text-[#1a1a1a]">
          {title}
        </h2>
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
  onToggle,
  options,
  selected,
  title,
}: ChipSectionProps) {
  return (
    <FilterSection icon={icon} sectionId={sectionId} title={title}>
      <div className="flex flex-wrap justify-start gap-2" dir="rtl">
        {options.map((option) => (
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
      {more ? <MoreButton /> : null}
    </FilterSection>
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
  return (
    <FilterSection icon={icon} sectionId={sectionId} title={title}>
      <div className="flex flex-wrap justify-start gap-2" dir="rtl">
        {options.map((option) => (
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
      {more ? <MoreButton /> : null}
    </FilterSection>
  );
}

function MoreButton() {
  return (
    <button
      className="mt-2 flex h-10 w-full items-center justify-center gap-2 text-sm font-medium leading-5 text-[#0048c4]"
      type="button"
    >
      <span>موارد بیشتر</span>
      <ArrowLeftIcon />
    </button>
  );
}

function FilterAssetIcon({ src }: { src: string }) {
  return (
    <img alt="" aria-hidden="true" className="h-6 w-6 shrink-0 object-contain" src={src} />
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M6 6v9m4-9v9m4-9v9M4 5h12M8 3h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
      <path d="m11.5 5.5-4 4 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function BuildingIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/features.svg" />;
}

function LocationIcon() {
  return <FilterAssetIcon src="/icons/add_advertisement/location.svg" />;
}

function RulerIcon() {
  return <FilterAssetIcon src="/icons/infos/area.svg" />;
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


type CategorySelectionScreenProps = {
  initialTransaction: TransactionType;
  onConfirm: (transaction: TransactionType, category: CategoryKey) => void;
};

function CategorySelectionScreen({
  initialTransaction,
  onConfirm,
}: CategorySelectionScreenProps) {
  const [draftTransaction, setDraftTransaction] =
    useState<TransactionType>(initialTransaction);

  const [draftCategory, setDraftCategory] = useState<CategoryKey | undefined>(
    undefined,
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <div className="shrink-0 bg-[#f0f0f0]">
        <TopBar
          backTo={getBackToSearchPath()}
          centerClassName="px-0"
          className="bg-[#f0f0f0]"
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

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-24 pt-4">
        {categoryGroupsByTransaction[draftTransaction].map((group) => (
          <section key={group.title} className="mb-6">
            <h2 className="mb-4 border-b border-[#e6e6e6] pb-2 text-right text-base font-medium text-[#808080]">
              {group.title}
            </h2>

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
        <button
          className="flex h-11 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!draftCategory}
          onClick={() => {
            if (!draftCategory) return;
            onConfirm(draftTransaction, draftCategory);
          }}
          type="button"
        >
          تایید
        </button>
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
  setFilters: Dispatch<SetStateAction<FilterState>>;
  setRangeValue: (id: string, key: keyof RangeValue, value: string) => void;
  setSingleValue: (id: string, value: string) => void;
  setToggleValue: (id: string, checked: boolean) => void;
  toggleMultiValue: (id: string, value: string) => void;
};

function FilterBlockRenderer({
  block,
  filters,
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

    case "single":
      return (
        <SingleChoiceSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          more={block.options.length > 8}
          onSelect={(value) => setSingleValue(block.id, value)}
          options={block.options}
          selected={filters.singles[block.id]}
          title={block.title}
        />
      );

    case "multi":
      return (
        <ChipSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          showFeatureIcons={block.id === "heatingCooling" || block.id === "facilities"}
          more={block.options.length > 8}
          onToggle={(value) => toggleMultiValue(block.id, value)}
          options={block.options}
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

    case "advertiser":
      return (
        <SelectOnlySection
          label="آگهی دهنده"
          value={filters.advertiser}
          onClick={() =>
            setFilters((current) => ({
              ...current,
              advertiser: current.advertiser
                ? undefined
                : advertiserOptions[0],
            }))
          }
        />
      );

    case "publicationTime":
      return (
        <SelectOnlySection
          label="زمان انتشار آگهی"
          value={filters.publicationTime}
          onClick={() =>
            setFilters((current) => ({
              ...current,
              publicationTime: current.publicationTime
                ? undefined
                : publicationTimeOptions[0],
            }))
          }
        />
      );

    case "adFlags":
      return (
        <section className="bg-white px-4 pb-4 pt-0">
          <FormSwitch
            checked={filters.featured}
            label="آگهی ویژه"
            onChange={(featured) =>
              setFilters((current) => ({ ...current, featured }))
            }
          />

          <FormSwitch
            checked={filters.hasPhoto}
            label="آگهی با عکس"
            onChange={(hasPhoto) =>
              setFilters((current) => ({ ...current, hasPhoto }))
            }
          />

          <FormSwitch
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
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  sectionId?: string;
  selectedNeighborhoods: SelectedNeighborhood[];
};

function NeighborhoodFilterSection({
  onChange,
  sectionId,
  selectedNeighborhoods,
}: NeighborhoodFilterSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
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
    enabled: isPickerOpen && Boolean(cityId) && canSearch,
    page: 1,
    perPage: 30,
    q: debouncedQuery,
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
    <FilterSection icon={<LocationIcon />} sectionId={sectionId} title="محله">
      <div className="space-y-3" dir="rtl">
        <button
          className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#cccccc] bg-white px-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={() => setIsPickerOpen(true)}
          type="button"
        >
          <span className="min-w-0 flex-1 truncate">
            {selectedNeighborhoods.length > 0
              ? `${new Intl.NumberFormat("fa-IR").format(selectedNeighborhoods.length)} محله انتخاب شده`
              : "انتخاب محله"}
          </span>
          <ChevronDownIcon isOpen={isPickerOpen} />
        </button>

        {isPickerOpen ? (
          <BottomSheet
            ariaLabel="انتخاب محله"
            contentClassName="flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3"
            heightClassName="h-[min(92dvh,640px)]"
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            panelPaddingClassName="flex flex-col pt-4"
            showHeaderDivider
            title="محله"
          >
            <label className="flex h-10 items-center gap-2 rounded-[10px] border border-[#cccccc] bg-white px-3 focus-within:border-[#0048c4]">
              <input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجوی محله"
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label="پاک کردن جستجوی محله"
                  className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <ClearCircleIcon />
                </button>
              ) : (
                <SearchIcon />
              )}
            </label>

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

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {!cityId ? (
                <p className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  برای انتخاب محله، ابتدا شهر را انتخاب کنید.
                </p>
              ) : !debouncedQuery ? (
                <p className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  نام محله را جستجو کنید.
                </p>
              ) : !canSearch ? (
                <p className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  برای جستجو حداقل ۲ حرف وارد کنید.
                </p>
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
                      <button
                        aria-pressed={isSelected}
                        className={`flex w-full items-start gap-3 rounded-[10px] px-2 py-3 text-right transition-colors focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] ${
                          isSelected ? "bg-[#0048c40a]" : "bg-white"
                        }`}
                        key={neighborhoodId}
                        onClick={() => toggleNeighborhood(neighborhood)}
                        type="button"
                      >
                        <SelectionCheckIndicator checked={isSelected} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold leading-5 text-[#1a1a1a]">
                            {neighborhood.name}
                          </span>
                          <span className="mt-1 block text-xs font-normal leading-5 text-[#808080]">
                            {selectedCity?.name ?? "شهر انتخاب‌شده"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="m-0 px-2 py-3 text-right text-xs font-normal leading-5 text-[#808080]">
                  محله‌ای با این عبارت پیدا نشد.
                </p>
              )}
            </div>
          </BottomSheet>
        ) : null}
      </div>
    </FilterSection>
  );
}

function SelectionCheckIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border ${
        checked ? "border-[#0048C4] bg-[#0048C4] text-white" : "border-[#808080] bg-white"
      }`}
    >
      {checked ? <img alt="" src="/icons/checkTick.svg" /> : null}
    </span>
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
          onChange={(event) => onMinimumChange(event.target.value)}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          value={minimum}
        />

        <FormTextField
          badge={unit}
          className="flex-1"
          label="حداکثر"
          onChange={(event) => onMaximumChange(event.target.value)}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          value={maximum}
        />
      </div>
    </FilterSection>
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
          onChange={(event) => onMinimumChange(event.target.value)}
          onClear={() => onMinimumChange("")}
          placeholder="حداقل"
          value={minimum}
        />

        <FormTextField
          badge="تومان"
          label="حداکثر"
          onChange={(event) => onMaximumChange(event.target.value)}
          onClear={() => onMaximumChange("")}
          placeholder="حداکثر"
          value={maximum}
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
    <div className="border-b-8 border-[#f0f0f0] bg-white px-4">
      <FormSwitch checked={checked} label={label} onChange={onChange} />
    </div>
  );
}

function SelectOnlySection({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <section className="bg-white px-4">
      <FormSelectField
        label={label}
        onClick={onClick}
        placeholder="انتخاب"
        value={value}
      />
    </section>
  );
}
