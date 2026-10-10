import { PageFrame } from "../../shared/layout/PageFrame";
import LinearStar from "../../shared/icons/LinearStar";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { useV2RankingBadgesQuery } from "./api/v2/ranking-v2.hooks";
import {
  formatBadgeProgressNumber,
  readBadgeLevelCount,
  readBadgeProgressLevels,
  type BadgeProgressLevel,
  type BadgeProgressVariant,
} from "../account/utils/badgeProgress";

type BadgeKey = "record-holder" | "golden-team" | "popular" | "fast-team";

type BadgeDefinition = {
  image: string;
  name: string;
};

const badgeDefinitions: Record<BadgeKey, BadgeDefinition> = {
  "record-holder": {
    image: "/vectors/badges/badge-bookmark.webp",
    name: "رکورددار",
  },
  "golden-team": {
    image: "/vectors/badges/badge-cup.webp",
    name: "تیم طلایی",
  },
  popular: {
    image: "/vectors/badges/badge-first.webp",
    name: "محبوب‌ترین",
  },
  "fast-team": {
    image: "/vectors/badges/badge-chat.webp",
    name: "تیم پرسرعت",
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
  const badgesQuery = useV2RankingBadgesQuery();
  const definition = badgeDefinitions[badgeKey];
  const rawBadges = badgesQuery.data?.badges ?? badgesQuery.data?.data ?? [];
  const badge = rawBadges.find((item) => {
    const slug = typeof item.slug === "string" ? item.slug.trim().toLowerCase() : "";
    return slug === badgeKey ||
      (badgeKey === "record-holder" && (slug === "file_maker" || slug === "file")) ||
      (badgeKey === "golden-team" && (slug === "market_magnet" || slug === "magnet")) ||
      (badgeKey === "fast-team" && (slug === "always_active" || slug === "time"));
  });
  const badgeName = typeof badge?.title === "string" && badge.title.trim()
    ? badge.title.trim()
    : typeof badge?.name === "string" && badge.name.trim()
      ? badge.name.trim()
      : definition.name;
  const badgeImage =
    typeof badge?.image === "string" && badge.image.trim()
      ? badge.image
      : typeof badge?.src === "string" && badge.src.trim()
        ? badge.src
        : definition.image;
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
    : readBadgeProgressLevels(badge as any);
  const starCount = Number(badge?.level ?? readBadgeLevelCount(badge as any));

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/ranking"
        className="bg-surface-container"
        contentClassName="px-1"
        title="جزئیات نشان"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest px-6 pt-8">
        <div className="mx-auto flex w-[152px] flex-col items-center">
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badgeImage} />

          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-primary-container px-3 font-semibold text-primary">
            {badgeName}
          </Typography>

          <div className="mt-2 flex h-6 items-center justify-center [direction:ltr]">
            {[0, 1, 2].map((star) => (
              <LinearStar
                className={`h-6 w-6 ${star < starCount ? "text-warning" : "text-outline"}`}
                innerColor="currentColor"
                key={star}
              />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-on-surface text-sm">امتیاز کاربر</Typography>
          <strong className="text-2xl font-medium text-on-surface">
            {formatBadgeProgressNumber(currentValue)}
          </strong>
        </Typography>

        {badgesQuery.isLoading ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-outline">در حال دریافت جزئیات نشان...</Typography>
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
      : "bg-surface-container-high";

  const trackClassName = isComplete
    ? "bg-tertiary-container/30"
    : isCurrent
      ? "bg-warning-container/30"
      : "bg-surface-container";

  return (
    <section className="h-[72px] rounded-2xl border border-outline-var bg-surface-container-lowest px-4 py-4">
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

      <div className={`relative mt-4 h-1 w-full overflow-hidden rounded-full ${trackClassName}`}>
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${progressClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
