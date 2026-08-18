import { useState } from "react";
import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { TopBar } from "../../../shared/components/TopBar";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import { PublishedActionIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getAdEditPath,
  getAdManagementRouteState,
  getAdIncreaseVisitsPath,
  getAdPaymentHistoryPath,
  getAdPreviewPath,
  getAdVisitStatisticsPath,
  getSelectedConsultantAd,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export function IndependentConsultantAdPublishedPage() {
  const ad = getSelectedConsultantAd();
  const routeState = getAdManagementRouteState();
  const expirationLabel = readExpirationLabel(routeState.assignment?.advertise);
  const backTo = normalizeLocalPath(routeState.returnTo) ?? adManagementPaths.root;
  const [isSuccessOpen, setIsSuccessOpen] = useState(
    routeState.showPaymentSuccess ?? false,
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={backTo}
        className="[&_a]:text-[#1a1a1a]"
        title={isSuccessOpen ? "وضعیت آگهی" : "مدیریت آگهی"}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="shrink-0 bg-white px-4 pb-2 pt-4" aria-label={ad.title}>
          <div className="flex justify-start">
            <Typography as="span" variant="label" size="medium" weight="medium" className="inline-flex h-9 items-center rounded-lg bg-[#11a36614] px-3 text-sm font-medium leading-5 text-[#11a366]">
              منتشر شده
            </Typography>
          </div>

          <div className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 truncate text-base font-medium leading-6">{ad.title}</Typography>
              <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">{ad.timeAndLocation}</Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[68px] w-[102px] shrink-0 rounded-lg bg-cover`}
            />
          </div>

          <div className="mt-4 flex h-10 items-center justify-between py-2 text-sm font-medium leading-5 [direction:ltr]">
            <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">{expirationLabel}</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080] [direction:rtl]">انقضا</Typography>
          </div>
        </section>

        <div className="h-2 shrink-0 bg-[#f0f0f0]" aria-hidden="true" />
        <div className="min-h-[300px] flex-1 bg-white">
          <PublishedAction icon="preview" label="پیش‌نمایش" returnTo={backTo} to={getAdPreviewPath(ad.id)} />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="edit" label="ویرایش" returnTo={backTo} to={getAdEditPath(ad.id)} />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="delete"
            returnTo={backTo}
            label="حذف"
            to={`${adManagementPaths.delete}?adId=${encodeURIComponent(String(ad.id))}`}
          />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="upgrade" label="ارتقاء آگهی" returnTo={backTo} to={getAdIncreaseVisitsPath(ad.id)} />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="stats" label="آمار بازدید" returnTo={backTo} to={getAdVisitStatisticsPath(ad.id)} />
          <PublishedActionDivider />
          <PublishedAction ad={ad} icon="history" label="تاریخچه پرداخت" returnTo={backTo} to={getAdPaymentHistoryPath(ad.id)} />
        </div>
      </main>

      <BottomSheet
        ariaLabel="نتیجه پرداخت"
        contentClassName="px-4 pt-5 text-center"
        heightClassName="h-[315px]"
        isOpen={isSuccessOpen}
        onBack={() => setIsSuccessOpen(false)}
        onClose={() => setIsSuccessOpen(false)}
        title="نتیجه پرداخت"
      >
        <img
          alt=""
          className="mx-auto h-[104px] w-[104px] object-contain"
          src="/figma/account/consultant-payment-success.png"
        />
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-3 text-base font-semibold leading-6 text-[#11a366]">
          پرداخت موفق
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-5 text-sm font-normal leading-5 text-[#4d4d4d]">
          پرداخت موفق و آگهی منتشر شد
        </Typography>
      </BottomSheet>
    </PageFrame>
  );
}

function readExpirationLabel(advertise?: Record<string, unknown>) {
  if (!advertise) return "—";

  const candidates = [
    advertise.expires_at,
    advertise.expire_at,
    advertise.expired_at,
    advertise.expiration_date,
    advertise.expires_in,
    advertise.remaining_days,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return "—";
}


function normalizeLocalPath(path?: string) {
  if (!path || !path.startsWith("/")) return undefined;
  if (path.startsWith("//")) return undefined;

  return path;
}

function PublishedAction({
  ad,
  icon,
  label,
  onClick,
  returnTo = adManagementPaths.root,
  to,
}: {
  ad?: ReturnType<typeof getSelectedConsultantAd>;
  icon: "delete" | "edit" | "history" | "preview" | "stats" | "upgrade";
  label: string;
  onClick?: () => void;
  returnTo?: string;
  to?: string;
}) {
  const content = (
    <>
      <LinearArrowLeft1 className="h-6 w-6 text-[#4d4d4d]" />
      <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
        <PublishedActionIcon className="h-6 w-6 text-[#4d4d4d]" icon={icon} />
        {label}
      </Typography>
    </>
  );

  if (to) {
    return (
      <RouteLink
        className="flex h-14 w-full items-center justify-between px-4 text-[#4d4d4d] no-underline [direction:ltr]"
        state={{
          ad,
          card: ad,
          deleteCompleteTo: icon === "delete" ? returnTo : undefined,
          deleteReturnTo: icon === "delete" ? window.location.pathname : undefined,
          editReturnTo: window.location.pathname,
          isEditMode: icon === "edit" ? true : undefined,
          paymentFlow: icon === "upgrade" ? "upgrade" : undefined,
          paymentHistoryReturnTo: icon === "history" ? window.location.pathname : undefined,
          visitStatisticsReturnTo: icon === "stats" ? window.location.pathname : undefined,
          returnTo,
          tab: "status",
        }}
        to={to}
      >
        {content}
      </RouteLink>
    );
  }

  return (
    <Button unstyled
      className="flex h-14 w-full items-center justify-between px-4 text-[#1a1a1a] [direction:ltr]"
      onClick={onClick}
      type="button"
    >
      {content}
    </Button>
  );
}

function PublishedActionDivider() {
  return (
    <div className="flex h-[5px] items-center px-4" aria-hidden="true">
      <div className="h-px w-full bg-[#cccccc]" />
    </div>
  );
}
