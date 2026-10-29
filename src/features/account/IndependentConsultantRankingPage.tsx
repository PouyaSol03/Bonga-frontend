import { useState, useEffect, useRef, type ReactNode } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import {
  useV2RankingBadgesQuery,
  useV2RankingSummaryQuery,
} from "../dashboard/api/v2/ranking-v2.hooks";
import { usePublicAgentsQuery } from "../agencies/api/agency.hooks";
import type { V2RankingBadge } from "../dashboard/api/v2/ranking-v2.service";
import { TopBar } from "../../shared/components/TopBar";
import { Link, useLocation, useSearchParams } from "react-router";
import { BADGE_IMAGES } from "../dashboard/ranking/AgencyBadgesPanel";
import { Toast, type ToastItem } from "../../shared/components/Toast";
import { getApiErrorMessage } from "../../shared/api/api";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearStar from "../../shared/icons/LinearStar";
import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearTick from "../../shared/icons/LinearTick";
import LinearActivity from "../../shared/icons/LinearActivity";
import LinearLike from "../../shared/icons/LinearLike";
import LinearCommentClock from "../../shared/icons/LinearCommentClock";
import LinearTimeQuarter from "../../shared/icons/LinearTimeQuarter";
import {
  getConsultantRankingLevel,
  formatRankingLevelTitle,
} from "../dashboard/utils/rankingLevels";

type RankIndicator = {
  icon: ReactNode;
  label: string;
  value: string;
};

type RankingPeriod = "هفته" | "ماه";

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : new Intl.NumberFormat("fa-IR").format(value);
}

export function IndependentConsultantRankingPage({
  backTo: explicitBackTo,
}: {
  backTo?: string;
} = {}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isFromDashboard =
    searchParams.get("from") === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "/account/dashboard";

  const resolvedBackTo = explicitBackTo ?? (isFromDashboard ? "/account/dashboard" : "/account");
  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const rankingQuery = useV2RankingSummaryQuery(period === "هفته" ? "week" : "month");
  const ranking = rankingQuery.data?.data;
  const workSummary = ranking?.workSummary;
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (rankingQuery.isError) {
        setToast({
          variant: "error",
          message: getApiErrorMessage(
            rankingQuery.error,
            "دریافت اطلاعات رتبه‌بندی با خطا مواجه شد.",
          ),
          title: "خطا",
        });
      } else if (rankingQuery.isSuccess && rankingQuery.data?.message) {
        setToast({
          variant: "info",
          message: rankingQuery.data.message,
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    rankingQuery.error,
    rankingQuery.isError,
    rankingQuery.isSuccess,
    rankingQuery.data?.message,
  ]);

  const indicators: RankIndicator[] = [
    {
      icon: <LinearActivity className="h-6 w-6" />,
      label: "آگهی منتشرشده",
      value: formatOptionalNumber(workSummary?.publishedAdvertises),
    },
    {
      icon: <LinearLike className="h-6 w-6" />,
      label: "آگهی ثبت‌شده",
      value: formatOptionalNumber(workSummary?.createdAdvertises),
    },
    {
      icon: <LinearCommentClock className="h-6 w-6" />,
      label: "در انتظار بررسی",
      value: formatOptionalNumber(workSummary?.pendingReview),
    },
    {
      icon: <LinearTimeQuarter className="h-6 w-6" />,
      label: "ردشده",
      value: formatOptionalNumber(workSummary?.rejected),
    },
  ];

  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearInfoCircle className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: `/account/ranking/badges/guide${isFromDashboard ? "?from=dashboard" : "?from=account"}`,
          },
        ]}
        backTo={resolvedBackTo}
        className="[&_button]:text-on-surface"
        title="نشان‌ها و رتبه"
      />

      <main className="bg-surface-container min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-4 py-4">
        {rankingQuery.isLoading ? (
          <div className="animate-pulse space-y-4 [direction:rtl]">
            <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
              <div className="bg-surface-container-high h-12 w-28 rounded" />
              <div className="bg-surface-container-high h-12 w-12 rounded-full" />
            </div>
            <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
              <div className="bg-surface-container-high h-7 w-12 rounded" />
              <div className="flex items-center gap-2 [direction:rtl]">
                <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
                <div className="bg-surface-container-high h-5 w-20 rounded" />
              </div>
            </div>
            <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
              <div className="bg-surface-container-high h-7 w-12 rounded" />
              <div className="flex items-center gap-2 [direction:rtl]">
                <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
                <div className="bg-surface-container-high h-5 w-20 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {(() => {
              const currentLevel = getConsultantRankingLevel({
                score: ranking?.current?.totalScore,
                levelTitle: ranking?.current?.levelTitle,
                levelSlug: ranking?.current?.levelSlug,
              });
              const displayLevelTitle = formatRankingLevelTitle({
                isAgency: false,
                score: ranking?.current?.totalScore,
                levelTitle: ranking?.current?.levelTitle,
                levelSlug: ranking?.current?.levelSlug,
              });
              return (
                <LevelSummaryCard
                  image={currentLevel.image}
                  levelTitle={displayLevelTitle}
                  score={formatOptionalNumber(ranking?.current?.totalScore)}
                />
              );
            })()}
            <MetricSummaryCard
              icon={<LinearRanking className="text-tertiary h-6 w-6" />}
              iconClassName="bg-tertiary-container/30"
              label="رتبه مشاور"
              value={formatOptionalNumber(ranking?.rank ?? ranking?.current?.rank)}
            />
            <MetricSummaryCard
              icon={<LinearStar className="text-warning h-6 w-6" />}
              iconClassName="bg-warning-container/30"
              label="امتیاز مشاور"
              value={formatOptionalNumber(ranking?.current?.totalScore)}
            />
          </>
        )}
        <BadgesPanel />
        <RankingIndicatorsPanel
          indicators={indicators}
          period={period}
          setPeriod={setPeriod}
          isLoading={rankingQuery.isLoading || rankingQuery.isFetching}
        />
        <TopConsultantsPanel />
      </main>
      <Toast onDismiss={() => setToast(null)} toast={toast} />
    </PageFrame>
  );
}

