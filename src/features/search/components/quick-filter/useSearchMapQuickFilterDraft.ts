import { useEffect, useMemo, useRef, useState } from "react";
import { readStoredSelectedCity } from "../../../../shared/lib/selectedCityStorage";
import { useNeighborhoodListQuery } from "../../../locations/api/neighborhood.hooks";
import { getListingFromFormCode, type CategoryKey, type TransactionType } from "../../filters/categories";
import { useAdvertisementListQuery } from "../../../advertisements/api/advertisement.hooks";
import { readSearchFilters } from "../../searchFilters";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";
import type { AdvertisementListParams } from "../../../advertisements/api/advertisement.service";
import { neighborhoodSearchDebounceMs, splitParam } from "./quickFilterHelpers";
import { applyQuickFilterToParams } from "./quickFilterParams";
import type { AreaBound, SearchMapQuickFilterId } from "./types";

type UseSearchMapQuickFilterDraftProps = {
  filterId: SearchMapQuickFilterId | null;
  isOpen: boolean;
  onApply: (params: URLSearchParams) => void;
  onClose: () => void;
  resultCount: number;
  search: string;
};

export function useSearchMapQuickFilterDraft({
  filterId,
  isOpen,
  onApply,
  onClose,
  resultCount,
  search,
}: UseSearchMapQuickFilterDraftProps) {
  const [transaction, setTransaction] = useState<TransactionType>("sale");
  const [category, setCategory] = useState<CategoryKey | undefined>();
  const [selectedNeighborhoodIds, setSelectedNeighborhoodIds] = useState<string[]>([]);
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("");
  const [debouncedNeighborhoodQuery, setDebouncedNeighborhoodQuery] = useState("");
  const [areaMinimum, setAreaMinimum] = useState("");
  const [areaMaximum, setAreaMaximum] = useState("");
  const [activeAreaBound, setActiveAreaBound] = useState<AreaBound | null>(null);
  const [customAreaBound, setCustomAreaBound] = useState<AreaBound | null>(null);
  const [priceMinimum, setPriceMinimum] = useState("");
  const [priceMaximum, setPriceMaximum] = useState("");
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  const selectedCity = readStoredSelectedCity();
  const minimumAreaInputRef = useRef<HTMLInputElement>(null);
  const maximumAreaInputRef = useRef<HTMLInputElement>(null);
  const cityId = selectedCity?.id ?? "";
  const isNeighborhoodSheet = isOpen && filterId === "neighborhood";

  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isNeighborhoodSheet && Boolean(cityId),
    page: 1,
    perPage: 50,
    q: debouncedNeighborhoodQuery,
  });

  useEffect(() => {
    if (!isOpen || !filterId) return;

    const params = new URLSearchParams(search);
    const formCode = params.get("form_code") || params.get("from_code") || "";
    const listing = getListingFromFormCode(formCode);

    setTransaction(listing?.transaction ?? "sale");
    setCategory(listing?.category);
    setSelectedNeighborhoodIds(splitParam(params.get("neighborhood_id") || params.get("neighborhoods")));
    setNeighborhoodQuery("");
    setDebouncedNeighborhoodQuery("");
    setAreaMinimum(params.get("area_min") ?? "");
    setAreaMaximum(params.get("area_max") ?? "");
    setActiveAreaBound(null);
    setCustomAreaBound(null);
    setPriceMinimum(params.get("price_min") ?? "");
    setPriceMaximum(params.get("price_max") ?? "");

    if (filterId === "rooms") {
      setSelectedChoices(splitParam(params.get("rooms")));
    } else if (filterId === "floor") {
      setSelectedChoices(splitParam(params.get("floor")));
    } else if (filterId === "building_age") {
      setSelectedChoices(params.get("building_age") ? [params.get("building_age") as string] : []);
    } else {
      setSelectedChoices([]);
    }
  }, [filterId, isOpen, search]);

  useEffect(() => {
    if (filterId !== "area" || !activeAreaBound || customAreaBound !== activeAreaBound) return;
    const input = activeAreaBound === "minimum" ? minimumAreaInputRef.current : maximumAreaInputRef.current;
    const timer = window.setTimeout(() => input?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [activeAreaBound, customAreaBound, filterId]);

  useEffect(() => {
    if (!isNeighborhoodSheet) return;
    const timer = window.setTimeout(
      () => setDebouncedNeighborhoodQuery(neighborhoodQuery.trim()),
      neighborhoodSearchDebounceMs,
    );
    return () => window.clearTimeout(timer);
  }, [isNeighborhoodSheet, neighborhoodQuery]);

  const filterState = useMemo(
    () => ({
      areaMaximum,
      areaMinimum,
      category,
      priceMaximum,
      priceMinimum,
      selectedChoices,
      selectedNeighborhoodIds,
      transaction,
    }),
    [areaMaximum, areaMinimum, category, priceMaximum, priceMinimum, selectedChoices, selectedNeighborhoodIds, transaction],
  );

  const draftParamsString = useMemo(() => {
    if (!isOpen || !filterId) return null;
    const params = new URLSearchParams(search);
    applyQuickFilterToParams(params, filterId, filterState);
    return params.toString();
  }, [filterId, filterState, isOpen, search]);

  const debouncedDraftParams = useDebouncedValue(draftParamsString, 300);
  const isDraftDebouncing = draftParamsString !== debouncedDraftParams;

  const quickCountQueryParams = useMemo<AdvertisementListParams | null>(() => {
    if (!isOpen) return null;
    const params = new URLSearchParams(debouncedDraftParams || search);
    const resolvedCityId = params.get("city_id") || selectedCity?.id || undefined;
    const filters = readSearchFilters(params);
    return { cityId: resolvedCityId, filters, page: 1, perPage: 1 };
  }, [isOpen, debouncedDraftParams, search, selectedCity?.id]);

  const quickCountQuery = useAdvertisementListQuery(quickCountQueryParams);
  const isCalculating = isOpen && (isDraftDebouncing || quickCountQuery.isLoading || quickCountQuery.isFetching);
  const dynamicCount = quickCountQuery.data?.total ?? resultCount;

  const applyCurrentFilter = () => {
    if (!filterId) return;
    const params = new URLSearchParams(search);
    applyQuickFilterToParams(params, filterId, filterState);
    onApply(params);
    onClose();
  };

  return {
    activeAreaBound,
    applyCurrentFilter,
    areaMaximum,
    areaMinimum,
    category,
    cityId,
    customAreaBound,
    dynamicCount,
    isCalculating,
    maximumAreaInputRef,
    minimumAreaInputRef,
    neighborhoodQuery,
    neighborhoods: neighborhoodsQuery.data ?? [],
    neighborhoodsQuery,
    priceMaximum,
    priceMinimum,
    selectedChoices,
    selectedNeighborhoodIds,
    setActiveAreaBound,
    setAreaMaximum,
    setAreaMinimum,
    setCategory,
    setCustomAreaBound,
    setNeighborhoodQuery,
    setPriceMaximum,
    setPriceMinimum,
    setSelectedChoices,
    setSelectedNeighborhoodIds,
    setTransaction,
    transaction,
  };
}
