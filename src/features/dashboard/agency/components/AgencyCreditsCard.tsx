import LinearTag from "../../../../shared/icons/LinearTag";
import LinearRefresh from "../../../../shared/icons/LinearRefresh";
import LinearStartup from "../../../../shared/icons/LinearStartup";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { AgencyCreditItem } from "../types";

export interface AgencyCreditsCardProps {
  items?: AgencyCreditItem[];
}

const defaultCredits: AgencyCreditItem[] = [
  { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴% ↗", isPositive: true, type: "ad" },
  { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵% ↗", isPositive: true, type: "update" },
  { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶% ↘", isNegative: true, type: "special" },
  { key: "expiry", label: "اعتبار", value: 249, deltaText: "روز", type: "expiry" },
];

const iconMap = {
  ad: { icon: LinearTag, bg: "bg-[#EEF2FF]", text: "text-[#0048C4]" },
  update: { icon: LinearRefresh, bg: "bg-[#ECFDF5]", text: "text-[#10B981]" },
  special: { icon: LinearStartup, bg: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
  expiry: { icon: LinearCalendar, bg: "bg-[#F1F5F9]", text: "text-[#475569]" },
};

export function AgencyCreditsCard({ items = defaultCredits }: AgencyCreditsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-5 shadow-sm [direction:rtl]">
      {/* Title */}
      <h2 className="mb-4 text-[18px] font-bold text-[#1A1A1A]">اعتبارها</h2>

      {/* 4 Columns with standalone centered dividers */}
      <div className="flex w-full items-center justify-between">
        {items.map((col, idx) => {
          const cfg = iconMap[col.type];
          const Icon = cfg.icon;
          const isNotLast = idx < items.length - 1;

          return (
            <div key={col.key} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center text-center">
                {/* Squircle Icon 48x48 */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${cfg.bg} ${cfg.text}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Label */}
                <span className="mt-2 mb-1.5 text-[13px] font-medium text-[#4D4D4D]">
                  {col.label}
                </span>

                {/* Value */}
                <span className="mb-1 text-[26px] font-bold leading-tight text-[#1A1A1A]">
                  {toPersianNumber(col.value)}
                </span>

                {/* Delta or Unit */}
                <span
                  className={`text-[12px] font-semibold ${
                    col.isPositive
                      ? "text-[#059669]"
                      : col.isNegative
                        ? "text-[#DC2626]"
                        : "text-[#6B7280]"
                  }`}
                >
                  {col.deltaText}
                </span>
              </div>

              {/* Partial vertical divider */}
              {isNotLast && (
                <div className="h-[120px] w-[1px] rounded-full bg-[#F0F0F0]" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