function LevelSummaryCard({
  image,
  levelTitle,
  score,
}: {
  image: string;
  levelTitle: string;
  score: string;
}) {
  return (
    <Link
      aria-label="سطح پیشرفت مشاور"
      className="bg-surface-container-lowest text-on-surface flex h-20 items-center justify-between rounded-2xl px-4 no-underline [direction:ltr]"
      to="/account/ranking/levels"
    >
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <GuidePill />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-sm font-medium [direction:rtl]"
          >
            {levelTitle}
          </Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end gap-1 text-xs [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline [direction:rtl]"
          >
            امتیاز فعلی
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-primary font-medium [direction:rtl]"
          >
            {score}
          </Typography>
        </div>
      </div>
      <img alt={levelTitle} className="h-12 w-12 shrink-0 object-contain" src={image} />
    </Link>
  );
}

function MetricSummaryCard({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <section
      className="bg-surface-container-lowest flex h-20 items-center justify-end gap-x-4 rounded-2xl px-4 [direction:ltr]"
      aria-label={label}
    >
      <div className="h-12 w-[232px] flex-1">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <Typography variant="title" size="medium" weight="semibold" className="text-on-surface">
            {value}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-sm font-medium [direction:rtl]"
          >
            {label}
          </Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline [direction:rtl]"
          >
            اطلاعات مقایسه‌ای از سرور دریافت نشده است
          </Typography>
        </div>
      </div>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </Typography>
    </section>
  );
}

const slugToConsultantPath: Record<string, string> = {
  file_maker: "/account/ranking/badges/file",
  file: "/account/ranking/badges/file",
  market_magnet: "/account/ranking/badges/magnet",
  magnet: "/account/ranking/badges/magnet",
  always_active: "/account/ranking/badges/time",
  time: "/account/ranking/badges/time",
  response: "/account/ranking/badges/response",
};

function BadgesPanel() {
  const { data, isError, isLoading } = useV2RankingBadgesQuery();
  const rawBadges: V2RankingBadge[] =
    data?.badges ?? data?.data ?? (Array.isArray(data) ? data : []);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="نشان‌ها">
      <SectionHeader title="نشان‌ها" />
      {isLoading ? (
        <div className="mt-6 grid animate-pulse grid-cols-2 gap-4 [direction:ltr]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="border-outline-var bg-surface-container-lowest flex h-[186px] w-full flex-col items-center rounded-lg border pt-6"
            >
              <div className="bg-surface-container-high h-[72px] w-[72px] rounded-full" />
              <div className="bg-surface-container-high mt-2 h-6 w-20 rounded" />
              <div className="bg-surface-container-high mt-2 h-3 w-14 rounded" />
              <div className="bg-surface-container-high mt-4 h-1 w-[92px] rounded-full" />
            </div>
          ))}
        </div>
      ) : null}
      {isError ? (
        <div className="text-outline py-8 text-center text-sm">خطا در دریافت نشان‌ها</div>
      ) : null}
      {!isLoading && !isError && rawBadges.length === 0 ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline m-0 mx-auto w-full py-8 text-center"
        >
          نشانی از سرور دریافت نشده است.
        </Typography>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {!isLoading &&
          !isError &&
          rawBadges.map((badge, index) => (
            <BadgeCard badge={badge} key={`${badge.slug ?? badge.id ?? index}`} />
          ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: V2RankingBadge }) {
  const isEarned = Boolean(
    badge.earned ??
    badge.is_earned ??
    (badge.level && badge.level > 0) ??
    badge.status === "earned",
  );
  const levelCount = Number(badge.level ?? (isEarned ? 1 : 0));
  const progressVal = Math.max(
    0,
    Math.min(100, Number(badge.progress ?? badge.progress_value ?? 0)),
  );
  const slug = typeof badge.slug === "string" ? badge.slug.trim().toLowerCase() : "";
  const badgeSrc = badge.src || badge.image || (slug ? BADGE_IMAGES[slug] : undefined);
  const title = badge.title || badge.label || badge.name || "نشان";
  const detailPath = slugToConsultantPath[slug] || `/account/ranking/badges/${slug || badge.id}`;

  return (
    <Link
      aria-label={`جزییات نشان ${title}`}
      className={`border-outline-var flex h-[186px] w-full flex-col items-center rounded-lg border pt-6 text-inherit no-underline transition active:scale-[0.99] ${!isEarned ? "grayscale" : ""}`}
      to={detailPath}
    >
      {badgeSrc ? (
        <img alt="" className="h-[72px] w-[72px] object-contain" src={badgeSrc} />
      ) : (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container text-outline grid h-[72px] w-[72px] place-items-center rounded-full"
        >
          <LinearStar className="h-8 w-8" />
        </Typography>
      )}
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold ${isEarned ? "bg-primary-container text-primary" : "bg-surface-container-high text-outline"}`}
      >
        {title}
      </Typography>
      <div className="mt-0.5 flex h-3 items-center justify-center">
        {[0, 1, 2].map((star) => (
          <LinearStar
            className={`h-3 w-3 ${star < levelCount ? "text-warning" : "text-outline-var"}`}
            key={star}
          />
        ))}
      </div>
      <div className="bg-warning-container/30 mt-4 h-1 w-[92px] rounded-full">
        <div className="bg-warning h-1 rounded-full" style={{ width: `${progressVal}%` }} />
      </div>
    </Link>
  );
}

function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
  isLoading = false,
}: {
  indicators: RankIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="خلاصه فعالیت">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <div ref={dropdownRef} className="relative">
          <Button
            unstyled
            className="text-on-surface inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-medium"
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <LinearArrowDown1 className="text-on-surface-var h-4 w-4" />
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="[direction:rtl]"
            >
              {period}
            </Typography>
          </Button>

          {isOpen && (
            <div
              className="border-outline-var bg-surface-container-lowest absolute top-full left-0 z-30 mt-1 min-w-[100px] rounded-lg border py-1 shadow-md [direction:rtl]"
              role="listbox"
            >
              {(["ماه", "هفته"] as const).map((opt) => {
                const isSelected = opt === period;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPeriod(opt);
                      setIsOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-right text-xs transition ${
                      isSelected
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-on-surface-var bg-transparent"
                    }`}
                  >
                    <Typography
                      variant="label"
                      size="small"
                      weight="medium"
                      className={isSelected ? "text-primary text-xs" : "text-on-surface-var text-xs"}
                    >
                      {opt}
                    </Typography>
                    {isSelected && <LinearTick className="text-primary h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base font-semibold [direction:rtl]"
        >
          خلاصه فعالیت
        </Typography>
      </div>
      <div className="mt-6 space-y-4">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-outline-var flex min-h-20 animate-pulse items-center justify-between rounded-lg border px-4 py-3 [direction:ltr]"
            >
              <div className="bg-surface-container-high h-6 w-10 rounded" />
              <div className="bg-surface-container-high h-5 w-32 rounded" />
              <div className="bg-surface-container-high h-12 w-12 rounded-2xl" />
            </div>
          ))
        ) : (
          indicators.map((indicator) => (
            <RankIndicatorRow indicator={indicator} key={indicator.label} />
          ))
        )}
      </div>
    </section>
  );
}

