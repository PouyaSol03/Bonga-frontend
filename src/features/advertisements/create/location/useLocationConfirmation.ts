import { useNavigate } from "react-router";
import { useToast } from "../../../../shared/hooks/useToast";
import {
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
} from "../data";
import { preserveNewAdDraftStateKey, updateNewAdFlowSessionLocation } from "../session";
import {
  getNeighborhoodId,
  getSubNeighborhoodId,
  selectedNeighborhoodMapZoom,
  type NewAdMapCenter,
} from "./newAdLocationStorage";
import type { NeighborhoodDto, SubNeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getBrowserLocation } from "../../../../shared/lib/browserLocation";

type UseLocationConfirmationProps = {
  label: string;
  mapCenter: NewAdMapCenter;
  query: string;
  selectedNeighborhood: NeighborhoodDto | null;
  selectedSubNeighborhood: SubNeighborhoodDto | null;
  updateMapCenter: (center: NewAdMapCenter) => void;
};

export function useLocationConfirmation({
  label,
  mapCenter,
  query,
  selectedNeighborhood,
  selectedSubNeighborhood,
  updateMapCenter,
}: UseLocationConfirmationProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleBack = () => {
    const currentState =
      typeof window !== "undefined" &&
      window.history.state &&
      typeof window.history.state === "object"
        ? window.history.state
        : {};
    navigate(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`, {
      replace: true,
      state: {
        ...currentState,
        [preserveNewAdDraftStateKey]: true,
      },
    });
  };

  const moveToBrowserLocation = () => {
    void getBrowserLocation().then((location) => {
      updateMapCenter({
        lat: location.latitude,
        lng: location.longitude,
        zoom: Math.max(mapCenter.zoom, selectedNeighborhoodMapZoom),
      });
    });
  };

  const handleConfirmLocation = () => {
    const neighborhoodId = getNeighborhoodId(selectedNeighborhood);
    if (!neighborhoodId) {
      showToast("لطفاً محله ملک را از لیست جستجو یا روی نقشه مشخص کنید.", undefined, "error");
      return;
    }

    const confirmedLocation =
      selectedNeighborhood?.name?.trim() || query.trim() || "موقعیت انتخاب‌شده";

    window.localStorage.setItem(locationKey, confirmedLocation);
    window.localStorage.setItem(neighborhoodIdKey, neighborhoodId);
    const subNeighborhoodId = getSubNeighborhoodId(selectedSubNeighborhood);
    if (subNeighborhoodId) {
      window.localStorage.setItem(subNeighborhoodIdKey, subNeighborhoodId);
    } else {
      window.localStorage.removeItem(subNeighborhoodIdKey);
    }
    const latStr = String(mapCenter.lat);
    const lngStr = String(mapCenter.lng);
    window.localStorage.setItem(locationLatKey, latStr);
    window.localStorage.setItem(locationLngKey, lngStr);
    updateNewAdFlowSessionLocation(confirmedLocation, {
      neighborhoodId,
      subNeighborhoodId: subNeighborhoodId || null,
      lat: latStr,
      lng: lngStr,
    });
    const currentState =
      typeof window !== "undefined" &&
      window.history.state &&
      typeof window.history.state === "object"
        ? window.history.state
        : {};
    navigate(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`, {
      replace: true,
      state: {
        ...currentState,
        confirmedLocation,
        confirmedNeighborhoodId: neighborhoodId,
        confirmedSubNeighborhoodId: subNeighborhoodId || null,
        confirmedLat: latStr,
        confirmedLng: lngStr,
        [preserveNewAdDraftStateKey]: true,
      },
    });
  };

  return {
    handleBack,
    handleConfirmLocation,
    moveToBrowserLocation,
  };
}
