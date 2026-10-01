import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowRight1 from "../../../shared/icons/LinearArrowRight1";
import LinearNotification from "../../../shared/icons/LinearNotification";
import { AgentTasksCard } from "./components/AgentTasksCard";
import { AgentQuickAccessGrid } from "./components/AgentQuickAccessGrid";
import { AgentBadgeBanner } from "./components/AgentBadgeBanner";
import { AgentCreditsCard } from "./components/AgentCreditsCard";
import { AgentUrgentActionsCard } from "./components/AgentUrgentActionsCard";
import { AgentNotificationsCard } from "./components/AgentNotificationsCard";
import { AgentReportsTeaserCard } from "./components/AgentReportsTeaserCard";
import { AgentRecentAdsCard } from "./components/AgentRecentAdsCard";
import type { AgentRoleType } from "./types";

export interface AgentDashboardViewProps {
  role?: AgentRoleType;
  onBack?: () => void;
  onViewReports: () => void;
  onNotificationsClick?: () => void;
}

export function AgentDashboardView({
  role = "REAL_ESTATE_CONSULTANT",
  onBack,
  onViewReports,
  onNotificationsClick,
}: AgentDashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-24 [direction:rtl]">
      {/* TopBar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#F0F0F0] px-4">
        {/* Right side: Back arrow + Title */}
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              aria-label="بازگشت"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1A] transition hover:bg-black/5 active:scale-95 cursor-pointer border-none bg-transparent"
              onClick={onBack}
              type="button"
            >
              <LinearArrowRight1 className="h-5 w-5" />
            </button>
          ) : (
            <RouteLink
              aria-label="بازگشت"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1A] transition hover:bg-black/5 active:scale-95 no-underline"
              to="/account"
            >
              <LinearArrowRight1 className="h-5 w-5" />
            </RouteLink>
          )}
          <h1 className="text-[16px] font-bold text-[#1A1A1A]">داشبورد</h1>
        </div>

        {/* Left side: Notification bell */}
        <button
          aria-label="اعلان‌ها"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1A] transition hover:bg-black/5 active:scale-95 cursor-pointer border-none bg-transparent"
          onClick={onNotificationsClick}
          type="button"
        >
          <LinearNotification className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#F0F0F0]" />
        </button>
      </header>

      {/* Main Content Sections */}
      <main className="mx-auto flex max-w-[360px] flex-col gap-3.5 px-4 pt-1">
        {/* 1. Tasks Gradient Card */}
        <AgentTasksCard role={role} />

        {/* 2. Quick Access Row */}
        <AgentQuickAccessGrid role={role} />

        {/* 3. Badge Banner */}
        <AgentBadgeBanner />

        {/* 4. Credits Card */}
        <AgentCreditsCard />

        {/* 5. Urgent Actions */}
        <AgentUrgentActionsCard />

        {/* 6. Notifications */}
        <AgentNotificationsCard />

        {/* 7. Reports Teaser */}
        <AgentReportsTeaserCard onViewReports={onViewReports} />

        {/* 8. Recent Ads Card */}
        <AgentRecentAdsCard />
      </main>
    </div>
  );
}