function RankIndicatorRow({ indicator }: { indicator: RankIndicator }) {
  return (
    <div className="border-outline-var flex h-20 items-center rounded-lg border px-4 [direction:ltr]">
      <Typography
        as="strong"
        variant="label"
        size="large"
        weight="semibold"
        className="text-primary shrink-0 [direction:rtl]"
      >
        {indicator.value}
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className="text-on-surface-var min-w-0 flex-1 px-2.5 text-right text-sm font-semibold [direction:rtl]"
      >
        {indicator.label}
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="bg-primary-container text-primary grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
      >
        {indicator.icon}
      </Typography>
    </div>
  );
}

function TopConsultantsPanel() {
  const consultantsQuery = usePublicAgentsQuery({ page: 1, perPage: 10, sort: "score" });
  const consultants = consultantsQuery.data?.data ?? [];

  return (
    <section
      className="bg-surface-container-lowest h-[509px] rounded-2xl p-4"
      aria-label="10 مشاور برتر"
    >
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-right"
      >
        10 مشاور برتر
      </Typography>
      <div className="mt-4">
        <div className="text-outline flex h-9.25 items-start pt-1 text-sm font-normal [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="w-[41px] text-center"
          >
            امتیاز
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="flex-1 text-right [direction:rtl]"
          >
            رتبه و نام مشاور
          </Typography>
        </div>
        <div className="bg-outline-var h-px" aria-hidden="true" />
        {consultantsQuery.isPending ? (
          <div className="animate-pulse space-y-2 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high/40 h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          consultants.map((consultant, index) => (
            <div
              className={`flex h-10 items-center gap-1 p-2 text-sm [direction:ltr] ${index % 2 === 1 ? "bg-surface-container rounded-lg" : ""}`}
              key={consultant.id}
            >
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="w-6.25 text-center font-medium"
              >
                {formatOptionalNumber(consultant.score)}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="flex-1 text-right font-normal [direction:rtl]"
              >
                {consultant.fullName}
              </Typography>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="w-5 text-center font-normal [direction:ltr]"
              >
                .{formatOptionalNumber(consultant.rank)}
              </Typography>
            </div>
          ))
        )}
        {!consultantsQuery.isPending && consultants.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline m-0 mx-auto w-full py-6 text-center"
          >
            اطلاعات مشاوران برتر از سرور دریافت نشده است.
          </Typography>
        ) : null}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex h-6 items-center justify-between [direction:ltr]">
      <GuidePill to="/account/ranking/badges/guide" />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-base leading-6 font-semibold [direction:rtl]"
      >
        {title}
      </Typography>
    </div>
  );
}

function GuidePill({ to }: { to?: string } = {}) {
  const className =
    "inline-flex px-2 py-1 items-center gap-1 rounded-full bg-primary-container text-primary no-underline [direction:ltr]";
  const content = (
    <>
      <Typography
        as="span"
        variant="label"
        size="small"
        weight="medium"
        className="[direction:rtl]"
      >
        راهنما
      </Typography>
      <LinearInfoCircle className="h-4 w-4" />
    </>
  );

  if (to) {
    return (
      <Link aria-label="راهنمای نشان‌ها" className={className} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular" className={className}>
      {content}
    </Typography>
  );
}
