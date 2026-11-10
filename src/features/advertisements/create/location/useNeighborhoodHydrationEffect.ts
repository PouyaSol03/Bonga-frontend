import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { NeighborhoodDto, SubNeighborhoodDto } from "../../../locations/api/neighborhood.service";
import {
  findMatchingSubNeighborhood,
  getNeighborhoodId,
  type NewAdMapCenter,
} from "./newAdLocationStorage";
import { getSubNeighborhoodCenter } from "./newAdLocationGeometry";

type UseNeighborhoodHydrationEffectProps = {
  fullInfo: NeighborhoodDto | null | undefined;
  pendingQuerySelectionRef: React.MutableRefObject<{
    neighborhoodId: string;
    subNeighborhood: SubNeighborhoodDto | null;
  } | null>;
  selectedNeighborhood: NeighborhoodDto | null;
  selectedSearchSubNeighborhood: SubNeighborhoodDto | null;
  setMapCenter: Dispatch<SetStateAction<NewAdMapCenter>>;
  setSelectedNeighborhood: Dispatch<SetStateAction<NeighborhoodDto | null>>;
};

export function useNeighborhoodHydrationEffect({
  fullInfo,
  pendingQuerySelectionRef,
  selectedNeighborhood,
  selectedSearchSubNeighborhood,
  setMapCenter,
  setSelectedNeighborhood,
}: UseNeighborhoodHydrationEffectProps) {
  useEffect(() => {
    if (!fullInfo || !selectedNeighborhood) return;

    const neighborhoodId = getNeighborhoodId(selectedNeighborhood);
    if (neighborhoodId !== String(fullInfo.id)) return;

    const pendingSelection = pendingQuerySelectionRef.current;
    const isPendingQuerySelection = pendingSelection?.neighborhoodId === neighborhoodId;
    const matchedSearchSubNeighborhood = findMatchingSubNeighborhood(
      fullInfo,
      isPendingQuerySelection ? pendingSelection.subNeighborhood : selectedSearchSubNeighborhood,
    );

    const needsNeighborhoodHydration =
      selectedNeighborhood.name !== fullInfo.name ||
      (!selectedNeighborhood.polygon && Boolean(fullInfo.polygon)) ||
      (!selectedNeighborhood.geofence && Boolean(fullInfo.geofence));

    if (needsNeighborhoodHydration) {
      setSelectedNeighborhood({
        ...fullInfo,
        matched_sub_neighborhood:
          matchedSearchSubNeighborhood ?? selectedSearchSubNeighborhood ?? undefined,
      });
    }

    if (!isPendingQuerySelection) return;
    pendingQuerySelectionRef.current = null;

    const subNeighborhoodCenter = getSubNeighborhoodCenter(
      matchedSearchSubNeighborhood ?? pendingSelection.subNeighborhood,
    );
    const target =
      subNeighborhoodCenter ??
      (Number.isFinite(fullInfo.lat) && Number.isFinite(fullInfo.lng)
        ? { lat: Number(fullInfo.lat), lng: Number(fullInfo.lng) }
        : null);

    if (!target) return;

    setMapCenter((current) => {
      const threshold = 0.00001;
      if (
        Math.abs(current.lat - target.lat) <= threshold &&
        Math.abs(current.lng - target.lng) <= threshold
      ) {
        return current;
      }

      return { ...current, lat: target.lat, lng: target.lng };
    });
  }, [
    fullInfo,
    pendingQuerySelectionRef,
    selectedNeighborhood,
    selectedSearchSubNeighborhood,
    setMapCenter,
    setSelectedNeighborhood,
  ]);
}
