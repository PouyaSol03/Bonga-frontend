import type { AssignedAdPrimaryAction, AssignedAdVariant } from "./types";

export const assignedStateConfig: Record<
  AssignedAdVariant,
  { badgeLabel: string; primaryAction: AssignedAdPrimaryAction }
> = {
  archived: { badgeLabel: "بایگانی شده", primaryAction: "restore" },
  "deal-confirmation": { badgeLabel: "حذف شده", primaryAction: "submit-result" },
  published: { badgeLabel: "منتشر شده", primaryAction: "stop-publish" },
  "recovery-expired": { badgeLabel: "حذف شده", primaryAction: "none" },
  "user-stopped": { badgeLabel: "حذف شده", primaryAction: "none" },
  "waiting-agency": { badgeLabel: "در انتظار تایید آژانس", primaryAction: "cancel-assignment" },
  "waiting-repost": { badgeLabel: "در انتظار ثبت مجدد", primaryAction: "repost" },
};
