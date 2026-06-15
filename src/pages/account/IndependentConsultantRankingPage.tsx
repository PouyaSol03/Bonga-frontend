import { useState, type ReactNode } from "react";
import { PageFrame } from "../../app/PageFrame";
import { getApiErrorMessage, useMyBadgesQuery, type BadgeItem } from "../../api/api-client";
import { TopBar } from "../../components/TopBar";
import { RouteLink } from "../../routes/RouteLink";

type Badge = {
  active: boolean;
  image: string;
  name: string;
  progress: number;
  to: string;
};

type RankIndicator = {
  icon: "activity" | "like" | "response" | "time";
  label: string;
  value: string;
};

const badges: Badge[] = [
  {
    active: true,
    image: "/figma/account/ranking-badge-magnet.png",
    name: "مغناطیس بازار",
    progress: 22,
    to: "/account/ranking/badges/magnet",
  },
  {
    active: true,
    image: "/figma/account/ranking-badge-file.png",
    name: "فایل ساز",
    progress: 22,
    to: "/account/ranking/badges/file",
  },
  {
    active: false,
    image: "/figma/account/ranking-badge-response.png",
    name: "صاعقه پاسخ",
    progress: 60,
    to: "/account/ranking/badges/response",
  },
  {
    active: false,
    image: "/figma/account/ranking-badge-time.png",
    name: "همیشگی",
    progress: 100,
    to: "/account/ranking/badges/time",
  },
];

const rankIndicators: RankIndicator[] = [
  { icon: "activity", label: "فعالیت درآگهی‌ها", value: "85%" },
  { icon: "like", label: "تعداد معاملات موفق", value: "15" },
  { icon: "response", label: "میانگین زمان پاسخگویی", value: "12 دقیقه" },
  { icon: "time", label: "روزهای فعال در سامانه", value: "5" },
];

const leadingConsultants = [
  { name: "ناصر اشرفی", score: "90" },
  { name: "ادریس زیرک", score: "89" },
  { name: "حسین عابدی", score: "81" },
  { name: "مجید مطلبی", score: "80" },
  { name: "مهران ارجمند", score: "76" },
  { name: "ابوالفضل مغانی", score: "76" },
  { name: "احسان منصوری", score: "73" },
  { name: "حسام گلستانی", score: "72" },
  { name: "علیرضا مقدم", score: "72" },
  { name: "مرتضی هاشمی", score: "70" },
];

function mapBadgeItemToBadge(item: BadgeItem, index: number): Badge {
  const fallback = badges[index % badges.length];
  const progress =
    typeof item.progress === "number"
      ? item.progress
      : typeof item.progress === "string"
        ? Number(item.progress)
        : fallback.progress;

  return {
    active: Boolean(item.active ?? fallback.active),
    image:
      typeof item.image === "string"
        ? item.image
        : typeof item.logo === "string"
          ? item.logo
          : fallback.image,
    name: typeof item.name === "string" ? item.name : fallback.name,
    progress: Number.isFinite(progress) ? progress : fallback.progress,
    to: fallback.to,
  };
}

export function IndependentConsultantRankingPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <InfoIcon className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: "/account/ranking/badges/guide",
          },
        ]}
        backTo="/login"
        className="[&_button]:text-[#1a1a1a]"
        title="نشان‌ها و رتبه"
      />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] px-4 py-4">
        <LevelSummaryCard />
        <MetricSummaryCard
          icon={<RankIcon className="h-6 w-6 text-[#11a366]" />}
          iconClassName="bg-[#11a3661f]"
          label="رتبه مشاور"
          trend="up"
          trendText="2 رتبه"
          value="5"
        />
        <MetricSummaryCard
          icon={<StarOutlineIcon className="h-6 w-6 text-[#ff6d00]" />}
          iconClassName="bg-[#ff8d0029]"
          label="امتیاز مشاور"
          trend="down"
          trendText="15 امتیاز"
          value="85"
        />
        <BadgesPanel />
        <RankingIndicatorsPanel />
        <TopConsultantsPanel />
      </main>
    </PageFrame>
  );
}

function LevelSummaryCard() {
  return (
    <RouteLink
      aria-label="سطح پیشرفت مشاور"
      className="flex h-20 items-center justify-between rounded-2xl bg-white px-4 text-[#1a1a1a] no-underline [direction:ltr]"
      to="/account/ranking/levels"
    >
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <GuidePill />
          <span className="text-sm font-medium leading-5 text-[#4d4d4d] [direction:rtl]">الماس معامله</span>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end gap-1 text-xs leading-4 [direction:ltr]">
          <span className="text-[#808080] [direction:rtl]">تا رسیدن به آژانس افسانه‌ای</span>
          <span className="font-medium text-[#0048c4] [direction:rtl]">6 امتیاز</span>
        </div>
      </div>
      <img alt="" className="h-12 w-12 shrink-0 object-contain" src="/figma/account/ranking-diamond.png" />
    </RouteLink>
  );
}

