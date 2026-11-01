import { useState, useCallback } from "react";
import { getNeighborhoodInfoWithLoc, type NeighborhoodDto } from "../../locations/api/neighborhood.service";
import {
  findNearestNeighborhood,
  getInitialAgencyProfileMapCenter,
  selectedCityMapZoom,
  toSelectedNeighborhood,
} from "./agencyProfileHelpers";
import type { AgencyProfileMapCenter, SelectedNeighborhood } from "./types";

export function useAgencyProfileLocationSync({
  cityId,
  neighborhoods,
  setSelectedNeighborhood,
}: {
  cityId: string;
  neighborhoods: NeighborhoodDto[];
  setSelectedNeighborhood: (neighborhood: SelectedNeighborhood | null) => void;
}) {
  const [mapCenter, setMapCenter] = useState<AgencyProfileMapCenter>(
    getInitialAgencyProfileMapCenter,
  );

  const handleNeighborhoodChange = useCallback(
    (neighborhood: SelectedNeighborhood | null) => {
      setSelectedNeighborhood(neighborhood);
      if (neighborhood?.lat !== undefined && neighborhood.lng !== undefined) {
        setMapCenter({
          lat: neighborhood.lat,
          lng: neighborhood.lng,
          zoom: selectedCityMapZoom,
        });
      }
    },
    [setSelectedNeighborhood],
  );

  const handleMapCenterChange = useCallback(
    (center: AgencyProfileMapCenter) => {
      setMapCenter(center);
      if (!cityId) return;

      void getNeighborhoodInfoWithLoc({ cityId, lat: center.lat, lng: center.lng })
        .then((neighborhood) => {
          if (neighborhood) {
            setSelectedNeighborhood(toSelectedNeighborhood(neighborhood));
          } else if (neighborhoods.length > 0) {
            const nearest = findNearestNeighborhood(center.lat, center.lng, neighborhoods);
            if (nearest && nearest.lat !== undefined && nearest.lng !== undefined) {
              setSelectedNeighborhood(nearest);
              setMapCenter((cur) => ({ ...cur, lat: nearest.lat!, lng: nearest.lng! }));
            }
          }
        })
        .catch(() => {
          if (neighborhoods.length > 0) {
            const nearest = findNearestNeighborhood(center.lat, center.lng, neighborhoods);
            if (nearest && nearest.lat !== undefined && nearest.lng !== undefined) {
              setSelectedNeighborhood(nearest);
              setMapCenter((cur) => ({ ...cur, lat: nearest.lat!, lng: nearest.lng! }));
            }
          }
        });
    },
    [cityId, neighborhoods, setSelectedNeighborhood],
  );

  return {
    handleMapCenterChange,
    handleNeighborhoodChange,
    mapCenter,
    setMapCenter,
  };
}
