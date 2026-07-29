import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";

import { Typography } from "../../components/ui/Typography";

type BadgeKey = "file" | "magnet" | "response" | "time";

type ProgressVariant = "complete" | "current" | "locked";

type BadgeDetail = {
  image: string;
  metricLabel: string;
  metricValue: string;
  name: string;
  levels: {
    amount: string;
    progress: number;
    title: string;
    variant: ProgressVariant;
  }[];
};

const badgeDetails: Record<BadgeKey, BadgeDetail> = {
  file: {
    image: "/figma/account/ranking-badge-detail-file.png",
    metricLabel: "تعامل موثر:",
    metricValue: "186",
    name: "فایل ساز",
    levels: [
      { amount: "تکمیل شده", progress: 100, title: "سطح 1", variant: "complete" },
      { amount: "186 / 300", progress: 42.5, title: "سطح 2", variant: "current" },
      { amount: "0 / 600", progress: 1.5, title: "سطح 3", variant: "locked" },
    ],
  },
  magnet: {
    image: "/figma/account/ranking-badge-detail-magnet.png",
    metricLabel: "تعامل موثر:",
    metricValue: "67",
    name: "مغناطیس بازار",
    levels: [
      { amount: "تکمیل شده", progress: 100, title: "سطح 1", variant: "complete" },
      { amount: "67 / 100", progress: 42.5, title: "سطح 2", variant: "current" },
      { amount: "0 / 200", progress: 1.5, title: "سطح 3", variant: "locked" },
    ],
  },
  response: {
    image: "/figma/account/ranking-badge-detail-response.png",
    metricLabel: "تعداد پاسخ سریع:",
    metricValue: "128",
    name: "ساعقه پاسخ",
    levels: [
      { amount: "تکمیل شده", progress: 100, title: "سطح 1", variant: "complete" },
      { amount: "128 / 200", progress: 42.5, title: "سطح 2", variant: "current" },
      { amount: "0 / 300", progress: 1.5, title: "سطح 3", variant: "locked" },
    ],
  },
  time: {
    image: "/figma/account/ranking-badge-detail-time.png",
    metricLabel: "فعالیت روزانه:",
    metricValue: "5.1 ساعت",
    name: "همیشگی",
    levels: [
      { amount: "تکمیل شده", progress: 100, title: "سطح 1", variant: "complete" },
      { amount: "5.1 / 6", progress: 42.5, title: "سطح 2", variant: "current" },
      { amount: "0 / 8", progress: 1.5, title: "سطح 3", variant: "locked" },
    ],
  },
};

export function IndependentConsultantBadgeDetailsPage({ badgeKey }: { badgeKey: BadgeKey }) {
  const badge = badgeDetails[badgeKey];

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/ranking" className="[&_a]:text-[#1a1a1a]" title="جزییات نشان" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-6 pt-6">
        <div className="mx-auto flex w-[152px] flex-col items-center">
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badge.image} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-[#0048c41f] px-3 text-sm font-semibold leading-5 text-[#0048c4]">
            {badge.name}
          </Typography>
          <div className="mt-2 flex h-6 items-center justify-center">
            {[0, 1, 2].map((star) => (
              <DetailStarIcon className={`h-6 w-6 ${star === 0 ? "text-[#ffb100]" : "text-[#d8d8d8]"}`} key={star} />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">{badge.metricLabel}</Typography>
          <strong className="font-semibold text-[#1a1a1a]">{badge.metricValue}</strong>
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
  amount,
  progress,
  title,
  variant,
}: {
  amount: string;
  progress: number;
  title: string;
  variant: ProgressVariant;
}) {
  const progressClassName =
    variant === "complete" ? "bg-[#11a366]" : variant === "current" ? "bg-[#ffb100]" : "bg-[#a6a6a6]";
  const trackClassName =
    variant === "complete" ? "bg-[#11a36629]" : variant === "current" ? "bg-[#ff8d0029]" : "bg-[#e5e5e5]";
  const amountClassName =
    variant === "complete" ? "text-[#11a366]" : variant === "locked" ? "text-[#a6a6a6]" : "text-[#4d4d4d]";

  return (
    <section className="h-[72px] rounded-2xl border border-[#f0f0f0] bg-[#f5f5f5] px-4 py-4">
      <div className="flex h-5 items-center justify-between text-sm font-medium leading-5 [direction:ltr]">
        <Typography as="span" variant="body" size="medium" weight="regular" className={amountClassName}>{amount}</Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d] [direction:rtl]">{title}</Typography>
      </div>
      <div className={`mt-4 h-1 w-full rounded-full ${trackClassName}`}>
        <div className={`h-1 rounded-full ${progressClassName}`} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

function DetailStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 2.6 2.9 5.86 6.47.94-4.68 4.56 1.11 6.44L12 17.35 6.2 20.4l1.11-6.44L2.63 9.4l6.47-.94L12 2.6Z" />
    </svg>
  );
}
