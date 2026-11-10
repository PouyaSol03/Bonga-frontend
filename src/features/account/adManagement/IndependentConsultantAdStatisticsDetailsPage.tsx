import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { isRecord, readText } from "../../../shared/lib/textUtils";
import {
  adManagementPaths,
  getAdManagementRouteState,
  type StatisticsAd,
} from "./adManagementData";
import { getPrimaryAdvertisementImageUrl } from "../../advertisements/utils/advertisement-images";

const chartSections = [
  {
    keys: ["total_views", "views_count", "views", "visit_count", "view_count"],
    label: "بازدید امروز:",
    title: "بازدید از آگهی",
  },
  {
    keys: [
      "search_display_count",
      "impressions",
      "impression_count",
      "display_count",
      "shown_count",
    ],
    label: "کل نمایش‌ها:",
    title: "نمایش در صفحه جستجو",
  },
  {
    keys: ["chat_count", "chats_count", "chats", "conversation_count", "message_count"],
    label: "کل گفتگوها:",
    title: "گفتگوها (چت‌ها)",
  },
  {
    keys: ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"],
    label: "کل تماس‌ها:",
    title: "اقدام به تماس",
  },
] as const;

export function IndependentConsultantAdStatisticsDetailsPage() {
  const routeState = getAdManagementRouteState();
  const ad = routeState.statisticsAd ?? createUnavailableStatisticsAd(routeState.ad);

  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={adManagementPaths.statistics}
        className="[&_a]:text-on-surface"
        title="جزییات آمار آگهی"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <section className="bg-surface-container-lowest h-[104px] px-4 py-4" aria-label={ad.title}>
          <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography
                as="h2"
                variant="title"
                size="small"
                weight="medium"
                className="m-0 truncate text-sm leading-5 font-medium"
              >
                {ad.title}
              </Typography>
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-outline m-0 mt-2 text-xs leading-4 font-normal"
              >
                {ad.timeAndLocation}
              </Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[72px] w-[108px] shrink-0 rounded-lg bg-cover`}
              style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
            />
          </div>
        </section>

        <div className="bg-surface-container h-2" aria-hidden="true" />
        {chartSections.map((section, index) => (
          <div key={section.title}>
            {index > 0 ? <div className="bg-surface-container h-2" aria-hidden="true" /> : null}
            <StatisticsChart
              label={section.label}
              title={section.title}
              value={readStatistic(routeState.ad, [...section.keys])}
            />
          </div>
        ))}
      </main>
    </PageFrame>
  );
}

function StatisticsChart({ label, title, value }: { label: string; title: string; value: string }) {
  return (
    <section className="bg-surface-container-low h-[283px] px-4 py-4" aria-label={title}>
      <div className="flex h-12 items-center justify-end [direction:ltr]">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="m-0 inline-flex items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
        >
          <TrendIcon className="text-on-surface-var h-6 w-6" />
          {title}
        </Typography>
      </div>

      <div className="mt-4 h-[187px]">
        <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var text-sm leading-5 font-normal"
          >
            {label}
          </Typography>
          <strong className="bg-primary-container text-primary rounded px-2 text-base leading-6 font-medium">
            {value}
          </strong>
        </div>
        <div className="border-outline-var mx-auto mt-2 flex h-[155px] w-full items-center justify-center border-b text-center">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline m-0 text-xs"
          >
            داده نموداری از سرور دریافت نشده است.
          </Typography>
        </div>
      </div>
    </section>
  );
}

function createUnavailableStatisticsAd(source: unknown): StatisticsAd {
  const record = isRecord(source) ? source : {};
  const id = readText(record.id ?? record._id ?? record.advertise_id) || "";

  return {
    id,
    imageClassName: "",
    imageUrl: readImageUrl(record),
    timeAndLocation: readText(record.timeAndLocation ?? record.time_and_location),
    title: readText(record.title ?? record.ad_title) || "آگهی",
  };
}

function readStatistic(ad: unknown, keys: string[]) {
  if (!isRecord(ad)) return "—";
  const containers = [ad, ad.statistics, ad.stats, ad.report, ad.analytics].filter(isRecord);
  for (const container of containers) {
    for (const key of keys) {
      const value = container[key];
      if (typeof value === "number" && Number.isFinite(value))
        return new Intl.NumberFormat("fa-IR").format(value);
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return "—";
}

function readImageUrl(record: Record<string, unknown>) {
  return getPrimaryAdvertisementImageUrl(record);
}

function TrendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <rect height="17" rx="2" width="16" x="4" y="3.5" />
      <path d="m7.5 15.5 3.25-3.25 2.5 2.25 3.5-5M15 9.5h1.75v1.75" />
    </svg>
  );
}
