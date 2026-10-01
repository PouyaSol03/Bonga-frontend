import LinearTag from "../../../../shared/icons/LinearTag";
import LinearRefresh from "../../../../shared/icons/LinearRefresh";
import LinearStartup from "../../../../shared/icons/LinearStartup";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface AgentCreditItem {
  key: string;
  label: string;
  value: number;
  deltaText: string;
  isPositive?: boolean;
  isNegative?: boolean;
  type: "ad" | "update" | "special";
}

export interface AgentCreditsCardProps {
  items?: AgentCreditItem[];
}

const defaultCredits: AgentCreditItem[] = [
  { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴% ↗", isPositive: true, type: "ad" },
  { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵% ↗", isPositive: true, type: "update" },
  { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶% ↘", isNegative: true, type: "special" },
];

const iconMap = {
  ad: { icon: LinearTag, bg: "bg-[#EEF2FF]", text: "text-[#0048C4]" },
  update: { icon: LinearRefresh, bg: "bg-[#ECFDF5]", text: "text-[#10B981]" },
  special: { icon: LinearStartup, bg: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
};

export function AgentCreditsCard({ items = defaultCredits }: AgentCreditsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Title */}
      <h2 className="mb-4 text-[14px] font-bold text-[#1A1A1A]">اعتبارها</h2>

      {/* 3 Columns for Agent */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#F3F4F6]">
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
              <span className="text-[18px] font-extrabold text-[#1A1A1A]">
                {toPersianNumber(col.value)}
              </span>

              {/* Delta or Tag */}
              <span
                className={`mt-1 text-[10px] font-medium ${
                  col.isPositive
                    ? "text-[#10B981]"
                    : col.isNegative
                      ? "text-[#EF4444]"
                      : "text-[#6B7280]"
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
