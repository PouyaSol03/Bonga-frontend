import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { useV2RankingBadgesQuery } from "../dashboard/api/v2/ranking-v2.hooks";
import {
  formatBadgeProgressNumber,
  readAgentBadgeProgressLevels,
  type BadgeProgressLevel,
  type BadgeProgressVariant,
} from "./utils/badgeProgress";

type BadgeKey = "file" | "magnet" | "response" | "time";

type BadgeDefinition = {
  image: string;
  name: string;
};

const badgeDefinitions: Record<BadgeKey, BadgeDefinition> = {
  file: {
    image: "/figma/account/ranking-badge-detail-file.png",
    name: "پرونده‌ساز",
  },
  magnet: {
    image: "/figma/account/ranking-badge-detail-magnet.png",
    name: "آهنربای بازار",
  },
  response: {
    image: "/figma/account/ranking-badge-detail-response.png",
    name: "صاعقه پاسخ",
  },
  time: {
    image: "/figma/account/ranking-badge-detail-time.png",
    name: "همیشه فعال",
  },
};

const slugMap: Record<BadgeKey, string> = {
  file: "file_maker",
  magnet: "market_magnet",
  time: "always_active",
  response: "response",
};

export function IndependentConsultantBadgeDetailsPage({ badgeKey }: { badgeKey: BadgeKey }) {
  const targetSlug = slugMap[badgeKey] || badgeKey;
  const badgesQuery = useV2RankingBadgesQuery();
  const definition = badgeDefinitions[badgeKey];
  const rawBadges = badgesQuery.data?.badges ?? badgesQuery.data?.data ?? [];
  const badge = rawBadges.find((item) => {
    const slug = typeof item.slug === "string" ? item.slug.trim().toLowerCase() : "";
    return slug === targetSlug || slug === badgeKey;
  });

  const badgeName = badge?.title || definition.name;
  const badgeImage = definition.image;
  const currentLevel = Number(badge?.level ?? 0);
  const currentValue = Number(badge?.current_value ?? 0);

  const thresholds = badge?.thresholds;
  const levels: BadgeProgressLevel[] = Array.isArray(thresholds)
    ? thresholds.map((threshold, index) => {
        const isComplete = index < currentLevel;
        const isCurrent = index === currentLevel;
        const variant: BadgeProgressVariant = isComplete ? "complete" : isCurrent ? "current" : "locked";
        const prevThreshold = index > 0 ? (thresholds[index - 1] ?? 0) : 0;
        return {
          done: `${isComplete ? threshold : isCurrent ? currentValue : prevThreshold + 1}`,
          total: `${threshold}`,
          progress: isComplete ? 100 : isCurrent ? Math.min(100, Math.max(0, Number(badge?.progress ?? ((currentValue / threshold) * 100)))) : 0,
          title: `سطح ${index + 1}`,
          variant,
        };
      })
    : readAgentBadgeProgressLevels(badge as any);
  const starCount = Number(badge?.level ?? 0);

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/ranking" className="[&_a]:text-on-surface" title="جزییات نشان" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest px-6 pt-6">
        <div className="mx-auto flex w-[152px] flex-col items-center">
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badgeImage} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-primary-container px-3 text-sm font-semibold leading-5 text-primary">
            {badgeName}
          </Typography>
          <div className="mt-2 flex h-6 items-center justify-center">
            {[0, 1, 2].map((star) => (
              <DetailStarIcon
                className={`h-6 w-6 ${star < starCount ? "text-warning" : "text-outline-var"}`}
                key={star}
              />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface text-sm">امتیاز کاربر</Typography>
          <strong className="text-2xl font-medium text-on-surface">{formatBadgeProgressNumber(currentValue)}</strong>
        </Typography>

        {badgesQuery.isLoading ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-outline">
            در حال دریافت جزئیات نشان...
          </Typography>
        ) : levels.length > 0 ? (
          <div className="mt-4 space-y-4">
            {levels.map((level) => (
              <BadgeLevelCard key={level.title} {...level} />
            ))}
          </div>
        ) : (
          <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 mt-6 w-full rounded-2xl border border-outline-var px-4 py-6 text-center text-outline">
            جزئیات پیشرفت این نشان از سرور دریافت نشده است.
          </Typography>
        )}
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
}: BadgeProgressLevel) {
  const isComplete = variant === "complete";
  const isCurrent = variant === "current";

  const progressClassName = isComplete
    ? "bg-tertiary"
    : isCurrent
      ? "bg-warning"
      : "bg-outline";
  const trackClassName = isComplete
    ? "bg-tertiary-container/40"
    : isCurrent
      ? "bg-warning-container/40"
      : "bg-outline-var";

  return (
    <section className="h-[72px] rounded-2xl border border-outline-var bg-surface-container px-4 py-4">
      <div className="flex h-5 items-center justify-between text-sm font-medium leading-5 [direction:ltr]">
        {isComplete ? (
          <Typography as="span" variant="body" size="medium" weight="medium" className="text-tertiary">
            تکمیل شده
          </Typography>
        ) : total ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-1 [direction:ltr]">
            <Typography as="span" variant="body" size="medium" weight="regular" className={isCurrent ? "text-warning" : "text-outline"}>
              {formatBadgeProgressNumber(Number(done) || 0)}
            </Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline">/</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline">
              {formatBadgeProgressNumber(Number(total) || 0)}
            </Typography>
          </Typography>
        ) : (
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline">
            {done}
          </Typography>
        )}
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface-var [direction:rtl]">{title}</Typography>
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
