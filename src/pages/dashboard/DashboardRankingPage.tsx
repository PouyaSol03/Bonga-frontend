import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";

import { PageFrame } from "../../app/PageFrame";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearClockAlarm from "../../components/(icons)/LinearClockAlarm";
import LinearInfoCircle from "../../components/(icons)/LinearInfoCircle";
import LinearLike from "../../components/(icons)/LinearLike";
import LinearPercenTeam from "../../components/(icons)/LinearPercenTeam";
import LinearRanking from "../../components/(icons)/LinearRanking";
import LinearStar from "../../components/(icons)/LinearStar";
import LinearStartup from "../../components/(icons)/LinearStartup";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";
import LinearChartUp from "../../components/(icons)/LinearChartUp";
import { Typography } from "../../components/ui/Typography";

type BadgeTone = "active" | "muted";

type AgencyBadge = {
  src: string;
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

const DASHBOARD_BADGES_PATH = "/account/dashboard/ranking/badges";
const DASHBOARD_BADGES_GUIDE_PATH = `${DASHBOARD_BADGES_PATH}/guide`;
const DASHBOARD_LEVELS_GUIDE_PATH = "/account/dashboard/ranking/levels/guide";

const agencyBadges: AgencyBadge[] = [
  {
    src: '/vectors/badges/badge-bookmark.png',
    ariaLabel: "نشان رکورددار",
    detailPath: `${DASHBOARD_BADGES_PATH}/record-holder`,
    id: "record-holder",
    label: "رکورددار",
    progress: 78,
    tone: "muted",
  },
  {
    src: '/vectors/badges/badge-cup.png',
    ariaLabel: "نشان تیم طلایی",
    detailPath: `${DASHBOARD_BADGES_PATH}/golden-team`,
    id: "golden-team",
    label: "تیم طلایی",
    progress: 69,
    tone: "active",
  },
  {
    src: '/vectors/badges/badge-first.png',
    ariaLabel: "نشان محبوب‌ترین",
    detailPath: `${DASHBOARD_BADGES_PATH}/popular`,
    id: "popular",
    label: "محبوب‌ترین",
    progress: 65,
    tone: "muted",
  },
  {
    src: '/vectors/badges/badge-chat.png',
    ariaLabel: "نشان تیم پرسرعت",
    detailPath: `${DASHBOARD_BADGES_PATH}/fast-team`,
    id: "fast-team",
    label: "تیم پرسرعت",
    progress: 100,
    tone: "muted",
  },
];

const agencyIndicators: AgencyIndicator[] = [
  {
    Icon: LinearClockAlarm,
    id: "active-days",
    label: "روزهای فعال در سامانه",
    value: "۸۵٪",
  },
  {
    Icon: LinearPercenTeam,
    id: "active-consultants",
    label: "درصد مشاوران فعال",
    value: "۵",
  },
  {
    Icon: LinearLike,
    id: "successful-deals",
    label: "تعداد معاملات موفق",
    value: "۱۵",
  },
  {
    Icon: LinearPercenTeam,
    id: "consultant-average-score",
    label: "میانگین امتیازات مشاوران",
    value: "۴.۶",
  },
];

const topAgencies = [
  { name: "املاک محسنیان", score: "۵" },
  { name: "املاک ایوان", score: "۴.۹" },
  { name: "املاک تمدن", score: "۴.۸" },
  { name: "املاک کوشش", score: "۴.۵" },
  { name: "املاک محسنیان", score: "۴.۴" },
  { name: "املاک محسنیان", score: "۵" },
  { name: "املاک ایوان", score: "۴.۹" },
  { name: "املاک تمدن", score: "۴.۸" },
  { name: "املاک کوشش", score: "۴.۵" },
  { name: "املاک محسنیان", score: "۴.۴" },
];

export function DashboardRankingPage() {
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
        <LevelSummaryCard />
        <MetricSummaryCard
          icon={<LinearRanking className="h-6 w-6 text-[#11a366]" />}
          iconClassName="bg-[#11a3661f]"
          label="رتبه آژانس"
          trend="up"
          trendText="۳ رتبه"
          value="۵"
        />
        <MetricSummaryCard
          icon={<LinearStar className="h-6 w-6 text-[#ff6d00]" />}
          iconClassName="bg-[#ff8d0029]"
          label="امتیاز آژانس"
          trend="down"
          trendText="۱۵ امتیاز"
          value="۸۵"
        />
        <AgencyBadgesPanel />
        <RankingIndicatorsPanel />
        <TopAgenciesPanel />
      </main>
    </PageFrame>
  );
}

