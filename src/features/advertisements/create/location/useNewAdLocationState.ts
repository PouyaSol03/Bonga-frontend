import { useMemo, useState } from "react";
import { useErrorToast } from "../../../../shared/hooks/useErrorToast";
import { useNeighborhoodInfoQuery } from "../../../locations/api/neighborhood.hooks";
import {
  useLocationSearchByCoordinates,
  useLocationSearchByQuery,
} from "../../../locations/api/location-search.hooks";
import {
  getNeighborhoodPolygonPoints,
  getNeighborhoodSubNeighborhoods,
} from "../../../locations/api/neighborhood.service";
import {
  findMatchingSubNeighborhood,
  getNeighborhoodId,
  getStoredCityId,
  getStoredMapCenter,
  type NewAdMapCenter,
} from "./newAdLocationStorage";
import { resolveSubNeighborhoodAtPoint } from "./newAdLocationGeometry";
import { useNeighborhoodHydrationEffect } from "./useNeighborhoodHydrationEffect";
import { useCoordinateLookupEffect } from "./useCoordinateLookupEffect";
import { useNeighborhoodSelection } from "./useNeighborhoodSelection";

export function useNewAdLocationState() {
  const cityId = getStoredCityId();
  const [mapCenter, setMapCenter] = useState<NewAdMapCenter>(getStoredMapCenter);

  const selection = useNeighborhoodSelection({ mapCenter, setMapCenter });

  const locationSearchQuery = useLocationSearchByQuery({
    cityId,
    enabled: Boolean(cityId) && selection.canSearchNeighborhoods,
    query: selection.normalizedQuery,
  });

  const locationByCoordinatesQuery = useLocationSearchByCoordinates({
    cityId,
    enabled: Boolean(cityId),
    lat: Number(mapCenter.lat.toFixed(7)),
    lng: Number(mapCenter.lng.toFixed(7)),
  });

  const selectedNeighborhoodId = getNeighborhoodId(selection.selectedNeighborhood);
  const neighborhoodInfoQuery = useNeighborhoodInfoQuery(
    selectedNeighborhoodId,
    Boolean(selectedNeighborhoodId),
  );

  useErrorToast(locationSearchQuery.error, "جستجوی محله با خطا مواجه شد.");
  useErrorToast(locationByCoordinatesQuery.error, "دریافت محله از روی نقشه با خطا مواجه شد.");
  useErrorToast(neighborhoodInfoQuery.error, "دریافت اطلاعات محله با خطا مواجه شد.");

  const selectedSubNeighborhood = useMemo(() => {
    const fullInfo = neighborhoodInfoQuery.data;
    const subNeighborhoods = fullInfo ? getNeighborhoodSubNeighborhoods(fullInfo) : [];
    const matchedSearchSubNeighborhood = fullInfo
      ? findMatchingSubNeighborhood(fullInfo, selection.selectedSearchSubNeighborhood)
      : null;

    return (
      matchedSearchSubNeighborhood ??
      selection.selectedSearchSubNeighborhood ??
      resolveSubNeighborhoodAtPoint(subNeighborhoods, mapCenter.lat, mapCenter.lng)
    );
  }, [mapCenter.lat, mapCenter.lng, neighborhoodInfoQuery.data, selection.selectedSearchSubNeighborhood]);

  useNeighborhoodHydrationEffect({
    fullInfo: neighborhoodInfoQuery.data,
    pendingQuerySelectionRef: selection.pendingQuerySelectionRef,
    selectedNeighborhood: selection.selectedNeighborhood,
    selectedSearchSubNeighborhood: selection.selectedSearchSubNeighborhood,
    setMapCenter,
    setSelectedNeighborhood: selection.setSelectedNeighborhood,
  });

  useCoordinateLookupEffect({
    isManualSearch: selection.isManualSearch,
    isResolvingLocation: selection.isResolvingLocation,
    locationByCoordinatesData: locationByCoordinatesQuery.data || undefined,
    locationByCoordinatesFetching: locationByCoordinatesQuery.isFetching,
    selectedNeighborhood: selection.selectedNeighborhood,
    setIsResolvingLocation: selection.setIsResolvingLocation,
    setQuery: selection.setQuery,
    setSelectedNeighborhood: selection.setSelectedNeighborhood,
    setSelectedSearchSubNeighborhood: selection.setSelectedSearchSubNeighborhood,
  });

  const selectedNeighborhoodGeofence = useMemo(() => {
    const fullInfo = neighborhoodInfoQuery.data;
    if (
      !fullInfo ||
      !selectedNeighborhoodId ||
      String(fullInfo.id ?? fullInfo._id ?? "") !== selectedNeighborhoodId
    ) {
      return [];
    }

    return getNeighborhoodPolygonPoints(fullInfo.geofence ?? fullInfo.polygon);
  }, [neighborhoodInfoQuery.data, selectedNeighborhoodId]);

  return {
    canSearchNeighborhoods: selection.canSearchNeighborhoods,
    isManualSearch: selection.isManualSearch,
    isResolvingLocation: selection.isResolvingLocation,
    isSearchExpanded: selection.isSearchExpanded,
    locationByCoordinatesQuery,
    locationSearchQuery,
    locations: selection.canSearchNeighborhoods ? (locationSearchQuery.data ?? []) : [],
    mapCenter,
    neighborhoodInfoQuery,
    pendingQuerySelectionRef: selection.pendingQuerySelectionRef,
    query: selection.query,
    searchInputRef: selection.searchInputRef,
    selectNeighborhood: selection.selectNeighborhood,
    selectedNeighborhood: selection.selectedNeighborhood,
    selectedNeighborhoodGeofence,
    selectedNeighborhoodId,
    selectedSearchSubNeighborhood: selection.selectedSearchSubNeighborhood,
    selectedSubNeighborhood,
    setIsManualSearch: selection.setIsManualSearch,
    setIsResolvingLocation: selection.setIsResolvingLocation,
    setIsSearchExpanded: selection.setIsSearchExpanded,
    setMapCenter,
    setQuery: selection.setQuery,
    setSelectedNeighborhood: selection.setSelectedNeighborhood,
    setSelectedSearchSubNeighborhood: selection.setSelectedSearchSubNeighborhood,
    updateMapCenter: selection.updateMapCenter,
  };
}
