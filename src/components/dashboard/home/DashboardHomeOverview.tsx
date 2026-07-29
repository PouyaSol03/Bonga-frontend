import { useEffect, useRef, useState } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LinearAd from "../../(icons)/LinearAd";
import LinearCalendar from "../../(icons)/LinearCalendar";
import LinearChartUp from "../../(icons)/LinearChartUp";
import LinearClock from "../../(icons)/LinearClock";
import LinearRanking from "../../(icons)/LinearRanking";
import LinearStar from "../../(icons)/LinearStar";
import LinearStartup from "../../(icons)/LinearStartup";
import type {
  DashboardKind,
  DashboardOverview,
} from "../../../services/dashboard.service";
import {
  adTypeData,
  consultantActivityData,
  dashboardMetrics,
  type DashboardConsultantDatum,
  type DashboardMetric,
  type DashboardMetricTone,
} from "./dashboardHomeData";
import { Typography } from "../../ui/Typography";

const numberFormatter = new Intl.NumberFormat("fa-IR");

const metricIcons: Record<
  DashboardMetric["icon"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  ad: LinearAd,
  calendar: LinearCalendar,
  chart: LinearChartUp,
  startup: LinearStartup,
};

const toneClasses: Record<
  DashboardMetricTone,
  { bg: string; icon: string; ring: string }
> = {
  amber: {
    bg: "bg-[#ffead3]",
    icon: "text-[#ff6b1a]",
    ring: "ring-[#ffead3]",
  },
  blue: {
    bg: "bg-[#d9defb]",
    icon: "text-[#0048c4]",
    ring: "ring-[#d9defb]",
  },
  green: {
    bg: "bg-[#d7f5e9]",
    icon: "text-[#11a366]",
    ring: "ring-[#d7f5e9]",
  },
  neutral: {
    bg: "bg-[#e7e9f2]",
    icon: "text-[#334466]",
    ring: "ring-[#e7e9f2]",
  },
};

const trendClasses = {
  negative: "text-[#c11004]",
  neutral: "text-[#808080]",
  positive: "text-[#11a366]",
};

const chartNameMap: Record<string, string> = {
  ads: "آگهی",
  renewals: "بروزرسانی",
  requests: "درخواست",
  specials: "ویژه",
};

type ConsultantBarKey = "ads" | "renewals" | "specials";

type SelectedConsultantBar = {
  dataKey: ConsultantBarKey;
  name: string;
} | null;

const consultantChartItemWidth = 82;
const consultantChartAxisWidth = 38;
const consultantVisibleItems = 4;
const consultantChartViewportWidth =
  consultantVisibleItems * consultantChartItemWidth + consultantChartAxisWidth;

const progressChartMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const progressChartMonthWidth = 34;
const progressChartAxisWidth = 28;
const progressChartVisibleMonths = 9;
const progressChartViewportWidth =
  progressChartAxisWidth + progressChartVisibleMonths * progressChartMonthWidth;
const progressChartWidth =
  progressChartAxisWidth + progressChartMonths.length * progressChartMonthWidth;

const agencyRankingRows = [
  { name: "املاک محسنیان", rank: 1, score: 90 },
  { name: "املاک ایوان", rank: 2, score: 89 },
  { name: "املاک تمدن", rank: 3, score: 86 },
  { name: "املاک کوشش", rank: 4, score: 85 },
  { name: "املاک محسنیان", rank: 5, score: 82 },
];

function formatNumber(value: number | string) {
  return numberFormatter.format(Number(value));
}

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : formatNumber(value);
}

function getDeltaMetricContent(
  delta: DashboardOverview["balanceDeltas"]["adCreditUsed"] | undefined,
  isLoading: boolean,
): Pick<DashboardMetric, "description" | "trend" | "trendTone"> {
  if (isLoading) {
    return {
      description: "در حال دریافت اطلاعات",
      trend: "",
      trendTone: "neutral" as const,
    };
  }

  if (!delta || delta.percent === null) {
    return {
      description: "داده‌ای برای مقایسه دوره قبل نیست",
      trend: "",
      trendTone: "neutral" as const,
    };
  }

  const percent = delta.percent;
  const trendTone: DashboardMetric["trendTone"] =
    percent > 0 ? "positive" : percent < 0 ? "negative" : "neutral";
  const description =
    percent > 0
      ? "افزایش استفاده نسبت به دوره قبل"
      : percent < 0
        ? "کاهش استفاده نسبت به دوره قبل"
        : "بدون تغییر نسبت به دوره قبل";

  return {
    description,
    trend: `${formatNumber(Math.abs(percent))}٪`,
    trendTone,
  };
}

