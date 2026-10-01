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

interface ConsultantDatum {
  name: string;
  ads: number;
  updates: number;
  specials: number;
}

const defaultData: ConsultantDatum[] = [
  { name: "عابدی", ads: 45, updates: 30, specials: 15 },
  { name: "اشرفی", ads: 60, updates: 40, specials: 25 },
  { name: "مطلبی", ads: 75, updates: 43, specials: 20 },
  { name: "رفیعی", ads: 50, updates: 35, specials: 10 },
  { name: "زیرک", ads: 65, updates: 50, specials: 30 },
];

export interface AgencyConsultantsBarChartCardProps {
  data?: ConsultantDatum[];
  totalAds?: number;
  periodLabel?: string;
}

export function AgencyConsultantsBarChartCard({
  data = defaultData,
  totalAds = 325,
  periodLabel = "در ماه",
}: AgencyConsultantsBarChartCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">فعالیت مشاورین</h2>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] px-2.5 py-1 text-xs text-[#4D4D4D] transition hover:bg-neutral-50 active:scale-95 cursor-pointer bg-white"
            type="button"
          >
            <span>{periodLabel}</span>
            <LinearArrowDown1 className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-1 [direction:ltr]">
            <button
              aria-label="قبلی"
              className="flex h-6 w-6 items-center justify-center text-[#757575] hover:bg-neutral-100 cursor-pointer border-none bg-transparent"
              type="button"
            >
              <LinearArrowLeft1 className="h-3.5 w-3.5" />
            </button>
            <button
              aria-label="بعدی"
              className="flex h-6 w-6 items-center justify-center text-[#757575] hover:bg-neutral-100 cursor-pointer border-none bg-transparent"
              type="button"
            >
              <LinearArrowRight1 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-metric */}
      <div className="mt-2 text-[13px] font-bold text-[#1A1A1A]">
        <span>{toPersianNumber(totalAds)}</span>
        <span className="font-normal text-[#757575] mr-1">آگهی ثبت شده</span>
      </div>

      {/* Grouped Bar Chart */}
      <div className="mt-4 h-52 w-full [direction:ltr]">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid stroke="#E5E5E5" strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="name"
              tick={{ fontSize: 11, fill: "#757575" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#757575" }}
              tickFormatter={(v) => toPersianNumber(v)}
              tickLine={false}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Bar dataKey="ads" fill="#0052CC" maxBarSize={8} radius={[2, 2, 0, 0]} />
            <Bar dataKey="updates" fill="#00A86B" maxBarSize={8} radius={[2, 2, 0, 0]} />
            <Bar dataKey="specials" fill="#FFAA00" maxBarSize={8} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6 border-t border-[#F1F5F9] pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0052CC]" />
          <span className="text-[#4D4D4D]">آگهی</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00A86B]" />
          <span className="text-[#4D4D4D]">بروزرسانی</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFAA00]" />
          <span className="text-[#4D4D4D]">ویژه</span>
        </div>
      </div>
    </section>
  );
}
