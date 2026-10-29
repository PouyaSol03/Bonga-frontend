import { useMemo, useState } from "react";
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
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearAnalytics from "../../../../shared/icons/LinearAnalytics";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import type { ChartConfig, VisitChartPoint } from "./types";
import {
  createYAxisTickFormatter,
  createYAxisTicks,
  getChartInfo,
  toChartNumber,
} from "./statisticsChartFormatters";
import { ChartRangeControls, SelectedVisitBarLabel } from "./VisitBarChartElements";
import { VisitChartInfoBottomSheet } from "./VisitChartInfoBottomSheet";

export function VisitBarChart({ chart, mode }: { chart: ChartConfig; mode: "manager" | "user" }) {
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
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const selectedIndex = selectedColumnIndex ?? defaultSelectedIndex;
  const isUserMode = mode === "user";
  const selectedColumn =
    visibleChartData[selectedIndex] ??
    visibleChartData[defaultSelectedIndex] ??
    visibleChartData[0];
  const tooltipText = selectedColumn?.tooltip ?? chart.selectedTooltip;
  const chartInfo = getChartInfo(chart.metric);

  const effectiveOffset = Math.min(offset, maxOffset);

  return (
    <section
      className={`${isUserMode ? "bg-surface-container-lowest" : "bg-surface-container-low h-[283px] px-4 py-4"}`}
      aria-label={chart.title}
    >
      <div className="flex h-12 items-center justify-between [direction:ltr]">
        {chartData.length > rangeSize ? (
          <ChartRangeControls maxOffset={maxOffset} offset={effectiveOffset} setOffset={setOffset} />
        ) : (
          <div className="h-12 w-24" aria-hidden="true" />
        )}
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface m-0 inline-flex items-center gap-2 text-base leading-6 font-semibold [direction:rtl]"
        >
          <LinearAnalytics className="text-on-surface-var h-6 w-6" />
          {chart.title}
          <Button
            unstyled
            aria-label={`توضیحات ${chart.title}`}
            className="text-on-surface-var focus-visible:outline-primary/20 grid h-4 w-4 place-items-center rounded-full transition-colors focus-visible:outline-3 focus-visible:outline-offset-2"
            onClick={() => setIsInfoSheetOpen(true)}
            type="button"
          >
            <LinearInfoCircle className="h-4 w-4" />
          </Button>
        </Typography>
      </div>

      <div className={`${isUserMode ? "mt-3" : "mt-4"}`}>
        <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var text-sm leading-5 font-normal"
          >
            {chart.label}
          </Typography>
          <strong className="text-primary text-base leading-6 font-semibold">{chart.total}</strong>
        </div>

        <div className={`${isUserMode ? "mt-3 h-[190px]" : "mt-2 h-[155px]"} [direction:ltr]`}>
          {visibleChartData.length === 0 ? (
            <div className="border-outline-var flex h-full items-center justify-center border-b px-6 text-center [direction:rtl]">
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="text-outline m-0 text-xs"
              >
                داده نموداری از سرور دریافت نشده است.
              </Typography>
            </div>
          ) : (
            <ResponsiveContainer height="100%" width="100%" minWidth={0}>
              <BarChart
                barCategoryGap={isUserMode ? 26 : 20}
                data={visibleChartData}
                margin={{ bottom: 0, left: 0, right: 0, top: 38 }}
                style={{ outline: "none" }}
              >
                <CartesianGrid stroke="var(--outline-var)" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  axisLine={{ stroke: "var(--outline-var)" }}
                  dataKey="date"
                  height={24}
                  interval={0}
                  tick={{ fill: "var(--on-surface-var)", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  domain={[0, 100]}
                  tick={{ fill: "var(--outline)", fontSize: 12 }}
                  tickFormatter={createYAxisTickFormatter(chart.yAxisLabels)}
                  tickLine={false}
                  ticks={createYAxisTicks(chart.yAxisLabels)}
                  width={34}
                />
                <Bar
                  dataKey="value"
                  fill="var(--tertiary)"
                  isAnimationActive={false}
                  maxBarSize={6}
                  minPointSize={2}
                  onClick={(_, index) => setSelectedColumnIndex(index)}
                  radius={[999, 999, 0, 0]}
                  style={{ outline: "none" }}
                >
                  {visibleChartData.map((column, index) => (
                    <Cell
                      cursor="pointer"
                      fill={index === selectedIndex ? "var(--tertiary)" : "var(--tertiary)"}
                      key={column.date}
                      onClick={() => setSelectedColumnIndex(index)}
                      style={{ outline: "none" }}
                      tabIndex={-1}
                    />
                  ))}
                  <LabelList
                    content={(props) => {
                      const labelProps = props as Record<string, unknown>;
                      return (
                        <SelectedVisitBarLabel
                          index={typeof labelProps.index === "number" ? labelProps.index : -1}
                          selectedIndex={selectedIndex}
                          tooltipText={tooltipText}
                          width={toChartNumber(labelProps.width)}
                          x={toChartNumber(labelProps.x)}
                          y={toChartNumber(labelProps.y)}
                        />
                      );
                    }}
                    dataKey="value"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <VisitChartInfoBottomSheet
        description={chartInfo.description}
        isOpen={isInfoSheetOpen}
        onClose={() => setIsInfoSheetOpen(false)}
        title={chartInfo.title}
      />
    </section>
  );
}
