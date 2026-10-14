import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { TopBar } from "../../../shared/components/TopBar";
import { Typography } from "../../../shared/ui/Typography";
import { useMyAdsInfiniteQuery } from "../api/account.hooks";
import { Link } from "react-router";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import { StatisticsIcon } from "./AdManagementIcons";
import { adManagementPaths, type StatisticsAd } from "./adManagementData";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export function IndependentConsultantAdStatisticsPage() {
  const adsQuery = useMyAdsInfiniteQuery({ perPage: 100, type: "active" });
  const ads = (adsQuery.data?.pages ?? []).flatMap((page) => page.data);

  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ tab: "status" }}
        backTo={adManagementPaths.root}
        className="[&_a]:text-on-surface"
        startSlot={<StatisticsTodayToggle />}
        title="آمار آگهی‌ها"
      />

      <main className="bg-surface-container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
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
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="bg-primary peer-checked:bg-primary flex h-6 w-11 shrink-0 items-center justify-end rounded-full px-1"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-on-primary h-4 w-4 rounded-full"
        />
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="large"
        weight="medium"
        className="text-base leading-6 font-medium whitespace-nowrap [direction:rtl]"
      >
        آمار امروز
      </Typography>
    </label>
  );
}

function StatisticsAdCard({ ad, sourceAd }: { ad: StatisticsAd; sourceAd: AdvertisementItem }) {
  return (
    <article className="bg-surface-container-lowest h-[284px] px-4 py-4">
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
          className={`ad-card__image ${ad.imageClassName} h-[72px] w-[108px] shrink-0 rounded-xl bg-cover`}
          style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
        />
      </div>

      <div className="mt-4 grid h-[108px] grid-cols-4 [direction:ltr]">
        <StatisticsMetric
          icon="chat"
          label="چت"
          value={readStatistic(sourceAd, [
            "chat_count",
            "chats_count",
            "chats",
            "conversation_count",
            "message_count",
          ])}
        />
        <StatisticsMetric
          icon="call"
          label="تماس"
          value={readStatistic(sourceAd, [
            "call_count",
            "calls_count",
            "calls",
            "phone_clicks",
            "contact_count",
          ])}
        />
        <StatisticsMetric
          icon="display"
          label="نمایش"
          value={readStatistic(sourceAd, [
            "search_display_count",
            "impressions",
            "impression_count",
            "display_count",
            "shown_count",
          ])}
        />
        <StatisticsMetric
          icon="view"
          label="بازدید"
          value={readStatistic(sourceAd, [
            "total_views",
            "views_count",
            "views",
            "visit_count",
            "view_count",
          ])}
        />
      </div>

      <Link
        className="border-primary text-primary mt-4 mr-auto inline-flex h-10 w-[156px] items-center justify-center gap-2 rounded-[10px] border text-sm leading-5 font-medium no-underline [direction:ltr]"
        state={{ ad: sourceAd, statisticsAd: ad }}
        to={adManagementPaths.statisticsDetails}
      >
        <LinearArrowLeft1 className="h-5 w-5" />
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="[direction:rtl]"
        >
          جزییات آمار آگهی
        </Typography>
      </Link>
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
    <div className="text-on-surface-var flex flex-col items-center">
      <StatisticsIcon className="h-6 w-6" icon={icon} />
      <strong className="text-on-surface mt-1 text-base leading-6 font-semibold">{value}</strong>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="mt-1 text-sm leading-5 font-normal"
      >
        {label}
      </Typography>
    </div>
  );
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function StatisticsNotice({ text }: { text: string }) {
  return (
    <div className="bg-surface-container-lowest text-outline flex min-h-0 flex-1 items-center justify-center px-4 text-center text-xs font-medium">
      {text}
    </div>
  );
}
