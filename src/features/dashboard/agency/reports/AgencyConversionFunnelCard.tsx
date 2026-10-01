import { formatNumber, toPersianNumber } from "../../../../shared/lib/numberUtils";

interface FunnelStage {
  id: string;
  label: string;
  value: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  isValueGreen?: boolean;
}

const defaultStages: FunnelStage[] = [
  {
    id: "views",
    label: "بازدید آگهی",
    value: formatNumber(1245),
    badgeText: "۱۰۰٪",
    badgeBg: "bg-[#0048C4]",
    badgeTextColor: "text-white",
  },
  {
    id: "leads",
    label: "سرنخ‌ها",
    value: toPersianNumber(82),
    badgeText: "۶.۶٪",
    badgeBg: "bg-[#D1FAE5]",
    badgeTextColor: "text-[#059669]",
  },
  {
    id: "following",
    label: "در حال پیگیری",
    value: `${toPersianNumber(37)} نفر`,
    badgeText: "۴۵٪",
    badgeBg: "bg-[#EEF2FF]",
    badgeTextColor: "text-[#4338CA]",
  },
  {
    id: "scheduled_visit",
    label: "بازدید برنامه‌ریزی شده",
    value: `${toPersianNumber(12)} نفر`,
    badgeText: "۳۲٪",
    badgeBg: "bg-[#FEF9C3]",
    badgeTextColor: "text-[#A16207]",
  },
  {
    id: "completed_visit",
    label: "بازدید انجام شده",
    value: `${toPersianNumber(8)} نفر`,
    badgeText: "۶۶٪",
    badgeBg: "bg-[#CCFBF1]",
    badgeTextColor: "text-[#0F766E]",
  },
  {
    id: "final_deal",
    label: "وضعیت نهایی آگهی",
    value: "معامله شد",
    badgeText: "✓",
    badgeBg: "bg-[#DCFCE7]",
    badgeTextColor: "text-[#15803D]",
    isValueGreen: true,
  },
];

export interface AgencyConversionFunnelCardProps {
  stages?: FunnelStage[];
}

export function AgencyConversionFunnelCard({
  stages = defaultStages,
}: AgencyConversionFunnelCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      <h2 className="mb-3 text-[14px] font-bold text-[#1A1A1A]">
        نرخ تبدیل آگهی‌ها
      </h2>

      <div className="flex flex-col gap-2">
        {stages.map((st) => (
          <div
            key={st.id}
            className="flex items-center justify-between rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-xs"
          >
            {/* Right: Badge + Label */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 min-w-[36px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${st.badgeBg} ${st.badgeTextColor}`}
              >
                {st.badgeText}
              </span>
              <span className="text-[12px] font-medium text-[#4D4D4D]">
                {st.label}
              </span>
            </div>

            {/* Left: Value */}
            <span
              className={`text-[12px] font-bold ${
                st.isValueGreen ? "text-[#10B981]" : "text-[#1A1A1A]"
              }`}
            >
              {st.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
