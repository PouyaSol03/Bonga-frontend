import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { adManagementPaths, getAdManagementRouteState, type StatisticsAd } from "./adManagementData";
import { getPrimaryAdvertisementImageUrl } from "../../advertisements/utils/advertisement-images";

const chartSections = [
  { keys: ["total_views", "views_count", "views", "visit_count", "view_count"], label: "بازدید امروز:", title: "بازدید از آگهی" },
  { keys: ["search_display_count", "impressions", "impression_count", "display_count", "shown_count"], label: "کل نمایش‌ها:", title: "نمایش در صفحه جستجو" },
  { keys: ["chat_count", "chats_count", "chats", "conversation_count", "message_count"], label: "کل گفتگوها:", title: "گفتگوها (چت‌ها)" },
  { keys: ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"], label: "کل تماس‌ها:", title: "اقدام به تماس" },
] as const;

export function IndependentConsultantAdStatisticsDetailsPage() {
  const routeState = getAdManagementRouteState();
  const ad = routeState.statisticsAd ?? createUnavailableStatisticsAd(routeState.ad);

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={adManagementPaths.statistics}
        className="[&_a]:text-[#1a1a1a]"
        title="جزییات آمار آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="h-[104px] bg-white px-4 py-4" aria-label={ad.title}>
          <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 truncate text-sm font-medium leading-5">{ad.title}</Typography>
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs font-normal leading-4 text-[#808080]">{ad.timeAndLocation}</Typography>
            </div>
            <div
              aria-hidden="true"
              className={`ad-card__image ${ad.imageClassName} h-[72px] w-[108px] shrink-0 rounded-lg bg-cover`}
              style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
            />
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
        {chartSections.map((section, index) => (
          <div key={section.title}>
            {index > 0 ? <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" /> : null}
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
    <section className="h-[283px] bg-[#fafafa] px-4 py-4" aria-label={title}>
      <div className="flex h-12 items-center justify-end [direction:ltr]">
        <Typography as="h2" variant="title" size="medium" weight="medium" className="m-0 inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
          <TrendIcon className="h-6 w-6 text-[#4d4d4d]" />
          {title}
        </Typography>
      </div>

      <div className="mt-4 h-[187px]">
        <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal leading-5 text-[#4d4d4d]">{label}</Typography>
          <strong className="rounded bg-[#edf0fb] px-2 text-base font-medium leading-6 text-[#002099]">{value}</strong>
        </div>
        <div className="mx-auto mt-2 flex h-[155px] w-full items-center justify-center border-b border-[#cccccc] text-center">
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs text-[#808080]">
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
      if (typeof value === "number" && Number.isFinite(value)) return new Intl.NumberFormat("fa-IR").format(value);
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return "—";
}

function readImageUrl(record: Record<string, unknown>) {
  return getPrimaryAdvertisementImageUrl(record);
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function TrendIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="17" rx="2" width="16" x="4" y="3.5" />
      <path d="m7.5 15.5 3.25-3.25 2.5 2.25 3.5-5M15 9.5h1.75v1.75" />
    </svg>
  );
}
