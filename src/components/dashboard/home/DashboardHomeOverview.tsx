import { useRef } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LinearAd from "../../(icons)/LinearAd";
import LinearCalendar from "../../(icons)/LinearCalendar";
import LinearChartUp from "../../(icons)/LinearChartUp";
import LinearClock from "../../(icons)/LinearClock";
import LinearRanking from "../../(icons)/LinearRanking";
import LinearStar from "../../(icons)/LinearStar";
import LinearStartup from "../../(icons)/LinearStartup";
import LinearViewOn from "../../(icons)/LinearViewOn";
import {
  adTypeData,
  consultantActivityData,
  consultantRanks,
  dashboardActivities,
  dashboardMetrics,
  type DashboardMetric,
  type DashboardMetricTone,
} from "./dashboardHomeData";

const numberFormatter = new Intl.NumberFormat("fa-IR");

const metricIcons: Record<
  DashboardMetric["icon"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  ad: LinearAd,
  calendar: LinearCalendar,
  chart: LinearChartUp,
  startup: LinearStartup,
};

const toneClasses: Record<
  DashboardMetricTone,
  { bg: string; icon: string; ring: string }
> = {
  amber: {
    bg: "bg-[#ffead3]",
    icon: "text-[#ff6b1a]",
    ring: "ring-[#ffead3]",
  },
  blue: {
    bg: "bg-[#d9defb]",
    icon: "text-[#0048c4]",
    ring: "ring-[#d9defb]",
  },
  green: {
    bg: "bg-[#d7f5e9]",
    icon: "text-[#11a366]",
    ring: "ring-[#d7f5e9]",
  },
  neutral: {
    bg: "bg-[#e7e9f2]",
    icon: "text-[#334466]",
    ring: "ring-[#e7e9f2]",
  },
};

const trendClasses = {
  negative: "text-[#c11004]",
  neutral: "text-[#808080]",
  positive: "text-[#11a366]",
};

const activityToneClasses = {
  amber: "bg-[#fff7e6] text-[#a76600]",
  blue: "bg-[#eef4ff] text-[#0048c4]",
  green: "bg-[#eaf8f3] text-[#11a366]",
};

const chartNameMap: Record<string, string> = {
  ads: "آگهی",
  renewals: "بروزرسانی",
  requests: "درخواست",
  specials: "ویژه",
};

const consultantChartItemWidth = 82;
const consultantChartAxisWidth = 38;
const consultantVisibleItems = 4;
const consultantChartViewportWidth =
  consultantVisibleItems * consultantChartItemWidth + consultantChartAxisWidth;
const consultantChartWidth =
  consultantActivityData.length * consultantChartItemWidth + consultantChartAxisWidth;

const progressChartMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const progressChartMonthWidth = 34;
const progressChartAxisWidth = 28;
const progressChartVisibleMonths = 9;
const progressChartViewportWidth =
  progressChartAxisWidth + progressChartVisibleMonths * progressChartMonthWidth;
const progressChartWidth =
  progressChartAxisWidth + progressChartMonths.length * progressChartMonthWidth;

const agencyRankingRows = [
  { name: "املاک محسنیان", rank: 1, score: 90 },
  { name: "املاک ایوان", rank: 2, score: 89 },
  { name: "املاک تمدن", rank: 3, score: 86 },
  { name: "املاک کوشش", rank: 4, score: 85 },
  { name: "املاک محسنیان", rank: 5, score: 82 },
];

function formatNumber(value: number | string) {
  return numberFormatter.format(Number(value));
}

