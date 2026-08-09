import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";

import { PageFrame } from "../../app/layout/PageFrame";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearClockAlarm from "../../shared/icons/LinearClockAlarm";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearLike from "../../shared/icons/LinearLike";
import LinearPercenTeam from "../../shared/icons/LinearPercenTeam";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearStar from "../../shared/icons/LinearStar";
import LinearStartup from "../../shared/icons/LinearStartup";
import { TopBar } from "../../shared/components/TopBar";
import { RouteLink } from "../../app/router/RouteLink";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import { useMyBadgesQuery } from "../../core/hooks/account.hooks";
import { useAgencyDashboardQuery } from "../../core/hooks/dashboard.hooks";
import { getActiveAuthRole, getStoredAuthSession } from "../../core/auth/auth-storage";
import { INDEPENDENT_CONSULTANT, REAL_ESTATE_CONSULTANT } from "../../shared/constants/roles.constants";
import { IndependentConsultantRankingPage } from "../account/IndependentConsultantRankingPage";
import type { BadgeItem } from "../../core/services/account.service";
import type { DashboardRankingEntity } from "../../core/services/dashboard.service";

type BadgeTone = "active" | "muted";

type AgencyBadge = {
  src?: string;
  ariaLabel: string;
  detailPath: string;
  id: string;
  label: string;
  progress: number;
  tone: BadgeTone;
};

type AgencyIndicator = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  id: string;
  label: string;
  value: string;
};

type RankingPeriod = "هفته" | "ماه";

const DASHBOARD_BADGES_PATH = "/account/dashboard/ranking/badges";
const DASHBOARD_BADGES_GUIDE_PATH = `${DASHBOARD_BADGES_PATH}/guide`;
const DASHBOARD_LEVELS_GUIDE_PATH = "/account/dashboard/ranking/levels/guide";

const badgePathBySlug: Record<string, string> = {
  "record-holder": `${DASHBOARD_BADGES_PATH}/record-holder`,
  "golden-team": `${DASHBOARD_BADGES_PATH}/golden-team`,
  popular: `${DASHBOARD_BADGES_PATH}/popular`,
  "fast-team": `${DASHBOARD_BADGES_PATH}/fast-team`,
};

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

function mapBadgeItemToBadge(item: BadgeItem, index: number): AgencyBadge {
  const progress = Number(item.progress);
  const slug = typeof item.slug === "string" ? item.slug.trim().toLowerCase() : "";
  const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : "نشان";

  return {
    ariaLabel: `نشان ${name}`,
    detailPath: badgePathBySlug[slug] ?? DASHBOARD_BADGES_GUIDE_PATH,
    id: slug || String(item.id ?? index),
    label: name,
    progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0,
    src:
      typeof item.image === "string" && item.image.trim()
        ? item.image
        : typeof item.logo === "string" && item.logo.trim()
          ? item.logo
          : undefined,
    tone: item.active === true ? "active" : "muted",
  };
}

export function DashboardRankingPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  if (activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT) {
    return <IndependentConsultantRankingPage />;
  }

  return <AgencyDashboardRankingPage />;
}

function AgencyDashboardRankingPage() {
  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const dashboardQuery = useAgencyDashboardQuery({ period: period === "هفته" ? "7d" : "30d" });
  const dashboard = dashboardQuery.data;
  const ranking = dashboard?.ranking;
  const consultantActivity = dashboard?.consultantActivity ?? [];
  const indicators: AgencyIndicator[] = [
    {
      Icon: LinearClockAlarm,
      id: "published-ads",
      label: "آگهی‌های منتشرشده",
      value: formatOptionalNumber(dashboard?.publishedAdvertises.total),
    },
    {
      Icon: LinearPercenTeam,
      id: "active-consultants",
      label: "مشاوران دارای فعالیت",
      value: dashboard ? formatOptionalNumber(consultantActivity.length) : "—",
    },
    {
      Icon: LinearLike,
      id: "renewed-ads",
      label: "بروزرسانی آگهی‌ها",
      value: dashboard
        ? formatOptionalNumber(consultantActivity.reduce((sum, item) => sum + item.renewCount, 0))
        : "—",
    },
    {
      Icon: LinearPercenTeam,
      id: "special-ads",
      label: "آگهی‌های ویژه",
      value: dashboard
        ? formatOptionalNumber(consultantActivity.reduce((sum, item) => sum + item.specialCount, 0))
        : "—",
    },
  ];

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearInfoCircle className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: DASHBOARD_BADGES_GUIDE_PATH,
          },
        ]}
        backTo="/account/dashboard"
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="نشان‌ها و رتبه"
      />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] px-4 pb-6 pt-4">
        <LevelSummaryCard
          levelTitle={ranking?.current.levelTitle || ranking?.current.levelSlug || "—"}
          score={formatOptionalNumber(ranking?.current.totalScore)}
        />
        <MetricSummaryCard
          icon={<LinearRanking className="h-6 w-6 text-[#11a366]" />}
          iconClassName="bg-[#11a3661f]"
          label="رتبه آژانس"
          value={formatOptionalNumber(ranking?.rank ?? ranking?.current.rank)}
        />
        <MetricSummaryCard
          icon={<LinearStar className="h-6 w-6 text-[#ff6d00]" />}
          iconClassName="bg-[#ff8d0029]"
          label="امتیاز آژانس"
          value={formatOptionalNumber(ranking?.current.totalScore)}
        />
        <AgencyBadgesPanel />
        <RankingIndicatorsPanel indicators={indicators} period={period} setPeriod={setPeriod} />
        <TopAgenciesPanel agencies={ranking?.topEntities ?? []} isLoading={dashboardQuery.isLoading} />
      </main>
    </PageFrame>
  );
}

