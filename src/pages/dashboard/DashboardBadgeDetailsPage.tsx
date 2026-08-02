import { PageFrame } from "../../app/layout/PageFrame";
import LinearStar from "../../shared/icons/LinearStar";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { useMyBadgesQuery } from "../../core/hooks/account.hooks";
import {
  badgeProgressNumber,
  formatBadgeProgressNumber,
  readBadgeLevelCount,
  readBadgeProgressLevels,
  type BadgeProgressLevel,
} from "../../shared/utils/badgeProgress";

type BadgeKey = "record-holder" | "golden-team" | "popular" | "fast-team";

type BadgeDefinition = {
  image: string;
  name: string;
};

const badgeDefinitions: Record<BadgeKey, BadgeDefinition> = {
  "record-holder": {
    image: "/vectors/badges/badge-bookmark.png",
    name: "رکورددار",
  },
  "golden-team": {
    image: "/vectors/badges/badge-cup.png",
    name: "تیم طلایی",
  },
  popular: {
    image: "/vectors/badges/badge-first.png",
    name: "محبوب‌ترین",
  },
  "fast-team": {
    image: "/vectors/badges/badge-chat.png",
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
  const badgesQuery = useMyBadgesQuery();
  const definition = badgeDefinitions[badgeKey];
  const badge = (badgesQuery.data ?? []).find(
    (item) => typeof item.slug === "string" && item.slug.trim().toLowerCase() === badgeKey,
  );
  const badgeName = typeof badge?.name === "string" && badge.name.trim() ? badge.name.trim() : definition.name;
  const badgeImage =
    typeof badge?.image === "string" && badge.image.trim()
      ? badge.image
      : typeof badge?.logo === "string" && badge.logo.trim()
        ? badge.logo
        : definition.image;
  const progress = badgeProgressNumber(badge?.progress);
  const metricValue = progress === null ? "—" : `${formatBadgeProgressNumber(Math.max(0, Math.min(100, progress)))}٪`;
  const levels = readBadgeProgressLevels(badge);
  const starCount = readBadgeLevelCount(badge);

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
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badgeImage} />

          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-[#0048c41f] px-3 font-semibold text-[#0048c4]">
            {badgeName}
          </Typography>

          <div className="mt-2 flex h-6 items-center justify-center [direction:ltr]">
            {[0, 1, 2].map((star) => (
              <LinearStar
                className={`h-6 w-6 ${star < starCount ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
                innerColor="currentColor"
                key={star}
              />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#1A1A1A] text-sm">پیشرفت نشان</Typography>
          <strong className="text-2xl font-medium text-[#1a1a1a]">
            {metricValue}
          </strong>
        </Typography>

        {badgesQuery.isLoading ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-[#808080]">در حال دریافت جزئیات نشان...</Typography>
        ) : levels.length > 0 ? (
          <div className="mt-4 space-y-4">
            {levels.map((level) => (
              <BadgeLevelCard key={level.title} {...level} />
            ))}
          </div>
        ) : (
          <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 mt-6 w-full rounded-2xl border border-[#f0f0f0] px-4 py-6 text-center text-[#808080]">
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
