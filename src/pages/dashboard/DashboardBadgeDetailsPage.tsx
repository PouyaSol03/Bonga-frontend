import { PageFrame } from "../../app/PageFrame";
import LinearStar from "../../components/(icons)/LinearStar";
import { TopBar } from "../../components/TopBar";
import { Typography } from "../../components/ui/Typography";

type BadgeKey = "record-holder" | "golden-team" | "popular" | "fast-team";

type ProgressVariant = "complete" | "current" | "locked";

type BadgeLevel = {
  done: string;
  total?: string;
  progress: number;
  title: string;
  variant: ProgressVariant;
};

type BadgeDetail = {
  image: string;
  metricLabel: string;
  metricValue: string;
  name: string;
  levels: BadgeLevel[];
};

const badgeDetails: Record<BadgeKey, BadgeDetail> = {
  "record-holder": {
    image: "/vectors/badges/badge-bookmark.png",
    metricLabel: "معاملات موفق",
    metricValue: "۱۵",
    name: "رکورددار",
    levels: [
      { done: "تکمیل شده", progress: 100, title: "سطح ۱", variant: "complete" },
      { done: "۱۵", total: "۳۰", progress: 50, title: "سطح ۲", variant: "current" },
      { done: "۳۱", total: "۶۰", progress: 1, title: "سطح ۳", variant: "locked" },
    ],
  },
  "golden-team": {
    image: "/vectors/badges/badge-cup.png",
    metricLabel: "امتیاز تیم",
    metricValue: "۶۹۰",
    name: "تیم طلایی",
    levels: [
      { done: "تکمیل شده", progress: 100, title: "سطح ۱", variant: "complete" },
      { done: "۶۹۰", total: "۱۰۰۰", progress: 69, title: "سطح ۲", variant: "current" },
      { done: "۱۰۰۱", total: "۲۰۰۰", progress: 1, title: "سطح ۳", variant: "locked" },
    ],
  },
  popular: {
    image: "/vectors/badges/badge-first.png",
    metricLabel: "امتیاز کاربر",
    metricValue: "۶۵۰",
    name: "محبوب‌ترین",
    levels: [
      { done: "تکمیل شده", progress: 100, title: "سطح ۱", variant: "complete" },
      { done: "۶۵۰", total: "۱۵۰۰", progress: 42.5, title: "سطح ۲", variant: "current" },
      { done: "۱۵۰۱", total: "۳۰۰۰", progress: 1, title: "سطح ۳", variant: "locked" },
    ],
  },
  "fast-team": {
    image: "/vectors/badges/badge-chat.png",
    metricLabel: "پاسخ سریع",
    metricValue: "۱۰۰٪",
    name: "تیم پرسرعت",
    levels: [
      { done: "تکمیل شده", progress: 100, title: "سطح ۱", variant: "complete" },
      { done: "۱۰۰", total: "۱۵۰", progress: 66, title: "سطح ۲", variant: "current" },
      { done: "۱۵۱", total: "۳۰۰", progress: 1, title: "سطح ۳", variant: "locked" },
    ],
  },
};

export function DashboardRecordHolderBadgePage() {
  return <DashboardBadgeDetailsPage badgeKey="record-holder" />;
}

export function DashboardGoldenTeamBadgePage() {
  return <DashboardBadgeDetailsPage badgeKey="golden-team" />;
}

export function DashboardPopularBadgePage() {
  return <DashboardBadgeDetailsPage badgeKey="popular" />;
}

export function DashboardFastTeamBadgePage() {
  return <DashboardBadgeDetailsPage badgeKey="fast-team" />;
}

function DashboardBadgeDetailsPage({ badgeKey }: { badgeKey: BadgeKey }) {
  const badge = badgeDetails[badgeKey];

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/ranking"
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="جزئیات نشان"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-6 pt-8">
        <div className="mx-auto flex w-[152px] flex-col items-center">
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badge.image} />

          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-[#0048c41f] px-3 font-semibold text-[#0048c4]">
            {badge.name}
          </Typography>

          <div className="mt-2 flex h-6 items-center justify-center [direction:ltr]">
            {[0, 1, 2].map((star) => (
              <LinearStar
                className={`h-6 w-6 ${star === 0 ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
                innerColor="currentColor"
                key={star}
              />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#1A1A1A] text-sm">{badge.metricLabel}</Typography>
          <strong className="text-2xl font-medium text-[#1a1a1a]">
            {badge.metricValue}
          </strong>
        </Typography>

        <div className="mt-4 space-y-4">
          {badge.levels.map((level) => (
            <BadgeLevelCard key={level.title} {...level} />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}

function BadgeLevelCard({
  done,
  total,
  progress,
  title,
  variant,
}: BadgeLevel) {
  const progressClassName =
    variant === "complete"
      ? "bg-[#11a366]"
      : variant === "current"
        ? "bg-[#ffb100]"
        : "bg-[#a6a6a6]";

  const trackClassName =
    variant === "complete"
      ? "bg-[#11a36629]"
      : variant === "current"
        ? "bg-[#ff8d0029]"
        : "bg-[#e5e5e5]";

  const doneClassName =
    variant === "complete"
      ? "text-[#11a366]"
      : variant === "current"
        ? "text-[#FFB100]"
        : "text-[#808080]";

  return (
    <section className="h-[72px] rounded-2xl border border-[#f0f0f0] bg-white px-4 py-4">
      <div className="flex h-5 items-center justify-between text-sm font-medium leading-5 [direction:ltr]">
        {total ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1 [direction:ltr]">
            <Typography as="span" variant="body" size="medium" weight="regular" className={doneClassName}>{done}</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080]">/</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080]">{total}</Typography>
          </Typography>
        ) : (
          <Typography as="span" variant="body" size="medium" weight="regular" className={doneClassName}>{done}</Typography>
        )}

        <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d] [direction:rtl]">{title}</Typography>
      </div>

      <div className={`relative mt-4 h-1 w-full overflow-hidden rounded-full ${trackClassName}`}>
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${progressClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}