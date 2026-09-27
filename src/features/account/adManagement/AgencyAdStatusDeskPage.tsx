import { useMemo } from "react";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearClock from "../../../shared/icons/LinearClock";
import LinearDislike from "../../../shared/icons/LinearDislike";
import { PublishedActionIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getAdPreviewPath,
  getAdPaymentHistoryPath,
  type ConsultantAd,
} from "./adManagementData";

export type AgencyAdStatusDeskVariant =
  | "deal-success" // Ad status.svg (Variant 1: معامله با موفقیت انجام شده است)
  | "waiting-user-7-days" // Ad status-2.svg (Variant 2: در انتظار تایید کاربر - ۷ روز)
  | "waiting-user-3-days" // Ad status-3.svg (Variant 3: در انتظار تایید کاربر - ۳ روز)
  | "waiting-user-24-hours" // Ad status-4.svg (Variant 4: در انتظار تایید کاربر - ۲۴ ساعت)
  | "deal-unsuccessful" // Ad status-5.svg (Variant 5: معامله ناموفق بود)
  | "user-unconfirmed" // Ad status-1.svg (Variant 6: تأیید کاربر دریافت نشد)
  | "user-unresponsive"; // Ad status-6.svg (Variant 7: مشتری پاسخگو نبود!)

export type AgencyAdStatusDeskProps = {
  ad?: ConsultantAd;
  adId?: string;
  agencyName?: string;
  dealDate?: string;
  registrarRole?: string;
  returnTo?: string;
  variant?: AgencyAdStatusDeskVariant;
};

const defaultDeskAd: ConsultantAd = {
  id: "ad-130",
  title: "۱۳۰متر - دونبش جنوبی - معاوضه با...",
  agency: "آژانس جلیلیان",
  status: "حذف شده",
  imageCount: "۴",
  priceLabelPrimary: "",
  pricePrimary: "۱۲,۰۰۰,۰۰۰,۰۰۰ تومان",
  priceLabelSecondary: "",
  priceSecondary: "",
  area: "۱۳۰ متر مربع",
  rooms: "۳ خواب",
  year: "۲ سال",
  timeAndLocation: "۳ روز پیش در محله",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  imageClassName: "",
  badges: [],
};

function PartyPopperIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.8 11.3 2 22l10.7-3.8A13.5 13.5 0 0 0 5.8 11.3Z" />
      <path d="M4 14.8c1.4.3 2.9.2 4.2-.3" />
      <path d="M9.2 20c-.5-1.3-.6-2.8-.3-4.2" />
      <path d="m14 7 1-4 4 1-1 4" />
      <path d="M17 11h4" />
      <path d="M11 5V1" />
      <path d="M18.5 2.5 20 4" />
    </svg>
  );
}

function UserClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M2 20a7 7 0 0 1 12.3-4.6" />
      <circle cx="18" cy="18" r="4" />
      <path d="M18 16v2l1.2 1.2" />
    </svg>
  );
}

function UserSlashIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M2 20a7 7 0 0 1 12.5-4.5" />
      <circle cx="18" cy="18" r="4" />
      <line x1="15.2" y1="15.2" x2="20.8" y2="20.8" />
    </svg>
  );
}

function AgencyLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div className={`${className} flex shrink-0 items-center justify-center rounded-xl border border-outline-var/60 bg-surface-container-lowest p-2 shadow-xs`}>
      <svg className="h-7 w-7 text-on-surface-var" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75 12 3l9 6.75M4.5 10.5V20.25a.75.75 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V10.5M9 21V12h6v9" />
      </svg>
    </div>
  );
}