function LevelSummaryCard() {
  return (
    <section
      aria-label="سطح پیشرفت آژانس"
      className="flex min-h-22 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 [direction:ltr]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex h-6 items-center justify-between gap-2 [direction:ltr]">
          <GuidePill ariaLabel="راهنمای سطح پیشرفت آژانس" to={DASHBOARD_LEVELS_GUIDE_PATH} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="truncate text-right text-sm font-semibold leading-5 text-[#4d4d4d] [direction:rtl]">
            آژانس برتر منطقه‌ای
          </Typography>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-xs leading-4 [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080] [direction:rtl]">
            تا رسیدن به آژانس افسانه‌ای
          </Typography>
          <Typography as="span" variant="label" size="medium" weight="semibold" className="font-semibold text-[#0048c4] [direction:rtl]">۶ امتیاز</Typography>
        </div>
      </div>
      <AgencyPreviewVector />
    </section>
  );
}

function AgencyPreviewVector() {
  const [hasError, setHasError] = useState(false);

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg">
      {!hasError ? (
        <img
          alt=""
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
          src="/vectors/agencyLevel/newbie.svg"
        />
      ) : (
        <LinearStartup className="h-9 w-9 text-[#4b5070]" />
      )}
    </Typography>
  );
}

function MetricSummaryCard({
  icon,
  iconClassName,
  label,
  trend,
  trendText,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  trend: "down" | "up";
  trendText: string;
  value: string;
}) {
  const isUp = trend === "up";

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
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 flex items-center gap-1 text-xs leading-4 text-[#808080]">
          <Typography as="span" variant="label" size="medium" weight="semibold" className={`inline-flex items-center font-semibold ${isUp ? "text-[#11a366]" : "text-[#ee3623]"}`}>
            <LinearChartUp className="h-4 w-4" />
            {trendText}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">نسبت به روز قبل</Typography>
        </Typography>
      </div>
      <Typography as="span" variant="body" size="medium" weight="regular" className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>
        {icon}
      </Typography>
    </section>
  );
}

function AgencyBadgesPanel() {
  return (
    <section className="rounded-2xl bg-white p-4" aria-label="نشان‌ها">
      <SectionHeader guideTo={DASHBOARD_BADGES_GUIDE_PATH} title="نشان‌ها" />
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {agencyBadges.map((badge) => (
          <BadgeCard badge={badge} key={badge.id} />
        ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: AgencyBadge }) {
  const isActive = badge.tone === "active";
  const Icon = badge.src;
  const className = `flex h-[186px] flex-col items-center rounded-lg border border-[#f5f5f5] bg-white pt-6 text-inherit no-underline transition active:scale-[0.99] focus-visible:outline-3 focus-visible:outline-[#0048c440] ${!isActive ? "grayscale" : ""}`;

  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-[72px] w-[72px] place-items-center ${isActive ? "text-[#d69832]" : "text-[#d6d6d6]"}`}
      >
        <img src={Icon} className="h-full w-full" alt="" />
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
    <button aria-disabled="true" aria-label={badge.ariaLabel} className={className} type="button">
      {content}
    </button>
  );
}

function RankingIndicatorsPanel() {
  const [period, setPeriod] = useState<"هفته" | "ماه">("هفته");

  return (
    <section className="rounded-2xl bg-white p-4" aria-label="شاخص‌های رتبه‌بندی">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <button
          className="inline-flex h-7 items-center gap-2 rounded-lg px-1 text-xs font-medium leading-4 text-[#1a1a1a] transition active:bg-[#1a1a1a0a]"
          onClick={() => setPeriod((current) => (current === "هفته" ? "ماه" : "هفته"))}
          type="button"
        >
          <LinearArrowDown1 className="h-4 w-4 text-[#4d4d4d]" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">{period}</Typography>
        </button>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 [direction:rtl]">شاخص‌های رتبه‌بندی</Typography>
      </div>
      <div className="mt-6 space-y-4">
        {agencyIndicators.map((indicator) => (
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

function TopAgenciesPanel() {
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

        {topAgencies.map((agency, index) => (
          <div
            className={`grid h-10 grid-cols-[56px_1fr] items-center rounded-lg px-2 text-sm leading-5 [direction:ltr] ${index % 2 === 1 ? "bg-[#cccccc1f]" : ""
              }`}
            key={`${agency.name}-${index}`}
          >
            <Typography as="span" variant="label" size="medium" weight="semibold" className="text-center font-semibold [direction:rtl]">
              {agency.score}
            </Typography>

            <Typography as="span" variant="label" size="medium" weight="semibold" className="text-right font-semibold text-[#4d4d4d] [direction:rtl]">
              {index + 1}. {agency.name}
            </Typography>
          </div>
        ))}
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