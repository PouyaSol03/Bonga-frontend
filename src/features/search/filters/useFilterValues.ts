import { type Dispatch, type SetStateAction } from "react";
import { type FilterState, type RangeValue } from "./filterTypes";
import { normalizeExactFilterValue } from "./numberValues";

export function useFilterValues(setFilters: Dispatch<SetStateAction<FilterState>>) {
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
        currentValue !== undefined &&
        normalizeExactFilterValue(currentValue) === normalizeExactFilterValue(value);

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

  return { setRangeValue, setSingleValue, toggleMultiValue, setToggleValue };
}
