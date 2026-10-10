import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Typography } from "../../../../shared/ui/Typography";
import { DashboardChartEmptyState } from "./DashboardChartEmptyState";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearTick from "../../../../shared/icons/LinearTick";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { DashboardRole } from "../DashboardQuickAccessGrid";

export interface SliceData {
  name: string;
  value: number;
  percentage?: number | null;
  color: string;
}

export interface DashboardPublishedAdsPieCardProps {
  role?: DashboardRole;
  title?: string;
  totalCount?: number;
  data?: SliceData[];
  period?: "month" | "year";
  periodLabel?: string;
  onPeriodChange?: (period: "month" | "year") => void;
}

export function DashboardPublishedAdsPieCard({
  role = "REAL_ESTATE_CONSULTANT",
  title,
  totalCount,
  data,
  period,
  periodLabel,
  onPeriodChange,
}: DashboardPublishedAdsPieCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isManager = role === "REAL_ESTATE_MANAGER";
  const displayTitle =
    title ?? (isManager ? "آگهی منتشر شده در آژانس" : "آگهی منتشر شده");

  const effectivePeriod = period
    ? period
    : periodLabel
      ? periodLabel.includes("سال")
        ? "year"
        : "month"
      : selectedPeriod;

  const currentData = data && data.length > 0 ? data : [];

  const currentTotal =
    totalCount !== undefined
      ? totalCount
      : currentData.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const handleSelectPeriod = (nextPeriod: "month" | "year") => {
    setSelectedPeriod(nextPeriod);
    setIsDropdownOpen(false);
    onPeriodChange?.(nextPeriod);
  };

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
          {displayTitle}
        </Typography>

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-on-surface transition active:scale-95 cursor-pointer border-none bg-transparent"
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
            <div className="absolute left-0 top-full mt-1 z-30 min-w-[110px] rounded-lg border border-outline-var bg-surface-container-lowest py-1 shadow-md">
              <button
                className={`flex w-full items-center justify-between px-3 py-2 text-right text-xs transition cursor-pointer border-none ${
                  effectivePeriod === "month"
                    ? "font-bold text-primary bg-primary/5"
                    : "text-on-surface-var bg-transparent"
                }`}
                onClick={() => handleSelectPeriod("month")}
                type="button"
              >
                <span>در ماه</span>
                {effectivePeriod === "month" && (
                  <LinearTick className="h-3.5 w-3.5 text-primary" />
                )}
              </button>
              <button
                className={`flex w-full items-center justify-between px-3 py-2 text-right text-xs transition cursor-pointer border-none ${
                  effectivePeriod === "year"
                    ? "font-bold text-primary bg-primary/5"
                    : "text-on-surface-var bg-transparent"
                }`}
                onClick={() => handleSelectPeriod("year")}
                type="button"
              >
                <span>در سال</span>
                {effectivePeriod === "year" && (
                  <LinearTick className="h-3.5 w-3.5 text-primary" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Counter */}
      <div className="mt-3 flex items-baseline gap-2">
        <Typography
          as="span"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary"
        >
          {toPersianNumber(currentTotal)}
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var text-xs"
        >
          آگهی ثبت شده
        </Typography>
      </div>

      {currentData.length === 0 ? (
        <DashboardChartEmptyState
          title="داده‌ای برای نمایش توزیع آگهی‌ها وجود ندارد"
          description="با انتشار آگهی‌ها در دسته‌بندی‌های مختلف، نمودار دایره‌ای فعال می‌شود."
        />
      ) : (
        <>
          {/* Pie Chart */}
          <div className="relative mt-2 h-44 w-full">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={currentData}
                  dataKey="value"
                  innerRadius={0}
                  isAnimationActive={false}
                  outerRadius={74}
                  stroke="none"
                  strokeWidth={0}
                >
                  {currentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend - Exact 3-column RTL layout */}
          <div className="mt-2 grid grid-cols-3 gap-2 pt-3 text-center">
            {currentData.map((item) => {
              const percent = item.percentage != null
                ? item.percentage
                : currentTotal > 0
                  ? Math.round((item.value / currentTotal) * 100)
                  : null;

              return (
                <div key={item.name} className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Typography
                      as="span"
                      variant="label"
                      size="small"
                      weight="medium"
                      className="text-on-surface-var text-[11px]"
                    >
                      {item.name}
                    </Typography>
                  </div>
                  <Typography
                    as="span"
                    variant="title"
                    size="medium"
                    weight="semibold"
                    className="mt-1 text-on-surface"
                  >
                    {percent !== null
                      ? `${toPersianNumber(percent)}٪`
                      : toPersianNumber(item.value)}
                  </Typography>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
