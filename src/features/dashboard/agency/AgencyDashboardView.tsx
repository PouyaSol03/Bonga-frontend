import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowRight1 from "../../../shared/icons/LinearArrowRight1";
import LinearNotification from "../../../shared/icons/LinearNotification";
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
  onBack,
  onViewReports,
  onNotificationsClick,
}: AgencyDashboardViewProps) {
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
