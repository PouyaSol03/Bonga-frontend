import { useState } from "react";
import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { TopBar } from "../../../shared/components/TopBar";
import { Link } from "react-router";
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

export type IndependentConsultantAdPublishedPageProps = {
  ad?: ReturnType<typeof getSelectedConsultantAd>;
  expirationLabel?: string;
  initialSuccessOpen?: boolean;
};

export function IndependentConsultantAdPublishedPage(
  props?: IndependentConsultantAdPublishedPageProps,
) {
  const ad = props?.ad ?? getSelectedConsultantAd();
  const routeState = getAdManagementRouteState();
  const expirationLabel =
    props?.expirationLabel ??
    readExpirationLabel(routeState.assignment?.advertise) ??
    "۲۱ روز دیگر (۱۴۰۴/۱۲/۰۱)";
  const backTo = normalizeLocalPath(routeState.returnTo) ?? adManagementPaths.root;
  const [isSuccessOpen, setIsSuccessOpen] = useState(
    props?.initialSuccessOpen ?? routeState.showPaymentSuccess ?? false,
  );

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title={isSuccessOpen ? "وضعیت آگهی" : "مدیریت آگهی"}
      />

      <main className="bg-surface-container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <section
          className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-2"
          aria-label={ad.title}
        >
          <div className="flex justify-start">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="bg-tertiary-container/30 text-tertiary inline-flex h-9 items-center rounded-lg px-3 text-sm leading-5 font-medium"
            >
              منتشر شده
            </Typography>
          </div>

          <div className="mt-4 flex h-[68px] items-center justify-between gap-2 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="medium"
                className="m-0 truncate text-base leading-6 font-medium"
              >
                {ad.title}
              </Typography>
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="medium"
                className="text-outline m-0 mt-1 text-xs leading-4 font-medium"
              >
                {ad.timeAndLocation}
              </Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[68px] w-[102px] shrink-0 rounded-lg bg-cover`}
            />
          </div>

          <div className="mt-4 flex h-10 items-center justify-between py-2 text-sm leading-5 font-medium [direction:ltr]">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="[direction:rtl]"
            >
              {expirationLabel}
            </Typography>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline [direction:rtl]"
            >
              انقضا
            </Typography>
          </div>
        </section>

        <div className="bg-surface-container h-2 shrink-0" aria-hidden="true" />
        <div className="bg-surface-container-lowest min-h-[300px] flex-1">
          <PublishedAction
            icon="preview"
            label="پیش‌نمایش"
            returnTo={backTo}
            to={getAdPreviewPath(ad.id)}
          />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="edit"
            label="ویرایش"
            returnTo={backTo}
            to={getAdEditPath(ad.id, backTo)}
          />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="delete"
            returnTo={backTo}
            label="حذف"
            to={`${adManagementPaths.delete}?adId=${encodeURIComponent(String(ad.id))}`}
          />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="upgrade"
            label="ارتقاء آگهی"
            returnTo={backTo}
            to={getAdIncreaseVisitsPath(ad.id)}
          />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="stats"
            label="آمار بازدید"
            returnTo={backTo}
            to={getAdVisitStatisticsPath(ad.id)}
          />
          <PublishedActionDivider />
          <PublishedAction
            ad={ad}
            icon="history"
            label="تاریخچه پرداخت"
            returnTo={backTo}
            to={getAdPaymentHistoryPath(ad.id)}
          />
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
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-tertiary m-0 mt-3 text-base leading-6 font-semibold"
        >
          پرداخت موفق
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-5 text-sm leading-5 font-normal"
        >
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
      <LinearArrowLeft1 className="text-on-surface-var h-6 w-6" />
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="inline-flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
      >
        <PublishedActionIcon className="text-on-surface-var h-6 w-6" icon={icon} />
        {label}
      </Typography>
    </>
  );

  if (to) {
    return (
      <Link
        className="text-on-surface-var flex h-14 w-full items-center justify-between px-4 no-underline [direction:ltr]"
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
      </Link>
    );
  }

  return (
    <Button
      unstyled
      className="text-on-surface flex h-14 w-full items-center justify-between px-4 [direction:ltr]"
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
      <div className="bg-outline-var h-px w-full" />
    </div>
  );
}
