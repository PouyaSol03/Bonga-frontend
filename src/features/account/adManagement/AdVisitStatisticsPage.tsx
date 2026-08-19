import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import "../../advertisements/components/AdCard.css";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { TopBar } from "../../../shared/components/TopBar";
import { USER } from "../../../shared/constants/roles.constants";
import {
  useAdvertisementDailyViewsQuery,
  useMyAdvertisementDetailQuery,
} from "../../advertisements/api/advertisement.hooks";
import type { AdvertisementDailyViews } from "../../advertisements/api/advertisement.service";
import { getPrimaryAdvertisementImageUrl } from "../../advertisements/utils/advertisement-images";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import {
  adManagementPaths,
  getAdIncreaseVisitsPath,
  getAdManagementRouteState,
  getAdStatePath,
  getSelectedConsultantAd,
} from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearChartUp from "../../../shared/icons/LinearChartUp";
import LinearArrowRight1 from "../../../shared/icons/LinearArrowRight1";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import LinearAnalytics from "../../../shared/icons/LinearAnalytics";

type ChartMetric = "calls" | "chats" | "searchDisplays" | "views";

type ChartColumn = {
  date: string;
  height: number;
  selected?: boolean;
  tooltip: string;
};

type ChartConfig = {
  label: string;
  metric: ChartMetric;
  selectedTooltip: string;
  title: string;
  total: string;
  yAxisLabels: string[];
  columns: ChartColumn[];
};

type AdSummary = {
  category: string;
  imageClassName: string;
  imageUrl?: string;
  timeAndLocation: string;
  title: string;
};

const managerChartSections: Array<Pick<ChartConfig, "label" | "metric" | "title">> = [
  { label: "بازدید کل:", metric: "views", title: "بازدید از آگهی" },
  { label: "بازدید کل:", metric: "searchDisplays", title: "نمایش در صفحه جستجو" },
  { label: "بازدید کل:", metric: "chats", title: "گفتگوها (چت‌ها)" },
  { label: "بازدید کل:", metric: "calls", title: "اقدام به تماس" },
];

export function AdVisitStatisticsPage() {
  const routeState = getAdManagementRouteState();
  const adId = readAdIdFromPath() ?? readQueryAdId() ?? readEntityId(routeState.ad) ?? readEntityId(routeState.card);
  const query = useMyAdvertisementDetailQuery(adId ?? null);
  const dailyViewsQuery = useAdvertisementDailyViewsQuery(adId ?? null);
  const card = routeState.card ?? getSelectedConsultantAd(adId);
  const ad = query.data ?? routeState.ad ?? card;
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isUserRole = activeRole === USER;
  const backTo = routeState.visitStatisticsReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const summary = useMemo(() => createAdSummary(ad, card), [ad, card]);
  const userChart = useMemo(() => createUserChartConfig(ad, dailyViewsQuery.data), [ad, dailyViewsQuery.data]);
  const managerCharts = useMemo(() => createManagerChartConfigs(ad, dailyViewsQuery.data), [ad, dailyViewsQuery.data]);
  const isLoading = query.isLoading || dailyViewsQuery.isLoading;
  const isError = query.isError || dailyViewsQuery.isError;
  const retry = () => {
    void query.refetch();
    void dailyViewsQuery.refetch();
  };

  if (isUserRole) {
    return (
      <UserAdVisitStatisticsView
        ad={ad}
        adId={adId}
        backTo={backTo}
        card={card}
        chart={userChart}
        isError={isError}
        isLoading={isLoading}
        onRetry={retry}
        returnTo={routeState.returnTo}
      />
    );
  }

  return (
    <ManagerAdVisitStatisticsView
      backTo={backTo}
      charts={managerCharts}
      isError={isError}
      isLoading={isLoading}
      onRetry={retry}
      returnTo={routeState.returnTo}
      summary={summary}
    />
  );
}