function getManagerDashboardMetrics(
  dashboard: DashboardOverview | undefined,
  isLoading: boolean,
): DashboardMetric[] {
  const adDelta = getDeltaMetricContent(
    dashboard?.balanceDeltas.adCreditUsed,
    isLoading,
  );
  const renewDelta = getDeltaMetricContent(
    dashboard?.balanceDeltas.renewCreditUsed,
    isLoading,
  );
  const specialDelta = getDeltaMetricContent(
    dashboard?.balanceDeltas.specialCreditUsed,
    isLoading,
  );
  return [
    {
      ...adDelta,
      icon: "ad",
      id: "ad-credit",
      title: "مانده اعتبار آگهی",
      tone: "blue",
      value: dashboard
        ? formatNumber(dashboard.balances.adCreditBalance)
        : "—",
    },
    {
      ...renewDelta,
      icon: "chart",
      id: "renew-credit",
      title: "مانده بروزرسانی",
      tone: "green",
      value: dashboard
        ? formatNumber(dashboard.balances.renewCreditBalance)
        : "—",
    },
    {
      ...specialDelta,
      icon: "startup",
      id: "special-credit",
      title: "مانده ویژه",
      tone: "amber",
      value: dashboard
        ? formatNumber(dashboard.balances.specialCreditBalance)
        : "—",
    },
    {
      description: isLoading
        ? "در حال دریافت اطلاعات"
        : dashboard
          ? "تا پایان اعتبار پنل"
          : "اطلاعات اعتبار پنل در دسترس نیست",
      descriptionIcon: "clock",
      icon: "calendar",
      id: "panel-credit",
      title: "روز تا پایان اعتبار",
      tone: "neutral",
      trend: "",
      trendTone: "neutral",
      value: dashboard
        ? `${formatNumber(dashboard.balances.panelDaysRemaining)} روز`
        : "—",
    },
  ];
}

type DashboardHomeOverviewProps = {
  dashboard?: DashboardOverview;
  dashboardKind?: DashboardKind;
  dashboardError?: string | null;
  isDashboardLoading?: boolean;
  useDashboardApi?: boolean;
};

export function DashboardHomeOverview({
  dashboard,
  dashboardError = null,
  dashboardKind: _dashboardKind,
  isDashboardLoading = false,
  useDashboardApi = false,
}: DashboardHomeOverviewProps) {
  if (useDashboardApi && isDashboardLoading && !dashboard) {
    return <DashboardHomeOverviewSkeleton />;
  }

  const metrics = useDashboardApi
    ? getManagerDashboardMetrics(dashboard, isDashboardLoading)
    : dashboardMetrics;

  return (
    <div className="grid min-w-0 gap-4 overflow-x-hidden bg-[#f0f0f0] p-4">
      {dashboardError ? (
        <div
          className="rounded-xl border border-[#f3c5c1] bg-[#fff3f2] px-4 py-3 text-sm text-[#c11004]"
          role="alert"
        >
          {dashboardError}
        </div>
      ) : null}

      <section className="grid gap-4">
        {metrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4">
        <ConsultantActivityCard
          dashboard={dashboard}
          isLoading={isDashboardLoading}
          useApiData={useDashboardApi}
        />
        <PublishedAgencyAdsCard />
      </section>

      <section className="grid gap-4">
        <div className="grid gap-4">
          <ProgressLineChartCard
            title="نمودار پیشرفت ثبت آگهی"
            tooltip="۸۰ آگهی"
            trendLabel="افزایش ثبت"
            trendTone="positive"
            trendValue="۵۸٪"
          />
          <ProgressLineChartCard
            title="نمودار پیشرفت رتبه"
            tooltip="۱۲"
            trendLabel="کاهش پیشرفت"
            trendTone="negative"
            trendValue="۲۳٪"
          />
          <AgencyRankingScoreCard
            dashboard={dashboard}
            isLoading={isDashboardLoading}
            useApiData={useDashboardApi}
          />
        </div>
      </section>
    </div>
  );
}

function DashboardSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#e8e8e8] ${className}`} />;
}

function DashboardHomeOverviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="در حال دریافت اطلاعات داشبورد"
      className="grid min-w-0 gap-4 overflow-x-hidden bg-[#f0f0f0] p-4"
      role="status"
    >
      <section className="grid gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="rounded-2xl bg-white p-4" key={index}>
            <div className="flex items-start gap-3">
              <DashboardSkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-3 pt-1">
                <DashboardSkeletonBlock className="ml-auto h-4 w-28" />
                <DashboardSkeletonBlock className="ml-auto h-7 w-16" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#f0f0f0] pt-4">
              <DashboardSkeletonBlock className="h-4 w-32" />
              <DashboardSkeletonBlock className="h-4 w-12" />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <DashboardChartSkeleton chartClassName="h-[240px]" />
        <DashboardChartSkeleton chartClassName="mx-auto h-[180px] w-[180px] rounded-full" />
      </section>

      <section className="grid gap-4">
        <DashboardChartSkeleton chartClassName="h-[220px]" />
        <DashboardChartSkeleton chartClassName="h-[220px]" />
        <article className="rounded-2xl bg-white p-4">
          <DashboardSkeletonBlock className="ml-auto h-5 w-36" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <DashboardSkeletonBlock className="h-20 w-full rounded-xl" />
            <DashboardSkeletonBlock className="h-20 w-full rounded-xl" />
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <DashboardSkeletonBlock className="h-10 w-full rounded-xl" key={index} />
            ))}
          </div>
        </article>
      </section>

      <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">در حال دریافت اطلاعات داشبورد...</Typography>
    </div>
  );
}

function DashboardChartSkeleton({ chartClassName }: { chartClassName: string }) {
  return (
    <article className="rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between">
        <DashboardSkeletonBlock className="h-5 w-36" />
        <DashboardSkeletonBlock className="h-7 w-16" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <DashboardSkeletonBlock className="h-6 w-12" />
        <DashboardSkeletonBlock className="h-4 w-28" />
      </div>
      <DashboardSkeletonBlock className={`mt-7 ${chartClassName}`} />
    </article>
  );
}

function AgencyRankingScoreCard({
  dashboard,
  isLoading,
  useApiData,
}: {
  dashboard?: DashboardOverview;
  isLoading: boolean;
  useApiData: boolean;
}) {
  const rank = useApiData
    ? dashboard?.ranking.rank ?? dashboard?.ranking.current.rank
    : 67;
  const score = useApiData ? dashboard?.ranking.current.totalScore : 85;
  const rankingRows = useApiData
    ? dashboard?.ranking.topEntities ?? []
    : agencyRankingRows.map((agency) => ({
        entityId: String(agency.rank),
        levelSlug: "",
        levelTitle: "",
        name: agency.name,
        rank: agency.rank,
        totalScore: agency.score,
      }));

  return (
    <article className="rounded-2xl bg-white p-4">
      <Typography as="h2" variant="headline" size="large" className="m-0 text-right font-semibold text-[#1a1a1a]">
        رتبه و امتیاز آژانس
      </Typography>

      <div className="mt-5 grid grid-cols-2 gap-4 items-center" dir="rtl">
        <AgencyRankMetric
          icon={<LinearRanking className="h-5 w-5" />}
          label="رتبه"
          value={isLoading && useApiData ? "—" : formatOptionalNumber(rank)}
        />
        <AgencyRankMetric
          icon={<LinearStar className="h-5 w-5" />}
          label="امتیاز"
          value={isLoading && useApiData ? "—" : formatOptionalNumber(score)}
        />
      </div>

      <div className="mt-5 grid gap-2">
        <div className="flex justify-between items-center text-[#4D4D4D] px-2">
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium">۱۰ آژانس برتر</Typography>
          <Typography as="span" variant="body" size="small" weight="regular" className="text-xs">امتیاز</Typography>
        </div>

        <div className="w-[95%] bg-[#CCCCCC] h-px mx-auto" />

        {rankingRows.map((agency, index) => (
          <div
            className="flex p-2 items-center justify-between rounded-xl bg-transparent odd:bg-[#CCCCCC1F] px-3 text-sm font-semibold leading-6"
            key={agency.entityId || `${agency.rank}-${agency.name}-${index}`}
          >
            <Typography as="span" variant="body" size="medium" weight="regular" className="w-fit text-right text-[#1a1a1a]">
              {formatOptionalNumber(agency.rank)}. {agency.name}
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="w-fit text-sm text-[#11a366]">
              {formatNumber(agency.totalScore)}
            </Typography>
          </div>
        ))}

        {useApiData && !isLoading && rankingRows.length === 0 ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 py-4 text-center text-sm text-[#808080]">
            اطلاعاتی برای آژانس‌های برتر ثبت نشده است.
          </Typography>
        ) : null}
      </div>
    </article>
  );
}

function AgencyRankMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex p-4 items-center justify-between gap-2 rounded-2xl bg-[#f7f7f7] px-4">
      <Typography as="span" variant="label" size="medium" weight="medium" className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium leading-5 text-[#1a1a1a]">
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">{icon}</Typography>
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium">{label}</Typography>
      </Typography>
      <strong className="font-semibold leading-7 text-[#11a366]">
        {value}
      </strong>
    </div>
  );
}

export function ProgressLineChartCard({
  title,
  tooltip,
  trendLabel,
  trendTone,
  trendValue,
}: {
  title: string;
  tooltip: string;
  trendLabel: string;
  trendTone: "negative" | "positive";
  trendValue: string;
}) {
  const trendClassName =
    trendTone === "positive" ? "text-[#11a366]" : "text-[#ee3623]";

  return (
    <article className="overflow-hidden rounded-2xl bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="text-right">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-8 text-[#1a1a1a]">
            {title}
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="medium"
            className={`m-0 inline-flex items-center justify-end gap-1 text-sm font-medium leading-6 ${trendClassName}`}
          >
            <LinearChartUp
              className={`h-6 w-6 ${trendTone === "negative" ? "scale-y-[-1]" : ""}`}
            />
            <strong className="font-semibold">{trendValue}</strong>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080] text-sm font-normal">{trendLabel}</Typography>
          </Typography>
        </div>
        <button
          className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 bg-transparent hover:bg-[#f5f7fb] transition"
          type="button"
        >
          در سال
          <svg
            className="h-4 w-4 text-[#4d4d4d]"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <ScrollableProgressLineChart tooltip={tooltip} />
    </article>
  );
}

const progressChartHeight = 252;
const progressChartMonthGuideY = 187;

const progressData = [
  { month: "فروردین", value: 35 },
  { month: "اردیبهشت", value: 54 },
  { month: "خرداد", value: 43 },
  { month: "تیر", value: 76 },
  { month: "مرداد", value: 58 },
  { month: "شهریور", value: 60 },
  { month: "مهر", value: 45 },
  { month: "آبان", value: 80 },
  { month: "آذر", value: 78 },
  { month: "دی", value: 81 },
  { month: "بهمن", value: 68 },
  { month: "اسفند", value: 82 },
];

function ScrollableProgressLineChart({ tooltip }: { tooltip: string }) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
    <div
      className="mx-auto mt-7 max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none [&_.recharts-surface_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-surface]:[user-select:none] [&_.recharts-surface:focus]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper:focus]:outline-none"
      dir="ltr"
      style={{ width: progressChartViewportWidth }}
    >
      <div style={{ width: progressChartWidth }}>
        <LineChart
          width={progressChartWidth}
          height={progressChartHeight}
          data={progressData}
          margin={{ top: 58, right: 10, bottom: 10, left: -20 }}
          tabIndex={-1}
        >
          <CartesianGrid
            horizontal
            vertical={false}
            stroke="#d9d9d9"
            strokeDasharray="4 5"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            interval={0}
            height={74}
            tick={<ProgressMonthTick />}
          />

          <YAxis
            domain={[20, 100]}
            ticks={[20, 40, 60, 80, 100]}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#808080",
              fontSize: 10,
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#0048c4"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={(props) => (
              <ProgressChartDot
                {...props}
                selectedMonth={selectedMonth}
                tooltip={tooltip}
                onSelect={setSelectedMonth}
              />
            )}
            activeDot={false}
            animationDuration={450}
            animationEasing="ease-in-out"
            isAnimationActive
          />
        </LineChart>
      </div>
    </div>
  );
}
function ProgressChartDot(props: any) {
  const { cx, cy, payload, selectedMonth, tooltip, onSelect } = props;

  const isSelected = selectedMonth === payload.month;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="transparent"
        tabIndex={-1}
        focusable="false"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(payload.month)}
        style={{ cursor: "pointer", outline: "none" }}
      />

      {isSelected && (
        <>
          <line
            x1={cx}
            y1={cy + 7}
            x2={cx}
            y2={progressChartMonthGuideY}
            stroke="#0048c4"
            strokeDasharray="5 4"
          />

          <path
            d={`M${cx - 26} ${cy - 46}
              a8 8 0 0 1 8-8
              h36
              a8 8 0 0 1 8 8
              v14
              a8 8 0 0 1-8 8
              h-11
              l-7 7
              l-7-7
              h-11
              a8 8 0 0 1-8-8
              v-14Z`}
            fill="#4d4d4d"
          />

          <text
            x={cx}
            y={cy - 35}
            fill="#ffffff"
            fontSize="11"
            textAnchor="middle"
          >
            {tooltip}
          </text>
        </>
      )}

      <circle
        cx={cx}
        cy={cy}
        r={isSelected ? 6 : 5}
        fill={isSelected ? "#0048c4" : "#ffffff"}
        stroke="#0048c4"
        strokeWidth="2"
        tabIndex={-1}
        focusable="false"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(payload.month)}
        style={{
          cursor: "pointer",
          outline: "none",
          transition: "fill 180ms ease, r 180ms ease, stroke-width 180ms ease",
        }}
      />
    </g>
  );
}

