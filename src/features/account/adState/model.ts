import { readFirst } from "./readers";
import { assignedStateConfig } from "./stateConfig";
import type {
  AssignedAdStateModel,
  AssignedAdTimelineItem,
  AssignedAdVariant,
  BuildAssignedAdStateModelInput,
} from "./types";

const DEFAULT_TIME = "دیروز ۱۲:۲۰";

function resolveVariant(input: BuildAssignedAdStateModelInput): AssignedAdVariant {
  if (input.statusKey === "published") return "published";
  if (input.statusKey === "wait_for_agency" || input.statusKey === "pending") return "waiting-agency";
  if (input.statusKey === "wait_for_repost") return "waiting-repost";
  if (input.statusKey === "archived") return "archived";
  if (input.statusKey === "wait_for_deal_confirmation" || input.deletedVariant === "deal_confirmation") {
    return "deal-confirmation";
  }
  if (input.deletedVariant === "user_stopped" || input.statusKey === "wait_for_stop") return "user-stopped";
  return "recovery-expired";
}

function timeline(variant: AssignedAdVariant, agencyName: string): AssignedAdTimelineItem[] {
  const agencySent = { before: "درخواست به ", accent: agencyName, accentTone: "primary" as const, after: " ارسال شد.", time: DEFAULT_TIME };
  const waiting = { before: "وضعیت به ", accent: "در انتظار تایید آژانس", accentTone: "warning" as const, after: " تغییر یافت.", time: DEFAULT_TIME };
  if (variant === "published") {
    return [
      { before: `وضعیت توسط ${agencyName} به `, accent: "منتشر شده", accentTone: "success", after: " تغییر یافت.", time: DEFAULT_TIME },
      waiting,
      agencySent,
    ];
  }
  if (variant === "waiting-agency") return [waiting, agencySent];
  if (variant === "waiting-repost") {
    return [
      { before: "کاربر واگذاری آگهی به آژانس را به ", accent: "لغو شده", accentTone: "danger", after: " تغییر داد.", time: DEFAULT_TIME },
      waiting,
    ];
  }
  if (variant === "archived") {
    return [
      { before: "مهلت بازیابی تا ۳۰ روز فعال شد.", time: DEFAULT_TIME },
      { before: "آگهی به ", accent: "بایگانی شده", accentTone: "neutral", after: " تغییر یافت.", time: DEFAULT_TIME },
      { before: "کاربر واگذاری آگهی به آژانس را به ", accent: "لغو شده", accentTone: "danger", after: " تغییر داد.", time: DEFAULT_TIME },
      waiting,
      agencySent,
    ];
  }
  const deletedText = variant === "deal-confirmation" ? "آژانس آگهی را حذف شده تغییر داد." : "وضعیت آگهی به حذف شده تغییر یافت.";
  return [
    { before: deletedText, time: DEFAULT_TIME },
    { before: "وضعیت آگهی به ", accent: "منتشر شده", accentTone: "success", after: " تغییر یافت.", time: DEFAULT_TIME },
    waiting,
    agencySent,
  ];
}

export function buildAssignedAdStateModel(input: BuildAssignedAdStateModelInput): AssignedAdStateModel {
  const variant = resolveVariant(input);
  const agencyName = readFirst(input.ad, ["agency_name", "agencyName", "assigned_agency_name", "assignedAgencyName"], "آژانس جلیلیان");
  return {
    agencyName,
    badgeLabel: assignedStateConfig[variant].badgeLabel,
    card: input.card,
    category: readFirst(input.ad, ["category", "category_title", "categoryTitle", "category_name", "categoryName"], "فروش مسکونی / فروش آپارتمان"),
    expiresAt: readFirst(input.ad, ["expires_time_ago", "expire_date_text"], "۱۲ روز دیگر (۱۴۰۴/۱۱/۲۱)"),
    primaryAction: assignedStateConfig[variant].primaryAction,
    publishedAt: readFirst(input.ad, ["published_time_ago", "published_date_text"], "۳ روز پیش (۱۴۰۴/۱۱/۰۹)"),
    timeline: timeline(variant, agencyName),
    variant,
  };
}