function MetricSummaryCard({
  icon,
  iconClassName,
  label,
  trend,
  trendText,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  trend: "down" | "up";
  trendText: string;
  value: string;
}) {
  const isUp = trend === "up";

  return (
    <section className="flex h-20 items-center justify-between rounded-2xl bg-white px-4 [direction:ltr]" aria-label={label}>
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <strong className="text-base font-semibold leading-6">{value}</strong>
          <span className="text-sm font-medium leading-5 text-[#4d4d4d] [direction:rtl]">{label}</span>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end gap-1 text-xs leading-4 [direction:ltr]">
          <span className="text-[#808080] [direction:rtl]">
            {isUp ? "افزایش نسبت به روز قبل" : "کاهش نسبت به روز قبل"}
          </span>
          <span className={`inline-flex items-center font-medium [direction:rtl] ${isUp ? "text-[#11a366]" : "text-[#ee3623]"}`}>
            {trendText}
            <TrendIcon className="h-4 w-4" down={!isUp} />
          </span>
        </div>
      </div>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>
        {icon}
      </span>
    </section>
  );
}

function BadgesPanel() {
  const { data: apiBadges = [], error, isError, isLoading, refetch } = useMyBadgesQuery();
  const visibleBadges =
    apiBadges.length > 0 ? apiBadges.map(mapBadgeItemToBadge) : badges;

  return (
    <section className="rounded-2xl bg-white p-4" aria-label="نشان‌ها">
      <SectionHeader title="نشان‌ها" />
      {isLoading ? (
        <div className="mt-6 py-8 text-center text-sm font-medium text-[#808080]">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#0048c433] border-t-[#0048c4]" />
          در حال دریافت نشان‌ها...
        </div>
      ) : null}
      {isError ? (
        <div className="mt-6 py-6 text-center">
          <p className="m-0 text-sm font-medium text-red-600">
            {getApiErrorMessage(error, "دریافت نشان‌ها با خطا مواجه شد.")}
          </p>
          <button
            className="mt-4 h-10 rounded-lg border border-[#0048c4] px-4 text-sm font-medium text-[#0048c4]"
            onClick={() => void refetch()}
            type="button"
          >
            تلاش مجدد
          </button>
        </div>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {!isLoading && !isError && visibleBadges.map((badge) => (
          <BadgeCard badge={badge} key={badge.name} />
        ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <RouteLink
      aria-label={`جزییات نشان ${badge.name}`}
      className="flex h-[186px] flex-col items-center rounded-lg border border-[#f5f5f5] pt-6 text-inherit no-underline"
      to={badge.to}
    >
      <img alt="" className="h-[72px] w-[72px] object-contain" src={badge.image} />
      <span
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold leading-5 ${
          badge.active ? "bg-[#0048c41f] text-[#0048c4]" : "bg-[#4d4d4d14] text-[#a6a6a6]"
        }`}
      >
        {badge.name}
      </span>
      <div className="mt-0.5 flex h-3 items-center justify-center">
        {[0, 1, 2].map((star) => (
          <SmallStarIcon
            className={`h-3 w-3 ${badge.active && star === 0 ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
            key={star}
          />
        ))}
      </div>
      <div className="mt-4 h-1 w-[92px] rounded-full bg-[#ff8d0029]">
        <div className="h-1 rounded-full bg-[#ffb100]" style={{ width: `${badge.progress}%` }} />
      </div>
    </RouteLink>
  );
}

function RankingIndicatorsPanel() {
  const [period, setPeriod] = useState<"هفته" | "ماه">("هفته");

  return (
    <section className="rounded-2xl bg-white p-4" aria-label="شاخص‌های رتبه‌بندی">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <button
          className="inline-flex h-7 items-center gap-2 text-xs font-medium leading-4 text-[#1a1a1a]"
          onClick={() => setPeriod((current) => (current === "هفته" ? "ماه" : "هفته"))}
          type="button"
        >
          <ChevronDownIcon className="h-4 w-4 text-[#4d4d4d]" />
          <span className="[direction:rtl]">{period}</span>
        </button>
        <h2 className="m-0 text-base font-semibold leading-6 [direction:rtl]">شاخص‌های رتبه‌بندی</h2>
      </div>
      <div className="mt-6 space-y-4">
        {rankIndicators.map((indicator) => (
          <RankIndicatorRow indicator={indicator} key={indicator.label} />
        ))}
      </div>
    </section>
  );
}

function RankIndicatorRow({ indicator }: { indicator: RankIndicator }) {
  return (
    <div className="flex h-20 items-center rounded-lg border border-[#f5f5f5] px-4 [direction:ltr]">
      <strong className="shrink-0 text-base font-semibold leading-6 text-[#0048c4] [direction:rtl]">
        {indicator.value}
      </strong>
      <span className="min-w-0 flex-1 px-2 text-right text-sm font-semibold leading-5 text-[#4d4d4d] [direction:rtl]">
        {indicator.label}
      </span>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0048c414] text-[#0048c4]">
        <IndicatorIcon className="h-6 w-6" icon={indicator.icon} />
      </span>
    </div>
  );
}

function TopConsultantsPanel() {
  return (
    <section className="h-[509px] rounded-2xl bg-white p-4" aria-label="10 مشاور برتر">
      <h2 className="m-0 text-right text-base font-semibold leading-6">10 مشاور برتر</h2>
      <div className="mt-4">
        <div className="flex h-7 items-center bg-[#edf0fb] text-sm font-normal leading-5 text-[#808080] [direction:ltr]">
          <span className="w-[41px] text-center">امتیاز</span>
          <span className="flex-1 px-2 text-right [direction:rtl]">رتبه و نام مشاور</span>
        </div>
        <div className="h-px bg-[#cccccc]" aria-hidden="true" />
        {leadingConsultants.map((consultant, index) => (
          <div
            className={`flex h-10 items-center px-2 text-sm leading-5 [direction:ltr] ${
              index % 2 === 1 ? "rounded-lg bg-[#cccccc1f]" : ""
            }`}
            key={consultant.name}
          >
            <span className="w-[27px] text-center font-medium">{consultant.score}</span>
            <span className="flex-1 px-2 text-right font-normal [direction:rtl]">{consultant.name}</span>
            <span className="w-5 text-center font-normal [direction:ltr]">.{index + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill to="/account/ranking/badges/guide" />
      <h2 className="m-0 text-base font-semibold leading-6 [direction:rtl]">{title}</h2>
    </div>
  );
}

function GuidePill({ to }: { to?: string } = {}) {
  const className =
    "inline-flex h-6 items-center gap-1 rounded-full bg-[#0048c414] px-2 text-xs font-medium leading-4 text-[#0048c4] no-underline [direction:ltr]";
  const content = (
    <>
      <span className="[direction:rtl]">راهنما</span>
      <InfoIcon className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <RouteLink aria-label="راهنمای نشان‌ها" className={className} to={to}>
        {content}
      </RouteLink>
    );
  }

  return (
    <span className={className}>
      {content}
    </span>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </svg>
  );
}

function RankIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="m12 3.5 1.5 3.1 3.4.5-2.45 2.4.58 3.4L12 11.3 8.97 12.9l.58-3.4L7.1 7.1l3.4-.5L12 3.5Z" />
      <path d="M5 20.5v-5h4v5M10 20.5v-7h4v7M15 20.5v-4h4v4M4 20.5h16" />
    </svg>
  );
}

function StarOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="m12 3.5 2.65 5.37 5.93.86-4.29 4.18 1.01 5.91L12 17.04l-5.3 2.78 1.01-5.91-4.29-4.18 5.93-.86L12 3.5Z" />
    </svg>
  );
}

function TrendIcon({ className = "", down = false }: { className?: string; down?: boolean }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 16 16">
      {down ? <path d="m4 5 4 4 4-4M8 9v3" /> : <path d="m4 11 4-4 4 4M8 7V4" />}
    </svg>
  );
}

function SmallStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 12 12">
      <path d="m6 1.3 1.45 2.93 3.23.47-2.34 2.28.55 3.22L6 8.68 3.11 10.2l.55-3.22L1.32 4.7l3.23-.47L6 1.3Z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 16 16">
      <path d="m5 6.5 3 3 3-3" />
    </svg>
  );
}

function IndicatorIcon({
  className = "",
  icon,
}: {
  className?: string;
  icon: RankIndicator["icon"];
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {icon === "activity" ? (
        <>
          <rect height="17" rx="2" width="16" x="4" y="3.5" />
          <path d="M7.5 14h2.5l2-4 2.5 5 2-3H19" />
        </>
      ) : null}
      {icon === "like" ? (
        <path d="M9 20H5V10h4v10Zm0-9 4-7a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2l-1.5 7H9v-8Z" />
      ) : null}
      {icon === "response" ? (
        <>
          <path d="M4 5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          <circle cx="17.5" cy="7.5" fill="white" r="4" />
          <path d="M17.5 5.5v2.3l1.5.8" />
        </>
      ) : null}
      {icon === "time" ? (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5h4" />
        </>
      ) : null}
    </svg>
  );
}
