import type { NotificationItem } from "./api/notification.service";

/**
 * Returns the diamond color class for a notification card,
 * or null if no diamond should be rendered (matches Figma specifications).
 *
 * In Figma:
 * - Only advertisement cards ("پیام های آگهی") have a diamond indicator.
 * - Other categories (trades, requests, chats, systems, support) do NOT have a diamond.
 */
export function getNotificationDiamondColor(
  notification: NotificationItem,
): string | null {
  const category = notification.category ?? "systems";
  const title = (notification.title ?? "").trim();
  const type = String(notification.type ?? "").toLowerCase();
  const target = notification.payload?.target;

  // Diamond only exists for advertisement-related notifications
  const isAd =
    category === "advertise" ||
    target === "advertise" ||
    Boolean(notification.payload?.advertise_id) ||
    type.startsWith("advertise") ||
    title.includes("آگهی") ||
    title.includes("اگهی");

  if (!isAd) {
    return null;
  }

  // 1. Success / Published / Accepted: Green
  if (
    title === "آگهی شما منتشر شد" ||
    title === "اگهی شما منتشر شد" ||
    title === "آژانس همکاری را پذیرفت" ||
    title === "اژانس همکاری را پذیرفت" ||
    title === "آگهی تمدید شد" ||
    title === "اگهی تمدید شد" ||
    type === "advertise_published" ||
    notification.payload?.ad_status === "published"
  ) {
    return "bg-[#11A366]";
  }

  // 2. Rejected / Deleted / Cancelled / Error: Red
  if (
    title === "آگهی شما تأیید نشد" ||
    title === "اگهی شما تایید نشد" ||
    title === "آگهی حذف شد" ||
    title === "اگهی حذف شد" ||
    title === "آژانس همکاری را نپذیرفت" ||
    title === "اژانس همکاری را نپذیرفت" ||
    title === "توقف انتشار تأیید نشد" ||
    title === "توقف انتشار تایید نشد" ||
    type === "advertise_rejected" ||
    type === "advertise_deleted" ||
    notification.payload?.ad_status === "rejected"
  ) {
    return "bg-[#EE3623]";
  }

  // 3. Pending / Incomplete / Warning: Yellow
  if (
    title === "آگهی در انتظار بررسی است" ||
    title === "اطلاعات آگهی ناقص است" ||
    type === "advertise_pending_review" ||
    notification.payload?.ad_status === "pending"
  ) {
    return "bg-[#FFD44D]";
  }

  // 4. Assigned to agency: Blue
  if (
    title === "آگهی شما به آژانس واگذار شد" ||
    title === "اگهی شما به آژانس واگذار شد" ||
    type === "advertise_assigned" ||
    notification.payload?.ad_status === "wait_for_agency"
  ) {
    return "bg-[#0048C4]";
  }

  // 5. Stopped / Archived: Gray
  if (
    title === "انتشار آگهی متوقف شد" ||
    title === "آگهی بایگانی شد" ||
    title === "اگهی بایگانی شد" ||
    type === "advertise_archived" ||
    type === "advertise_stopped" ||
    notification.payload?.ad_status === "archived"
  ) {
    return "bg-[#CCCCCC]";
  }

  // 6. Default advertisement diamond: Orange
  return "bg-[#FF6D00]";
}