function LevelSummaryCard({ levelTitle, score }: { levelTitle: string; score: string }) {
  return (
    <section
      aria-label="سطح پیشرفت آژانس"
      className="flex min-h-22 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 [direction:ltr]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex h-6 items-center justify-between gap-2 [direction:ltr]">
          <GuidePill ariaLabel="راهنمای سطح پیشرفت آژانس" to={DASHBOARD_LEVELS_GUIDE_PATH} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="truncate text-right text-sm font-semibold leading-5 text-[#4d4d4d] [direction:rtl]">
            {levelTitle}
          </Typography>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-xs leading-4 [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080] [direction:rtl]">
            امتیاز فعلی
          </Typography>
          <Typography as="span" variant="label" size="medium" weight="semibold" className="font-semibold text-[#0048c4] [direction:rtl]">{score}</Typography>
        </div>
      </div>
      <AgencyPreviewVector />
    </section>
  );
}

function AgencyPreviewVector() {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f3f4f6]">
      <LinearStartup className="h-9 w-9 text-[#4b5070]" />
    </Typography>
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
    <section
      aria-label={label}
      className="flex min-h-20 justify-between gap-3 rounded-2xl bg-white px-4 py-4 [direction:ltr]"
    >
      <strong className="w-12 shrink-0 text-left text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {value}
      </strong>
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-semibold leading-5 text-[#4d4d4d]">{label}</Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-4 text-[#808080]">
          مقایسه روزانه از سرور دریافت نشده است
        </Typography>
      </div>
      <Typography as="span" variant="body" size="medium" weight="regular" className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>
        {icon}
      </Typography>
    </section>
  );
}

