import { useState, type ReactNode } from "react";
import { PageFrame } from "../../app/layout/PageFrame";
import { useMyBadgesQuery } from "../../core/hooks/account.hooks";
import { useAgentDashboardQuery } from "../../core/hooks/dashboard.hooks";
import { usePublicAgentsQuery } from "../../core/hooks/agency.hooks";
import type { BadgeItem } from "../../core/services/account.service";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../app/router/RouteLink";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type Badge = {
  active: boolean;
  image?: string;
  name: string;
  progress: number;
  to: string;
};

type RankIndicator = {
  icon: "activity" | "like" | "response" | "time";
  label: string;
  value: string;
};

type RankingPeriod = "هفته" | "ماه";

const badgeRouteBySlug: Record<string, string> = {
  file: "/account/ranking/badges/file",
  magnet: "/account/ranking/badges/magnet",
  response: "/account/ranking/badges/response",
  time: "/account/ranking/badges/time",
};

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR").format(value);
}

function mapBadgeItemToBadge(item: BadgeItem): Badge {
  const parsedProgress = Number(item.progress);
  const slug = typeof item.slug === "string" ? item.slug.trim().toLowerCase() : "";

  return {
    active: item.active === true,
    image:
      typeof item.image === "string" && item.image.trim()
        ? item.image
        : typeof item.logo === "string" && item.logo.trim()
          ? item.logo
          : undefined,
    name: typeof item.name === "string" && item.name.trim() ? item.name.trim() : "نشان",
    progress: Number.isFinite(parsedProgress)
      ? Math.max(0, Math.min(100, parsedProgress))
      : 0,
    to: badgeRouteBySlug[slug] ?? "/account/ranking/badges/guide",
  };
}

export function IndependentConsultantRankingPage() {
  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const dashboardQuery = useAgentDashboardQuery({
    period: period === "هفته" ? "7d" : "30d",
  });
  const dashboard = dashboardQuery.data;
  const ranking = dashboard?.ranking;
  const workSummary = dashboard?.workSummary;
  const indicators: RankIndicator[] = [
    {
      icon: "activity",
      label: "آگهی منتشرشده",
      value: formatOptionalNumber(workSummary?.publishedAdvertises),
    },
    {
      icon: "like",
      label: "آگهی ثبت‌شده",
      value: formatOptionalNumber(workSummary?.createdAdvertises),
    },
    {
      icon: "response",
      label: "در انتظار بررسی",
      value: formatOptionalNumber(workSummary?.pendingReview),
    },
    {
      icon: "time",
      label: "ردشده",
      value: formatOptionalNumber(workSummary?.rejected),
    },
  ];

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <InfoIcon className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: "/account/ranking/badges/guide",
          },
        ]}
        backTo="/account"
        className="[&_button]:text-[#1a1a1a]"
        title="نشان‌ها و رتبه"
      />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] px-4 py-4">
        <LevelSummaryCard
          levelTitle={ranking?.current.levelTitle || "—"}
          score={formatOptionalNumber(ranking?.current.totalScore)}
        />
        <MetricSummaryCard
          icon={<RankIcon className="h-6 w-6 text-[#11a366]" />}
          iconClassName="bg-[#11a3661f]"
          label="رتبه مشاور"
          value={formatOptionalNumber(ranking?.rank ?? ranking?.current.rank)}
        />
        <MetricSummaryCard
          icon={<StarOutlineIcon className="h-6 w-6 text-[#ff6d00]" />}
          iconClassName="bg-[#ff8d0029]"
          label="امتیاز مشاور"
          value={formatOptionalNumber(ranking?.current.totalScore)}
        />
        <BadgesPanel />
        <RankingIndicatorsPanel
          indicators={indicators}
          period={period}
          setPeriod={setPeriod}
        />
        <TopConsultantsPanel />
      </main>
    </PageFrame>
  );
}