function UserAdVisitStatisticsView({
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad, card, returnTo, tab: "status" }}
        backTo={backTo}
        className="bg-[#f0f0f0] [&_a]:text-[#1a1a1a]"
        title="آمار بازدید"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-[92px]">
        {isLoading ? <InlineNotice text="در حال دریافت آمار آگهی..." /> : null}
        {isError ? <ErrorNotice onRetry={onRetry} /> : null}

        <section className="bg-white p-4" aria-label="آمار بازدید">
          <VisitBarChart chart={chart} mode="user" />
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />

        <section className="flex min-h-[292px] flex-col bg-white px-7 pb-8 pt-8">
          <Typography as="h2" variant="headline" size="small" className="m-0 text-[26px] font-extrabold leading-10 tracking-[-0.04em]">
            <Typography as="span" variant="title" size="large" className="font-black text-[#11a366]">دیده شو، </Typography>
            <Typography as="span" variant="title" size="large" className="font-black text-[#0048c4]">سریع‌تر بفروش!</Typography>
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 mt-2 text-[#4d4d4d]">
            با بسته‌های <Typography as="span" variant="body" size="medium" weight="medium" className="text-[#0048c4]">«بروزرسانی»</Typography> و <Typography as="span" variant="body" size="medium" weight="medium" className="text-[#0048c4]">«ویژه»</Typography>، آگهی‌ات را در صدر نتایج و جلوی چشم خریداران قرار بده.
          </Typography>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <RouteLink
          className="flex h-14 w-full items-center justify-between rounded-xl bg-[#0048c4] px-5 text-base font-medium leading-6 text-white no-underline shadow-[0_4px_10px_rgba(0,72,196,0.22)] [direction:ltr]"
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
          <Typography as="span" variant="label" size="large" weight="medium" className="inline-flex items-center gap-2 [direction:rtl]">
            <LinearChartUp className="h-6 w-6" />
            افزایش بازدید
          </Typography>
        </RouteLink>
      </footer>
    </PageFrame>
  );
}

function ManagerAdVisitStatisticsView({
  backTo,
  charts,
  isError,
  isLoading,
  onRetry,
  returnTo,
  summary,
}: {
  backTo: string;
  charts: ChartConfig[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  returnTo?: string;
  summary: AdSummary;
}) {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ returnTo, tab: "status" }}
        backTo={backTo}
        className="[&_a]:text-[#1a1a1a]"
        title="جزییات آمار آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <AdSummaryHeader summary={summary} />
        {isLoading ? <InlineNotice text="در حال دریافت آمار آگهی..." /> : null}
        {isError ? <ErrorNotice onRetry={onRetry} /> : null}

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
        {charts.map((chart, index) => (
          <div key={chart.title}>
            {index > 0 ? <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" /> : null}
            <VisitBarChart chart={chart} mode="manager" />
          </div>
        ))}
      </main>
    </PageFrame>
  );
}