function ProgressMonthTick(props: any) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x}, ${y + 28})`}>
      <text
        fill="#4d4d4d"
        fontSize="12"
        fontWeight="500"
        textAnchor="start"
        dominantBaseline="middle"
        transform="rotate(90)"
      >
        {payload.value}
      </text>
    </g>
  );
}

function PublishedAgencyAdsCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pieContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedEntry = selectedIndex === null ? null : adTypeData[selectedIndex];
  const selectedGeometry =
    selectedIndex === null
      ? null
      : getDashboardPieSelectionGeometry(adTypeData, selectedIndex);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      const container = pieContainerRef.current;

      if (!container?.contains(event.target as Node)) {
        setSelectedIndex(null);
        return;
      }

      const rect = container.getBoundingClientRect();
      const scaleX = dashboardPieChartSize / rect.width;
      const scaleY = dashboardPieChartSize / rect.height;
      const pointerX = (event.clientX - rect.left) * scaleX;
      const pointerY = (event.clientY - rect.top) * scaleY;
      const distanceFromCenter = Math.hypot(
        pointerX - dashboardPieCenter,
        pointerY - dashboardPieCenter,
      );

      if (
        distanceFromCenter >
        dashboardPieOuterRadius + dashboardPieSelectedOffset + 12
      ) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedIndex]);

  return (
    <article className="rounded-2xl bg-white p-4">
      <div className="mb-7 grid gap-3">
        <div className="flex items-center justify-between">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
            آگهی منتشر شده در آژانس
          </Typography>
          <button
            className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 bg-transparent hover:bg-[#f5f7fb] transition"
            type="button"
          >
            <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium text-[#1a1a1a]">در ماه</Typography>
            <svg
              className="h-4 w-4 text-[#4d4d4d]"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Typography as="span" variant="label" size="large" weight="semibold" className="rounded px-2 py-0.5 text-base font-semibold leading-6 text-[#0048c4]">
            ۱۸۳
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal text-[#4d4d4d]">
            آگهی ثبت شده
          </Typography>
        </div>
      </div>

      <div
        className="relative mx-auto h-[180px] max-w-[180px]"
        dir="ltr"
        ref={pieContainerRef}
      >
        {selectedEntry && selectedGeometry ? (
          <>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
              viewBox={`0 0 ${dashboardPieChartSize} ${dashboardPieChartSize}`}
            >
              <line
                x1={selectedGeometry.lineStartX}
                y1={selectedGeometry.lineStartY}
                x2={selectedGeometry.lineEndX}
                y2={selectedGeometry.lineEndY}
                stroke="#1a1a1a"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
              <circle
                cx={selectedGeometry.dotX}
                cy={selectedGeometry.dotY}
                fill="#1a1a1a"
                r="6"
              />
            </svg>
            <div
              className="absolute z-20 grid place-items-center rounded-lg bg-[#333333] text-center text-xs font-semibold leading-4 text-white shadow-[0_8px_18px_rgba(26,26,26,0.18)]"
              style={{
                height: dashboardPieTooltipHeight,
                left: selectedGeometry.tooltipLeft,
                top: selectedGeometry.tooltipTop,
                width: dashboardPieTooltipWidth,
              }}
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                {selectedEntry.name}
                <br />
                {formatNumber(selectedEntry.value)}٪
              </Typography>
            </div>
          </>
        ) : null}

        <ResponsiveContainer height="100%" width="100%">
          <PieChart className="outline-none [&_*:focus]:outline-none" tabIndex={-1}>
            <Pie
              data={adTypeData}
              dataKey="value"
              endAngle={dashboardPieEndAngle}
              isAnimationActive={false}
              nameKey="name"
              outerRadius={dashboardPieOuterRadius}
              startAngle={dashboardPieStartAngle}
              stroke="none"
            >
              {adTypeData.map((entry, index) => (
                <Cell
                  className="cursor-pointer outline-none"
                  fill={selectedIndex === index ? "transparent" : entry.color}
                  key={entry.name}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </Pie>
            {selectedIndex !== null ? (
              <DashboardPulledPieSlice
                color={adTypeData[selectedIndex].color}
                data={adTypeData}
                selectedIndex={selectedIndex}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 flex justify-center px-1">
        {adTypeData.map((item) => (
          <PublishedAdsLegendItem
            color={item.color}
            key={item.name}
            label={item.name}
            value={`${formatNumber(item.value)}٪`}
          />
        ))}
      </div>
    </article>
  );
}

type DashboardPieSelectionDatum = {
  value: number;
};

const dashboardPieChartSize = 180;
const dashboardPieCenter = dashboardPieChartSize / 2;
const dashboardPieOuterRadius = 70;
const dashboardPieSelectedOffset = 8;
const dashboardPieStartAngle = 88;
const dashboardPieEndAngle = -272;
const dashboardPieTooltipWidth = 76;
const dashboardPieTooltipHeight = 48;
const dashboardPieTooltipGap = 20;
const dashboardPieTooltipLineOverlap = 6;

function getDashboardPieSelectionGeometry(
  data: DashboardPieSelectionDatum[],
  selectedIndex: number,
) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const precedingValue = data
    .slice(0, selectedIndex)
    .reduce((sum, item) => sum + item.value, 0);
  const selectedValue = data[selectedIndex]?.value ?? 0;
  const startAngle =
    dashboardPieStartAngle - (precedingValue / total) * 360;
  const midAngle = startAngle - (selectedValue / total) * 180;
  const radians = (Math.PI / 180) * midAngle;
  const selectedCenterX =
    dashboardPieCenter + dashboardPieSelectedOffset * Math.cos(radians);
  const selectedCenterY =
    dashboardPieCenter - dashboardPieSelectedOffset * Math.sin(radians);
  const pointAt = (radius: number) => ({
    x: selectedCenterX + radius * Math.cos(radians),
    y: selectedCenterY - radius * Math.sin(radians),
  });
  const dot = pointAt(36);
  const isLeft = dot.x < dashboardPieCenter;
  const isTop = dot.y < dashboardPieCenter;
  const tooltipLeft = isLeft
    ? dot.x - dashboardPieTooltipWidth - dashboardPieTooltipGap
    : dot.x + dashboardPieTooltipGap;
  const tooltipTop = isTop
    ? dot.y - dashboardPieTooltipHeight - dashboardPieTooltipGap
    : dot.y + dashboardPieTooltipGap;
  const lineEndX = isLeft
    ? tooltipLeft + dashboardPieTooltipWidth - dashboardPieTooltipLineOverlap
    : tooltipLeft + dashboardPieTooltipLineOverlap;
  const lineEndY = isTop
    ? tooltipTop + dashboardPieTooltipHeight - dashboardPieTooltipLineOverlap
    : tooltipTop + dashboardPieTooltipLineOverlap;

  return {
    dotX: dot.x,
    dotY: dot.y,
    endAngle: startAngle - (selectedValue / total) * 360,
    lineEndX,
    lineEndY,
    lineStartX: dot.x,
    lineStartY: dot.y,
    midAngle,
    startAngle,
    tooltipLeft,
    tooltipTop,
  };
}

function DashboardPulledPieSlice({
  color,
  data,
  selectedIndex,
}: {
  color: string;
  data: DashboardPieSelectionDatum[];
  selectedIndex: number;
}) {
  const geometry = getDashboardPieSelectionGeometry(data, selectedIndex);
  const radians = (Math.PI / 180) * geometry.midAngle;
  const cx =
    dashboardPieCenter + dashboardPieSelectedOffset * Math.cos(radians);
  const cy =
    dashboardPieCenter - dashboardPieSelectedOffset * Math.sin(radians);

  return (
    <Sector
      cx={cx}
      cy={cy}
      endAngle={geometry.endAngle}
      fill={color}
      innerRadius={0}
      outerRadius={dashboardPieOuterRadius}
      startAngle={geometry.startAngle}
      stroke="none"
    />
  );
}

function ConsultantBarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const label = chartNameMap[String(item.dataKey)] ?? item.name;

  return (
    <div className="rounded-lg bg-[#595959] px-2.5 py-2 text-center text-xs font-bold leading-4 text-white shadow-none [direction:rtl]">
      {formatNumber(String(item.value))} {label}
    </div>
  );
}

function topRoundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height);
  const right = x + width;
  const bottom = y + height;

  return [
    `M${x} ${bottom}`,
    `V${y + safeRadius}`,
    `Q${x} ${y} ${x + safeRadius} ${y}`,
    `H${right - safeRadius}`,
    `Q${right} ${y} ${right} ${y + safeRadius}`,
    `V${bottom}`,
    "Z",
  ].join(" ");
}

function ConsultantBarShape(props: any) {
  const {
    fill,
    height,
    payload,
    selectedBar,
    seriesKey,
    value,
    width,
    x,
    y,
    onSelect,
  } = props;

  const isSelected =
    selectedBar?.name === payload.name && selectedBar?.dataKey === seriesKey;
  const centerX = x + width / 2;
  const tooltipY = Math.max(2, y - 38);
  const label = chartNameMap[seriesKey] ?? seriesKey;
  const tooltipText = `${formatNumber(String(value))} ${label}`;

  function selectBar(event: React.MouseEvent<SVGElement>) {
    event.preventDefault();
    onSelect({ dataKey: seriesKey, name: payload.name });
  }

  return (
    <g
      onClick={selectBar}
      onMouseDown={(event) => event.preventDefault()}
      style={{ cursor: "pointer", outline: "none" }}
      tabIndex={-1}
      focusable="false"
    >
      {isSelected ? (
        <g pointerEvents="none">
          <path
            d={`M${centerX - 34} ${tooltipY}
              a8 8 0 0 1 8-8
              h52
              a8 8 0 0 1 8 8
              v14
              a8 8 0 0 1-8 8
              h-19
              l-7 7
              l-7-7
              h-19
              a8 8 0 0 1-8-8
              v-14Z`}
            fill="#595959"
          />
          <text
            x={centerX}
            y={tooltipY + 13}
            fill="#ffffff"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            {tooltipText}
          </text>
        </g>
      ) : null}

      <path
        d={topRoundedBarPath(x, y, width, height, 6)}
        fill={fill}
        tabIndex={-1}
        focusable="false"
        style={{ outline: "none" }}
      />
    </g>
  );
}

function ConsultantActivityCard({
  dashboard,
  isLoading,
  useApiData,
}: {
  dashboard?: DashboardOverview;
  isLoading: boolean;
  useApiData: boolean;
}) {
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const [selectedBar, setSelectedBar] = useState<SelectedConsultantBar>(null);
  const chartData: DashboardConsultantDatum[] = useApiData
    ? (dashboard?.consultantActivity ?? []).map((consultant) => ({
        ads: consultant.advertiseCount,
        name: consultant.name,
        renewals: consultant.renewCount,
        specials: consultant.specialCount,
      }))
    : consultantActivityData;
  const registeredAds = useApiData
    ? (dashboard?.consultantActivity ?? []).reduce(
        (total, consultant) => total + consultant.advertiseCount,
        0,
      )
    : 325;
  const consultantChartWidth =
    Math.max(chartData.length, consultantVisibleItems) *
      consultantChartItemWidth +
    consultantChartAxisWidth;

  function scrollConsultantChart(direction: "next" | "previous") {
    chartScrollRef.current?.scrollBy({
      behavior: "smooth",
      left:
        direction === "next"
          ? consultantChartItemWidth
          : -consultantChartItemWidth,
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white p-4">
      <div className="mb-7 grid gap-2">
        <div className="flex items-center justify-between">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
            فعالیت مشاورین
          </Typography>
          <button
            className="flex h-7 items-center gap-1 rounded-lg px-2 py-1 bg-transparent hover:bg-[#f5f7fb] transition"
            type="button"
          >
            <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium text-[#1a1a1a]">در ماه</Typography>
            <svg
              className="h-4 w-4 text-[#4d4d4d]"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9l-7 7-7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Typography as="span" variant="label" size="large" weight="semibold" className="rounded px-2 py-0.5 text-base font-semibold leading-6 text-[#0048c4]">
            {isLoading && useApiData ? "—" : formatNumber(registeredAds)}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal text-[#4d4d4d]">
            آگهی ثبت شده
          </Typography>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <button
          aria-label="قبلی"
          className="grid h-8 w-8 place-items-center rounded-full text-[#4d4d4d] transition hover:bg-[#f5f7fb]"
          onClick={() => scrollConsultantChart("previous")}
          type="button"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
        <button
          aria-label="بعدی"
          className="grid h-8 w-8 place-items-center rounded-full text-[#4d4d4d] transition hover:bg-[#f5f7fb]"
          onClick={() => scrollConsultantChart("next")}
          type="button"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {useApiData && !isLoading && chartData.length === 0 ? (
        <div className="grid h-[240px] place-items-center text-sm text-[#808080]">
          فعالیتی برای مشاوران در این دوره ثبت نشده است.
        </div>
      ) : (
        <div
          className="mx-auto h-[240px] max-w-full overflow-x-auto overscroll-x-contain scroll-smooth [&_.recharts-layer:focus]:outline-none [&_.recharts-rectangle:focus]:outline-none [&_.recharts-surface_*:focus]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-surface]:[user-select:none] [&_.recharts-surface:focus]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper:focus]:outline-none"
          dir="ltr"
          ref={chartScrollRef}
          style={{ width: consultantChartViewportWidth }}
        >
          <div className="h-full" style={{ width: consultantChartWidth }}>
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                barCategoryGap={20}
                barGap={5}
                data={chartData}
                margin={{ bottom: 0, left: -18, right: 4, top: 34 }}
                tabIndex={-1}
              >
              <CartesianGrid
                horizontal
                stroke="#d9d9d9"
                strokeDasharray="5 6"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="name"
                interval={0}
                tick={{ fill: "#1a1a1a", fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                domain={[0, "auto"]}
                tick={{ fill: "#8a8a8a", fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
                tickLine={false}
                width={50}
              />
              <Tooltip
                allowEscapeViewBox={{ x: true, y: true }}
                content={<ConsultantBarTooltip />}
                cursor={false}
                offset={8}
                shared={false}
                wrapperStyle={{
                  outline: "none",
                  pointerEvents: "none",
                  transform: "translate(-50%, -115%)",
                }}
              />
              <Bar
                barSize={10}
                dataKey="ads"
                fill="#0048c4"
                radius={[6, 6, 0, 0]}
                shape={(props: any) => (
                  <ConsultantBarShape
                    {...props}
                    selectedBar={selectedBar}
                    seriesKey="ads"
                    onSelect={setSelectedBar}
                  />
                )}
              />
              <Bar
                barSize={10}
                dataKey="renewals"
                fill="#11a366"
                radius={[6, 6, 0, 0]}
                shape={(props: any) => (
                  <ConsultantBarShape
                    {...props}
                    selectedBar={selectedBar}
                    seriesKey="renewals"
                    onSelect={setSelectedBar}
                  />
                )}
              />
              <Bar
                barSize={10}
                dataKey="specials"
                fill="#ffb100"
                radius={[6, 6, 0, 0]}
                shape={(props: any) => (
                  <ConsultantBarShape
                    {...props}
                    selectedBar={selectedBar}
                    seriesKey="specials"
                    onSelect={setSelectedBar}
                  />
                )}
              />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-7 grid grid-cols-3 gap-4 text-center" dir="rtl">
        <ConsultantActivityLegendItem color="#0048c4" label="آگهی" />
        <ConsultantActivityLegendItem color="#11a366" label="بروزرسانی" />
        <ConsultantActivityLegendItem color="#ffb100" label="ویژه" />
      </div>
    </article>
  );
}

function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metricIcons[metric.icon];
  const tone = toneClasses[metric.tone];

  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-none">
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${tone.bg} ${tone.icon} ${tone.ring}`}
      >
        <Icon className="h-6 w-6" />
      </Typography>

      <div className="w-full">
        <div className="flex w-full justify-between items-center">
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 truncate text-sm font-medium leading-6 text-[#4D4D4D]">
            {metric.title}
          </Typography>
          <strong className="font-semibold leading-none text-[#1A1A1A]">
            {metric.value}
          </strong>
        </div>

        <div>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs font-medium leading-5 text-[#8a8a8a]">
            {metric.descriptionIcon === "clock" ? (
              <LinearClock className="h-4 w-4 text-[#334466]" />
            ) : null}
            {metric.trend ? (
              <Typography as="span" variant="label" size="medium" weight="semibold"
                className={`inline-flex items-center gap-0.5 font-bold ${trendClasses[metric.trendTone]}`}
              >
                <LinearChartUp className="h-4 w-4" />
                {metric.trend}
              </Typography>
            ) : null}
            <Typography as="span" variant="body" size="medium" weight="regular">{metric.description}</Typography>
          </div>
        </div>
      </div>

    </article>
  );
}

function PublishedAdsLegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="w-[28%] flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <Typography as="span" variant="body" size="medium" weight="regular"
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Typography as="span" variant="body" size="small" weight="regular" className="text-xs font-normal text-[#4d4d4d] text-nowrap">
          {label}
        </Typography>
      </div>
      <strong className="text-base font-semibold text-[#1a1a1a]">
        {value}
      </strong>
    </div>
  );
}

function ConsultantActivityLegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center justify-center gap-2 text-base font-medium leading-6 text-[#4d4d4d]">
      {label}
      <Typography as="span" variant="body" size="medium" weight="regular"
        aria-hidden="true"
        className="h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </Typography>
  );
}