export function AgencyAdStatusDeskPage({
  ad: propAd,
  adId: propAdId,
  agencyName = "املاک جلیلیان",
  dealDate = "۱۴۰۵/۰۳/۱۲",
  registrarRole = "مالک",
  returnTo: propReturnTo,
  variant: propVariant,
}: AgencyAdStatusDeskProps) {
  const routeState = getAdManagementRouteState();

  const variant: AgencyAdStatusDeskVariant = useMemo(() => {
    if (propVariant) return propVariant;
    const stateVariant = (routeState as Record<string, unknown>)?.deskVariant as
      | AgencyAdStatusDeskVariant
      | undefined;
    if (stateVariant) return stateVariant;
    const closeResultReason = (routeState as Record<string, unknown>)?.closeResultReason as string | undefined;
    if (closeResultReason === "failed") return "deal-unsuccessful";
    if (closeResultReason === "unresponsive") return "user-unresponsive";
    if (closeResultReason === "successful") return "waiting-user-7-days";
    return "waiting-user-7-days";
  }, [propVariant, routeState]);

  const ad: ConsultantAd = propAd ?? (routeState.card as ConsultantAd | undefined) ?? (routeState.ad as ConsultantAd | undefined) ?? defaultDeskAd;
  const adId = propAdId ?? String(ad.id ?? "ad-130");
  const returnTo = propReturnTo ?? routeState.returnTo ?? adManagementPaths.root;

  // Title & Badge depending on variant matching Figma frames
  const isStatusTitle = variant === "deal-success" || variant === "user-unconfirmed";
  const pageTitle = isStatusTitle ? "وضعیت آگهی" : "میز کار آگهی";

  const isStopPublishBadge =
    variant === "waiting-user-7-days" ||
    variant === "waiting-user-3-days" ||
    variant === "waiting-user-24-hours";
  const badgeText = isStopPublishBadge ? "حذف انتشار" : "حذف شده";

  return (
    <PageFrame aria-label={pageTitle} className="bg-surface-container" variant="flush">
      <TopBar
        backState={{ tab: "status" }}
        backTo={returnTo}
        className="bg-surface-container"
        title={pageTitle}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest pb-6">
        {/* Top section: Badge + Compact Ad Summary */}
        <section className="px-4 pb-4 pt-4" aria-label="خلاصه وضعیت آگهی">
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="inline-flex h-9 items-center rounded-lg bg-[#C11004]/[0.08] px-3 text-sm font-medium leading-5 text-[#C11004]"
            >
              {badgeText}
            </Typography>
          </div>

          {/* Compact Ad Card */}
          <section
            aria-label={ad.title}
            className="mt-4 flex h-[68px] items-center justify-between gap-2 rounded-2xl border border-outline-var bg-surface-container-low px-3 py-2 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]"
          >
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs font-normal leading-4 text-on-surface-var">
                فروش مسکونی / فروش آپارتمان
              </Typography>
              <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 mt-1 truncate text-sm font-semibold leading-5 text-on-surface">
                {ad.title}
              </Typography>
            </div>
            <div
              aria-hidden="true"
              className={`h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center ${ad.imageClassName ?? ""}`}
              style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
            />
          </section>

          {/* Notice Box matching the 7 exact states */}
          <div className="mt-4">
            {variant === "deal-success" ? (
              <div className="rounded-2xl border border-[#11A366]/20 bg-[#11A366]/[0.08] p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <PartyPopperIcon className="h-5 w-5 shrink-0 text-[#11A366]" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-[#006038]">
                    معامله شما با موفقیت انجام شده است
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-[#006038]/85">
                  در تاریخ {dealDate}، کاربر اعلام کرده است که این درخواست با موفقیت به معامله منجر شده است.
                </Typography>
              </div>
            ) : null}

            {variant === "waiting-user-7-days" ? (
              <div className="rounded-2xl border border-warning/40 bg-warning/[0.08] p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <LinearClock className="h-5 w-5 shrink-0 text-warning" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-warning">
                    در انتظار تایید کاربر
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var">
                  آژانس این آگهی را به عنوان «معامله موفق» ثبت کرده است. منتظر تأیید کاربر هستیم.
                </Typography>
                <Typography as="p" variant="body" size="small" weight="medium" className="mt-2 text-xs font-medium leading-5 text-primary">
                  ۷ روز تا پایان مهلت پاسخگویی باقی مانده است.
                </Typography>
              </div>
            ) : null}

            {variant === "waiting-user-3-days" ? (
              <div className="rounded-2xl border border-warning/40 bg-warning/[0.08] p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <LinearClock className="h-5 w-5 shrink-0 text-warning" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-warning">
                    در انتظار تایید کاربر
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var">
                  آژانس این آگهی را به عنوان «معامله موفق» ثبت کرده است. منتظر تأیید کاربر هستیم.
                </Typography>
                <Typography as="p" variant="body" size="small" weight="medium" className="mt-2 text-xs font-medium leading-5 text-warning">
                  ۳ روز تا پایان مهلت پاسخگویی باقی مانده است.
                </Typography>
              </div>
            ) : null}

            {variant === "waiting-user-24-hours" ? (
              <div className="rounded-2xl border border-warning/40 bg-warning/[0.08] p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <LinearClock className="h-5 w-5 shrink-0 text-warning" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-warning">
                    در انتظار تایید کاربر
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var">
                  آژانس این آگهی را به عنوان «معامله موفق» ثبت کرده است. منتظر تأیید کاربر هستیم.
                </Typography>
                <Typography as="p" variant="body" size="small" weight="medium" className="mt-2 text-xs font-medium leading-5 text-error">
                  ۲۴ ساعت تا پایان مهلت پاسخگویی باقی مانده است.
                </Typography>
              </div>
            ) : null}

            {variant === "deal-unsuccessful" ? (
              <div className="rounded-2xl border border-error/40 bg-error/[0.08] p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <LinearDislike className="h-5 w-5 shrink-0 text-error" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-error">
                    معامله ناموفق بود
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var">
                  در تاریخ {dealDate} کاربر اعلام کرده است که این درخواست به معامله منجر نشده است.
                </Typography>
              </div>
            ) : null}

            {variant === "user-unconfirmed" ? (
              <div className="rounded-2xl border border-outline-var/60 bg-surface-container-low p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <UserClockIcon className="h-5 w-5 shrink-0 text-on-surface-var" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-on-surface-var">
                    تأیید کاربر دریافت نشد
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var/80">
                  مهلت تأیید نتیجه به پایان رسیده و پاسخی از سوی کاربر دریافت نشده است.
                </Typography>
              </div>
            ) : null}

            {variant === "user-unresponsive" ? (
              <div className="rounded-2xl border border-outline-var/60 bg-surface-container-low p-4 text-right [direction:rtl]">
                <div className="flex items-center gap-2">
                  <UserSlashIcon className="h-5 w-5 shrink-0 text-on-surface-var" />
                  <Typography as="h3" variant="title" size="small" weight="semibold" className="text-sm font-semibold leading-5 text-on-surface-var">
                    مشتری پاسخگو نبود!
                  </Typography>
                </div>
                <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-on-surface-var/80">
                  کاربر تا پایان مهلت تعیین‌شده، نتیجه این درخواست را ثبت نکرد.
                </Typography>
              </div>
            ) : null}
          </div>
        </section>

        <div className="h-2 bg-surface-container" aria-hidden="true" />

        {/* Section: ثبت کننده آگهی */}
        <section className="px-4 pb-4 pt-4" aria-label="ثبت کننده آگهی">
          <Typography as="h2" variant="label" size="large" weight="medium" className="m-0 mb-3 text-sm font-medium text-on-surface [direction:rtl]">
            ثبت کننده آگهی
          </Typography>

          <div className="flex h-16 items-center justify-end gap-3 rounded-2xl border border-outline-var/50 bg-surface-container-low px-4 text-right [direction:rtl]">
            <AgencyLogo />
            <div className="min-w-0 flex-1">
              <Typography as="p" variant="title" size="small" weight="semibold" className="m-0 text-sm font-semibold leading-5 text-on-surface">
                {agencyName}
              </Typography>
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-0.5 text-xs font-normal leading-4 text-outline">
                {registrarRole}
              </Typography>
            </div>
          </div>
        </section>

        <div className="h-2 bg-surface-container" aria-hidden="true" />

        {/* Section: Action rows (پیش‌نمایش + تاریخچه پرداخت) */}
        <section className="px-4" aria-label="عملیات آگهی">
          <RouteLink
            className="flex h-[52px] w-full items-center justify-between text-on-surface no-underline [direction:ltr] active:bg-black/5"
            state={{ previewFlow: "agency-allocation" }}
            to={getAdPreviewPath(adId)}
          >
            <LinearArrowLeft1 className="h-5 w-5 text-on-surface-var" />
            <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
              <PublishedActionIcon className="h-6 w-6 text-on-surface-var" icon="preview" />
              پیش‌نمایش
            </Typography>
          </RouteLink>

          <div className="h-px bg-outline-var" aria-hidden="true" />

          <RouteLink
            className="flex h-[52px] w-full items-center justify-between text-on-surface no-underline [direction:ltr] active:bg-black/5"
            state={{ returnTo: window.location.pathname, tab: "status" }}
            to={getAdPaymentHistoryPath(adId)}
          >
            <LinearArrowLeft1 className="h-5 w-5 text-on-surface-var" />
            <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
              <PublishedActionIcon className="h-6 w-6 text-on-surface-var" icon="history" />
              تاریخچه پرداخت
            </Typography>
          </RouteLink>
        </section>
      </main>
    </PageFrame>
  );
}
