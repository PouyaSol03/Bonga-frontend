import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Typography } from "../../../../shared/ui/Typography";
import { DashboardChartEmptyState } from "./DashboardChartEmptyState";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearChartDown from "../../../../shared/icons/LinearChartDown";
import LinearChartUp from "../../../../shared/icons/LinearChartUp";
import LinearTick from "../../../../shared/icons/LinearTick";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

interface MonthViewData {
  month: string;
  views: number;
}

export interface DashboardViewsBarChartCardProps {
  data?: MonthViewData[];
  period?: "month" | "year";
  periodLabel?: string;
  trendText?: string;
  onPeriodChange?: (period: "month" | "year") => void;
}

export function DashboardViewsBarChartCard({
  data,
  period,
  periodLabel,
  trendText,
  onPeriodChange,
}: DashboardViewsBarChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const effectivePeriod = period
    ? period
    : periodLabel
      ? periodLabel.includes("ماه")
        ? "month"
        : "year"
      : selectedPeriod;

  const dataset = data && data.length > 0 ? data : [];

  const checkScroll = () => {
    const el = chartScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = chartScrollRef.current;
    if (!el) return;
    const timeout = setTimeout(checkScroll, 100);
    return () => clearTimeout(timeout);
  }, [dataset, effectivePeriod]);

  const handleScrollSmooth = (direction: "prev" | "next") => {
    const el = chartScrollRef.current;
    if (!el) return;
    const delta = direction === "next" ? 140 : -140;
    el.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  const handleSelectPeriod = (nextPeriod: "month" | "year") => {
    setSelectedPeriod(nextPeriod);
    setIsDropdownOpen(false);
    onPeriodChange?.(nextPeriod);
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const isPositive = trendText?.includes("افزایش") || false;
  const percentMatch = trendText?.match(/(\d+)/);
  const percentValue = percentMatch ? toPersianNumber(percentMatch[1]) : null;
  const statusText = isPositive ? "افزایش پیشرفت" : "کاهش پیشرفت";
  const ChartIcon = isPositive ? LinearChartUp : LinearChartDown;

  const needsScroll = dataset.length > (effectivePeriod === "month" ? 4 : 6);
  const itemWidth = effectivePeriod === "month" ? 64 : 48;
  const contentWidth = needsScroll ? Math.max(340, dataset.length * itemWidth) : "100%";

  return (
    <section className="bg-surface-container-lowest w-full p-4 [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface font-bold"
        >
          نمودار بازدید آگهی‌ها
        </Typography>

        {/* Period Dropdown - Without border */}
        <div className="relative">
          <button
            className="text-on-surface flex cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2 py-1 transition active:scale-95"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            type="button"
          >
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface text-xs"
            >
              {effectivePeriod === "year" ? "در سال" : "در ماه"}
            </Typography>
            <LinearArrowDown1 className="text-on-surface h-3.5 w-3.5" />
          </button>

          {isDropdownOpen && (
            <div className="border-outline-var bg-surface-container-lowest absolute top-full left-0 z-30 mt-1 min-w-[110px] rounded-lg border py-1 shadow-md">
              <button
                className={`flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-right text-xs transition ${
                  effectivePeriod === "year"
                    ? "text-primary bg-primary/5 font-bold"
                    : "text-on-surface-var bg-transparent"
                }`}
                onClick={() => handleSelectPeriod("year")}
                type="button"
              >
                <span>در سال</span>
                {effectivePeriod === "year" && <LinearTick className="text-primary h-3.5 w-3.5" />}
              </button>
              <button
                className={`flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-right text-xs transition ${
                  effectivePeriod === "month"
                    ? "text-primary bg-primary/5 font-bold"
                    : "text-on-surface-var bg-transparent"
                }`}
                onClick={() => handleSelectPeriod("month")}
                type="button"
              >
                <span>در ماه</span>
                {effectivePeriod === "month" && <LinearTick className="text-primary h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-metric: Icon first, then Percent (only if not null), then trend text */}
      {trendText && dataset.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5">
          <ChartIcon
            className={`h-4 w-4 shrink-0 ${isPositive ? "text-tertiary" : "text-error"}`}
          />
          {percentValue !== null && (
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className={
                isPositive ? "text-tertiary text-xs font-bold" : "text-error text-xs font-bold"
              }
            >
              {percentValue}٪
            </Typography>
          )}
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-on-surface-var text-xs"
          >
            {statusText}
          </Typography>
        </div>
      )}

      {/* Smooth shift arrows row */}
      {needsScroll && (
        <div className="mt-2 flex items-center justify-between px-1">
          <button
            aria-label="ماه قبل"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              canScrollLeft
                ? "text-on-surface active:scale-90"
                : "text-outline-var cursor-not-allowed opacity-20"
            }`}
            disabled={!canScrollLeft}
            onClick={() => handleScrollSmooth("prev")}
            type="button"
          >
            <LinearArrowRight1 className="h-4 w-4" />
          </button>

          <button
            aria-label="ماه بعد"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              canScrollRight
                ? "text-on-surface active:scale-90"
                : "text-outline-var cursor-not-allowed opacity-20"
            }`}
            disabled={!canScrollRight}
            onClick={() => handleScrollSmooth("next")}
            type="button"
          >
            <LinearArrowLeft1 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bar Chart or Empty State */}
      {dataset.length === 0 ? (
        <DashboardChartEmptyState
          title="داده‌ای برای نمایش بازدید آگهی‌ها وجود ندارد"
          description="پس از ثبت بازدید آگهی‌ها، آمار تفکیکی در این بخش قرار می‌گیرد."
        />
      ) : (
        <div
          ref={chartScrollRef}
          onScroll={checkScroll}
          className="mt-1 h-56 w-full scrollbar-none overflow-x-auto scroll-smooth [direction:ltr]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div style={{ width: contentWidth, height: "100%", minWidth: 0 }}>
            <ResponsiveContainer height="100%" width="100%" minWidth={0}>
              <BarChart
                barCategoryGap={24}
                data={dataset}
                margin={{
                  top: 10,
                  right: 10,
                  left: -25,
                  bottom: effectivePeriod === "month" ? 10 : 25,
                }}
              >
                <CartesianGrid
                  stroke="var(--outline-variant, #EBEBEB)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  angle={effectivePeriod === "month" ? 0 : -90}
                  axisLine={false}
                  dataKey="month"
                  dy={effectivePeriod === "month" ? 6 : 14}
                  height={effectivePeriod === "month" ? 30 : 45}
                  interval={0}
                  textAnchor={effectivePeriod === "month" ? "middle" : "end"}
                  tick={{ fontSize: 9, fill: "var(--on-surface-variant, #808080)" }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  domain={[0, 500]}
                  tick={{ fontSize: 9, fill: "var(--on-surface-variant, #808080)" }}
                  tickFormatter={(v) => toPersianNumber(v)}
                  tickLine={false}
                  ticks={[0, 100, 200, 300, 400, 500]}
                />
                <Bar
                  barSize={8}
                  dataKey="views"
                  fill="var(--primary, #0048C4)"
                  isAnimationActive={true}
                  animationDuration={400}
                  animationEasing="ease-in-out"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
