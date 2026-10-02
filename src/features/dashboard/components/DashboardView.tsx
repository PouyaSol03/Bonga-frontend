import { useMemo } from "react";
import { DashboardTasksCard, type DashboardTaskItem } from "./DashboardTasksCard";
import { DashboardQuickAccessGrid, type DashboardRole } from "./DashboardQuickAccessGrid";
import { DashboardBadgeBanner } from "./DashboardBadgeBanner";
import { DashboardCreditsCard, type DashboardCreditItem } from "./DashboardCreditsCard";
import { DashboardUrgentActionsCard } from "./DashboardUrgentActionsCard";
import { DashboardNotificationsCard } from "./DashboardNotificationsCard";
import { DashboardReportsTeaserCard } from "./DashboardReportsTeaserCard";
import { DashboardRecentAdsCard } from "./DashboardRecentAdsCard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import type { DashboardOverview } from "../api/dashboard.service";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
import { useMyAdsInfiniteQuery } from "../../account/api/account.hooks";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import {
  getAgencyRankingLevel,
  getConsultantRankingLevel,
  formatRankingLevelTitle,
} from "../utils/rankingLevels";

export interface DashboardViewProps {
  role?: DashboardRole;
  dashboard?: DashboardOverview | null;
  isLoading?: boolean;
  onBack?: () => void;
  onViewReports: () => void;
  onNotificationsClick?: () => void;
}

const LEVEL_TITLE_MAP: Record<string, string> = {
  newbie: "تازه‌کار",
  active: "فعال",
  very_active: "پویا",
  top_one: "برتر منطقه",
  legendery: "افسانه‌ای",
  legendary: "افسانه‌ای",
};

export function DashboardView({
  role = "REAL_ESTATE_CONSULTANT",
  dashboard,
  isLoading = false,
  onViewReports,
}: DashboardViewProps) {
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  const isManager = role === "REAL_ESTATE_MANAGER";
  const isAssigned = role === "REAL_ESTATE_CONSULTANT";

  const adsQuery = useMyAdsInfiniteQuery({
    perPage: 5,
    type: "active",
  });

  const recentAds = useMemo(() => {
    const pages = adsQuery.data?.pages ?? [];
    const firstPageAds = pages[0]?.data ?? [];
    return firstPageAds.slice(0, 5).map((item, idx) => mapAdvertisementToAdCard(item, idx));
  }, [adsQuery.data]);

  const taskItems: DashboardTaskItem[] | undefined = dashboard?.tasks
    ? dashboard.tasks
    : dashboard?.workSummary
      ? [
          {
            id: "pendingReview",
            count: dashboard.workSummary.pendingReview,
            label: "در انتظار بررسی",
            to: "/account/manage-ads",
          },
          {
            id: "publishedAdvertises",
            count: dashboard.workSummary.publishedAdvertises,
            label: isAssigned ? "آگهی تخصیصی" : "آگهی تخصصی",
            to: "/account/manage-ads",
          },
          {
            id: "rejected",
            count: dashboard.workSummary.rejected,
            label: "رد شده",
            to: "/account/manage-ads",
          },
          {
            id: "createdAdvertises",
            count: dashboard.workSummary.createdAdvertises,
            label: "کل آگهی‌های ثبت شده",
            to: "/account/manage-ads",
          },
        ]
      : undefined;

  const totalTasks = dashboard?.tasks
    ? dashboard.tasks.reduce((sum, item) => sum + item.count, 0)
    : dashboard?.workSummary
      ? dashboard.workSummary.pendingReview +
        dashboard.workSummary.publishedAdvertises +
        dashboard.workSummary.rejected
      : undefined;

  const creditItems: DashboardCreditItem[] | undefined = dashboard?.balances
    ? [
        {
          key: "ads",
          label: "آگهی",
          value: dashboard.balances.adCreditBalance,
          deltaText: `${toPersianNumber(dashboard.balanceDeltas.adCreditUsed.change)}%`,
          isPositive: dashboard.balanceDeltas.adCreditUsed.change >= 0,
          type: "ad",
        },
        {
          key: "updates",
          label: "بروزرسانی",
          value: dashboard.balances.renewCreditBalance,
          deltaText: `${toPersianNumber(dashboard.balanceDeltas.renewCreditUsed.change)}%`,
          isPositive: dashboard.balanceDeltas.renewCreditUsed.change >= 0,
          type: "refresh",
        },
        {
          key: "specials",
          label: "ویژه",
          value: dashboard.balances.specialCreditBalance,
          deltaText: `${toPersianNumber(dashboard.balanceDeltas.specialCreditUsed.change)}%`,
          isNegative: dashboard.balanceDeltas.specialCreditUsed.change < 0,
          type: "special",
        },
        {
          key: "expiry",
          label: "اعتبار",
          value: dashboard.balances.panelDaysRemaining,
          deltaText: "روز",
          type: "expiry",
        },
      ]
    : undefined;

  const rawLevel =
    dashboard?.ranking?.current?.levelTitle ||
    dashboard?.ranking?.current?.levelSlug;
  const levelTitle = rawLevel
    ? LEVEL_TITLE_MAP[rawLevel.toLowerCase()] || rawLevel
    : undefined;
  const currentScore = dashboard?.ranking?.current?.totalScore;
  const levelAsset = isManager
    ? getAgencyRankingLevel({
        score: currentScore,
        levelTitle,
        levelSlug: dashboard?.ranking?.current?.levelSlug,
      })
    : getConsultantRankingLevel({
        score: currentScore,
        levelTitle,
        levelSlug: dashboard?.ranking?.current?.levelSlug,
      });

  const displayBadgeName = formatRankingLevelTitle({
    isAgency: isManager,
    score: currentScore,
    levelTitle,
    levelSlug: dashboard?.ranking?.current?.levelSlug,
  });

  return (
    <div className="min-h-full bg-surface-container pb-6 [direction:rtl]">
      {/* Main Content Sections - Agent Dashboard UI Layout */}
      <main className="mx-auto flex flex-col gap-3.5 px-4 pt-3">
        {/* 1. Tasks Gradient Card */}
        <DashboardTasksCard
          role={role}
          items={taskItems}
          totalCount={totalTasks}
        />

        {/* 2. Quick Access Row */}
        <DashboardQuickAccessGrid role={role} />

        {/* 3. Badge Banner */}
        <DashboardBadgeBanner
          categoryLabel={isManager ? "سطح آژانس" : "سطح مشاور"}
          badgeName={displayBadgeName}
          imageSrc={levelAsset.image}
          to={isManager ? "/account/dashboard/ranking" : "/account/ranking"}
        />

        {/* 4. Credits Card */}
        <DashboardCreditsCard items={creditItems} />

        {/* 5. Urgent Actions */}
        <DashboardUrgentActionsCard items={dashboard?.urgentActions ?? []} />

        {/* 6. Notifications */}
        <DashboardNotificationsCard />

        {/* 7. Reports Teaser */}
        <DashboardReportsTeaserCard onViewReports={onViewReports} />

        {/* 8. Recent Ads Card */}
        <DashboardRecentAdsCard
          ads={recentAds}
          isLoading={adsQuery.isLoading}
        />
      </main>
    </div>
  );
}
