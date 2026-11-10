import type { AdvertisementDailyViews } from "../../../advertisements/api/advertisement.service";
import type { ChartColumn, ChartConfig } from "./types";
import { formatFaNumber, readStatistic, statisticKeysByMetric } from "./statisticsHelpers";

export const managerChartSections: Array<Pick<ChartConfig, "label" | "metric" | "title">> = [
  { label: "بازدید کل:", metric: "views", title: "بازدید از آگهی" },
  { label: "بازدید کل:", metric: "searchDisplays", title: "نمایش در صفحه جستجو" },
  { label: "بازدید کل:", metric: "chats", title: "گفتگوها (چت‌ها)" },
  { label: "بازدید کل:", metric: "calls", title: "اقدام به تماس" },
];

export function createDailyViewsYAxisLabels(maxCount: number) {
  if (maxCount <= 0) return ["۰", "۰"];
  if (maxCount <= 3) return [formatFaNumber(maxCount), "۰"];

  return [maxCount, Math.round((maxCount * 2) / 3), Math.round(maxCount / 3), 0].map(
    formatFaNumber,
  );
}

export function createDailyViewsChart(dailyViews?: AdvertisementDailyViews) {
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

export function createUserChartConfig(
  ad: unknown,
  dailyViews?: AdvertisementDailyViews,
): ChartConfig {
  const dailyChart = createDailyViewsChart(dailyViews);

  return {
    columns: dailyChart.columns,
    label: "بازدید کل:",
    metric: "views",
    selectedTooltip: dailyChart.selectedTooltip,
    title: "آمار بازدید",
    total: dailyViews
      ? formatFaNumber(dailyViews.totalView)
      : readStatistic(ad, ["total_views", "views_count", "views", "visit_count", "view_count"]),
    yAxisLabels: dailyChart.yAxisLabels,
  };
}

export function createManagerChartConfigs(
  ad: unknown,
  dailyViews?: AdvertisementDailyViews,
): ChartConfig[] {
  const dailyChart = createDailyViewsChart(dailyViews);

  return managerChartSections.map((section) => {
    const isViewsChart = section.metric === "views";

    return {
      ...section,
      columns: isViewsChart ? dailyChart.columns : [],
      selectedTooltip: isViewsChart ? dailyChart.selectedTooltip : "",
      total:
        isViewsChart && dailyViews
          ? formatFaNumber(dailyViews.totalView)
          : readStatistic(ad, statisticKeysByMetric[section.metric]),
      yAxisLabels: isViewsChart ? dailyChart.yAxisLabels : [],
    };
  });
}
