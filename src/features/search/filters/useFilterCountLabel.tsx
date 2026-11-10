import { type FilterState } from "./filterTypes";
import { type ReactNode, useMemo } from "react";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { type AdvertisementListParams } from "../../advertisements/api/advertisement.service";
import { buildSearchUrl } from "./buildSearchUrl";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { readSearchFilters } from "../searchFilters";
import { useAdvertisementListQuery } from "../../advertisements/api/advertisement.hooks";
import { toPersianDigits } from "../../../shared/lib/numberUtils";

export function useFilterCountLabel(
  filters: FilterState,
  applyBasePath: string,
  customApplyButtonLabel?: ReactNode,
) {
  const debouncedFilters = useDebouncedValue(filters, 300);
  const isDebouncing = filters !== debouncedFilters;

  const countQueryParams = useMemo<AdvertisementListParams | null>(() => {
    const searchUrl = buildSearchUrl(debouncedFilters, applyBasePath);
    const searchParams = new URL(searchUrl, window.location.origin).searchParams;
    const selectedCity = readStoredSelectedCity();
    const cityId = searchParams.get("city_id") || selectedCity?.id || undefined;
    const advertisementFilters = readSearchFilters(searchParams);

    return {
      cityId,
      filters: advertisementFilters,
      page: 1,
      perPage: 1,
    };
  }, [debouncedFilters, applyBasePath]);

  const countQuery = useAdvertisementListQuery(countQueryParams);
  const isCalculating = isDebouncing || countQuery.isLoading || countQuery.isFetching;

  const resolvedApplyButtonLabel = useMemo<ReactNode>(() => {
    if (customApplyButtonLabel) return customApplyButtonLabel;

    if (isCalculating) {
      return (
        <span className="inline-flex items-center justify-center gap-1.5">
          <span>نمایش</span>
          <span className="inline-flex animate-pulse items-center font-bold tracking-widest">
            ...
          </span>
          <span>آگهی</span>
        </span>
      );
    }

    if (countQuery.isError) {
      return "اعمال فیلترها";
    }

    const total = countQuery.data?.total ?? 0;
    const formattedTotal = toPersianDigits(new Intl.NumberFormat("en-US").format(total));

    return `نمایش ${formattedTotal} آگهی`;
  }, [customApplyButtonLabel, isCalculating, countQuery.isError, countQuery.data?.total]);

  return resolvedApplyButtonLabel;
}
