import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

interface SliceData {
  name: string;
  value: number;
  color: string;
}

const defaultData: SliceData[] = [
  { name: "فروش", value: 48, color: "#F38E8A" },
  { name: "اجاره", value: 40, color: "#FDE080" },
  { name: "پروژه و مشارکت", value: 12, color: "#A9B8EA" },
];

export interface AgentPublishedAdsPieCardProps {
  totalCount?: number;
  data?: SliceData[];
  periodLabel?: string;
  onPeriodChange?: () => void;
}

export function AgentPublishedAdsPieCard({
  totalCount = 183,
  data = defaultData,
  periodLabel = "در ماه",
  onPeriodChange,
}: AgentPublishedAdsPieCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          آگهی منتشر شده
        </h2>
        <button
          className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] px-2.5 py-1 text-xs text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer bg-white"
          onClick={onPeriodChange}
          type="button"
        >
          <span>{periodLabel}</span>
          <LinearArrowDown1 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Counter */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[28px] font-extrabold text-[#0048C4]">
          {toPersianNumber(totalCount)}
        </span>
        <span className="text-[12px] font-normal text-[#757575]">
          آگهی ثبت شده
        </span>
      </div>

      {/* Pie Chart */}
      <div className="relative mt-2 h-48 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-[#4D4D4D]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
            <span className="font-semibold text-[#1A1A1A]">
              {toPersianNumber(item.value)}٪
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
