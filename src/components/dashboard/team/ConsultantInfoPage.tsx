import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

import LinearRanking from "../../(icons)/LinearRanking";
import LinearStar from "../../(icons)/LinearStar";
import LinearStairs from "../../(icons)/LinearStairs";
import LinearStartup from "../../(icons)/LinearStartup";
import LinearTag from "../../(icons)/LinearTag";
import { TopBar } from "../../TopBar";
import { ProgressLineChartCard } from "../home/DashboardHomeOverview";
import { useAgencyConsultantQuery } from "../../../hooks/agency.hooks";
import {
  ChevronDownIcon,
  ConsultantProfileSummary,
  InfoStatRow,
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
} from "./ConsultantManagementPage";

const consultantPieCards = [
  {
    agencyPercent: 75,
    badge: "۳۰",
    color: "#0048c4",
    lightColor: "#d7ddf7",
    subtitle: "مورد از ۱۳۶ مورد ثبت شده",
    title: "آگهی منتشر شده در آژانس",
    total: "۱۳۶",
    value: 25,
  },
  {
    agencyPercent: 81,
    badge: "۱۲۵",
    color: "#11a366",
    lightColor: "#bfe8d2",
    subtitle: "مورد از ۶۷۲ مورد ثبت شده",
    title: "بروزرسانی منتشر شده در آژانس",
    total: "۶۷۲",
    value: 19,
  },
  {
    agencyPercent: 68,
    badge: "۹۸",
    color: "#ffb100",
    lightColor: "#ffe9aa",
    subtitle: "مورد از ۴۹۳ مورد ثبت شده",
    title: "ویژه منتشر شده در آژانس",
    total: "۴۹۳",
    value: 32,
  },
];

export function ConsultantInfoPage() {
  const routeConsultant = getRouteConsultant();
  const consultantId = getRouteConsultantId() ?? routeConsultant.id;
  const consultantQuery = useAgencyConsultantQuery({ userId: consultantId });

  if (consultantQuery.isLoading) {
    return <ConsultantInfoPageSkeleton />;
  }

  const consultant = consultantQuery.data
    ? mapAgencyConsultantToTeamConsultant(consultantQuery.data)
    : routeConsultant;
  const formatValue = (value: number | undefined) =>
    value === undefined
      ? "—"
      : new Intl.NumberFormat("fa-IR").format(value);

  return (
    <section
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="اطلاعات مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <ConsultantProfileSummary consultant={consultant} />

        <section className="mt-5 grid gap-4">
          <article className="flex flex-col gap-8 rounded-2xl bg-white px-4 py-5">
            <InfoStatRow label="آگهی‌های فعال" value={formatValue(consultant.scores.ads)} />
            <InfoStatRow label="درخواست فعال" value="—" />
          </article>

          <article className="flex flex-col gap-8 rounded-2xl bg-white px-4 py-5">
            <InfoStatRow
              icon={<LinearStar className="h-6 w-6" />}
              label="امتیاز"
              value={formatValue(consultant.rankingScore)}
            />
            <InfoStatRow
              icon={<LinearRanking className="h-6 w-6" />}
              label="رتبه"
              value="—"
            />
          </article>

          <article className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-5">
            <InfoStatRow
              icon={<LinearTag className="h-6 w-6" />}
              iconClassName="bg-[#dfe8ff] text-[#0048c4] w-12 h-12"
              labelClassName="text-sm font-medium text-[#4D4D4D]"
              label="مانده اعتبار آگهی"
              value={formatValue(consultant.scores.ads)}
            />
            <InfoStatRow
              icon={<LinearStairs className="h-5 w-5" />}
              iconClassName="bg-[#d9f7ea] text-[#11a366] w-12 h-12"
              labelClassName="text-sm font-medium text-[#4D4D4D]"
              label="مانده بروزرسانی"
              value={formatValue(consultant.scores.steps)}
            />
            <InfoStatRow
              icon={<LinearStartup className="h-5 w-5" />}
              iconClassName="bg-[#fff0dc] text-[#ff7a00] w-12 h-12"
              labelClassName="text-sm font-medium text-[#4D4D4D]"
              label="مانده بروزرسانی"
              value={formatValue(consultant.scores.rocket)}
            />
          </article>

          {consultantPieCards.map((card, index) => (
            <ConsultantPieCard card={card} key={card.title} showTooltip={index === 0} />
          ))}

          <ProgressLineChartCard
            title="نمودار پیشرفت ثبت آگهی"
            tooltip="۸۰ آگهی"
            trendLabel="افزایش ثبت"
            trendTone="positive"
            trendValue="58%"
          />
        </section>
      </main>
    </section>
  );
}

function ConsultantInfoSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#e2e2e2] ${className}`} />;
}

function ConsultantInfoPageSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="در حال دریافت اطلاعات مشاور"
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a]"
      dir="rtl"
      role="status"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="اطلاعات مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <article className="mt-4 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-4">
            <ConsultantInfoSkeletonBlock className="h-16 w-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <ConsultantInfoSkeletonBlock className="ml-auto h-5 w-32" />
              <ConsultantInfoSkeletonBlock className="ml-auto h-4 w-24" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ConsultantInfoSkeletonBlock className="h-10 w-full rounded-xl" />
            <ConsultantInfoSkeletonBlock className="h-10 w-full rounded-xl" />
          </div>
        </article>

        <section className="mt-5 grid gap-4">
          <ConsultantInfoRowsSkeleton rows={2} />
          <ConsultantInfoRowsSkeleton rows={2} />
          <ConsultantInfoRowsSkeleton rows={3} />

          {Array.from({ length: 3 }, (_, index) => (
            <article className="rounded-2xl bg-white p-4" key={index}>
              <div className="flex items-center justify-between">
                <ConsultantInfoSkeletonBlock className="h-5 w-40" />
                <ConsultantInfoSkeletonBlock className="h-7 w-16" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ConsultantInfoSkeletonBlock className="h-6 w-12" />
                <ConsultantInfoSkeletonBlock className="h-4 w-36" />
              </div>
              <ConsultantInfoSkeletonBlock className="mx-auto mt-7 h-[180px] w-[180px] rounded-full" />
              <div className="mt-8 grid grid-cols-2 gap-8">
                <ConsultantInfoSkeletonBlock className="h-12 w-full" />
                <ConsultantInfoSkeletonBlock className="h-12 w-full" />
              </div>
            </article>
          ))}

          <article className="rounded-2xl bg-white p-4">
            <ConsultantInfoSkeletonBlock className="ml-auto h-5 w-40" />
            <ConsultantInfoSkeletonBlock className="mt-7 h-[220px] w-full" />
          </article>
        </section>
      </main>

      <span className="sr-only">در حال دریافت اطلاعات مشاور...</span>
    </section>
  );
}

function ConsultantInfoRowsSkeleton({ rows }: { rows: number }) {
  return (
    <article className="rounded-2xl bg-white px-4 py-5">
      <div className="grid gap-8">
        {Array.from({ length: rows }, (_, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center gap-3">
              <ConsultantInfoSkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
              <ConsultantInfoSkeletonBlock className="h-4 w-28" />
            </div>
            <ConsultantInfoSkeletonBlock className="h-5 w-10" />
          </div>
        ))}
      </div>
    </article>
  );
}

