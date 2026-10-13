import { useEffect, useMemo } from "react";
import { DashboardTasksCard, type DashboardTaskItem } from "./DashboardTasksCard";
import { DashboardQuickAccessGrid, type DashboardRole } from "./DashboardQuickAccessGrid";
import { DashboardBadgeBanner } from "./DashboardBadgeBanner";
import { DashboardCreditsCard, type DashboardCreditItem } from "./DashboardCreditsCard";
import { DashboardUrgentActionsCard } from "./DashboardUrgentActionsCard";
import { DashboardNotificationsCard } from "./DashboardNotificationsCard";
import { DashboardReportsTeaserCard } from "./DashboardReportsTeaserCard";
import { DashboardRecentAdsCard } from "./DashboardRecentAdsCard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { useNavigate } from "react-router";
import { isForbiddenApiError } from "../../../shared/api/api";
import type { DashboardOverview, DashboardRolePersona } from "../api/dashboard.service";
import {
  useDashboardTasksQuery,
  useDashboardUrgentActionsQuery,
  useDashboardRankingBadgeQuery,
  useDashboardCreditsQuery,
  useDashboardNotificationsQuery,
  useDashboardReportsTeaserQuery,
  useDashboardRecentAdsQuery,
} from "../api/dashboard.hooks";
import { toPersianNumber } from "../../../shared/lib/numberUtils";
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
  const navigate = useNavigate();
  const isManager = role === "REAL_ESTATE_MANAGER";
  const isAgencyConsultant =
    role === "REAL_ESTATE_CONSULTANT" || (role as string) === "agency-consultant";
  const isAssigned = isAgencyConsultant;
  const persona: DashboardRolePersona = isManager
    ? "agency"
    : isAgencyConsultant
      ? "agent_in_agency"
      : "agent";

  // Dashboard API Contract Queries (dashboard-api-contract.md)
  const tasksQuery = useDashboardTasksQuery(persona);
  const urgentActionsQuery = useDashboardUrgentActionsQuery(persona);
  const rankingBadgeQuery = useDashboardRankingBadgeQuery(persona);
  const creditsQuery = useDashboardCreditsQuery(persona);
  const notificationsQuery = useDashboardNotificationsQuery(persona);
  const reportsTeaserQuery = useDashboardReportsTeaserQuery(persona);
  const recentAdsApiQuery = useDashboardRecentAdsQuery(persona, 5);

  useEffect(() => {
    const errors = [
      tasksQuery.error,
      urgentActionsQuery.error,
      rankingBadgeQuery.error,
      creditsQuery.error,
      notificationsQuery.error,
      reportsTeaserQuery.error,
      recentAdsApiQuery.error,
    ];
    if (errors.some(isForbiddenApiError)) {
      navigate("/403", { replace: true });
    }
  }, [
    tasksQuery.error,
    urgentActionsQuery.error,
    rankingBadgeQuery.error,
    creditsQuery.error,
    notificationsQuery.error,
    reportsTeaserQuery.error,
    recentAdsApiQuery.error,
  ]);

  const recentAds = useMemo(() => {
    if (Array.isArray(recentAdsApiQuery.data) && recentAdsApiQuery.data.length > 0) {
      return recentAdsApiQuery.data;
    }
    return [];
  }, [recentAdsApiQuery.data]);

  const notificationItems = useMemo(() => {
    const notifs = notificationsQuery.data;
    if (!notifs) return undefined;
    const list =
      notifs.items && notifs.items.length > 0
        ? notifs.items
        : notifs.latest
          ? [notifs.latest]
          : [];
    return list.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.message,
      created_at: item.createdAt,
      is_read: item.isRead,
      category: "systems" as const,
    }));
  }, [notificationsQuery.data]);

  const taskItems: DashboardTaskItem[] | undefined =
    tasksQuery.data?.items && tasksQuery.data.items.length > 0
      ? tasksQuery.data.items
      : dashboard?.tasks
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

  const totalTasks =
    tasksQuery.data?.totalCount ??
    (dashboard?.tasks
      ? dashboard.tasks.reduce((sum, item) => sum + item.count, 0)
      : dashboard?.workSummary
        ? dashboard.workSummary.pendingReview +
          dashboard.workSummary.publishedAdvertises +
          dashboard.workSummary.rejected
        : undefined);

  const activeBalances = creditsQuery.data?.balances ?? dashboard?.balances;
  const activeDeltas = creditsQuery.data?.balanceDeltas ?? dashboard?.balanceDeltas;

  const fallbackCredits: DashboardCreditItem[] | undefined = isAgencyConsultant
    ? [
        { key: "ads", label: "آگهی", value: 34, deltaText: "۲۴%", isPositive: true, type: "ad" },
        { key: "updates", label: "بروزرسانی", value: 13, deltaText: "۵%", isPositive: true, type: "refresh" },
        { key: "specials", label: "ویژه", value: 9, deltaText: "۱۶%", isNegative: true, type: "special" },
      ]
    : undefined;

  const creditItems: DashboardCreditItem[] | undefined = activeBalances
    ? [
        {
          key: "ads",
          label: "آگهی",
          value: activeBalances.adCreditBalance,
          deltaText: activeDeltas ? `${toPersianNumber(activeDeltas.adCreditUsed.change)}%` : "",
          isPositive: activeDeltas ? activeDeltas.adCreditUsed.change >= 0 : undefined,
          type: "ad",
        },
        {
          key: "updates",
          label: "بروزرسانی",
          value: activeBalances.renewCreditBalance,
          deltaText: activeDeltas ? `${toPersianNumber(activeDeltas.renewCreditUsed.change)}%` : "",
          isPositive: activeDeltas ? activeDeltas.renewCreditUsed.change >= 0 : undefined,
          type: "refresh",
        },
        {
          key: "specials",
          label: "ویژه",
          value: activeBalances.specialCreditBalance,
          deltaText: activeDeltas ? `${toPersianNumber(activeDeltas.specialCreditUsed.change)}%` : "",
          isNegative: activeDeltas ? activeDeltas.specialCreditUsed.change < 0 : undefined,
          type: "special",
        },
        ...(!isAgencyConsultant
          ? [
              {
                key: "expiry" as const,
                label: "اعتبار",
                value: activeBalances.panelDaysRemaining,
                deltaText: "روز",
                type: "expiry" as const,
              },
            ]
          : []),
      ]
    : fallbackCredits;

  const rawLevel =
    rankingBadgeQuery.data?.badgeTitle ??
    dashboard?.ranking?.current?.levelTitle ??
    dashboard?.ranking?.current?.levelSlug;
  const levelTitle = rawLevel
    ? LEVEL_TITLE_MAP[rawLevel.toLowerCase()] || rawLevel
    : undefined;
  const currentScore = rankingBadgeQuery.data?.currentScore ?? dashboard?.ranking?.current?.totalScore;
  const levelSlug = rankingBadgeQuery.data?.levelSlug ?? dashboard?.ranking?.current?.levelSlug;
  const levelAsset = isManager
    ? getAgencyRankingLevel({
        score: currentScore,
        levelTitle,
        levelSlug,
      })
    : getConsultantRankingLevel({
        score: currentScore,
        levelTitle,
        levelSlug,
      });

  const displayBadgeName = rankingBadgeQuery.data?.badgeTitle || formatRankingLevelTitle({
    isAgency: isManager,
    score: currentScore,
    levelTitle,
    levelSlug,
  });

  const urgentActions =
    urgentActionsQuery.data && urgentActionsQuery.data.length > 0
      ? urgentActionsQuery.data
      : dashboard?.urgentActions ?? [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
          categoryLabel={rankingBadgeQuery.data?.categoryLabel || (isManager ? "سطح آژانس" : "سطح مشاور")}
          badgeName={displayBadgeName}
          imageSrc={levelAsset.image}
          to={
            rankingBadgeQuery.data?.targetUrl ||
            (isManager ? "/account/dashboard/ranking" : "/account/ranking")
          }
        />

        {/* 4. Credits Card */}
        <DashboardCreditsCard items={creditItems} />

        {/* 5. Urgent Actions */}
        <DashboardUrgentActionsCard items={urgentActions} />

        {/* 6. Notifications */}
        <DashboardNotificationsCard items={notificationItems} />

        {/* 7. Reports Teaser */}
        <DashboardReportsTeaserCard
          onViewReports={onViewReports}
          subtitle={
            reportsTeaserQuery.data?.totalViews
              ? `${toPersianNumber(reportsTeaserQuery.data.totalViews)} بازدید در این ماه`
              : "تحلیل عملکرد آگهی‌ها و مشاورین"
          }
        />

        {/* 8. Recent Ads Card */}
        <DashboardRecentAdsCard
          ads={recentAds as any}
          isLoading={recentAdsApiQuery.isLoading}
        />
      </main>
    </div>
  );
}
