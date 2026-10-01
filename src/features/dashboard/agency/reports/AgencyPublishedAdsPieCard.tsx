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

export interface AgencyPublishedAdsPieCardProps {
  totalCount?: number;
  data?: SliceData[];
  periodLabel?: string;
  onPeriodChange?: () => void;
}

export function AgencyPublishedAdsPieCard({
  totalCount = 183,
  data = defaultData,
  periodLabel = "در ماه",
  onPeriodChange,
}: AgencyPublishedAdsPieCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          آگهی منتشر شده در آژانس
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
              cx="50%"
              cy="50%"
              data={data}
              dataKey="value"
              innerRadius={0}
              isAnimationActive={false}
              outerRadius={80}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[#F1F5F9] pt-3 text-center">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-[#757575]">
                {item.name}
              </span>
            </div>
            <span className="mt-1 text-[13px] font-bold text-[#1A1A1A]">
              {toPersianNumber(item.value)}٪
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
