import { toPersianDigits } from "../../../shared/lib/numberUtils";
import type { SearchFilterChip } from "../searchMapData";
import { formCodeLabels } from "./constants";
import {
  getActiveFilterCount,
  getSearchParams,
  getSearchParamsFromSnapshot,
  writeSearchParams,
} from "./searchParamsHelpers";
import type { SearchFilterChipId } from "./types";

export function formatRangeChipLabel(
  title: string,
  minimum?: string | null,
  maximum?: string | null,
) {
  if (minimum && maximum)
    return `${title}: ${toPersianDigits(minimum)} تا ${toPersianDigits(maximum)}`;
  if (minimum) return `${title}: از ${toPersianDigits(minimum)}`;
  if (maximum) return `${title}: تا ${toPersianDigits(maximum)}`;

  return title;
}

export function orderResultHeaderChips(chips: SearchFilterChip[]) {
  const [filtersChip, ...filterChips] = chips;
  const activeChips = filterChips.filter((chip) => chip.isActive);
  const inactiveChips = filterChips.filter((chip) => !chip.isActive);

  return filtersChip
    ? [filtersChip, ...activeChips, ...inactiveChips]
    : [...activeChips, ...inactiveChips];
}

export function getDynamicFilterChips(search: string): SearchFilterChip[] {
  const params = getSearchParamsFromSnapshot(search);
  const formCode = params.get("form_code") || params.get("from_code") || "";
  const neighborhoods = (params.get("neighborhood_id") || params.get("neighborhoods") || "")
    .split(/[_،,]/)
    .filter(Boolean);
  const activeFilterCount = getActiveFilterCount(params);
  const chips: SearchFilterChip[] = [
    {
      id: "filters",
      label: activeFilterCount > 0 ? `${toPersianDigits(activeFilterCount)} فیلتر` : "فیلترها",
      isActive: activeFilterCount > 0,
    },
  ];

  chips.push({
    id: "category",
    label: formCode ? (formCodeLabels[formCode] ?? formCode) : "دسته‌بندی",
    isActive: Boolean(formCode),
    removable: Boolean(formCode),
  });

  if (neighborhoods.length > 0) {
    chips.push({
      id: "neighborhood",
      label: `${toPersianDigits(neighborhoods.length)} محله`,
      isActive: true,
      removable: true,
    });
  } else {
    chips.push({ id: "neighborhood", label: "محله" });
  }

  if (params.get("area_min") || params.get("area_max")) {
    chips.push({
      id: "area",
      label: formatRangeChipLabel("متراژ", params.get("area_min"), params.get("area_max")),
      isActive: true,
      removable: true,
    });
  }

  if (params.get("price_min") || params.get("price_max")) {
    chips.push({
      id: "price",
      label: formatRangeChipLabel("قیمت", params.get("price_min"), params.get("price_max")),
      isActive: true,
      removable: true,
    });
  }

  if (params.get("rooms")) {
    chips.push({
      id: "rooms",
      label: `اتاق: ${toPersianDigits(params.get("rooms")?.replace(/_/g, "، ") ?? "")}`,
      isActive: true,
      removable: true,
    });
  }

  if (params.get("floor")) {
    chips.push({
      id: "floor",
      label: `طبقه: ${toPersianDigits(params.get("floor")?.replace(/_/g, "، ") ?? "")}`,
      isActive: true,
      removable: true,
    });
  }

  if (params.get("building_age")) {
    chips.push({
      id: "building_age",
      label: `سن ساخت: ${toPersianDigits((params.get("building_age") ?? "").split("_").join("، "))}`,
      isActive: true,
      removable: true,
    });
  }

  return orderResultHeaderChips(chips);
}

export function removeFilterFromSearch(
  chip: SearchFilterChip,
  navigate: (to: string, options?: { replace?: boolean }) => void,
) {
  const params = getSearchParams();

  switch (chip.id as SearchFilterChipId) {
    case "category":
      params.delete("form_code");
      params.delete("from_code");
      break;
    case "neighborhood":
      params.delete("neighborhood_id");
      params.delete("neighborhoods");
      break;
    case "area":
      params.delete("area_min");
      params.delete("area_max");
      break;
    case "price":
      params.delete("price_min");
      params.delete("price_max");
      break;
    case "rooms":
      params.delete("rooms");
      break;
    case "floor":
      params.delete("floor");
      break;
    case "building_age":
      params.delete("building_age");
      break;
    default:
      break;
  }

  params.delete("focus");
  writeSearchParams(params, navigate);
}
