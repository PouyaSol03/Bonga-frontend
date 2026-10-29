import { getAdvertiseFormCode } from "../../filters/categories";
import type { CategoryKey, TransactionType } from "../../filters/categories";
import type { SearchMapQuickFilterId } from "./types";

export type QuickFilterState = {
  areaMaximum: string;
  areaMinimum: string;
  category: CategoryKey | undefined;
  priceMaximum: string;
  priceMinimum: string;
  selectedChoices: string[];
  selectedNeighborhoodIds: string[];
  transaction: TransactionType;
};

export function applyQuickFilterToParams(
  params: URLSearchParams,
  filterId: SearchMapQuickFilterId,
  state: QuickFilterState,
) {
  params.delete("focus");

  switch (filterId) {
    case "category": {
      const formCode = state.category
        ? getAdvertiseFormCode(state.transaction, state.category)
        : "";

      if (formCode) {
        params.set("form_code", formCode);
        params.set("from_code", formCode);
      } else {
        params.delete("form_code");
        params.delete("from_code");
      }
      break;
    }
    case "neighborhood": {
      const value = state.selectedNeighborhoodIds.join("_");
      if (value) {
        params.set("neighborhood_id", value);
        params.set("neighborhoods", value);
      } else {
        params.delete("neighborhood_id");
        params.delete("neighborhoods");
      }
      break;
    }
    case "area":
      if (state.areaMinimum) {
        params.set("area_min", state.areaMinimum);
      } else {
        params.delete("area_min");
      }
      if (state.areaMaximum) {
        params.set("area_max", state.areaMaximum);
      } else {
        params.delete("area_max");
      }
      break;
    case "price":
      if (state.priceMinimum) {
        params.set("price_min", state.priceMinimum);
      } else {
        params.delete("price_min");
      }
      if (state.priceMaximum) {
        params.set("price_max", state.priceMaximum);
      } else {
        params.delete("price_max");
      }
      break;
    case "rooms": {
      const value = state.selectedChoices.join("_");
      if (value) {
        params.set("rooms", value);
      } else {
        params.delete("rooms");
      }
      break;
    }
    case "floor": {
      const value = state.selectedChoices.join("_");
      if (value) {
        params.set("floor", value);
      } else {
        params.delete("floor");
      }
      break;
    }
    case "building_age":
      if (state.selectedChoices[0]) {
        params.set("building_age", state.selectedChoices[0]);
      } else {
        params.delete("building_age");
      }
      break;
  }
}
