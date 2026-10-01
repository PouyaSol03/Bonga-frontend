import type { ComponentType } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import LinearTag from "../../../shared/icons/LinearTag";
import LinearRefresh from "../../../shared/icons/LinearRefresh";
import LinearStar from "../../../shared/icons/LinearStar";
import LinearClock from "../../../shared/icons/LinearClock";

import LinearCalendar from "../../../shared/icons/LinearCalendar";

export interface DashboardCreditItem {
  key: string;
  label: string;
  value: number;
  deltaText: string;
  isPositive?: boolean;
  isNegative?: boolean;
  type: "ad" | "refresh" | "update" | "special" | "extend" | "ladder" | "urgent" | "expiry";
}

const iconMap: Record<
  string,
  { icon: ComponentType<{ className?: string }>; bg: string; text: string }
> = {
  ad: { icon: LinearTag, bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
  refresh: { icon: LinearRefresh, bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  update: { icon: LinearRefresh, bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  special: { icon: LinearStar, bg: "bg-[#FFFBEB]", text: "text-[#D97706]" },
  extend: { icon: LinearClock, bg: "bg-[#F5F3FF]", text: "text-[#7C3AED]" },
  expiry: { icon: LinearCalendar, bg: "bg-[#F1F5F9]", text: "text-[#475569]" },
  ladder: { icon: LinearRefresh, bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  urgent: { icon: LinearClock, bg: "bg-[#F5F3FF]", text: "text-[#7C3AED]" },
};

export interface DashboardCreditsCardProps {
  title?: string;
  items: DashboardCreditItem[];
}

export function DashboardCreditsCard({
  title = "اعتبارها",
  items,
}: DashboardCreditsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-5 shadow-sm [direction:rtl]">
      {/* Title */}
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="mb-4 text-[#1A1A1A]">
        {title}
      </Typography>

      {/* Columns with standalone vertical separators */}
      <div className="flex w-full items-center justify-between">
        {items.map((col, idx) => {
          const cfg = iconMap[col.type] ?? iconMap.ad;
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
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="mt-2 mb-1.5 text-[#4D4D4D]"
                >
                  {col.label}
                </Typography>

                {/* Value */}
                <span className="mb-1 text-[26px] font-bold leading-tight text-[#1A1A1A]">
                  {toPersianNumber(col.value)}
                </span>

                {/* Delta / Trend */}
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="semibold"
                  className={
                    col.isPositive
                      ? "text-[#059669]"
                      : col.isNegative
                        ? "text-[#DC2626]"
                        : "text-[#6B7280]"
                  }
                >
                  {col.deltaText}
                </Typography>
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
