import { useState } from "react";
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
import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import { Button } from "../../../../../shared/ui/Button";
import { Chip } from "../../../../../shared/ui/Chip";
import { Typography } from "../../../../../shared/ui/Typography";
import LinearAnalytics from "../../../../../shared/icons/LinearAnalytics";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../../shared/icons/LinearArrowRight1";
import LinearInfoCircle from "../../../../../shared/icons/LinearInfoCircle";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import { useAdPerformanceChartsQuery } from "../../api/adPerformanceApi";
import {
  PERFORMANCE_METRICS,
  type PerformanceMetricKey,
} from "./viewAdPerformanceData";

export function ViewAdPerformanceProgressCharts({
  adId,
  className = "",
}: {
  adId?: string | number;
  className?: string;
}) {
  const [activeKey, setActiveKey] = useState<PerformanceMetricKey>("views");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(5);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { data: chartData } = useAdPerformanceChartsQuery(adId, activeKey, weekOffset);

  const activeMetric =
    PERFORMANCE_METRICS.find((m) => m.key === activeKey) ?? PERFORMANCE_METRICS[0];
  const days = chartData?.days ?? [];
  const selectedDay = days[selectedIndex] ?? days[5];
  const tooltipText = selectedDay ? toPersianNumber(selectedDay.value) : "";
  const totalValueText = chartData ? toPersianNumber(chartData.total_metric_value) : activeMetric.defaultTotal;

  return (
    <section className={`w-full bg-surface-container-lowest p-4 [direction:rtl] ${className}`}>
      <Typography as="h3" variant="title" size="medium" weight="semibold" className="text-on-surface">
        نمودارهای پیشرفت
      </Typography>

      <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {PERFORMANCE_METRICS.map((m) => (
          <Chip
            key={m.key}
            selected={activeKey === m.key}
            onClick={() => {
              setActiveKey(m.key);
              setSelectedIndex(5);
            }}
            className="shrink-0 justify-center"
          >
            {m.chipLabel}
          </Chip>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-surface-container bg-surface-container-lowest p-4 shadow-2xs">
        <div className="flex h-10 items-center justify-between [direction:ltr]">
          <div className="flex items-center">
            <Button unstyled aria-label="بازه بعدی" className="grid h-9 w-9 place-items-center text-on-surface-var" onClick={() => setWeekOffset((p) => p + 1)} type="button">
              <LinearArrowRight1 className="h-5 w-5" />
            </Button>
            <Button unstyled aria-label="بازه قبلی" className="grid h-9 w-9 place-items-center text-on-surface-var" onClick={() => setWeekOffset((p) => p - 1)} type="button">
              <LinearArrowLeft1 className="h-5 w-5" />
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 [direction:rtl]">
            <LinearAnalytics className="h-6 w-6 text-on-surface-var" />
            <Typography as="h4" variant="title" size="small" weight="semibold" className="text-on-surface">
              {activeMetric.chartTitle}
            </Typography>
            <button
              aria-label={`توضیحات ${activeMetric.chartTitle}`}
              className="grid h-5 w-5 place-items-center rounded-full text-on-surface-var hover:text-on-surface cursor-pointer"
              onClick={() => setIsInfoOpen(true)}
              type="button"
            >
              <LinearInfoCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 [direction:rtl]">
          <Typography as="span" variant="body" size="small" weight="regular" className="text-on-surface-var">
            {activeMetric.summaryLabel}
          </Typography>
          <strong className="text-base font-bold text-primary">
            {totalValueText}
          </strong>
        </div>

        <div className="mt-2 h-[175px] [direction:ltr]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              barCategoryGap={16}
              data={days}
              margin={{ bottom: 0, left: 0, right: 0, top: 32 }}
            >
              <CartesianGrid stroke="var(--outline-var)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                axisLine={{ stroke: "var(--outline-var)" }}
                dataKey="date"
                height={24}
                interval={0}
                tick={{ fill: "var(--on-surface-var)", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                domain={[0, 5000]}
                tick={{ fill: "var(--outline)", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "۰" : `${toPersianNumber(val / 1000)} k`)}
                tickLine={false}
                ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                width={30}
              />
              <Bar
                dataKey="value"
                fill="#11A366"
                maxBarSize={8}
                onClick={(_, index) => setSelectedIndex(index)}
                radius={[4, 4, 0, 0]}
              >
                {days.map((_, index) => (
                  <Cell
                    cursor="pointer"
                    fill="#11A366"
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                  />
                ))}
                <LabelList
                  content={({ index, x, y, width }: any) => {
                    if (index !== selectedIndex || x == null || y == null || width == null) return null;
                    const cx = x + width / 2;
                    return (
                      <g aria-hidden="true" pointerEvents="none">
                        <rect fill="#4D4D4D" height={24} rx={4} width={44} x={cx - 22} y={Math.max(0, y - 30)} />
                        <path d={`M ${cx - 4} ${y - 6} L ${cx} ${y} L ${cx + 4} ${y - 6} Z`} fill="#4D4D4D" />
                        <text dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" x={cx} y={Math.max(0, y - 30) + 12}>
                          {tooltipText}
                        </text>
                      </g>
                    );
                  }}
                  dataKey="value"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <BottomSheet
        ariaLabel={activeMetric.infoTitle}
        contentClassName="px-5 pb-6 pt-2"
        heightClassName="min-h-[200px] h-auto"
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        panelPaddingClassName="pt-3"
        showBackButton={false}
        title={activeMetric.infoTitle}
      >
        <Typography as="p" variant="body" size="medium" weight="regular" className="text-sm leading-7 text-on-surface-var">
          {activeMetric.infoDesc}
        </Typography>
      </BottomSheet>
    </section>
  );
}

export default ViewAdPerformanceProgressCharts;
