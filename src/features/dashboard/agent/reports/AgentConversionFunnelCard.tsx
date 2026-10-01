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

export interface AgentConversionFunnelCardProps {
  stages?: FunnelStage[];
}

export function AgentConversionFunnelCard({
  stages = defaultStages,
}: AgentConversionFunnelCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <h2 className="mb-4 text-[14px] font-bold text-[#1A1A1A]">
        نرخ تبدیل آگهی‌ها
      </h2>

      {/* Stages list */}
      <div className="flex flex-col gap-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex items-center justify-between border-b border-[#F5F5F5] pb-2 last:border-b-0 last:pb-0"
          >
            {/* Label */}
            <span className="text-[12px] font-medium text-[#4D4D4D]">
              {stage.label}
            </span>

            {/* Value + Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[12px] font-bold ${
                  stage.isValueGreen ? "text-[#10B981]" : "text-[#1A1A1A]"
                }`}
              >
                {stage.value}
              </span>

              <span
                className={`inline-flex min-w-10 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold ${stage.badgeBg} ${stage.badgeTextColor}`}
              >
                {stage.badgeText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
