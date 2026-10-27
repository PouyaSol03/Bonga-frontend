import { useState } from "react";
import { useLocation } from "react-router";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { parseAdIdFromPath } from "../viewAdData";
import { getFeatureValue } from "./featureValues";
import { toText } from "./detailCore";

export function parseViewAdIdFromPath(pathname: string) {
  const parsedId = parseAdIdFromPath(pathname);

  if (parsedId) {
    return parsedId;
  }

  const match = pathname.match(/\/(?:ads|preview-ad)\/([^/]+)/);
  return match?.[1] ?? null;
}

export function useViewAdRouteContext() {
  const location = useLocation();
  const rawPath = location.pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  const currentParsedId = parseViewAdIdFromPath(rawPath);
  const isCurrentPreview =
    rawPath.startsWith("/preview-ad/") ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/preview-ad/"));

  const [routeState, setRouteState] = useState(() => ({
    adId: currentParsedId,
    isPreview: isCurrentPreview,
  }));

  if (
    currentParsedId != null &&
    (routeState.adId !== currentParsedId || routeState.isPreview !== isCurrentPreview)
  ) {
    setRouteState({
      adId: currentParsedId,
      isPreview: isCurrentPreview,
    });
  }

  return routeState;
}

export function getCurrentViewAdBasePath(adId: string, isPreview?: boolean) {
  const preview =
    isPreview ??
    (typeof window !== "undefined" && window.location.pathname.startsWith("/preview-ad/"));
  return preview ? `/preview-ad/${adId}` : `/ads/${adId}`;
}

export function getDetailPageTitle(
  features: NonNullable<AdvertisementItem["features"]>,
  fallbackFormCode = "",
) {
  const formCode = toText(getFeatureValue(features, "form_code"), fallbackFormCode);

  const titles: Record<string, string> = {
    "sale-apartment": "اطلاعات آپارتمان",
    "sale-villa-house": "اطلاعات ویلا",
    "sale-garden-villa": "اطلاعات ویلا",
    "sale-land": "اطلاعات زمین",
    "sale-office": "اطلاعات واحد اداری",
    "sale-commercial": "اطلاعات واحد تجاری",
    "sale-factory": "اطلاعات واحد صنعتی",
    "sale-warehouse": "اطلاعات واحد صنعتی",
    "sale-hotel": "اطلاعات هتل، اقامتگاه",
    "rent-apartment": "اطلاعات آپارتمان",
    "rent-villa-house": "اطلاعات خانه، ویلا",
    "rent-garden-villa": "اطلاعات خانه، ویلا",
    "rent-office": "اطلاعات واحد اداری",
    "rent-commercial": "اطلاعات واحد تجاری",
    "rent-factory-workshop": "اطلاعات واحد صنعتی",
    "rent-warehouse": "اطلاعات واحد صنعتی",
    "rent-hotel": "اطلاعات هتل، اقامتگاه",
  };

  if (titles[formCode]) return titles[formCode];
  if (formCode.includes("garden-villa")) return "اطلاعات باغ، ویلا";
  if (formCode.includes("villa")) return "اطلاعات ویلا";
  if (formCode.includes("land")) return "اطلاعات زمین";
  if (formCode.includes("office")) return "اطلاعات واحد اداری";
  if (formCode.includes("commercial")) return "اطلاعات واحد تجاری";
  if (formCode.includes("factory") || formCode.includes("warehouse")) return "اطلاعات واحد صنعتی";
  if (formCode.includes("hotel")) return "اطلاعات هتل، اقامتگاه";

  return "اطلاعات ملک";
}