function AdSummaryHeader({ summary }: { summary: AdSummary }) {
  return (
    <section className="h-[104px] bg-white px-4 py-4" aria-label={summary.title}>
      <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
        <div className="min-w-0 flex-1 text-right [direction:rtl]">
          <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 truncate text-sm font-medium leading-5 text-[#1a1a1a]">{summary.title}</Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 truncate text-xs font-normal leading-4 text-[#808080]">
            {summary.timeAndLocation || summary.category}
          </Typography>
        </div>
        <div
          aria-hidden="true"
          className={`ad-card__image ${summary.imageClassName} h-[72px] w-[108px] shrink-0 rounded-lg bg-cover bg-center`}
          style={summary.imageUrl ? { backgroundImage: `url(${summary.imageUrl})` } : undefined}
        />
      </div>
    </section>
  );
}

type VisitChartPoint = ChartColumn & {
  value: number;
};

function VisitBarChart({ chart, mode }: { chart: ChartConfig; mode: "manager" | "user" }) {
  const [offset, setOffset] = useState(0);
  const [isInfoSheetOpen, setIsInfoSheetOpen] = useState(false);
  const chartData = useMemo<VisitChartPoint[]>(
    () => chart.columns.map((column) => ({ ...column, value: column.height })),
    [chart.columns],
  );
  const rangeSize = 7;
  const maxOffset = Math.max(0, Math.ceil(chartData.length / rangeSize) - 1);
  const visibleChartData = useMemo(() => {
    const end = Math.max(0, chartData.length - offset * rangeSize);
    const start = Math.max(0, end - rangeSize);

    return chartData.slice(start, end);
  }, [chartData, offset]);
  const defaultSelectedIndex = useMemo(() => {
    const markedIndex = visibleChartData.findIndex((column) => column.selected);

    return markedIndex >= 0 ? markedIndex : Math.max(0, visibleChartData.length - 1);
  }, [visibleChartData]);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const isUserMode = mode === "user";
  const selectedColumn = visibleChartData[selectedIndex] ?? visibleChartData[defaultSelectedIndex] ?? visibleChartData[0];
  const tooltipText = selectedColumn?.tooltip ?? chart.selectedTooltip;
  const chartInfo = getChartInfo(chart.metric);

  useEffect(() => {
    setSelectedIndex(defaultSelectedIndex);
  }, [defaultSelectedIndex]);

  useEffect(() => {
    setOffset((current) => Math.min(current, maxOffset));
  }, [maxOffset]);

  return (
    <section
      className={`${isUserMode ? "bg-white" : "h-[283px] bg-[#fafafa] px-4 py-4"}`}
      aria-label={chart.title}
    >
      <div className="flex h-12 items-center justify-between [direction:ltr]">
        {chartData.length > rangeSize ? <ChartRangeControls maxOffset={maxOffset} offset={offset} setOffset={setOffset} /> : <div className="h-12 w-24" aria-hidden="true" />}
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 inline-flex items-center gap-2 text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          <LinearAnalytics className="h-6 w-6 text-on-surface-var" />
          {chart.title}
          <Button unstyled
            aria-label={`توضیحات ${chart.title}`}
            className="grid h-4 w-4 place-items-center rounded-full text-[#4d4d4d] transition-colors hover:bg-[#f5f5f5] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={() => setIsInfoSheetOpen(true)}
            type="button"
          >
            <LinearInfoCircle className="h-4 w-4" />
          </Button>
        </Typography>
      </div>

      <div className={`${isUserMode ? "mt-3" : "mt-4"}`}>
        <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal leading-5 text-[#4d4d4d]">{chart.label}</Typography>
          <strong className="text-base font-semibold leading-6 text-[#002099]">
            {chart.total}
          </strong>
        </div>

        <div className={`${isUserMode ? "mt-3 h-[190px]" : "mt-2 h-[155px]"} [direction:ltr]`}>
          {visibleChartData.length === 0 ? (
            <div className="flex h-full items-center justify-center border-b border-[#cccccc] px-6 text-center [direction:rtl]">
              <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs text-[#808080]">
                داده نموداری از سرور دریافت نشده است.
              </Typography>
            </div>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                barCategoryGap={isUserMode ? 26 : 20}
                data={visibleChartData}
                margin={{ bottom: 0, left: 0, right: 0, top: 38 }}
              >
                <CartesianGrid stroke="#e6e6e6" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={{ stroke: "#cccccc" }} dataKey="date" height={24} interval={0} tick={{ fill: "#4d4d4d", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: "#808080", fontSize: 12 }} tickFormatter={createYAxisTickFormatter(chart.yAxisLabels)} tickLine={false} ticks={createYAxisTicks(chart.yAxisLabels)} width={34} />
                <Bar dataKey="value" fill="#12a36a" isAnimationActive={false} maxBarSize={6} minPointSize={2} onClick={(_, index) => setSelectedIndex(index)} radius={[999, 999, 0, 0]}>
                  {visibleChartData.map((column, index) => (
                    <Cell cursor="pointer" fill={index === selectedIndex ? "#0f9464" : "#12a36a"} key={column.date} onClick={() => setSelectedIndex(index)} />
                  ))}
                  <LabelList
                    content={(props) => {
                      const labelProps = props as Record<string, unknown>;
                      return <SelectedVisitBarLabel index={typeof labelProps.index === "number" ? labelProps.index : -1} selectedIndex={selectedIndex} tooltipText={tooltipText} width={toChartNumber(labelProps.width)} x={toChartNumber(labelProps.x)} y={toChartNumber(labelProps.y)} />;
                    }}
                    dataKey="value"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <BottomSheet
        ariaLabel={`توضیحات ${chart.title}`}
        contentClassName="px-5 pb-6 pt-2"
        heightClassName="min-h-[214px] h-auto"
        isOpen={isInfoSheetOpen}
        onClose={() => setIsInfoSheetOpen(false)}
        panelPaddingClassName="pt-3"
        showBackButton={false}
        title={chartInfo.title}
      >
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm font-normal leading-7 text-[#4d4d4d]">
          {chartInfo.description}
        </Typography>
      </BottomSheet>
    </section>
  );
}

function ChartRangeControls({
  maxOffset,
  offset,
  setOffset,
}: {
  maxOffset: number;
  offset: number;
  setOffset: (updater: (current: number) => number) => void;
}) {
  return (
    <div className="flex items-center">
      <Button unstyled
        aria-label="بازه قبلی"
        className={`grid h-12 w-12 place-items-center ${offset >= maxOffset ? "text-[#cccccc]" : "text-[#4d4d4d]"}`}
        disabled={offset >= maxOffset}
        onClick={() => setOffset((current) => Math.min(current + 1, maxOffset))}
        type="button"
      >
        <LinearArrowLeft1 className="h-5 w-5" />
      </Button>
      <Button unstyled
        aria-label="بازه بعدی"
        className={`grid h-12 w-12 place-items-center ${offset === 0 ? "text-[#cccccc]" : "text-[#4d4d4d]"}`}
        disabled={offset === 0}
        onClick={() => setOffset((current) => Math.max(current - 1, 0))}
        type="button"
      >
        <LinearArrowRight1 className="h-5 w-5" />
      </Button>
    </div>
  );
}

function SelectedVisitBarLabel({
  index,
  selectedIndex,
  tooltipText,
  width,
  x,
  y,
}: {
  index: number;
  selectedIndex: number;
  tooltipText: string;
  width: number;
  x: number;
  y: number;
}) {
  if (index !== selectedIndex) return null;

  const labelWidth = Math.max(48, tooltipText.length * 10 + 18);
  const labelHeight = 28;
  const centerX = x + width / 2;
  const labelX = centerX - labelWidth / 2;
  const labelY = Math.max(0, y - labelHeight - 8);

  return (
    <g aria-hidden="true" pointerEvents="none">
      <rect fill="#4d4d4d" height={labelHeight} rx={6} width={labelWidth} x={labelX} y={labelY} />
      <path d={`M ${centerX - 5} ${labelY + labelHeight - 1} L ${centerX} ${labelY + labelHeight + 6} L ${centerX + 5} ${labelY + labelHeight - 1} Z`} fill="#4d4d4d" />
      <text
        direction="rtl"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
        x={centerX}
        y={labelY + labelHeight / 2}
      >
        {tooltipText}
      </text>
    </g>
  );
}

function createYAxisTicks(labels: string[]) {
  if (labels.length <= 1) return [0, 100];

  return labels.map((_, index) => (index / (labels.length - 1)) * 100);
}

function createYAxisTickFormatter(labels: string[]) {
  const ascendingLabels = [...labels].reverse();

  return (value: number | string) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || ascendingLabels.length <= 1) return String(value);

    const index = Math.round((numericValue / 100) * (ascendingLabels.length - 1));

    return ascendingLabels[index] ?? String(value);
  };
}

function getChartInfo(metric: ChartMetric) {
  const infoByMetric: Record<ChartMetric, { description: string; title: string }> = {
    calls: {
      description: "تعداد دفعاتی که کاربران از داخل آگهی برای تماس با شما اقدام کرده‌اند. این عدد کمک می‌کند بفهمید آگهی چقدر به سرنخ واقعی نزدیک شده است.",
      title: "اقدام به تماس",
    },
    chats: {
      description: "تعداد گفتگوهایی که کاربران از طریق بخش چت برای این آگهی شروع کرده‌اند. افزایش این عدد معمولاً یعنی عنوان، عکس و توضیحات آگهی برای کاربر جذاب بوده است.",
      title: "گفتگوها (چت‌ها)",
    },
    searchDisplays: {
      description: "تعداد دفعاتی که آگهی شما در نتایج جستجو به کاربران نمایش داده شده است. با بروزرسانی یا ویژه کردن آگهی می‌توانید این عدد را بیشتر کنید.",
      title: "نمایش در صفحه جستجو",
    },
    views: {
      description: "تعداد دفعاتی که کاربران وارد صفحه آگهی شده‌اند و جزئیات آن را دیده‌اند. این آمار برای سنجش جذابیت آگهی و اثرگذاری افزایش بازدید استفاده می‌شود.",
      title: "بازدید از آگهی",
    },
  };

  return infoByMetric[metric];
}

function toChartNumber(value: unknown) {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function createUserChartConfig(ad: unknown, dailyViews?: AdvertisementDailyViews): ChartConfig {
  const dailyChart = createDailyViewsChart(dailyViews);

  return {
    columns: dailyChart.columns,
    label: "بازدید کل:",
    metric: "views",
    selectedTooltip: dailyChart.selectedTooltip,
    title: "آمار بازدید",
    total: dailyViews ? formatFaNumber(dailyViews.totalView) : readStatistic(ad, ["total_views", "views_count", "views", "visit_count", "view_count"]),
    yAxisLabels: dailyChart.yAxisLabels,
  };
}

function createManagerChartConfigs(ad: unknown, dailyViews?: AdvertisementDailyViews): ChartConfig[] {
  const dailyChart = createDailyViewsChart(dailyViews);

  return managerChartSections.map((section) => {
    const isViewsChart = section.metric === "views";

    return {
      ...section,
      columns: isViewsChart ? dailyChart.columns : [],
      selectedTooltip: isViewsChart ? dailyChart.selectedTooltip : "",
      total: isViewsChart && dailyViews
        ? formatFaNumber(dailyViews.totalView)
        : readStatistic(ad, statisticKeysByMetric[section.metric]),
      yAxisLabels: isViewsChart ? dailyChart.yAxisLabels : [],
    };
  });
}

function createDailyViewsChart(dailyViews?: AdvertisementDailyViews) {
  const points = [...(dailyViews?.data ?? [])].reverse();
  const maxCount = points.reduce((max, point) => Math.max(max, point.count), 0);
  const columns: ChartColumn[] = points.map((point, index) => ({
    date: point.date,
    height: maxCount > 0 ? (point.count / maxCount) * 100 : 0,
    selected: index === points.length - 1,
    tooltip: `${formatFaNumber(point.count)} بازدید`,
  }));

  return {
    columns,
    selectedTooltip: columns.at(-1)?.tooltip ?? "",
    yAxisLabels: createDailyViewsYAxisLabels(maxCount),
  };
}

function createDailyViewsYAxisLabels(maxCount: number) {
  if (maxCount <= 0) return ["۰", "۰"];
  if (maxCount <= 3) return [formatFaNumber(maxCount), "۰"];

  return [
    maxCount,
    Math.round((maxCount * 2) / 3),
    Math.round(maxCount / 3),
    0,
  ].map(formatFaNumber);
}

const statisticKeysByMetric: Record<ChartMetric, string[]> = {
  calls: ["call_count", "calls_count", "calls", "phone_clicks", "contact_count"],
  chats: ["chat_count", "chats_count", "chats", "conversation_count", "message_count"],
  searchDisplays: ["search_display_count", "impressions", "impression_count", "display_count", "shown_count"],
  views: ["total_views", "views_count", "views", "visit_count", "view_count"],
};

function createAdSummary(ad: unknown, card: ReturnType<typeof getSelectedConsultantAd>): AdSummary {
  const record: Record<string, unknown> = isRecord(ad) ? ad : {};
  const title = readText(record.title ?? record.ad_title ?? card.title, card.title);
  const category = readText(
    record.category_title ?? record.categoryTitle ?? record.category_name ?? record.categoryName,
    "—",
  );
  const timeAndLocation = readText(record.timeAndLocation ?? record.time_and_location, card.timeAndLocation);

  return {
    category,
    imageClassName: readText(record.imageClassName ?? record.image_class_name, card.imageClassName),
    imageUrl: readImageUrl(record) ?? card.imageUrl,
    timeAndLocation,
    title,
  };
}

function readStatistic(ad: unknown, keys: string[]) {
  if (!isRecord(ad)) return "—";

  const statisticsContainers = [ad, ad.statistics, ad.stats, ad.report, ad.analytics].filter(isRecord);

  for (const container of statisticsContainers) {
    for (const key of keys) {
      const value = container[key];

      if (typeof value === "number" && Number.isFinite(value)) return formatFaNumber(value);
      if (typeof value === "string" && value.trim()) return value;
    }
  }

  return "—";
}

function formatFaNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/visit-statistics\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function readQueryAdId() {
  return new URLSearchParams(window.location.search).get("adId") ?? undefined;
}

function readEntityId(entity: unknown) {
  if (!isRecord(entity)) return undefined;

  const id = entity.id ?? entity._id ?? entity.advertise_id ?? entity.advertiseId;

  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number") return String(id);

  return undefined;
}

function readImageUrl(record: Record<string, unknown>) {
  return getPrimaryAdvertisementImageUrl(record);
}

function readText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function InlineNotice({ text }: { text: string }) {
  return (
    <div className="bg-white px-4 py-3 text-center text-xs font-medium leading-5 text-[#808080]">
      {text}
    </div>
  );
}

function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-4 my-3 rounded-lg bg-[#fff5db] px-3 py-2 text-center text-xs font-medium leading-5 text-[#ff6d00]">
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">دریافت آمار آگهی با خطا مواجه شد.</Typography>
      <Button unstyled className="mt-1 border-0 text-xs font-semibold text-[#0048c4]" onClick={onRetry} type="button">
        تلاش دوباره
      </Button>
    </div>
  );
}
