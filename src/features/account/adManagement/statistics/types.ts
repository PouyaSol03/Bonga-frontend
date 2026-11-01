export type ChartMetric = "calls" | "chats" | "searchDisplays" | "views";

export type ChartColumn = {
  date: string;
  height: number;
  selected?: boolean;
  tooltip: string;
};

export type ChartConfig = {
  label: string;
  metric: ChartMetric;
  selectedTooltip: string;
  title: string;
  total: string;
  yAxisLabels: string[];
  columns: ChartColumn[];
};

export type AdSummary = {
  category: string;
  imageClassName: string;
  imageUrl?: string;
  timeAndLocation: string;
  title: string;
};

export type VisitChartPoint = ChartColumn & {
  value: number;
};