function ConsultantPieCard({
  card,
  showTooltip,
}: {
  card: (typeof consultantPieCards)[number];
  showTooltip?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(showTooltip ? 1 : null);
  const pieContainerRef = useRef<HTMLDivElement | null>(null);
  const data = [
    { color: card.lightColor, name: "آژانس", value: card.agencyPercent },
    { color: card.color, name: "مشاور", value: card.value },
  ];
  const selectedEntry = selectedIndex === null ? null : data[selectedIndex];
  const selectedGeometry = selectedIndex === null ? null : getPieSelectionGeometry(data, selectedIndex);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      const container = pieContainerRef.current;

      if (!container?.contains(event.target as Node)) {
        setSelectedIndex(null);
        return;
      }

      const rect = container.getBoundingClientRect();
      const scaleX = pieChartSize / rect.width;
      const scaleY = pieChartSize / rect.height;
      const pointerX = (event.clientX - rect.left) * scaleX;
      const pointerY = (event.clientY - rect.top) * scaleY;
      const distanceFromCenter = Math.hypot(pointerX - pieCenter, pointerY - pieCenter);

      if (distanceFromCenter > pieOuterRadius + pieSelectedOffset + 12) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedIndex]);

  return (
    <article className="rounded-2xl bg-white p-4">
      <div className="mb-7 grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
            {card.title}
          </h2>
          <button className="flex h-7 items-center gap-1 rounded-lg bg-transparent px-2 py-1 text-xs font-medium text-[#1a1a1a]" type="button">
            در ماه
            <ChevronDownIcon className="h-4 w-4 text-[#4d4d4d]" />
          </button>
        </div>
        <div className="flex items-center justify-start gap-2">
          <span className="rounded px-2 py-0.5 text-base font-semibold" style={{ color: card.color, backgroundColor: `${card.color}1a` }}>
            {card.badge}
          </span>
          <span className="text-sm font-normal text-[#808080]">
            {card.subtitle}
          </span>
        </div>
      </div>

      <div ref={pieContainerRef} className="relative mx-auto h-[220px] max-w-[220px]" dir="ltr">
        {selectedEntry && selectedGeometry ? (
          <>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
              viewBox={`0 0 ${pieChartSize} ${pieChartSize}`}
            >
              <line
                x1={selectedGeometry.lineStartX}
                y1={selectedGeometry.lineStartY}
                x2={selectedGeometry.lineEndX}
                y2={selectedGeometry.lineEndY}
                stroke="#1a1a1a"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
              <circle
                cx={selectedGeometry.dotX}
                cy={selectedGeometry.dotY}
                fill="#1a1a1a"
                r="7"
              />
            </svg>
            <div
              className="absolute z-20 grid place-items-center rounded-lg bg-[#333333] text-center text-xs font-semibold leading-4 text-white shadow-[0_8px_18px_rgba(26,26,26,0.18)]"
              style={{
                height: pieTooltipHeight,
                left: selectedGeometry.tooltipLeft,
                top: selectedGeometry.tooltipTop,
                width: pieTooltipWidth,
              }}
            >
              <span>
                {selectedEntry.name}
                <br />
                {selectedEntry.value}٪
              </span>
            </div>
          </>
        ) : null}
        <ResponsiveContainer height="100%" width="100%">
          <PieChart className="outline-none [&_*:focus]:outline-none" tabIndex={-1}>
            <Pie
              data={data}
              dataKey="value"
              isAnimationActive={false}
              nameKey="name"
              outerRadius={pieOuterRadius}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  className="cursor-pointer outline-none"
                  fill={selectedIndex === index ? "transparent" : entry.color}
                  key={entry.name}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </Pie>
            {selectedIndex !== null ? (
              <PulledPieSlice
                color={data[selectedIndex].color}
                data={data}
                selectedIndex={selectedIndex}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8 text-center">
        <PieLegendItem color={card.color} label="مشاور" value={`${card.value}٪`} />
        <PieLegendItem color={card.lightColor} label="آژانس" value={`${card.agencyPercent}٪`} />
      </div>
    </article>
  );
}

type PieSelectionDatum = {
  value: number;
};

const pieChartSize = 220;
const pieCenter = pieChartSize / 2;
const pieOuterRadius = 74;
const pieSelectedOffset = 9;
const pieTooltipWidth = 76;
const pieTooltipHeight = 48;
const pieTooltipGap = 28;
const pieTooltipLineOverlap = 6;

function getPieSelectionGeometry(data: PieSelectionDatum[], selectedIndex: number) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const precedingValue = data
    .slice(0, selectedIndex)
    .reduce((sum, item) => sum + item.value, 0);
  const selectedValue = data[selectedIndex]?.value ?? 0;
  
  const startAngle = 90 - (precedingValue / total) * 360;
  const midAngle = startAngle - (selectedValue / total) * 180;
  const radians = (Math.PI / 180) * midAngle;
  
  const selectedCenterX = pieCenter + pieSelectedOffset * Math.cos(radians);
  const selectedCenterY = pieCenter - pieSelectedOffset * Math.sin(radians);
  
  const pointAt = (radius: number) => ({
    x: selectedCenterX + radius * Math.cos(radians),
    y: selectedCenterY - radius * Math.sin(radians),
  });

  const dot = pointAt(38); // Dot stays deep inside the slice
  const isLeft = dot.x < pieCenter;
  const isTop = dot.y < pieCenter;

  const tooltipLeft = isLeft
    ? dot.x - pieTooltipWidth - pieTooltipGap
    : dot.x + pieTooltipGap;
  const tooltipTop = isTop
    ? dot.y - pieTooltipHeight - pieTooltipGap
    : dot.y + pieTooltipGap;

  const lineEndX = isLeft
    ? tooltipLeft + pieTooltipWidth - pieTooltipLineOverlap
    : tooltipLeft + pieTooltipLineOverlap;
  const lineEndY = isTop
    ? tooltipTop + pieTooltipHeight - pieTooltipLineOverlap
    : tooltipTop + pieTooltipLineOverlap;

  return {
    dotX: dot.x,
    dotY: dot.y,
    endAngle: startAngle - (selectedValue / total) * 360,
    lineStartX: dot.x,
    lineStartY: dot.y,
    lineEndX,
    lineEndY,
    midAngle,
    startAngle,
    tooltipLeft,
    tooltipTop,
  };
}

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
  const radians = (Math.PI / 180) * geometry.midAngle;
  const cx = pieCenter + pieSelectedOffset * Math.cos(radians);
  const cy = pieCenter - pieSelectedOffset * Math.sin(radians);

  return (
    <Sector
      cx={cx}
      cy={cy}
      endAngle={geometry.endAngle}
      fill={color}
      innerRadius={0}
      outerRadius={pieOuterRadius}
      stroke="none"
      startAngle={geometry.startAngle}
    />
  );
}

function PieLegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="grid justify-items-center gap-1">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-5 text-[#4d4d4d]">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <strong className="text-base font-semibold leading-6 text-[#1a1a1a]">
        {value}
      </strong>
    </div>
  );
}
