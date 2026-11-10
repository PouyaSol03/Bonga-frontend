import { Link } from "react-router";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearChartUp from "../../../../shared/icons/LinearChartUp";
import {
  adManagementPaths,
  getAdIncreaseVisitsPath,
  type getSelectedConsultantAd,
} from "../adManagementData";
import type { ChartConfig } from "./types";
import { VisitBarChart } from "./VisitBarChart";
import { ErrorNotice, InlineNotice } from "./StatisticsNotices";

export function UserAdVisitStatisticsView({
  ad,
  adId,
  backTo,
  card,
  chart,
  isError,
  isLoading,
  onRetry,
  returnTo,
}: {
  ad: unknown;
  adId?: string;
  backTo: string;
  card: ReturnType<typeof getSelectedConsultantAd>;
  chart: ChartConfig;
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  returnTo?: string;
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad, card, returnTo, tab: "status" }}
        backTo={backTo}
        className="bg-surface-container [&_a]:text-on-surface"
        title="آمار بازدید"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[92px]">
        {isLoading ? <InlineNotice text="در حال دریافت آمار آگهی..." /> : null}
        {isError ? <ErrorNotice onRetry={onRetry} /> : null}

        <section className="bg-surface-container-lowest p-4" aria-label="آمار بازدید">
          <VisitBarChart chart={chart} mode="user" />
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />

        <section className="bg-surface-container-lowest flex min-h-[292px] flex-col px-7 pt-8 pb-8">
          <Typography
            as="h2"
            variant="headline"
            size="small"
            className="m-0 text-[26px] leading-10 font-extrabold tracking-[-0.04em]"
          >
            <Typography as="span" variant="title" size="large" className="text-tertiary font-black">
              دیده شو،{" "}
            </Typography>
            <Typography as="span" variant="title" size="large" className="text-primary font-black">
              سریع‌تر بفروش!
            </Typography>
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var m-0 mt-2"
          >
            با بسته‌های{" "}
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="text-primary"
            >
              «بروزرسانی»
            </Typography>{" "}
            و{" "}
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="text-primary"
            >
              «ویژه»
            </Typography>
            ، آگهی‌ات را در صدر نتایج و جلوی چشم خریداران قرار بده.
          </Typography>
        </section>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <Link
          className="bg-primary text-on-primary flex h-14 w-full items-center justify-between rounded-xl px-5 text-base leading-6 font-medium no-underline shadow-md [direction:ltr]"
          state={{
            ad,
            card,
            paymentFlow: "upgrade",
            paymentHistoryReturnTo: window.location.pathname,
            returnTo,
          }}
          to={adId ? getAdIncreaseVisitsPath(adId) : adManagementPaths.payment}
        >
          <LinearArrowLeft1 className="h-6 w-6" />
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="medium"
            className="inline-flex items-center gap-2 [direction:rtl]"
          >
            <LinearChartUp className="h-6 w-6" />
            افزایش بازدید
          </Typography>
        </Link>
      </footer>
    </PageFrame>
  );
}
