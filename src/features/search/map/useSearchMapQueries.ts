import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import {
  useAdvertisementListQuery,
  useAdvertisementMapQuery,
} from "../../advertisements/api/advertisement.hooks";
import { getNeighborhoodPolygonPoints } from "../../locations/api/neighborhood.service";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { getSearchQuery } from "../searchFilters";
import type {
  SearchFilterChip,
  SearchMapBounds,
  SearchMapCenter,
  SearchMapListing,
  SearchMapListingId,
} from "../searchMapData";
import { maxBluePriceMarkers, searchDefaultLabel } from "./constants";
import { filterListings, mapAdvertisementToSearchListing } from "./listingMapper";
import { buildListQueryParams, buildMapQueryParams, hasSearchCriteria } from "./queryParams";
import { getSearchParamsFromSnapshot } from "./searchParamsHelpers";
import { getDynamicFilterChips } from "./chipHelpers";
import type { SearchMapMode } from "./types";

interface UseSearchMapQueriesOptions {
  confirmedGeofence?: string;
  currentSearch: string;
  mapBounds: SearchMapBounds | null;
  mapCenter: SearchMapCenter;
  mode: SearchMapMode;
  selectedListingId: string | number | null;
  showNotice: (
    msg: string | null | undefined,
    variant?: "error" | "success" | "info" | "warning",
  ) => void;
}

export function useSearchMapQueries({
  confirmedGeofence,
  currentSearch,
  mapBounds,
  mapCenter,
  mode,
  selectedListingId,
  showNotice,
}: UseSearchMapQueriesOptions) {
  const selectedNeighborhoodIds = useMemo(() => {
    const params = getSearchParamsFromSnapshot(currentSearch);
    const raw = params.get("neighborhood_id") || params.get("neighborhoods") || "";
    return new Set(raw.split(/[_،,]/).map((id) => id.trim()).filter(Boolean));
  }, [currentSearch]);

  const neighborhoodCityId = useMemo(() => {
    const params = getSearchParamsFromSnapshot(currentSearch);
    return params.get("city_id") || readStoredSelectedCity()?.id || "";
  }, [currentSearch]);

  const selectedNeighborhoodsQuery = useNeighborhoodListQuery({
    cityId: neighborhoodCityId,
    enabled: selectedNeighborhoodIds.size > 0 && Boolean(neighborhoodCityId),
    page: 1,
    perPage: 100,
  });

  const selectedNeighborhoodGeofences = useMemo(
    () =>
      (selectedNeighborhoodsQuery.data ?? [])
        .filter((neighborhood) =>
          selectedNeighborhoodIds.has(
            String(neighborhood.id ?? neighborhood._id ?? neighborhood.name),
          ),
        )
        .map((neighborhood) =>
          getNeighborhoodPolygonPoints(neighborhood.geofence ?? neighborhood.polygon),
        )
        .filter((points) => points.length >= 3),
    [selectedNeighborhoodIds, selectedNeighborhoodsQuery.data],
  );

  const chips: SearchFilterChip[] = useMemo(
    () => getDynamicFilterChips(currentSearch),
    [currentSearch],
  );

  const currentSearchQuery = useMemo(() => {
    const params = getSearchParamsFromSnapshot(currentSearch);
    return getSearchQuery(params);
  }, [currentSearch]);

  const queryLabel = useMemo(
    () => currentSearchQuery || searchDefaultLabel,
    [currentSearchQuery],
  );

  const mapQueryParams = useMemo(
    () => buildMapQueryParams(mapBounds, currentSearch, confirmedGeofence),
    [confirmedGeofence, currentSearch, mapBounds],
  );

  const listQueryParams = useMemo(() => buildListQueryParams(currentSearch), [currentSearch]);

  const hasActiveSearchCriteria = useMemo(
    () => hasSearchCriteria(currentSearch),
    [currentSearch],
  );

  const mapQuery = useAdvertisementMapQuery(mapQueryParams);
  const listQuery = useAdvertisementListQuery(listQueryParams);

  const apiListings = useMemo(
    () =>
      (mapQuery.data ?? [])
        .map((item, index) => mapAdvertisementToSearchListing(item, index))
        .filter((item): item is SearchMapListing => item !== null),
    [mapQuery.data],
  );

  const apiListListings = useMemo(
    () =>
      (listQuery.data?.data ?? [])
        .map((item, index) => {
          const listing = mapAdvertisementToSearchListing(item, index);
          if (listing) return listing;

          return mapAdvertisementToSearchListing(
            {
              ...item,
              lat: mapCenter.latitude,
              lng: mapCenter.longitude,
            },
            index,
          );
        })
        .filter((item): item is SearchMapListing => item !== null),
    [listQuery.data, mapCenter.latitude, mapCenter.longitude],
  );

  const listingSource = mode === "list" ? apiListListings : apiListings;
  const isMapLoading = !mapQueryParams || (mapQuery.isFetching && apiListings.length === 0);
  const isListLoading = listQuery.isFetching && apiListListings.length === 0;

  const [hasInitialMapLoaded, setHasInitialMapLoaded] = useState(false);

  useEffect(() => {
    if (mapQuery.data !== undefined) {
      setHasInitialMapLoaded(true);
    }
  }, [mapQuery.data]);

  const isInitialMapLoading = !hasInitialMapLoaded && (mapQuery.isLoading || isMapLoading);
  const visibleListings = useMemo(() => filterListings(listingSource), [listingSource]);

  const bluePriceMarkerListingIds = useMemo(() => {
    const markerIds = new Set<SearchMapListingId>();

    for (const listing of visibleListings) {
      if (markerIds.size >= maxBluePriceMarkers) break;
      if (listing.showPriceMarker === false) continue;
      if (selectedListingId != null && String(listing.id) === String(selectedListingId)) {
        continue;
      }

      markerIds.add(listing.id);
    }

    return markerIds;
  }, [selectedListingId, visibleListings]);

  useEffect(() => {
    if (!mapQuery.isError) return;
    showNotice(getApiErrorMessage(mapQuery.error, "دریافت آگهی‌های نقشه با خطا مواجه شد."));
  }, [mapQuery.error, mapQuery.isError, showNotice]);

  useEffect(() => {
    if (!listQuery.isError) return;
    showNotice(getApiErrorMessage(listQuery.error, "دریافت لیست آگهی‌ها با خطا مواجه شد."));
  }, [listQuery.error, listQuery.isError, showNotice]);

  return {
    apiListListings,
    apiListings,
    bluePriceMarkerListingIds,
    chips,
    currentSearchQuery,
    hasActiveSearchCriteria,
    isInitialMapLoading,
    isListLoading,
    isMapLoading,
    listQuery,
    mapQuery,
    queryLabel,
    selectedNeighborhoodGeofences,
    visibleListings,
  };
}
