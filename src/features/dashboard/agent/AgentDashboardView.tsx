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
  onViewReports,
}: AgentDashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-24 [direction:rtl]">
      {/* Main Content Sections */}
      <main className="mx-auto flex max-w-[360px] flex-col gap-3.5 px-4 pt-3">
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
