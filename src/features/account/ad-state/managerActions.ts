import "../../advertisements/components/AdCard.css";
import {
  adManagementPaths,
  getAdCloseResultPath,
  getAdEditPath,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPaymentPath,
  getAdPreviewPath,
} from "../adManagement/adManagementData";
import { type MyAdStatusKey } from "../myAdsStatus";
import type { StateAction } from "./types";

export function getManagerActions(
  status: MyAdStatusKey,
  adId: string,
  onDelete?: () => void,
  isAdDeleted?: boolean,
  returnTo?: string,
  adSource?: unknown,
): StateAction[] {
  const preview: StateAction = { icon: "preview", label: "پیش‌نمایش", to: getAdPreviewPath(adId) };
  const edit: StateAction = {
    icon: "edit",
    label: "ویرایش",
    to: getAdEditPath(adId, returnTo || adManagementPaths.root, adSource),
  };
  const payment: StateAction = { icon: "payment", label: "پرداخت", to: getAdPaymentPath(adId) };
  const result: StateAction = {
    icon: "result",
    label: "ثبت نتیجه آگهی",
    to: getAdCloseResultPath(adId),
  };
  const remove: StateAction = { icon: "delete", label: "حذف", onClick: onDelete };
  const upgrade: StateAction = {
    icon: "upgrade",
    label: "ارتقای آگهی",
    to: getAdIncreaseVisitsPath(adId),
  };
  const history: StateAction = {
    icon: "history",
    label: "تاریخچه پرداخت",
    to: getAdPaymentHistoryPath(adId),
  };

  if (isAdDeleted || status === "deleted" || status === "incomplete_deleted") {
    return [preview, history];
  }
  if (status === "published") {
    return [preview, edit, result, remove, upgrade, history];
  }
  if (status === "wait_for_stop" || status === "wait_for_deal_confirmation") {
    return [preview, edit, remove, history];
  }
  if (status === "wait_for_payment") {
    return [preview, edit, payment, remove, history];
  }
  if (status === "incomplete" || status === "needs_edit") {
    return [preview, edit, payment, remove, history];
  }
  if (status === "pending") {
    return [preview, edit, remove, history];
  }
  if (status === "expired") {
    return [preview, result, remove, history];
  }
  return [preview, edit, history];
}
