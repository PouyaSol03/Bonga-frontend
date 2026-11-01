import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { NeighborhoodDto, SubNeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "./newAdLocationStorage";

type UseCoordinateLookupEffectProps = {
  isManualSearch: boolean;
  isResolvingLocation: boolean;
  locationByCoordinatesData: NeighborhoodDto | undefined;
  locationByCoordinatesFetching: boolean;
  selectedNeighborhood: NeighborhoodDto | null;
  setIsResolvingLocation: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setSelectedNeighborhood: Dispatch<SetStateAction<NeighborhoodDto | null>>;
  setSelectedSearchSubNeighborhood: Dispatch<SetStateAction<SubNeighborhoodDto | null>>;
};

export function useCoordinateLookupEffect({
  isManualSearch,
  isResolvingLocation,
  locationByCoordinatesData,
  locationByCoordinatesFetching,
  selectedNeighborhood,
  setIsResolvingLocation,
  setQuery,
  setSelectedNeighborhood,
  setSelectedSearchSubNeighborhood,
}: UseCoordinateLookupEffectProps) {
  useEffect(() => {
    if (locationByCoordinatesFetching || isManualSearch) return;
    if (selectedNeighborhood && !isResolvingLocation) return;

    const timer = setTimeout(() => {
      const neighborhood = locationByCoordinatesData;

      if (!neighborhood || !getNeighborhoodId(neighborhood) || !neighborhood.name.trim()) {
        setSelectedNeighborhood(null);
        setSelectedSearchSubNeighborhood(null);
        setQuery("");
        setIsResolvingLocation(false);
        return;
      }

      setSelectedNeighborhood(neighborhood);
      setSelectedSearchSubNeighborhood(neighborhood.matched_sub_neighborhood ?? null);
      setQuery(neighborhood.name);
      setIsResolvingLocation(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [
    isManualSearch,
    isResolvingLocation,
    locationByCoordinatesData,
    locationByCoordinatesFetching,
    selectedNeighborhood,
    setIsResolvingLocation,
    setQuery,
    setSelectedNeighborhood,
    setSelectedSearchSubNeighborhood,
  ]);
}
