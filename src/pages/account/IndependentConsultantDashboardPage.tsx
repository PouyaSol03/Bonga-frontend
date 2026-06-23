import { useState, type ReactNode } from "react";
import { TopBarNavigationLayout } from "../../app/TopBarNavigationLayout";
import { TopBar } from "../../components/TopBar";

type CreditMetric = {
  accentClassName: string;
  icon: ReactNode;
  title: string;
  trend: string;
  value: string;
};

type DistributionCardData = {
  agencyPercent: number;
  consultantPercent: number;
  count: string;
  title: string;
  total: string;
  wedgeColor: string;
  baseColor: string;
};

const creditMetrics: CreditMetric[] = [
  {
    accentClassName: "bg-[#dfe7ff] text-[#0048c4]",
    icon: <TagIcon className="h-6 w-6" />,
    title: "مانده اعتبار آگهی",
    trend: "24%",
    value: "34",
  },
  {
    accentClassName: "bg-[#d9f3e8] text-[#11a366]",
    icon: <ChartUpIcon className="h-6 w-6" />,
    title: "مانده بروزرسانی",
    trend: "24%",
    value: "21",
  },
  {
    accentClassName: "bg-[#fff0dc] text-[#ff8a00]",
    icon: <RocketIcon className="h-6 w-6" />,
    title: "مانده بروزرسانی",
    trend: "16%",
    value: "11",
  },
];

const distributions: DistributionCardData[] = [
  {
    agencyPercent: 75,
    consultantPercent: 25,
    count: "30",
    title: "آگهی منتشر شده",
    total: "136",
    wedgeColor: "#124fc6",
    baseColor: "#d8def5",
  },
  {
    agencyPercent: 81,
    consultantPercent: 19,
    count: "125",
    title: "بروزرسانی منتشر شده در آژانس",
    total: "526",
    wedgeColor: "#11a366",
    baseColor: "#bce9d5",
  },
  {
    agencyPercent: 68,
    consultantPercent: 32,
    count: "98",
    title: "ویژه منتشر شده",
    total: "493",
    wedgeColor: "#ffad00",
    baseColor: "#ffe8ad",
  },
];

const rankingRows = [
  { name: "ناصر اشرفی", rank: "۱.", score: "90" },
  { name: "ادریس زیرک", rank: "۲.", score: "89" },
  { name: "حسین عابدی", rank: "۳.", score: "86" },
  { name: "مجید مطلبی", rank: "۴.", score: "85" },
  { name: "رسول فدوی", rank: "۵.", score: "82" },
];

export function IndependentConsultantDashboardPage() {
  const [period, setPeriod] = useState<"ماه" | "سال">("ماه");

  return (
    <TopBarNavigationLayout
      activeKey="home"
      contentClassName="bg-[#f0f0f0] px-4 py-4"
      frameClassName="bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      hideTopBar
      topBar={<TopBar
        actions={[
          {
            icon: (
              <span className="relative grid h-6 w-6 place-items-center">
                <NotificationIcon className="h-6 w-6" />
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef1f1f] ring-2 ring-[#f0f0f0]"
                />
              </span>
            ),
            id: "notifications",
            label: "اعلان‌ها",
            to: "/notifications",
          },
        ]}
        backTo="/login"
        title="داشبورد"
      />}
    >
      <section className="space-y-3" aria-label="اعتبارها">
        {creditMetrics.map((metric) => (
          <CreditCard key={metric.value} metric={metric} />
        ))}
      </section>

      <section className="mt-4 space-y-4" aria-label="آمار مشاور">
        <PublishedListingsCard
          period={period}
          onTogglePeriod={() => setPeriod((current) => (current === "ماه" ? "سال" : "ماه"))}
        />
        <ProgressChartCard
          change="58%"
          changeLabel="افزایش ثبت"
          changeTone="positive"
          title="نمودار پیشرفت ثبت آگهی"
          tooltip="80 آگهی"
          period={period}
          onTogglePeriod={() => setPeriod((current) => (current === "ماه" ? "سال" : "ماه"))}
        />

        {distributions.map((distribution) => (
          <DistributionCard
            data={distribution}
            key={distribution.title}
            period={period}
            onTogglePeriod={() => setPeriod((current) => (current === "ماه" ? "سال" : "ماه"))}
          />
        ))}

        <ProgressChartCard
          change="23%"
          changeLabel="کاهش پیشرفت"
          changeTone="negative"
          title="نمودار پیشرفت رتبه"
          tooltip="12"
          period={period}
          onTogglePeriod={() => setPeriod((current) => (current === "ماه" ? "سال" : "ماه"))}
        />

        <RankingCard />
      </section>
    </TopBarNavigationLayout>
  );
}