export function DashboardHomeOverview() {
  return (
    <div className="grid gap-5 pb-2">
      <section className="grid gap-4 rounded-none bg-[#eeeeee] p-4">
        {dashboardMetrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PublishedAgencyAdsCard />

        <ConsultantActivityCard />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <div className="grid gap-5">
          <ProgressLineChartCard
            title="نمودار پیشرفت ثبت آگهی"
            tooltip="۸۰ آگهی"
            trendLabel="افزایش ثبت"
            trendTone="positive"
            trendValue="۵۸٪"
          />
          <ProgressLineChartCard
            title="نمودار پیشرفت رتبه"
            tooltip="۱۲"
            trendLabel="کاهش پیشرفت"
            trendTone="negative"
            trendValue="۲۳٪"
          />
          <AgencyRankingScoreCard />
        </div>

        <div className="grid gap-5">
          <article className="rounded-xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                <LinearViewOn className="h-6 w-6" />
              </span>
              <div className="text-right">
                <h2 className="m-0 text-base font-bold text-[#1a1a1a]">
                  خلاصه فعالیت
                </h2>
                <p className="m-0 mt-1 text-xs font-semibold text-[#808080]">
                  وضعیت امروز آژانس
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {dashboardActivities.map((activity) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[#f0f0f0] px-4 py-3"
                  key={activity.label}
                >
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-black ${activityToneClasses[activity.tone]}`}
                  >
                    {activity.amount}
                  </span>
                  <span className="text-sm font-semibold text-[#303030]">
                    {activity.label}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff7e6] text-[#ff9f00]">
                <LinearStar className="h-6 w-6" />
              </span>
              <div className="text-right">
                <h2 className="m-0 text-base font-bold text-[#1a1a1a]">
                  مشاورین برتر
                </h2>
                <p className="m-0 mt-1 text-xs font-semibold text-[#808080]">
                  بر اساس امتیاز عملکرد
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {consultantRanks.map((consultant, index) => (
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-[#f0f0f0] px-3 py-3"
                  key={consultant.name}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5f7fb] text-sm font-black text-[#0048c4]">
                    {formatNumber(index + 1)}
                  </span>
                  <div className="min-w-0 text-right">
                    <p className="m-0 truncate text-sm font-bold text-[#1a1a1a]">
                      {consultant.name}
                    </p>
                    <p className="m-0 mt-1 truncate text-xs font-medium text-[#808080]">
                      {consultant.status}، {formatNumber(consultant.ads)} آگهی
                    </p>
                  </div>
                  <strong className="text-sm font-black text-[#11a366]">
                    {formatNumber(consultant.score)}
                  </strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function AgencyRankingScoreCard() {
  return (
    <article className="rounded-[24px] bg-white px-5 pb-6 pt-6">
      <h2 className="m-0 text-right text-xl font-black leading-8 text-[#1a1a1a]">
        رتبه و امتیاز آژانس
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4" dir="rtl">
        <AgencyRankMetric
          icon={<LinearRanking className="h-6 w-6" />}
          label="رتبه"
          value="۶۷"
        />
        <AgencyRankMetric
          icon={<LinearStar className="h-6 w-6" />}
          label="امتیاز"
          value="۸۵"
        />
      </div>

      <div className="mt-6 grid gap-2">
        <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center px-3 text-xs font-medium leading-5 text-[#666666]">
          <span className="text-left">امتیاز</span>
          <span className="text-right">۱۰ آژانس برتر</span>
        </div>

        {agencyRankingRows.map((agency) => (
          <div
            className="grid min-h-[36px] grid-cols-[56px_minmax(0,1fr)] items-center rounded-xl bg-[#f7f7f7] px-3 text-sm font-semibold leading-6"
            key={`${agency.rank}-${agency.name}`}
          >
            <span className="text-left font-black text-[#11a366]">
              {formatNumber(agency.score)}
            </span>
            <span className="truncate text-right text-[#1a1a1a]">
              {formatNumber(agency.rank)}. {agency.name}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function AgencyRankMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-[54px] items-center justify-between gap-2 rounded-2xl bg-[#f7f7f7] px-4">
      <strong className="text-lg font-black leading-7 text-[#11a366]">
        {value}
      </strong>
      <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium leading-5 text-[#1a1a1a]">
        <span className="truncate">{label}</span>
        <span className="text-[#4d4d4d]">{icon}</span>
      </span>
    </div>
  );
}

function ProgressLineChartCard({
  title,
  tooltip,
  trendLabel,
  trendTone,
  trendValue,
}: {
  title: string;
  tooltip: string;
  trendLabel: string;
  trendTone: "negative" | "positive";
  trendValue: string;
}) {
  const trendClassName =
    trendTone === "positive" ? "text-[#11a366]" : "text-[#ee3623]";

  return (
    <article className="overflow-hidden rounded-[24px] bg-white px-7 pb-8 pt-8">
      <div className="flex items-start justify-between gap-4">
        <button
          className="inline-flex items-center gap-3 rounded-lg bg-transparent px-0 py-1 text-sm font-semibold text-[#1a1a1a]"
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rotate-45 border-b border-r border-[#303030]"
          />
          در سال
        </button>

        <div className="text-right">
          <h2 className="m-0 text-base font-black leading-8 text-[#1a1a1a]">
            {title}
          </h2>
          <p
            className={`m-0 mt-2 inline-flex items-center justify-end gap-1 text-sm font-medium leading-6 ${trendClassName}`}
          >
            <LinearChartUp
              className={`h-4 w-4 ${trendTone === "negative" ? "rotate-180" : ""}`}
            />
            <strong className="font-black">{trendValue}</strong>
            <span className="text-[#808080]">{trendLabel}</span>
          </p>
        </div>
      </div>

      <ScrollableProgressLineChart tooltip={tooltip} />
    </article>
  );
}

function ScrollableProgressLineChart({ tooltip }: { tooltip: string }) {
  return (
    <div
      className="mx-auto mt-7 max-w-full overflow-x-auto overscroll-x-contain scroll-smooth"
      dir="ltr"
      style={{ width: progressChartViewportWidth }}
    >
      <div style={{ width: progressChartWidth }}>
        <svg
          aria-hidden="true"
          className="block h-[210px] overflow-visible"
          style={{ width: progressChartWidth }}
          viewBox={`0 0 ${progressChartWidth} 210`}
        >
          {[20, 60, 100, 140, 180].map((y, index) => (
            <g key={y}>
              <path
                d={`M${progressChartAxisWidth} ${y}H${progressChartWidth - 4}`}
                stroke="#e8e8e8"
                strokeDasharray="4 5"
              />
              <text fill="#808080" fontSize="10" x="0" y={y + 4}>
                {formatNumber(100 - index * 20)}
              </text>
            </g>
          ))}
          <path
            d="M28 150 C42 130 48 108 62 112 C76 116 78 135 91 134 C104 132 109 65 124 68 C141 70 145 101 158 105 C170 108 181 96 191 101 C206 110 208 128 221 130 C235 132 238 67 251 60 C261 56 266 68 276 65 C291 60 300 52 310 58 C322 65 330 86 344 84 C358 82 365 60 378 56 C390 53 398 62 405 58"
            fill="none"
            stroke="#0048c4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <path d="M124 68V190" stroke="#0048c4" strokeDasharray="5 4" />
          {[
            ["28", 150],
            ["62", 112],
            ["91", 134],
            ["124", 68],
            ["158", 105],
            ["191", 101],
            ["221", 130],
            ["251", 60],
            ["276", 65],
            ["310", 58],
            ["344", 84],
            ["378", 56],
          ].map(([x, y]) => (
            <circle
              cx={Number(x)}
              cy={Number(y)}
              fill="#ffffff"
              key={String(x)}
              r="5"
              stroke="#0048c4"
              strokeWidth="2"
            />
          ))}
          <circle cx="124" cy="68" fill="#0048c4" r="6" />
          <path
            d="M98 48a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-11l-7 7-7-7h-11a8 8 0 0 1-8-8V48Z"
            fill="#4d4d4d"
          />
          <text fill="#ffffff" fontSize="11" textAnchor="middle" x="124" y="59">
            {tooltip}
          </text>
        </svg>

        <div
          className="mt-1 grid gap-0 text-center text-[10px] font-medium leading-4 text-[#4d4d4d]"
          style={{
            gridTemplateColumns: `${progressChartAxisWidth}px repeat(${progressChartMonths.length}, ${progressChartMonthWidth}px)`,
          }}
        >
          <span aria-hidden="true" />
          {progressChartMonths.map((month) => (
            <span className="[writing-mode:vertical-rl]" key={month}>
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishedAgencyAdsCard() {
  return (
    <article className="rounded-[24px] bg-white px-7 pb-8 pt-9">
      <div className="mb-12 flex items-start justify-between gap-4">
        <div className="text-right">
          <h2 className="m-0 font-semibold leading-8 text-[#1a1a1a]">
            آگهی منتشر شده در آژانس
          </h2>
          <p className="m-0 mt-2 text-lg font-medium leading-7 text-[#666666]">
            <span className="ml-3 font-black text-[#0048c4]">۱۸۳</span>
            آگهی ثبت شده
          </p>
        </div>

        <button
          className="inline-flex items-center gap-3 rounded-lg bg-transparent px-0 py-1 text-sm font-semibold text-[#1a1a1a]"
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rotate-45 border-b border-r border-[#303030]"
          />
          در ماه
        </button>
      </div>

      <div className="mx-auto h-[220px] max-w-[220px]" dir="ltr">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              data={adTypeData}
              dataKey="value"
              endAngle={-272}
              isAnimationActive={false}
              nameKey="name"
              outerRadius="100%"
              startAngle={88}
              stroke="none"
            >
              {adTypeData.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${formatNumber(String(value))}٪`}
              separator=": "
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-4 text-center">
        {adTypeData.map((item) => (
          <PublishedAdsLegendItem
            color={item.color}
            key={item.name}
            label={item.name}
            value={`${formatNumber(item.value)}٪`}
          />
        ))}
      </div>
    </article>
  );
}

function ConsultantActivityCard() {
  const chartScrollRef = useRef<HTMLDivElement>(null);

  function scrollConsultantChart(direction: "next" | "previous") {
    chartScrollRef.current?.scrollBy({
      behavior: "smooth",
      left:
        direction === "next"
          ? consultantChartItemWidth
          : -consultantChartItemWidth,
    });
  }

  return (
    <article className="overflow-hidden rounded-[24px] bg-white px-7 pb-6 pt-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <button
          className="inline-flex items-center gap-3 rounded-lg bg-transparent px-0 py-1 text-sm font-semibold text-[#1a1a1a]"
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rotate-45 border-b border-r border-[#303030]"
          />
          در ماه
        </button>

        <div className="text-right">
          <h2 className="m-0 text-2xl font-black leading-8 text-[#1a1a1a]">
            فعالیت مشاورین
          </h2>
          <p className="m-0 mt-4 text-lg font-medium leading-7 text-[#666666]">
            <span className="ml-3 font-black text-[#0048c4]">۳۲۵</span>
            آگهی ثبت شده
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <button
          aria-label="قبلی"
          className="grid h-8 w-8 place-items-center rounded-full text-[#303030]"
          onClick={() => scrollConsultantChart("previous")}
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rotate-45 border-b border-l border-[#303030]"
          />
        </button>
        <button
          aria-label="بعدی"
          className="grid h-8 w-8 place-items-center rounded-full text-[#303030]"
          onClick={() => scrollConsultantChart("next")}
          type="button"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rotate-45 border-r border-t border-[#303030]"
          />
        </button>
      </div>

      <div
        className="mx-auto h-[220px] max-w-full overflow-x-auto overscroll-x-contain scroll-smooth"
        dir="ltr"
        ref={chartScrollRef}
        style={{ width: consultantChartViewportWidth }}
      >
        <div className="h-full" style={{ width: consultantChartWidth }}>
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              barCategoryGap={20}
              barGap={5}
              data={consultantActivityData}
              margin={{ bottom: 0, left: -18, right: 4, top: 6 }}
            >
              <CartesianGrid
                stroke="#e6e6e6"
                strokeDasharray="5 6"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="name"
                interval={0}
                tick={{ fill: "#1a1a1a", fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                domain={[0, 100]}
                tick={{ fill: "#8a8a8a", fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
                tickLine={false}
                ticks={[0, 20, 40, 60, 80, 100]}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#595959",
                  border: "0",
                  borderRadius: "8px",
                  boxShadow: "none",
                  color: "#ffffff",
                  direction: "rtl",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "8px 10px",
                }}
                cursor={false}
                formatter={(value, name) => [
                  `${formatNumber(String(value))} ${chartNameMap[String(name)] ?? name}`,
                  "",
                ]}
                itemStyle={{ color: "#ffffff", padding: 0 }}
                labelStyle={{ display: "none" }}
                separator=""
              />
              <Bar
                barSize={10}
                dataKey="ads"
                fill="#0048c4"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                barSize={10}
                dataKey="renewals"
                fill="#11a366"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                barSize={10}
                dataKey="specials"
                fill="#ffb100"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-4 text-center" dir="rtl">
        <ConsultantActivityLegendItem color="#0048c4" label="آگهی" />
        <ConsultantActivityLegendItem color="#11a366" label="بروزرسانی" />
        <ConsultantActivityLegendItem color="#ffb100" label="ویژه" />
      </div>
    </article>
  );
}

function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metricIcons[metric.icon];
  const tone = toneClasses[metric.tone];

  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-none">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${tone.bg} ${tone.icon} ${tone.ring}`}
      >
        <Icon className="h-6 w-6" />
      </span>

      <div className="w-full">
        <div className="flex w-full justify-between items-center">
          <p className="m-0 truncate text-sm font-medium leading-6 text-[#4D4D4D]">
            {metric.title}
          </p>
          <strong className="font-semibold leading-none text-[#1A1A1A]">
            {metric.value}
          </strong>
        </div>

        <div>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs font-medium leading-5 text-[#8a8a8a]">
            {metric.descriptionIcon === "clock" ? (
              <LinearClock className="h-4 w-4 text-[#334466]" />
            ) : null}
            {metric.trend ? (
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${trendClasses[metric.trendTone]}`}
              >
                <LinearChartUp className="h-4 w-4" />
                {metric.trend}
              </span>
            ) : null}
            <span>{metric.description}</span>
          </div>
        </div>
      </div>

    </article>
  );
}

function PublishedAdsLegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="grid justify-items-center gap-4">
      <span className="inline-flex items-center justify-center gap-2 text-base font-medium leading-6 text-[#4d4d4d]">
        {label}
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
      <strong className="text-[26px] font-black leading-8 text-[#1a1a1a]">
        {value}
      </strong>
    </div>
  );
}

function ConsultantActivityLegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center justify-center gap-2 text-base font-medium leading-6 text-[#4d4d4d]">
      {label}
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
