import { useRef, useState } from "react";
import type { NeighborhoodDto, SubNeighborhoodDto } from "../../../locations/api/neighborhood.service";
import {
  createStoredNeighborhood,
  getNeighborhoodId,
  minNeighborhoodSearchLength,
  type NewAdMapCenter,
} from "./newAdLocationStorage";
import { getSubNeighborhoodCenter } from "./newAdLocationGeometry";
import { subNeighborhoodIdKey } from "../data";

export function useNeighborhoodSelection({
  mapCenter,
  setMapCenter,
}: {
  mapCenter: NewAdMapCenter;
  setMapCenter: React.Dispatch<React.SetStateAction<NewAdMapCenter>>;
}) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(
    createStoredNeighborhood,
  );
  const [query, setQuery] = useState(() => {
    const stored = createStoredNeighborhood();
    return stored ? stored.name : "";
  });
  const [isManualSearch, setIsManualSearch] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [selectedSearchSubNeighborhood, setSelectedSearchSubNeighborhood] =
    useState<SubNeighborhoodDto | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pendingQuerySelectionRef = useRef<{
    neighborhoodId: string;
    subNeighborhood: SubNeighborhoodDto | null;
  } | null>(null);

  const normalizedQuery = query.trim();
  const canSearchNeighborhoods =
    isManualSearch && normalizedQuery.length >= minNeighborhoodSearchLength;

  const updateMapCenter = (center: NewAdMapCenter) => {
    const threshold = 0.00005;
    const hasLocationChanged =
      Math.abs(center.lat - mapCenter.lat) > threshold ||
      Math.abs(center.lng - mapCenter.lng) > threshold;

    if (hasLocationChanged) {
      pendingQuerySelectionRef.current = null;
      setSelectedNeighborhood(null);
      setSelectedSearchSubNeighborhood(null);
      setIsManualSearch(false);
      setIsResolvingLocation(true);
      window.localStorage.removeItem(subNeighborhoodIdKey);
    }

    setMapCenter(center);
  };

  const selectNeighborhood = (neighborhood: NeighborhoodDto) => {
    const matchedSubNeighborhood = neighborhood.matched_sub_neighborhood ?? null;
    const neighborhoodId = getNeighborhoodId(neighborhood);

    searchInputRef.current?.blur();
    setIsManualSearch(false);
    setIsSearchExpanded(false);
    setSelectedNeighborhood(neighborhood);
    setSelectedSearchSubNeighborhood(matchedSubNeighborhood);
    setQuery(neighborhood.name);

    const matchedSubNeighborhoodCenter = getSubNeighborhoodCenter(matchedSubNeighborhood);
    if (matchedSubNeighborhoodCenter) {
      pendingQuerySelectionRef.current = null;
      setMapCenter((current) => ({
        ...current,
        lat: matchedSubNeighborhoodCenter.lat,
        lng: matchedSubNeighborhoodCenter.lng,
      }));
      return;
    }

    if (
      neighborhoodId &&
      (matchedSubNeighborhood ||
        !Number.isFinite(neighborhood.lat) ||
        !Number.isFinite(neighborhood.lng))
    ) {
      pendingQuerySelectionRef.current = {
        neighborhoodId,
        subNeighborhood: matchedSubNeighborhood,
      };
      if (matchedSubNeighborhood) return;
    } else {
      pendingQuerySelectionRef.current = null;
    }

    if (Number.isFinite(neighborhood.lat) && Number.isFinite(neighborhood.lng)) {
      pendingQuerySelectionRef.current = null;
      setMapCenter((current) => ({
        ...current,
        lat: Number(neighborhood.lat),
        lng: Number(neighborhood.lng),
      }));
    }
  };

  return {
    canSearchNeighborhoods,
    isManualSearch,
    isResolvingLocation,
    isSearchExpanded,
    normalizedQuery,
    pendingQuerySelectionRef,
    query,
    searchInputRef,
    selectNeighborhood,
    selectedNeighborhood,
    selectedSearchSubNeighborhood,
    setIsManualSearch,
    setIsResolvingLocation,
    setIsSearchExpanded,
    setQuery,
    setSelectedNeighborhood,
    setSelectedSearchSubNeighborhood,
    updateMapCenter,
  };
}
