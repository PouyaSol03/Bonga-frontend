import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import { toNumericValue } from "../../../shared/lib/numberUtils";
import { getAdvertisementImageUrls } from "../../advertisements/utils/advertisement-images";
import {
  getCrmAdvertise,
  getCrmRecordId,
  listCrmAgencies,
  updateCrmAdvertiseStatus,
  type AdvertiseStatus,
} from "../api/crm.service";
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

export type ResolvedCrmAgency = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  managerName?: string;
  isAgency: boolean;
};

export function useCrmAdvertiseDetail({
  advertiseId,
  notify,
  refreshNonce,
}: {
  advertiseId: string;
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
}) {
  const queryClient = useQueryClient();
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

  const statusMutation = useMutation({
    mutationFn: ({
      nextStatus,
      reason,
    }: {
      nextStatus: AdvertiseStatus;
      reason?: string;
    }) => updateCrmAdvertiseStatus(advertiseId, nextStatus, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["crm", "advertise", "panel-show", advertiseId],
      });
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "advertises"] });
      notify("وضعیت آگهی با موفقیت به‌روزرسانی شد.", "success");
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آگهی ناموفق بود."), "error");
    },
  });

  const updateStatus = async (nextStatus: AdvertiseStatus, reason?: string) => {
    await statusMutation.mutateAsync({ nextStatus, reason });
  };

  // Resolve Agency Information
  const rawAgency =
    advertise?.agency && typeof advertise.agency === "object" && !Array.isArray(advertise.agency)
      ? (advertise.agency as Record<string, unknown>)
      : null;

  const directAgencyName =
    (typeof advertise?.agency === "string" ? advertise.agency.trim() : "") ||
    (rawAgency?.name as string) ||
    (rawAgency?.title as string) ||
    readText(advertise, ["agency_name", "publisher_agency_name", "target_owner_name"]);

  const rawAgencyId =
    readText(advertise, ["agency_id", "publisher_agency_id", "target_owner_id"]) ||
    (rawAgency?.id ? String(rawAgency.id) : "") ||
    (advertise?.target_owner_type === "agency" && advertise.target_owner_id
      ? String(advertise.target_owner_id)
      : "") ||
    String(featureMap.agency_id ?? "");

  const agenciesQuery = useQuery({
    enabled: Boolean(rawAgencyId && !directAgencyName),
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "agencies", "lookup"],
    staleTime: 60_000,
  });

  const matchedAgencyFromList = useMemo(() => {
    if (!rawAgencyId || !agenciesQuery.data) return null;
    return agenciesQuery.data.find(
      (a) => getCrmRecordId(a) === rawAgencyId || String(a.id) === rawAgencyId,
    );
  }, [rawAgencyId, agenciesQuery.data]);

  const agencyName =
    directAgencyName ||
    (matchedAgencyFromList ? readText(matchedAgencyFromList, ["name", "title"]) : "") ||
    (rawAgencyId ? `آژانس کد ${rawAgencyId}` : "");

  const agencyPhone =
    (rawAgency?.phone as string) ||
    (rawAgency?.phone1 as string) ||
    (rawAgency?.mobile as string) ||
    (matchedAgencyFromList ? readText(matchedAgencyFromList, ["phone1", "phone", "mobile"]) : "") ||
    readText(advertise, ["agency_phone", "agency_phone1", "agency_mobile"]);

  const agencyAddress =
    (rawAgency?.address as string) ||
    (rawAgency?.formatted_address as string) ||
    (matchedAgencyFromList ? readText(matchedAgencyFromList, ["address"]) : "") ||
    readText(advertise, ["agency_address"]);

  const agencyManagerName =
    (rawAgency?.manager_name as string) ||
    (rawAgency?.owner_name as string) ||
    (matchedAgencyFromList ? readText(matchedAgencyFromList, ["manager_name", "owner_name"]) : "") ||
    readText(advertise, ["agency_manager_name"]);

  const isAgencyPublished = Boolean(
    agencyName ||
      rawAgencyId ||
      advertise?.owner_type === "agency" ||
      advertise?.publisher_type === "agency" ||
      advertise?.target_owner_type === "agency",
  );

  const agency: ResolvedCrmAgency | null = isAgencyPublished
    ? {
        id: rawAgencyId,
        name: agencyName || "آژانس املاک",
        phone: agencyPhone,
        address: agencyAddress,
        managerName: agencyManagerName,
        isAgency: true,
      }
    : null;

  const images = getAdvertisementImageUrls(advertise);
  const coverImage = images[0];
  const title = readText(advertise, ["title", "label"], "آگهی بدون عنوان");

  const rootPrice = advertise?.price || undefined;
  const area =
    advertise?.area || featureMap.area || featureMap.land_area || featureMap.building_area;
  const rooms = featureMap.rooms || advertise?.rooms;
  const floor = featureMap.floor || advertise?.floor;
  const age = featureMap.building_age || featureMap.age || advertise?.age;
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
  const virtualTourLink = readText(advertise, ["virtual_tour_link", "tour3d_url", "tour_3d_url"]);
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
    agency,
    age,
    area,
    categoryName,
    cityName,
    coverImage,
    createdAt,
    description,
    floor,
    formCode,
    hasMapPosition,
    images,
    isLoading: advertiseQuery.isLoading,
    isUpdatingStatus: statusMutation.isPending,
    latitude,
    locationTitle,
    longitude,
    neighborhoodName,
    ownerName,
    ownerPhone,
    pricePresentation,
    rooms,
    statusLogs,
    title,
    trackCode,
    updateStatus,
    virtualTourLink,
    visibleFeatures,
  };
}
