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
import { replaceRoute } from "../../../shared/navigation/navigation";
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
  const isManager = role === "REAL_ESTATE_MANAGER";
  const isAssigned = role === "REAL_ESTATE_CONSULTANT";
  const persona: DashboardRolePersona = isManager
    ? "agency"
    : role === "REAL_ESTATE_CONSULTANT"
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
      replaceRoute("/403", undefined, { rememberCurrent: false });
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
      return recentAdsApiQuery.data.map((item, idx) => {
        const depositText =
          item.depositAmount != null
            ? `${toPersianNumber(item.depositAmount)} تومان ودیعه`
            : "";
        const rentText =
          item.rentAmount != null
            ? `${toPersianNumber(item.rentAmount)} تومان اجاره`
            : "";
        const locationText = [item.cityTitle, item.districtTitle]
          .filter(Boolean)
          .join("، ");

        return {
          id: item.id,
          title: item.title || "آگهی بدون عنوان",
          agency: "",
          status: item.status || "",
          imageCount: item.coverImage ? "1" : "0",
          imageUrl: item.coverImage || undefined,
          imageClassName: item.coverImage ? "" : `ad-card__image--${(idx % 4) + 1}`,
          priceLabelPrimary: rentText ? "ودیعه:" : depositText ? "قیمت:" : "",
          pricePrimary: depositText || "",
          priceLabelSecondary: rentText ? "اجاره:" : "",
          priceSecondary: rentText || "",
          timeAndLocation: locationText,
          badges: [],
          category: item.categoryTitle || "",
        };
      });
    }
    return [];
  }, [recentAdsApiQuery.data]);

  const notificationItems = useMemo(() => {
    if (
      notificationsQuery.data?.items &&
      Array.isArray(notificationsQuery.data.items) &&
      notificationsQuery.data.items.length > 0
    ) {
      return notificationsQuery.data.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.message,
        created_at: item.createdAt,
        is_read: item.isRead,
        category: "systems" as const,
      }));
    }
    return undefined;
  }, [notificationsQuery.data?.items]);

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
        {
          key: "expiry",
          label: "اعتبار",
          value: activeBalances.panelDaysRemaining,
          deltaText: "روز",
          type: "expiry",
        },
      ]
    : undefined;

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
