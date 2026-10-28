import { useMemo } from "react";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { useMyAdsInfiniteQuery, useMyAgencyProfileQuery } from "../../account/api/account.hooks";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import {
  useAgencyConsultantsQuery,
  usePublicAgencyDetailQuery,
  usePublicAgentDetailQuery,
} from "../../agencies/api/agency.hooks";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { useAgencyDashboardQuery } from "../api/dashboard.hooks";
import { resolvePreviewContactInfo } from "./profileHelpers";
import { resolvePreviewEntity } from "./resolvePreviewEntity";
import type { AgencyPreviewContactInfo, AgencyPreviewTab } from "./types";
import {
  getAbsoluteAgencyPreviewUrl,
  getCurrentAgencyPreviewPath,
  getCurrentPageUrl,
  getPreviewSearchParam,
  getPublicPreviewId,
  isPublicAgencyPreviewPath,
  isPublicAgentPreviewPath,
} from "./urlHelpers";

export function useAgencyPreviewData(activeTab: AgencyPreviewTab) {
  const isPublicPreview = isPublicAgencyPreviewPath();
  const isAgentPreview = isPublicAgentPreviewPath();
  const previewPath = getCurrentAgencyPreviewPath();
  const publicPreviewId = getPublicPreviewId();
  const isRealEstateManager = getActiveAuthRole(getStoredAuthSession()) === REAL_ESTATE_MANAGER;

  const publicAgencyQuery = usePublicAgencyDetailQuery({
    enabled: isPublicPreview && !isAgentPreview,
    id: publicPreviewId,
  });
  const publicAgentQuery = usePublicAgentDetailQuery({
    enabled: isPublicPreview && isAgentPreview,
    id: publicPreviewId,
  });
  const agencyProfileQuery = useMyAgencyProfileQuery({
    enabled: !isPublicPreview && isRealEstateManager,
  });
  const agencyDashboardQuery = useAgencyDashboardQuery({
    enabled: !isPublicPreview && isRealEstateManager,
    period: "30d",
  });
  const ownAdsQuery = useMyAdsInfiniteQuery({
    enabled: !isPublicPreview && isRealEstateManager && activeTab === "ads",
    perPage: 100,
    type: "active",
  });
  const agencyConsultantsQuery = useAgencyConsultantsQuery({
    enabled: !isPublicPreview && isRealEstateManager && activeTab === "consultants",
    perPage: 100,
  });

  const profile = agencyProfileQuery.data;
  const publicAgency = publicAgencyQuery.data;
  const publicAgent = publicAgentQuery.data;
  const selectedCity = readStoredSelectedCity();

  const {
    activityAreaIds,
    cityId,
    cityName,
    entityAbout,
    entityId,
    entityLocation,
    entityLogo,
    entityName,
  } = resolvePreviewEntity({
    isAgentPreview,
    isPublicPreview,
    profile,
    publicAgency,
    publicAgent,
    selectedCity,
  });

  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId) && activityAreaIds.length > 0,
    page: 1,
    perPage: 500,
    q: "",
  });

  const neighborhoodNameById = useMemo(
    () =>
      new Map(
        (neighborhoodsQuery.data ?? []).map((n) => [String(n.id ?? n._id ?? ""), n.name]),
      ),
    [neighborhoodsQuery.data],
  );

  const activityAreas = useMemo(
    () => activityAreaIds.map((id: string) => neighborhoodNameById.get(id) ?? id),
    [activityAreaIds, neighborhoodNameById],
  );

  const contactInfo: AgencyPreviewContactInfo = isAgentPreview
    ? {
        phone: publicAgent?.mobile ?? getPreviewSearchParam("phone1"),
        secondPhone: "",
        landline: "",
        whatsapp: publicAgent?.whatsapp ?? "",
        telegram: publicAgent?.telegram ?? "",
        instagram: publicAgent?.instagram ?? "",
        lat: undefined,
        lng: undefined,
      }
    : publicAgency
      ? {
          phone: publicAgency.phone1 ?? "",
          secondPhone: publicAgency.phone2 ?? "",
          landline: publicAgency.phone3 ?? "",
          whatsapp: publicAgency.whatsapp ?? "",
          telegram: publicAgency.telegram ?? "",
          instagram: publicAgency.instagram ?? "",
          lat: publicAgency.lat,
          lng: publicAgency.lng,
        }
      : resolvePreviewContactInfo(profile, isPublicPreview);

  const dashboard = agencyDashboardQuery.data;
  const recentAdvertises = isAgentPreview
    ? (publicAgent?.recent_advertises ?? [])
    : (publicAgency?.recent_advertises ?? []);

  const previewAds = isPublicPreview
    ? recentAdvertises.map((ad, i) => ({ ...mapAdvertisementToAdCard(ad, i), agency: entityName }))
    : (ownAdsQuery.data?.pages ?? [])
        .flatMap((page) => page.data)
        .map((ad, i) => ({ ...mapAdvertisementToAdCard(ad, i), agency: entityName }));

  const consultants = isPublicPreview
    ? (publicAgency?.consultants ?? [])
    : (agencyConsultantsQuery.data?.data ?? []);

  return {
    activityAreaIds,
    activityAreas,
    cityId,
    cityName,
    consultants,
    contactInfo,
    dashboard,
    entityAbout,
    entityId,
    entityLocation,
    entityLogo,
    entityName,
    isAgentPreview,
    isPublicPreview,
    previewAds,
    previewPath,
    profile,
    publicActiveAds: isAgentPreview ? publicAgent?.active_advertises_count : publicAgency?.active_advertises_count,
    publicAgency,
    publicAgencyQuery,
    publicAgent,
    publicAgentQuery,
    publicPreviewError: isAgentPreview ? publicAgentQuery.error : publicAgencyQuery.error,
    publicPreviewLoading: isAgentPreview ? publicAgentQuery.isLoading : publicAgencyQuery.isLoading,
    publicRank: isAgentPreview ? publicAgent?.rank : publicAgency?.rank,
    publicScore: isAgentPreview ? publicAgent?.score : publicAgency?.score,
    shareUrl: isPublicPreview
      ? getCurrentPageUrl()
      : getAbsoluteAgencyPreviewUrl(entityId, {
          aboutUs: entityAbout,
          activeAds: dashboard ? String(dashboard.publishedAdvertises.total) : undefined,
          cityId,
          cityName,
          location: entityLocation,
          logo: entityLogo,
          name: entityName,
          neighborhoodIds: activityAreaIds,
          phone1: contactInfo.phone,
          phone2: contactInfo.secondPhone,
          phone3: contactInfo.landline,
          rank: dashboard ? String(dashboard.ranking.rank) : undefined,
          score: dashboard ? String(dashboard.ranking.current.totalScore) : undefined,
        }),
  };
}
