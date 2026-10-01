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

export interface AgentRegistrationProgressLineCardProps {
  data?: ProgressPoint[];
  periodLabel?: string;
  growthText?: string;
}

export function AgentRegistrationProgressLineCard({
  data = defaultData,
  periodLabel = "در سال",
  growthText = "۵۸٪ افزایش ثبت",
}: AgentRegistrationProgressLineCardProps) {
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
      <div className="mt-4 h-48 w-full" dir="ltr">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Line
              type="monotone"
              dataKey="ads"
              stroke="#0048C4"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#0048C4", strokeWidth: 1.5, stroke: "#FFF" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
