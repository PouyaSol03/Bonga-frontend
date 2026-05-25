import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { ChevronLeftIcon } from "./AdManagementIcons";
import {
  adManagementPaths,
  getSelectedStatisticsAd,
} from "./adManagementData";

const chartSections = [
  { label: "بازدید امروز:", title: "بازدید از آگهی" },
  { label: "کل نمایش‌ها:", title: "نمایش در صفحه جستجو" },
  { label: "کل گفتگوها:", title: "گفتگوها (چت‌ها)" },
  { label: "کل تماس‌ها:", title: "اقدام به تماس" },
] as const;

const chartColumns = [
  { date: "۱۰/۲۰", height: 80, selected: false },
  { date: "۱۰/۲۱", height: 40, selected: false },
  { date: "۱۰/۲۲", height: 90, selected: false },
  { date: "۱۰/۲۳", height: 20, selected: false },
  { date: "۱۰/۲۴", height: 4, selected: false },
  { date: "۱۰/۲۵", height: 70, selected: true },
  { date: "امروز", height: 100, selected: false },
] as const;

export function IndependentConsultantAdStatisticsDetailsPage() {
  const ad = getSelectedStatisticsAd();

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={adManagementPaths.statistics}
        className="[&_a]:text-[#1a1a1a]"
        title="جزییات آمار آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <section className="h-[104px] bg-white px-4 py-4" aria-label={ad.title}>
          <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <h2 className="m-0 truncate text-sm font-medium leading-5">{ad.title}</h2>
              <p className="m-0 mt-2 text-xs font-normal leading-4 text-[#808080]">{ad.time}</p>
            </div>
            <img alt="" className="h-[72px] w-[108px] shrink-0 rounded-lg object-cover" src={ad.image} />
          </div>
        </section>

        <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" />
        {chartSections.map((section, index) => (
          <div key={section.title}>
            {index > 0 ? <div className="h-2 bg-[#f0f0f0]" aria-hidden="true" /> : null}
            <StatisticsChart label={section.label} title={section.title} />
          </div>
        ))}
      </main>
    </PageFrame>
  );
}

function StatisticsChart({ label, title }: { label: string; title: string }) {
  const [offset, setOffset] = useState(0);
  const displayValue = offset === 0 ? "۲۴۵" : offset === 1 ? "۲۱۲" : "۱۸۷";

  return (
    <section className="h-[283px] bg-[#fafafa] px-4 py-4" aria-label={title}>
      <div className="flex h-12 items-center justify-between [direction:ltr]">
        <div className="flex items-center">
          <button
            aria-label="بازه قبلی"
            className="grid h-12 w-12 place-items-center text-[#4d4d4d]"
            onClick={() => setOffset((current) => Math.min(current + 1, 2))}
            type="button"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            aria-label="بازه بعدی"
            className={`grid h-12 w-12 place-items-center ${offset === 0 ? "text-[#c7c7c7]" : "text-[#4d4d4d]"}`}
            disabled={offset === 0}
            onClick={() => setOffset((current) => Math.max(current - 1, 0))}
            type="button"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <h2 className="m-0 inline-flex items-center gap-2 text-base font-medium leading-6 [direction:rtl]">
          <TrendIcon className="h-6 w-6 text-[#4d4d4d]" />
          {title}
        </h2>
      </div>

      <div className="mt-4 h-[187px]">
        <div className="flex h-6 items-center justify-start gap-2 [direction:rtl]">
          <span className="text-sm font-normal leading-5 text-[#4d4d4d]">{label}</span>
          <strong className="rounded bg-[#edf0fb] px-2 text-base font-medium leading-6 text-[#002099]">
            {displayValue}
          </strong>
        </div>
        <div className="relative mt-2 grid h-[155px] grid-cols-7 [direction:ltr]">
          <div className="absolute inset-x-0 bottom-[22px] h-px bg-[#cccccc]" aria-hidden="true" />
          {chartColumns.map((column) => (
            <div className="relative h-full text-center" key={column.date}>
              {column.selected ? (
                <span
                  className="absolute left-1/2 z-10 -translate-x-1/2 rounded-md bg-white px-3 py-1 text-xs font-normal leading-4 text-[#1a1a1a] shadow-[0_2px_10px_rgba(0,0,0,0.09)]"
                  style={{ bottom: column.height + 38 }}
                >
                  ۱۲۸۵
                  <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
                </span>
              ) : null}
              <span
                aria-hidden="true"
                className="absolute bottom-[23px] left-1/2 w-[6px] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-[#cccccc] via-[#45b58f] to-[#12a36a]"
                style={{ height: column.height }}
              />
              <span className="absolute inset-x-0 bottom-0 text-xs font-normal leading-4 text-[#4d4d4d]">
                {column.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect height="17" rx="2" width="16" x="4" y="3.5" />
      <path d="m7.5 15.5 3.25-3.25 2.5 2.25 3.5-5M15 9.5h1.75v1.75" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m10 7 5 5-5 5" />
    </svg>
  );
}
