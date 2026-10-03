import type { ComponentType } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import LinearTag from "../../../shared/icons/LinearTag";
import LinearRefresh from "../../../shared/icons/LinearRefresh";
import LinearClock from "../../../shared/icons/LinearClock";

import LinearCalendar from "../../../shared/icons/LinearCalendar";
import LinearStartup from "../../../shared/icons/LinearStartup";
import LinearChartUp from "../../../shared/icons/LinearChartUp";
import LinearChartDown from "../../../shared/icons/LinearChartDown";

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
  ad: { icon: LinearTag, bg: "bg-primary-container", text: "text-primary" },
  refresh: { icon: LinearRefresh, bg: "bg-tertiary-container", text: "text-tertiary" },
  update: { icon: LinearRefresh, bg: "bg-tertiary-container", text: "text-tertiary" },
  special: { icon: LinearStartup, bg: "bg-warning-container", text: "text-warning" },
  extend: { icon: LinearClock, bg: "bg-secondary-container", text: "text-secondary" },
  expiry: { icon: LinearCalendar, bg: "bg-surface-container-high", text: "text-on-surface-var" },
  ladder: { icon: LinearRefresh, bg: "bg-tertiary-container", text: "text-tertiary" },
  urgent: { icon: LinearClock, bg: "bg-warning-container", text: "text-warning" },
};

export interface DashboardCreditsCardProps {
  title?: string;
  items?: DashboardCreditItem[];
}

const defaultCredits: DashboardCreditItem[] = [
  { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴%", isPositive: true, type: "ad" },
  { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵%", isPositive: true, type: "refresh" },
  { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶%", isNegative: true, type: "special" },
  { key: "expiry", label: "اعتبار", value: 12, deltaText: "روز", type: "expiry" },
];

export function DashboardCreditsCard({
  title = "اعتبارها",
  items = defaultCredits,
}: DashboardCreditsCardProps) {
  const creditList = Array.isArray(items) && items.length > 0 ? items : defaultCredits;

  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest shadow-sm [direction:rtl]">
      {/* Title */}
      <Typography as="h2" variant="label" size="large" weight="medium" className="mb-2.5 pt-4 pr-4 text-on-surface">
        {title}
      </Typography>

      {/* Columns with standalone vertical separators */}
      <div className="flex w-full items-center justify-between">
        {creditList.map((col, idx) => {
          const cfg = iconMap[col.type] ?? iconMap.ad;
          const Icon = cfg.icon;
          const isNotLast = idx < creditList.length - 1;

          return (
            <div key={col.key} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center gap-2 text-center py-4">
                {/* Squircle Icon 48x48 */}
                <div
                  className={`flex p-2 items-center justify-center rounded-[14px] ${cfg.bg} ${cfg.text}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Label */}
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="text-on-surface-var"
                >
                  {col.label}
                </Typography>

                {/* Value */}
                <Typography variant="title" size="large" weight="medium" className="text-on-surface">
                  {toPersianNumber(col.value)}
                </Typography>

                {/* Delta / Trend */}
                <div className="flex items-center justify-center gap-1">
                  {col.isPositive ? (
                    <LinearChartUp className="h-4 w-4 text-tertiary" />
                  ) : col.isNegative ? (
                    <LinearChartDown className="h-4 w-4 text-error" />
                  ) : null}
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="semibold"
                    className={
                      col.isPositive
                        ? "text-tertiary"
                        : col.isNegative
                          ? "text-error"
                          : "text-outline"
                    }
                  >
                    {col.deltaText}
                  </Typography>
                </div>
              </div>

              {/* Partial vertical divider */}
              {isNotLast && (
                <div className="h-[120px] w-[1px] rounded-full bg-surface-container" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
