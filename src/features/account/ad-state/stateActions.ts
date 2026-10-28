import { readText } from "../../../shared/lib/textUtils";
import "../../advertisements/components/AdCard.css";
import {
  adManagementPaths,
  getAdEditPath,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPaymentPath,
  getAdPreviewPath,
  getAdVisitStatisticsPath,
} from "../adManagement/adManagementData";
import { type MyAdStatusKey } from "../myAdsStatus";
import type { StateAction } from "./types";

export function getStateActions(
  status: MyAdStatusKey,
  adId: string,
  isAssigned?: boolean,
  ad?: Record<string, unknown>,
  onStopPublish?: () => void,
  returnTo?: string,
): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) };
  const edit: StateAction = {
    icon: "edit",
    label: "ویرایش",
    to: getAdEditPath(
      adId,
      returnTo || (isAssigned ? "/account/my-ads" : adManagementPaths.root),
      ad,
    ),
  };
  const remove: StateAction = {
    icon: "delete",
    label: "حذف",
    to: `${adManagementPaths.delete}?adId=${encodeURIComponent(adId)}`,
  };
  const upgrade: StateAction = {
    icon: "upgrade",
    label: "ارتقای آگهی",
    to: getAdIncreaseVisitsPath(adId),
  };
  const stats: StateAction = {
    icon: "stats",
    label: "آمار بازدید",
    to: getAdVisitStatisticsPath(adId),
  };
  const history: StateAction = {
    icon: "history",
    label: "تاریخچه پرداخت",
    to: getAdPaymentHistoryPath(adId),
  };
  const payment: StateAction = { icon: "payment", label: "پرداخت", to: getAdPaymentPath(adId) };

  const rawPhone =
    ad?.assigned_agency_phone ??
    ad?.agency_phone ??
    (ad?.assigned_consultant && typeof ad.assigned_consultant === "object"
      ? (ad.assigned_consultant as Record<string, unknown>).phone
      : undefined) ??
    ad?.consultant_phone ??
    (ad?.agency && typeof ad.agency === "object"
      ? (ad.agency as Record<string, unknown>).phone
      : undefined) ??
    ad?.phone;
  const contactPhone = readText(rawPhone);
  const agencyId = readText(
    ad?.assigned_agency_id ??
      ad?.agency_id ??
      (ad?.agency && typeof ad.agency === "object"
        ? (ad.agency as Record<string, unknown>).id
        : undefined),
  );

  const consultantUserId = readText(
    ad?.assigned_consultant_id ??
      ad?.user_chat_id ??
      (ad?.assigned_consultant && typeof ad.assigned_consultant === "object"
        ? (ad.assigned_consultant as Record<string, unknown>).user_id
        : undefined),
  );

  const callAgency: StateAction = {
    icon: "call",
    label: isAssigned || status === "wait_for_agency" ? "تماس با آژانس" : "تماس با مسئول آگهی",
    onClick: () => {
      if (contactPhone) {
        window.location.href = `tel:${contactPhone}`;
      } else {
        alert("شماره تماس در دسترس نیست.");
      }
    },
  };

  const chatAgency: StateAction = {
    icon: "chat",
    label: isAssigned || status === "wait_for_agency" ? "پیام به آژانس" : "چت با مسئول آگهی",
    onClick: () => {
      const chatQuery = new URLSearchParams();
      if (consultantUserId) {
        chatQuery.set("userId", consultantUserId);
      } else if (agencyId) {
        chatQuery.set("agencyId", agencyId);
      }
      chatQuery.set("adId", adId);
      window.location.href = `/chat?${chatQuery.toString()}`;
    },
  };

  const stopPublish: StateAction = {
    icon: "stop_publish",
    label: "درخواست توقف انتشار",
    onClick: onStopPublish,
  };

  if (status === "published") {
    if (isAssigned) {
      return [preview, edit, stopPublish, callAgency, chatAgency, history];
    }
    return [preview, edit, remove, upgrade, stats, history];
  }
  if (status === "wait_for_agency") return [preview, edit, callAgency, chatAgency, history];
  if (status === "wait_for_stop") return [preview, edit, callAgency, chatAgency, history];
  if (status === "wait_for_deal_confirmation") return [preview, history];
  if (status === "wait_for_repost" || status === "rejected_by_agency")
    return [preview, remove, history];
  if (status === "archived") return [preview, remove];
  if (status === "wait_for_payment") return [preview, edit, payment, remove, history];
  if (status === "pending") {
    if (isAssigned) {
      return [preview, edit, callAgency, chatAgency, history];
    }
    return [preview, edit, remove, history];
  }
  if (status === "needs_edit") return [edit, preview, history];
  if (status === "incomplete") return [edit, payment, remove];
  if (status === "expired" || status === "deleted" || status === "incomplete_deleted")
    return [preview, history];

  return [preview, history];
}
