import { readText } from "../../../shared/lib/textUtils";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";
import { getMyAdStatusInfo } from "../myAdsStatus";

export function getPersonalAdContacts(
  sourceAd: Record<string, unknown> | undefined,
  agencyDetailQuery: { data?: unknown },
  isAssigned: boolean,
  statusInfo: ReturnType<typeof getMyAdStatusInfo>,
  agencyId: string,
  adId: string | undefined,
  card: AdCardData,
) {
  const agencyData = agencyDetailQuery.data as Record<string, unknown> | undefined;
  const agencyObj =
    agencyData?.agency && typeof agencyData.agency === "object"
      ? (agencyData.agency as Record<string, unknown>)
      : undefined;
  const queryPhone = readText(
    agencyData?.phone ??
      agencyData?.agency_phone ??
      agencyData?.mobile ??
      agencyObj?.phone ??
      agencyObj?.agency_phone ??
      agencyObj?.mobile,
  );

  const agencyPhone = readText(
    sourceAd?.assigned_agency_phone ??
      sourceAd?.agency_phone ??
      (sourceAd?.agency && typeof sourceAd.agency === "object"
        ? (sourceAd.agency as Record<string, unknown>).phone
        : undefined) ??
      (sourceAd?.assigned_consultant && typeof sourceAd.assigned_consultant === "object"
        ? (sourceAd.assigned_consultant as Record<string, unknown>).phone
        : undefined) ??
      sourceAd?.consultant_phone ??
      queryPhone ??
      sourceAd?.phone,
  );

  const consultantUserId = readText(
    sourceAd?.assigned_consultant_user_id ??
      sourceAd?.assigned_consultant_id ??
      sourceAd?.consultant_user_id ??
      (sourceAd?.assigned_consultant && typeof sourceAd.assigned_consultant === "object"
        ? (sourceAd.assigned_consultant as Record<string, unknown>).user_id
        : undefined),
  );

  const showAgencyBottomBar = Boolean(
    (isAssigned ||
      statusInfo.key === "wait_for_agency" ||
      (isAssigned && statusInfo.key === "pending") ||
      statusInfo.key === "wait_for_stop") &&
    statusInfo.key !== "rejected_by_agency",
  );

  const handleCallAgency = () => {
    if (agencyPhone) {
      window.location.href = `tel:${agencyPhone}`;
    } else {
      alert("شماره تماس آژانس در دسترس نیست.");
    }
  };

  const handleSendMessage = () => {
    const chatQuery = new URLSearchParams();
    if (consultantUserId) {
      chatQuery.set("userId", consultantUserId);
    } else if (agencyId) {
      chatQuery.set("agencyId", agencyId);
    }
    const currentId = adId ?? (card ? String(card.id) : undefined);
    if (currentId) {
      chatQuery.set("adId", currentId);
    }
    window.location.href = `/chat?${chatQuery.toString()}`;
  };
  return { showAgencyBottomBar, handleCallAgency, handleSendMessage };
}
