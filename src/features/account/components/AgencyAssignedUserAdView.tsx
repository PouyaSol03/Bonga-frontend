import { useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  useCancelUserAssignmentMutation,
  useReassignAdToAgencyMutation,
  useRepublishAdAsPersonalMutation,
  useRestoreArchivedAdMutation,
  useAdvertisementHistoryQuery,
  useAdvertisementReRegisterStatusQuery,
  useAdvertisementSubmitResultStatusQuery,
  useAdvertisementArchiveStatusQuery,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import { toPersianNumber as toPersianDigits } from "../../../shared/lib/numberUtils";
import type { AdCardData } from "../../advertisements/components/AdCard";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { pushRoute } from "../../../shared/navigation/navigation";
import { getAdPaymentPath, getAdPreviewPath } from "../adManagement/adManagementData";

import LinearPreview from "../../../shared/icons/LinearPreview";
import LinearCancel from "../../../shared/icons/LinearCancel";
import LinearClock from "../../../shared/icons/LinearClock";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import LinearRefresh from "../../../shared/icons/LinearRefresh";
import LinearCalendar from "../../../shared/icons/LinearCalendar";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import { ListItem } from "../../../shared/ui/ListItem";
import { useAgencyInfiniteQuery } from "../../agencies/api/agency.hooks";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { SearchInputBar } from "../../../shared/ui/SearchBar";

export type AgencyAssignedDeletedVariant =
  | "deal_confirmation"
  | "user_stopped"
  | "recovery_expired";

export type AgencyAssignedUserAdViewProps = {
  ad?: Record<string, unknown>;
  card: AdCardData;
  statusKey: string;
  adId?: string | number;
  backTo?: string;
  backState?: Record<string, unknown>;
  onRefetch?: () => Promise<unknown> | void;
  initialCancelAssignmentOpen?: boolean;
  initialRepostChoiceOpen?: boolean;
  deletedVariant?: AgencyAssignedDeletedVariant;
  onNavigateToStopPublish?: () => void;
  onNavigateToDealResult?: () => void;
};


function formatHistoryDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isSameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const timeFormatted = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

    if (isSameDay) {
      return `امروز ${timeFormatted}`;
    }
    if (isYesterday) {
      return `دیروز ${timeFormatted}`;
    }

    const dateFormatted = new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
    }).format(d);
    return `${dateFormatted}، ${timeFormatted}`;
  } catch {
    return dateStr;
  }
}

