import { useCallback, useEffect, useRef, useState } from "react";
import {
  getBrowserLocation,
  getBrowserLocationNotice,
  type BrowserLocation,
} from "../../../shared/lib/browserLocation";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { searchMapCenter, type SearchMapCenter } from "../searchMapData";
import { getIpDefaultMapCenter } from "../searchMapLocation";
import type { SearchMapMode } from "./types";

interface UseSearchMapUserLocationOptions {
  setMapCenter: React.Dispatch<React.SetStateAction<SearchMapCenter>>;
  setMapCenterSignal: React.Dispatch<React.SetStateAction<number>>;
  setMode: (mode: SearchMapMode) => void;
  setSelectedListingId: (id: string | number | null) => void;
  showNotice: (
    msg: string | null | undefined,
    variant?: "error" | "success" | "info" | "warning",
  ) => void;
}

export function useSearchMapUserLocation({
  setMapCenter,
  setMapCenterSignal,
  setMode,
  setSelectedListingId,
  showNotice,
}: UseSearchMapUserLocationOptions) {
  const [isOffline, setIsOffline] = useState(
    () => typeof window !== "undefined" && !window.navigator.onLine,
  );
  const [isLocated, setIsLocated] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<BrowserLocation | null>(null);
  const didResolveIpLocationRef = useRef(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (didResolveIpLocationRef.current) return;
    const selectedCity = readStoredSelectedCity();
    if (selectedCity?.latitude !== undefined && selectedCity.longitude !== undefined) {
      return;
    }

    didResolveIpLocationRef.current = true;

    void getIpDefaultMapCenter().then((ipCenter) => {
      if (!ipCenter) return;

      setMapCenter((current) => {
        if (
          current.latitude !== searchMapCenter.latitude ||
          current.longitude !== searchMapCenter.longitude
        ) {
          return current;
        }

        return ipCenter;
      });
    });
  }, [setMapCenter]);

  const locateUser = useCallback(() => {
    if (isLocating) return;

    setIsLocating(true);
    showNotice("در حال دریافت موقعیت شما...");

    void getBrowserLocation({ maximumAge: 30_000, timeout: 15_000 })
      .then((location) => {
        setIsLocated(true);
        setUserLocation(location);
        setMapCenter({
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 16,
        });
        setMapCenterSignal((current) => current + 1);
        setSelectedListingId(null);
        setMode("map");
        showNotice("موقعیت شما روی نقشه مشخص شد");
      })
      .catch((error) => {
        setIsLocated(false);
        showNotice(getBrowserLocationNotice(error));
      })
      .finally(() => {
        setIsLocating(false);
      });
  }, [isLocating, setMapCenter, setMapCenterSignal, setMode, setSelectedListingId, showNotice]);

  return {
    isLocated,
    isLocating,
    isOffline,
    locateUser,
    setIsOffline,
    userLocation,
  };
}
