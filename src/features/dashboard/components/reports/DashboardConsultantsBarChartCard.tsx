import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "../../../../shared/ui/Typography";
import { DashboardChartEmptyState } from "./DashboardChartEmptyState";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearTick from "../../../../shared/icons/LinearTick";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface ConsultantDatum {
  name: string;
  ads: number;
  updates: number;
  specials: number;
}

export interface DashboardConsultantsBarChartCardProps {
  data?: ConsultantDatum[];
  totalAds?: number;
  period?: "month" | "year";
  periodLabel?: string;
  onPeriodChange?: (period: "month" | "year") => void;
}

export function DashboardConsultantsBarChartCard({
  data,
  totalAds,
  period,
  periodLabel,
  onPeriodChange,
}: DashboardConsultantsBarChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const effectivePeriod = period
    ? period
    : periodLabel
      ? periodLabel.includes("سال")
        ? "year"
        : "month"
      : selectedPeriod;

  const dataset = data && data.length > 0 ? data : [];

  const currentTotal =
    totalAds !== undefined
      ? totalAds
      : dataset.reduce((acc, curr) => acc + (curr.ads || 0), 0);

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
    const delta = direction === "next" ? 160 : -160;
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

  const needsScroll = dataset.length > 4;
  const itemWidth = 84;
  const contentWidth = needsScroll ? Math.max(340, dataset.length * itemWidth) : "100%";

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
          فعالیت مشاورین
        </Typography>

        {/* Period Dropdown */}
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
            <div className="absolute left-0 top-full mt-1 z-30 min-w-[110px] rounded-lg border border-outline-var bg-surface-container-lowest py-1 shadow-md">
              <button
                className={`flex w-full items-center justify-between px-3 py-2 text-right text-xs transition hover:bg-surface-container-low cursor-pointer border-none ${
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
                className={`flex w-full items-center justify-between px-3 py-2 text-right text-xs transition hover:bg-surface-container-low cursor-pointer border-none ${
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

      {/* Sub-metric */}
      <div className="mt-2 flex items-baseline gap-1.5">
        <Typography
          as="span"
          variant="title"
          size="small"
          weight="semibold"
          className="text-lg font-bold text-primary"
        >
          {toPersianNumber(currentTotal)}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var text-xs"
        >
          آگهی ثبت شده
        </Typography>
      </div>

      {/* Smooth shift arrows row */}
      {needsScroll && (
        <div className="mt-2 flex items-center justify-between px-1">
          <button
            aria-label="قبلی"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              canScrollLeft
                ? "text-on-surface hover:text-primary active:scale-90"
                : "text-outline-var opacity-20 cursor-not-allowed"
            }`}
            disabled={!canScrollLeft}
            onClick={() => handleScrollSmooth("prev")}
            type="button"
          >
            <LinearArrowRight1 className="h-4 w-4" />
          </button>

          <button
            aria-label="بعدی"
            className={`cursor-pointer border-none bg-transparent p-0 transition ${
              canScrollRight
                ? "text-on-surface hover:text-primary active:scale-90"
                : "text-outline-var opacity-20 cursor-not-allowed"
            }`}
            disabled={!canScrollRight}
            onClick={() => handleScrollSmooth("next")}
            type="button"
          >
            <LinearArrowLeft1 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grouped Bar Chart or Empty State */}
      {dataset.length === 0 ? (
        <DashboardChartEmptyState
          title="داده‌ای برای نمایش فعالیت مشاورین وجود ندارد"
          description="عملکرد مشاورین آژانس بر اساس ثبت آگهی، بروزرسانی و نشان ویژه در این بخش درج می‌شود."
        />
      ) : (
        <>
          <div
            ref={chartScrollRef}
            onScroll={checkScroll}
            className="mt-4 h-56 w-full overflow-x-auto scroll-smooth scrollbar-none [direction:ltr]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div style={{ width: contentWidth, height: "100%" }}>
              <ResponsiveContainer height="100%" width="100%">
                <BarChart
                  barGap={4}
                  barCategoryGap={32}
                  data={dataset}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid stroke="#EBEBEB" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#808080" }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "#808080" }}
                    tickFormatter={(v) => toPersianNumber(v)}
                    tickLine={false}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-[8px] bg-[#222222] p-2 text-xs text-white shadow-lg [direction:rtl]">
                            <div className="font-bold border-b border-[#444444] pb-1 mb-1">{label}</div>
                            {payload.map((item) => (
                              <div key={item.name} className="flex items-center justify-between gap-3 py-0.5">
                                <span style={{ color: item.color }}>{item.name}:</span>
                                <span className="font-bold">{toPersianNumber(item.value)}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="ads" fill="#0048C4" maxBarSize={8} name="آگهی" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="updates" fill="#11A366" maxBarSize={8} name="بروزرسانی" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="specials" fill="#FFAA2C" maxBarSize={8} name="ویژه" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6 border-t border-[#EBEBEB] pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0048C4]" />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-[#4D4D4D] text-xs"
          >
            آگهی
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#11A366]" />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-[#4D4D4D] text-xs"
          >
            بروزرسانی
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FFAA2C]" />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-[#4D4D4D] text-xs"
          >
            ویژه
          </Typography>
        </div>
      </div>
    </>
  )}
</section>
  );
}
