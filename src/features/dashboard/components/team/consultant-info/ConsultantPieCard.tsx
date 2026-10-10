import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import { ChevronDownIcon } from "../ConsultantCardWidgets";
import {
  getPieSelectionGeometry,
  pieCenter,
  pieChartSize,
  pieOuterRadius,
  pieSelectedOffset,
  pieTooltipHeight,
  pieTooltipWidth,
  type PieSelectionDatum,
} from "./pieGeometry";
import type { ConsultantPieDatum, PeriodKey } from "./types";

function PulledPieSlice({
  color,
  data,
  selectedIndex,
}: {
  color: string;
  data: PieSelectionDatum[];
  selectedIndex: number;
}) {
  const geometry = getPieSelectionGeometry(data, selectedIndex);
  if (!geometry) return null;
  const radians = (Math.PI / 180) * geometry.midAngle;

  return (
    <Sector
      cx={pieCenter + pieSelectedOffset * Math.cos(radians)}
      cy={pieCenter - pieSelectedOffset * Math.sin(radians)}
      endAngle={geometry.endAngle}
      fill={color}
      innerRadius={0}
      outerRadius={pieOuterRadius}
      stroke="none"
      startAngle={geometry.startAngle}
    />
  );
}

function PieLegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="grid justify-items-center gap-1">
      <Typography as="span" variant="label" size="medium" weight="medium" className="inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-on-surface-var">
        <Typography as="span" variant="body" size="medium" weight="regular" className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </Typography>
      <strong className="text-base font-semibold leading-6 text-on-surface">{value}</strong>
    </div>
  );
}

export function ConsultantPieCard({
  card,
  period = "month",
  onPeriodChange,
  showTooltip,
  isLoading = false,
}: {
  card: ConsultantPieDatum;
  period?: PeriodKey;
  onPeriodChange?: (period: PeriodKey) => void;
  showTooltip?: boolean;
  isLoading?: boolean;
}) {
  const data = [
    { color: card.agencyColorVar, name: "آژانس", value: card.agencyValue },
    { color: card.consultantColorVar, name: "مشاور", value: card.consultantValue },
  ];

  const hasChartData = data.some((d) => d.value > 0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(showTooltip && hasChartData ? 1 : null);
  const pieContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedEntry = selectedIndex === null ? null : data[selectedIndex];
  const selectedGeometry = selectedIndex === null || !hasChartData ? null : getPieSelectionGeometry(data, selectedIndex);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handlePointerDown = (event: PointerEvent) => {
      const container = pieContainerRef.current;
      if (!container?.contains(event.target as Node)) {
        setSelectedIndex(null);
        return;
      }
      const rect = container.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) * (pieChartSize / rect.width);
      const pointerY = (event.clientY - rect.top) * (pieChartSize / rect.height);
      if (Math.hypot(pointerX - pieCenter, pointerY - pieCenter) > pieOuterRadius + pieSelectedOffset + 12) {
        setSelectedIndex(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedIndex]);

  return (
    <article className="w-full bg-surface-container-lowest p-4">
      <div className="mb-7 grid gap-3">
        <div className="flex items-center justify-between">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-semibold leading-6 text-on-surface">
            {card.title}
          </Typography>
          <label className="relative flex h-7 items-center rounded-lg bg-transparent transition">
            <select
              aria-label={`بازه زمانی ${card.title}`}
              className="h-7 cursor-pointer appearance-none rounded-lg bg-transparent py-1 pl-7 pr-2 text-xs font-medium text-on-surface outline-none"
              onChange={(e) => onPeriodChange?.(e.target.value as PeriodKey)}
              value={period}
            >
              <option value="month">در ماه</option>
              <option value="year">در سال</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute left-1.5 h-3.5 w-3.5 text-on-surface-var" />
          </label>
        </div>
        <div className="flex items-center justify-start gap-2">
          {card.badge ? (
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="rounded px-2 py-0.5 text-base font-semibold"
              style={{
                backgroundColor: card.badgeBgColorVar,
                color: card.badgeColorVar,
              }}
            >
              {card.badge}
            </Typography>
          ) : null}
          {card.subtitle ? (
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal text-outline">
              {card.subtitle}
            </Typography>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[220px] w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : hasChartData ? (
        <div ref={pieContainerRef} className="relative mx-auto h-[220px] max-w-[220px]" dir="ltr">
          {selectedEntry && selectedGeometry ? (
            <>
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" viewBox={`0 0 ${pieChartSize} ${pieChartSize}`}>
                <line x1={selectedGeometry.lineStartX} y1={selectedGeometry.lineStartY} x2={selectedGeometry.lineEndX} y2={selectedGeometry.lineEndY} stroke="var(--neutral-100)" strokeLinecap="round" strokeWidth="1.6" />
                <circle cx={selectedGeometry.dotX} cy={selectedGeometry.dotY} fill="var(--neutral-100)" r="7" />
              </svg>
              <div
                className="absolute z-20 grid place-items-center rounded-lg text-center text-xs font-semibold leading-4 shadow-md"
                style={{
                  backgroundColor: "var(--neutral-300)",
                  color: "var(--surface-container-lowest)",
                  height: pieTooltipHeight,
                  left: selectedGeometry.tooltipLeft,
                  top: selectedGeometry.tooltipTop,
                  width: pieTooltipWidth,
                }}
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {selectedEntry.name}
                  <br />
                  {toPersianNumber(selectedEntry.value)}٪
                </Typography>
              </div>
            </>
          ) : null}
          <ResponsiveContainer height="100%" width="100%">
            <PieChart className="outline-none [&_*:focus]:outline-none" tabIndex={-1}>
              <Pie data={data} dataKey="value" isAnimationActive={false} nameKey="name" outerRadius={pieOuterRadius} startAngle={90} endAngle={-270} stroke="none">
                {data.map((entry, index) => (
                  <Cell className="cursor-pointer outline-none" fill={selectedIndex === index ? "transparent" : entry.color} key={entry.name} onClick={() => setSelectedIndex(index)} />
                ))}
              </Pie>
              {selectedIndex !== null && data[selectedIndex] && hasChartData ? (
                <PulledPieSlice color={data[selectedIndex].color} data={data} selectedIndex={selectedIndex} />
              ) : null}
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] w-full flex-col items-center justify-center text-center">
          <Typography as="span" variant="body" size="small" weight="medium" className="text-outline">
            داده‌ای برای این بازه ثبت نشده است.
          </Typography>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-8 text-center" dir="rtl">
        <PieLegendItem color={card.consultantColorVar} label="مشاور" value={`${toPersianNumber(card.consultantValue)}٪`} />
        <PieLegendItem color={card.agencyColorVar} label="آژانس" value={`${toPersianNumber(card.agencyValue)}٪`} />
      </div>
    </article>
  );
}