function CreditCard({ metric }: { metric: CreditMetric }) {
  return (
    <article className="flex h-[76px] items-center gap-3 rounded-2xl bg-white p-4 [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <div className="flex items-center justify-start gap-2">
          <p className="m-0 text-sm font-medium leading-5 text-[#808080]">{metric.title}</p>
          <strong className="text-base font-semibold leading-6 text-[#1a1a1a]">{metric.value}</strong>
        </div>
        <div className="mt-1 flex items-center justify-start gap-1 text-xs font-normal leading-4 text-[#808080]">
          <span>افزایش استفاده در روز قبل</span>
          <span className="inline-flex items-center gap-0.5 font-medium text-[#11a366]">
            {metric.trend}
            <TrendUpIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${metric.accentClassName}`}>
        {metric.icon}
      </div>
    </article>
  );
}

function CardHeader({
  onTogglePeriod,
  period,
  title,
}: {
  onTogglePeriod: () => void;
  period: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 [direction:ltr]">
      <button
        className="inline-flex h-7 items-center gap-1 text-xs font-medium leading-4 text-[#4d4d4d]"
        onClick={onTogglePeriod}
        type="button"
      >
        <ChevronDownIcon className="h-4 w-4" />
        <span dir="rtl">در {period}</span>
      </button>
      <h2 className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">{title}</h2>
    </div>
  );
}

function PublishedListingsCard({
  onTogglePeriod,
  period,
}: {
  onTogglePeriod: () => void;
  period: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-6">
      <CardHeader onTogglePeriod={onTogglePeriod} period={period} title="آگهی منتشر شده" />
      <p className="m-0 mt-2 text-right text-sm font-normal leading-5 text-[#808080]">
        <strong className="ml-1 text-base font-semibold leading-6 text-[#0048c4]">183</strong>
        آگهی ثبت شده
      </p>

      <div className="mx-auto mt-5 h-[150px] w-[150px] rounded-full" style={{ background: "conic-gradient(#4166d3 0 48%, #7792ea 48% 88%, #cbd7ff 88% 100%)" }} />

      <div className="mt-6 grid grid-cols-3 gap-3 text-center [direction:ltr]">
        <LegendValue color="#cbd7ff" label="پروژه و مشارکت" value="12%" />
        <LegendValue color="#7792ea" label="اجاره" value="40%" />
        <LegendValue color="#4166d3" label="فروش" value="48%" />
      </div>
    </article>
  );
}

function LegendValue({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 text-xs font-normal leading-4 text-[#4d4d4d]">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </div>
      <strong className="mt-2 block text-base font-semibold leading-6 text-[#1a1a1a]">{value}</strong>
    </div>
  );
}

function ProgressChartCard({
  change,
  changeLabel,
  changeTone,
  title,
  tooltip,
  onTogglePeriod,
  period,
}: {
  change: string;
  changeLabel: string;
  changeTone: "negative" | "positive";
  title: string;
  tooltip: string;
  onTogglePeriod: () => void;
  period: string;
}) {
  const toneClassName = changeTone === "positive" ? "text-[#11a366]" : "text-[#ee3623]";

  return (
    <article className="rounded-2xl bg-white p-6">
      <div className="flex items-start justify-between gap-3 [direction:ltr]">
        <button
          className="inline-flex h-7 items-center gap-1 text-xs font-medium leading-4 text-[#4d4d4d]"
          type="button"
          onClick={onTogglePeriod}
        >
          <ChevronDownIcon className="h-4 w-4" />
          <span dir="rtl">در {period}</span>
        </button>
        <div className="text-right [direction:rtl]">
          <h2 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">{title}</h2>
          <p className={`m-0 mt-2 inline-flex items-center gap-1 text-sm leading-5 ${toneClassName}`}>
            {changeTone === "positive" ? (
              <TrendUpIcon className="h-4 w-4" />
            ) : (
              <TrendDownIcon className="h-4 w-4" />
            )}
            <strong className="text-base font-semibold leading-6">{change}</strong>
            <span className="text-[#808080]">{changeLabel}</span>
          </p>
        </div>
      </div>

      <LineChart tooltip={tooltip} />
    </article>
  );
}

function LineChart({ tooltip }: { tooltip: string }) {
  const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر"];

  return (
    <div className="mt-6">
      <svg aria-hidden="true" className="block h-[210px] w-full overflow-visible" viewBox="0 0 280 210">
        {[20, 60, 100, 140, 180].map((y, index) => (
          <g key={y}>
            <path d={`M28 ${y}H276`} stroke="#e4e4e4" strokeDasharray="4 4" />
            <text fill="#808080" fontSize="10" x="0" y={y + 4}>
              {100 - index * 20}
            </text>
          </g>
        ))}
        <path
          d="M28 150 C42 130 48 108 62 112 C76 116 78 135 91 134 C104 132 109 65 124 68 C141 70 145 101 158 105 C170 108 181 96 191 101 C206 110 208 128 221 130 C235 132 238 67 251 60 C261 56 266 68 276 65"
          fill="none"
          stroke="#0048c4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path d="M124 68V190" stroke="#0048c4" strokeDasharray="5 4" />
        {[["28", 150], ["62", 112], ["91", 134], ["124", 68], ["158", 105], ["191", 101], ["221", 130], ["251", 60], ["276", 65]].map(([x, y]) => (
          <circle cx={Number(x)} cy={Number(y)} fill="white" key={String(x)} r="5.5" stroke="#0048c4" strokeWidth="2" />
        ))}
        <circle cx="124" cy="68" fill="#0048c4" r="6" />
        <path d="M98 48a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8h-11l-7 7-7-7h-11a8 8 0 0 1-8-8V48Z" fill="#4d4d4d" />
        <text fill="white" fontSize="11" textAnchor="middle" x="124" y="59">{tooltip}</text>
      </svg>
      <div className="mt-1 grid grid-cols-9 gap-0 text-center text-[10px] font-medium leading-4 text-[#4d4d4d] [direction:ltr]">
        {months.map((month) => (
          <span className="[writing-mode:vertical-rl]" key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}

function DistributionCard({
  data,
  onTogglePeriod,
  period,
}: {
  data: DistributionCardData;
  onTogglePeriod: () => void;
  period: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-6">
      <CardHeader onTogglePeriod={onTogglePeriod} period={period} title={data.title} />
      <p className="m-0 mt-2 text-right text-sm font-normal leading-5 text-[#808080]">
        <strong className="ml-1 text-base font-semibold leading-6 text-[#0048c4]">{data.count}</strong>
        مورد از {data.total} مورد ثبت شده
      </p>

      <div className="mx-auto mt-5 h-[150px] w-[150px] rounded-full" style={{ background: `conic-gradient(${data.baseColor} 0 ${data.agencyPercent}%, ${data.wedgeColor} ${data.agencyPercent}% 100%)` }} />

      <div className="mt-6 grid grid-cols-2 gap-6 text-center [direction:ltr]">
        <LegendValue color={data.wedgeColor} label="مشاور" value={`${data.consultantPercent}%`} />
        <LegendValue color={data.baseColor} label="آژانس" value={`${data.agencyPercent}%`} />
      </div>
    </article>
  );
}

function RankingCard() {
  return (
    <article className="rounded-2xl bg-white p-4">
      <h2 className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">رتبه و امتیاز آژانس</h2>

      <div className="mt-4 grid grid-cols-2 gap-4 [direction:ltr]">
        <RankMetric icon={<StarIcon className="h-6 w-6" />} label="امتیاز" value="85" />
        <RankMetric icon={<RankIcon className="h-6 w-6" />} label="رتبه" value="67" />
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-[#cccccc] pb-3 text-sm leading-5 [direction:ltr]">
        <span className="text-[#808080]">امتیاز</span>
        <span className="font-medium text-[#4d4d4d] [direction:rtl]">۱۰ مشاور برتر</span>
      </div>

      <div>
        {rankingRows.map((item, index) => (
          <div
            className={`flex h-10 items-center rounded-lg px-2 text-sm leading-5 [direction:ltr] ${index % 2 ? "bg-[#f5f5f5]" : ""}`}
            key={item.rank}
          >
            <span className="w-12 text-left font-medium text-[#11a366]">{item.score}</span>
            <span className="flex-1 text-right text-[#1a1a1a] [direction:rtl]">{item.name}</span>
            <span className="w-7 text-left text-[#1a1a1a] [direction:rtl]">{item.rank}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function RankMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#f5f5f5] text-[#4d4d4d] [direction:ltr]">
      <strong className="text-base font-semibold leading-6 text-[#11a366]">{value}</strong>
      <span className="text-sm font-medium leading-5 [direction:rtl]">{label}</span>
      {icon}
    </div>
  );
}

function NotificationIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.5 10a5.5 5.5 0 0 0-11 0v3.5l-1.5 2h14l-1.5-2V10Z" />
      <path d="M9.75 18a2.35 2.35 0 0 0 4.5 0" />
    </svg>
  );
}

function TrendUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 17 10 11l4 4 6-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}

function TrendDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m4 7 6 6 4-4 6 8" />
      <path d="M15 17h5v-5" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function TagIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M20 13 13 20 4 11V4h7l9 9Z" />
      <path d="M8.5 8.5h.01" />
    </svg>
  );
}

function ChartUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M5 19V11M10 19V7M15 19V12M20 19V4" />
      <path d="m5 9 5-4 5 4 5-6" />
    </svg>
  );
}

function RocketIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 4c3.5-.4 5.6.1 6 0 .1.4.4 2.5 0 6l-5.5 5.5-6-6L14 4Z" />
      <path d="m9 10-4 1-1 4 5-1M14 15l-1 5-4-1 1-4M14.5 9.5h.01M8 16l-3 3" />
    </svg>
  );
}

function RankIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="m12 3 1.55 3.13 3.45.5-2.5 2.43.59 3.44L12 10.88 8.91 12.5l.59-3.44L7 6.63l3.45-.5L12 3Z" />
      <path d="M4 21v-5h5v5M9.5 21v-7h5v7M15 21v-4h5v4M3 21h18" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m12 3 2.8 5.68 6.27.91-4.54 4.43 1.07 6.25L12 17.32l-5.6 2.95 1.07-6.25-4.54-4.43 6.27-.91L12 3Z" />
    </svg>
  );
}
