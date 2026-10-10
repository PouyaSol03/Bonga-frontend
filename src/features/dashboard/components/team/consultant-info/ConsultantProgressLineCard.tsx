import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import { ChevronDownIcon } from "../ConsultantCardWidgets";
import type { PeriodKey } from "./types";

interface ConsultantProgressLineCardProps {
  data: Array<{ month: string; value: number }>;
  period?: PeriodKey;
  onPeriodChange?: (p: PeriodKey) => void;
  increasePercent?: number;
  isLoading?: boolean;
}

export function ConsultantProgressLineCard({
  data,
  period = "year",
  onPeriodChange,
  increasePercent,
  isLoading = false,
}: ConsultantProgressLineCardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
    <article className="w-full bg-surface-container-lowest p-4">
      <div className="mb-4 grid gap-1">
        <div className="flex items-center justify-between">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-on-surface">
            نمودار پیشرفت ثبت آگهی
          </Typography>
          <label className="relative flex h-7 items-center rounded-lg bg-transparent transition">
            <select
              aria-label="بازه زمانی نمودار پیشرفت"
              className="h-7 cursor-pointer appearance-none rounded-lg bg-transparent py-1 pl-7 pr-2 text-xs font-medium text-on-surface outline-none"
              onChange={(e) => onPeriodChange?.(e.target.value as PeriodKey)}
              value={period}
            >
              <option value="year">در سال</option>
              <option value="month">در ماه</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute left-1.5 h-3.5 w-3.5 text-on-surface-var" />
          </label>
        </div>
        {increasePercent !== undefined && data.length > 0 ? (
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M11.5 4.5L4.5 11.5M11.5 4.5H6.5M11.5 4.5V9.5" stroke="var(--tertiary-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Typography as="span" variant="label" size="medium" weight="medium" style={{ color: "var(--tertiary-400)" }}>
              {toPersianNumber(increasePercent)}٪ افزایش ثبت
            </Typography>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex h-[260px] w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="h-[260px] w-full" dir="ltr">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={data}
              margin={{ bottom: 20, left: -20, right: 15, top: 45 }}
            >
              <CartesianGrid
                horizontal
                stroke="var(--outline-var)"
                strokeDasharray="4 5"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="month"
                height={55}
                interval={0}
                tickLine={false}
                tick={(props: any) => {
                  const x = Number(props.x) || 0;
                  const y = Number(props.y) || 0;
                  return (
                    <g transform={`translate(${x}, ${y + 24})`}>
                      <text
                        dominantBaseline="middle"
                        fill="var(--neutral-300)"
                        fontSize="11"
                        fontWeight="500"
                        textAnchor="start"
                        transform="rotate(90)"
                      >
                        {props.payload?.value}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                axisLine={false}
                domain={[0, 100]}
                tick={{ fill: "var(--neutral-500)", fontSize: 10 }}
                tickFormatter={(value) => toPersianNumber(value)}
                tickLine={false}
              />
              <Line
                activeDot={false}
                dataKey="value"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSelected = selectedMonth === payload.month;
                  return (
                    <g key={payload.month}>
                      {isSelected ? (
                        <g>
                          <rect
                            fill="var(--neutral-300)"
                            height={24}
                            rx={4}
                            width={32}
                            x={cx - 16}
                            y={cy - 34}
                          />
                          <text
                            dominantBaseline="middle"
                            fill="var(--surface-container-lowest)"
                            fontSize="11"
                            fontWeight="600"
                            textAnchor="middle"
                            x={cx}
                            y={cy - 22}
                          >
                            {toPersianNumber(payload.value)}
                          </text>
                        </g>
                      ) : null}
                      <circle
                        cx={cx}
                        cy={cy}
                        fill={isSelected ? "var(--primary-400)" : "var(--surface-container-lowest)"}
                        onClick={() => setSelectedMonth(payload.month)}
                        r={isSelected ? 6 : 4.5}
                        stroke="var(--primary-400)"
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                      />
                    </g>
                  );
                }}
                stroke="var(--primary-400)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[260px] w-full flex-col items-center justify-center text-center">
          <Typography as="span" variant="body" size="small" weight="medium" className="text-outline">
            داده‌ای برای این بازه ثبت نشده است.
          </Typography>
        </div>
      )}
    </article>
  );
}