function formatExpireDuration(
  expire?: { hours?: number; minutes?: number },
  expiresAt?: string | null,
  fallbackReason?: string,
): string {
  if (expire && (expire.hours !== undefined || expire.minutes !== undefined)) {
    const parts: string[] = [];
    if (expire.hours && expire.hours > 0) {
      parts.push(`${toPersianDigits(expire.hours)} ساعت`);
    }
    if (expire.minutes !== undefined && expire.minutes > 0) {
      parts.push(`${toPersianDigits(expire.minutes)} دقیقه`);
    }
    if (parts.length > 0) {
      return `تا ${parts.join(" و ")} دیگر مهلت دارید.`;
    }
  }

  if (expiresAt) {
    try {
      const d = new Date(expiresAt);
      if (!isNaN(d.getTime())) {
        const diffMs = d.getTime() - Date.now();
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (days > 0) {
            return `تا ${toPersianDigits(days)} روز و ${toPersianDigits(hours)} ساعت دیگر فرصت دارید.`;
          }
          if (hours > 0) {
            return `تا ${toPersianDigits(hours)} ساعت دیگر فرصت دارید.`;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return fallbackReason || "امکان انجام عملیات تا پایان مهلت فراهم است.";
}

export function renderDateWithRelative(text: string) {
  if (!text) return null;

  // Pattern 1: "۳ روز پیش (۱۴۰۴/۱۱/۰۹)" or "۱۲ روز دیگر (۱۴۰۴/۱۱/۲۱)"
  const match1 = text.match(/^(.*?)\s*(\([0-9/\u06F0-\u06F9\-.]+\))$/);
  if (match1) {
    const relative = match1[1].trim();
    const date = match1[2].trim();
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-sm font-medium text-outline">{relative}</span>
        <span className="text-sm font-medium text-on-surface">{date}</span>
      </span>
    );
  }

  // Pattern 2: "۲۱ بهمن ۱۴۰۴ (۱۲ روز دیگر)" or "تاریخ (x روز پیش/دیگر)"
  const match2 = text.match(/^(.*?)\s*\((.*?(?:پیش|دیگر|مانده|قبل).*?)\)$/);
  if (match2) {
    const date = match2[1].trim();
    const relative = `(${match2[2].trim()})`;
    return (
      <span className="inline-flex items-center gap-1.5 [direction:rtl]">
        <span className="text-sm font-medium text-on-surface">{date}</span>
        <span className="text-sm font-medium text-outline">{relative}</span>
      </span>
    );
  }

  // Pattern 3: Relative only
  if (text.includes("پیش") || text.includes("دیگر") || text.includes("قبل") || text.includes("مانده")) {
    return <span className="text-sm font-medium text-outline">{text}</span>;
  }

  return <span className="text-sm font-medium text-on-surface">{text}</span>;
}

function formatPersianDateNumber(d: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}

function resolvePublishedDateText(ad?: Record<string, unknown>): string {
  const explicitText = typeof ad?.published_date_text === "string" ? ad.published_date_text.trim() : "";
  if (explicitText) return explicitText;

  const rawDate =
    ad?.confirm_date ??
    ad?.confirmDate ??
    ad?.published_at ??
    ad?.publishedAt ??
    ad?.published_date ??
    ad?.sort_date ??
    ad?.sortDate ??
    ad?.created_at ??
    ad?.createdAt;

  if (typeof rawDate === "string" && rawDate.trim()) {
    const timestamp = Date.parse(rawDate.trim());
    if (Number.isFinite(timestamp)) {
      const d = new Date(timestamp);
      const dateStr = formatPersianDateNumber(d);
      const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const now = new Date();
      const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const days = Math.round((baseMidnight - targetMidnight) / 86_400_000);
      let relative = "امروز";
      if (days === 1) {
        relative = "دیروز";
      } else if (days > 1) {
        relative = `${toPersianDigits(days)} روز پیش`;
      }
      return `${relative} (${dateStr})`;
    }
    return rawDate.trim();
  }

  if (typeof ad?.published_hours_ago === "number") {
    const hours = ad.published_hours_ago;
    if (hours < 1) return "لحظاتی پیش";
    if (hours < 24) return `${toPersianDigits(hours)} ساعت پیش`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "دیروز";
    return `${toPersianDigits(days)} روز پیش`;
  }

  if (typeof ad?.published_time_ago === "string" && ad.published_time_ago.trim()) {
    return ad.published_time_ago.trim();
  }
  if (typeof ad?.published_days === "number" || typeof ad?.published_days === "string") {
    return `${toPersianDigits(ad.published_days)} روز پیش`;
  }

  return "—";
}

function resolveExpirationDateText(ad?: Record<string, unknown>): string {
  const explicitText = typeof ad?.expire_date_text === "string" ? ad.expire_date_text.trim() : "";
  if (explicitText) return explicitText;

  const rawExpire =
    ad?.expire_date ??
    ad?.expireDate ??
    ad?.expires_at ??
    ad?.expiresAt ??
    ad?.expiration_date ??
    ad?.expirationDate ??
    ad?.expired_at ??
    ad?.expiredAt ??
    (typeof ad?.expire === "object" && ad?.expire && "expires_at" in ad.expire
      ? (ad.expire as { expires_at?: unknown }).expires_at
      : undefined);

  let timestamp = typeof rawExpire === "string" && rawExpire.trim() ? Date.parse(rawExpire.trim()) : NaN;

  if (!Number.isFinite(timestamp)) {
    const rawPublished =
      ad?.confirm_date ??
      ad?.confirmDate ??
      ad?.published_at ??
      ad?.publishedAt ??
      ad?.published_date ??
      ad?.sort_date ??
      ad?.created_at ??
      ad?.createdAt;
    if (typeof rawPublished === "string" && rawPublished.trim()) {
      const pubTimestamp = Date.parse(rawPublished.trim());
      if (Number.isFinite(pubTimestamp)) {
        timestamp = pubTimestamp + 30 * 86_400_000;
      }
    }
  }

  if (Number.isFinite(timestamp)) {
    const d = new Date(timestamp);
    const dateStr = formatPersianDateNumber(d);
    const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const now = new Date();
    const baseMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const days = Math.round((targetMidnight - baseMidnight) / 86_400_000);
    if (days < 0) {
      return `منقضی شده (${dateStr})`;
    }
    const relative = days === 0 ? "امروز" : `${toPersianDigits(days)} روز دیگر`;
    return `${relative} (${dateStr})`;
  }

  if (typeof ad?.expires_time_ago === "string" && ad.expires_time_ago.trim()) {
    return ad.expires_time_ago.trim();
  }

  return "—";
}

export function AgencyAssignedUserAdView({
  ad,
  card,
  statusKey,
  adId,
  onRefetch,
  initialCancelAssignmentOpen = false,
  initialRepostChoiceOpen = false,
  deletedVariant,
  onNavigateToStopPublish,
  onNavigateToDealResult,
}: AgencyAssignedUserAdViewProps) {
  const currentAdId = adId ?? card.id;

  const [isCancelAssignmentOpen, setIsCancelAssignmentOpen] = useState(initialCancelAssignmentOpen);
  const [isRepostChoiceOpen, setIsRepostChoiceOpen] = useState(initialRepostChoiceOpen);
  const [isReassignAgencyOpen, setIsReassignAgencyOpen] = useState(false);

  const cancelAssignmentMutation = useCancelUserAssignmentMutation();
  const restoreArchivedMutation = useRestoreArchivedAdMutation();
  const republishPersonalMutation = useRepublishAdAsPersonalMutation();
  const reassignAgencyMutation = useReassignAdToAgencyMutation();

  const agencyName =
    (ad?.agency_name as string) ||
    (ad?.agencyName as string) ||
    (ad?.assigned_agency_name as string) ||
    (ad?.assignedAgencyName as string) ||
    (typeof ad?.agency === "object" && ad?.agency && "name" in ad.agency ? String((ad.agency as { name?: unknown }).name ?? "") : "") ||
    (typeof ad?.agency === "string" ? ad.agency : "") ||
    (card.agency ? card.agency : "") ||
    "آژانس املاک";

  const categoryBreadcrumb =
    (ad?.category as string) ||
    (ad?.category_title as string) ||
    (ad?.categoryTitle as string) ||
    (ad?.category_name as string) ||
    (ad?.categoryName as string) ||
    (typeof ad?.category_object === "object" && ad?.category_object && "title" in ad.category_object ? String((ad.category_object as { title?: unknown }).title ?? "") : "") ||
    "—";

  const publishedDateText = resolvePublishedDateText(ad);
  const expirationDateText = resolveExpirationDateText(ad);

  const isPublished = statusKey === "published";
  const isWaitForAgency = statusKey === "wait_for_agency" || statusKey === "pending";
  const isWaitForRepost = statusKey === "wait_for_repost";
  const isArchived = statusKey === "archived";
  const isWaitForDeal = statusKey === "wait_for_deal_confirmation";
  const isWaitForStop = statusKey === "wait_for_stop";
  const isDeleted = statusKey === "deleted" || statusKey === "incomplete_deleted";

  const effectiveDeletedVariant: AgencyAssignedDeletedVariant =
    deletedVariant ??
    (isWaitForDeal || ad?.deleted_reason === "agency_deal"
      ? "deal_confirmation"
      : isWaitForStop || ad?.deleted_reason === "user_stopped"
        ? "user_stopped"
        : "recovery_expired");

  const historyQuery = useAdvertisementHistoryQuery(currentAdId);
  const reRegisterStatusQuery = useAdvertisementReRegisterStatusQuery(currentAdId);
  const archiveStatusQuery = useAdvertisementArchiveStatusQuery(currentAdId);
  const submitResultStatusQuery = useAdvertisementSubmitResultStatusQuery(currentAdId);

  const showRepostSection =
    reRegisterStatusQuery.data !== undefined
      ? Boolean(reRegisterStatusQuery.data.status)
      : isWaitForRepost;

  const showArchiveSection =
    archiveStatusQuery.data !== undefined
      ? Boolean(archiveStatusQuery.data.status)
      : isArchived;

  const showSubmitResultSection =
    submitResultStatusQuery.data !== undefined
      ? Boolean(submitResultStatusQuery.data.status)
      : ((isDeleted || isWaitForDeal) && effectiveDeletedVariant === "deal_confirmation");

  const handlePreview = () => {
    if (currentAdId) {
      pushRoute(getAdPreviewPath(currentAdId), {
        ad,
        previewFlow: "agency-allocation",
        userContact: {
          name:
            (ad?.owner_name as string) ??
            (ad?.user_name as string) ??
            (ad?.advertiser_name as string) ??
            undefined,
          phone:
            (ad?.phone as string) ??
            (ad?.user_phone as string) ??
            (ad?.mobile as string) ??
            undefined,
          smsPhone:
            (ad?.sms_phone as string) ??
            (ad?.phone as string) ??
            (ad?.user_phone as string) ??
            undefined,
          address:
            (ad?.address as string) ??
            (ad?.location_address as string) ??
            undefined,
          social:
            (ad?.social as Record<string, string>) ??
            (ad?.contacts as Record<string, string>) ??
            undefined,
        },
      });
    }
  };

  const handleGoToStopPublish = () => {
    if (onNavigateToStopPublish) {
      onNavigateToStopPublish();
    } else if (currentAdId) {
      pushRoute(`/account/my-ads/${encodeURIComponent(currentAdId)}/stop-publish`);
    }
  };

  const handleGoToDealResult = () => {
    if (onNavigateToDealResult) {
      onNavigateToDealResult();
    } else if (currentAdId) {
      pushRoute(`/account/my-ads/${encodeURIComponent(currentAdId)}/deal-result`);
    }
  };

  return (
    <div className="flex flex-col bg-surface-container [direction:rtl]">
      {/* Section 1: Badge + Ad Card + Expiration/Dates or Notice */}
      <section className="bg-surface-container-lowest px-4 pt-4 pb-4">
        {/* Status Badge */}
        <div className="flex justify-start">
          {isPublished && (
            <span className="inline-flex h-10 items-center rounded-lg bg-tertiary-container/30 px-4 text-sm font-medium text-tertiary">
              منتشر شده
            </span>
          )}
          {(isWaitForAgency || statusKey === "pending") && (
            <span className="inline-flex h-10 items-center rounded-lg bg-warning-container/30 px-4 text-sm font-medium text-warning">
              در انتظار تایید آژانس
            </span>
          )}
          {isWaitForRepost && (
            <span className="inline-flex h-10 items-center rounded-lg bg-warning-container/30 px-4 text-sm font-medium text-warning">
              در انتظار ثبت مجدد
            </span>
          )}
          {isArchived && (
            <span className="inline-flex h-10 items-center rounded-lg bg-surface-container-high px-4 text-sm font-medium text-on-surface-var">
              بایگانی شده
            </span>
          )}
          {(isDeleted || isWaitForDeal || isWaitForStop) && (
            <span className="inline-flex h-10 items-center rounded-lg bg-error-container/40 px-4 text-sm font-medium text-error">
              حذف شده
            </span>
          )}
        </div>

        {/* Ad Summary Card: Image FIRST (on right in RTL), Infos text to the LEFT */}
        <div className="mt-4 flex h-[79px] items-center gap-3 rounded-2xl border border-surface-container-high bg-surface-container-low px-4 [direction:rtl]">
          {/* 1. Image first: renders on the RIGHT in RTL */}
          <div
            aria-hidden="true"
            className="h-[52px] w-[70px] shrink-0 rounded-lg bg-cover bg-center"
            style={
              card.imageUrl
                ? { backgroundImage: `url(${card.imageUrl})` }
                : { backgroundColor: "#E0E0E0" }
            }
          />

          {/* 2. Infos text: renders to the LEFT of image */}
          <div className="min-w-0 flex-1 text-right">
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 truncate text-xs text-on-surface-var">
              {categoryBreadcrumb}
            </Typography>
            <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 mt-1 truncate text-sm font-semibold text-on-surface">
              {card.title}
            </Typography>
          </div>
        </div>

        {/* Metadata for Published state: Title on RIGHT, Value on LEFT */}
        {isPublished && (
          <div className="mt-4 text-sm font-medium leading-5">
            <div className="flex h-11 items-center justify-between [direction:rtl]">
              <span className="text-sm text-on-surface-var">انتشار</span>
              {renderDateWithRelative(publishedDateText)}
            </div>
            <div className="border-t border-dashed border-outline-var/30" />
            <div className="flex h-11 items-center justify-between [direction:rtl]">
              <span className="text-sm text-on-surface-var">انقضا</span>
              {renderDateWithRelative(expirationDateText)}
            </div>
          </div>
        )}

      </section>

      {/* Section Divider 1 */}
      <div className="h-2 shrink-0 bg-surface-container" aria-hidden="true" />

      {/* Section 2: Action list items */}
      <section className="bg-surface-container-lowest px-4">
        <div className="divide-y divide-outline-var/20">
          {/* Action 1: پیش‌نمایش */}
          <button
            type="button"
            onClick={handlePreview}
            className="flex h-14 w-full items-center justify-between text-right transition-colors active:bg-surface-container-low [direction:rtl]"
          >
            <div className="flex items-center gap-3">
              <LinearPreview className="h-6 w-6 text-on-surface-var" />
              <Typography variant="label" size="large" weight="medium" className="text-on-surface">
                پیش‌نمایش
              </Typography>
            </div>
            <LinearArrowLeft1 className="h-6 w-6 text-outline" />
          </button>

          {/* Action 2 for Published: درخواست توقف انتشار (Navigates to separate page) */}
          {isPublished && (
            <button
              type="button"
              onClick={handleGoToStopPublish}
              className="flex h-14 w-full items-center justify-between text-right transition-colors active:bg-surface-container-low [direction:rtl]"
            >
              <div className="flex items-center gap-3">
                <LinearCancel className="h-6 w-6 text-on-surface-var" />
                <Typography variant="label" size="large" weight="medium" className="text-on-surface">
                  درخواست توقف انتشار
                </Typography>
              </div>
              <LinearArrowLeft1 className="h-6 w-6 text-outline" />
            </button>
          )}

          {/* Action 2 for Wait For Agency: لغو واگذاری آگهی به آژانس (Opens Bottom Sheet) */}
          {isWaitForAgency && (
            <button
              type="button"
              onClick={() => setIsCancelAssignmentOpen(true)}
              className="flex h-14 w-full items-center justify-between text-right transition-colors active:bg-surface-container-low [direction:rtl]"
            >
              <div className="flex items-center gap-3">
                <LinearCancel className="h-6 w-6 text-on-surface-var" />
                <Typography variant="label" size="large" weight="medium" className="text-on-surface">
                  لغو واگذاری آگهی به آژانس
                </Typography>
              </div>
              <LinearArrowLeft1 className="h-6 w-6 text-outline" />
            </button>
          )}
        </div>
      </section>

      {/* Section Divider 2 */}
      <div className="h-2 shrink-0 bg-surface-container" aria-hidden="true" />

      {/* Section 3: آخرین تغییرات (Timeline History) */}
      <section className="flex-1 bg-surface-container-lowest px-4 pt-6 pb-8">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mb-6 text-base font-bold text-on-surface">
          آخرین تغییرات
        </Typography>

        {/* Specialized Action Area: Wait for Repost */}
        {showRepostSection && (
          <div className="m-0 mb-6 text-right">
            <Typography as="h3" variant="body" size="medium" weight="regular" className="m-0 text-on-surface">
              فرصت ثبت مجدد آگهی
            </Typography>
            <div className="mt-3 rounded-lg border border-tertiary bg-surface-container-lowest p-2 text-right">
              <Typography as="p" variant="body" size="medium" weight="regular" className="text-tertiary">
                {formatExpireDuration(
                  reRegisterStatusQuery.data?.expire,
                  reRegisterStatusQuery.data?.expires_at,
                  reRegisterStatusQuery.data?.reason || "تا ۶ روز و ۱۲ ساعت دیگر می‌توانید این آگهی را مجدداً فعال کنید.",
                )}
              </Typography>
            </div>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-on-surface-var">
              پس از پایان این مهلت، وضعیت آگهی به بایگانی شده تغییر خواهد کرد.
            </Typography>

            <Button
              variant="primary"
              size="x-medium"
              fullWidth
              onClick={() => setIsRepostChoiceOpen(true)}
              className="mt-4 !justify-between"
            >
              <span className="flex items-center gap-2">
                <LinearRefresh className="h-6 w-6" />
                <span>ثبت مجدد آگهی</span>
              </span>
              <LinearArrowLeft1 className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Specialized Action Area: Archived */}
        {showArchiveSection && (
          <div className="m-0 mb-6 text-right">
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm leading-6 text-on-surface">
              مهلت ثبت مجدد این آگهی به پایان رسیده و آگهی به حالت بایگانی شده منتقل شده است.
            </Typography>
            <div className="mt-3 rounded-lg border border-tertiary bg-surface-container-lowest p-2 text-right">
              <Typography as="p" variant="body" size="medium" weight="regular" className="text-tertiary">
                {formatExpireDuration(
                  archiveStatusQuery.data?.expire,
                  archiveStatusQuery.data?.expires_at,
                  archiveStatusQuery.data?.reason || "تا ۲۳ روز و ۸ ساعت دیگر می‌توانید این آگهی را بازیابی کنید.",
                )}
              </Typography>
            </div>

            <div className="mt-4 flex justify-start [direction:ltr]">
              <Button
                variant="primary"
                size="x-medium"
                loading={restoreArchivedMutation.isPending}
                disabled={restoreArchivedMutation.isPending}
                onClick={async () => {
                  if (currentAdId) {
                    try {
                      await restoreArchivedMutation.mutateAsync(currentAdId);
                      if (onRefetch) await onRefetch();
                    } catch (err) {
                      alert(getApiErrorMessage(err, "بازیابی آگهی با خطا مواجه شد."));
                    }
                  }
                }}
                className="gap-2 [direction:rtl]"
                leadingIcon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10h10a5 5 0 0 1 5 5v2" />
                    <path d="M7 6 3 10l4 4" />
                  </svg>
                }
              >
                بازیابی آگهی
              </Button>
            </div>
          </div>
        )}

        {/* Specialized Action Area: Deleted Variant 1 (Agency closed deal -> Submit Result in separate page) */}
        {showSubmitResultSection && (
          <div className="m-0 text-right">
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm leading-6 text-on-surface">
              {(submitResultStatusQuery.data?.agency?.name ?? agencyName)} این درخواست را بسته است. لطفاً نتیجه نهایی این درخواست را ثبت کنید.
            </Typography>
            <div className="mt-3 rounded-lg border border-tertiary bg-surface-container-lowest p-2 text-right">
              <Typography as="p" variant="body" size="medium" weight="regular" className="text-tertiary">
                {formatExpireDuration(
                  submitResultStatusQuery.data?.expire,
                  submitResultStatusQuery.data?.expires_at,
                  submitResultStatusQuery.data?.reason || "تا پایان مهلت پاسخگویی ۶ روز و ۱۲ ساعت فرصت دارید.",
                )}
              </Typography>
            </div>

            <Button
              variant="primary"
              size="x-medium"
              fullWidth
              onClick={handleGoToDealResult}
              className="mt-4 !justify-between"
            >
              <span className="flex items-center gap-2">
                <LinearCalendar className="h-6 w-6" />
                <span>ثبت نتیجه درخواست</span>
              </span>
              <LinearArrowLeft1 className="h-5 w-5" />
            </Button>

            <div className="mt-4 border-b border-outline-var/20" />
          </div>
        )}

        {/* Live Timeline Items from GET /api/history/{advertiseId} */}
        {historyQuery.isLoading ? (
          <div className="py-8 text-center text-xs text-on-surface-var">
            در حال دریافت آخرین تغییرات...
          </div>
        ) : historyQuery.data && historyQuery.data.length > 0 ? (
          <div className="divide-y divide-outline-var/20">
            {historyQuery.data.map((item: { action?: string; created_at?: string; message?: string }, index: number) => (
              <TimelineItem
                key={`${item.action}-${item.created_at}-${index}`}
                time={formatHistoryDate(item.created_at)}
                description={item.message}
              />
            ))}
          </div>
        ) : historyQuery.data && historyQuery.data.length === 0 ? (
          <div className="py-8 text-center text-xs text-on-surface-var">
            تغییری برای این آگهی ثبت نشده است.
          </div>
        ) : (
          <div className="divide-y divide-outline-var/20">
            {/* Fallback mock cases for storybook / offline tests */}
            {isPublished && (
              <>
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت توسط {agencyName} به{" "}
                      <span className="font-medium text-tertiary">منتشر شده</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      درخواست به{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      ارسال شد.
                    </>
                  }
                />
              </>
            )}

            {isWaitForAgency && (
              <>
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      درخواست به{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      ارسال شد.
                    </>
                  }
                />
              </>
            )}

            {isWaitForRepost && (
              <>
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      کاربر واگذاری آگهی به آژانس را به{" "}
                      <span className="font-medium text-error">لغو شده</span>{" "}
                      تغییر داد.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
              </>
            )}

            {isArchived && (
              <>
                <TimelineItem time="دیروز ۱۲:۲۰" description="مهلت بازیابی تا ۳۰ روز فعال شد." />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      آگهی به{" "}
                      <span className="font-medium text-on-surface-var">بایگانی شده</span>{" "}
                      منتقل شد.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      کاربر واگذاری آگهی به آژانس را به{" "}
                      <span className="font-medium text-error">لغو شده</span>{" "}
                      تغییر داد.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      درخواست به{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      ارسال شد.
                    </>
                  }
                />
              </>
            )}

            {(isDeleted || isWaitForDeal) && effectiveDeletedVariant === "deal_confirmation" && (
              <>
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت توسط {agencyName} به{" "}
                      <span className="font-medium text-error">حذف شده</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت توسط {agencyName} به{" "}
                      <span className="font-medium text-tertiary">منتشر شده</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
              </>
            )}

            {(isDeleted || isWaitForStop) && effectiveDeletedVariant === "user_stopped" && (
              <>
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  title="انتشار آگهی متوقف شد"
                  description={
                    <>
                      این آگهی بنا به درخواست شما توسط{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      از انتشار خارج شده است.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description="درخواست توقف انتشار در حال بررسی است. در صورت ثبت اشتباه، تا قبل از بررسی آژانس می‌توانید درخواست خود را لغو کنید."
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت توسط {agencyName} به{" "}
                      <span className="font-medium text-tertiary">منتشر شده</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      درخواست به{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      ارسال شد.
                    </>
                  }
                />
              </>
            )}

            {isDeleted && effectiveDeletedVariant === "recovery_expired" && (
              <>
                <TimelineItem time="دیروز ۱۲:۲۰" description="مهلت بازیابی این آگهی به پایان رسیده است." />
                <TimelineItem time="دیروز ۱۲:۲۰" description="مهلت بازیابی تا ۳۰ روز فعال شد." />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      آگهی به{" "}
                      <span className="font-medium text-on-surface-var">بایگانی شده</span>{" "}
                      منتقل شد.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      کاربر واگذاری آگهی به آژانس را به{" "}
                      <span className="font-medium text-error">لغو شده</span>{" "}
                      تغییر داد.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      وضعیت به{" "}
                      <span className="font-medium text-warning">در انتظار تایید آژانس</span>{" "}
                      تغییر یافت.
                    </>
                  }
                />
                <TimelineItem
                  time="دیروز ۱۲:۲۰"
                  description={
                    <>
                      درخواست به{" "}
                      <span className="font-medium text-primary">{agencyName}</span>{" "}
                      ارسال شد.
                    </>
                  }
                />
              </>
            )}
          </div>
        )}
      </section>

      {/* ONLY BottomSheet in the flow: لغو واگذاری آگهی به آژانس */}
      <AgencyCancelAssignmentBottomSheet
        isOpen={isCancelAssignmentOpen}
        isPending={cancelAssignmentMutation.isPending}
        onClose={() => setIsCancelAssignmentOpen(false)}
        onConfirm={async () => {
          if (!currentAdId) return;
          try {
            await cancelAssignmentMutation.mutateAsync({ advertiseId: currentAdId });
            setIsCancelAssignmentOpen(false);
            if (onRefetch) await onRefetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "لغو واگذاری با خطا مواجه شد."));
          }
        }}
      />

      {/* Repost Choice BottomSheet */}
      <RepostChoiceBottomSheet
        isOpen={isRepostChoiceOpen}
        isPersonalPending={republishPersonalMutation.isPending}
        onClose={() => setIsRepostChoiceOpen(false)}
        onSelectPersonal={async () => {
          if (!currentAdId) return;
          try {
            await republishPersonalMutation.mutateAsync(currentAdId);
            setIsRepostChoiceOpen(false);
            pushRoute(getAdPaymentPath(currentAdId));
          } catch (err) {
            alert(getApiErrorMessage(err, "ثبت مجدد آگهی با خطا مواجه شد."));
          }
        }}
        onSelectAgency={() => {
          setIsRepostChoiceOpen(false);
          setIsReassignAgencyOpen(true);
        }}
      />

      {/* Reassign Agency BottomSheet */}
      <AgencyReassignBottomSheet
        isOpen={isReassignAgencyOpen}
        isPending={reassignAgencyMutation.isPending}
        onClose={() => setIsReassignAgencyOpen(false)}
        onConfirm={async (newAgencyId) => {
          if (!currentAdId) return;
          try {
            await reassignAgencyMutation.mutateAsync({
              advertiseId: currentAdId,
              agencyId: newAgencyId,
            });
            setIsReassignAgencyOpen(false);
            if (onRefetch) await onRefetch();
          } catch (err) {
            alert(getApiErrorMessage(err, "واگذاری مجدد به آژانس با خطا مواجه شد."));
          }
        }}
      />
    </div>
  );
}

function TimelineItem({
  time,
  title,
  description,
}: {
  time: string;
  title?: string;
  description: React.ReactNode;
}) {
  return (
    <div className="py-3.5 text-right">
      <div className="flex items-center gap-1.5 text-xs text-on-surface-var">
        <LinearClock className="h-4 w-4 shrink-0 text-outline" />
        <span>{time}</span>
      </div>
      {title && (
        <Typography as="h4" variant="title" size="small" weight="semibold" className="m-0 mt-2 text-sm font-semibold text-on-surface">
          {title}
        </Typography>
      )}
      <div className="mt-1.5 text-xs leading-5 text-on-surface-var">{description}</div>
    </div>
  );
}

/**
 * BottomSheet: Exact UI from docs_UI/در انتظار تایید آژانس -- لغو واگذاری آگهی به آژانس.svg
 */
export function AgencyCancelAssignmentBottomSheet({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="لغو واگذاری آگهی به آژانس"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-2"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="لغو واگذاری آگهی به آژانس"
      variant="confirm"
      zIndexClassName="z-2000"
    >
      <div className="px-5 pt-4 text-right [direction:rtl]">
        <Typography as="h3" variant="body" size="large" weight="medium" className="m-0 text-on-surface">
          با لغو این درخواست، آژانس دیگر آگهی شما را مدیریت نخواهد کرد.
        </Typography>

        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 text-on-surface-var">
          آگهی شما تا ۷ روز در وضعیت «در انتظار ثبت مجدد» باقی می‌ماند و در این مدت می‌توانید:
        </Typography>

        <div className="flex flex-col gap-y-2">
          <div className="flex gap-2 items-center">
            <div className="w-1.25 h-1.25 bg-outline rounded-full" />
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-on-surface-var">
              آگهی را به آژانس دیگری واگذار کنید.
            </Typography>
          </div>

          <div className="flex gap-2 items-center">
            <div className="w-1.25 h-1.25 bg-outline rounded-full" />
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-on-surface-var">
              آگهی را به صورت شخصی منتشر کنید.
            </Typography>
          </div>
        </div>

        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 text-on-surface-var">
          پس از پایان مهلت، آگهی به بایگانی منتقل خواهد شد.
        </Typography>

        {/* Green notice banner */}
        <div className="mt-4 flex items-center gap-1 rounded-xl bg-tertiary-container/30 px-2 py-1 text-xs font-medium text-tertiary">
          <LinearInfoCircle className="h-4 w-4 shrink-0 text-tertiary" />
          <Typography as="span" variant="body" size="small" weight="medium" className="text-tertiary">
            اطلاعات و تصاویر آگهی حذف نخواهند شد.
          </Typography>
        </div>

        {/* Buttons in LTR: primary on left, secondary outline on right (32px distance from above) */}
        <div className="mt-8 grid grid-cols-2 gap-3 [direction:ltr]">
          <Button
            fullWidth
            variant="primary"
            size="x-medium"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "در حال لغو..." : "لغو درخواست"}
          </Button>

          <Button
            fullWidth
            variant="secondary"
            size="x-medium"
            disabled={isPending}
            onClick={onClose}
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function RepostChoiceBottomSheet({
  isOpen,
  onClose,
  onSelectAgency,
  onSelectPersonal,
  isPersonalPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgency: () => void;
  onSelectPersonal: () => void;
  isPersonalPending: boolean;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب روش انتشار مجدد"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(0.875rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب روش انتشار مجدد"
      variant="actions"
      zIndexClassName="z-2000"
    >
      <div className="px-4 pb-2 text-right [direction:rtl]">
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs leading-5 text-on-surface-var">
          تمایل دارید همین آگهی را به چه صورت مجدداً فعال و منتشر نمایید؟ تمامی مشخصات ثبت‌شده ملک حفظ می‌شود.
        </Typography>
      </div>

      <div className="divide-y divide-outline-var/20">
        <ListItem
          description="پرداخت هزینه انتشار و انتشار فوری آگهی به صورت شخصی"
          disabled={isPersonalPending}
          leading={<LinearUserSolid aria-hidden="true" className="h-6 w-6 text-on-surface-var" />}
          onClick={onSelectPersonal}
          tabIndex={isOpen ? 0 : -1}
          title={isPersonalPending ? "در حال انتقال به پرداخت..." : "انتشار شخصی و مستقیم (پرداخت آنلاین)"}
          trailing={<LinearArrowLeft1 aria-hidden="true" className="h-6 w-6 text-outline" />}
        />

        <ListItem
          description="ارسال و واگذاری این آگهی به آژانس املاک برای مدیریت و انتشار"
          disabled={isPersonalPending}
          leading={<LinearBuilding2 aria-hidden="true" className="h-6 w-6 text-on-surface-var" />}
          onClick={onSelectAgency}
          tabIndex={isOpen ? 0 : -1}
          title="ارسال و واگذاری به آژانس املاک دیگر"
          trailing={<LinearArrowLeft1 aria-hidden="true" className="h-6 w-6 text-outline" />}
        />
      </div>
    </BottomSheet>
  );
}

function AgencyReassignBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (agencyId: string | number) => void;
  isPending: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);

  const { data, isLoading } = useAgencyInfiniteQuery({
    search: searchValue.trim(),
    enabled: isOpen,
    perPage: 20,
  });

  const agencies = (data?.pages.flatMap((page) => page.data) ?? []) as Array<Record<string, unknown>>;

  return (
    <BottomSheet
      ariaLabel="انتخاب آژانس املاک جدید"
      className="rounded-t-[24px]! max-h-[85svh]"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      heightClassName="h-[min(100svh,640px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="انتخاب آژانس املاک جدید"
      variant="actions"
      zIndexClassName="z-2000"
    >
      <div className="flex flex-col h-full [direction:rtl]">
        <div className="p-4 border-b border-outline-var/20">
          <SearchInputBar
            value={searchValue}
            onValueChange={(val) => setSearchValue(val)}
            onClear={() => setSearchValue("")}
            placeholder="جستجوی نام آژانس املاک..."
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-on-surface-var">در حال بارگذاری آژانس‌ها...</div>
          ) : agencies.length === 0 ? (
            <SearchEmptyState title="آژانسی یافت نشد" description="لطفاً عبارت دیگری را جستجو کنید." />
          ) : (
            agencies.map((agency) => {
              const id = String(agency.id ?? "");
              const isSelected = selectedAgencyId === id;
              return (
                <div
                  key={id}
                  onClick={() => setSelectedAgencyId(id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-primary bg-primary-container/30" : "border-outline-var/30 hover:bg-surface-container-low"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-var">
                      <LinearBuilding2 className="w-5 h-5 text-on-surface-var" />
                    </div>
                    <div>
                      <Typography as="h4" variant="title" size="small" weight="medium" className="m-0 text-sm font-semibold text-on-surface">
                        {String(agency.title ?? agency.name ?? "آژانس املاک")}
                      </Typography>
                      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-0.5 text-xs text-on-surface-var">
                        {String(agency.address ?? agency.location ?? "")}
                      </Typography>
                    </div>
                  </div>
                  <RadioIndicator checked={isSelected} />
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-outline-var/20 p-4 bg-surface-container-lowest mt-auto">
          <Button
            fullWidth
            variant="primary"
            size="medium"
            disabled={!selectedAgencyId || isPending}
            onClick={() => {
              if (selectedAgencyId) onConfirm(selectedAgencyId);
            }}
          >
            {isPending ? "در حال واگذاری..." : "تأیید و واگذاری به این آژانس"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
