import { type FilterState } from "./filterTypes";
import { getSafeReturnToPath } from "./filterNavigation";
import { getAdvertiseFormCode } from "./categories";
import {
  normalizeMultiExactFilterValue,
  normalizeExactFilterValue,
  normalizeRangeNumber,
} from "./numberValues";
import { filterFieldParamMap } from "./fieldParams";

export function getRange(filters: FilterState, ids: string[]) {
  for (const id of ids) {
    const range = filters.ranges[id];

    if (range?.minimum || range?.maximum) return range;
  }

  return undefined;
}

export function buildSearchUrl(filters: FilterState, applyBasePath = "/search") {
  const returnTo = getSafeReturnToPath();
  const baseUrl = new URL(returnTo || applyBasePath, window.location.origin);
  const params = returnTo ? baseUrl.searchParams : new URLSearchParams(window.location.search);
  const formCode = filters.category
    ? getAdvertiseFormCode(filters.transaction, filters.category)
    : "";
  const neighborhoods = filters.neighborhoods.map((item) => item.id).join("_");
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
  const buildingAge =
    normalizeMultiExactFilterValue(filters.multis.age) ||
    normalizeExactFilterValue(filters.singles.age);
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
  if (!params.get("view")) {
    params.set("view", "map");
  }

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
      setOrDelete(
        paramKey,
        ["readyDeliveryDate", "projectDeliveryDate", "checkInTime", "checkOutTime"].includes(
          fieldId,
        )
          ? single
          : normalizeExactFilterValue(single),
      );
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