function LevelSummaryCard({ levelTitle, score }: { levelTitle: string; score: string }) {
  return (
    <RouteLink
      aria-label="سطح پیشرفت مشاور"
      className="flex h-20 items-center justify-between rounded-2xl bg-white px-4 text-[#1a1a1a] no-underline [direction:ltr]"
      to="/account/ranking/levels"
    >
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <GuidePill />
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium text-[#4d4d4d] [direction:rtl]">
            {levelTitle}
          </Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end gap-1 text-xs [direction:ltr]">
          <Typography as="span" variant="body" size="small" weight="regular" className="text-[#808080] [direction:rtl]">
            امتیاز فعلی
          </Typography>
          <Typography as="span" variant="label" size="small" weight="medium" className="font-medium text-[#0048c4] [direction:rtl]">
            {score}
          </Typography>
        </div>
      </div>
      <img alt="" className="h-12 w-12 shrink-0 object-contain" src="/figma/account/ranking-diamond.png" />
    </RouteLink>
  );
}

function MetricSummaryCard({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <section className="flex h-20 items-center justify-between rounded-2xl bg-white px-4 [direction:ltr]" aria-label={label}>
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <strong className="text-base font-semibold">{value}</strong>
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium text-[#4d4d4d] [direction:rtl]">{label}</Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end text-xs [direction:ltr]">
          <Typography as="span" variant="body" size="small" weight="regular" className="text-[#808080] [direction:rtl]">
            اطلاعات مقایسه‌ای از سرور دریافت نشده است
          </Typography>
        </div>
      </div>
      <Typography as="span" variant="body" size="medium" weight="regular" className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>
        {icon}
      </Typography>
    </section>
  );
}

function BadgesPanel() {
  const { data: apiBadges = [], error, isError, isLoading, refetch } = useMyBadgesQuery();
  const visibleBadges = apiBadges.map(mapBadgeItemToBadge);
  const BadgesErrorState = getRequestErrorState(error);

  return (
    <section className="rounded-2xl bg-white p-4" aria-label="نشان‌ها">
      <SectionHeader title="نشان‌ها" />
      {isLoading ? (
        <div className="mt-6 py-8 text-center text-sm font-medium text-[#808080]">
          <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-[#0048c433] border-t-[#0048c4]" />
          در حال دریافت نشان‌ها...
        </div>
      ) : null}
      {isError ? (
        <div className="fixed inset-0 z-[999] bg-white">
          <BadgesErrorState className="h-full" onRetry={() => void refetch()} />
        </div>
      ) : null}
      {!isLoading && !isError && visibleBadges.length === 0 ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full py-8 text-center text-[#808080]">
          نشانی از سرور دریافت نشده است.
        </Typography>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {!isLoading && !isError && visibleBadges.map((badge, index) => (
          <BadgeCard badge={badge} key={`${badge.name}-${index}`} />
        ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <RouteLink
      aria-label={`جزییات نشان ${badge.name}`}
      className="flex h-[186px] flex-col items-center rounded-lg border border-[#f5f5f5] pt-6 text-inherit no-underline"
      to={badge.to}
    >
      {badge.image ? (
        <img alt="" className="h-[72px] w-[72px] object-contain" src={badge.image} />
      ) : (
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#f5f5f5] text-[#a6a6a6]">
          <StarOutlineIcon className="h-8 w-8" />
        </Typography>
      )}
      <Typography as="span" variant="label" size="medium" weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold ${badge.active ? "bg-[#0048c41f] text-[#0048c4]" : "bg-[#4d4d4d14] text-[#a6a6a6]"}`}
      >
        {badge.name}
      </Typography>
      <div className="mt-0.5 flex h-3 items-center justify-center">
        {[0, 1, 2].map((star) => (
          <SmallStarIcon
            className={`h-3 w-3 ${badge.active && star === 0 ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
            key={star}
          />
        ))}
      </div>
      <div className="mt-4 h-1 w-[92px] rounded-full bg-[#ff8d0029]">
        <div className="h-1 rounded-full bg-[#ffb100]" style={{ width: `${badge.progress}%` }} />
      </div>
    </RouteLink>
  );
}

function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
}: {
  indicators: RankIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-4" aria-label="خلاصه فعالیت">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <Button unstyled
          className="inline-flex h-7 items-center gap-2 text-xs font-medium text-[#1a1a1a]"
          onClick={() => setPeriod(period === "هفته" ? "ماه" : "هفته")}
          type="button"
        >
          <ChevronDownIcon className="h-4 w-4 text-[#4d4d4d]" />
          <Typography as="span" variant="body" size="small" weight="regular" className="[direction:rtl]">{period}</Typography>
        </Button>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold [direction:rtl]">خلاصه فعالیت</Typography>
      </div>
      <div className="mt-6 space-y-4">
        {indicators.map((indicator) => (
          <RankIndicatorRow indicator={indicator} key={indicator.label} />
        ))}
      </div>
    </section>
  );
}

function RankIndicatorRow({ indicator }: { indicator: RankIndicator }) {
  return (
    <div className="flex h-20 items-center rounded-lg border border-[#f5f5f5] px-4 [direction:ltr]">
      <strong className="shrink-0 text-base font-semibold text-[#0048c4] [direction:rtl]">{indicator.value}</strong>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="min-w-0 flex-1 px-2 text-right text-sm font-semibold text-[#4d4d4d] [direction:rtl]">
        {indicator.label}
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0048c414] text-[#0048c4]">
        <IndicatorIcon className="h-6 w-6" icon={indicator.icon} />
      </Typography>
    </div>
  );
}

function TopConsultantsPanel() {
  const consultantsQuery = usePublicAgentsQuery({ page: 1, perPage: 10, sort: "score" });
  const consultants = consultantsQuery.data?.data ?? [];

  return (
    <section className="h-[509px] rounded-2xl bg-white p-4" aria-label="10 مشاور برتر">
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold">10 مشاور برتر</Typography>
      <div className="mt-4">
        <div className="flex h-7 items-center bg-[#edf0fb] text-sm font-normal text-[#808080] [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="w-[41px] text-center">امتیاز</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="flex-1 px-2 text-right [direction:rtl]">رتبه و نام مشاور</Typography>
        </div>
        <div className="h-px bg-[#cccccc]" aria-hidden="true" />
        {consultants.map((consultant, index) => (
          <div
            className={`flex h-10 items-center px-2 text-sm [direction:ltr] ${index % 2 === 1 ? "rounded-lg bg-[#cccccc1f]" : ""}`}
            key={consultant.id}
          >
            <Typography as="span" variant="label" size="medium" weight="medium" className="w-[41px] text-center font-medium">
              {formatOptionalNumber(consultant.score)}
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="flex-1 px-2 text-right font-normal [direction:rtl]">
              {consultant.fullName}
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="w-7 text-center font-normal [direction:ltr]">
              {formatOptionalNumber(consultant.rank)}
            </Typography>
          </div>
        ))}
        {!consultantsQuery.isPending && consultants.length === 0 ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full py-6 text-center text-[#808080]">
            اطلاعات مشاوران برتر از سرور دریافت نشده است.
          </Typography>
        ) : null}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill to="/account/ranking/badges/guide" />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">{title}</Typography>
    </div>
  );
}

function GuidePill({ to }: { to?: string } = {}) {
  const className =
    "inline-flex h-6 items-center gap-1 rounded-full bg-[#0048c414] px-2 text-xs font-medium leading-4 text-[#0048c4] no-underline [direction:ltr]";
  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">راهنما</Typography>
      <InfoIcon className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <RouteLink aria-label="راهنمای نشان‌ها" className={className} to={to}>
        {content}
      </RouteLink>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className={className}>
      {content}
    </Typography>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </svg>
  );
}

function RankIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="m12 3.5 1.5 3.1 3.4.5-2.45 2.4.58 3.4L12 11.3 8.97 12.9l.58-3.4L7.1 7.1l3.4-.5L12 3.5Z" />
      <path d="M5 20.5v-5h4v5M10 20.5v-7h4v7M15 20.5v-4h4v4M4 20.5h16" />
    </svg>
  );
}

function StarOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m12 3.5 2.65 5.37 5.93.86-4.29 4.18 1.01 5.91L12 17.04l-5.3 2.78 1.01-5.91-4.29-4.18 5.93-.86L12 3.5Z" />
    </svg>
  );
}

function SmallStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 12 12">
      <path d="m6 1.3 1.45 2.93 3.23.47-2.34 2.28.55 3.22L6 8.68 3.11 10.2l.55-3.22L1.32 4.7l3.23-.47L6 1.3Z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 16 16">
      <path d="m5 6.5 3 3 3-3" />
    </svg>
  );
}

function IndicatorIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: RankIndicator["icon"];
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {icon === "activity" ? (
        <>
          <rect height="17" rx="2" width="16" x="4" y="3.5" />
          <path d="M7.5 14h2.5l2-4 2.5 5 2-3H19" />
        </>
      ) : null}
      {icon === "like" ? (
        <path d="M9 20H5V10h4v10Zm0-9 4-7a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2l-1.5 7H9v-8Z" />
      ) : null}
      {icon === "response" ? (
        <>
          <path d="M4 5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          <circle cx="17.5" cy="7.5" fill="white" r="4" />
          <path d="M17.5 5.5v2.3l1.5.8" />
        </>
      ) : null}
      {icon === "time" ? (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5h4" />
        </>
      ) : null}
    </svg>
  );
}
