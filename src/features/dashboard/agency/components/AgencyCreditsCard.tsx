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
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Title */}
      <h2 className="mb-4 text-[14px] font-bold text-[#1A1A1A]">اعتبارها</h2>

      {/* 4 Columns */}
      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-[#F3F4F6]">
        {items.map((col) => {
          const cfg = iconMap[col.type];
          const Icon = cfg.icon;

          return (
            <div key={col.key} className="flex flex-col items-center px-1 text-center">
              {/* Squircle Icon */}
              <div
                className={`mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] ${cfg.bg} ${cfg.text}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <span className="mb-1 text-[11px] font-normal text-[#757575]">
                {col.label}
              </span>

              {/* Value */}
              <span className="mb-1 text-[15px] font-bold text-[#1A1A1A]">
                {toPersianNumber(col.value)}
              </span>

              {/* Delta or Unit */}
              <span
                className={`text-[10px] font-medium ${
                  col.isPositive
                    ? "text-[#10B981]"
                    : col.isNegative
                      ? "text-[#EF4444]"
                      : "text-[#9CA3AF]"
                }`}
              >
                {col.deltaText}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