function AgencyBadgesPanel() {
  const badgesQuery = useMyBadgesQuery();
  const badges = (badgesQuery.data ?? []).map(mapBadgeItemToBadge);

  return (
    <section className="rounded-2xl bg-white p-4" aria-label="نشان‌ها">
      <SectionHeader guideTo={DASHBOARD_BADGES_GUIDE_PATH} title="نشان‌ها" />
      {badgesQuery.isLoading ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-[#808080]">در حال دریافت نشان‌ها...</Typography>
      ) : null}
      {!badgesQuery.isLoading && badges.length === 0 ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full py-8 text-center text-[#808080]">نشانی از سرور دریافت نشده است.</Typography>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {badges.map((badge) => (
          <BadgeCard badge={badge} key={badge.id} />
        ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: AgencyBadge }) {
  const isActive = badge.tone === "active";
  const className = `flex h-[186px] flex-col items-center rounded-lg border border-[#f5f5f5] bg-white pt-6 text-inherit no-underline transition active:scale-[0.99] focus-visible:outline-3 focus-visible:outline-[#0048c440] ${!isActive ? "grayscale" : ""}`;

  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-[72px] w-[72px] place-items-center ${isActive ? "text-[#d69832]" : "text-[#d6d6d6]"}`}
      >
        {badge.src ? (
          <img src={badge.src} className="h-full w-full object-contain" alt="" />
        ) : (
          <LinearStar className="h-10 w-10" innerColor="currentColor" />
        )}
      </Typography>

      <Typography as="span" variant="label" size="medium" weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold leading-5 ${
          isActive ? "bg-[#0048c41f] text-[#0048c4]" : "bg-[#4d4d4d14] text-[#b8b8b8]"
        }`}
      >
        {badge.label}
      </Typography>

      <div className="mt-0.5 flex h-3 items-center justify-center [direction:ltr]">
        {[0, 1, 2].map((star) => (
          <LinearStar
            className={`h-3 w-3 ${isActive && star === 0 ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
            innerColor="currentColor"
            key={star}
          />
        ))}
      </div>

      <div className="mt-4 h-1 w-[92px] rounded-full bg-[#ff8d0029]">
        <div
          className="h-1 rounded-full bg-[#ffb100]"
          style={{ width: `${badge.progress}%` }}
        />
      </div>
    </>
  );

  if (isActive) {
    return (
      <RouteLink aria-label={badge.ariaLabel} className={className} to={badge.detailPath}>
        {content}
      </RouteLink>
    );
  }

  return (
    <Button unstyled aria-disabled="true" aria-label={badge.ariaLabel} className={className} type="button">
      {content}
    </Button>
  );
}

function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
}: {
  indicators: AgencyIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-4" aria-label="شاخص‌های رتبه‌بندی">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <Button unstyled
          className="inline-flex h-7 items-center gap-2 rounded-lg px-1 text-xs font-medium leading-4 text-[#1a1a1a] transition active:bg-[#1a1a1a0a]"
          onClick={() => setPeriod(period === "هفته" ? "ماه" : "هفته")}
          type="button"
        >
          <LinearArrowDown1 className="h-4 w-4 text-[#4d4d4d]" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">{period}</Typography>
        </Button>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">شاخص‌های رتبه‌بندی</Typography>
      </div>
      <div className="mt-6 space-y-4">
        {indicators.map((indicator) => (
          <RankIndicatorRow indicator={indicator} key={indicator.id} />
        ))}
      </div>
    </section>
  );
}

function RankIndicatorRow({ indicator }: { indicator: AgencyIndicator }) {
  const Icon = indicator.Icon;

  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-[#f5f5f5] px-4 py-3 [direction:ltr]">
      <strong className="w-12 shrink-0 text-left text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">
        {indicator.value}
      </strong>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="min-w-0 flex-1 px-2 text-right text-sm font-semibold leading-5 text-[#4d4d4d] [direction:rtl]">
        {indicator.label}
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0048c414] text-[#4b5070]">
        <Icon className="h-6 w-6" />
      </Typography>
    </div>
  );
}

function TopAgenciesPanel({ agencies, isLoading }: { agencies: DashboardRankingEntity[]; isLoading: boolean }) {
  return (
    <section className="rounded-2xl bg-white p-4" aria-label="۱۰ آژانس برتر">
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6">
        ۱۰ آژانس برتر
      </Typography>

      <div className="mt-4">
        <div className="grid h-7 grid-cols-[56px_1fr] items-center px-2 text-sm font-normal leading-5 text-[#808080] [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-center [direction:rtl]">امتیاز</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-right [direction:rtl]">۱۰ آژانس برتر</Typography>
        </div>

        <div className="h-px bg-[#cccccc]" aria-hidden="true" />

        {agencies.map((agency, index) => (
          <div
            className={`grid h-10 grid-cols-[56px_1fr] items-center rounded-lg px-2 text-sm leading-5 [direction:ltr] ${index % 2 === 1 ? "bg-[#cccccc1f]" : ""}`}
            key={agency.entityId || `${agency.name}-${index}`}
          >
            <Typography as="span" variant="label" size="medium" weight="semibold" className="text-center font-semibold [direction:rtl]">
              {formatOptionalNumber(agency.totalScore)}
            </Typography>

            <Typography as="span" variant="label" size="medium" weight="semibold" className="text-right font-semibold text-[#4d4d4d] [direction:rtl]">
              {formatOptionalNumber(agency.rank)}. {agency.name}
            </Typography>
          </div>
        ))}
        {!isLoading && agencies.length === 0 ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full py-6 text-center text-[#808080]">
            اطلاعات آژانس‌های برتر از سرور دریافت نشده است.
          </Typography>
        ) : null}
      </div>
    </section>
  );
}

function SectionHeader({ guideTo, title }: { guideTo?: string; title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill ariaLabel={`راهنمای ${title}`} to={guideTo} />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">{title}</Typography>
    </div>
  );
}

function GuidePill({ ariaLabel = "راهنما", to }: { ariaLabel?: string; to?: string }) {
  const className =
    "inline-flex h-6 items-center gap-1 rounded-full bg-[#0048c414] px-2 text-xs font-medium leading-4 text-[#0048c4] no-underline transition active:bg-[#0048c424] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:ltr]";
  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">راهنما</Typography>
      <LinearInfoCircle className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <RouteLink aria-label={ariaLabel} className={className} to={to}>
        {content}
      </RouteLink>
    );
  }

  return <Typography as="span" variant="body" size="medium" weight="regular" className={className}>{content}</Typography>;
}
