import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearChartDown from "../../../../shared/icons/LinearChartDown";
import LinearChartUp from "../../../../shared/icons/LinearChartUp";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface MonthViewData {
  month: string;
  views: number;
}

export interface DashboardViewsBarChartCardProps {
  data?: MonthViewData[];
  periodLabel?: string;
  trendText?: string;
  onPeriodChange?: (period: "month" | "year") => void;
}

export function DashboardViewsBarChartCard({
  data,
  periodLabel,
  trendText = "۲۳% کاهش پیشرفت",
  onPeriodChange,
}: DashboardViewsBarChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const effectivePeriod = periodLabel
    ? periodLabel === "در ماه" ? "month" : "year"
    : selectedPeriod;

  const dataset = data && data.length > 0 ? data : [];

  const windowSize = effectivePeriod === "month" ? 4 : 10;
  const maxStartIndex = Math.max(0, dataset.length - windowSize);
  const visibleData = dataset.slice(startIndex, startIndex + windowSize);

  const hasPrev = startIndex > 0;
  const hasNext = startIndex < maxStartIndex;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  };

  const handleSelectPeriod = (period: "month" | "year") => {
    setSelectedPeriod(period);
    setStartIndex(0);
    setIsDropdownOpen(false);
    onPeriodChange?.(period);
  };

  const isPositive = trendText?.includes("افزایش") || false;
  const percentMatch = trendText?.match(/(\d+)/);
  const percentValue = percentMatch ? toPersianNumber(percentMatch[1]) : toPersianNumber(23);
  const statusText = isPositive ? "افزایش پیشرفت" : "کاهش پیشرفت";
  const ChartIcon = isPositive ? LinearChartUp : LinearChartDown;

  return (
    <section className="w-full bg-surface-container-lowest p-4 [direction:rtl]">
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
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-on-surface transition hover:bg-surface-container-low active:scale-95 cursor-pointer border-none bg-transparent"
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
            <LinearArrowDown1 className="h-3.5 w-3.5 text-on-surface" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 z-30 min-w-[90px] rounded-lg border border-outline-var bg-surface-container-lowest py-1 shadow-md">
              <button
                className={`w-full px-3 py-1.5 text-right text-xs transition hover:bg-surface-container-low cursor-pointer border-none bg-transparent ${
                  effectivePeriod === "year" ? "font-bold text-primary" : "text-on-surface-var"
                }`}
                onClick={() => handleSelectPeriod("year")}
                type="button"
              >
                در سال
              </button>
              <button
                className={`w-full px-3 py-1.5 text-right text-xs transition hover:bg-surface-container-low cursor-pointer border-none bg-transparent ${
                  effectivePeriod === "month" ? "font-bold text-primary" : "text-on-surface-var"
                }`}
                onClick={() => handleSelectPeriod("month")}
                type="button"
              >
                در ماه
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-metric: Icon first, then Percent, then trend text */}
      <div className="mt-2 flex items-center gap-1.5">
        <ChartIcon
          className={`h-4 w-4 shrink-0 ${isPositive ? "text-tertiary" : "text-error"}`}
        />
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className={isPositive ? "text-tertiary font-bold text-xs" : "text-error font-bold text-xs"}
        >
          {percentValue}٪
        </Typography>
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

      {/* Shift arrows row */}
      {dataset.length > windowSize && (
        <div className="mt-2 flex items-center justify-between px-1">
          <button
            aria-label="ماه قبل"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              hasPrev
                ? "text-on-surface hover:text-primary active:scale-90"
                : "text-outline-var opacity-20 cursor-not-allowed"
            }`}
            disabled={!hasPrev}
            onClick={handlePrev}
            type="button"
          >
            <LinearArrowRight1 className="h-4 w-4" />
          </button>

          <button
            aria-label="ماه بعد"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              hasNext
                ? "text-on-surface hover:text-primary active:scale-90"
                : "text-outline-var opacity-20 cursor-not-allowed"
            }`}
            disabled={!hasNext}
            onClick={handleNext}
            type="button"
          >
            <LinearArrowLeft1 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bar Chart or Empty State */}
      {visibleData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            داده‌ای برای نمایش بازدید آگهی‌ها وجود ندارد
          </Typography>
        </div>
      ) : (
        <div className="mt-1 h-56 w-full [direction:ltr]">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              barCategoryGap={24}
              data={visibleData}
              margin={{ top: 10, right: 0, left: -25, bottom: effectivePeriod === "month" ? 10 : 25 }}
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
      )}
    </section>
  );
}
