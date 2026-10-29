import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import { toNumericValue } from "../../../shared/lib/numberUtils";
import { getAdvertisementImageUrls } from "../../advertisements/utils/advertisement-images";
import { getCrmAdvertise } from "../api/crm.service";
import { technicalFeatureKeys } from "./constants";
import { formatDate, resolvePricePresentation } from "./formatters";
import {
  getFeatureKey,
  getFeatureValue,
  normalizeFeatures,
  readHumanText,
  readNestedName,
  readText,
} from "./helpers";
import { useAdvertiseLocations } from "./useAdvertiseLocations";

export function useCrmAdvertiseDetail({
  advertiseId,
  notify,
  refreshNonce,
}: {
  advertiseId: string;
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
}) {
  const advertiseQuery = useQuery({
    queryFn: () => getCrmAdvertise(advertiseId),
    queryKey: ["crm", "advertise", "panel-show", advertiseId, refreshNonce],
  });

  const advertise = advertiseQuery.data;
  const features = useMemo(() => normalizeFeatures(advertise), [advertise]);

  const featureMap = useMemo(() => {
    const map: Record<string, unknown> = {};
    for (const feature of features) {
      const key = getFeatureKey(feature);
      if (key && feature.value !== undefined && feature.value !== null) {
        map[key] = feature.value;
      }
    }
    return map;
  }, [features]);

  const formCode =
    readText(advertise, ["form_code"]) || String(getFeatureValue(features, ["form_code"]) ?? "");
  const featureLocation = getFeatureValue(features, ["location"]);

  const { categoryName, cityName, neighborhoodName } = useAdvertiseLocations({
    advertise,
    advertiseId,
    featureLocation,
    notify,
  });

  useEffect(() => {
    if (advertiseQuery.error) {
      notify(getApiErrorMessage(advertiseQuery.error, "دریافت جزئیات آگهی ناموفق بود."), "error");
    }
  }, [advertiseQuery.error, notify]);

  const images = getAdvertisementImageUrls(advertise);
  const coverImage = images[0];
  const title = readText(advertise, ["title", "label"], "آگهی بدون عنوان");

  const rootPrice = advertise?.price || undefined;
  const area =
    advertise?.area || featureMap.area || featureMap.land_area || featureMap.building_area;
  const pricePresentation = resolvePricePresentation(formCode, featureMap, rootPrice, area);

  const ownerPhone = readText(advertise, ["owner_phone", "phone", "mobile"], "-");
  const ownerName =
    readText(advertise, ["owner_name", "publisher_name", "advertiser_name"]) ||
    readNestedName(advertise, ["owner", "user", "publisher"]) ||
    "ثبت نشده";
  const trackCode = readText(advertise, ["track_code"], "-");
  const createdAt = formatDate(advertise?.created_at ?? advertise?.published_at);
  const latitude = toNumericValue(advertise?.lat ?? advertise?.latitude);
  const longitude = toNumericValue(advertise?.lng ?? advertise?.long ?? advertise?.longitude);
  const hasMapPosition = latitude !== null && longitude !== null;

  const savedAddress = readHumanText(advertise, [
    "address",
    "full_address",
    "formatted_address",
    "postal_address",
  ]);
  const locationTitle = [cityName, neighborhoodName]
    .filter((value) => value && !value.includes("موجود نیست") && !value.includes("در حال دریافت"))
    .join("، ");
  const address = savedAddress || locationTitle || "آدرس ثبت نشده است";
  const description = readText(
    advertise,
    ["description", "short_description"],
    "توضیحی برای این آگهی ثبت نشده است.",
  );
  const adminNote = readText(advertise, ["admin_note"]);
  const statusLogs = Array.isArray(advertise?.status_logs)
    ? (advertise.status_logs as unknown[])
    : Array.isArray(advertise?.logs)
      ? (advertise.logs as unknown[])
      : [];

  const visibleFeatures = useMemo(() => {
    const order = [
      "area",
      "land_area",
      "building_area",
      "price",
      "building_age",
      "rooms",
      "floor",
      "document_type",
      "land_use",
      "land_position",
      "building_type",
      "villa_type",
      "heatingCooling",
      "facilities",
    ];
    const index = new Map(order.map((key, position) => [key, position]));

    return features
      .filter((feature) => {
        const key = getFeatureKey(feature);
        return (
          key &&
          !technicalFeatureKeys.has(key) &&
          feature.value !== undefined &&
          feature.value !== null &&
          feature.value !== ""
        );
      })
      .sort(
        (a, b) =>
          (index.get(getFeatureKey(a)) ?? Number.MAX_SAFE_INTEGER) -
          (index.get(getFeatureKey(b)) ?? Number.MAX_SAFE_INTEGER),
      );
  }, [features]);

  return {
    address,
    adminNote,
    advertise,
    area,
    categoryName,
    cityName,
    coverImage,
    createdAt,
    description,
    formCode,
    hasMapPosition,
    images,
    isLoading: advertiseQuery.isLoading,
    latitude,
    locationTitle,
    longitude,
    neighborhoodName,
    ownerName,
    ownerPhone,
    pricePresentation,
    statusLogs,
    title,
    trackCode,
    visibleFeatures,
  };
}
