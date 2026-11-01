import { type FilterState } from "./filterTypes";
import { getListingFromFormCode } from "./categories";
import { initialFilters } from "./filterState";
import { formatPersianGroupedNumberInput } from "./numberValues";
import { filterFieldParamMap } from "./fieldParams";

export function readInitialFiltersFromUrl(): FilterState {
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

  const dailyPriceMinParam =
    params.get("daily_price_min") ||
    params.get("normal_daily_price_min") ||
    params.get("min_price");
  const dailyPriceMaxParam =
    params.get("daily_price_max") ||
    params.get("normal_daily_price_max") ||
    params.get("max_price");
  if (dailyPriceMinParam || dailyPriceMaxParam) {
    nextFilters.ranges.dailyPrice = {
      minimum: dailyPriceMinParam || nextFilters.ranges.dailyPrice?.minimum || "",
      maximum: dailyPriceMaxParam || nextFilters.ranges.dailyPrice?.maximum || "",
    };
  }

  const floorValues = (params.get("floor") ?? "").split(/[_،,]/).filter(Boolean);
  const roomValues = (params.get("rooms") ?? "").split(/[_،,]/).filter(Boolean);
  const buildingAgeValues = (params.get("building_age") ?? "").split(/[_،,]/).filter(Boolean);
  const exchangeValues = (params.get("exchange_with") ?? "").split(/[_،,]/).filter(Boolean);

  if (floorValues.length > 0) nextFilters.multis.floor = floorValues;
  if (roomValues.length > 0) nextFilters.multis.rooms = roomValues;
  if (exchangeValues.length > 0) nextFilters.multis.exchangeWith = exchangeValues;
  if (buildingAgeValues.length > 0) {
    nextFilters.multis.age = buildingAgeValues;
    nextFilters.singles.age = buildingAgeValues[0];
  }

  const neighborhoods = (params.get("neighborhood_id") || params.get("neighborhoods") || "")
    .split(/[_،,]/)
    .filter(Boolean);

  if (neighborhoods.length > 0) {
    nextFilters.neighborhoods = neighborhoods.map((id) => ({ id, name: id }));
  }

  if (params.get("published_at"))
    nextFilters.publicationTime = params.get("published_at") ?? undefined;
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
      listing?.transaction === "sale" && listing.category === "land" && fieldId === "usageType";

    if (
      fieldId === "heatingCooling" ||
      fieldId === "facilities" ||
      fieldId === "suitableFor" ||
      isApprovedSaleLandMulti
    ) {
      nextFilters.multis[fieldId] = directValue.split(/[_،,]/).filter(Boolean);
    } else if (
      [
        "renovated",
        "furnished",
        "constructionPermit",
        "commercialPermit",
        "hasDocument",
        "managementRoom",
        "conferenceRoom",
        "receptionHall",
        "signboard",
        "kitchen",
        "separateEntrance",
        "saleTermsEnabled",
      ].includes(fieldId)
    ) {
      nextFilters.toggles[fieldId] =
        directValue === "true" || directValue === "1" || directValue === "دارد";
    } else {
      nextFilters.singles[fieldId] = directValue;
    }
  }

  return nextFilters;
}
