import "../../../components/AdCard.css";

import { PageFrame } from "../../../app/PageFrame";
import { SearchEmptyState } from "../../../components/SearchEmptyState";
import { TopBar } from "../../../components/TopBar";
import { Typography } from "../../../components/ui/Typography";
import { useMyAdsInfiniteQuery } from "../../../hooks/account.hooks";
import { RouteLink } from "../../../routes/RouteLink";
import { mapAdvertisementToAdCard, type AdvertisementItem } from "../../../services/advertisement.service";
import { ChevronLeftIcon, StatisticsIcon } from "./AdManagementIcons";
import { adManagementPaths, type StatisticsAd } from "./adManagementData";

export function IndependentConsultantAdStatisticsPage() {
  const adsQuery = useMyAdsInfiniteQuery({ perPage: 100, type: "active" });
  const ads = (adsQuery.data?.pages ?? []).flatMap((page) => page.data);

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-[#1a1a1a]"
        startSlot={<StatisticsTodayToggle />}
        title="آمار آگهی‌ها"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {adsQuery.isLoading ? <StatisticsNotice text="در حال دریافت آگهی‌ها..." /> : null}
        {adsQuery.isError ? <StatisticsNotice text="دریافت آگهی‌ها با خطا مواجه شد." /> : null}
        {!adsQuery.isLoading && !adsQuery.isError && ads.length === 0 ? <SearchEmptyState /> : null}
        <div className="space-y-2">
          {ads.map((sourceAd, index) => {
            const card = mapAdvertisementToAdCard(sourceAd, index);
            const ad: StatisticsAd = {
              id: card.id,
              imageClassName: card.imageClassName,
              imageUrl: card.imageUrl,
              timeAndLocation: card.timeAndLocation,
              title: card.title,
            };

            return <StatisticsAdCard ad={ad} key={String(card.id)} sourceAd={sourceAd} />;
          })}
        </div>
      </main>
    </PageFrame>
  );
}

function StatisticsTodayToggle() {
  return (
    <label className="flex h-12 w-[134px] cursor-pointer items-center gap-4 pl-3 [direction:ltr]">
      <input defaultChecked className="peer sr-only" type="checkbox" />
      <Typography as="span" variant="body" size="medium" weight="regular" className="flex h-6 w-11 shrink-0 items-center justify-end rounded-full bg-[#0048c4] px-1 peer-checked:bg-[#0048c4]">
        <Typography as="span" variant="body" size="medium" weight="regular" className="h-4 w-4 rounded-full bg-white" />
      </Typography>
      <Typography as="span" variant="label" size="large" weight="medium" className="whitespace-nowrap text-base font-medium leading-6 [direction:rtl]">آمار امروز</Typography>
    </label>
  );
}

function StatisticsAdCard({ ad, sourceAd }: { ad: StatisticsAd; sourceAd: AdvertisementItem }) {
  return (
    <article className="h-[284px] bg-white px-4 py-4">
      <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
        <div className="min-w-0 flex-1 text-right [direction:rtl]">
          <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 truncate text-sm font-medium leading-5">{ad.title}</Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs font-normal leading-4 text-[#808080]">{ad.timeAndLocation}</Typography>
        </div>
        <div
          aria-hidden="true"
          className={`ad-card__image ${ad.imageClassName} h-[72px] w-[108px] shrink-0 rounded-xl bg-cover`}
          style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
        />
      </div>

      <div className="mt-4 grid h-[108px] grid-cols-4 [direction:ltr]">
        <StatisticsMetric icon="chat" label="چت" value={readStatistic(sourceAd, ["chat_count", "chats_count", "chats", "conversation_count", "message_count"])} />
        <StatisticsMetric icon="call" label="تماس" value={readStatistic(sourceAd, ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"])} />
        <StatisticsMetric icon="display" label="نمایش" value={readStatistic(sourceAd, ["search_display_count", "impressions", "impression_count", "display_count", "shown_count"])} />
        <StatisticsMetric icon="view" label="بازدید" value={readStatistic(sourceAd, ["total_views", "views_count", "views", "visit_count", "view_count"])} />
      </div>

      <RouteLink
        className="mr-auto mt-4 inline-flex h-10 w-[156px] items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] text-sm font-medium leading-5 text-[#0048c4] no-underline [direction:ltr]"
        state={{ ad: sourceAd, statisticsAd: ad }}
        to={adManagementPaths.statisticsDetails}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">جزییات آمار آگهی</Typography>
      </RouteLink>
    </article>
  );
}

function StatisticsMetric({
  icon,
  label,
  value,
}: {
  icon: "call" | "chat" | "display" | "view";
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-[#4d4d4d]">
      <StatisticsIcon className="h-6 w-6" icon={icon} />
      <strong className="mt-1 text-base font-semibold leading-6 text-[#1a1a1a]">{value}</strong>
      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-1 text-sm font-normal leading-5">{label}</Typography>
    </div>
  );
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function StatisticsNotice({ text }: { text: string }) {
  return <div className="bg-white px-4 py-3 text-center text-xs font-medium text-[#808080]">{text}</div>;
}
