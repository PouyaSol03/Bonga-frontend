import { AgencyTasksCard } from "./components/AgencyTasksCard";
import { AgencyQuickAccessGrid } from "./components/AgencyQuickAccessGrid";
import { AgencyBadgeBanner } from "./components/AgencyBadgeBanner";
import { AgencyCreditsCard } from "./components/AgencyCreditsCard";
import { AgencyUrgentActionsCard } from "./components/AgencyUrgentActionsCard";
import { AgencyNotificationsCard } from "./components/AgencyNotificationsCard";
import { AgencyReportsTeaserCard } from "./components/AgencyReportsTeaserCard";
import { AgencyRecentAdsCard } from "./components/AgencyRecentAdsCard";

export interface AgencyDashboardViewProps {
  onBack?: () => void;
  onViewReports: () => void;
  onNotificationsClick?: () => void;
}

export function AgencyDashboardView({
  onViewReports,
}: AgencyDashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-24 [direction:rtl]">
      {/* Main Content Sections */}
      <main className="mx-auto flex max-w-[360px] flex-col gap-3.5 px-4 pt-3">
        {/* 1. Today's Tasks */}
        <AgencyTasksCard />

        {/* 2. Quick Access Grid */}
        <AgencyQuickAccessGrid />

        {/* 3. Agency Badge Banner */}
        <AgencyBadgeBanner />

        {/* 4. Credits */}
        <AgencyCreditsCard />

        {/* 5. Urgent Actions */}
        <AgencyUrgentActionsCard />

        {/* 6. Latest Notifications */}
        <AgencyNotificationsCard />

        {/* 7. Reports & Charts Teaser */}
        <AgencyReportsTeaserCard onViewReports={onViewReports} />

        {/* 8. Recent Agency Listings */}
        <AgencyRecentAdsCard />
      </main>
    </div>
  );
}
