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

export interface AgentViewsBarChartCardProps {
  data?: MonthViewData[];
  periodLabel?: string;
  trendText?: string;
}

export function AgentViewsBarChartCard({
  data = defaultViewsData,
  periodLabel = "در سال",
  trendText = "۲۳% کاهش پیشرفت",
}: AgentViewsBarChartCardProps) {
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
        <div className="flex items-center gap-1 text-xs font-semibold text-[#EE3623]">
          <span>{trendText}</span>
          <span>↓</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-white text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer"
            type="button"
          >
            <LinearArrowRight1 className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-white text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer"
            type="button"
          >
            <LinearArrowLeft1 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-4 h-48 w-full" dir="ltr">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#808080" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#808080" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => toPersianNumber(v)}
            />
            <Bar
              dataKey="views"
              fill="#0048C4"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
