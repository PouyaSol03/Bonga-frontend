import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

interface MonthViewData {
  month: string;
  views: number;
}

const defaultViewsData: MonthViewData[] = [
  { month: "فروردین", views: 200 },
  { month: "اردیبهشت", views: 300 },
  { month: "خرداد", views: 250 },
  { month: "تیر", views: 400 },
  { month: "مرداد", views: 200 },
  { month: "شهریور", views: 450 },
  { month: "مهر", views: 150 },
  { month: "آبان", views: 250 },
  { month: "آذر", views: 100 },
  { month: "دی", views: 300 },
];

export interface AgencyViewsBarChartCardProps {
  data?: MonthViewData[];
  periodLabel?: string;
  trendText?: string;
}

export function AgencyViewsBarChartCard({
  data = defaultViewsData,
  periodLabel = "در سال",
  trendText = "۲۳% کاهش پیشرفت",
}: AgencyViewsBarChartCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          نمودار بازدید آگهی‌ها
        </h2>
        <button
          className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] px-2.5 py-1 text-xs text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer bg-white"
          type="button"
        >
          <span>{periodLabel}</span>
          <LinearArrowDown1 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Sub-metric & Controls */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#EF4444]">
          {trendText} ↘
        </span>
        <div className="flex items-center gap-1 [direction:ltr]">
          <button
            aria-label="ماه قبل"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-[#757575] hover:bg-neutral-100 cursor-pointer border-none bg-transparent"
            type="button"
          >
            <LinearArrowLeft1 className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="ماه بعد"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-[#757575] hover:bg-neutral-100 cursor-pointer border-none bg-transparent"
            type="button"
          >
            <LinearArrowRight1 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-4 h-48 w-full [direction:ltr]">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="#E5E5E5" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              interval={0}
              tick={{ fontSize: 9, fill: "#757575" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 500]}
              tick={{ fontSize: 9, fill: "#757575" }}
              tickFormatter={(v) => toPersianNumber(v)}
              tickLine={false}
              ticks={[0, 100, 200, 300, 400, 500]}
            />
            <Bar
              dataKey="views"
              fill="#0048C4"
              isAnimationActive={false}
              maxBarSize={14}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
