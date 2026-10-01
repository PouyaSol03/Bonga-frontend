import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

interface ProgressPoint {
  month: string;
  ads: number;
}

const defaultData: ProgressPoint[] = [
  { month: "فروردین", ads: 31 },
  { month: "اردیبهشت", ads: 52 },
  { month: "خرداد", ads: 35 },
  { month: "تیر", ads: 80 },
  { month: "مرداد", ads: 57 },
  { month: "شهریور", ads: 61 },
  { month: "مهر", ads: 40 },
  { month: "آبان", ads: 81 },
  { month: "آذر", ads: 71 },
  { month: "دی", ads: 87 },
];

export interface AgencyRegistrationProgressLineCardProps {
  data?: ProgressPoint[];
  periodLabel?: string;
  growthText?: string;
}

export function AgencyRegistrationProgressLineCard({
  data = defaultData,
  periodLabel = "در سال",
  growthText = "۵۸٪ افزایش ثبت",
}: AgencyRegistrationProgressLineCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          نمودار پیشرفت ثبت آگهی
        </h2>
        <button
          className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] px-2.5 py-1 text-xs text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer bg-white"
          type="button"
        >
          <span>{periodLabel}</span>
          <LinearArrowDown1 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Sub-metric */}
      <div className="mt-2 text-[12px] font-medium text-[#10B981]">
        {growthText} ↗
      </div>

      {/* Line Chart */}
      <div className="mt-4 h-48 w-full [direction:ltr]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#757575" }}
              tickFormatter={(v) => toPersianNumber(v)}
              tickLine={false}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Line
              dataKey="ads"
              dot={{ r: 3, fill: "#ffffff", stroke: "#0048C4", strokeWidth: 2 }}
              stroke="#0048C4"
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
