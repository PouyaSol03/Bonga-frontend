import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { readText } from "../../../shared/lib/textUtils";
import { useMyAdvertisementDetailQuery } from "../../advertisements/api/advertisement.hooks";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import {
  useAdvertisementArchiveStatusQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import "../../advertisements/components/AdCard.css";
import { usePublicAgencyDetailQuery } from "../../agencies/api/agency.hooks";
import { createUnavailableAdCard, readEntityId } from "../ad-state/adModel";
import { getStateAdBackPath, readAdIdFromPath, readRouteState } from "../ad-state/routeState";
import type { AccountMyAdStatePageProps } from "../ad-state/types";
import { getAdEditPath } from "../adManagement/adManagementData";
import { getMyAdStatusInfo } from "../myAdsStatus";

export function useAdStateData(props?: AccountMyAdStatePageProps) {
  const navigate = useNavigate();
  const routeState = props ? { ...readRouteState(), ...props } : readRouteState();
  const adId =
    readAdIdFromPath() ??
    readEntityId(props?.ad) ??
    readEntityId(props?.card) ??
    readEntityId(routeState.ad) ??
    readEntityId(routeState.card);
  const isAfterEdit = Boolean(routeState.isEditMode);
  const detailQuery = useMyAdvertisementDetailQuery(
    !isAfterEdit && (props?.card || props?.ad) ? null : (adId ?? null),
  );
  const statusQuery = new URLSearchParams(window.location.search).get("status") ?? undefined;
  const sourceAd = props?.ad ?? detailQuery.data ?? routeState.ad;
  const card =
    props?.card ??
    (detailQuery.data
      ? mapAdvertisementToAdCard(detailQuery.data, 0)
      : (routeState.card ?? createUnavailableAdCard(adId, sourceAd)));
  const statusInfo = getMyAdStatusInfo(
    props?.status ??
      detailQuery.data ??
      statusQuery ??
      routeState.status ??
      routeState.ad ??
      routeState.card?.status,
  );
  const isAssigned =
    statusInfo.key !== "wait_for_payment" &&
    Boolean(
      props?.isAssigned ??
      routeState.isAssigned ??
      (sourceAd?.assigned_agency_id ||
        sourceAd?.assignedAgencyId ||
        sourceAd?.assignment_id ||
        sourceAd?.assignmentId ||
        sourceAd?.assignment_status ||
        sourceAd?.assignmentStatus ||
        sourceAd?.is_assigned ||
        sourceAd?.isAssigned ||
        statusInfo.key === "wait_for_agency" ||
        statusInfo.key === "wait_for_repost" ||
        statusInfo.key === "wait_for_stop" ||
        statusInfo.key === "wait_for_deal_confirmation"),
    );
  const cameFromAdManagement = !isAssigned && Boolean(routeState.tab || routeState.returnTo);
  const backTo = props?.backTo ?? getStateAdBackPath(routeState, isAssigned);
  const backState = cameFromAdManagement ? { tab: routeState.tab } : undefined;
  const activeRole = props?.role ?? getActiveAuthRole(getStoredAuthSession());

  const handleBack = () => {
    navigate("/account/manage-ads", { replace: true });
  };

  const currentAdId = adId ?? (card ? String(card.id) : undefined);
  const reRegisterStatusQuery = useAdvertisementReRegisterStatusQuery(currentAdId);
  const archiveStatusQuery = useAdvertisementArchiveStatusQuery(currentAdId);
  const submitResultStatusQuery = useAdvertisementSubmitResultStatusQuery(currentAdId);

  const agencyId = readText(
    sourceAd?.assigned_agency_id ??
      sourceAd?.assignedAgencyId ??
      sourceAd?.agency_id ??
      sourceAd?.agencyId ??
      sourceAd?.publisher_agency_id ??
      (sourceAd?.agency && typeof sourceAd.agency === "object"
        ? (sourceAd.agency as Record<string, unknown>).id
        : undefined),
  );

  const agencyDetailQuery = usePublicAgencyDetailQuery({
    id: agencyId,
    enabled: Boolean(agencyId),
  });

  useEffect(() => {
    if (statusInfo.key === "incomplete" && currentAdId) {
      navigate(
        getAdEditPath(
          currentAdId,
          backTo,
          (detailQuery.data?.data ?? routeState.ad ?? routeState.card) as never,
        ),
        { replace: true },
      );
    }
  }, [statusInfo.key, currentAdId, backTo, detailQuery.data, routeState.ad, routeState.card]);
  return {
    navigate,
    routeState,
    adId,
    isAfterEdit,
    detailQuery,
    sourceAd,
    card,
    statusInfo,
    isAssigned,
    backTo,
    backState,
    activeRole,
    handleBack,
    reRegisterStatusQuery,
    archiveStatusQuery,
    submitResultStatusQuery,
    agencyId,
    agencyDetailQuery,
  };
}
